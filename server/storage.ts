import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import {
  users,
  tradingAccounts,
  transactions,
  kycDocuments,
  ibReferrals,
  supportTickets,
  ticketReplies,
  commissions,
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
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllClients(): Promise<User[]>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;

  getTradingAccounts(): Promise<TradingAccount[]>;
  getTradingAccountsByUser(userId: string): Promise<TradingAccount[]>;
  createTradingAccount(account: InsertTradingAccount): Promise<TradingAccount>;

  getTransactions(): Promise<Transaction[]>;
  getRecentTransactions(limit?: number): Promise<Transaction[]>;
  getTransactionsByUser(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(id: string, status: string): Promise<Transaction | undefined>;

  getKycDocuments(): Promise<KycDocument[]>;
  getKycDocumentsByUser(userId: string): Promise<KycDocument[]>;
  createKycDocument(doc: InsertKycDocument): Promise<KycDocument>;
  updateKycDocumentStatus(id: string, status: string, notes?: string): Promise<KycDocument | undefined>;

  getIbReferrals(): Promise<IbReferral[]>;
  getIbReferralsByUser(userId: string): Promise<IbReferral[]>;
  createIbReferral(referral: InsertIbReferral): Promise<IbReferral>;

  getSupportTickets(): Promise<SupportTicket[]>;
  getSupportTicketsByUser(userId: string): Promise<SupportTicket[]>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateTicketStatus(id: string, status: string): Promise<SupportTicket | undefined>;

  getTicketReplies(ticketId: string): Promise<TicketReply[]>;
  createTicketReply(reply: InsertTicketReply): Promise<TicketReply>;

  getCommissions(): Promise<Commission[]>;
  getCommissionsByUser(userId: string): Promise<Commission[]>;
  createCommission(commission: InsertCommission): Promise<Commission>;

  getDashboardStats(): Promise<{
    walletBalance: number;
    totalDeposits: number;
    totalWithdrawals: number;
    totalCommissions: number;
    tradingAccounts: number;
    openTickets: number;
    totalReferrals: number;
  }>;
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

  async getTradingAccounts(): Promise<TradingAccount[]> {
    return db.select().from(tradingAccounts).orderBy(desc(tradingAccounts.createdAt));
  }

  async getTradingAccountsByUser(userId: string): Promise<TradingAccount[]> {
    return db.select().from(tradingAccounts).where(eq(tradingAccounts.userId, userId));
  }

  async createTradingAccount(account: InsertTradingAccount): Promise<TradingAccount> {
    const accountNumber = "MT" + Math.floor(10000000 + Math.random() * 90000000).toString();
    const [created] = await db
      .insert(tradingAccounts)
      .values({ ...account, accountNumber })
      .returning();
    return created;
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

  async getKycDocuments(): Promise<KycDocument[]> {
    return db.select().from(kycDocuments).orderBy(desc(kycDocuments.createdAt));
  }

  async getKycDocumentsByUser(userId: string): Promise<KycDocument[]> {
    return db.select().from(kycDocuments).where(eq(kycDocuments.userId, userId));
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
}

export const storage = new DatabaseStorage();
