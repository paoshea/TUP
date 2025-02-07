Integration Plan for Deepseek AI
Steps:
Add authentication setup
Test API connection
Create service wrapper
Implement error handling

# 1. Authentication Setup
import dotenv from 'dotenv';

dotenv.config();

export const DEEPSEEK_CONFIG = {
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-coder-6.7b'
};

DEEPSEEK_API_KEY=your_api_key_here

2. Test Connection

curl -X POST https://api.deepseek.com/v1/completions \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-coder-6.7b",
    "prompt": "Hello, world!",
    "max_tokens": 100
  }'

 3. Service Implementation

 import { DEEPSEEK_CONFIG } from '../config/deepseek.config';
import axios from 'axios';

interface DeepseekResponse {
  choices: Array<{
    text: string;
  }>;
}

export class DeepseekService {
  private static instance: DeepseekService;
  
  private constructor() {}

  static getInstance(): DeepseekService {
    if (!this.instance) {
      this.instance = new DeepseekService();
    }
    return this.instance;
  }

  async query(prompt: string): Promise<string> {
    try {
      const response = await axios.post<DeepseekResponse>(
        `${DEEPSEEK_CONFIG.baseUrl}/completions`,
        {
          model: DEEPSEEK_CONFIG.model,
          prompt,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].text;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Authentication failed. Check your API key.');
      }
      throw error;
    }
  }
}

4. Add to package.json

{
  "dependencies": {
    "axios": "^1.6.0",
    "dotenv": "^16.3.1"
  }
}

5. Next steps:
Run npm install
Add actual API key to .env
Test service with:

import { DeepseekService } from './services/deepseek.service';

async function test() {
  const service = DeepseekService.getInstance();
  const response = await service.query('Hello');
  console.log(response);
}

test().catch(console.error);
