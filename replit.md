# Zavod CRM

## Overview
A CRM (Customer Relationship Management) system for manufacturing/service operations. The application is built with React frontend and Express backend, using PostgreSQL database.

## Tech Stack
- **Frontend**: React with TypeScript, TailwindCSS, Radix UI components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite
- **State Management**: TanStack React Query

## Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities
│   │   └── data/         # Mock data
│   └── index.html
├── server/           # Express backend
│   ├── app.ts           # Express app setup
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   ├── index-dev.ts     # Development server entry
│   └── index-prod.ts    # Production server entry
├── shared/           # Shared types and schemas
│   └── schema.ts        # Drizzle database schema
└── package.json
```

## Scripts
- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes

## Development
The development server runs on port 5000 with Vite middleware for HMR (Hot Module Replacement).

## Production
Production build creates:
- Frontend static files in `dist/public/`
- Server bundle in `dist/index.js`

## Recent Changes
- December 16, 2025: Initial Replit setup, database provisioned, schema pushed

## User Preferences
- None documented yet
