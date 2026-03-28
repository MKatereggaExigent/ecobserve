import { Request, Response } from 'express';
import chatbotService from '../services/chatbot.service';
import logger from '../utils/logger';

/**
 * Get conversation history for current user
 */
export async function getConversationHistory(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const organizationId = req.user?.organizationId;

    if (!userId || !organizationId) {
      res.status(400).json({ error: 'User and organization required' });
      return;
    }

    const conversation = await chatbotService.getConversation(userId, organizationId);

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error: any) {
    logger.error('Failed to get conversation history', { error: error.message });
    res.status(500).json({ error: 'Failed to retrieve conversation history' });
  }
}

/**
 * Send a chat message
 */
export async function sendMessage(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const organizationId = req.user?.organizationId;
    const { message } = req.body;

    if (!userId || !organizationId) {
      res.status(400).json({ error: 'User and organization required' });
      return;
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Get the response from chatbot service
    const response = await chatbotService.sendMessage(userId, organizationId, message.trim());

    res.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    logger.error('Chat message failed', { error: error.message });
    res.status(500).json({ error: 'Failed to send message' });
  }
}

/**
 * Clear conversation history
 */
export async function clearConversation(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const organizationId = req.user?.organizationId;

    if (!userId || !organizationId) {
      res.status(400).json({ error: 'User and organization required' });
      return;
    }

    await chatbotService.clearConversation(userId, organizationId);

    res.json({
      success: true,
      message: 'Conversation cleared successfully',
    });
  } catch (error: any) {
    logger.error('Failed to clear conversation', { error: error.message });
    res.status(500).json({ error: 'Failed to clear conversation' });
  }
}

/**
 * Get suggested questions
 */
export async function getSuggestedQuestions(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    const organizationId = req.user?.organizationId;

    if (!userId || !organizationId) {
      res.status(400).json({ error: 'User and organization required' });
      return;
    }

    const questions = await chatbotService.getSuggestedQuestions(userId, organizationId);

    res.json({
      success: true,
      data: questions,
    });
  } catch (error: any) {
    logger.error('Failed to get suggested questions', { error: error.message });
    res.status(500).json({ error: 'Failed to get suggested questions' });
  }
}

