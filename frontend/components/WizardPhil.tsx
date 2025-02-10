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
import { Bot, Send, Sparkles, TrendingUp, Award, LineChart, Mic, Camera } from 'lucide-react';
import Image from 'next/image';
import { anthropicService } from '@/services/anthropic.service';
import { livestockAI } from '@/services/livestockAI';
import { photoAnalysis } from '@/services/photoAnalysis';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { Badge } from './ui/badge';
import { PerformanceChart, type PerformanceData } from './PerformanceChart';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  analysis?: {
    metrics?: {
      movement: number;
      conformation: number;
      muscleDevelopment: number;
      breedCharacteristics: number;
    };
    recommendations?: string[];
    trends?: Record<string, number>;
    compliance?: {
      score: number;
      strengths: string[];
      improvements: string[];
    };
    photoAnalysis?: {
      url: string;
      results: {
        conformation: {
          score: number;
          issues: string[];
          recommendations: string[];
        };
        movement: {
          score: number;
          gaitAnalysis: string;
          improvements: string[];
        };
        breedStandards: {
          compliance: number;
          matchingTraits: string[];
          deviations: string[];
        };
      };
    };
  };
}

export function WizardPhil() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm WizardPhil, your AI-powered livestock show assistant. I can help with performance analysis, breed standards, and show preparation. Try voice input or photo analysis!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { isListening, transcript, startListening, stopListening } = useVoiceInput();

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        setInput(transcript);
      }
    } else {
      startListening();
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Mock photo upload - replace with actual upload in production
      const photoUrl = URL.createObjectURL(file);
      
      // Analyze photo
      const analysis = await photoAnalysis.analyzePhoto(photoUrl);
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'I\'ve analyzed your photo. Here are the results:',
        timestamp: new Date(),
        analysis: {
          photoAnalysis: {
            url: photoUrl,
            results: analysis
          }
        }
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setSuggestions(['View detailed analysis', 'Compare with standards', 'Get improvement tips']);
      setRelatedTopics(['Photo Analysis', 'Breed Standards', 'Training Tips']);
    } catch (error) {
      console.error('Error analyzing photo:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Sorry, I had trouble analyzing that photo. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsAnalyzing(true);

    try {
      const response = await anthropicService.processMessage(input);

      if (input.toLowerCase().includes('analysis') || 
          input.toLowerCase().includes('performance') ||
          input.toLowerCase().includes('evaluation')) {
        
        const mockCurrentMetrics = {
          movement: 8,
          conformation: 7,
          muscleDevelopment: 9,
          breedCharacteristics: 8
        };
        const mockHistoricalData = [
          {
            movement: 7,
            conformation: 6,
            muscleDevelopment: 8,
            breedCharacteristics: 7
          }
        ];

        const analysis = await livestockAI.analyzePerformance(
          'demo-animal-id',
          mockCurrentMetrics,
          mockHistoricalData
        );

        const assistantMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: response.content,
          timestamp: new Date(),
          analysis: {
            metrics: analysis.currentScore,
            recommendations: analysis.historicalTrend.recommendations,
            trends: analysis.historicalTrend.improvement,
            compliance: {
              score: analysis.breedCompliance.overallScore,
              strengths: analysis.breedCompliance.strengthAreas,
              improvements: analysis.breedCompliance.improvementAreas
            }
          }
        };

        setMessages(prev => [...prev, assistantMessage]);
        setSuggestions(analysis.predictions.factors);
        setRelatedTopics(['Performance Trends', 'Breed Standards', 'Training Plans']);
      } else {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: response.content,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setSuggestions(response.suggestions || []);
        setRelatedTopics(response.relatedTopics || []);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: "I'm having trouble processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
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

          <ScrollArea className="h-[calc(100vh-280px)] pr-4">
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
                  <div className="space-y-4 max-w-[80%]">
                    <div
                      className={`rounded-lg px-4 py-2 ${
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

                    {message.analysis && (
                      <div className="bg-muted rounded-lg p-4 space-y-3">
                        {message.analysis.metrics && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="h-4 w-4" />
                              <h4 className="font-medium">Current Metrics</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(message.analysis.metrics).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-sm">{key}:</span>
                                  <span className="text-sm font-medium">{value}/10</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {message.analysis.compliance && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="h-4 w-4" />
                              <h4 className="font-medium">Breed Compliance</h4>
                            </div>
                            <p className="text-sm mb-2">
                              Overall Score: {message.analysis.compliance.score.toFixed(1)}/10
                            </p>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Strengths:</p>
                              <div className="flex flex-wrap gap-1">
                                {message.analysis.compliance.strengths.map((strength, i) => (
                                  <Badge key={i} variant="secondary">{strength}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {message.analysis.trends && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <LineChart className="h-4 w-4" />
                              <h4 className="font-medium">Performance Trends</h4>
                            </div>
                            <div className="space-y-1">
                              {Object.entries(message.analysis.trends).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-sm">{key}:</span>
                                  <span className={`text-sm font-medium ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {value >= 0 ? '+' : ''}{value.toFixed(1)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {message.analysis?.metrics && message.analysis?.trends && (
                          <div className="mt-4">
                            {(() => {
                              const metrics = message.analysis!.metrics!;
                              const trends = message.analysis!.trends!;
                              
                              const previousData: PerformanceData = {
                                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                                movement: metrics.movement - (trends.movement || 0) / 100,
                                conformation: metrics.conformation - (trends.conformation || 0) / 100,
                                muscleDevelopment: metrics.muscleDevelopment - (trends.muscleDevelopment || 0) / 100,
                                breedCharacteristics: metrics.breedCharacteristics - (trends.breedCharacteristics || 0) / 100
                              };
                              
                              const currentData: PerformanceData = {
                                date: new Date().toISOString(),
                                movement: metrics.movement,
                                conformation: metrics.conformation,
                                muscleDevelopment: metrics.muscleDevelopment,
                                breedCharacteristics: metrics.breedCharacteristics
                              };
                              
                              return (
                                <PerformanceChart
                                  data={[previousData, currentData]}
                                  height={200}
                                  showLegend={true}
                                />
                              );
                            })()}
                          </div>
                        )}

                        {message.analysis.photoAnalysis && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Camera className="h-4 w-4" />
                              <h4 className="font-medium">Photo Analysis</h4>
                            </div>
                            <Image
                              src={message.analysis.photoAnalysis.url}
                              alt="Analyzed photo"
                              width={500}
                              height={300}
                              className="w-full h-auto rounded-lg mb-2"
                              priority
                            />
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium">Conformation:</p>
                                <p className="text-sm">Score: {message.analysis.photoAnalysis.results.conformation.score}/10</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {message.analysis.photoAnalysis.results.conformation.recommendations.map((rec, i) => (
                                    <Badge key={i} variant="outline">{rec}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Movement:</p>
                                <p className="text-sm">{message.analysis.photoAnalysis.results.movement.gaitAnalysis}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Breed Standards:</p>
                                <p className="text-sm">Compliance: {message.analysis.photoAnalysis.results.breedStandards.compliance}%</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {(isAnalyzing || isUploading) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="animate-spin">⚬</span>
                  {isAnalyzing ? 'Analyzing...' : 'Uploading...'}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggestions and Topics */}
          {(suggestions.length > 0 || relatedTopics.length > 0) && (
            <div className="px-4 py-2 border-t">
              {suggestions.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium mb-1">Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInput(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {relatedTopics.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-1">Related Topics:</p>
                  <div className="flex flex-wrap gap-1">
                    {relatedTopics.map((topic, index) => (
                      <Badge key={index} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleVoiceInput}
                className={isListening ? 'bg-primary text-primary-foreground' : ''}
              >
                <Mic className="h-4 w-4" />
                <span className="sr-only">
                  {isListening ? 'Stop recording' : 'Start recording'}
                </span>
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => document.getElementById('photo-upload')?.click()}
                disabled={isUploading}
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Upload photo</span>
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <Input
                placeholder={isListening ? 'Listening...' : 'Ask me anything...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isAnalyzing || isListening}
              />
              <Button type="submit" size="icon" disabled={isAnalyzing || isListening}>
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