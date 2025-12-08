# Brando CRM Application

## Overview
This is a CRM (Customer Relationship Management) system for managing service centers, masters, customers, tickets, and phone calls. The application features real-time updates via WebSockets, integrated telephony (Zadarma), and Telegram bot notifications.

## Project Architecture

### Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (via Neon)
- **ORM**: Drizzle ORM
- **UI Components**: Radix UI + Tailwind CSS
- **Real-time**: WebSockets (ws)
- **Session Management**: express-session with in-memory store

### Project Structure
```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and helpers
│   └── index.html
├── server/              # Backend Express application
│   ├── app.ts           # Express app setup
│   ├── routes.ts        # API routes and WebSocket server
│   ├── storage.ts       # Database access layer
│   ├── seed.ts          # Database seeding
│   ├── *-service.ts     # External service integrations
│   └── index-dev.ts     # Development server entry
├── shared/              # Shared code between frontend/backend
│   └── schema.ts        # Database schema (Drizzle)
└── migrations/          # Database migrations
```

## Features

### Core Functionality
- **User Management**: Admin, Operator, and Master roles
- **Ticket Management**: Create, assign, track service tickets
- **Call Management**: Incoming/outgoing call tracking with Zadarma integration
- **Customer Database**: Customer information management
- **Service Centers**: Manage multiple service center locations
- **Real-time Updates**: WebSocket-based live updates for calls and tickets
- **Telegram Integration**: Automated notifications to masters via Telegram bot

### User Roles
- **Admin**: Full system access, user management, reports
- **Operator**: Handle calls, create tickets, manage customers
- **Master**: Receive and accept/reject service orders via Telegram

## Environment Variables

### Required
- `DATABASE_URL`: PostgreSQL connection string (automatically set by Replit)
- `SESSION_SECRET`: Secret key for session management (automatically set)

### Optional (for full functionality)
- `ZADARMA_API_KEY`: Zadarma API key for call integration
- `ZADARMA_API_SECRET`: Zadarma API secret
- `ZADARMA_SIP`: Zadarma SIP number
- `TELEGRAM_BOT_TOKEN`: Telegram bot token for notifications
- `MASTER_TELEGRAM_MAP`: JSON mapping of master IDs to Telegram chat IDs
- `TWILIO_ACCOUNT_SID`: Twilio account SID (alternative to Zadarma)
- `TWILIO_AUTH_TOKEN`: Twilio auth token
- `TWILIO_PHONE_NUMBER`: Twilio phone number

## Development

### Setup
The project is configured to run in the Replit environment with the following setup:
1. PostgreSQL database created and connected
2. Environment variables configured
3. Database schema initialized
4. Development server running on port 5000

### Running the Application
```bash
npm run dev
```
The dev server starts at `http://0.0.0.0:5000` with:
- Vite dev server with HMR (Hot Module Replacement)
- Express backend with API routes
- WebSocket server for real-time updates

### Default Users (Seeded)
After initial setup, the following users are available:
- **Admin**: username: `admin`, password: `admin123`
- **Operator**: username: `operator`, password: `operator123`
- **Master**: username: `master`, password: `master123`

### Database Commands
```bash
npm run db:push        # Push schema changes to database
npm run check          # TypeScript type checking
```

## Deployment

The application is configured for Replit deployment with:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Deployment Type**: Autoscale (stateless, suitable for web applications)

### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Tickets
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets` - List all tickets

### Calls
- `GET /api/calls` - List all calls
- `POST /api/calls/incoming` - Zadarma webhook for incoming calls
- `POST /api/calls/:callSid/accept` - Accept a call
- `POST /api/calls/:callSid/reject` - Reject a call
- `POST /api/calls/:callSid/end` - End a call
- `POST /api/calls/outgoing` - Record outgoing call
- `GET /api/zadarma/widget-config` - Get Zadarma WebRTC configuration

### Telegram
- `POST /api/telegram/webhook` - Telegram bot webhook

### WebSocket
- `ws://localhost:5000/ws` - WebSocket connection for real-time updates
  - Authentication required (admin/operator roles only)
  - Events: `ticket_created`, `ticket_updated`, `incoming_call`, `call_accepted`, `call_rejected`, `call_ended`

## Recent Changes
- **2024-12-08**: Initial project setup in Replit environment
  - PostgreSQL database configured
  - Environment variables set up
  - Database schema initialized
  - Development workflow configured
  - Deployment settings configured

## Notes
- The application uses in-memory session storage (MemoryStore), which is suitable for development but will reset on server restart
- For production, consider using a persistent session store (e.g., connect-pg-simple with PostgreSQL)
- External service integrations (Zadarma, Telegram, Twilio) are optional and the app will run without them
- The frontend is configured to work with Replit's proxy system (allowedHosts: true)
