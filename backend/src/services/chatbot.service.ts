import openaiService from './openai.service';
import { pool } from '../config/database';
import logger from '../utils/logger';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatContext {
  user_id: string;
  organization_id: string;
  event_summary?: {
    total_events: number;
    total_carbon: number;
    average_carbon_per_event: number;
    top_categories: string[];
  };
  recent_events?: Array<{
    name: string;
    date: string;
    carbon_footprint: number;
    attendees: number;
  }>;
}

interface Conversation {
  id: string;
  messages: ChatMessage[];
  started_at: string;
  last_message_at: string;
}

class ChatbotService {
  private readonly SYSTEM_PROMPT = `
You are EcoBot, an intelligent sustainability assistant for EcobServe, a platform for sustainable event management.

CRITICAL FORMATTING RULES:
- DO NOT use markdown formatting (**, *, #, etc.)
- Use plain text with line breaks for readability
- Use bullet points with • or - (not asterisks)
- Use numbers for ordered lists (1., 2., 3.)
- Keep responses conversational and natural, like ChatGPT
- Break long responses into short paragraphs with blank lines between them

Your role:
- Help users understand their carbon footprint and sustainability metrics
- Provide actionable recommendations for reducing event emissions
- Answer questions about UN SDGs, green energy, and eco-friendly practices
- Guide users through the platform features
- Offer industry insights and benchmarking data

Privacy & Security Rules:
- NEVER share data from other users or organizations
- ONLY reference the current user's own event data
- Do not reveal sensitive business information
- If asked about other users/organizations, politely decline
- Keep responses professional and focused on sustainability

Tone: Friendly, knowledgeable, encouraging, and action-oriented.
`;

  /**
   * Get user's event context (privacy-safe)
   */
  private async getUserContext(userId: string, organizationId: string): Promise<ChatContext> {
    try {
      // Get event summary for this user's organization only
      const summaryResult = await pool.query(`
        SELECT 
          COUNT(*) as total_events,
          COALESCE(SUM(total_carbon), 0) as total_carbon,
          COALESCE(AVG(total_carbon), 0) as average_carbon_per_event,
          ARRAY_AGG(DISTINCT event_type) FILTER (WHERE event_type IS NOT NULL) as top_categories
        FROM events
        WHERE organization_id = $1
          AND deleted_at IS NULL
      `, [organizationId]);

      // Get recent events (last 5)
      const recentResult = await pool.query(`
        SELECT
          name,
          COALESCE(event_date, start_date) as date,
          COALESCE(total_carbon, 0) as carbon_footprint,
          COALESCE(attendees, attendee_count, 0) as attendees
        FROM events
        WHERE organization_id = $1
          AND deleted_at IS NULL
        ORDER BY created_at DESC
        LIMIT 5
      `, [organizationId]);

      return {
        user_id: userId,
        organization_id: organizationId,
        event_summary: summaryResult.rows[0] || undefined,
        recent_events: recentResult.rows || undefined,
      };
    } catch (error: any) {
      logger.error('Failed to get user context for chatbot', { error: error.message });
      return {
        user_id: userId,
        organization_id: organizationId,
      };
    }
  }

  /**
   * Sanitize user data to prevent leaking sensitive information
   */
  private sanitizeContext(context: ChatContext): string {
    if (!context.event_summary) {
      return 'The user is new and has not created any events yet.';
    }

    return `
User's Event Summary (PRIVATE - only for this user):
- Total Events: ${context.event_summary.total_events}
- Total Carbon Footprint: ${Math.round(context.event_summary.total_carbon)} kg CO2e
- Average per Event: ${Math.round(context.event_summary.average_carbon_per_event)} kg CO2e
- Event Categories: ${context.event_summary.top_categories?.join(', ') || 'None'}

Recent Events:
${context.recent_events?.map(e =>
  `- ${e.name} (${e.date}): ${Math.round(e.carbon_footprint)} kg CO2e, ${e.attendees} attendees`
).join('\n') || 'No recent events'}
`;
  }

  /**
   * Strip markdown formatting from text to ensure clean, readable output
   */
  private stripMarkdown(text: string): string {
    // Remove bold/italic markers but keep the text
    let cleaned = text
      .replace(/\*\*\*(.+?)\*\*\*/g, '$1') // Remove bold+italic ***text***
      .replace(/\*\*(.+?)\*\*/g, '$1')     // Remove bold **text**
      .replace(/\*(.+?)\*/g, '$1')         // Remove italic *text*
      .replace(/__(.+?)__/g, '$1')         // Remove bold __text__
      .replace(/_(.+?)_/g, '$1')           // Remove italic _text_
      .replace(/~~(.+?)~~/g, '$1')         // Remove strikethrough ~~text~~
      .replace(/`(.+?)`/g, '$1')           // Remove inline code `text`
      .replace(/^#+\s+/gm, '')             // Remove heading markers # ## ###
      .replace(/^\s*[-*+]\s+/gm, '• ')     // Convert list markers to bullets
      .replace(/^\s*\d+\.\s+/gm, (match) => match) // Keep numbered lists
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')  // Remove links [text](url) -> text
      .replace(/!\[.*?\]\(.+?\)/g, '')     // Remove images
      .replace(/^\s*>\s+/gm, '')           // Remove blockquote markers
      .replace(/```[\s\S]*?```/g, '')      // Remove code blocks
      .trim();

    return cleaned;
  }

  /**
   * Send a message and persist conversation
   */
  async sendMessage(
    userId: string,
    organizationId: string,
    message: string
  ): Promise<{ message: string; timestamp: string; conversationId: string }> {
    try {
      // Get or create conversation
      let conversation = await this.getConversation(userId, organizationId);

      if (!conversation) {
        conversation = await this.createConversation(userId, organizationId);
      }

      // Add user message to conversation
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };

      conversation.messages.push(userMessage);

      // Get user context
      const context = await this.getUserContext(userId, organizationId);
      const contextString = this.sanitizeContext(context);

      // Build messages for OpenAI
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: this.SYSTEM_PROMPT },
        { role: 'system', content: `User Context:\n${contextString}` },
      ];

