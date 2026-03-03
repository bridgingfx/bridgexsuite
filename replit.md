# ForexCRM - All-in-One Forex CRM Application

## Overview
ForexCRM is a comprehensive three-tier SaaS Forex CRM application designed to serve the needs of forex brokers, their administrators, and their clients. Inspired by BridgeX CRM, it provides a robust platform for managing client relationships, financial operations, trading accounts, and platform-wide administration. The project aims to deliver a full-featured, scalable solution for the forex industry, enhancing operational efficiency and client engagement.

The system is structured into three distinct CRM tiers:
- **Client CRM**: An end-user facing portal for traders to manage their profiles, trading activities, and support needs.
- **Admin CRM**: A powerful back-office for broker administrators to oversee client operations, approve transactions, and configure broker-specific settings.
- **Super Admin CRM**: A platform-level administration panel for managing broker tenants, subscription plans, and white-label branding, targeting SaaS platform providers.

Key capabilities include full CRUD operations for clients and brokers, extensive financial management with transaction approval workflows, advanced KYC verification, IB/affiliate program management, and comprehensive reporting and analytics. New modules like Prop Trading, Investment, Copy Trading, and PAMM have been integrated to offer a wide range of services.

## User Preferences
I want the agent to focus on high-level features only and avoid granular implementation details. Consolidate redundant information and prioritize architectural decisions over implementation specifics.

## System Architecture

The ForexCRM application follows a three-tier architecture:

-   **Frontend**: Built with React, TypeScript, and Wouter for routing. It utilizes Tailwind CSS and Shadcn UI for a modern and responsive user interface, with Recharts for data visualization. State management is handled by TanStack React Query. The UI/UX design is inspired by BridgeX CRM, featuring a scrolling announcement marquee, live forex ticker, redesigned collapsible sidebars with user profiles, an enhanced top header with search, KYC status badges, notification systems, and language switchers. Separate login portals exist for Client, Admin, and Super Admin roles, each with distinct branding and role validation.

-   **Backend**: Developed with Express.js and TypeScript, providing a robust API layer. API routes are protected with role-based access control middleware (`requireAuth`, `requireAdmin`, `requireSuperAdmin`) and input validation using Zod. Security features include bcrypt for password hashing, PostgreSQL-backed session store with httpOnly cookies, rate limiting, and Helmet middleware for essential security headers.

-   **Database**: PostgreSQL is used as the primary data store, managed with Drizzle ORM for type-safe and efficient database interactions.

**Core Feature Specifications:**

-   **Client CRM**: Full BridgeX CRM-inspired design clone with 20+ pages. Dashboard features 12 stat cards in 3 rows (Wallet, Deposits, Withdrawals, Commissions, Trading Accounts, Prop Accounts, Investments, Support, IB/Affiliate/Referral Earnings, Loyalty Points) plus Recharts area/bar charts. Wallet page has gradient hero, payment methods grid, balance chart. Forex section includes dashboard with KPIs, trading accounts with live/demo tabs and multi-step account creation wizard, finance page, offers, IB dashboard with referral tree, PAMM managers, and copy trading providers. Additional pages: Prop Trading (challenge cards with active status), Investment (portfolio pie chart, plans), Loyalty Points (tier progress, rewards), P2P Exchange (buy/sell with trader listings), AI Center (chat interface), Download Platform (5 platform cards), Widgets (toggle-able widgets), Profile (gradient header), KYC (verification steps), Settings, Support tickets.
-   **Admin CRM**: Offers a broker-wide dashboard with KPIs, client management with detailed views, financial operations (transaction approval/rejection), trading account administration, KYC verification workflows, IB management, support ticket handling, and system settings configuration across multiple categories (General, Trading, Financial, Commission, Platform).
-   **Super Admin CRM**: Provides a platform-wide dashboard, broker tenant management (CRUD, suspend/activate), subscription plan configuration with pricing tiers and feature limits, cross-broker admin user management, white-label branding customization (color pickers, logos, custom domains), and platform analytics.
-   **Authentication & Security**: Implements robust email/password authentication, PostgreSQL-backed sessions, role-based access control (client, admin, super_admin), rate limiting for brute-force protection, and security headers (Helmet). Separate login portals enforce role-specific access.
-   **MT5 Server Configuration**: Integrated within Admin Settings for managing MT5 Manager ID, password, server IP, and port.

## External Dependencies

-   **Frontend**:
    -   React
    -   TypeScript
    -   Tailwind CSS
    -   Shadcn UI
    -   Recharts
    -   Wouter
    -   TanStack React Query
-   **Backend**:
    -   Express.js
    -   TypeScript
    -   Zod (for validation)
    -   bcrypt (for password hashing)
    -   connect-pg-simple (for PostgreSQL session store)
    -   Helmet (for security headers)
-   **Database**:
    -   PostgreSQL
    -   Drizzle ORM
-   **Trading Platforms**:
    -   MT4/MT5 (for trading account integration)
    -   cTrader (for trading account integration)