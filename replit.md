# ForexCRM - All-in-One Forex CRM Application

## Overview
A comprehensive three-tier SaaS Forex CRM application inspired by BridgeX CRM. Built with React (frontend), Express/Node.js (backend), and PostgreSQL (database) using Drizzle ORM. Features a Client CRM, Admin CRM, and Super Admin CRM with separate layouts and routing.

## Architecture
- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn UI components, Recharts for data visualization
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter (frontend), Express (backend API)
- **State Management**: TanStack React Query

## Three-Tier CRM Structure
### Client CRM (root routes: /)
End-user facing CRM for traders to manage their accounts, deposits, KYC, and support tickets.

### Admin CRM (routes: /admin/*)
Broker admin panel for managing all clients, approving transactions/KYC, configuring settings, and overseeing operations. Uses separate AdminSidebar and AdminLayout.

### Super Admin CRM (routes: /super-admin/*)
SaaS platform management layer for managing broker tenants, subscription plans, admin users, white-label branding, and platform-wide analytics. Uses SuperAdminSidebar and SuperAdminLayout.

## Key Features

### Client CRM
- **Dashboard**: Overview with wallet balance, deposits, withdrawals, commissions, charts, and recent transactions
- **Clients Management**: Full CRUD with search, filter, status badges, KYC status tracking
- **Trading Accounts**: MT4/MT5/cTrader account management with balance and equity tracking
- **Wallet**: Deposit/withdrawal management with transaction history and balance charts
- **Transactions**: Complete transaction log with type and status filters
- **IB/Affiliate**: Introducing Broker program with referral tracking, commission analytics
- **KYC/Documents**: Document verification workflow with status tracking
- **Reports**: Financial, trading, and commission reports with interactive charts
- **Support Tickets**: Ticket creation and management system
- **Notifications**: Activity notification feed
- **Settings**: Profile, security, notification preferences, and appearance (dark/light mode)
- **Account Details**: View detailed account info, transaction history, P&L, change password, change leverage, deposit from wallet
- **Prop Trading**: Funded trading challenges (10K-100K accounts), purchase challenges, track phases (Phase 1/2/Funded), drawdown rules
- **Investment**: Managed investment plans with different risk levels, invest/track returns, maturity dates
- **Copy Trading**: Follow signal providers, allocate funds, view P&L, stop copying
- **PAMM**: Percentage Allocation Management - invest with professional money managers, track AUM/returns/fees

### Admin CRM
- **Admin Dashboard**: Broker-wide stats (12 KPIs), recent transactions & clients tables
- **Client Management**: Full CRUD, status/KYC toggles, search/filter by role & status, client detail view with tabs
- **Financial Operations**: Transaction approve/reject with rejection reasons, filter by type/status
- **Trading Accounts**: Create/edit accounts, assign to clients, platform management
- **KYC Verification**: Document review with approve/reject workflow, reviewer tracking
- **IB Management**: Referral tracking, commission analytics, commission tier configuration
- **Support Management**: Ticket handling, admin replies, status changes, priority management
- **Reports & Analytics**: Financial, client, trading, and commission analytics with Recharts
- **System Settings**: Configurable broker settings across 5 categories (General, Trading, Financial, Commission, Platform)

### Super Admin CRM
- **Dashboard**: Platform-wide KPIs (Total Brokers, Active Brokers, MRR, ARR, Admin Users, Clients, Transaction Volume), recent brokers list, platform summary
- **Broker Management**: Full CRUD for broker tenants, search/filter by status, suspend/activate brokers, broker detail view with tabs (admins, subscriptions, branding)
- **Subscription Plans**: Plan management with pricing tiers (Starter $99, Professional $299, Enterprise $799), billing cycles, feature lists, client/account/IB limits
- **Admin Users**: Cross-broker admin user management, role assignment (super_admin, admin, manager, support), activate/deactivate
- **White-Label Branding**: Per-broker branding configuration with color pickers, logo URL, tagline, custom domain, live preview
- **Platform Analytics**: Charts (Recharts) for broker status distribution, revenue by plan, brokers by country, plan subscribers
- **Platform Config**: Platform-wide settings management organized by category (general, limits, billing, financial, system, security), inline editing

