interface Window {
  webkitSpeechRecognition: typeof webkitSpeechRecognition;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    item(index: number): {
      item(index: number): {
        transcript: string;
      };
    };
    length: number;
  };
}

declare class webkitSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  onstart: () => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;

  start(): void;
  stop(): void;
  abort(): void;
}