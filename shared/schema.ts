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
