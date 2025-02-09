import { useState, useEffect } from 'react';

interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  error: string | null;
}

export function useVoiceInput() {
  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    transcript: '',
    error: null
  });

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setState(prev => ({ ...prev, error: 'Speech recognition not supported' }));
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null }));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setState(prev => ({ ...prev, error: event.error }));
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results.item(i).item(0).transcript;
      }
      setState(prev => ({ ...prev, transcript }));
    };

    if (state.isListening) {
      try {
        recognition.start();
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown error',
          isListening: false
        }));
      }
    }

    return () => {
      recognition.stop();
    };
  }, [state.isListening]);

  const startListening = () => {
    setState(prev => ({ ...prev, isListening: true, transcript: '', error: null }));
  };

  const stopListening = () => {
    setState(prev => ({ ...prev, isListening: false }));
  };

  const resetTranscript = () => {
    setState(prev => ({ ...prev, transcript: '' }));
  };

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript
  };
}