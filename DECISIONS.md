# 🧠 Project Decisions

This document outlines the key architectural and implementation decisions for the Stock Tracker MVP, along with possible improvements to consider later.

---

## 1. 🧩 Tech Stack

### ✅ Chosen Tools

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS + ShadCN UI** for component styling
- **PostgreSQL (Neon serverless)** for the database
- **Drizzle ORM** for type-safe schema and queries

### ✅ ShadCN UI Integration

- **Component library**: Modern, accessible React components built on Radix UI
- **Customizable**: Uses CSS variables and Tailwind classes for easy theming
- **RSC-ready**: All components work with React Server Components
- **Production-ready**: Handles complex UX patterns (loading states, error handling)

### 🤔 Why

- **Development speed**: Pre-built components for search, tables, cards, badges reduce boilerplate
- **Accessibility**: Built-in ARIA compliance and keyboard navigation out of the box
- **Maintainability**: Consistent design system with full TypeScript support
- **Performance**: Tree-shakeable components, only imports what you use
- **Quality**: Battle-tested components used in production applications

---

## 2. 🔐 Authentication

### ✅ Approach

- External auth provider (StackFrame)
- Synced users through `usersSync`
- Separate `user_profiles` table for storing app-specific data like name and timestamps

### ✅ Layout Structure

- **Nested route groups for clean separation**
  - Root layout (`src/app/layout.tsx`) - minimal, just fonts and global styles
  - Public layout (`src/app/(public)/layout.tsx`) - for homepage, marketing pages (no auth)
  - Auth layout (`src/app/(auth)/layout.tsx`) - provides StackProvider for all authenticated pages
  - Dashboard layout (`src/app/(auth)/(dashboard)/layout.tsx`) - adds sidebar navigation for dashboard pages
  - Auth handler in `src/app/(auth)/handler/[...stack]/` - authentication flows without dashboard UI

**Why this structure:**

- **Performance**: Homepage and public pages render statically (○) instead of dynamic (ƒ)
- **Architecture**: Clean separation between public and authenticated routes
- **Auth context**: Only authenticated pages get StackProvider overhead
- **SEO**: Static homepage loads faster and is more SEO-friendly

### ✅ Route Protection

- **StackFrame Middleware**: Automatic route protection for authenticated areas
- **Protected Routes**: Settings and Watchlist pages require authentication - unauthenticated users are automatically redirected to sign-in
- **Conditional Navigation**: Sidebar shows "Sign In" button for unauthenticated users, "Settings" for authenticated users
- **User Context**: Server-side user detection using `stackServerApp.getUser()` for conditional rendering
- **Seamless Auth Flow**: Clicking watchlist when unauthenticated automatically navigates to sign-in page

**Why this approach:**

- **User Experience**: Seamless authentication flow without broken pages or error states
- **Security**: Server-side route protection prevents unauthorized access
- **Progressive Enhancement**: App works for both authenticated and unauthenticated users
- **Performance**: Conditional rendering reduces unnecessary API calls for unauthenticated users

---

## 3. 🎨 Design System

### ✅ Custom Color Scheme

- **Primary Color**: `#010537` (Dark Navy) - Used for headings, borders, and primary elements
- **Accent Color**: `#8b56ef` (Purple) - Used for highlights, CTAs, and interactive elements
- **Background**: White/Black - Clean, high-contrast foundation
- **Implementation**: OKLCH color space in CSS variables for better color mixing

### ✅ ShadCN Dashboard

- **Sidebar Navigation**: Responsive sidebar with mobile hamburger menu
- **Navigation Items**: Overview, Search Stocks, My Watchlist, Settings
- **Active States**: Purple accent highlighting with smooth transitions
- **Mobile UX**: Auto-closing sidebar on navigation, proper touch targets
- **Breadcrumbs**: Dynamic breadcrumb navigation based on current route

### 🤔 Why

