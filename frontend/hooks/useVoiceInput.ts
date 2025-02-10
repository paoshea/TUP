import { useState, useCallback } from 'react';

interface UseVoiceInputResult {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
}

export function useVoiceInput(): UseVoiceInputResult {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = useCallback(() => {
    // For demo purposes, we'll simulate voice input
    setIsListening(true);
    // Simulate a delay and then set some mock text
    setTimeout(() => {
      setTranscript('Show me the performance analysis for my livestock');
      setIsListening(false);
    }, 2000);
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
  };
}