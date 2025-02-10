# AI Services Guide

## Available Services

The application integrates with multiple AI services, each optimized for specific use cases:

### 1. Anthropic (Claude 3 Sonnet)
- **Endpoint**: `/api/ai/chat`
- **Model**: `claude-3-sonnet-20240229` (configured in backend route)
- **Frontend Service**: `anthropic.service.ts`
  - Handles API communication
  - Manages timeouts and error handling
  - Formats requests/responses
- **Best for**: 
  - General conversation and chat interactions
  - Complex reasoning tasks
  - Natural language understanding
- **Use when**: 
  - You need high-quality, nuanced responses
  - Handling multi-turn conversations
  - Requiring detailed explanations

### 2. OpenAI (GPT-4)
- **Endpoint**: `/api/ai/analyze`
- **Best for**:
  - Livestock evaluation analysis
  - Photo assessment
  - Show preparation guidance
- **Use when**:
  - Analyzing performance metrics
  - Evaluating animal photos
  - Planning show strategies

### 3. Deepseek
- **Endpoint**: `/api/ai/code`
- **Best for**:
  - Code analysis
  - Technical documentation
  - Development assistance
- **Use when**:
  - Working with code-related queries
  - Needing technical explanations
  - Debugging assistance

## Service Architecture

### Frontend Services
Frontend services (like `anthropic.service.ts`) handle:
- API communication with backend routes
- Request/response formatting
- Error handling and timeouts
- Logging and debugging

### Backend Routes
Backend routes (like `/api/ai/chat/route.ts`) handle:
- Model configuration and versioning
- API key management
- Direct communication with AI providers
- Response processing

## Switching Between Services

### Using the AI Service

The main `AIService` class automatically routes requests to the appropriate service based on content:

```typescript
// Import the service
import { aiService } from '@/services/ai';

// Let the service handle routing
const response = await aiService.processMessage(userInput);
```

### Manual Service Selection

You can also use specific services directly when you know which one you need:

```typescript
// Anthropic for chat
import { anthropicService } from '@/services/anthropic.service';
const chatResponse = await anthropicService.processMessage(message);

// OpenAI for analysis
import { openai } from '@/services/openai';
const analysisResponse = await openai.analyze('evaluation', data);

// Deepseek for code
import { DeepseekService } from '@/services/deepseek.service';
const codeResponse = await DeepseekService.getInstance().query(prompt);
```

## When to Consider Direct SDK Usage

While our current server-side approach offers many benefits, there are scenarios where direct SDK usage might be more appropriate:

### Consider Server-Side (Current Approach) When:

1. **Security is Critical**
   - Protecting API keys
   - Implementing rate limiting
   - Managing authentication

2. **Centralized Control Needed**
   - Consistent error handling
   - Response caching
   - Usage monitoring

3. **Cross-Platform Compatibility**
   - Supporting multiple clients
   - Ensuring consistent behavior
   - Managing API versions

4. **Cost Control**
   - Implementing usage quotas
   - Optimizing requests
   - Caching responses

### Consider Direct SDK Usage When:

1. **Development Environment**
   - Rapid prototyping
   - Local testing
   - Offline development

2. **Edge Computing Requirements**
   - Need for minimal latency
   - Offline capabilities
   - Edge-specific optimizations

3. **Client-Side Features**
   - Real-time streaming responses
   - Direct file handling
   - Browser-specific optimizations

4. **Simple Applications**
   - Single-user applications
   - Proof-of-concept projects
   - Development tools

## Implementation Examples

### Server-Side Approach (Current)
```typescript
// Frontend service
class AnthropicService {
  private readonly apiEndpoint = '/api/ai/chat';
  
  async processMessage(message: string) {
    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }) // Note: uses 'message' parameter
    });
    return response.json();
  }
}

// Backend route
export async function POST(request: Request) {
  const { message } = await request.json();
  const response = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    messages: [{ role: 'user', content: message }]
  });
  return NextResponse.json({ content: response.content });
}
```

### Direct SDK Approach
```typescript
// Direct Anthropic integration (not recommended for production)
import Anthropic from '@anthropic-ai/sdk';

class DirectAnthropicService {
  private anthropic = new Anthropic({
    apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
  });

  async processMessage(message: string) {
    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      messages: [{ role: 'user', content: message }]
    });
    return response;
  }
}
```

## Making the Choice

Consider these factors when choosing between approaches:

1. **Project Scale**
   - Small project? Direct SDK might be simpler
   - Large project? Server-side offers better control

2. **Security Requirements**
   - High security needs? Use server-side
   - Internal tool? Direct SDK might be acceptable

3. **Performance Needs**
   - Need caching? Server-side
   - Need minimal latency? Consider direct SDK

4. **Development Speed**
   - Quick prototype? Direct SDK
   - Production app? Server-side

## Best Practices

1. **Documentation**
   - Document service selection logic
   - Keep API documentation updated
   - Include usage examples

2. **Error Handling**
   - Implement proper fallbacks
   - Log service failures
   - Provide user feedback

3. **Testing**
   - Test service switching logic
   - Mock AI responses
   - Validate error cases

4. **Monitoring**
   - Track service usage
   - Monitor performance
   - Alert on failures

## Future Considerations

When adding new AI services:

1. Add to the appropriate category
2. Document use cases and limitations
3. Update routing logic if needed
4. Consider performance implications
5. Test thoroughly before deployment