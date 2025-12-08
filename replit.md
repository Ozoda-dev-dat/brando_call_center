# Brando Call Center CRM

## Overview
This is a full-stack CRM application built with React (Vite), Express.js, and PostgreSQL. The application manages service tickets, customer calls, masters (technicians), and service centers. It includes real-time call handling via WebSocket and integrations with Zadarma and Twilio phone services.

## Recent Changes
- December 08, 2025: Initial project setup in Replit environment
  - Installed npm dependencies
  - Ran database migrations successfully
  - Configured for Replit deployment

## Project Architecture

### Technology Stack
- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon)
- **UI Components**: Radix UI + Tailwind CSS + shadcn/ui
- **Real-time**: WebSocket (ws library)
- **Phone Integration**: Twilio and Zadarma services
- **ORM**: Drizzle ORM
- **Session Management**: express-session with memory store

### Directory Structure
```
.
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components (UI + business logic)
│   │   ├── data/          # Mock data
│   │   ├── hooks/         # React hooks
│   │   ├── lib/           # Utilities and configs
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   └── index.html         # HTML template
├── server/                # Backend Express application
│   ├── app.ts             # Express app setup
│   ├── index-dev.ts       # Development server with Vite middleware
│   ├── index-prod.ts      # Production server
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database access layer
│   ├── seed.ts            # Database seeding
│   ├── telegram-service.ts
│   ├── tickets-service.ts
│   ├── twilio-service.ts
│   └── zadarma-service.ts
├── shared/                # Shared types and schemas
│   ├── schema.ts          # Drizzle database schema
│   └── crm-schema.ts      # Additional CRM schemas
└── migrations/            # Database migrations

```

### Database Schema
The application uses the following main tables:
- **users**: User accounts with roles (admin, operator, master)
- **masters**: Service technicians
- **orders**: Service tickets/orders
- **customers**: Customer information
- **service_centers**: Service center locations
- **fraud_alerts**: Fraud detection alerts

### Key Features
1. **Authentication**: Session-based auth with role-based access control
2. **Ticket Management**: Create and track service tickets
3. **Call Handling**: Real-time call notifications via WebSocket
4. **Master Coordination**: Assign and track technicians
5. **Reporting**: Service reports and analytics
6. **Phone Integration**: Zadarma and Twilio integration for calls

### Development Setup
- **Port**: Frontend runs on port 5000
- **Host**: 0.0.0.0 (configured for Replit proxy)
- **Database**: PostgreSQL (already provisioned)
- **Environment**: NODE_ENV=development

### API Routes
- `/api/auth/*` - Authentication endpoints
- `/api/tickets/*` - Ticket management
- `/api/masters/*` - Master management
- `/api/customers/*` - Customer management
- `/api/service-centers/*` - Service center management
- `/api/fraud-alerts/*` - Fraud alert management
- WebSocket at `/ws` - Real-time updates

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run db:push` - Push schema changes to database
- `npm run check` - TypeScript type checking

## User Preferences
None recorded yet.

## Environment Variables
Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string (already configured)
- `SESSION_SECRET` - Session encryption secret (already configured)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- `TELEGRAM_BOT_TOKEN` - Telegram bot token (optional)
- `TWILIO_ACCOUNT_SID` - Twilio account SID (optional)
- `TWILIO_AUTH_TOKEN` - Twilio auth token (optional)
- `TWILIO_PHONE_NUMBER` - Twilio phone number (optional)
- `ZADARMA_API_KEY` - Zadarma API key (optional)
- `ZADARMA_SECRET_KEY` - Zadarma secret key (optional)
