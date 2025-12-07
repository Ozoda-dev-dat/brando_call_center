# Overview

This is a Brando CRM application designed for a call center managing home appliance repair services. The system handles incoming customer calls, creates service tickets, assigns work to field technicians (masters), tracks their progress via GPS, enforces quality control through photo documentation, manages payments, and includes fraud detection mechanisms to ensure service quality and honesty.

The application serves three user roles:
- **Operators**: Handle incoming calls, create tickets, assign masters
- **Masters**: Field technicians who receive assignments, update job status via mobile app
- **Admins**: Full system access including user management, fraud alert resolution, and system configuration

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**UI Components**: shadcn/ui component library built on Radix UI primitives, styled with Tailwind CSS. The design system uses a "new-york" style with CSS variables for theming and supports both light and dark modes.

**Routing**: Wouter for client-side routing with role-based access control. Different user roles see different navigation options and pages.

**State Management**: TanStack Query (React Query) for server state management with optimistic updates and caching. Local component state managed with React hooks.

**Authentication**: Session-based authentication using express-session with cookie storage. Auth state managed through React Context (AuthContext) and checked on mount.

**Real-time Communication**: WebSocket connection for incoming call notifications to operators. Protocol automatically switches between ws:// and wss:// based on environment.

**Component Organization**:
- `/pages` - Route-level components (one per URL)
- `/components` - Reusable UI components and panels
- `/components/ui` - shadcn/ui base components
- `/hooks` - Custom React hooks including auth and mobile detection
- `/lib` - Utility functions and query client configuration
- `/data` - Mock data for development (mockData.ts)

**Path Aliases**: TypeScript path mapping configured for clean imports:
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`

## Backend Architecture

**Runtime**: Node.js with Express.js framework, using ES modules (type: "module").

**Development Mode**: Vite middleware integration for HMR and SSR template transformation. Development server runs with tsx for TypeScript execution.

**Production Mode**: Client built to `dist/public`, server bundled with esbuild to `dist/index.js`.

**Session Management**: express-session with MemoryStore for session persistence. Sessions include userId, username, role, and masterId.

**API Structure**: RESTful endpoints under `/api` prefix:
- `/api/auth/*` - Authentication (login, logout, session check)
- `/api/zadarma/*` - Phone system integration
- `/api/telegram/*` - Telegram bot webhooks
- WebSocket endpoint `/ws` for real-time call notifications

**Business Logic Services**:
- `storage.ts` - Database abstraction layer implementing IStorage interface
- `zadarma-service.ts` - VoIP phone system integration with API signature generation
- `telegram-service.ts` - Telegram bot for master notifications with inline keyboards
- `tickets-service.ts` - In-memory ticket management (not yet database-backed)
- `twilio-service.ts` - Alternative phone system (appears to be replaced by Zadarma)

**Middleware**: 
- JSON body parsing with raw body buffer for webhook signature verification
- Request/response logging for API endpoints
- Session middleware applied globally

**Error Handling**: HTTP status codes with JSON error messages. 401 handling in query client.

## Data Storage Solutions

**Database**: PostgreSQL accessed via Neon serverless driver with WebSocket support (required for serverless environments).

**ORM**: Drizzle ORM with schema defined in `shared/schema.ts`. Migrations stored in `/migrations` directory.

**Current Schema**:
- `users` table: id (UUID), username (unique), password (plaintext - security concern), fullName, role (admin|operator|master), masterId (for linking masters), timestamps

**Schema Validation**: Zod schemas generated from Drizzle schema using drizzle-zod for runtime validation.

**Development Approach**: Database schema pushed directly using `drizzle-kit push` (no migration files generated yet).

**Session Storage**: In-memory store (MemoryStore) - sessions lost on server restart. Not suitable for production multi-instance deployment.

**Ticket Storage**: Currently in-memory Map in tickets-service.ts - not persisted to database yet. This is a critical architectural gap.

**User Seeding**: Initial admin, operator, and master users created on startup via seed.ts.

## Authentication and Authorization

**Authentication Method**: Username/password with session cookies. Passwords stored in plaintext (major security vulnerability).

**Session Configuration**:
- Secret: Environment variable SESSION_SECRET with fallback
- Cookie: httpOnly, sameSite strict, 24-hour expiration
- Secure flag enabled in production only

**Authorization Model**: Role-based permissions defined in `client/src/lib/permissions.ts`. Each role (admin, operator, master) has specific permission flags controlling UI visibility and actions.

**Permission Examples**:
- Operators can create tickets and view customer data
- Masters can upload photos and collect signatures (mobile app)
- Admins have full access including fraud alert resolution and user management

**Protected Routes**: Auth check on app mount redirects to login if no session. Role-based route filtering in Sidebar component.

**API Security**: Session middleware applied to all routes. Individual endpoints check req.session.userId and req.session.role as needed.

**Missing Security Features**: 
- No password hashing (bcrypt/argon2)
- No CSRF protection
- No rate limiting on authentication endpoints
- No API key validation for webhooks

## External Dependencies

**Phone System**: Zadarma VoIP service for incoming calls and WebRTC widget. Requires API key and secret for signature-based authentication. Dynamic WebRTC keys fetched per page load. Widget scripts loaded from Zadarma CDN in index.html.

**Telegram Bot**: Telegram Bot API for sending job notifications to masters with inline keyboards (accept/reject). Bot token and master-to-chatId mapping stored in environment variables as JSON.

**Database**: Neon PostgreSQL serverless with WebSocket connection (configured via DATABASE_URL environment variable).

**Fonts**: Google Fonts CDN for Inter font family.

**Replit Integration**: Development environment includes Replit-specific Vite plugins:
- Runtime error overlay modal
- Cartographer (code intelligence)
- Dev banner
These plugins are conditionally loaded only in Replit development environment.

**Payment System**: References to payment blocking and pending states in schema, but no payment gateway integration implemented yet.

**GPS/Maps**: Location tracking referenced in schema (gpsLocation with lat/lng) but no maps API integration visible.

**SMS**: References to SMS templates in permissions but no SMS service integration implemented.

**Image Storage**: Photo upload functionality referenced (photosBefore, photosAfter in schema) but no cloud storage service configured (S3, Cloudinary, etc.).

**Environment Variables Required**:
- DATABASE_URL (Neon PostgreSQL)
- SESSION_SECRET (session encryption)
- ZADARMA_API_KEY, ZADARMA_API_SECRET (phone system)
- TELEGRAM_BOT_TOKEN (Telegram notifications)
- MASTER_TELEGRAM_MAP (JSON mapping master IDs to Telegram chat IDs)
- TWILIO_* variables (legacy, may not be in use)