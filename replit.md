# ForexCRM - All-in-One Forex CRM Application

## Overview
A comprehensive Forex CRM application inspired by BridgeX CRM. Built with React (frontend), Express/Node.js (backend), and PostgreSQL (database) using Drizzle ORM.

## Architecture
- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn UI components, Recharts for data visualization
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter (frontend), Express (backend API)
- **State Management**: TanStack React Query

## Key Features
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

## Project Structure
```
client/src/
  App.tsx                 - Main app with sidebar layout and routing
  components/
    app-sidebar.tsx       - Main navigation sidebar
    theme-toggle.tsx      - Dark/light mode toggle
  pages/
    dashboard.tsx         - Dashboard with stats and charts
    clients.tsx           - Client management
    trading-accounts.tsx  - Trading account management
    wallet.tsx            - Wallet/deposit/withdrawal
    transactions.tsx      - Transaction history
    ib-affiliate.tsx      - IB/Affiliate program
    kyc.tsx               - KYC verification
    reports.tsx           - Analytics reports
    support.tsx           - Support tickets
    notifications.tsx     - Notifications
    settings.tsx          - User settings
  lib/
    theme-provider.tsx    - Theme context provider

server/
  index.ts               - Express server setup
  routes.ts              - API routes with Zod validation
  storage.ts             - Database storage layer (CRUD operations)
  db.ts                  - Database connection
  seed.ts                - Seed data

shared/
  schema.ts              - Drizzle ORM schema definitions
```

## Database Tables
- users, trading_accounts, transactions, kyc_documents, ib_referrals, support_tickets, ticket_replies, commissions

## API Endpoints
- GET/POST /api/clients
- GET/POST /api/trading-accounts
- GET/POST /api/transactions
- GET/POST /api/kyc/documents
- GET/POST /api/ib/referrals
- GET /api/commissions
- GET/POST /api/support/tickets
- GET /api/dashboard/stats
