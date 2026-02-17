import { db } from "./db";
import { eq, desc, sql, and, count } from "drizzle-orm";
import {
  users,
  tradingAccounts,
  transactions,
  kycDocuments,
  ibReferrals,
  supportTickets,
  ticketReplies,
  commissions,
  brokerSettings,
  commissionTiers,
  brokers,
  subscriptionPlans,
  brokerSubscriptions,
  brokerAdmins,
  brokerBranding,
  platformSettings,
  propChallenges,
  propAccounts,
  investmentPlans,
  investments,
  signalProviders,
  copyRelationships,
  pammManagers,
  pammInvestments,
  type User,
  type InsertUser,
  type TradingAccount,
  type InsertTradingAccount,
  type Transaction,
  type InsertTransaction,
  type KycDocument,
  type InsertKycDocument,
  type IbReferral,
  type InsertIbReferral,
  type SupportTicket,
  type InsertSupportTicket,
  type TicketReply,
  type InsertTicketReply,
  type Commission,
  type InsertCommission,
  type BrokerSetting,
  type InsertBrokerSetting,
  type CommissionTier,
  type InsertCommissionTier,
  type Broker,
  type InsertBroker,
  type SubscriptionPlan,
  type InsertSubscriptionPlan,
  type BrokerSubscription,
  type InsertBrokerSubscription,
  type BrokerAdmin,
  type InsertBrokerAdmin,
  type BrokerBranding,
  type InsertBrokerBranding,
  type PlatformSetting,
  type InsertPlatformSetting,
  type PropChallenge,
  type InsertPropChallenge,
  type PropAccount,
  type InsertPropAccount,
  type InvestmentPlan,
  type InsertInvestmentPlan,
  type Investment,
  type InsertInvestment,
  type SignalProvider,
  type InsertSignalProvider,
  type CopyRelationship,
  type InsertCopyRelationship,
  type PammManager,
  type InsertPammManager,
  type PammInvestment,
  type InsertPammInvestment,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllClients(): Promise<User[]>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  getTradingAccounts(): Promise<TradingAccount[]>;
  getTradingAccountById(id: string): Promise<TradingAccount | undefined>;
  getTradingAccountsByUser(userId: string): Promise<TradingAccount[]>;
  createTradingAccount(account: InsertTradingAccount): Promise<TradingAccount>;
  updateTradingAccount(id: string, data: Partial<InsertTradingAccount>): Promise<TradingAccount | undefined>;

  getTransactions(): Promise<Transaction[]>;
  getRecentTransactions(limit?: number): Promise<Transaction[]>;
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  getTransactionsByStatus(status: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(id: string, status: string): Promise<Transaction | undefined>;
  approveTransaction(id: string, approvedBy: string): Promise<Transaction | undefined>;
  rejectTransaction(id: string, reason: string): Promise<Transaction | undefined>;

  getKycDocuments(): Promise<KycDocument[]>;
  getKycDocumentsByUser(userId: string): Promise<KycDocument[]>;
  getKycDocumentsByStatus(status: string): Promise<KycDocument[]>;
  createKycDocument(doc: InsertKycDocument): Promise<KycDocument>;
  updateKycDocumentStatus(id: string, status: string, notes?: string): Promise<KycDocument | undefined>;
  reviewKycDocument(id: string, status: string, reviewedBy: string, notes?: string): Promise<KycDocument | undefined>;

  getIbReferrals(): Promise<IbReferral[]>;
  getIbReferralsByUser(userId: string): Promise<IbReferral[]>;
  createIbReferral(referral: InsertIbReferral): Promise<IbReferral>;

  getSupportTickets(): Promise<SupportTicket[]>;
  getSupportTicketsByUser(userId: string): Promise<SupportTicket[]>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateTicketStatus(id: string, status: string): Promise<SupportTicket | undefined>;
  assignTicket(id: string, assignedTo: string): Promise<SupportTicket | undefined>;

  getTicketReplies(ticketId: string): Promise<TicketReply[]>;
  createTicketReply(reply: InsertTicketReply): Promise<TicketReply>;

  getCommissions(): Promise<Commission[]>;
  getCommissionsByUser(userId: string): Promise<Commission[]>;
  createCommission(commission: InsertCommission): Promise<Commission>;

  getBrokerSettings(): Promise<BrokerSetting[]>;
  getBrokerSetting(key: string): Promise<BrokerSetting | undefined>;
  upsertBrokerSetting(setting: InsertBrokerSetting): Promise<BrokerSetting>;

  getCommissionTiers(): Promise<CommissionTier[]>;
  createCommissionTier(tier: InsertCommissionTier): Promise<CommissionTier>;
  updateCommissionTier(id: string, data: Partial<InsertCommissionTier>): Promise<CommissionTier | undefined>;

  getDashboardStats(): Promise<any>;
  getAdminDashboardStats(): Promise<any>;

  // Super Admin - Brokers
  getAllBrokers(): Promise<Broker[]>;
  getBroker(id: string): Promise<Broker | undefined>;
  createBroker(broker: InsertBroker): Promise<Broker>;
  updateBroker(id: string, data: Partial<InsertBroker>): Promise<Broker | undefined>;

  // Super Admin - Subscription Plans
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: string, data: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined>;

  // Super Admin - Broker Subscriptions
  getBrokerSubscriptions(): Promise<BrokerSubscription[]>;
  getBrokerSubscriptionsByBroker(brokerId: string): Promise<BrokerSubscription[]>;
  createBrokerSubscription(sub: InsertBrokerSubscription): Promise<BrokerSubscription>;
  updateBrokerSubscription(id: string, data: Partial<InsertBrokerSubscription>): Promise<BrokerSubscription | undefined>;

  // Super Admin - Broker Admins
  getBrokerAdmins(): Promise<BrokerAdmin[]>;
  getBrokerAdminsByBroker(brokerId: string): Promise<BrokerAdmin[]>;
  createBrokerAdmin(admin: InsertBrokerAdmin): Promise<BrokerAdmin>;
  updateBrokerAdmin(id: string, data: Partial<InsertBrokerAdmin>): Promise<BrokerAdmin | undefined>;

  // Super Admin - Broker Branding
  getBrokerBrandingByBroker(brokerId: string): Promise<BrokerBranding | undefined>;
  upsertBrokerBranding(brokerId: string, data: Partial<InsertBrokerBranding>): Promise<BrokerBranding>;

  // Super Admin - Platform Settings
  getPlatformSettings(): Promise<PlatformSetting[]>;
  upsertPlatformSetting(setting: InsertPlatformSetting): Promise<PlatformSetting>;

  // Super Admin - Dashboard
  getSuperAdminDashboardStats(): Promise<any>;

  // Prop Trading
  getPropChallenges(): Promise<PropChallenge[]>;
  getPropChallenge(id: string): Promise<PropChallenge | undefined>;
  createPropChallenge(challenge: InsertPropChallenge): Promise<PropChallenge>;
  getPropAccountsByUser(userId: string): Promise<PropAccount[]>;
  getPropAccounts(): Promise<PropAccount[]>;
  createPropAccount(account: InsertPropAccount): Promise<PropAccount>;
  updatePropAccount(id: string, data: Partial<InsertPropAccount>): Promise<PropAccount | undefined>;

  // Investment
  getInvestmentPlans(): Promise<InvestmentPlan[]>;
  getInvestmentPlan(id: string): Promise<InvestmentPlan | undefined>;
  createInvestmentPlan(plan: InsertInvestmentPlan): Promise<InvestmentPlan>;
  getInvestmentsByUser(userId: string): Promise<Investment[]>;
  getInvestments(): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestment(id: string, data: Partial<InsertInvestment>): Promise<Investment | undefined>;

  // Copy Trading
  getSignalProviders(): Promise<SignalProvider[]>;
  getSignalProvider(id: string): Promise<SignalProvider | undefined>;
  createSignalProvider(provider: InsertSignalProvider): Promise<SignalProvider>;
  getCopyRelationshipsByUser(userId: string): Promise<CopyRelationship[]>;
  getCopyRelationships(): Promise<CopyRelationship[]>;
  createCopyRelationship(rel: InsertCopyRelationship): Promise<CopyRelationship>;
  updateCopyRelationship(id: string, data: Partial<InsertCopyRelationship>): Promise<CopyRelationship | undefined>;

  // PAMM
  getPammManagers(): Promise<PammManager[]>;
  getPammManager(id: string): Promise<PammManager | undefined>;
  createPammManager(manager: InsertPammManager): Promise<PammManager>;
  getPammInvestmentsByUser(userId: string): Promise<PammInvestment[]>;
  getPammInvestments(): Promise<PammInvestment[]>;
  createPammInvestment(investment: InsertPammInvestment): Promise<PammInvestment>;
  updatePammInvestment(id: string, data: Partial<InsertPammInvestment>): Promise<PammInvestment | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getAllClients(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return true;
  }

  async getTradingAccounts(): Promise<TradingAccount[]> {
    return db.select().from(tradingAccounts).orderBy(desc(tradingAccounts.createdAt));
  }

  async getTradingAccountById(id: string): Promise<TradingAccount | undefined> {
    const [account] = await db.select().from(tradingAccounts).where(eq(tradingAccounts.id, id));
    return account;
  }

  async getTradingAccountsByUser(userId: string): Promise<TradingAccount[]> {
    return db.select().from(tradingAccounts).where(eq(tradingAccounts.userId, userId));
  }

  async createTradingAccount(account: InsertTradingAccount): Promise<TradingAccount> {
    const accountNumber = account.accountNumber || "MT" + Math.floor(10000000 + Math.random() * 90000000).toString();
    const [created] = await db
      .insert(tradingAccounts)
      .values({ ...account, accountNumber })
      .returning();
    return created;
  }

  async updateTradingAccount(id: string, data: Partial<InsertTradingAccount>): Promise<TradingAccount | undefined> {
    const [updated] = await db.update(tradingAccounts).set(data).where(eq(tradingAccounts.id, id)).returning();
    return updated;
  }

  async getTransactions(): Promise<Transaction[]> {
    return db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async getRecentTransactions(limit = 5): Promise<Transaction[]> {
    return db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(limit);
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
  }

  async getTransactionsByStatus(status: string): Promise<Transaction[]> {
    return db.select().from(transactions).where(eq(transactions.status, status)).orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const reference = "TXN" + Date.now().toString(36).toUpperCase();
    const [created] = await db
      .insert(transactions)
      .values({ ...transaction, reference })
      .returning();
    return created;
  }

  async updateTransactionStatus(id: string, status: string): Promise<Transaction | undefined> {
    const [updated] = await db.update(transactions).set({ status }).where(eq(transactions.id, id)).returning();
    return updated;
  }

  async approveTransaction(id: string, approvedBy: string): Promise<Transaction | undefined> {
    const [updated] = await db.update(transactions).set({
      status: "completed",
      approvedBy,
      processedAt: new Date(),
    }).where(eq(transactions.id, id)).returning();
    return updated;
  }

  async rejectTransaction(id: string, reason: string): Promise<Transaction | undefined> {
    const [updated] = await db.update(transactions).set({
      status: "rejected",
      rejectionReason: reason,
      processedAt: new Date(),
    }).where(eq(transactions.id, id)).returning();
    return updated;
  }

  async getKycDocuments(): Promise<KycDocument[]> {
    return db.select().from(kycDocuments).orderBy(desc(kycDocuments.createdAt));
  }

  async getKycDocumentsByUser(userId: string): Promise<KycDocument[]> {
    return db.select().from(kycDocuments).where(eq(kycDocuments.userId, userId));
  }

  async getKycDocumentsByStatus(status: string): Promise<KycDocument[]> {
    return db.select().from(kycDocuments).where(eq(kycDocuments.status, status)).orderBy(desc(kycDocuments.createdAt));
  }

  async createKycDocument(doc: InsertKycDocument): Promise<KycDocument> {
    const [created] = await db.insert(kycDocuments).values(doc).returning();
    return created;
  }

  async updateKycDocumentStatus(id: string, status: string, notes?: string): Promise<KycDocument | undefined> {
    const data: any = { status };
    if (notes) data.notes = notes;
    const [updated] = await db.update(kycDocuments).set(data).where(eq(kycDocuments.id, id)).returning();
    return updated;
  }

  async reviewKycDocument(id: string, status: string, reviewedBy: string, notes?: string): Promise<KycDocument | undefined> {
    const data: any = { status, reviewedBy, reviewedAt: new Date() };
    if (notes) data.notes = notes;
    const [updated] = await db.update(kycDocuments).set(data).where(eq(kycDocuments.id, id)).returning();
    return updated;
  }

  async getIbReferrals(): Promise<IbReferral[]> {
    return db.select().from(ibReferrals).orderBy(desc(ibReferrals.createdAt));
  }

  async getIbReferralsByUser(userId: string): Promise<IbReferral[]> {
    return db.select().from(ibReferrals).where(eq(ibReferrals.ibUserId, userId));
  }

  async createIbReferral(referral: InsertIbReferral): Promise<IbReferral> {
    const [created] = await db.insert(ibReferrals).values(referral).returning();
    return created;
  }

  async getSupportTickets(): Promise<SupportTicket[]> {
    return db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
  }

  async getSupportTicketsByUser(userId: string): Promise<SupportTicket[]> {
    return db.select().from(supportTickets).where(eq(supportTickets.userId, userId));
  }

  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const [created] = await db.insert(supportTickets).values(ticket).returning();
    return created;
  }

  async updateTicketStatus(id: string, status: string): Promise<SupportTicket | undefined> {
    const [updated] = await db.update(supportTickets).set({ status }).where(eq(supportTickets.id, id)).returning();
    return updated;
  }

  async assignTicket(id: string, assignedTo: string): Promise<SupportTicket | undefined> {
    const [updated] = await db.update(supportTickets).set({ assignedTo }).where(eq(supportTickets.id, id)).returning();
    return updated;
  }

  async getTicketReplies(ticketId: string): Promise<TicketReply[]> {
    return db.select().from(ticketReplies).where(eq(ticketReplies.ticketId, ticketId)).orderBy(ticketReplies.createdAt);
  }

  async createTicketReply(reply: InsertTicketReply): Promise<TicketReply> {
    const [created] = await db.insert(ticketReplies).values(reply).returning();
    return created;
  }

  async getCommissions(): Promise<Commission[]> {
    return db.select().from(commissions).orderBy(desc(commissions.createdAt));
  }

  async getCommissionsByUser(userId: string): Promise<Commission[]> {
    return db.select().from(commissions).where(eq(commissions.userId, userId));
  }

  async createCommission(commission: InsertCommission): Promise<Commission> {
    const [created] = await db.insert(commissions).values(commission).returning();
    return created;
  }

  async getBrokerSettings(): Promise<BrokerSetting[]> {
    return db.select().from(brokerSettings).orderBy(brokerSettings.category);
  }

  async getBrokerSetting(key: string): Promise<BrokerSetting | undefined> {
    const [setting] = await db.select().from(brokerSettings).where(eq(brokerSettings.settingKey, key));
    return setting;
  }

  async upsertBrokerSetting(setting: InsertBrokerSetting): Promise<BrokerSetting> {
    const existing = await this.getBrokerSetting(setting.settingKey);
    if (existing) {
      const [updated] = await db.update(brokerSettings).set({
        settingValue: setting.settingValue,
        category: setting.category,
        description: setting.description,
        updatedAt: new Date(),
      }).where(eq(brokerSettings.settingKey, setting.settingKey)).returning();
      return updated;
    }
    const [created] = await db.insert(brokerSettings).values(setting).returning();
    return created;
  }

  async getCommissionTiers(): Promise<CommissionTier[]> {
    return db.select().from(commissionTiers).orderBy(commissionTiers.level);
  }

  async createCommissionTier(tier: InsertCommissionTier): Promise<CommissionTier> {
    const [created] = await db.insert(commissionTiers).values(tier).returning();
    return created;
  }

  async updateCommissionTier(id: string, data: Partial<InsertCommissionTier>): Promise<CommissionTier | undefined> {
    const [updated] = await db.update(commissionTiers).set(data).where(eq(commissionTiers.id, id)).returning();
    return updated;
  }

  async getDashboardStats() {
    const allTransactions = await this.getTransactions();
    const allAccounts = await this.getTradingAccounts();
    const allTickets = await this.getSupportTickets();
    const allCommissions = await this.getCommissions();
    const allReferrals = await this.getIbReferrals();

    const totalDeposits = allTransactions.filter(t => t.type === "deposit").reduce((sum, t) => sum + Number(t.amount), 0);
    const totalWithdrawals = allTransactions.filter(t => t.type === "withdrawal").reduce((sum, t) => sum + Number(t.amount), 0);
    const totalCommissionsAmount = allCommissions.reduce((sum, c) => sum + Number(c.amount), 0);

    return {
      walletBalance: totalDeposits - totalWithdrawals,
      totalDeposits,
      totalWithdrawals,
      totalCommissions: totalCommissionsAmount,
      tradingAccounts: allAccounts.length,
      openTickets: allTickets.filter(t => t.status === "open").length,
      totalReferrals: allReferrals.length,
    };
  }

  async getAdminDashboardStats() {
    const allUsers = await this.getAllClients();
    const allTransactions = await this.getTransactions();
    const allAccounts = await this.getTradingAccounts();
    const allTickets = await this.getSupportTickets();
    const allKyc = await this.getKycDocuments();
    const allCommissions = await this.getCommissions();
    const allReferrals = await this.getIbReferrals();

    const totalClients = allUsers.filter(u => u.role === "client" || u.role === "ib" || u.role === "lead").length;
    const activeClients = allUsers.filter(u => u.status === "active").length;
    const pendingKyc = allKyc.filter(d => d.status === "pending").length;
    const pendingTransactions = allTransactions.filter(t => t.status === "pending").length;
    const pendingWithdrawals = allTransactions.filter(t => t.type === "withdrawal" && t.status === "pending").length;
    const pendingDeposits = allTransactions.filter(t => t.type === "deposit" && t.status === "pending").length;
    const totalDeposits = allTransactions.filter(t => t.type === "deposit" && t.status === "completed").reduce((sum, t) => sum + Number(t.amount), 0);
    const totalWithdrawals = allTransactions.filter(t => t.type === "withdrawal" && t.status === "completed").reduce((sum, t) => sum + Number(t.amount), 0);
    const totalCommissionsAmount = allCommissions.reduce((sum, c) => sum + Number(c.amount), 0);
    const openTickets = allTickets.filter(t => t.status === "open" || t.status === "in_progress").length;
    const totalAccountBalance = allAccounts.reduce((sum, a) => sum + Number(a.balance), 0);

    return {
      totalClients,
      activeClients,
      pendingKyc,
      pendingTransactions,
      pendingWithdrawals,
      pendingDeposits,
      totalDeposits,
      totalWithdrawals,
      netDeposits: totalDeposits - totalWithdrawals,
      totalCommissions: totalCommissionsAmount,
      openTickets,
      totalAccounts: allAccounts.length,
      activeAccounts: allAccounts.filter(a => a.status === "active").length,
      totalAccountBalance,
      totalReferrals: allReferrals.length,
      activeIBs: allUsers.filter(u => u.role === "ib" && u.status === "active").length,
      recentTransactions: allTransactions.slice(0, 10),
      recentClients: allUsers.slice(0, 5),
    };
  }

  // ==================== SUPER ADMIN STORAGE ====================

  async getAllBrokers(): Promise<Broker[]> {
    return db.select().from(brokers).orderBy(desc(brokers.createdAt));
  }

  async getBroker(id: string): Promise<Broker | undefined> {
    const [broker] = await db.select().from(brokers).where(eq(brokers.id, id));
    return broker;
  }

  async createBroker(broker: InsertBroker): Promise<Broker> {
    const [created] = await db.insert(brokers).values(broker).returning();
    return created;
  }

  async updateBroker(id: string, data: Partial<InsertBroker>): Promise<Broker | undefined> {
    const [updated] = await db.update(brokers).set(data).where(eq(brokers.id, id)).returning();
    return updated;
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return db.select().from(subscriptionPlans).orderBy(subscriptionPlans.price);
  }

  async getSubscriptionPlan(id: string): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan;
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [created] = await db.insert(subscriptionPlans).values(plan).returning();
    return created;
  }

  async updateSubscriptionPlan(id: string, data: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined> {
    const [updated] = await db.update(subscriptionPlans).set(data).where(eq(subscriptionPlans.id, id)).returning();
    return updated;
  }

  async getBrokerSubscriptions(): Promise<BrokerSubscription[]> {
    return db.select().from(brokerSubscriptions).orderBy(desc(brokerSubscriptions.createdAt));
  }

  async getBrokerSubscriptionsByBroker(brokerId: string): Promise<BrokerSubscription[]> {
    return db.select().from(brokerSubscriptions).where(eq(brokerSubscriptions.brokerId, brokerId)).orderBy(desc(brokerSubscriptions.createdAt));
  }

  async createBrokerSubscription(sub: InsertBrokerSubscription): Promise<BrokerSubscription> {
    const [created] = await db.insert(brokerSubscriptions).values(sub).returning();
    return created;
  }

  async updateBrokerSubscription(id: string, data: Partial<InsertBrokerSubscription>): Promise<BrokerSubscription | undefined> {
    const [updated] = await db.update(brokerSubscriptions).set(data).where(eq(brokerSubscriptions.id, id)).returning();
    return updated;
  }

  async getBrokerAdmins(): Promise<BrokerAdmin[]> {
    return db.select().from(brokerAdmins).orderBy(desc(brokerAdmins.createdAt));
  }

  async getBrokerAdminsByBroker(brokerId: string): Promise<BrokerAdmin[]> {
    return db.select().from(brokerAdmins).where(eq(brokerAdmins.brokerId, brokerId)).orderBy(desc(brokerAdmins.createdAt));
  }

  async createBrokerAdmin(admin: InsertBrokerAdmin): Promise<BrokerAdmin> {
    const [created] = await db.insert(brokerAdmins).values(admin).returning();
    return created;
  }

  async updateBrokerAdmin(id: string, data: Partial<InsertBrokerAdmin>): Promise<BrokerAdmin | undefined> {
    const [updated] = await db.update(brokerAdmins).set(data).where(eq(brokerAdmins.id, id)).returning();
    return updated;
  }

  async getBrokerBrandingByBroker(brokerId: string): Promise<BrokerBranding | undefined> {
    const [branding] = await db.select().from(brokerBranding).where(eq(brokerBranding.brokerId, brokerId));
    return branding;
  }

  async upsertBrokerBranding(brokerId: string, data: Partial<InsertBrokerBranding>): Promise<BrokerBranding> {
    const existing = await this.getBrokerBrandingByBroker(brokerId);
    if (existing) {
      const [updated] = await db.update(brokerBranding).set(data).where(eq(brokerBranding.brokerId, brokerId)).returning();
      return updated;
    }
    const [created] = await db.insert(brokerBranding).values({ ...data, brokerId } as any).returning();
    return created;
  }

  async getPlatformSettings(): Promise<PlatformSetting[]> {
    return db.select().from(platformSettings).orderBy(platformSettings.category);
  }

  async upsertPlatformSetting(setting: InsertPlatformSetting): Promise<PlatformSetting> {
    const [existing] = await db.select().from(platformSettings).where(eq(platformSettings.settingKey, setting.settingKey));
    if (existing) {
      const [updated] = await db.update(platformSettings).set({
        settingValue: setting.settingValue,
        category: setting.category,
        description: setting.description,
        updatedAt: new Date(),
      }).where(eq(platformSettings.settingKey, setting.settingKey)).returning();
      return updated;
    }
    const [created] = await db.insert(platformSettings).values(setting).returning();
    return created;
  }

  async getSuperAdminDashboardStats() {
    const allBrokers = await this.getAllBrokers();
    const allPlans = await this.getSubscriptionPlans();
    const allSubs = await this.getBrokerSubscriptions();
    const allAdmins = await this.getBrokerAdmins();
    const allUsers = await this.getAllClients();
    const allTransactions = await this.getTransactions();
    const allAccounts = await this.getTradingAccounts();

    const activeBrokers = allBrokers.filter(b => b.status === "active").length;
    const suspendedBrokers = allBrokers.filter(b => b.status === "suspended").length;
    const activeSubs = allSubs.filter(s => s.status === "active").length;
    const mrr = allSubs
      .filter(s => s.status === "active")
      .reduce((sum, s) => {
        const plan = allPlans.find(p => p.id === s.planId);
        return sum + (plan ? Number(plan.price) : 0);
      }, 0);

    const totalDeposits = allTransactions
      .filter(t => t.type === "deposit" && t.status === "completed")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalBrokers: allBrokers.length,
      activeBrokers,
      suspendedBrokers,
      totalPlans: allPlans.length,
      activeSubscriptions: activeSubs,
      mrr,
      arr: mrr * 12,
      totalAdminUsers: allAdmins.length,
      totalClients: allUsers.length,
      totalAccounts: allAccounts.length,
      totalTransactionVolume: totalDeposits,
      recentBrokers: allBrokers.slice(0, 5),
    };
  }

  // ==================== PROP TRADING STORAGE ====================

  async getPropChallenges(): Promise<PropChallenge[]> {
    return db.select().from(propChallenges).orderBy(desc(propChallenges.createdAt));
  }

  async getPropChallenge(id: string): Promise<PropChallenge | undefined> {
    const [challenge] = await db.select().from(propChallenges).where(eq(propChallenges.id, id));
    return challenge;
  }

  async createPropChallenge(challenge: InsertPropChallenge): Promise<PropChallenge> {
    const [created] = await db.insert(propChallenges).values(challenge).returning();
    return created;
  }

  async getPropAccountsByUser(userId: string): Promise<PropAccount[]> {
    return db.select().from(propAccounts).where(eq(propAccounts.userId, userId)).orderBy(desc(propAccounts.createdAt));
  }

  async getPropAccounts(): Promise<PropAccount[]> {
    return db.select().from(propAccounts).orderBy(desc(propAccounts.createdAt));
  }

  async createPropAccount(account: InsertPropAccount): Promise<PropAccount> {
    const [created] = await db.insert(propAccounts).values(account).returning();
    return created;
  }

  async updatePropAccount(id: string, data: Partial<InsertPropAccount>): Promise<PropAccount | undefined> {
    const [updated] = await db.update(propAccounts).set(data).where(eq(propAccounts.id, id)).returning();
    return updated;
  }

  // ==================== INVESTMENT STORAGE ====================

  async getInvestmentPlans(): Promise<InvestmentPlan[]> {
    return db.select().from(investmentPlans).orderBy(desc(investmentPlans.createdAt));
  }

  async getInvestmentPlan(id: string): Promise<InvestmentPlan | undefined> {
    const [plan] = await db.select().from(investmentPlans).where(eq(investmentPlans.id, id));
    return plan;
  }

  async createInvestmentPlan(plan: InsertInvestmentPlan): Promise<InvestmentPlan> {
    const [created] = await db.insert(investmentPlans).values(plan).returning();
    return created;
  }

  async getInvestmentsByUser(userId: string): Promise<Investment[]> {
    return db.select().from(investments).where(eq(investments.userId, userId)).orderBy(desc(investments.createdAt));
  }

  async getInvestments(): Promise<Investment[]> {
    return db.select().from(investments).orderBy(desc(investments.createdAt));
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const [created] = await db.insert(investments).values(investment).returning();
    return created;
  }

  async updateInvestment(id: string, data: Partial<InsertInvestment>): Promise<Investment | undefined> {
    const [updated] = await db.update(investments).set(data).where(eq(investments.id, id)).returning();
    return updated;
  }

  // ==================== COPY TRADING STORAGE ====================

  async getSignalProviders(): Promise<SignalProvider[]> {
    return db.select().from(signalProviders).orderBy(desc(signalProviders.createdAt));
  }

  async getSignalProvider(id: string): Promise<SignalProvider | undefined> {
    const [provider] = await db.select().from(signalProviders).where(eq(signalProviders.id, id));
    return provider;
  }

  async createSignalProvider(provider: InsertSignalProvider): Promise<SignalProvider> {
    const [created] = await db.insert(signalProviders).values(provider).returning();
    return created;
  }

  async getCopyRelationshipsByUser(userId: string): Promise<CopyRelationship[]> {
    return db.select().from(copyRelationships).where(eq(copyRelationships.followerId, userId)).orderBy(desc(copyRelationships.createdAt));
  }

  async getCopyRelationships(): Promise<CopyRelationship[]> {
    return db.select().from(copyRelationships).orderBy(desc(copyRelationships.createdAt));
  }

  async createCopyRelationship(rel: InsertCopyRelationship): Promise<CopyRelationship> {
    const [created] = await db.insert(copyRelationships).values(rel).returning();
    return created;
  }

  async updateCopyRelationship(id: string, data: Partial<InsertCopyRelationship>): Promise<CopyRelationship | undefined> {
    const [updated] = await db.update(copyRelationships).set(data).where(eq(copyRelationships.id, id)).returning();
    return updated;
  }

  // ==================== PAMM STORAGE ====================

  async getPammManagers(): Promise<PammManager[]> {
    return db.select().from(pammManagers).orderBy(desc(pammManagers.createdAt));
  }

  async getPammManager(id: string): Promise<PammManager | undefined> {
    const [manager] = await db.select().from(pammManagers).where(eq(pammManagers.id, id));
    return manager;
  }

  async createPammManager(manager: InsertPammManager): Promise<PammManager> {
    const [created] = await db.insert(pammManagers).values(manager).returning();
    return created;
  }

  async getPammInvestmentsByUser(userId: string): Promise<PammInvestment[]> {
    return db.select().from(pammInvestments).where(eq(pammInvestments.investorId, userId)).orderBy(desc(pammInvestments.createdAt));
  }

  async getPammInvestments(): Promise<PammInvestment[]> {
    return db.select().from(pammInvestments).orderBy(desc(pammInvestments.createdAt));
  }

  async createPammInvestment(investment: InsertPammInvestment): Promise<PammInvestment> {
    const [created] = await db.insert(pammInvestments).values(investment).returning();
    return created;
  }

  async updatePammInvestment(id: string, data: Partial<InsertPammInvestment>): Promise<PammInvestment | undefined> {
    const [updated] = await db.update(pammInvestments).set(data).where(eq(pammInvestments.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
