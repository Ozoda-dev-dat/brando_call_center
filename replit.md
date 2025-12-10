# Brando CRM

## Overview
A CRM (Customer Relationship Management) system for managing service orders/tickets. This is a full-stack application with React frontend and Express backend, using PostgreSQL database.

## Project Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript, Vite, TailwindCSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth

### Directory Structure
```
├── client/              # React frontend
│   ├── src/            # Source files
│   └── index.html      # Entry HTML
├── server/             # Express backend
│   ├── app.ts          # Express app setup
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Database operations
│   ├── index-dev.ts    # Development server (with Vite)
│   └── index-prod.ts   # Production server (static serving)
├── shared/             # Shared code between frontend/backend
│   └── schema.ts       # Drizzle database schema
└── migrations/         # Database migrations
```

### Database Schema
- **users**: User accounts (admin, operator, master roles)
- **masters**: Service technicians/masters
- **orders/tickets**: Service orders/tickets

### Scripts
- `npm run dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run db:push` - Push schema changes to database

### Demo Users
- Admin: admin / admin2233
- Operator: operator / callcenter123
- Master: master / MS123

## Recent Changes
- 2025-12-10: Fixed OnlinePBX integration errors:
  - Fixed signature calculation (now uses hex HMAC then base64, matching PHP library)
  - Corrected API endpoints: `history/search.json` instead of `mongo_history/search.json`
  - Corrected call endpoint: `call/now.json` instead of `make_call/request.json`
  - Corrected extensions endpoint: `user/get.json` instead of `sip/list.json`
  - Fixed date format to RFC-2822 for API requests
  - Updated auth expiry handling
- 2025-12-10: Initial Replit setup with database configuration

## User Preferences
(To be updated based on user feedback)