      // Add conversation history (last 10 messages)
      const recentHistory = conversation.messages.slice(-10);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }

      // Get response from OpenAI
      let aiResponse = await openaiService.chat(messages, {
        temperature: 0.7,
        maxTokens: 1000,
      });

      // Strip markdown formatting to ensure clean, readable text
      aiResponse = this.stripMarkdown(aiResponse);

      // Add AI response to conversation
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      conversation.messages.push(assistantMessage);

      // Save updated conversation
      await this.saveConversation(conversation.id, userId, organizationId, conversation.messages);

      logger.info('Chatbot message sent', {
        userId,
        organizationId,
        conversationId: conversation.id,
        messageLength: message.length,
        responseLength: aiResponse.length,
      });

      return {
        message: aiResponse,
        timestamp: assistantMessage.timestamp,
        conversationId: conversation.id,
      };
    } catch (error: any) {
      logger.error('Chatbot sendMessage failed', { error: error.message });
      throw new Error('Failed to send message');
    }
  }

  /**
   * Get conversation for a user
   */
  async getConversation(userId: string, organizationId: string): Promise<Conversation | null> {
    try {
      const result = await pool.query(
        `SELECT id, messages, started_at, last_message_at
         FROM chatbot_conversations
         WHERE user_id = $1 AND organization_id = $2 AND is_active = true
         ORDER BY last_message_at DESC
         LIMIT 1`,
        [userId, organizationId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        messages: row.messages || [],
        started_at: row.started_at,
        last_message_at: row.last_message_at,
      };
    } catch (error: any) {
      logger.error('Failed to get conversation', { error: error.message });
      return null;
    }
  }

  /**
   * Create new conversation
   */
  private async createConversation(userId: string, organizationId: string): Promise<Conversation> {
    try {
      const result = await pool.query(
        `INSERT INTO chatbot_conversations (user_id, organization_id, messages, started_at, last_message_at)
         VALUES ($1, $2, $3, NOW(), NOW())
         RETURNING id, messages, started_at, last_message_at`,
        [userId, organizationId, JSON.stringify([])]
      );

      const row = result.rows[0];
      return {
        id: row.id,
        messages: [],
        started_at: row.started_at,
        last_message_at: row.last_message_at,
      };
    } catch (error: any) {
      logger.error('Failed to create conversation', { error: error.message });
      throw new Error('Failed to create conversation');
    }
  }

  /**
   * Save conversation to database
   */
  private async saveConversation(
    conversationId: string,
    userId: string,
    organizationId: string,
    messages: ChatMessage[]
  ): Promise<void> {
    try {
      await pool.query(
        `UPDATE chatbot_conversations
         SET messages = $1, last_message_at = NOW()
         WHERE id = $2 AND user_id = $3 AND organization_id = $4`,
        [JSON.stringify(messages), conversationId, userId, organizationId]
      );
    } catch (error: any) {
      logger.error('Failed to save conversation', { error: error.message });
      throw new Error('Failed to save conversation');
    }
  }

  /**
   * Clear conversation for a user
   */
  async clearConversation(userId: string, organizationId: string): Promise<void> {
    try {
      await pool.query(
        `UPDATE chatbot_conversations
         SET is_active = false
         WHERE user_id = $1 AND organization_id = $2`,
        [userId, organizationId]
      );

      logger.info('Conversation cleared', { userId, organizationId });
    } catch (error: any) {
      logger.error('Failed to clear conversation', { error: error.message });
      throw new Error('Failed to clear conversation');
    }
  }

  /**
   * Get suggested questions based on user context
   */
  async getSuggestedQuestions(userId: string, organizationId: string): Promise<string[]> {
    const context = await this.getUserContext(userId, organizationId);

    const baseQuestions = [
      'How can I reduce my event\'s carbon footprint?',
      'What are the UN SDGs and how does my event align with them?',
      'Show me industry benchmarks for my events',
      'What funding opportunities are available for sustainable events?',
    ];

    if (context.event_summary && context.event_summary.total_events > 0) {
      return [
        'How do my events compare to industry standards?',
        'What are my biggest sources of emissions?',
        'Give me specific recommendations for my next event',
        ...baseQuestions.slice(1),
      ];
    }

    return baseQuestions;
  }
}

export default new ChatbotService();

