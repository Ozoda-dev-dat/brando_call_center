# Brando CallCenter CRM

## Overview
A beautiful CallCenter CRM reporting application for managing orders and technicians. Data flows from your Telegram bot into the PostgreSQL database, and is displayed through stunning dashboards and reporting pages. Built with React, Express, TypeScript, and PostgreSQL.

## Key Features
- **Beautiful Dashboards**: Real-time statistics with charts and metrics
- **Reporting Pages**: Detailed analytics and CSV export capabilities
- **Data Visualization**: Order status distribution, product breakdown, technician activity
- **Multi-role Support**: Admin, Operator, and Technician accounts
- **Real-time Data**: Data from Telegram bot automatically synced to database

## Accessing Reports
1. **Login**: Use demo accounts:
   - Admin: username "admin" | password "admin"
   - Operator: username "operator" | password "operator"  
   - Technician: username "master" | password "master"

2. **View Dashboards**:
   - Dashboard page: Shows key metrics, order status charts, technician list
   - Reports page: Detailed analytics, product breakdown, CSV export

## Project Architecture

### Directory Structure
- `client/src/` - React frontend with components and pages
  - `pages/` - Dashboard, Reports, Tickets, Customers, Masters, Admin pages
  - `components/` - DashboardPanel, ReportsPanel, TicketsPanel, etc.
- `server/` - Express backend with API routes
- `shared/` - Database schema using Drizzle ORM
- `migrations/` - Database schema versioning

### Key Technologies
- **Frontend**: React 18, Vite, TailwindCSS, shadcn/ui, Recharts (visualizations)
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Express session + Passport.js
- **Real-time**: WebSocket support for live updates

### API Endpoints
- `GET /api/stats` - Dashboard statistics (all orders, masters, metrics)
- `GET /api/tickets` - List all orders/tickets
- `GET /api/masters` - List all technicians
- `GET /api/customers` - Distinct customers from orders (searchable)

### Database Tables
- `users` - Admin and operator accounts
- `orders` (aka tickets) - Service orders from Telegram bot
- `masters` - Technician profiles with location data
- `clients` - Customer information

## Running Locally
```bash
npm install          # Install dependencies
npm run dev          # Start dev server on port 5000
npm run db:push      # Push database schema changes
npm run build        # Build for production
npm run start        # Start production server
```

## Deployed Configuration
- **Deployment Type**: Autoscale (serverless)
- **Build**: `npm run build` - Builds frontend and backend
- **Run Command**: `npm run start`
- **Database**: PostgreSQL via Replit native database

## Recent Changes
- December 23, 2025: Full environment setup completed
  - PostgreSQL database created and configured
  - Frontend workflow running on port 5000
  - Dashboard and Reports pages pulling real data from `/api/stats` endpoint
  - Autoscale deployment configured for production
  - CSV export functionality enabled for reports

## Next Steps
- Your Telegram bot data will automatically appear in the dashboard
- Monitor orders in real-time via the Tickets page
- Export reports as CSV from the Reports page
- Customize dashboard metrics and styling as needed

## User Preferences
- Language: Uzbek (O'zbek)
- Features: Beautiful data visualization, real-time updates, reporting
