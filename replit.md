# Brando CRM

## Overview
Brando CRM is a call center management system with customer tracking, ticket management, and master (technician) dispatch functionality. Built with React frontend and Express backend.

## Architecture
- **Frontend**: React + Vite + TailwindCSS with shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy

## Project Structure
```
client/           - React frontend
  src/
    components/   - UI components including shadcn/ui
    pages/        - Page components
    hooks/        - Custom React hooks
    lib/          - Utilities
server/           - Express backend
  routes.ts       - API routes
  storage.ts      - Database operations
  app.ts          - Express app setup
shared/           - Shared types and schemas
  schema.ts       - Drizzle database schema
```

## Development
- Run: `npm run dev` - Starts dev server on port 5000
- Build: `npm run build` - Creates production build
- Database: `npm run db:push` - Push schema changes

## User Roles
- **Admin**: Full access to all features
- **Operator**: Call center operator access
- **Master**: Field technician access

## Demo Credentials
- Admin: admin / admin2233
- Operator: operator / callcenter123
- Master: master / MS123
