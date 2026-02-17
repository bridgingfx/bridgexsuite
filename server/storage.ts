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
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllClients(): Promise<User[]>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  getTradingAccounts(): Promise<TradingAccount[]>;
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
}

export const storage = new DatabaseStorage();
