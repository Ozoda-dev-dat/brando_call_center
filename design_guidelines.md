# Brando Call Center CRM - Design Guidelines

## Design Approach
**System-Based Design** utilizing clean, minimal aesthetic inspired by modern enterprise applications (Linear, Notion, Stripe dashboard patterns). This is a utility-focused CRM prioritizing efficiency, data density, and operational clarity.

## Core Aesthetic Principles
- **Clean & Minimal Light Theme**: Crisp white backgrounds with subtle gray dividers
- **Information Density**: Maximize data visibility without clutter
- **Functional Clarity**: Every element serves operational purpose
- **Alert-First Design**: Critical information (fraud alerts, SLA timers) demands immediate attention

## Typography System

**Primary Font**: Inter (via Google Fonts CDN)

**Type Scale**:
- Page Headers: text-2xl font-semibold (24px)
- Section Headers: text-lg font-semibold (18px)
- Card Titles: text-base font-medium (16px)
- Body Text: text-sm (14px)
- Labels/Meta: text-xs font-medium uppercase tracking-wide (12px)
- Data Points: text-3xl font-bold for metrics, text-sm for labels

**Hierarchy Rules**:
- Use font-semibold for all headers
- Body text remains font-normal
- Uppercase labels for form fields and section identifiers

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8 (p-4, gap-6, m-8)

**Grid Structure**:
- Sidebar: Fixed 240px width (w-60)
- Main Content: flex-1 with max-width constraints per panel
- Cards: p-6 standard padding
- Form Fields: space-y-4 vertical rhythm
- Section Gaps: gap-6 for card grids

**Layout Patterns**:
- Left Sidebar Navigation (fixed, always visible)
- Top Action Bar (sticky when needed)
- Main Content Area (scrollable, white background)
- Overlay Modals (incoming calls, alerts)

## Component Library

### Navigation
**Sidebar Menu**:
- Vertical list with icons (Lucide icons)
- Active state: bg-blue-50 text-blue-600 with left border-l-4 border-blue-600
- Inactive: text-gray-600 hover:bg-gray-50
- Icons: 20px size, aligned left with 12px gap to label

### Data Display
**Cards**: White background, border border-gray-200, rounded-lg, shadow-sm, p-6
**Tables**: Striped rows (even:bg-gray-50), border-b dividers, sticky headers
**Stat Cards**: Large number (text-3xl font-bold), small label below, trend indicators with icons
**Status Badges**: Rounded-full px-3 py-1 text-xs font-medium with semantic colors

### Forms
**Input Fields**: border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
**Labels**: text-sm font-medium text-gray-700 mb-1
**Required Fields**: Red asterisk after label
**Select Dropdowns**: Match input styling with chevron-down icon

### Alerts & Notifications
**Fraud Alerts (Critical)**: bg-red-50 border-l-4 border-red-600 text-red-900, bold severity label
**SLA Warnings**: bg-yellow-50 with yellow-600 accents
**Success States**: bg-green-50 with green-600 accents
**Info**: bg-blue-50 with blue-600 accents

### Progress Tracking
**12-Step Timeline**: Horizontal or vertical line connecting circular step nodes
- Completed: bg-green-500 fill with checkmark
- Active: bg-blue-600 with pulse animation
- Pending: bg-gray-300 outline only
- Icons within each node (16px)

### Mobile Preview
**Phone Mockup**: Rounded-3xl border-8 border-gray-800 with aspect-ratio-9/16, shadow-2xl
- Screen content: Full app interface scaled down
- GPS map visualization, photo upload placeholders, signature pad

### Dashboard Elements
**Metric Cards**: Grid layout (grid-cols-4 gap-6)
**Charts**: Use Chart.js or Recharts with blue-600 primary, red-600 for alerts
**Real-time Indicators**: Pulse animation for live data, timestamp labels

## Uzbek Language Implementation
All UI text in Uzbek with proper character support. Maintain Latin script readability with adequate letter-spacing.

## Critical Design Rules

**Fraud Detection Emphasis**:
- All fraud triggers: bg-red-50 or bg-red-100 backgrounds
- Red text: text-red-700 or text-red-900
- Red borders: border-red-500 or border-red-600
- Icons: AlertTriangle, XCircle in red

**Panel-Specific Layouts**:
- Operator Panel: 3-column layout (sidebar, main, mobile preview)
- Masters Panel: Table view with expandable rows for metrics
- Tickets Panel: Kanban board or list with filters
- Dashboard: 2x2 or 3x3 metric grid with charts below

**Interaction States**:
- Hover: bg-gray-50 for rows, slight shadow lift for cards
- Active: bg-blue-50 with blue accents
- Disabled: opacity-50 cursor-not-allowed
- Loading: Skeleton screens with animate-pulse

## Icon System
**Lucide React** icons exclusively - 20px default, 24px for headers, 16px for inline elements.

Key icons: Headphones, FileText, Users, MapPin, UserCheck, LayoutDashboard, Settings, Phone, CheckCircle, AlertTriangle, Clock, TrendingUp, Camera, MapPin

## Animations
**Minimal and Purposeful**:
- Incoming call popup: slide-down from top with subtle bounce
- SLA timer alerts: gentle pulse when approaching deadline
- Progress step completion: checkmark fade-in
- No page transitions, instant panel switching

## Accessibility
- Contrast ratio 4.5:1 minimum for all text
- Focus rings on all interactive elements (ring-2 ring-blue-500)
- ARIA labels for icon-only buttons
- Screen reader announcements for fraud alerts

This CRM demands clarity, speed, and operational precision. Every design decision serves the call center operator's workflow efficiency.