# Brando CRM

## Overview

Brando CRM is a call center management system designed for service order tracking and technician dispatch. The application supports three user roles (admin, operator, master/technician) with role-based access control. Core functionality includes order management, customer tracking, master/technician management, call handling with OnlinePBX integration, and fraud detection alerts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support)
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **Session Management**: Express-session with memory store
- **Development**: Hot module replacement via Vite middleware
- **Production**: Static file serving from built assets

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon PostgreSQL (serverless)
- **Schema Location**: `shared/schema.ts` - defines users, orders, masters, clients tables
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod

### Authentication
- Session-based authentication with cookie storage
- Three roles: admin, operator, master
- Role-based permissions defined in `client/src/lib/permissions.ts`
- Initial users seeded on startup via `server/seed.ts`

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components
│   ├── pages/           # Route pages
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities and query client
├── server/              # Express backend
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Database access layer
│   └── *-service.ts     # Business logic services
├── shared/              # Shared types and schemas
│   └── schema.ts        # Drizzle database schema
└── migrations/          # Database migrations
```

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL via `@neondatabase/serverless`
- **Connection**: Uses `DATABASE_URL` environment variable

### Third-Party Integrations
- **OnlinePBX**: VoIP/call center integration (`server/onlinepbx-service.ts`)
  - Configured via `ONLINEPBX_DOMAIN` and `ONLINEPBX_API_KEY` environment variables
- **Telegram Bot**: Master notification system (`server/telegram-service.ts`)
  - Configured via `TELEGRAM_BOT_TOKEN` and `MASTER_TELEGRAM_MAP` environment variables
- **Twilio**: Alternative telephony service (`server/twilio-service.ts`)
  - Configured via `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `@tanstack/react-query`: Server state management
- `sip.js`: WebRTC SIP client for browser-based calling
- `recharts`: Charting library for dashboard visualizations
- `wouter`: Lightweight routing
- `zod`: Schema validation