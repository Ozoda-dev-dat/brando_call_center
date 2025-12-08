# Brando CRM - Call Center Management System

## Overview
This is a full-stack CRM (Customer Relationship Management) application designed for call centers. It provides user authentication, ticket management, call tracking, and integrations with external services like Zadarma (VoIP), Twilio, and Telegram.

**Current State**: Fully operational in Replit development environment
**Last Updated**: December 8, 2024

## Project Architecture

### Technology Stack
- **Frontend**: React + TypeScript with Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon-hosted via Replit)
- **ORM**: Drizzle ORM
- **UI Library**: Radix UI components + Tailwind CSS
- **Real-time**: WebSocket for live updates
- **External Services**: Zadarma (VoIP), Twilio, Telegram Bot API

### Project Structure
```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities
├── server/              # Express backend
│   ├── app.ts          # Express app setup
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Database layer
│   ├── seed.ts         # Database seeding
│   └── *-service.ts    # External service integrations
├── shared/             # Shared types/schemas
└── dist/               # Production build output
```

## Development Setup

### Prerequisites
- Node.js environment (configured via Replit)
- PostgreSQL database (auto-provisioned by Replit)

### Environment Variables
Required secrets (configure in Replit Secrets tab):
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `SESSION_SECRET` - Session encryption key (auto-configured)

Optional (for external service integrations):
- `TWILIO_ACCOUNT_SID` - Twilio account identifier
- `TWILIO_AUTH_TOKEN` - Twilio authentication token
- `TWILIO_PHONE_NUMBER` - Twilio phone number
- `ZADARMA_API_KEY` - Zadarma API key
- `ZADARMA_SECRET_KEY` - Zadarma secret key
- `ZADARMA_SIP` - Zadarma SIP identifier
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `MASTER_TELEGRAM_MAP` - JSON mapping of master IDs to Telegram chat IDs

### Running the Application

**Development Mode**:
The workflow "Start application" runs automatically and serves the app on port 5000.

**Database Operations**:
```bash
npm run db:push    # Sync database schema
```

**Production Build**:
```bash
npm run build      # Build frontend and backend
npm start          # Run production server
```

## Key Features

1. **User Authentication**: Role-based access (Admin, Operator, Master)
2. **Ticket Management**: Create, assign, and track service tickets
3. **Call Management**: Handle incoming/outgoing calls with Zadarma integration
4. **Real-time Updates**: WebSocket-based live notifications
5. **Telegram Integration**: Notify masters of new tickets via Telegram
6. **Dashboard**: Metrics and analytics for call center operations

## Demo Credentials
- **Admin**: username: `admin` / password: `admin2233`
- **Operator**: username: `operator` / password: `callcenter123`
- **Master**: username: `master` / password: `MS123`

## Database Schema

### Users Table
- id (varchar, primary key, UUID)
- username (text, unique)
- password (text)
- fullName (text)
- role (admin | operator | master)
- masterId (text, optional)
- createdAt (timestamp)
- lastLogin (timestamp)

## Deployment Configuration

**Deployment Target**: Autoscale (stateless web application)
- **Build Command**: `npm run build`
- **Run Command**: `node dist/index.js`
- The application builds both frontend (Vite) and backend (esbuild) into the `dist/` directory

## Important Notes

1. **Port Configuration**: Frontend development server runs on port 5000 with host `0.0.0.0` and `allowedHosts: true` configured for Replit's proxy environment.

2. **Database**: Uses Replit's built-in PostgreSQL database. Schema is managed via Drizzle ORM. Users are auto-seeded on server startup.

3. **External Services**: Twilio, Zadarma, and Telegram integrations are optional. The application runs without them, but certain features (call handling, Telegram notifications) will be disabled.

4. **WebSocket**: Real-time features use WebSocket connections authenticated via Express sessions. Only admin and operator roles can connect to WebSocket for live updates.

5. **Session Management**: Uses in-memory session store (MemoryStore) for development. For production with multiple instances, consider using a database-backed session store.

## Recent Changes
- December 8, 2024: Initial import and setup in Replit environment
  - Created .gitignore for Node.js project
  - Pushed database schema using Drizzle
  - Configured development workflow
  - Configured deployment settings for autoscale
