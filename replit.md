# Brando CRM - Call Center Management System

## Overview
This is a comprehensive CRM and Call Center Management System built with React (frontend) and Express (backend). The system is designed to manage customer service tickets, handle incoming/outgoing calls, and coordinate between operators and service masters.

## Tech Stack
- **Frontend**: React + TypeScript, Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon via Replit)
- **ORM**: Drizzle ORM
- **External Integrations**: Zadarma (calls), Telegram (notifications), Twilio (optional)

## Project Structure
- `client/` - React frontend application
  - `src/components/` - UI components
  - `src/pages/` - Page components
  - `src/hooks/` - Custom React hooks
- `server/` - Express backend
  - `routes.ts` - API endpoints
  - `storage.ts` - Database operations
  - Service files for external integrations
- `shared/` - Shared schemas and types
- `migrations/` - Database migrations (auto-generated)

## Setup (Completed on 2024-12-08)
1. ✅ PostgreSQL database created and configured via Replit
2. ✅ Database schema pushed using `drizzle-kit push`
3. ✅ Environment variables configured (SESSION_SECRET, DATABASE_URL)
4. ✅ Dependencies installed
5. ✅ Development workflow configured on port 5000
6. ✅ Deployment settings configured for autoscale

## Default Users (Seeded)
The application comes with three pre-configured users:
- **Admin**: username: `admin`, password: `admin2233`
- **Operator**: username: `operator`, password: `callcenter123`
- **Master**: username: `master`, password: `MS123`

## Running the Application

### Development
The application is configured to run automatically via the "Start application" workflow.
- Frontend and backend run together on port 5000
- Vite dev server with HMR (hot module replacement)
- Command: `npm run dev`

### Production Build
```bash
npm run build  # Builds frontend and backend
npm start      # Runs production server
```

## Environment Variables

### Required (Already Configured)
- `DATABASE_URL` - PostgreSQL connection string (set by Replit)
- `SESSION_SECRET` - Session encryption key (set)
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (5000)

### Optional API Keys (Not Required for Basic Functionality)
- `ZADARMA_API_KEY` - For Zadarma call integration
- `ZADARMA_SECRET_KEY` or `ZADARMA_API_SECRET` - Zadarma authentication (either name works)
- `ZADARMA_SIP` - SIP extension for outgoing calls
- `TELEGRAM_BOT_TOKEN` - For Telegram notifications to masters
- `MASTER_TELEGRAM_MAP` - JSON mapping of master IDs to Telegram chat IDs
- `TWILIO_ACCOUNT_SID` - Optional Twilio integration
- `TWILIO_AUTH_TOKEN` - Twilio authentication
- `TWILIO_PHONE_NUMBER` - Twilio phone number

## Database Management
```bash
npm run db:push  # Push schema changes to database
npm run check    # Type check TypeScript
```

## Features
- User authentication with role-based access (admin, operator, master)
- Ticket management system
- Call handling (incoming/outgoing)
- Real-time updates via WebSockets
- Dashboard with metrics
- Customer management
- Service center tracking
- Master assignment and tracking
- Telegram integration for notifications

## Recent Changes
- 2024-12-08: Updated schema to match existing Render database
  - Changed from `tickets` table to `orders` table to match existing database structure
  - Updated all column names to match existing database (client_name, client_phone, address, etc.)
  - Changed ID type from varchar/UUID to serial (auto-increment integer)
  - Added `masters` table schema for foreign key support
  - Updated storage, services, and routes to use numeric IDs

- 2024-12-08: Fixed session/authentication issues for proxy environments
  - Added `trust proxy` setting to Express for proper cookie handling behind reverse proxies
  - Fixed session cookie sameSite setting to 'lax' for CSRF protection
  - Updated Zadarma service to accept both `ZADARMA_SECRET_KEY` and `ZADARMA_API_SECRET` env vars
  - Added missing `credentials: 'include'` to all fetch calls in CallsPanel
  
- 2024-12-08: Initial Replit setup completed
  - Database provisioned and migrated
  - Environment configured
  - Workflow set up on port 5000
  - Deployment configured for autoscale
  - Added .gitignore for Node.js project

## User Preferences
(To be updated as preferences are expressed)

## Notes
- The application uses Vite's development server in dev mode, which is already configured to work with Replit's proxy
- WebSocket HMR warnings in browser console are expected and don't affect functionality
- All database operations use Drizzle ORM - never write raw SQL migrations
- The system supports both development and production environments
