import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Leaf, Bot, User, Sparkles, Lock, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api, isAuthenticated } from '@/services/api';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const { isAuthenticated: authCheck, canAccessFeature, subscriptionTier } = useAuth();
  const navigate = useNavigate();

  // Check if user has access to AI chatbot (Impact Leader tier required)
  const hasAccess = authCheck && canAccessFeature('impact');

  // Load conversation history and suggested questions when component mounts
  useEffect(() => {
    if (hasAccess && isOpen) {
      loadConversationHistory();
      loadSuggestedQuestions();
    }
  }, [hasAccess, isOpen]);

  // Load conversation history from database
  const loadConversationHistory = async () => {
    try {
      const result = await api.get<{ data: { messages: Message[] } }>('/impact-leader/chat/history');
      if (result.data && result.data.data && result.data.data.messages) {
        const historyMessages = result.data.data.messages.map((msg: any, index: number) => ({
          id: index,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
        }));

        if (historyMessages.length > 0) {
          setMessages(historyMessages);
        } else {
          // Show welcome message if no history
          setMessages([{
            id: 0,
            role: 'assistant',
            content: "Hi! I'm EcoBot, your AI-powered sustainability assistant. 🌿\n\nI can help you with:\n• Carbon reduction strategies tailored to your events\n• Industry benchmarks and comparisons\n• UN SDG alignment analysis\n• Funding opportunities for sustainable practices\n• Actionable recommendations based on your data\n\nWhat would you like to know?",
            timestamp: new Date().toISOString(),
          }]);
        }
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      // Show welcome message on error
      setMessages([{
        id: 0,
        role: 'assistant',
        content: "Hi! I'm EcoBot, your AI-powered sustainability assistant. 🌿\n\nI can help you with:\n• Carbon reduction strategies tailored to your events\n• Industry benchmarks and comparisons\n• UN SDG alignment analysis\n• Funding opportunities for sustainable practices\n• Actionable recommendations based on your data\n\nWhat would you like to know?",
        timestamp: new Date().toISOString(),
      }]);
    }
  };

  // Load suggested questions from backend
  const loadSuggestedQuestions = async () => {
    try {
      const result = await api.get<{ data: string[] }>('/impact-leader/chat/suggestions');
      if (result.data) {
        setSuggestedQuestions(result.data.data);
      }
    } catch (error) {
      console.error('Failed to load suggested questions:', error);
      // Fallback questions
      setSuggestedQuestions([
        'How can I reduce my event\'s carbon footprint?',
        'What are the UN SDGs and how does my event align with them?',
        'Show me industry benchmarks for my events',
        'What funding opportunities are available for sustainable events?',
      ]);
    }
  };

  // Send message to GPT-4 via backend
  const handleSend = async (text?: string) => {
    if (!hasAccess) {
      // Show upgrade prompt
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: "⭐ AI Assistant requires Impact Leader tier\n\nUpgrade to unlock:\n• Personalized AI recommendations\n• Industry research & benchmarking\n• Advanced analytics & reporting\n• Priority support\n\nClick the upgrade button to get started!",
        timestamp: new Date().toISOString(),
      }]);
      return;
    }

    const messageText = text || input.trim();
    if (!messageText) return;

    const userMsg: Message = { id: Date.now(), role: 'user', content: messageText, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Call backend chatbot API - it handles conversation persistence
      const result = await api.post<{ data: { message: string; timestamp: string; conversationId: string } }>('/impact-leader/chat', {
        message: messageText,
      });

      if (result.data) {
        const assistantMsg: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: result.data.data.message,
          timestamp: result.data.data.timestamp,
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else if (result.error) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          content: `⚠️ Sorry, I encountered an error: ${result.error}\n\nPlease try again or contact support if the issue persists.`,
          timestamp: new Date().toISOString(),
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear conversation history
  const handleClearConversation = async () => {
    if (!hasAccess) return;

    try {
      const result = await api.delete('/impact-leader/chat');
      if (result.data) {
        setMessages([{
          id: 0,
          role: 'assistant',
          content: "Hi! I'm EcoBot, your AI-powered sustainability assistant. 🌿\n\nI can help you with:\n• Carbon reduction strategies tailored to your events\n• Industry benchmarks and comparisons\n• UN SDG alignment analysis\n• Funding opportunities for sustainable practices\n• Actionable recommendations based on your data\n\nWhat would you like to know?",
          timestamp: new Date().toISOString(),
        }]);
      }
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all hover:scale-105 ${
          isOpen
            ? 'bg-gray-700 hover:bg-gray-800'
            : hasAccess
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-300'
            : 'bg-gray-400 hover:bg-gray-500'
        }`}
        title={hasAccess ? 'Open AI Assistant' : 'AI Assistant (Impact Leader tier required)'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : hasAccess ? (
          <MessageCircle className="w-6 h-6 text-white" />
        ) : (
          <Lock className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: '500px' }}>
          {/* Header */}
          <div className={`p-4 flex items-center gap-3 ${hasAccess ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'}`}>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              {hasAccess ? <Sparkles className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-white" />}
            </div>
            <div className="flex-1">
              <h4 className="text-white font-semibold flex items-center gap-2">
                EcoBot {hasAccess && <Crown className="w-4 h-4 text-yellow-300" />}
              </h4>
              <p className={`text-xs ${hasAccess ? 'text-emerald-200' : 'text-gray-300'}`}>
                {hasAccess ? 'Powered by GPT-4' : 'Impact Leader feature'}
              </p>
            </div>
            {!hasAccess && (
              <button
                onClick={() => navigate('/pricing')}
                className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg text-xs font-semibold transition-colors"
              >
                Upgrade
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-emerald-600" />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-700 rounded-bl-md'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-md p-3 flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Quick questions */}
          {messages.length <= 1 && suggestedQuestions.length > 0 && hasAccess && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-1.5">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={hasAccess ? "Ask about sustainable events..." : "Upgrade to unlock AI chat..."}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                disabled={isLoading || !hasAccess}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || !hasAccess}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  hasAccess
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                    : 'bg-gray-400'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