## Project Structure
```
client/src/
  App.tsx                 - Main app with client/admin/super-admin layout switching and routing
  components/
    app-sidebar.tsx       - Client CRM navigation sidebar
    admin-sidebar.tsx     - Admin CRM navigation sidebar
    super-admin-sidebar.tsx - Super Admin CRM navigation sidebar
    theme-toggle.tsx      - Dark/light mode toggle
  pages/
    dashboard.tsx         - Client dashboard
    clients.tsx           - Client management (client-facing)
    trading-accounts.tsx  - Trading account management
    wallet.tsx            - Wallet/deposit/withdrawal
    transactions.tsx      - Transaction history
    ib-affiliate.tsx      - IB/Affiliate program
    kyc.tsx               - KYC verification
    reports.tsx           - Analytics reports
    support.tsx           - Support tickets
    notifications.tsx     - Notifications
    settings.tsx          - User settings
    prop-trading.tsx      - Prop trading challenges & funded accounts
    investment.tsx        - Investment plans & portfolio
    copy-trading.tsx      - Copy trading with signal providers
    pamm.tsx              - PAMM fund manager investments
    admin/
      dashboard.tsx       - Admin dashboard with broker-wide stats
      clients.tsx         - Admin client management with CRUD
      client-detail.tsx   - Admin client detail with tabs
      finance.tsx         - Financial operations (approve/reject)
      accounts.tsx        - Trading account management
      kyc-verification.tsx - KYC document review
      ib-management.tsx   - IB/Affiliate management
      support-admin.tsx   - Support ticket management
      reports.tsx         - Admin reports & analytics
      system-settings.tsx - System settings configuration
    super-admin/
      dashboard.tsx       - Super Admin dashboard with platform KPIs
      brokers.tsx         - Broker tenant management
      broker-detail.tsx   - Broker detail with tabs
      plans.tsx           - Subscription plan management
      admin-users.tsx     - Admin user management across brokers
      branding.tsx        - White-label branding configuration
      analytics.tsx       - Platform-wide analytics with charts
      platform-config.tsx - Platform settings configuration
  lib/
    theme-provider.tsx    - Theme context provider

server/
  index.ts               - Express server setup
  routes.ts              - API routes with Zod validation (client + admin + super-admin endpoints)
  storage.ts             - Database storage layer (CRUD operations)
  db.ts                  - Database connection
  seed.ts                - Seed data (client, admin, and super-admin data)

shared/
  schema.ts              - Drizzle ORM schema definitions
```

## Database Tables
- users, trading_accounts, transactions, kyc_documents, ib_referrals, support_tickets, ticket_replies, commissions, broker_settings, commission_tiers
- brokers, subscription_plans, broker_subscriptions, broker_admins, broker_branding, platform_settings
- prop_challenges, prop_accounts, investment_plans, investments, signal_providers, copy_relationships, pamm_managers, pamm_investments

## API Endpoints

### Client API
- GET/POST /api/clients
- GET/POST /api/trading-accounts
- GET /api/trading-accounts/:id (account details + transactions)
- POST /api/trading-accounts/:id/change-password
- PATCH /api/trading-accounts/:id/leverage
- POST /api/trading-accounts/:id/deposit (wallet transfer)
- GET/POST /api/transactions
- GET/POST /api/kyc/documents
- GET/POST /api/ib/referrals
- GET /api/commissions
- GET/POST /api/support/tickets
- GET /api/dashboard/stats

### Prop Trading API
- GET /api/prop/challenges
- GET /api/prop/accounts
- POST /api/prop/accounts

### Investment API
- GET /api/investments/plans
- GET /api/investments
- POST /api/investments

### Copy Trading API
- GET /api/copy/providers
- GET /api/copy/relationships
- POST /api/copy/relationships
- PATCH /api/copy/relationships/:id

### PAMM API
- GET /api/pamm/managers
- GET /api/pamm/investments
- POST /api/pamm/investments

