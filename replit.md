# Brando CallCenter CRM

## Overview

Brando is a full-stack CallCenter CRM system designed for managing service orders, technicians (masters), customers, and call center operations. The application is built for an Uzbekistan-based service center business, with the UI presented in Uzbek language. It supports role-based access control for admins, operators, and field technicians (masters).

Key features include:
- Order/ticket management with status tracking
- Technician (master) management with GPS location tracking
- Customer database with order history and lifetime value metrics
- VoIP phone integration via OnlinePBX and WebRTC SIP
- Service center management with map-based location picking
- Dashboard with analytics and reporting
- Telegram bot integration for notifying masters about new orders

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Build Tool**: Vite with React plugin
- **Maps**: Leaflet with React-Leaflet for service center location picking
- **Charts**: Recharts for dashboard visualizations

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful JSON API with session-based authentication
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Static file serving from compiled Vite build

### Data Storage
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Session Storage**: In-memory store (memorystore) for development
- **Schema Location**: `shared/schema.ts` contains all table definitions

### Authentication & Authorization
- **Session Management**: Express-session with cookie-based sessions
- **Role-Based Access**: Three roles - admin, operator, master
- **Permissions System**: Centralized permission checks in `client/src/lib/permissions.ts`

### Key Design Patterns
- **Shared Types**: Schema definitions in `shared/` directory accessible by both client and server
- **Path Aliases**: `@/` for client src, `@shared/` for shared modules
- **API Pattern**: All API routes prefixed with `/api/`
- **Component Structure**: Page components in `pages/`, feature panels in `components/`

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless Postgres database (requires `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migrations via `npm run db:push`

### VoIP Integration
- **OnlinePBX**: Russian/CIS VoIP provider for call center functionality
  - Requires `ONLINEPBX_DOMAIN` and `ONLINEPBX_API_KEY` environment variables
  - WebSocket-based real-time call notifications
- **WebRTC SIP**: Browser-based phone via sip.js library with configurable SIP server

### Messaging
- **Telegram Bot**: Sends order notifications to masters
  - Requires `TELEGRAM_BOT_TOKEN` environment variable
  - Master-to-chat mapping via `MASTER_TELEGRAM_MAP` JSON environment variable

### Optional Services
- **Twilio**: Alternative telephony provider (configured but secondary to OnlinePBX)
  - Requires `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

### Frontend Libraries
- **Leaflet**: Map rendering for service center locations
- **Recharts**: Chart visualizations for dashboard and reports
- **sip.js**: WebRTC SIP client for browser-based calling