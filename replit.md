# Brando CRM - Call Center Management System

## Overview
Brando CRM is a call center management system built for tracking service tickets, managing masters (technicians), handling customer calls, and generating reports. The application features role-based access control with admin, operator, and master roles.

## Tech Stack
- **Frontend**: React 18 with TypeScript, Vite, TailwindCSS, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth
- **State Management**: TanStack Query (React Query)

## Project Structure
```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities
│   │   └── data/        # Mock data
├── server/              # Express backend
│   ├── app.ts           # Express app setup
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   └── *-service.ts     # External service integrations
├── shared/              # Shared types and schemas
│   └── schema.ts        # Drizzle database schema
```

## Development
- Run `npm run dev` to start the development server
- The app runs on port 5000
- Database schema is managed with Drizzle ORM

## Database Schema
- **users**: User accounts with roles (admin, operator, master)
- **masters**: Technician/service personnel records
- **orders/tickets**: Service tickets and orders

## Demo Credentials
- Admin: admin / admin2233
- Operator: operator / callcenter123
- Master: master / MS123

## External Integrations
The app has integration capabilities for:
- Twilio (call handling)
- Telegram (notifications)
- OnlinePBX (call center features)
