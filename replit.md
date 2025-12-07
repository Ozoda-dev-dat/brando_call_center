# Brando Call Center CRM

## Overview
A full-stack call center CRM application built with React + Express that integrates with Zadarma for WebRTC calling capabilities and Telegram for order notifications to masters.

## Project Structure
```
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Route pages
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities
├── server/               # Express backend
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database operations
│   ├── zadarma-service.ts # Zadarma integration
│   ├── tickets-service.ts # Ticket management
│   └── telegram-service.ts # Telegram bot integration
├── shared/               # Shared types and schema
│   └── schema.ts         # Drizzle ORM schema
└── dist/                 # Production build output
```

## Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, Radix UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time**: WebSocket for live updates
- **VoIP**: Zadarma WebRTC widget integration

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run db:push` - Push database schema changes

## Demo Accounts
- **Admin**: admin / admin2233
- **Operator**: operator / callcenter123
- **Master**: master / MS123

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `ZADARMA_SIP` - Zadarma SIP extension
- `ZADARMA_WEBRTC_KEY` - Zadarma WebRTC API key

## User Roles
1. **Admin** - Full access to all features including user management
2. **Operator** - Handles incoming calls, creates tickets, manages customers
3. **Master** - Receives and handles assigned service tickets

## Features
- Real-time incoming call handling with WebRTC
- Ticket/order management system
- Customer database
- Service center management
- Master assignment and notification via Telegram
- Analytics dashboard and reports
