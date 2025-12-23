# Brando CallCenter CRM

## Overview
A CallCenter CRM application with frontend (React/Vite) and backend (Express) for managing orders, masters, and clients. Built with TypeScript and uses a PostgreSQL database with Drizzle ORM.

## Project Architecture

### Directory Structure
- `client/` - React frontend with Vite build system
- `server/` - Express backend API
- `shared/` - Shared types and database schema (Drizzle ORM)
- `attached_assets/` - Static assets

### Key Technologies
- **Frontend**: React 18, Vite, TailwindCSS, shadcn/ui components, React Query
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM
- **Auth**: Passport.js with local strategy, express-session

### Development
- Run: `npm run dev` - Starts both frontend and backend on port 5000
- Database: `npm run db:push` - Push schema changes to database

### Production Build
- Build: `npm run build` - Builds Vite frontend and bundles server
- Start: `npm run start` - Starts production server

### Database Schema
- `users` - User accounts with roles (admin, operator, master)
- `orders` - Service orders/tickets
- `masters` - Service technicians
- `clients` - Customer information

## Recent Changes
- December 23, 2025: Initial Replit environment setup
  - Created PostgreSQL database
  - Configured workflow for port 5000
  - Set up autoscale deployment

## User Preferences
- Language appears to be Uzbek (interface text)
