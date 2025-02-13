# Code File Root Setup Guide

This guide provides the terminal commands to set up the complete file structure for the LiveStock Show Assistant project on macOS.

## Initial Setup

```bash
# Create root project directory
mkdir -p livestock-show-assistant && cd livestock-show-assistant

# Create documentation directory
mkdir -p docs

# Create source code directories
mkdir -p src/{components,types,services,hooks,utils,context,styles,config,__tests__}

# Create public assets directories
mkdir -p public/{breeds,icons,logos}

# Create component test directories
mkdir -p src/__tests__/{components,hooks,utils,integration}

# Create styles subdirectories
mkdir -p src/styles/{components,themes,animations}
```

## Documentation Files

```bash
# Create documentation files
touch docs/{USER_GUIDE,TECH,API,CONTRIBUTING,CHANGELOG,SECURITY,DEPLOYMENT}.md
```

## Source Code Structure

### Components

```bash
# Create component files
touch src/components/{Header,Dashboard,FlockAnalyzer,PreShowChecklist,PhotoGallery,RegionalInsights,EvaluationForm,WizardPhil,LivestockSelector,BreedDirectory,ShowSchedule,TeamCollaboration,DataExport,Settings}.tsx

# Create Logo component
touch src/components/Logo.tsx
```

### Types and Interfaces

```bash
# Create type definition files
touch src/types/{index,livestock,evaluation,user,show}.ts
```

### Services

```bash
# Create service files
touch src/services/{api,auth,storage,ai,export,sync}.ts
```

### Hooks

```bash
# Create custom hooks
touch src/hooks/{useAuth,useEvaluation,usePhotos,useSync,useAI}.ts
```

### Utils

```bash
# Create utility files
touch src/utils/{validation,formatting,calculations,export,date}.ts
```

### Context

```bash
# Create context files
touch src/context/{AuthContext,LivestockContext,UIContext,SyncContext}.tsx
```

### Config

```bash
# Create configuration files
touch src/config/{constants,routes,api,theme}.ts
```

### Test Files

```bash
# Create test files for components
touch src/__tests__/components/{Header,Dashboard,FlockAnalyzer,PreShowChecklist,PhotoGallery,RegionalInsights,EvaluationForm,WizardPhil}.test.tsx

# Create test files for hooks
touch src/__tests__/hooks/{useAuth,useEvaluation,usePhotos,useSync,useAI}.test.ts

# Create test files for utils
touch src/__tests__/utils/{validation,formatting,calculations,export,date}.test.ts

# Create integration test files
touch src/__tests__/integration/{auth,evaluation,photo,sync}.test.ts
```

## Configuration Files

```bash
# Create root configuration files
touch {.env,.env.example,tsconfig.json,vite.config.ts,tailwind.config.js,postcss.config.js}
```

## Git Setup

```bash
# Initialize git and create initial commit
git init
touch .gitignore
echo "node_modules/
.env
dist/
.DS_Store" > .gitignore
```

## File Permissions

```bash
# Set appropriate file permissions
chmod 644 $(find . -type f)
chmod 755 $(find . -type d)
```

## Verify Structure

```bash
# Display the complete file structure
tree -a -I 'node_modules|.git'
```

## Install Dependencies

```bash
# Initialize npm and install dependencies
npm init -y
npm install react react-dom @types/react @types/react-dom typescript
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer
npm install lucide-react
```

## Development Server

```bash
# Start development server
npm run dev
```

## Notes

1. After running these commands, the complete file structure will be set up according to the NEXT_STEPS.md checklist.

2. Remember to:
   - Add appropriate content to each file
   - Configure TypeScript and other tools
   - Set up testing framework
   - Configure CI/CD pipeline
   - Set up deployment procedures

3. Additional steps:
   - Configure ESLint and Prettier
   - Set up pre-commit hooks
   - Configure testing environment
   - Set up deployment scripts

4. Security considerations:
   - Set proper file permissions
   - Configure environment variables
   - Set up security policies
   - Implement authentication

5. Next actions:
   - Add content to documentation files
   - Implement components
   - Set up testing
   - Configure deployment
   - Add security measures