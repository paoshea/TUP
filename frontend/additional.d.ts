/**
 * Global type declarations for the Next.js project
 * This file contains type definitions for various file types and environment configurations
 */

// Asset imports
declare module '*.svg' {
  import type { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGElement>>
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

// Environment variables type definitions
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string
    NODE_ENV: 'development' | 'production' | 'test'
  }
}

// Add custom window properties if needed in the future:
// declare global {
//   interface Window {
//     customProperty: string
//   }
// }