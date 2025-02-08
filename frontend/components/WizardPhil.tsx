"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Bot, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function WizardPhil() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi! I\'m WizardPhil, your livestock show assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const getAIResponse = (userInput: string): string => {
    // Simple keyword-based responses
    if (userInput.toLowerCase().includes('checklist')) {
      return "I'll help you prepare for your show. Here's your checklist status: You have 5 pending tasks and 3 completed tasks.";
    }
    if (userInput.toLowerCase().includes('evaluation')) {
      return "Looking at your recent evaluations, your animal's conformation score has improved by 15% in the last month.";
    }
    if (userInput.toLowerCase().includes('show')) {
      return "There are 3 upcoming shows in your region. The next one is in 2 weeks. Would you like to review the preparation checklist?";
    }
    if (userInput.toLowerCase().includes('breed')) {
      return "Based on your animal's breed standards, here are the key areas to focus on: movement patterns, muscle development, and coat condition.";
    }

    // Default responses for other queries
    const responses = [
      "I can help you prepare for your upcoming show. Would you like to review the checklist?",
      "Let me analyze your recent evaluation data to provide some insights.",
      "I can help you track your animal's progress. Would you like to see the latest statistics?",
      "Here are some tips for improving your show presentation techniques.",
      "Would you like to review the regional show schedule and requirements?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <>
      {/* Floating Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
          >
            <Bot className="h-6 w-6" />
            <span className="sr-only">Open AI Assistant</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              WizardPhil
            </SheetTitle>
            <SheetDescription>
              Your AI-powered livestock show assistant
            </SheetDescription>
          </SheetHeader>

          {/* Messages Area */}
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="flex flex-col gap-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {message.type === 'assistant' ? (
                    <Avatar>
                      <AvatarImage src="/wizard-phil.png" />
                      <AvatarFallback>WP</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar>
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.type === 'assistant'
                        ? 'bg-muted'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}