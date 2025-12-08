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

## Zadarma VoIP Integration

The application includes full Zadarma WebRTC integration for real-time calls:

### How It Works
1. **WebRTC Widget**: Zadarma's official widget script is loaded in `client/index.html`
2. **API Integration**: The backend fetches dynamic WebRTC keys from Zadarma API
3. **Call Types**:
   - **WebRTC Calls**: Direct browser-based calls using the Zadarma widget
   - **Callback Calls**: Server-initiated calls via Zadarma's callback API

### Required Secrets for Calls
- `ZADARMA_API_KEY` - API Key from Zadarma control panel
- `ZADARMA_SECRET_KEY` - API Secret Key from Zadarma control panel  
- `ZADARMA_SIP` - Your SIP extension number (e.g., "619765")

### Zadarma PBX Configuration
For incoming calls to work, configure a webhook in Zadarma PBX settings:
- Webhook URL: `https://your-domain.replit.app/api/calls/incoming`
- Events: `notify_start`, `notify_end`, `notify_internal`

## Recent Changes
- December 8, 2024: Implemented database-backed tickets/orders system
  - Created comprehensive tickets table with customer info, device details, status tracking, and fraud detection fields
  - Updated tickets-service.ts to use PostgreSQL via Drizzle ORM instead of in-memory storage
  - Updated TicketsPanel to fetch real data from /api/tickets endpoint using React Query
  - Tested and verified CRUD operations work correctly with the database

- December 8, 2024: Fixed Zadarma integration for real-time calls
  - Fixed environment variable name mismatch (ZADARMA_SECRET_KEY)
  - Implemented real outgoing call initiation via Zadarma callback API
  - Improved ZadarmaWidget initialization with retry mechanism
  - Verified WebRTC key generation working correctly

- December 8, 2024: Initial import and setup in Replit environment
  - Created .gitignore for Node.js project
  - Pushed database schema using Drizzle
  - Configured development workflow
  - Configured deployment settings for autoscale
