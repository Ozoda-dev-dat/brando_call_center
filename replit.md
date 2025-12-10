# Brando CRM

A call center CRM application for managing customer calls, tickets, and service operations.

## Overview

This is a full-stack TypeScript application with:
- **Frontend**: React with Vite, Tailwind CSS, Radix UI components
- **Backend**: Express.js server
- **Database**: PostgreSQL with Drizzle ORM

## Project Structure

```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities
│   │   └── data/        # Mock data
│   └── public/          # Static assets
├── server/           # Express backend
│   ├── app.ts          # Express app setup
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Database layer
│   └── index-dev.ts    # Development server
├── shared/           # Shared types and schemas
│   └── schema.ts       # Drizzle schema
└── vite.config.ts    # Vite configuration
```

## Development

The application runs on port 5000 in development mode with Vite handling HMR.

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes

## Demo Users

- **Admin**: admin / admin2233
- **Operator**: operator / callcenter123
- **Master**: master / MS123

## Features

- User authentication with roles (admin, operator, master)
- Dashboard with metrics
- Customer management
- Ticket/order tracking
- Call management
- Reports and analytics
