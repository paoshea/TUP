# TUP - LiveStock Show Assistant 🐑

## Overview
TUP is a comprehensive livestock evaluation and tracking platform designed specifically for agricultural shows, with a focus on Cheviot sheep evaluation. The platform provides real-time evaluation tools, historical data tracking, and detailed analysis features for livestock professionals.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## 🚀 Features

### Core Functionality
- Real-time livestock evaluation and scoring
- Historical flock data management
- Comprehensive evaluation framework
- Regional insights and analysis
- Photo integration and management
- Custom checklist creation
- Progress tracking and reporting
- WizardPhil AI Assistant with voice interaction
- Learning centre with farming terminology
- Code analysis and generation tools

### Key Components
- **Historical Flocks Database**: Detailed records of renowned flocks including achievements and notable traits
- **Evaluation Framework**: 
  - Physical characteristics assessment
  - Performance metrics tracking
  - Genetic traits evaluation
- **Analysis Tools**: 
  - Comparative analytics
  - Progress tracking
  - Performance visualization
  - Code analysis and insights
- **AI Assistant (WizardPhil)**:
  - Voice input/output capabilities
  - Natural language processing
  - Context-aware responses
  - Learning centre integration
  - Speech synthesis for natural interaction
  - Command-based voice control
- **Knowledge Base**:
  - Comprehensive farming terminology
  - TUP-specific glossary
  - Best practices documentation
  - Show preparation guides
  - Interactive learning tools
- **Code Tools**:
  - Code analysis and metrics
  - Data generation utilities
  - Validation frameworks
  - Auto-fix capabilities

## 🛠 Tech Stack

### Frontend
- React 18.x with TypeScript
- Next.js 14.x
- TailwindCSS
- Shadcn/ui component library
- Lucide React for icons
- React Query
- Recharts for data visualization
- Web Speech API for voice features
- Speech synthesis for AI responses

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Redis for caching
- AWS S3 for image storage
- AI/ML processing pipeline
- Natural Language Processing tools

### Mobile
- React Native
- Expo
- Voice integration capabilities

## 📱 System Requirements

### Mobile App
- iOS 12+ or Android 8+
- Minimum 2GB free storage
- Active internet connection for sync features
- Microphone access for voice features

### Web Application
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Minimum 1024x768 screen resolution
- Microphone access for voice features
- Audio output for AI voice responses

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.x
npm >= 9.x
git
```

### Installation
1. Clone the repository
```bash
git clone https://github.com/your-org/tup-livestock-assistant.git
cd tup-livestock-assistant
```
2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```
3. Set up environment variables
```bash
# Frontend
cp .env.example .env.local

# Backend
cp .env.example .env
```
4. Start development servers
```bash
# Frontend
npm run dev

# Backend
npm run dev
```

## 📖 Documentation
Detailed documentation is available in the following sections:
- [API Documentation](docs/API.md)
- [Database Schema](docs/SCHEMA.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Mobile App Setup](docs/MOBILE_SETUP.md)
- [WizardPhil Guide](docs/WIZARDPHIL.md)
- [Learning Centre](docs/LEARNING_CENTRE.md)
- [Code Tools Guide](docs/CODE_TOOLS.md)
- [Voice Integration](docs/VOICE.md)
- [UI Components](docs/UI.md)
- [AI Features](docs/AI.md)

## 🗄️ Project Structure
```
tup-livestock-assistant/
├── frontend/                # Web application
│   ├── components/         # Reusable React components
│   │   ├── features/      # Feature-specific components
│   │   ├── analytics/     # Analytics components
│   │   ├── ai/           # AI-related components
│   │   └── shared/       # Shared utilities
│   ├── pages/             # Next.js pages
│   ├── styles/            # Global styles and Tailwind config
│   └── utils/             # Utility functions
├── backend/                # Server application
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── services/         # Business logic
├── mobile/                # React Native mobile app
│   ├── components/       # Mobile components
│   ├── screens/         # App screens
│   └── navigation/      # Navigation configuration
└── docs/                  # Documentation
```

## 🤝 Contributing
We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- Phil OShea FCA, Software Guru and Visionary
- Alasdair MacLeod
- Royal Highland Show for evaluation criteria insights
- Cheviot Sheep Society for breed-specific guidance
- Regional breeding associations for historical data

## 📞 Support
For support and queries:
- Documentation: [docs/](docs/)
- Issue Tracker: [GitHub Issues](https://github.com/your-org/tup-livestock-assistant/issues)
- Email Support: support@tup-assistant.com

Built with ❤️ for the livestock community
