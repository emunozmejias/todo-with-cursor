# Task Manager - Next.js Todo App

## Overview
A modern task management application built with Next.js 16, React 19, TypeScript, and Tailwind CSS. This is a client-side todo app with a clean, dark-themed UI featuring task creation, editing, completion tracking, and deletion.

## Project Structure
- **Framework**: Next.js 16.0.3 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI primitives with custom components
- **Icons**: Lucide React

### Directory Structure
```
src/
├── app/
│   ├── page.tsx        # Main todo app component
│   ├── layout.tsx      # Root layout with dark theme
│   ├── globals.css     # Global styles and Tailwind
│   └── favicon.ico
├── components/
│   └── ui/             # Reusable UI components (Button, Input, Card, Checkbox)
└── lib/
    └── utils.ts        # Utility functions (className merging)
```

## Configuration
- **Dev Server**: Runs on port 5000, bound to 0.0.0.0 for Replit compatibility
- **Build System**: Next.js with Turbopack
- **Deployment**: Configured for autoscale with build and production start commands

## Features
- Create, edit, and delete tasks
- Toggle task completion status
- Active and completed task counters
- Inline editing with keyboard shortcuts (Enter to save, Escape to cancel)
- Responsive design with dark theme
- Hot Module Replacement (HMR) for development

## Development
The app runs in development mode with:
- Port: 5000
- Host: 0.0.0.0 (required for Replit preview)
- HMR enabled for instant updates

## Recent Changes (Dec 2, 2025)
- Removed conflicting root `app/` directory that was causing 404 errors
- Configured Next.js dev server to run on port 5000 with 0.0.0.0 binding
- Set up deployment configuration for Replit autoscale
- Verified all dependencies are installed and working

## Tech Stack
- Next.js 16 (App Router with Turbopack)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Radix UI components
- Vercel Analytics
- React Hook Form with Zod validation (available but not yet used in main app)

## State Management
Currently uses React's built-in useState for local task management. Tasks are stored in component state and reset on page refresh (no persistence yet).
