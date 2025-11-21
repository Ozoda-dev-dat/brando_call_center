# Brando Call Center CRM

## Overview
Brando CRM is a comprehensive Customer Relationship Management system designed specifically for call centers managing service technicians and repair tickets. The application prioritizes efficiency, data density, and operational clarity with a focus on fraud detection and real-time monitoring.

**Current State**: Fully functional and running in development mode on Replit

## Recent Changes
- **2025-11-21**: GitHub import setup completed
  - Updated @types/node to v22.12.0 for Vite 7 compatibility
  - Configured PostgreSQL database with Drizzle ORM
  - Updated drizzle.config.ts to use new v0.39+ format (added dialect and dbCredentials)
  - Created .gitignore for Node.js project
  - Configured deployment settings for autoscale deployment
  - Application running successfully on port 5000

## Project Architecture

### Technology Stack
- **Frontend**: React 18 + Vite 7 + TypeScript
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (Neon Serverless) + Drizzle ORM
- **UI Library**: Tailwind CSS + Radix UI components
- **State Management**: TanStack React Query
- **Authentication**: Express Session with in-memory store
- **Routing**: Wouter (lightweight React router)

### Project Structure
```
├── client/               # Frontend React application
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # React components (UI library + feature components)
│       ├── data/        # Mock data for development
│       ├── hooks/       # Custom React hooks
│       ├── lib/         # Utility libraries
│       └── pages/       # Page components
├── server/              # Backend Express application
│   ├── app.ts          # Express app configuration
│   ├── index-dev.ts    # Development server with Vite middleware
│   ├── index-prod.ts   # Production server with static file serving
│   ├── routes.ts       # API route definitions
│   ├── seed.ts         # Database seeding logic
│   └── storage.ts      # Database access layer (Drizzle)
├── shared/              # Shared types and schemas
│   ├── crm-schema.ts   # Application domain schemas
│   └── schema.ts       # Database schema definitions
└── migrations/          # Database migration files (generated)
```

### Key Features
1. **User Authentication**: Role-based access control (admin, operator, master)
2. **Ticket Management**: Create, track, and manage service tickets with 12-step workflow
3. **Customer Management**: Customer profiles with service history
4. **Technician (Master) Management**: Performance tracking, availability, fraud detection
5. **Service Center Management**: Location tracking and coverage areas
6. **Fraud Detection**: Real-time alerts for suspicious activities
7. **Reporting & Analytics**: Daily/weekly/monthly performance metrics
8. **Dashboard**: KPI tracking (orders, revenue, satisfaction, fraud)
9. **Mobile Preview**: Visual representation of technician mobile app
10. **Theme Support**: Light/dark mode with user preferences

### Database Schema
The application uses a PostgreSQL database with the following main tables:
- **users**: User accounts with roles (admin, operator, master)

Currently, the application uses mock data for development. Additional tables for tickets, customers, masters, and service centers are defined in `shared/crm-schema.ts` but not yet migrated to the database.

## Environment Variables
The application requires the following environment variables:
- `DATABASE_URL`: PostgreSQL connection string (automatically provided by Replit)
- `PORT`: Server port (defaults to 5000)
- `NODE_ENV`: Environment mode (development/production)
- `SESSION_SECRET`: Session encryption secret (defaults to 'brando-crm-secret-key-2024')

## Development Workflow

### Running the Application
```bash
npm run dev
```
The development server runs on port 5000 with Vite HMR (Hot Module Replacement) enabled.

### Database Commands
```bash
npm run db:push     # Push schema changes to database
```

### Building for Production
```bash
npm run build       # Build frontend and backend
npm start          # Run production server
```

### Demo Credentials
The application seeds three demo users on startup:
- **Admin**: username: `admin`, password: `admin2233`
- **Operator**: username: `operator`, password: `callcenter123`
- **Master**: username: `master`, password: `MS123`

## Design Guidelines
The application follows a clean, minimal aesthetic inspired by modern enterprise applications (Linear, Notion, Stripe). Key design principles:
- System-based design with light theme
- Information density without clutter
- Alert-first design for critical information
- Uzbek language UI with Latin script
- Lucide React icons throughout
- Tailwind CSS utility classes

## Deployment Configuration
The application is configured for autoscale deployment on Replit:
- **Build Command**: `npm run build`
- **Start Command**: `node dist/index.js`
- **Deployment Type**: Autoscale (stateless web application)

## User Preferences
- Language: Uzbek (Latin script) - all UI text in Uzbek
- Design: Clean, minimal, enterprise-focused
- Framework preferences: React + Express (full-stack TypeScript)
