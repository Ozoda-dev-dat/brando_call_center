# Brando CRM

## Overview

Brando CRM is a call center management system built for service technician dispatch operations. The application manages service orders, customer relationships, technician (master) assignments, and integrates with telephony systems for call handling. The UI is localized in Uzbek language.

The system supports three user roles:
- **Admin**: Full system access including user management and configuration
- **Operator**: Call center operations, order creation, and customer management
- **Master**: Field technician view for assigned orders

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Build Tool**: Vite with path aliases (`@/` for client/src, `@shared/` for shared)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful JSON API mounted at `/api/*`
- **Session Management**: express-session with MemoryStore (development) or connect-pg-simple (production-ready)
- **Real-time**: WebSocket server for live updates (call notifications, order status)

### Data Storage
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit with `db:push` command

### Authentication
- Session-based authentication with role-based access control
- Three roles with distinct permission sets defined in `client/src/lib/permissions.ts`
- Login credentials seeded in `server/seed.ts`

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components including panels for each feature
│   ├── pages/           # Route page components
│   ├── hooks/           # Custom React hooks (auth, toast, mobile)
│   └── lib/             # Utilities, permissions, query client
├── server/              # Express backend
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Database access layer
│   └── *-service.ts     # Business logic services
└── shared/              # Shared types and schemas
    └── schema.ts        # Drizzle table definitions
```

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless Postgres, configured via `DATABASE_URL` environment variable

### Telephony Integration
- **OnlinePBX**: VoIP integration for call handling (`ONLINEPBX_DOMAIN`, `ONLINEPBX_API_KEY`)
- **Twilio**: Alternative telephony provider (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`)
- **WebRTC/SIP**: Browser-based softphone support via sip.js

### Messaging
- **Telegram Bot**: Order notifications to technicians (`TELEGRAM_BOT_TOKEN`, `MASTER_TELEGRAM_MAP` JSON mapping master IDs to chat IDs)

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `ONLINEPBX_DOMAIN`: OnlinePBX account domain
- `ONLINEPBX_API_KEY`: OnlinePBX API authentication
- `TELEGRAM_BOT_TOKEN`: Telegram bot for notifications
- `MASTER_TELEGRAM_MAP`: JSON mapping of master IDs to Telegram chat IDs