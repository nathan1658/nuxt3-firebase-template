# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 3 Firebase template with TypeScript, featuring multi-language support and multiple database integrations (Firebase Firestore, MongoDB, Redis). The project uses Vuetify 3 for UI components and is configured for Firebase hosting deployment.

## Development Commands

```bash
# Development
pnpm dev                    # Start development server on localhost:3000
pnpm build                  # Build for production
pnpm preview               # Preview production build
pnpm generate              # Generate static site

# Code Quality
pnpm lint                  # Run ESLint
pnpm lint:fix              # Fix ESLint errors automatically

# Deployment
pnpm deploy:firebase       # Full Firebase deployment (build + deploy)
```

## Architecture Overview

### Frontend Structure

- **Framework**: Nuxt 3 with Vue 3 Composition API
- **UI Library**: Vuetify 3 with Material Design components
- **State Management**: Pinia for reactive state
- **Routing**: File-based routing in `/pages/` directory
- **Internationalization**: @nuxtjs/i18n with support for EN, ZH-TC, ZH-SC

### Backend Structure

- **Server**: Nitro server with Firebase Functions (Gen 2)
- **API Routes**: Located in `/server/api/` directory
- **Database Plugins**: Connection management in `/server/plugins/`
- **Multiple Databases**: Firebase Firestore, MongoDB (Mongoose), Redis

### Key Configuration

- **Deployment**: Firebase hosting with server-side rendering
- **Region**: asia-east2 with max 3 instances
- **Runtime**: Node.js 20 with TypeScript strict mode

## Code Conventions (from .cursorrules)

### Vue/Nuxt Specifics

- Use Composition API `<script setup>` style exclusively
- Leverage Nuxt 3 auto-imports (no manual imports for ref, useState, useRouter)
- Use composables with `use<MyComposable>` naming pattern
- Prefer functional and declarative programming patterns over classes
- Use PascalCase for component file names (e.g., `MyComponent.vue`)

### Data Fetching Patterns

- `useFetch()` for standard SSR data fetching with caching
- `$fetch()` for client-side requests in event handlers
- `useAsyncData()` for complex data fetching logic
- Set `server: false` to bypass SSR, `lazy: true` for deferred loading

### TypeScript Guidelines

- Use interfaces over types for better extendability
- Avoid enums, prefer maps for type safety
- Implement functional components with TypeScript interfaces

### Database Integration

- MongoDB connections via `/server/plugins/mongodb.ts` with Mongoose
- Redis client management in `/server/utils/redis.ts`
- Firebase integration through VueFire with real-time capabilities

## Environment Setup

Required environment variables in `.env`:

```env
# Firebase Configuration
FIREBASE_API_KEY=xxxxxxxxxxxx
FIREBASE_AUTH_DOMAIN=xxxxxxxxxxxx
FIREBASE_PROJECT_ID=xxxxxxxxxxxx
FIREBASE_STORAGE_BUCKET=xxxxxxxxxxxx
FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxx
FIREBASE_APP_ID=xxxxxxxxxxxx
FIREBASE_MEASUREMENT_ID=xxxxxxxxxxxx

# Database Configuration
MONGODB_URI=your_mongodb_connection_string
REDIS_URI=your_redis_connection_string
REDIS_PASSWORD=your_redis_password
```

## Multi-Language Support

The project includes comprehensive i18n setup:

- Locale files in root directory (`en.json`, `zh-tc.json`, `zh-sc.json`)
- Language switching component for user preference
- SEO optimization with `useHead()` and `useSeoMeta()`

## Firebase Deployment

Firebase configuration uses Nitro preset with:

- Gen 2 Cloud Functions
- Static hosting for public assets
- Automatic routing to server function
- Regional deployment (asia-east2)
