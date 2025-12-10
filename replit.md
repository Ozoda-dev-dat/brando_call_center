# Brando CRM

A call center CRM (Customer Relationship Management) system built with React, Express, and PostgreSQL.

## Overview

This is a CRM application for a call center ("Qo'ng'iroqlar Markazi") that manages:
- Customer tickets/orders
- Call handling
- Master technicians
- Service centers
- User authentication with role-based access (Admin, Operator, Master)

## Tech Stack

- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS, Radix UI components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth

## Project Structure

```
├── client/             # React frontend
│   ├── src/
│   │   ├── components/ # UI components (Radix UI based)
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utilities and query client
│   │   ├── pages/      # Page components
│   │   └── data/       # Mock data
│   └── index.html
├── server/             # Express backend
│   ├── app.ts          # Express app setup
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Database operations
│   └── index-dev.ts    # Development entry point
├── shared/             # Shared types and schemas
│   ├── schema.ts       # Drizzle database schema
│   └── crm-schema.ts   # CRM-specific types
└── package.json
```

## Development

Run the development server:
```bash
npm run dev
```

## Database

Push schema changes:
```bash
npm run db:push
```

## Demo Users

- **Admin**: admin / admin2233
- **Operator**: operator / callcenter123
- **Master**: master / MS123

## Recent Changes

- December 10, 2025: Initial Replit environment setup with PostgreSQL database
