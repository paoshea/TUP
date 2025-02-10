# API Implementation Guide

## Architecture Overview

All AI service calls (Anthropic, OpenAI, Deepseek) are handled server-side via Next.js API routes to ensure:
- Secure API key management
- Consistent error handling
- Rate limiting
- Response caching when appropriate
- Simplified client-side code

## API Route Structure

```
/api/
  ├── ai/
  │   ├── chat          - Anthropic chat endpoint
  │   ├── analyze       - OpenAI analysis endpoint
  │   └── code          - Deepseek code analysis endpoint
```

## Implementation Details

### Frontend Services

Frontend services should:
- Use simple fetch/axios calls to internal API endpoints
- Handle loading states and errors consistently
- Parse responses according to defined interfaces
- Never contain API keys or make direct external API calls

Example of proper implementation:
```typescript
export class AIService {
  private readonly apiEndpoint = '/api/ai/analyze';
  private readonly timeout = 30000; // 30 seconds
  
  async analyze(type: 'evaluation' | 'photo' | 'show', data: unknown): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ type, data }),
        signal: controller.signal
      });
      
      clearTimeout(id);
      
      if (!response.ok) {
        throw new Error(`API Error (${response.status})`);
      }
      
      return response.json();
    } catch (error) {
      clearTimeout(id);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      throw error;
    }
  }
}
```

### Backend Routes

Backend API routes should:
- Implement proper authentication/authorization
- Handle API key management securely
- Implement rate limiting
- Process and validate responses
- Handle errors gracefully
- Use direct API calls instead of SDKs when possible

Example of proper implementation:
```typescript
// app/api/ai/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Direct API call without SDK
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      content: data.content[0].text,
      confidence: 0.95
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
```

## Testing the API

### Starting the Development Server

```bash
cd frontend
npm run dev
```

The server will start on port 3000 (or next available port if 3000 is in use).

### Testing Endpoints

Test the Anthropic chat endpoint:
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hi"}'
```

Expected response format:
```json
{
  "content": "Response text here...",
  "confidence": 0.95,
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "relatedTopics": ["topic1", "topic2", "topic3"]
}
```

Common issues:
- If port 3000 is in use, the server will use the next available port (e.g., 3001)
- Ensure the server is fully started before testing
- Check terminal output for any error messages

## Current Implementation Status

✅ Properly Implemented:
- Anthropic service (anthropic.service.ts)
  - Uses internal API endpoint (/api/ai/chat)
  - Proper error handling and timeouts
  - No exposed credentials
  - Uses Claude 3 Sonnet model (claude-3-sonnet-20240229)
- OpenAI service (openai.ts)
  - Uses internal API endpoint (/api/ai/analyze)
  - Proper error handling and timeouts
  - No exposed credentials
- Deepseek service (deepseek.service.ts)
  - Uses internal API endpoint (/api/ai/code)
  - Proper error handling and timeouts
  - No exposed credentials
- AI service (ai.ts)
  - Uses refactored services
  - Proper error handling
  - Consistent response formatting

## Why This Approach?

1. **Security**
   - API keys remain secure on the server
   - Requests can be authenticated/authorized
   - Rate limiting prevents abuse

2. **Maintainability**
   - Centralized API handling
   - Easier to update/modify implementations
   - Consistent error handling

3. **Performance**
   - Response caching opportunities
   - Request batching possibilities
   - Reduced client-side complexity

4. **Compatibility**
   - Better cross-platform support
   - Consistent behavior across devices
   - Simplified client implementations

## Adding New Features

When adding new AI capabilities:

1. Create a new API route in `/app/api/ai/`
2. Implement proper security measures
3. Create/update frontend service to use the new endpoint
4. Never use external APIs directly in frontend code
5. Document the new endpoint in this guide

## Environment Setup

Required environment variables:

```env
# Backend (.env.local)
ANTHROPIC_API_KEY=your_key
OPENAI_API_KEY=your_key
DEEPSEEK_API_KEY=your_key

# Note: Use .env.local instead of .env to prevent committing secrets
# The .env file should only contain public variables or examples
```

## Best Practices

1. **Error Handling**
   - Implement proper error boundaries
   - Use consistent error response format
   - Log errors appropriately

2. **Security**
   - Validate all inputs
   - Implement rate limiting
   - Use proper authentication

3. **Performance**
   - Cache responses when appropriate
   - Implement request timeouts
   - Handle loading states

4. **Testing**
   - Test endpoints with curl commands
   - Mock API responses in unit tests
   - Test error scenarios
   - Validate response parsing