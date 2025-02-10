"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { anthropicService, type AnthropicResponse } from '@/services/anthropic.service';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  error?: boolean;
  suggestions?: string[];
  relatedTopics?: string[];
}

interface WizardPhilProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function WizardPhil({ isOpen = false, onOpenChange }: WizardPhilProps): React.ReactElement {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm WizardPhil, your AI-powered livestock show assistant. I can help with performance analysis, breed standards, and show preparation.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) setError(null);
  }, [input]);

  const handleSend = useCallback(async (): Promise<void> => {
    if (!input.trim()) return;

    try {
      console.log('[WizardPhil] Starting message send:', {
        input: input.trim(),
        timestamp: new Date().toISOString()
      });

      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: input.trim(),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsAnalyzing(true);
      setError(null);

      console.log('[WizardPhil] Calling anthropicService.processMessage');
      const aiResponse = await anthropicService.processMessage(input);
      console.log('[WizardPhil] Received AI response:', aiResponse);

      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        relatedTopics: aiResponse.relatedTopics,
      };

      console.log('[WizardPhil] Adding response message:', newMessage);
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('[WizardPhil] Error in handleSend:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process message';
      setError(errorMessage);

      const errorResponse: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: "I'm having trouble processing your request. Please try again.",
        timestamp: new Date(),
        error: true
      };

      console.log('[WizardPhil] Adding error message:', errorResponse);
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [input]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('[WizardPhil] Form submitted');
    void handleSend();
  }, [handleSend]);

  if (!isOpen) {
    return <></>;
  }

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] sm:w-[540px] bg-white shadow-lg flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">WizardPhil</h2>
          <button 
            onClick={() => onOpenChange?.(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-500">Your AI-powered livestock show assistant</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'assistant' ? 'flex-row' : 'flex-row-reverse'} gap-3`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
              ${msg.type === 'assistant' ? 'bg-purple-100' : 'bg-blue-100'}`}>
              {msg.type === 'assistant' ? 'WP' : 'You'}
            </div>
            <div className="flex-1">
              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.type === 'assistant'
                  ? msg.error
                    ? 'bg-red-50 text-red-900'
                    : 'bg-gray-100'
                  : 'bg-blue-500 text-white'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {msg.type === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-gray-500">Suggestions:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {msg.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <span>•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {msg.type === 'assistant' && msg.relatedTopics && msg.relatedTopics.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-gray-500">Related Topics:</p>
                  <div className="flex flex-wrap gap-1">
                    {msg.relatedTopics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="animate-spin">⚬</span>
            Analyzing...
          </div>
        )}
        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            Error: {error}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isAnalyzing}
            className="flex-1 px-3 py-2 border rounded-md disabled:opacity-50"
            aria-label="Message input"
          />
          <button
            type="submit"
            disabled={isAnalyzing || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
