# Brando Callcenter CRM

## Overview
A callcenter CRM application for managing service orders, technicians (masters), clients, and service centers. Built with React frontend and Express backend, using PostgreSQL database.

## Project Structure
- `client/` - React frontend (Vite)
  - `src/components/` - UI components
  - `src/pages/` - Application pages (dashboard, tickets, customers, etc.)
  - `src/hooks/` - Custom React hooks
- `server/` - Express backend
  - `app.ts` - Express app configuration
  - `routes.ts` - API routes
  - `storage.ts` - Database operations
- `shared/` - Shared schemas (Drizzle ORM)

## Tech Stack
- Frontend: React, Vite, TailwindCSS, Radix UI
- Backend: Express, Node.js
- Database: PostgreSQL (Neon)
- ORM: Drizzle

## Development
- `npm run dev` - Start development server on port 5000
- `npm run db:push` - Push database schema changes

## Production
- `npm run build` - Build for production
- `npm run start` - Start production server

## Authentication
Demo accounts are seeded automatically:
- Admin
- Operator
- Texnik (Master)
