# Brando CRM

A call center CRM application built with React, Express, and PostgreSQL.

## Overview

This is a CRM system for managing call center operations with features for:
- User authentication (admin, operator, master roles)
- Ticket/order management
- Customer management
- Reports and dashboard metrics
- Telephony integration (Zadarma, Twilio, OnlinePBX)

## Tech Stack

- **Frontend**: React 18 with TypeScript, Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query

## Project Structure

```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities and helpers
│   │   └── data/        # Mock data
│   └── public/          # Static assets
├── server/           # Express backend
│   ├── app.ts           # Express app setup
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   └── *-service.ts     # Service modules
├── shared/           # Shared types and schemas
│   └── schema.ts        # Drizzle database schema
└── vite.config.ts    # Vite configuration
```

## Development

Run the development server:
```bash
npm run dev
```

This starts both the Express backend and Vite dev server on port 5000.

## Database

Push schema changes:
```bash
npm run db:push
```

## Demo Credentials

- **Admin**: admin / admin2233
- **Operator**: operator / callcenter123
- **Master**: master / MS123

## Telephony Integrations

### OnlinePBX Integration

OnlinePBX (panel.onlinepbx.ru) integration allows:
- Viewing call history from your PBX
- Real-time incoming call notifications via webhooks
- Click-to-call functionality
- Call recording playback

Required environment variables:
- `ONLINEPBX_DOMAIN` - Your OnlinePBX domain (e.g., yourcompany.onpbx.ru)
- `ONLINEPBX_API_KEY_ID` - API key ID from OnlinePBX
- `ONLINEPBX_API_KEY` - API key from OnlinePBX

To get your API credentials:
1. Log in to https://panel.onlinepbx.ru
2. Go to Settings > API
3. Generate new API key
4. Copy the key_id and key values

Webhook URL for OnlinePBX: `https://your-domain/api/onlinepbx/webhook`

### Zadarma Integration

Required environment variables:
- `ZADARMA_API_KEY` - Zadarma API key
- `ZADARMA_API_SECRET` or `ZADARMA_SECRET_KEY` - Zadarma API secret
- `ZADARMA_SIP` - SIP extension for WebRTC widget

## Deployment

The application is configured for autoscale deployment:
- Build: `npm run build` (Vite build + esbuild for server)
- Start: `npm run start` (Runs production Express server)