### Admin API
- GET /api/admin/dashboard/stats
- GET /api/admin/clients
- GET /api/admin/clients/:id (returns client + accounts + transactions + kyc + tickets)
- PATCH /api/admin/clients/:id/status
- PATCH /api/admin/clients/:id/kyc-status
- GET /api/admin/transactions
- POST /api/admin/transactions/:id/approve
- POST /api/admin/transactions/:id/reject
- GET /api/admin/trading-accounts
- POST /api/admin/trading-accounts
- PATCH /api/admin/trading-accounts/:id
- GET /api/admin/kyc/documents
- POST /api/admin/kyc/documents/:id/review
- GET /api/admin/ib/referrals
- GET /api/admin/commissions
- GET/POST /api/admin/commission-tiers
- GET /api/admin/support/tickets
- PATCH /api/admin/support/tickets/:id/status
- POST /api/admin/support/tickets/:id/reply
- GET/POST /api/admin/settings

### Super Admin API
- GET /api/super-admin/dashboard/stats
- GET/POST /api/super-admin/brokers
- GET/PATCH /api/super-admin/brokers/:id
- POST /api/super-admin/brokers/:id/suspend
- POST /api/super-admin/brokers/:id/activate
- GET/POST /api/super-admin/plans
- PATCH /api/super-admin/plans/:id
- GET/POST /api/super-admin/subscriptions
- PATCH /api/super-admin/subscriptions/:id
- GET/POST /api/super-admin/admins
- PATCH /api/super-admin/admins/:id
- GET /api/super-admin/brokers/:id/admins
- GET/PATCH /api/super-admin/brokers/:id/branding
- GET/POST /api/super-admin/platform-settings

## Authentication & Security
- **Login**: Email/password authentication with bcrypt password hashing
- **Sessions**: PostgreSQL-backed session store (connect-pg-simple), httpOnly cookies, sameSite=lax
- **Rate Limiting**: 5 attempts/15min for login, 100 requests/15min for general API
- **Security Headers**: Helmet middleware for XSS protection, HSTS, etc.
- **Role-Based Access**: requireAuth, requireAdmin, requireSuperAdmin middleware on API routes
- **Frontend Protection**: Role-based route guards redirect unauthorized users

### Login Credentials (Seed Data)
- **Super Admin**: superadmin@forexcrm.com / admin123
- **Admin**: admin@forexcrm.com / admin123
- **Client**: john.smith@email.com / pass123

### Auth API
- POST /api/auth/login (public)
- POST /api/auth/logout
- GET /api/auth/me

## Separate Login Portals
- **Client Login**: `/login` - TrendingUp icon, "Client Portal" branding, only allows client/ib/lead roles
- **Admin Login**: `/admin/login` - Shield icon, "Admin Portal" branding, only allows admin/super_admin roles  
- **Super Admin Login**: `/super-admin/login` - Crown icon, "Platform Administration" branding, only allows super_admin role
- Each login validates the user role after authentication and logs out + shows error if wrong portal is used

## MT5 Server Configuration
Admin Settings has an "MT5 Server" tab with fields: MT5 Manager ID, Manager Password, Server IP, Server Port. Saved to broker_settings table with category "mt5".

## Recent Changes
- 2026-02-17: Added Prop Trading, Investment, Copy Trading, PAMM modules with 8 new DB tables, 13 API endpoints, 4 frontend pages, sidebar navigation under "Services" section
- 2026-02-17: Separated login pages into three distinct portals (/login, /admin/login, /super-admin/login) with role validation
- 2026-02-17: Made client API routes user-scoped (trading accounts, transactions, dashboard stats, KYC, support tickets all filtered by session userId)
- 2026-02-17: Refactored client sidebar to be trader-focused (removed Clients, IB/Affiliate, Reports; kept Dashboard, Trading, Wallet, Transactions, KYC, Support, Settings)
- 2026-02-17: Added MT5 Server Configuration tab to Admin System Settings
- 2026-02-17: Updated client dashboard with personalized welcome message using auth user data
- 2026-02-17: Added authentication system with bcrypt password hashing, PostgreSQL session store, role-based access control, rate limiting, helmet security headers, login page, frontend auth flow
- 2026-02-17: Added Super Admin CRM with 8 pages, super-admin sidebar, 20+ super-admin API endpoints, 6 new database tables (brokers, subscription_plans, broker_subscriptions, broker_admins, broker_branding, platform_settings)
- 2026-02-17: Added Admin CRM with 10 pages, admin sidebar, 20+ admin API endpoints, broker_settings and commission_tiers tables
