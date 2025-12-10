# Brando CRM

A customer relationship management (CRM) system for managing service orders and technicians.

## Overview

This is a full-stack application built with:
- **Frontend**: React with Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth

## Project Structure

```
├── client/           # React frontend
│   ├── src/          # React components and pages
│   └── index.html    # Entry HTML
├── server/           # Express backend
│   ├── app.ts        # Express app configuration
│   ├── routes.ts     # API routes
│   ├── storage.ts    # Database operations
│   └── index-dev.ts  # Development server with Vite
├── shared/           # Shared code (schema, types)
│   └── schema.ts     # Drizzle database schema
└── vite.config.ts    # Vite configuration
```

## Database Schema

- **users**: Admin, operator, and master users
- **masters**: Technician/master records
- **orders/tickets**: Service orders with location, photos, signatures

## Running the Application

```bash
npm run dev       # Development server
npm run build     # Build for production
npm run start     # Production server
npm run db:push   # Push database schema changes
```

## Demo Users

- Admin: admin / admin2233
- Operator: operator / callcenter123
- Master: master / MS123

## Recent Changes

- 2025-12-10: Initial Replit environment setup
