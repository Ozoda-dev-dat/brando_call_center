# Service Center CRM Application

## Overview
A fullstack CRM application for managing service center operations including tickets, masters, customers, and calls. Built with React frontend and Express backend.

## Tech Stack
- **Frontend**: React 18 with Vite, Tailwind CSS, Radix UI components, Wouter for routing
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy, session-based auth

## Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and query client
│   └── index.html
├── server/           # Express backend
│   ├── app.ts           # Express app setup
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database storage layer
│   └── index-dev.ts     # Development server entry
├── shared/           # Shared types and schemas
│   └── schema.ts        # Drizzle database schema
└── vite.config.ts    # Vite configuration
```

## Key Features
- User authentication (admin, operator, master roles)
- Ticket/Order management
- Master (technician) management
- Customer management
- Call logging and tracking
- Dashboard with metrics

## Development
- Run: `npm run dev` - Starts development server on port 5000
- Build: `npm run build` - Builds for production
- Database: `npm run db:push` - Push schema changes to database

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (automatically set)

## Recent Changes
- December 11, 2025: Initial import and setup in Replit environment
