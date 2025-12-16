# Zavod CRM

## Overview
Zavod CRM is a service management and CRM application built with a fullstack Node.js architecture. It features user authentication, order/ticket management, master/technician tracking, and client management.

## Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for development and building
- **TailwindCSS** for styling
- **Radix UI** components
- **React Query** for data fetching
- **Wouter** for routing

### Backend
- **Express.js** server
- **PostgreSQL** database with Drizzle ORM
- **Passport.js** for authentication
- Session-based auth with express-session

## Project Structure
```
client/           # React frontend
  src/
    components/   # UI components
    pages/        # Page components
    hooks/        # Custom React hooks
    lib/          # Utilities
    data/         # Mock data
server/           # Express backend
  app.ts          # Express app configuration
  routes.ts       # API routes
  storage.ts      # Database operations
  index-dev.ts    # Development server (with Vite)
  index-prod.ts   # Production server (static files)
shared/           # Shared code between frontend and backend
  schema.ts       # Drizzle database schema
```

## Development
- Run: `npm run dev` - Starts development server on port 5000
- Build: `npm run build` - Builds frontend and backend
- Database: `npm run db:push` - Push schema changes to database

## Demo Users
The application seeds three demo users on startup:
- **admin** - Administrator role
- **operator** - Operator/Dispatcher role  
- **master** - Technician role

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (automatically configured)
- `PORT` - Server port (default: 5000)
