# LiveStock Show Assistant Technical Documentation

## Tech Stack

### Frontend
- React 18.3.1
- TypeScript 5.5.3
- Vite 5.4.2
- Tailwind CSS 3.4.1

### Dependencies
- `lucide-react` - Icon library
- `react-dom` - React DOM renderer
- `autoprefixer` - CSS post-processor
- `postcss` - CSS transformer

### Development Tools
- ESLint 9.9.1
- TypeScript ESLint
- Vite React Plugin

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- macOS, Linux, or Windows

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd livestock-show-assistant

# Install dependencies
npm install
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Development Server

The development server runs on `http://localhost:5173` by default.

### Common Issues & Solutions

#### Port Already in Use
```bash
# Find process using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>
```

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache/typescript

# Verify TypeScript configuration
npx tsc --noEmit
```

## Project Structure

```
livestock-show-assistant/
├── docs/               # Documentation
├── public/            # Static assets
├── src/
│   ├── components/    # React components
│   ├── types/        # TypeScript type definitions
│   ├── App.tsx       # Main application component
│   └── main.tsx      # Application entry point
├── index.html        # HTML template
├── package.json      # Project dependencies
├── tsconfig.json     # TypeScript configuration
├── vite.config.ts    # Vite configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
```

## Build Process

The build process is handled by Vite:

1. TypeScript compilation
2. Asset optimization
3. CSS processing
4. Bundle generation

Build output is located in the `dist` directory.

## Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Implement responsive design patterns
- Follow React best practices and hooks guidelines

## Performance Optimization

- Lazy load components when possible
- Optimize images before import
- Use React.memo for expensive computations
- Implement proper key props in lists
- Avoid unnecessary re-renders

## Troubleshooting Guide

### Common Error: White Screen
1. Check console for errors
2. Verify all dependencies are installed
3. Clear browser cache
4. Restart development server

### Build Failures
1. Check TypeScript errors
2. Verify import paths
3. Check for missing dependencies
4. Review environment variables

### Development Server Issues
1. Check port availability
2. Verify Node.js version
3. Clear npm cache
4. Check for conflicting processes

## Deployment

### Production Build
```bash
# Create production build
npm run build

# Test production build locally
npm run preview
```

### Build Output Verification
1. Check `dist` directory
2. Verify asset optimization
3. Test in multiple browsers
4. Validate environment variables

## Security Considerations

- Keep dependencies updated
- Use environment variables for sensitive data
- Implement proper CORS policies
- Follow React security best practices
- Validate user input

## Support

For technical issues:
1. Check existing documentation
2. Review console errors
3. Search issue tracker
4. Contact development team

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow code style guidelines
4. Submit pull request
5. Wait for review


## Commands

COMMON COMMANDS

  tsc
  Compiles the current project (tsconfig.json in the working directory.)

  tsc app.ts util.ts
  Ignoring tsconfig.json, compiles the specified files with default compiler options.

  tsc -b
  Build a composite project in the working directory.

  tsc --init
  Creates a tsconfig.json with the recommended settings in the working directory.

  tsc -p ./path/to/tsconfig.json
  Compiles the TypeScript project located at the specified path.

  tsc --help --all
  An expanded version of this information, showing all possible compiler options

  tsc --noEmit
  tsc --target esnext
  Compiles the current project, with additional settings.

COMMAND LINE FLAGS

     --help, -h  Print this message.

    --watch, -w  Watch input files.

          --all  Show all compiler options.

  --version, -v  Print the compiler's version.

         --init  Initializes a TypeScript project and creates a tsconfig.json file.

  --project, -p  Compile the project given the path to its configuration file, or to a folder with a 'tsconfig.json'.

   --showConfig  Print the final configuration instead of building.

    --build, -b  Build one or more projects and their dependencies, if out of date

COMMON COMPILER OPTIONS

               --pretty  Enable color and formatting in TypeScript's output to make compiler errors easier to read.
                  type:  boolean
               default:  true

      --declaration, -d  Generate .d.ts files from TypeScript and JavaScript files in your project.
                  type:  boolean
               default:  `false`, unless `composite` is set

       --declarationMap  Create sourcemaps for d.ts files.
                  type:  boolean
               default:  false

  --emitDeclarationOnly  Only output d.ts files and not JavaScript files.
                  type:  boolean
               default:  false

            --sourceMap  Create source map files for emitted JavaScript files.
                  type:  boolean
               default:  false

               --noEmit  Disable emitting files from a compilation.
                  type:  boolean
               default:  false

           --target, -t  Set the JavaScript language version for emitted JavaScript and include compatible library declaratio                         ns.
                one of:  es5, es6/es2015, es2016, es2017, es2018, es2019, es2020, es2021, es2022, es2023, es2024, esnext
               default:  es5

           --module, -m  Specify what module code is generated.
                one of:  none, commonjs, amd, umd, system, es6/es2015, es2020, es2022, esnext, node16, nodenext, preserve
               default:  undefined

                  --lib  Specify a set of bundled library declaration files that describe the target runtime environment.
           one or more:  es5, es6/es2015, es7/es2016, es2017, es2018, es2019, es2020, es2021, es2022, es2023, es2024, esnext,                          dom, dom.iterable, dom.asynciterable, webworker, webworker.importscripts, webworker.iterable, webwo                         rker.asynciterable, scripthost, es2015.core, es2015.collection, es2015.generator, es2015.iterable, e                         s2015.promise, es2015.proxy, es2015.reflect, es2015.symbol, es2015.symbol.wellknown, es2016.array.in                         clude, es2016.intl, es2017.arraybuffer, es2017.date, es2017.object, es2017.sharedmemory, es2017.stri                         ng, es2017.intl, es2017.typedarrays, es2018.asyncgenerator, es2018.asynciterable/esnext.asynciterabl                         e, es2018.intl, es2018.promise, es2018.regexp, es2019.array, es2019.object, es2019.string, es2019.sy                         mbol/esnext.symbol, es2019.intl, es2020.bigint/esnext.bigint, es2020.date, es2020.promise, es2020.sh                         aredmemory, es2020.string, es2020.symbol.wellknown, es2020.intl, es2020.number, es2021.promise, es20                         21.string, es2021.weakref/esnext.weakref, es2021.intl, es2022.array, es2022.error, es2022.intl, es20                         22.object, es2022.string, es2022.regexp, es2023.array, es2023.collection, es2023.intl, es2024.arrayb                         uffer, es2024.collection, es2024.object/esnext.object, es2024.promise/esnext.promise, es2024.regexp/                         esnext.regexp, es2024.sharedmemory, es2024.string/esnext.string, esnext.array, esnext.collection, es                         next.intl, esnext.disposable, esnext.decorators, esnext.iterator, decorators, decorators.legacy
               default:  undefined

              --allowJs  Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from the                         se files.
                  type:  boolean
               default:  false

              --checkJs  Enable error reporting in type-checked JavaScript files.
                  type:  boolean
               default:  false

                  --jsx  Specify what JSX code is generated.
                one of:  preserve, react, react-native, react-jsx, react-jsxdev
               default:  undefined

              --outFile  Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also des                         ignates a file that bundles all .d.ts output.

               --outDir  Specify an output folder for all emitted files.

       --removeComments  Disable emitting comments.
                  type:  boolean
               default:  false

               --strict  Enable all strict type-checking options.
                  type:  boolean
               default:  false

                --types  Specify type package names to be included without being referenced in a source file.

      --esModuleInterop  Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSynthe                         ticDefaultImports' for type compatibility.
                  type:  boolean
               default:  false