# Brando Call Center CRM

## Overview

Brando Call Center CRM is a comprehensive customer relationship management system designed specifically for appliance repair service call centers. The application manages the complete lifecycle of service tickets from initial customer call through master assignment, field service, payment processing, and quality control. It features real-time GPS tracking, fraud detection, and role-based access control for administrators, operators, and field technicians (masters).

The system emphasizes operational efficiency through a clean, minimal interface inspired by modern enterprise applications (Linear, Notion, Stripe). It prioritizes information density and alert-first design to ensure critical information like fraud alerts and SLA timers receive immediate attention.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing instead of React Router

**UI Component Strategy**
- shadcn/ui component library (Radix UI primitives) configured in "new-york" style
- Tailwind CSS with custom design tokens defined in CSS variables for theming
- Component path aliases (@/components, @/lib, @/hooks) for clean imports
- Light theme as primary with dark mode support via ThemeProvider context

**State Management**
- TanStack Query (React Query) for server state management and caching
- React Context API for authentication state (AuthContext)
- Session-based authentication with cookie credentials

**Design System**
- Inter font family from Google Fonts
- Neutral base color palette with HSL color system
- Custom elevation system (hover-elevate, active-elevate classes)
- Spacing based on Tailwind's 4px unit system (2, 4, 6, 8)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for API routes
- Dual-mode server setup: development (index-dev.ts with Vite integration) and production (index-prod.ts serving static files)
- Session-based authentication using express-session with MemoryStore

**API Design**
- RESTful endpoints under /api prefix
- Session middleware protecting authenticated routes
- Authentication endpoints: /api/auth/login, /api/auth/me, /api/auth/logout
- Role-based authorization (admin, operator, master)

**Development vs Production**
- Development: Vite middleware integrated into Express for HMR
- Production: Pre-built static assets served from dist/public
- Environment-specific entry points prevent code duplication

### Database & Data Layer

**ORM & Database**
- Drizzle ORM configured for PostgreSQL dialect
- Neon serverless PostgreSQL as the database provider
- WebSocket connection using ws library for Neon compatibility
- Database schema defined in shared/schema.ts for type sharing between client and server

**Schema Design**
- Users table with role-based access control (admin, operator, master)
- UUID primary keys generated via gen_random_uuid()
- Zod schemas derived from Drizzle schemas for runtime validation
- Shared types exported from @shared/schema for client-server consistency

**Data Access Pattern**
- Storage abstraction layer (IStorage interface) for testability
- DatabaseStorage implementation using Drizzle queries
- Seeding system for initial user creation (admin, operator, master accounts)

### Authentication & Authorization

**Session Management**
- express-session with secure HTTP-only cookies
- Session secret configurable via environment variable
- 24-hour session expiration
- CSRF protection via sameSite: 'strict' cookie policy

**Role-Based Access Control**
- Three user roles: admin, operator, master
- Frontend route protection based on user role
- Server-side session validation on protected endpoints
- User seeding with default credentials for each role

**Detailed Permission Matrix**

The system implements fine-grained permissions for each role across all features:

*Admin Role* (role: admin)
- Full system access including user management, service center configuration
- Can approve price lists, configure fraud triggers, and adjust honesty scores
- Can reopen closed tickets and make quality control calls
- Full access to dashboard statistics and fraud alerts
- Can edit SMS templates

*Operator Role* (role: operator)
- Full access to operator panel for handling incoming calls
- Can create and manage tickets with limited status changes
- Full customer data access and warranty checking
- Can view fraud alerts as warnings
- Own metrics visible on dashboard
- Can make quality control calls

