# Brando CRM

A call center CRM application built with React, Express, and PostgreSQL.

## Overview

This is a CRM system for managing call center operations with features for:
- User authentication (admin, operator, master roles)
- Ticket/order management
- Customer management
- Reports and dashboard metrics
- Telephony integration (Zadarma, Twilio)

## Tech Stack

- **Frontend**: React 18 with TypeScript, Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query

## Project Structure

```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities and helpers
│   │   └── data/        # Mock data
│   └── public/          # Static assets
├── server/           # Express backend
│   ├── app.ts           # Express app setup
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   └── *-service.ts     # Service modules
├── shared/           # Shared types and schemas
│   └── schema.ts        # Drizzle database schema
└── vite.config.ts    # Vite configuration
```

## Development

Run the development server:
```bash
npm run dev
```

This starts both the Express backend and Vite dev server on port 5000.

## Database

Push schema changes:
```bash
npm run db:push
```

## Demo Credentials

- **Admin**: admin / admin2233
- **Operator**: operator / callcenter123
- **Master**: master / MS123

## Deployment

The application is configured for autoscale deployment:
- Build: `npm run build` (Vite build + esbuild for server)
- Start: `npm run start` (Runs production Express server)
