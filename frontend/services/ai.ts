interface AIResponse {
  content: string;
  confidence: number;
  suggestions?: string[];
  relatedTopics?: string[];
}

interface AIContext {
  recentMessages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  userProfile?: {
    expertise: string;
    preferences: Record<string, unknown>;
  };
  animalContext?: {
    breed: string;
    age: number;
    recentEvaluations: Array<Record<string, unknown>>;
  };
}

export class AIService {
  private context: AIContext = {
    recentMessages: []
  };

  constructor() {
    // Initialize with empty context
    this.loadContext();
  }

  private async loadContext() {
    try {
      // Load user preferences from localStorage
      const savedContext = localStorage.getItem('aiContext');
      if (savedContext) {
        this.context = JSON.parse(savedContext);
      }
    } catch (error) {
      console.error('Error loading AI context:', error);
    }
  }

  private saveContext() {
    try {
      localStorage.setItem('aiContext', JSON.stringify(this.context));
    } catch (error) {
      console.error('Error saving AI context:', error);
    }
  }

  private updateContext(message: { role: 'user' | 'assistant'; content: string }) {
    this.context.recentMessages.push(message);
    // Keep only last 10 messages for context
    if (this.context.recentMessages.length > 10) {
      this.context.recentMessages.shift();
    }
    this.saveContext();
  }

  async processMessage(message: string): Promise<AIResponse> {
    // Add message to context
    this.updateContext({ role: 'user', content: message });

    // Process message with context
    const response = await this.generateResponse(message);

    // Update context with response
    this.updateContext({ role: 'assistant', content: response.content });

    return response;
  }

  private async generateResponse(message: string): Promise<AIResponse> {
    const lowercaseMessage = message.toLowerCase();
    
    // Enhanced keyword matching with context awareness
    const response: AIResponse = {
      content: '',
      confidence: 0.8,
      suggestions: [],
      relatedTopics: []
    };

    if (lowercaseMessage.includes('checklist')) {
      response.content = "Based on your upcoming show schedule, here's your personalized checklist status:\n" +
        "- Equipment preparation: 80% complete\n" +
        "- Health documentation: Pending vaccination update\n" +
        "- Training milestones: On track\n" +
        "Would you like to focus on any specific area?";
      response.suggestions = [
        "Review equipment list",
        "Check health requirements",
        "View training schedule"
      ];
      response.relatedTopics = ["Show Preparation", "Health Records", "Training Plans"];
    }
    else if (lowercaseMessage.includes('evaluation')) {
      response.content = "Analyzing your recent evaluations:\n" +
        "- Movement score trend: +15% improvement\n" +
        "- Conformation consistency: High\n" +
        "- Areas for focus: Muscle definition\n" +
        "Would you like a detailed analysis of any specific aspect?";
      response.suggestions = [
        "View trend graphs",
        "Compare to breed standards",
        "Set new goals"
      ];
      response.relatedTopics = ["Performance Metrics", "Breed Standards", "Goal Setting"];
    }
    else if (lowercaseMessage.includes('show')) {
      response.content = "Here's your show schedule overview:\n" +
        "- Next show: Regional Championship (2 weeks)\n" +
        "- Required preparations: 75% complete\n" +
        "- Weather forecast: Favorable\n" +
        "Would you like to review specific show requirements?";
      response.suggestions = [
        "View show details",
        "Check requirements",
        "See preparation status"
      ];
      response.relatedTopics = ["Show Rules", "Weather Updates", "Travel Plans"];
    }
    else if (lowercaseMessage.includes('breed')) {
      response.content = "Based on your breed standards analysis:\n" +
        "- Current conformity: 85%\n" +
        "- Key focus areas: Movement patterns\n" +
        "- Breed-specific tips available\n" +
        "Would you like to explore any specific aspect?";
      response.suggestions = [
        "View breed standards",
        "Compare measurements",
        "See improvement tips"
      ];
      response.relatedTopics = ["Breed History", "Standard Updates", "Expert Tips"];
    }
    else {
      // Generate contextual response based on recent conversation
      response.content = this.generateContextualResponse();
      response.suggestions = [
        "Review recent progress",
        "Check upcoming tasks",
        "View recommendations"
      ];
      response.relatedTopics = ["General Care", "Training Tips", "Show Preparation"];
    }

    return response;
  }

  private generateContextualResponse(): string {
    const responses = [
      "Based on your recent activities, here are some personalized recommendations for show preparation.",
      "I notice you've been focusing on training. Would you like some advanced techniques to try?",
      "Your recent evaluation scores show promising trends. Let's review the details.",
      "I can help you optimize your show preparation routine. What aspect would you like to focus on?",
      "Looking at your schedule, now might be a good time to review your show strategy."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const aiService = new AIService();