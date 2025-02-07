# Frontend Implementation Guide - Part 1: Core Components

This guide covers the initial frontend implementation for the LiveStock Show Assistant, focusing on core components and basic setup. Additional frontend features will be covered in subsequent guides.

## Core Components Setup

### 1. Create Base Components

```bash
# Create core component files
cat > src/components/Header.tsx << 'EOL'
import React from 'react';
import { Menu, User } from 'lucide-react';
import { Logo } from './Logo';

export function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-1 hover:bg-blue-700 rounded-lg">
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-3">
              <Logo width={80} height={40} className="transition-transform hover:scale-105" />
              <h1 className="text-xl font-bold">LiveStock Show Assistant</h1>
            </div>
          </div>
          <button className="p-1 hover:bg-blue-700 rounded-lg">
            <User size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
EOL

# Create Logo component
cat > src/components/Logo.tsx << 'EOL'
import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = '', width = 100, height = 50 }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 400 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={width}
      height={height}
    >
      {/* Background shape */}
      <rect x="50" y="40" width="300" height="120" rx="20" fill="#2563eb"/>
      
      {/* Letters with modern geometric style */}
      {/* T */}
      <path d="M100 70 L160 70 M130 70 L130 130" stroke="white" strokeWidth="12" strokeLinecap="round"/>
      
      {/* U */}
      <path 
        d="M180 70 L180 110 Q180 130 200 130 Q220 130 220 110 L220 70" 
        stroke="white" 
        strokeWidth="12" 
        fill="none" 
        strokeLinecap="round"
      />
      
      {/* P */}
      <path 
        d="M240 130 L240 70 L280 70 Q300 70 300 85 Q300 100 280 100 L240 100" 
        stroke="white" 
        strokeWidth="12" 
        fill="none" 
        strokeLinecap="round"
      />
      
      {/* Decorative dots */}
      <circle cx="90" cy="150" r="4" fill="white"/>
      <circle cx="310" cy="50" r="4" fill="white"/>
      <circle cx="200" cy="160" r="4" fill="white"/>
    </svg>
  );
}
EOL

# Create Dashboard component
cat > src/components/Dashboard.tsx << 'EOL'
import React from 'react';
import { ClipboardList, Calendar, Map, Settings } from 'lucide-react';

const features = [
  {
    name: 'Pre-Show Preparation',
    icon: ClipboardList,
    description: 'Create checklists and import animal details',
  },
  {
    name: 'Show Schedule',
    icon: Calendar,
    description: 'View and manage your show timeline',
  },
  {
    name: 'Regional Insights',
    icon: Map,
    description: 'Access region-specific evaluation criteria',
  },
  {
    name: 'Settings',
    icon: Settings,
    description: 'Customize your evaluation preferences',
  },
];

export function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to LiveStock Show Assistant</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <feature.icon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Evaluations</h3>
        <div className="text-gray-600">No recent evaluations found.</div>
      </div>
    </div>
  );
}
EOL

# Create WizardPhil AI Assistant component
cat > src/components/WizardPhil.tsx << 'EOL'
import React, { useState } from 'react';
import { Wand2, SendHorizontal, Sparkles, History, X } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function WizardPhil() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Wizard Phil, your AI livestock evaluation assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      const response = await mockAIResponse(input);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock AI response - replace with actual API integration
  const mockAIResponse = async (input: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Here's my analysis based on your question: "${input}"...`;
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Wand2 className="h-6 w-6" />
      </button>

      {/* Chat interface */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Wizard Phil</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-75 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 animate-pulse">
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    // TODO: Implement history view
                  }}
                >
                  <History className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Wizard Phil anything..."
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SendHorizontal className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
EOL
```

### 2. Create Type Definitions

```bash
# Create base types
cat > src/types/index.ts << 'EOL'
export interface Animal {
  id: string;
  name: string;
  category: string;
  breed: string;
  region: string;
  scores: {
    movement: number;
    conformation: number;
    muscleDevelopment: number;
    breedCharacteristics: number;
  };
  notes: string;
  images: string[];
}

export interface EvaluationCriteria {
  category: string;
  criteria: {
    name: string;
    description: string;
    maxScore: number;
  }[];
}

export interface Region {
  name: string;
  characteristics: string[];
  historicalData?: string;
}
EOL
```

### 3. Configure Base Styles

```bash
# Create base styles
cat > src/index.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOL
```

### 4. Configure TypeScript

```bash
# Create tsconfig files
cat > tsconfig.json << 'EOL'
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
EOL

cat > tsconfig.app.json << 'EOL'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
EOL

cat > tsconfig.node.json << 'EOL'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
EOL
```

### 5. Configure Vite and PostCSS

```bash
# Create Vite config
cat > vite.config.ts << 'EOL'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
EOL

# Create PostCSS config
cat > postcss.config.js << 'EOL'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOL

# Create Tailwind config
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
EOL
```

### 6. Create Entry Points

```bash
# Create main entry point
cat > src/main.tsx << 'EOL'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
EOL

# Create HTML template
cat > index.html << 'EOL'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOL
```

## Notes

1. This is Part 1 of the frontend implementation, focusing on:
   - Core components (Header, Logo, Dashboard, WizardPhil)
   - Basic TypeScript setup
   - Build configuration
   - Base styling

2. Subsequent parts will cover:
   - Additional components (FlockAnalyzer, PhotoGallery, etc.)
   - Context providers
   - Services and hooks
   - Testing setup
   - Advanced features

3. Remember to:
   - Install dependencies before running
   - Test components individually
   - Follow TypeScript best practices
   - Maintain consistent styling

4. Next steps will be covered in:
   - CODE_FILE_FRONTEND_2.md (Additional components)
   - CODE_FILE_FRONTEND_3.md (Services and hooks)
   - CODE_FILE_FRONTEND_4.md (Testing setup)