*Master Role* (role: master)
- Mobile app access for field service
- Can only update own ticket statuses: On the way → Arrived → Before/After photo → Close
- Mandatory photo uploads (before/after) and GPS tracking
- Can collect electronic signatures from customers
- Can add payments for out-of-warranty items (blocked for warranty items)
- Limited customer data access (only current job's customer)
- Own rating/statistics visible on dashboard
- Can only see own fraud alerts

**Default User Credentials**
- Admin: username=admin, password=admin2233
- Operator: username=operator, password=callcenter123
- Master: username=master, password=MS123

**Implementation Notes**

The role-based access control system is implemented with:
- Permission utility system in `client/src/lib/permissions.ts` defining all permissions per role
- Component-level permission checks that hide/disable UI elements based on user role
- Visual role indicators (badges) showing admin-only sections and view-only modes
- Fraud alert filtering by role (admin=all, operator=warnings, master=own alerts)

**Production Requirements**

For full production implementation, the following enhancements are needed:
- Add `masterId` field to user schema to properly link master users to their master records
- Implement server-side API permission checks to match client-side permissions
- Add audit logging for permission-sensitive actions (price approval, fraud resolution, honesty score adjustments)
- Implement proper ticket status workflow restrictions based on role

**Feature-by-Feature Permission Matrix**

| Feature / Screen | ADMIN | OPERATOR | MASTER | Notes |
|-----------------|-------|----------|---------|-------|
| Login to system | Yes | Yes | Yes | All roles can authenticate |
| Operator panel (incoming call popup + script) | View only | Full access | No access | Only active operators receive calls |
| Create new ticket | Yes | Yes | No | Operators handle ticket creation |
| View / edit customer card (CDP) | Yes | Yes | Only current job's customer | Master sees only assigned customer |
| Check warranty by serial number | Yes | Yes | Read-only | Masters cannot modify warranty status |
| Change ticket status | Yes | Limited statuses | Only own statuses | Masters: On the way → Arrived → Before/After photo → Close |
| Upload Before / After photos | No | No | Yes (mandatory) | Required for job completion |
| Add payment | Can unblock only | No | Yes (if not under warranty) | Payment blocked automatically on warranty items |
| Collect electronic signature | No | No | Yes | Required from customer at job completion |
| GPS tracking / route display | No | No | Yes (mandatory) | Real-time location tracking for masters |
| Service centers list (add/edit/delete) | Yes | No | No | Admin-only configuration |
| Masters management (add/block/unblock) | Yes | No | No | Admin-only user management |
| Approve price list | Yes | No | No | Admin-only pricing control |
| Configure fraud triggers | Yes | No | No | Admin sets distance, time thresholds |
| Manually adjust honesty score / penalty points | Yes | No | No | Admin can override scores |
| Reopen closed tickets | Yes | No | No | Admin can reopen for quality issues |
| Real-time dashboard (full statistics) | Yes | Own metrics only | Own rating only | Role-scoped visibility |
| View fraud alerts & HOLD tickets | Yes | Warning only | Only own alerts | Different alert severity by role |
| Make control (quality) call to customer | Yes | Yes | No | Post-service quality assurance |
| Edit SMS templates | Yes | No | No | Admin-only template management |

### External Dependencies

**Third-Party UI Libraries**
- Radix UI primitives (@radix-ui/*) for accessible component foundations
- Lucide React for icon system
- Recharts for data visualization and analytics dashboards
- cmdk for command palette functionality
- Embla Carousel for carousel components

**Database & Infrastructure**
- Neon serverless PostgreSQL (@neondatabase/serverless)
- Database connection pooling via Neon's Pool
- WebSocket support for real-time database connections

**Development Tools**
- Replit-specific plugins for development experience (@replit/vite-plugin-*)
- dotenv for environment variable management
- tsx for TypeScript execution in development
- esbuild for production server bundling

**Styling & Forms**
- Tailwind CSS with PostCSS and Autoprefixer
- class-variance-authority for component variant management
- React Hook Form with Zod resolvers for type-safe form validation
- date-fns for date manipulation

**Build & Deployment**
- Cross-env for cross-platform environment variables
- Separate build commands for client (Vite) and server (esbuild)
- Static file serving in production mode
- Database migrations via drizzle-kit push command