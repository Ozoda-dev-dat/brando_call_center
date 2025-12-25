# Brando CallCenter CRM

## Overview

This is a CallCenter CRM application designed for service center management in Uzbekistan. The system handles order management, customer tracking, technician (master) assignments, VoIP phone integration, and service center operations. The application supports three user roles: admin, operator, and master (technician), with role-based access control throughout.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React Context for auth state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support)
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful JSON API under `/api/*` prefix
- **Session Management**: Express-session with MemoryStore (memory-based sessions)
- **Real-time Communication**: WebSocket server (ws library) for live updates

### Data Storage
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit with `db:push` command for schema sync

### Authentication & Authorization
- **Session-based auth**: Cookie-based sessions with 24-hour expiration
- **Role system**: Three roles (admin, operator, master) with granular permissions
- **Permission checks**: Centralized in `client/src/lib/permissions.ts`

### Key Design Decisions
1. **Shared schema**: Database types shared between client and server via `@shared/*` import alias
2. **Monorepo structure**: Client in `/client`, server in `/server`, shared code in `/shared`
3. **Dual entry points**: Separate dev (`index-dev.ts`) and prod (`index-prod.ts`) server configurations
4. **Vite integration**: Development server proxies API requests, production serves static build

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless Postgres via `@neondatabase/serverless`
- **Connection**: Requires `DATABASE_URL` environment variable

### VoIP Integration
- **OnlinePBX**: VoIP service integration (`server/onlinepbx-service.ts`)
  - Requires `ONLINEPBX_DOMAIN` and `ONLINEPBX_API_KEY`
- **Twilio**: Alternative VoIP service (`server/twilio-service.ts`)
  - Requires `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- **WebRTC SIP**: Browser-based phone using sip.js library

### Messaging
- **Telegram Bot**: Notification service for masters (`server/telegram-service.ts`)
  - Requires `TELEGRAM_BOT_TOKEN` and `MASTER_TELEGRAM_MAP` (JSON mapping masterId to chatId)

### Mapping
- **Leaflet**: Interactive maps for service center locations
- **React-Leaflet**: React wrapper for Leaflet

### Charts & Visualization
- **Recharts**: Dashboard charts and reporting visualizations

### Environment Variables Required
```
DATABASE_URL          # PostgreSQL connection string
SESSION_SECRET        # Session encryption key (optional, has default)
ONLINEPBX_DOMAIN      # OnlinePBX domain (optional)
ONLINEPBX_API_KEY     # OnlinePBX API key (optional)
TELEGRAM_BOT_TOKEN    # Telegram bot token (optional)
MASTER_TELEGRAM_MAP   # JSON mapping of master IDs to Telegram chat IDs (optional)
```