- **Accessibility**: High contrast ratios meeting WCAG AA standards
- **Brand Identity**: Professional navy conveys trust, purple adds modern touch
- **User Experience**: Familiar dashboard patterns with enhanced mobile behavior
- **Maintainability**: ShadCN components ensure consistent styling across the app

---

## 4. 🗄 Database Schema

### ✅ Tables

- `user_profiles`: Stores display name and timestamps
- `watchlist`: Tracks stocks per user

### ✅ Design Decisions

- `UNIQUE(user_id, symbol)` constraint on `watchlist` to prevent duplicates
- Index on `user_id` for faster lookups

### 🤔 Why

- Keeps schema minimal, clean, and efficient for the MVP use case

---

## 5. 📱 Dashboard Implementation

### ✅ Current Pages

- **Overview** (`/stocks`) - Main dashboard landing page with search functionality
- **My Watchlist** (`/watchlist`) - Personal stock tracking and management
- **Settings** (`/settings`) - MVP placeholder with logout functionality, future expansion planned

### ✅ Technical Implementation

- **Server Components**: Static rendering for initial page loads
- **Client Components**: Interactive elements (search, navigation state)
- **Mobile-First**: Responsive design with touch-friendly interfaces
- **Progressive Enhancement**: Works without JavaScript, enhanced with it

### ✅ Server vs Client Component Decisions

- **Dashboard Sidebar**: Client Component (`"use client"`)
  - Requires `usePathname()` for active navigation highlighting
  - Uses `useSidebar()` hook for mobile sidebar state management
  - Implements `setOpenMobile(false)` for auto-closing mobile sidebar
  - Interactive hover states and navigation UX
- **Stock Search**: Client Component with SWR for debounced search (300ms) and 5-minute caching
  - **Finnhub Symbol Search API** with clean React hook abstraction (switched from Alpha Vantage to avoid API rate limits)
  - SWR (by Vercel) chosen for automatic caching and deduplication
  - Perfect for search: prevents duplicate API calls for same query and caches results across user sessions
- **Stock Data Fetching**: Hybrid API strategy optimizing each service's strengths
  - **Alpha Vantage API**: Primary data source for company overviews, stock quotes, historical data, and market status
    - **US Market Focus**: Alpha Vantage primarily supports US exchanges (NYSE, NASDAQ) - international stocks often default to US market data
    - Company Overview endpoint provides comprehensive fundamental data (P/E ratio, EPS, market cap, sector/industry) with 6-hour cache
    - Global Quote API for current stock prices and daily metrics (15-minute cache)
    - Historical daily price data with 15-minute cache following trading app patterns
    - Market Status API for US market open/close status (no caching for critical timing)
  - **Finnhub WebSocket**: Real-time price feeds (Alpha Vantage lacks WebSocket support)
    - Live trade data via custom React hook (`src/hooks/use-finnhub-websocket`)
    - WebSocket logic encapsulated in hooks for reusability and automatic React lifecycle management
    - Smart data fetching: WebSocket for live data when US market open, fallback to Alpha Vantage quote API when closed
    - **Price Change Indicators**: Real-time visual feedback with green/red arrows and price coloring for live price movements
  - Consistent fetch() approach for REST APIs to preserve Next.js 15 benefits
  - 1D intraday timeframe requires additional API endpoint - deferred for MVP scope, shows product judgment over feature completeness
- **Market Status**: US-focused market timing with simplified implementation
  - Alpha Vantage Market Status API for US market open/close status (no caching for critical timing)
  - **US Market Only**: Application focus shifted to US markets exclusively due to Alpha Vantage limitations
  - Exchange names (NYSE, NASDAQ) displayed from company data with unified US market hours (9:30 AM - 4:00 PM ET)
  - Simplified market detection using `getUSMarketStatus()` function for cleaner code
