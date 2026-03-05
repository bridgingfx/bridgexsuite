# BridgeX Suite - All-in-One Forex CRM Application

## Overview
BridgeX Suite is a comprehensive three-tier SaaS Forex CRM application designed to serve the needs of forex brokers, their administrators, and their clients. Inspired by BridgeX CRM, it provides a robust platform for managing client relationships, financial operations, trading accounts, and platform-wide administration.

The system is structured into three distinct CRM tiers:
- **Client CRM**: An end-user facing portal for traders to manage their profiles, trading activities, and support needs.
- **Admin CRM**: A powerful back-office for broker administrators to oversee client operations, approve transactions, and configure broker-specific settings.
- **Super Admin CRM**: A platform-level administration panel for managing broker tenants, subscription plans, and white-label branding, targeting SaaS platform providers.

## User Preferences
I want the agent to focus on high-level features only and avoid granular implementation details. Consolidate redundant information and prioritize architectural decisions over implementation specifics.

## System Architecture

### Frontend
- **React + TypeScript** with Wouter for routing
- **Tailwind CSS + Shadcn UI** for styling, **Recharts** for charts
- **TanStack React Query** for data fetching/state management
- Separate login portals for Client (`/login`), Admin (`/admin/login`), and Super Admin (`/super-admin/login`)
- 50+ pages across three CRM tiers

### Prop Trading Module (9 sub-pages)
- **Dashboard** (`/prop/dashboard`) - KPIs, challenge status, next steps, announcements
- **Accounts** (`/prop/accounts`) - Prop accounts list with credentials, platform info, reset/retry
- **Challenges** (`/prop/challenges`) - Challenge pricing, my challenges, rules, add-ons
- **Analytics** (`/prop/analytics`) - Performance, trade history, risk metrics, Recharts charts
- **Payouts** (`/prop/payouts`) - Payout dashboard, withdraw-to-wallet (same pattern as forex), history
- **Bonus & Promos** (`/prop/bonus`) - Promo codes, promotions, applied bonuses
- **Referral** (`/prop/referral`) - Referral link, stats, commission history, withdraw rewards
- **Certificates** (`/prop/certificates`) - Download purchase/withdrawal/achievement certificates
- **Rules & Compliance** (`/prop/rules`) - Trading rules, policies, breach logs, T&C

### Backend (Migrated: Express.js → Laravel PHP)
- **PHP 8.4 + Laravel 12** in `laravel-api/` directory
- **70+ API routes** in `laravel-api/routes/api.php`
- **10 Controllers**: Auth, Dashboard, TradingAccount, Transaction, KYC, Support, IB, Module, Admin, SuperAdmin
- **24 Eloquent Models** with UUID primary keys and CamelCaseAttributes trait for camelCase JSON responses
- **Session-based auth** using file driver with role-based middleware (`auth.custom`, `admin.custom`, `superadmin.custom`)
- **Password compatibility**: Handles `$2b$` → `$2y$` bcrypt hash prefix conversion for Node.js-generated passwords

### Database
- **PostgreSQL** (Replit-managed)
- Connection configured via `.env` file in `laravel-api/.env` (DB_HOST, DB_DATABASE, etc.)
- 25+ tables: users, trading_accounts, transactions, kyc_documents, support_tickets, ticket_replies, ib_referrals, commissions, commission_tiers, broker_settings, brokers, subscription_plans, broker_subscriptions, broker_admins, broker_branding, platform_settings, prop_challenges, prop_accounts, investment_plans, investments, signal_providers, copy_relationships, pamm_managers, pamm_investments

### Architecture Flow
```
Browser → Vite (port 5000) → /api/* proxy → Laravel (port 8000) → PostgreSQL
                ↓
         React SPA (static files)
```

## Running the Application
- `start.sh` runs both servers concurrently:
  - Laravel: `php artisan serve --host=0.0.0.0 --port=8000`
  - Vite: `npx vite --config vite.config.ts` on port 5000
- Vite proxies all `/api/*` requests to Laravel
- `vite.config.ts` has `allowedHosts: true` for Replit compatibility

## Login Credentials
- **Client**: john.smith@email.com / pass123
- **Admin**: admin@forexcrm.com / admin123
- **Super Admin**: superadmin@forexcrm.com / admin123

## Key Files
- `laravel-api/bootstrap/app.php` - Laravel app config (routes, middleware)
- `laravel-api/routes/api.php` - All API routes
- `laravel-api/app/Http/Controllers/` - 10 controllers
- `laravel-api/app/Models/` - 24 Eloquent models
- `laravel-api/app/Traits/CamelCaseAttributes.php` - snake_case → camelCase JSON conversion
- `laravel-api/app/Http/Middleware/` - Auth middleware (EnsureAuthenticated, EnsureAdmin, EnsureSuperAdmin)
- `client/src/pages/prop/` - 9 Prop Trading sub-pages
- `client/src/components/app-sidebar.tsx` - Client sidebar with expandable menus
- `vite.config.ts` - Vite config with proxy and allowedHosts
- `start.sh` - Startup script for both servers

## External Dependencies

### Frontend
- React, TypeScript, Tailwind CSS, Shadcn UI, Recharts, Wouter, TanStack React Query

### Backend (Laravel)
- PHP 8.4, Laravel 12, Eloquent ORM
- Session auth with file driver (no additional session packages needed)

### Database
- PostgreSQL (Replit-managed)
