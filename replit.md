# Brando CallCenter CRM

## Overview
A CallCenter CRM application built with React frontend and Express backend, using TypeScript throughout. The application supports call management, customer tracking, ticketing, and master technician management.

## Project Architecture
- **Frontend**: React with Vite, TypeScript, TailwindCSS, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with sessions

## Key Files and Directories
- `/client` - React frontend application
  - `/client/src/pages` - Route pages (login, dashboard, tickets, etc.)
  - `/client/src/components` - Reusable UI components
  - `/client/src/hooks` - Custom React hooks
- `/server` - Express backend
  - `/server/app.ts` - Express application setup
  - `/server/routes.ts` - API routes
  - `/server/storage.ts` - Database operations
- `/shared` - Shared TypeScript types and schemas
  - `/shared/schema.ts` - Drizzle database schema

## Running the Application
- Development: `npm run dev` (runs on port 5000)
- Build: `npm run build`
- Production: `npm run start`
- Database push: `npm run db:push`

## Database Schema
Main tables:
- `users` - Application users with roles (admin, operator, master)
- `orders` - Service orders/tickets
- `masters` - Technician records
- `clients` - Customer records

## Demo Users
The application seeds demo users on startup:
- admin / operator / master (role-based access)

## Recent Changes
- December 16, 2025: Initial Replit environment setup
  - Configured database connection
  - Set up development workflow on port 5000
  - Configured deployment settings
