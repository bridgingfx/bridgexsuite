import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("client"),
  status: text("status").notNull().default("active"),
  kycStatus: text("kyc_status").notNull().default("pending"),
  country: text("country"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tradingAccounts = pgTable("trading_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  accountNumber: text("account_number").notNull().unique(),
  platform: text("platform").notNull().default("MT5"),
  type: text("type").notNull().default("standard"),
  leverage: text("leverage").notNull().default("1:100"),
  balance: decimal("balance", { precision: 15, scale: 2 }).notNull().default("0"),
  equity: decimal("equity", { precision: 15, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  accountId: varchar("account_id").references(() => tradingAccounts.id),
  type: text("type").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"),
  method: text("method"),
  reference: text("reference"),
  notes: text("notes"),
  approvedBy: varchar("approved_by"),
  rejectionReason: text("rejection_reason"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const kycDocuments = pgTable("kyc_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  documentType: text("document_type").notNull(),
  fileName: text("file_name").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ibReferrals = pgTable("ib_referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ibUserId: varchar("ib_user_id").notNull().references(() => users.id),
  referredUserId: varchar("referred_user_id").notNull().references(() => users.id),
  commission: decimal("commission", { precision: 15, scale: 2 }).notNull().default("0"),
  level: integer("level").notNull().default(1),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull().default("medium"),
  status: text("status").notNull().default("open"),
  category: text("category").notNull().default("general"),
  assignedTo: varchar("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ticketReplies = pgTable("ticket_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").notNull().references(() => supportTickets.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const commissions = pgTable("commissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  source: text("source"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const brokerSettings = pgTable("broker_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value").notNull(),
  category: text("category").notNull().default("general"),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const commissionTiers = pgTable("commission_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  level: integer("level").notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(),
  minVolume: decimal("min_volume", { precision: 15, scale: 2 }).notNull().default("0"),
  maxVolume: decimal("max_volume", { precision: 15, scale: 2 }),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== SUPER ADMIN TABLES ====================

export const brokers = pgTable("brokers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  email: text("email").notNull(),
  phone: text("phone"),
  companyName: text("company_name"),
  country: text("country"),
  status: text("status").notNull().default("active"),
  maxClients: integer("max_clients").notNull().default(100),
  maxAccounts: integer("max_accounts").notNull().default(500),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  billingCycle: text("billing_cycle").notNull().default("monthly"),
  maxClients: integer("max_clients").notNull().default(100),
  maxAccounts: integer("max_accounts").notNull().default(500),
  maxIBs: integer("max_ibs").notNull().default(50),
  features: text("features"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const brokerSubscriptions = pgTable("broker_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brokerId: varchar("broker_id").notNull().references(() => brokers.id),
  planId: varchar("plan_id").notNull().references(() => subscriptionPlans.id),
  status: text("status").notNull().default("active"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  renewalDate: timestamp("renewal_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const brokerAdmins = pgTable("broker_admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brokerId: varchar("broker_id").notNull().references(() => brokers.id),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("admin"),
  status: text("status").notNull().default("active"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const brokerBranding = pgTable("broker_branding", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brokerId: varchar("broker_id").notNull().references(() => brokers.id).unique(),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").default("#3b82f6"),
  secondaryColor: text("secondary_color").default("#10b981"),
  accentColor: text("accent_color").default("#f59e0b"),
  customDomain: text("custom_domain"),
  companyTagline: text("company_tagline"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const platformSettings = pgTable("platform_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value").notNull(),
  category: text("category").notNull().default("general"),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ==================== PROP TRADING MODULE ====================

export const propChallenges = pgTable("prop_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  accountSize: decimal("account_size", { precision: 15, scale: 2 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  profitTarget: decimal("profit_target", { precision: 5, scale: 2 }).notNull(),
  maxDailyDrawdown: decimal("max_daily_drawdown", { precision: 5, scale: 2 }).notNull(),
  maxTotalDrawdown: decimal("max_total_drawdown", { precision: 5, scale: 2 }).notNull(),
  minTradingDays: integer("min_trading_days").notNull().default(5),
  maxTradingDays: integer("max_trading_days").notNull().default(30),
  profitSplit: decimal("profit_split", { precision: 5, scale: 2 }).notNull().default("80"),
  phases: integer("phases").notNull().default(2),
  leverage: text("leverage").notNull().default("1:100"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const propAccounts = pgTable("prop_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  challengeId: varchar("challenge_id").notNull().references(() => propChallenges.id),
  accountNumber: text("account_number").notNull(),
  currentPhase: integer("current_phase").notNull().default(1),
  status: text("status").notNull().default("active"),
  currentBalance: decimal("current_balance", { precision: 15, scale: 2 }).notNull().default("0"),
  currentProfit: decimal("current_profit", { precision: 15, scale: 2 }).notNull().default("0"),
  tradingDays: integer("trading_days").notNull().default(0),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== INVESTMENT MODULE ====================

export const investmentPlans = pgTable("investment_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  minInvestment: decimal("min_investment", { precision: 15, scale: 2 }).notNull(),
  maxInvestment: decimal("max_investment", { precision: 15, scale: 2 }),
  expectedReturn: decimal("expected_return", { precision: 5, scale: 2 }).notNull(),
  durationDays: integer("duration_days").notNull(),
  riskLevel: text("risk_level").notNull().default("medium"),
  category: text("category").notNull().default("forex"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const investments = pgTable("investments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  planId: varchar("plan_id").notNull().references(() => investmentPlans.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 15, scale: 2 }).notNull(),
  profit: decimal("profit", { precision: 15, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("active"),
  startDate: timestamp("start_date").defaultNow(),
  maturityDate: timestamp("maturity_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== COPY TRADING MODULE ====================

export const signalProviders = pgTable("signal_providers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  displayName: text("display_name").notNull(),
  description: text("description"),
  totalReturn: decimal("total_return", { precision: 10, scale: 2 }).notNull().default("0"),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  totalTrades: integer("total_trades").notNull().default(0),
  followers: integer("followers").notNull().default(0),
  riskScore: integer("risk_score").notNull().default(5),
  monthlyFee: decimal("monthly_fee", { precision: 10, scale: 2 }).notNull().default("0"),
  strategy: text("strategy"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const copyRelationships = pgTable("copy_relationships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  followerId: varchar("follower_id").notNull().references(() => users.id),
  providerId: varchar("provider_id").notNull().references(() => signalProviders.id),
  allocatedAmount: decimal("allocated_amount", { precision: 15, scale: 2 }).notNull(),
  currentPnl: decimal("current_pnl", { precision: 15, scale: 2 }).notNull().default("0"),
  totalCopiedTrades: integer("total_copied_trades").notNull().default(0),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== PAMM MODULE ====================

export const pammManagers = pgTable("pamm_managers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  displayName: text("display_name").notNull(),
  description: text("description"),
  totalAum: decimal("total_aum", { precision: 15, scale: 2 }).notNull().default("0"),
  totalReturn: decimal("total_return", { precision: 10, scale: 2 }).notNull().default("0"),
  monthlyReturn: decimal("monthly_return", { precision: 10, scale: 2 }).notNull().default("0"),
  performanceFee: decimal("performance_fee", { precision: 5, scale: 2 }).notNull().default("20"),
  managementFee: decimal("management_fee", { precision: 5, scale: 2 }).notNull().default("2"),
  minInvestment: decimal("min_investment", { precision: 15, scale: 2 }).notNull().default("1000"),
  investors: integer("investors").notNull().default(0),
  riskLevel: text("risk_level").notNull().default("medium"),
  strategy: text("strategy"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pammInvestments = pgTable("pamm_investments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  investorId: varchar("investor_id").notNull().references(() => users.id),
  managerId: varchar("manager_id").notNull().references(() => pammManagers.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 15, scale: 2 }).notNull(),
  profit: decimal("profit", { precision: 15, scale: 2 }).notNull().default("0"),
  sharePercentage: decimal("share_percentage", { precision: 5, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBrokerSchema = createInsertSchema(brokers).omit({ id: true, createdAt: true });
export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({ id: true, createdAt: true });
export const insertBrokerSubscriptionSchema = createInsertSchema(brokerSubscriptions).omit({ id: true, createdAt: true });
export const insertBrokerAdminSchema = createInsertSchema(brokerAdmins).omit({ id: true, createdAt: true, lastLogin: true });
export const insertBrokerBrandingSchema = createInsertSchema(brokerBranding).omit({ id: true, createdAt: true });
export const insertPlatformSettingSchema = createInsertSchema(platformSettings).omit({ id: true, updatedAt: true });

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertTradingAccountSchema = createInsertSchema(tradingAccounts).omit({ id: true, createdAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true, approvedBy: true, rejectionReason: true, processedAt: true });
export const insertKycDocumentSchema = createInsertSchema(kycDocuments).omit({ id: true, createdAt: true, reviewedBy: true, reviewedAt: true });
export const insertIbReferralSchema = createInsertSchema(ibReferrals).omit({ id: true, createdAt: true });
export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({ id: true, createdAt: true, assignedTo: true });
export const insertTicketReplySchema = createInsertSchema(ticketReplies).omit({ id: true, createdAt: true });
export const insertCommissionSchema = createInsertSchema(commissions).omit({ id: true, createdAt: true });
export const insertBrokerSettingSchema = createInsertSchema(brokerSettings).omit({ id: true, updatedAt: true });
export const insertCommissionTierSchema = createInsertSchema(commissionTiers).omit({ id: true, createdAt: true });
export const insertPropChallengeSchema = createInsertSchema(propChallenges).omit({ id: true, createdAt: true });
export const insertPropAccountSchema = createInsertSchema(propAccounts).omit({ id: true, createdAt: true });
export const insertInvestmentPlanSchema = createInsertSchema(investmentPlans).omit({ id: true, createdAt: true });
export const insertInvestmentSchema = createInsertSchema(investments).omit({ id: true, createdAt: true });
export const insertSignalProviderSchema = createInsertSchema(signalProviders).omit({ id: true, createdAt: true });
export const insertCopyRelationshipSchema = createInsertSchema(copyRelationships).omit({ id: true, createdAt: true });
export const insertPammManagerSchema = createInsertSchema(pammManagers).omit({ id: true, createdAt: true });
export const insertPammInvestmentSchema = createInsertSchema(pammInvestments).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTradingAccount = z.infer<typeof insertTradingAccountSchema>;
export type TradingAccount = typeof tradingAccounts.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertKycDocument = z.infer<typeof insertKycDocumentSchema>;
export type KycDocument = typeof kycDocuments.$inferSelect;
export type InsertIbReferral = z.infer<typeof insertIbReferralSchema>;
export type IbReferral = typeof ibReferrals.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertTicketReply = z.infer<typeof insertTicketReplySchema>;
export type TicketReply = typeof ticketReplies.$inferSelect;
export type InsertCommission = z.infer<typeof insertCommissionSchema>;
export type Commission = typeof commissions.$inferSelect;
export type InsertBrokerSetting = z.infer<typeof insertBrokerSettingSchema>;
export type BrokerSetting = typeof brokerSettings.$inferSelect;
export type InsertCommissionTier = z.infer<typeof insertCommissionTierSchema>;
export type CommissionTier = typeof commissionTiers.$inferSelect;

export type InsertBroker = z.infer<typeof insertBrokerSchema>;
export type Broker = typeof brokers.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertBrokerSubscription = z.infer<typeof insertBrokerSubscriptionSchema>;
export type BrokerSubscription = typeof brokerSubscriptions.$inferSelect;
export type InsertBrokerAdmin = z.infer<typeof insertBrokerAdminSchema>;
export type BrokerAdmin = typeof brokerAdmins.$inferSelect;
export type InsertBrokerBranding = z.infer<typeof insertBrokerBrandingSchema>;
export type BrokerBranding = typeof brokerBranding.$inferSelect;
export type InsertPlatformSetting = z.infer<typeof insertPlatformSettingSchema>;
export type PlatformSetting = typeof platformSettings.$inferSelect;

export type InsertPropChallenge = z.infer<typeof insertPropChallengeSchema>;
export type PropChallenge = typeof propChallenges.$inferSelect;
export type InsertPropAccount = z.infer<typeof insertPropAccountSchema>;
export type PropAccount = typeof propAccounts.$inferSelect;
export type InsertInvestmentPlan = z.infer<typeof insertInvestmentPlanSchema>;
export type InvestmentPlan = typeof investmentPlans.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertSignalProvider = z.infer<typeof insertSignalProviderSchema>;
export type SignalProvider = typeof signalProviders.$inferSelect;
export type InsertCopyRelationship = z.infer<typeof insertCopyRelationshipSchema>;
export type CopyRelationship = typeof copyRelationships.$inferSelect;
export type InsertPammManager = z.infer<typeof insertPammManagerSchema>;
export type PammManager = typeof pammManagers.$inferSelect;
export type InsertPammInvestment = z.infer<typeof insertPammInvestmentSchema>;
export type PammInvestment = typeof pammInvestments.$inferSelect;