- **Page Content**: Server Components by default for better performance and SEO
- **Interactive Elements**: Isolated to minimal Client Components (buttons, forms)
- **Server Actions**: Next.js 15 server actions for secure, type-safe backend operations
  - **Watchlist Management**: `src/actions/watchlist.ts` handles add/remove/check operations with proper authentication
  - **Clean Architecture**: Pages → Server Actions → Database Queries (proper separation of concerns)
  - **Usage Pattern**: Server actions primarily used for database mutations in client components (add/remove from watchlist)
    - Server Components call database queries directly for data fetching (better performance, no network roundtrip)
    - Client Components use server actions for user interactions that modify data (proper progressive enhancement)
  - **Caching Strategy**: `unstable_cache` with granular invalidation using `revalidateTag`
    - User-specific cache keys: `watchlist-${userId}` for full watchlist data
    - Symbol-specific cache keys: `watchlist-${userId}-${symbol}` for individual symbol checks
    - Smart invalidation: Only affected caches are cleared when watchlist changes
  - **Error Handling**: Consistent try/catch patterns with user-friendly error messages
  - **TypeScript Integration**: Full type safety from frontend to database operations

### 🤔 Current Status

- **Fully Functional MVP**: Complete stock tracking application with real-time data
- **Core Features Complete**: Stock search, watchlist management, historical charts, live prices
- **Authentication**: Integrated with StackFrame for secure user management
- **Real-time Updates**: WebSocket integration for live market data
- **Production Ready**: Deployed and functional with proper error handling and caching

---

## 6. 🔐 Row-Level Security (RLS)

### ✅ Current Status

- **Not implemented for MVP**

### 📌 Future Consideration

- RLS (e.g. `crudPolicy`, `authUid`) deferred for now
- Could be introduced later for database-enforced multi-user isolation

---

## 7. 🗃 Database Client Setup

### ✅ Approach

- Using `@neondatabase/serverless` with Drizzle's HTTP client

---

## 📌 Future Improvements

| Feature               | Status    | Notes                                                                                                    |
| --------------------- | --------- | -------------------------------------------------------------------------------------------------------- |
| RLS Security          | Deferred  | Revisit if DB-level access control is needed                                                             |
| Notifications         | Future    | For alerts on tracked stocks                                                                             |
| Caching               | Completed | Using `unstable_cache` with granular invalidation                                                        |
| Charts / Visuals      | Completed | Line chart with multiple timeframes (1W, 1M, 3M, 1Y, All) - 1D disabled pending intraday API integration |
| Timezone Display      | Completed | Now shows "ET" (Eastern Time) for US markets - simplified from complex timezone mapping                  |
| International Markets | Future    | Currently US-focused due to Alpha Vantage limitations - consider additional APIs for global coverage     |
| Optimistic UI Updates | Future    | Add optimistic updates to watchlist button for instant feedback before server confirmation               |
| Error Toast Messages  | Future    | Replace console.error with user-friendly toast notifications for better UX                               |
| Error Monitoring      | Future    | Integrate Sentry or similar service for production error tracking and alerting                           |
| Structured Logging    | Future    | Add contextual logging with user ID, actions, timestamps for better debugging                            |
| Error Boundaries      | Future    | Implement React error boundaries for graceful crash recovery and fallback UI                            |
| Error Classification  | Future    | Categorize errors (network, validation, server) with appropriate user messages and retry mechanisms     |
| Post-Login Redirect   | Future    | Redirect to stocks page or previous page after login instead of homepage for better UX flow             |
| Settings Page Features | Future    | Profile management, notification preferences, privacy settings - currently MVP placeholder with logout  |
| Constants Extraction  | Future    | Extract hardcoded strings (API endpoints, error messages, cache keys) into constants file for maintainability |
| Unit/Integration Tests | Future    | Jest + RTL setup for component and API testing - deferred due to time constraints                       |
| Billing / Payments    | Future    | Optional for monetization phase                                                                          |

---
