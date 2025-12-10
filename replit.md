# Brando CRM

A CRM (Customer Relationship Management) application for managing service calls and tickets. Built with React, Express, and PostgreSQL.

## Overview

This is a fullstack CRM application featuring:
- User authentication with different roles (admin, operator, master)
- Dashboard with metrics
- Ticket/order management
- Customer management
- Call center integration
- Service center tracking

## Tech Stack

- **Frontend**: React 18 with Vite, Tailwind CSS, Radix UI components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with sessions

## Project Structure

```
├── client/             # React frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Page components
│   │   ├── hooks/      # Custom React hooks
│   │   └── lib/        # Utility functions
│   └── public/         # Static assets
├── server/             # Express backend
│   ├── app.ts          # Express app setup
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Database storage
│   └── index-dev.ts    # Development server
├── shared/             # Shared code
│   └── schema.ts       # Drizzle database schema
└── vite.config.ts      # Vite configuration
```

## Development

- Run `npm run dev` to start the development server on port 5000
- Frontend and backend run together with Vite middleware mode

## Database

Uses PostgreSQL with Drizzle ORM. Main tables:
- `users` - User accounts with roles
- `masters` - Service technicians
- `orders`/`tickets` - Service tickets

Push schema changes: `npm run db:push`

## Demo Credentials

- Admin: admin / admin2233
- Operator: operator / callcenter123
- Master: master / MS123

## Recent Changes

- December 10, 2025: Initial Replit setup with PostgreSQL database
