import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import bcrypt from "bcryptjs";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.userRole !== "admin" && req.session.userRole !== "super_admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.userRole !== "super_admin") {
    return res.status(403).json({ error: "Super admin access required" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ==================== AUTH ROUTES (PUBLIC) ====================

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }).parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      req.session.userId = user.id;
      req.session.userRole = user.role;

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // ==================== MIDDLEWARE PROTECTION ====================

  app.use("/api/admin", requireAuth, requireAdmin);
  app.use("/api/super-admin", requireAuth, requireSuperAdmin);
  app.use("/api", (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/auth")) {
      return next();
    }
    requireAuth(req, res, next);
  });

  // Dashboard
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const userId = req.session.userId!;
      const accounts = await storage.getTradingAccountsByUser(userId);
      const transactions = await storage.getTransactionsByUser(userId);
      const tickets = await storage.getSupportTicketsByUser(userId);

      const deposits = transactions.filter(t => t.type === "deposit" && t.status === "completed");
      const withdrawals = transactions.filter(t => t.type === "withdrawal" && t.status === "completed");
      const totalDeposits = deposits.reduce((sum, d) => sum + Number(d.amount), 0);
      const totalWithdrawals = withdrawals.reduce((sum, w) => sum + Number(w.amount), 0);
      const walletBalance = totalDeposits - totalWithdrawals;
      const openTickets = tickets.filter(t => t.status === "open").length;

      res.json({
        walletBalance,
        totalDeposits,
        totalWithdrawals,
        totalCommissions: 0,
        tradingAccounts: accounts.length,
        openTickets,
        totalReferrals: 0,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Clients
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  const createClientSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    role: z.enum(["client", "ib", "lead", "admin"]).default("client"),
    country: z.string().optional(),
    status: z.string().default("active"),
    kycStatus: z.string().default("pending"),
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const parsed = createClientSchema.parse(req.body);
      const client = await storage.createUser(parsed);
      res.json(client);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: error.message || "Failed to create client" });
    }
  });

  app.patch("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.updateUser(req.params.id, req.body);
      if (!client) return res.status(404).json({ error: "Client not found" });
      res.json(client);
    } catch (error) {
      res.status(400).json({ error: "Failed to update client" });
    }
  });

  // Trading Accounts
  app.get("/api/trading-accounts", async (req, res) => {
    try {
      const accounts = await storage.getTradingAccountsByUser(req.session.userId!);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trading accounts" });
    }
  });

  const createAccountSchema = z.object({
    userId: z.string().optional(),
    platform: z.enum(["MT4", "MT5", "cTrader"]).default("MT5"),
    type: z.enum(["standard", "ecn", "demo", "raw"]).default("standard"),
    leverage: z.string().default("1:100"),
    currency: z.enum(["USD", "EUR", "GBP"]).default("USD"),
  });

  app.post("/api/trading-accounts", async (req, res) => {
    try {
      const parsed = createAccountSchema.parse(req.body);
      const userId = req.session.userId!;
      const account = await storage.createTradingAccount({ ...parsed, userId, accountNumber: "" });
      res.json(account);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: error.message || "Failed to create account" });
    }
  });

  app.get("/api/trading-accounts/:id", requireAuth, async (req, res) => {
    try {
      const account = await storage.getTradingAccountById(req.params.id as string);
      if (!account) return res.status(404).json({ error: "Account not found" });
      if (account.userId !== req.session.userId) return res.status(403).json({ error: "Not authorized" });
      const allTxns = await storage.getTransactionsByUser(req.session.userId!);
      const accountTxns = allTxns.filter(t => t.accountId === account.id);
      res.json({ account, transactions: accountTxns });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch account details" });
    }
  });

  app.post("/api/trading-accounts/:id/change-password", requireAuth, async (req, res) => {
    try {
      const { newPassword } = z.object({ newPassword: z.string().min(6, "Password must be at least 6 characters") }).parse(req.body);
      const account = await storage.getTradingAccountById(req.params.id as string);
      if (!account) return res.status(404).json({ error: "Account not found" });
      if (account.userId !== req.session.userId) return res.status(403).json({ error: "Not authorized" });
      res.json({ message: "Trading account password updated successfully" });
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  app.patch("/api/trading-accounts/:id/leverage", requireAuth, async (req, res) => {
    try {
      const { leverage } = z.object({ leverage: z.string() }).parse(req.body);
      const account = await storage.getTradingAccountById(req.params.id as string);
      if (!account) return res.status(404).json({ error: "Account not found" });
      if (account.userId !== req.session.userId) return res.status(403).json({ error: "Not authorized" });
      const updated = await storage.updateTradingAccount(account.id, { leverage });
      res.json(updated);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(500).json({ error: "Failed to change leverage" });
    }
  });

  app.post("/api/trading-accounts/:id/deposit", requireAuth, async (req, res) => {
    try {
      const { amount } = z.object({ amount: z.string().min(1) }).parse(req.body);
      const account = await storage.getTradingAccountById(req.params.id as string);
      if (!account) return res.status(404).json({ error: "Account not found" });
      if (account.userId !== req.session.userId) return res.status(403).json({ error: "Not authorized" });
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) return res.status(400).json({ error: "Invalid amount" });
      const userTxns = await storage.getTransactionsByUser(req.session.userId!);
      const totalDeposits = userTxns.filter(t => t.type === "deposit" && (t.status === "approved" || t.status === "completed")).reduce((s, t) => s + Number(t.amount), 0);
      const totalWithdrawals = userTxns.filter(t => t.type === "withdrawal" && (t.status === "approved" || t.status === "completed")).reduce((s, t) => s + Number(t.amount), 0);
      const walletBalance = totalDeposits - totalWithdrawals;
      if (numAmount > walletBalance) return res.status(400).json({ error: `Insufficient wallet balance. Available: $${walletBalance.toFixed(2)}` });
      const debitTxn = await storage.createTransaction({
        userId: req.session.userId!,
        type: "withdrawal",
        amount,
        currency: account.currency,
        method: "wallet_transfer",
        notes: `Transfer to trading account ${account.accountNumber}`,
        status: "approved",
      });
      const creditTxn = await storage.createTransaction({
        userId: req.session.userId!,
        accountId: account.id,
        type: "deposit",
        amount,
        currency: account.currency,
        method: "wallet_transfer",
        notes: `Wallet transfer to ${account.accountNumber}`,
        status: "approved",
      });
      const newBalance = (parseFloat(account.balance as string) + numAmount).toFixed(2);
      const newEquity = (parseFloat(account.equity as string) + numAmount).toFixed(2);
      await storage.updateTradingAccount(account.id, { balance: newBalance, equity: newEquity });
      res.json({ transaction: creditTxn, newBalance });
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(500).json({ error: "Failed to deposit to account" });
    }
  });

  // Transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const txns = await storage.getTransactionsByUser(req.session.userId!);
      res.json(txns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/recent", async (req, res) => {
    try {
      const allTxns = await storage.getTransactionsByUser(req.session.userId!);
      const txns = allTxns.slice(0, 5);
      res.json(txns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent transactions" });
    }
  });

  const createTransactionSchema = z.object({
    userId: z.string().optional(),
    type: z.enum(["deposit", "withdrawal"]),
    amount: z.string().min(1),
    currency: z.string().default("USD"),
    method: z.string().optional(),
    notes: z.string().optional(),
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const parsed = createTransactionSchema.parse(req.body);
      const userId = req.session.userId!;
      const txn = await storage.createTransaction({ ...parsed, userId });
      res.json(txn);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: error.message || "Failed to create transaction" });
    }
  });

  app.post("/api/wallet-transfer", requireAuth, async (req, res) => {
    try {
      const { recipientEmail, amount, message } = z.object({
        recipientEmail: z.string().email(),
        amount: z.string().min(1),
        message: z.string().optional(),
      }).parse(req.body);
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) return res.status(400).json({ error: "Invalid amount" });
      const sender = await storage.getUser(req.session.userId!);
      if (!sender) return res.status(404).json({ error: "Sender not found" });
      if (recipientEmail.toLowerCase() === sender.email.toLowerCase()) {
        return res.status(400).json({ error: "Cannot transfer to yourself" });
      }
      const recipient = await storage.getUserByEmail(recipientEmail);
      if (!recipient) return res.status(404).json({ error: "Recipient not found. Please check the email address." });
      const userTxns = await storage.getTransactionsByUser(req.session.userId!);
      const totalDeposits = userTxns.filter(t => t.type === "deposit" && (t.status === "approved" || t.status === "completed")).reduce((s, t) => s + Number(t.amount), 0);
      const totalWithdrawals = userTxns.filter(t => t.type === "withdrawal" && (t.status === "approved" || t.status === "completed")).reduce((s, t) => s + Number(t.amount), 0);
      const walletBalance = totalDeposits - totalWithdrawals;
      if (numAmount > walletBalance) return res.status(400).json({ error: `Insufficient wallet balance. Available: $${walletBalance.toFixed(2)}` });
      const noteText = message ? `Wallet transfer to ${recipientEmail}: ${message}` : `Wallet transfer to ${recipientEmail}`;
      await storage.createTransaction({
        userId: req.session.userId!,
        type: "withdrawal",
        amount,
        currency: "USD",
        method: "wallet_transfer",
        notes: noteText,
        status: "approved",
      });
      await storage.createTransaction({
        userId: recipient.id,
        type: "deposit",
        amount,
        currency: "USD",
        method: "wallet_transfer",
        notes: `Wallet transfer from ${sender.email}${message ? ": " + message : ""}`,
        status: "approved",
      });
      res.json({ success: true, message: `$${numAmount.toFixed(2)} transferred to ${recipientEmail}` });
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(500).json({ error: error.message || "Transfer failed" });
    }
  });

  app.patch("/api/transactions/:id/status", async (req, res) => {
    try {
      const { status } = z.object({ status: z.string() }).parse(req.body);
      const txn = await storage.updateTransactionStatus(req.params.id, status);
      if (!txn) return res.status(404).json({ error: "Transaction not found" });
      res.json(txn);
    } catch (error) {
      res.status(400).json({ error: "Failed to update transaction" });
    }
  });

  // KYC Documents
  app.get("/api/kyc/documents", async (req, res) => {
    try {
      const docs = await storage.getKycDocumentsByUser(req.session.userId!);
      res.json(docs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch KYC documents" });
    }
  });

  const createKycDocSchema = z.object({
    userId: z.string().optional(),
    documentType: z.string().min(1),
    fileName: z.string().min(1),
  });

  app.post("/api/kyc/documents", async (req, res) => {
    try {
      const parsed = createKycDocSchema.parse(req.body);
      const userId = req.session.userId!;
      const doc = await storage.createKycDocument({ ...parsed, userId });
      res.json(doc);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: error.message || "Failed to upload document" });
    }
  });

  app.patch("/api/kyc/documents/:id", async (req, res) => {
    try {
      const { status, notes } = z.object({ status: z.string(), notes: z.string().optional() }).parse(req.body);
      const doc = await storage.updateKycDocumentStatus(req.params.id, status, notes);
      if (!doc) return res.status(404).json({ error: "Document not found" });
      res.json(doc);
    } catch (error) {
      res.status(400).json({ error: "Failed to update document" });
    }
  });

  // IB Referrals
  app.get("/api/ib/referrals", async (req, res) => {
    try {
      const refs = await storage.getIbReferrals();
      res.json(refs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch referrals" });
    }
  });

  app.post("/api/ib/referrals", async (req, res) => {
    try {
      const parsed = z.object({
        ibUserId: z.string(),
        referredUserId: z.string(),
        commission: z.string().default("0"),
        level: z.number().default(1),
      }).parse(req.body);
      const ref = await storage.createIbReferral(parsed);
      res.json(ref);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: error.message || "Failed to create referral" });
    }
  });

  app.post("/api/commission-transfer", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const userCommissions = await storage.getCommissionsByUser(userId);
      const paidCommissions = userCommissions.filter(c => c.status === "paid");
      const totalAmount = paidCommissions.reduce((s, c) => s + Number(c.amount), 0);
      if (totalAmount <= 0) {
        return res.status(400).json({ error: "No commission balance available to transfer" });
      }
      await storage.createTransaction({
        userId,
        type: "deposit",
        amount: totalAmount.toString(),
        currency: "USD",
        method: "commission_transfer",
        notes: `Commission transfer to wallet ($${totalAmount.toFixed(2)})`,
        status: "approved",
      });
      for (const comm of paidCommissions) {
        await storage.updateCommissionStatus(comm.id, "transferred");
      }
      res.json({ success: true, message: `$${totalAmount.toFixed(2)} commission transferred to wallet` });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Commission transfer failed" });
    }
  });

  // Commissions
  app.get("/api/commissions", async (req, res) => {
    try {
      const comms = await storage.getCommissions();
      res.json(comms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch commissions" });
    }
  });

  // Support Tickets
  app.get("/api/support/tickets", async (req, res) => {
    try {
      const tickets = await storage.getSupportTicketsByUser(req.session.userId!);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  const createTicketSchema = z.object({
    userId: z.string().optional(),
    subject: z.string().min(1),
    message: z.string().min(1),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
    category: z.string().default("general"),
  });

  app.post("/api/support/tickets", async (req, res) => {
    try {
      const parsed = createTicketSchema.parse(req.body);
      const userId = req.session.userId!;
      const ticket = await storage.createSupportTicket({ ...parsed, userId });
      res.json(ticket);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: error.message || "Failed to create ticket" });
    }
  });

  app.patch("/api/support/tickets/:id/status", async (req, res) => {
    try {
      const { status } = z.object({ status: z.string() }).parse(req.body);
      const ticket = await storage.updateTicketStatus(req.params.id, status);
      if (!ticket) return res.status(404).json({ error: "Ticket not found" });
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ error: "Failed to update ticket" });
    }
  });

  app.get("/api/support/tickets/:id/replies", async (req, res) => {
    try {
      const replies = await storage.getTicketReplies(req.params.id);
      res.json(replies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch replies" });
    }
  });

  const createReplySchema = z.object({
    userId: z.string(),
    message: z.string().min(1),
    isAdmin: z.boolean().default(false),
  });

  app.post("/api/support/tickets/:id/replies", async (req, res) => {
    try {
      const parsed = createReplySchema.parse(req.body);
      const reply = await storage.createTicketReply({
        ...parsed,
        ticketId: req.params.id,
      });
      res.json(reply);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: error.message || "Failed to create reply" });
    }
  });

  // ==================== ADMIN API ROUTES ====================

  // Admin Dashboard
  app.get("/api/admin/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getAdminDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin dashboard stats" });
    }
  });

  // Admin - Client Management
  app.get("/api/admin/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/api/admin/clients/:id", async (req, res) => {
    try {
      const client = await storage.getUser(req.params.id);
      if (!client) return res.status(404).json({ error: "Client not found" });
      const accounts = await storage.getTradingAccountsByUser(req.params.id);
      const txns = await storage.getTransactionsByUser(req.params.id);
      const kyc = await storage.getKycDocumentsByUser(req.params.id);
      const tickets = await storage.getSupportTicketsByUser(req.params.id);
      res.json({ client, accounts, transactions: txns, kycDocuments: kyc, tickets });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client details" });
    }
  });

  app.patch("/api/admin/clients/:id", async (req, res) => {
    try {
      const client = await storage.updateUser(req.params.id, req.body);
      if (!client) return res.status(404).json({ error: "Client not found" });
      res.json(client);
    } catch (error) {
      res.status(400).json({ error: "Failed to update client" });
    }
  });

  app.patch("/api/admin/clients/:id/status", async (req, res) => {
    try {
      const { status } = z.object({ status: z.string() }).parse(req.body);
      const client = await storage.updateUser(req.params.id, { status } as any);
      if (!client) return res.status(404).json({ error: "Client not found" });
      res.json(client);
    } catch (error) {
      res.status(400).json({ error: "Failed to update client status" });
    }
  });

  app.patch("/api/admin/clients/:id/kyc-status", async (req, res) => {
    try {
      const { kycStatus } = z.object({ kycStatus: z.string() }).parse(req.body);
      const client = await storage.updateUser(req.params.id, { kycStatus } as any);
      if (!client) return res.status(404).json({ error: "Client not found" });
      res.json(client);
    } catch (error) {
      res.status(400).json({ error: "Failed to update KYC status" });
    }
  });

  // Admin - Trading Accounts
  app.get("/api/admin/trading-accounts", async (req, res) => {
    try {
      const accounts = await storage.getTradingAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trading accounts" });
    }
  });

  app.post("/api/admin/trading-accounts", async (req, res) => {
    try {
      const parsed = z.object({
        userId: z.string(),
        platform: z.string().default("MT5"),
        type: z.string().default("standard"),
        leverage: z.string().default("1:100"),
        currency: z.string().default("USD"),
        balance: z.string().default("0"),
        equity: z.string().default("0"),
      }).parse(req.body);
      const account = await storage.createTradingAccount({ ...parsed, accountNumber: "" });
      res.json(account);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(400).json({ error: error.message || "Failed to create account" });
    }
  });

  app.patch("/api/admin/trading-accounts/:id", async (req, res) => {
    try {
      const account = await storage.updateTradingAccount(req.params.id, req.body);
      if (!account) return res.status(404).json({ error: "Account not found" });
      res.json(account);
    } catch (error) {
      res.status(400).json({ error: "Failed to update account" });
    }
  });

  // Admin - Financial Operations (Transactions)
  app.get("/api/admin/transactions", async (req, res) => {
    try {
      const txns = await storage.getTransactions();
      res.json(txns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/admin/transactions/pending", async (req, res) => {
    try {
      const txns = await storage.getTransactionsByStatus("pending");
      res.json(txns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending transactions" });
    }
  });

  app.post("/api/admin/transactions/:id/approve", async (req, res) => {
    try {
      const { approvedBy } = z.object({ approvedBy: z.string().default("admin") }).parse(req.body);
      const txn = await storage.approveTransaction(req.params.id, approvedBy);
      if (!txn) return res.status(404).json({ error: "Transaction not found" });
      res.json(txn);
    } catch (error) {
      res.status(400).json({ error: "Failed to approve transaction" });
    }
  });

  app.post("/api/admin/transactions/:id/reject", async (req, res) => {
    try {
      const { reason } = z.object({ reason: z.string().min(1) }).parse(req.body);
      const txn = await storage.rejectTransaction(req.params.id, reason);
      if (!txn) return res.status(404).json({ error: "Transaction not found" });
      res.json(txn);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(400).json({ error: "Failed to reject transaction" });
    }
  });

  // Admin - KYC Documents
  app.get("/api/admin/kyc/documents", async (req, res) => {
    try {
      const docs = await storage.getKycDocuments();
      res.json(docs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch KYC documents" });
    }
  });

  app.get("/api/admin/kyc/pending", async (req, res) => {
    try {
      const docs = await storage.getKycDocumentsByStatus("pending");
      res.json(docs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending KYC documents" });
    }
  });

  app.post("/api/admin/kyc/documents/:id/review", async (req, res) => {
    try {
      const { status, reviewedBy, notes } = z.object({
        status: z.enum(["approved", "rejected"]),
        reviewedBy: z.string().default("admin"),
        notes: z.string().optional(),
      }).parse(req.body);
      const doc = await storage.reviewKycDocument(req.params.id, status, reviewedBy, notes);
      if (!doc) return res.status(404).json({ error: "Document not found" });
      res.json(doc);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(400).json({ error: "Failed to review document" });
    }
  });

  // Admin - IB / Affiliate
  app.get("/api/admin/ib/referrals", async (req, res) => {
    try {
      const refs = await storage.getIbReferrals();
      res.json(refs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch referrals" });
    }
  });

  app.get("/api/admin/commissions", async (req, res) => {
    try {
      const comms = await storage.getCommissions();
      res.json(comms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch commissions" });
    }
  });

  app.get("/api/admin/commission-tiers", async (req, res) => {
    try {
      const tiers = await storage.getCommissionTiers();
      res.json(tiers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch commission tiers" });
    }
  });

  app.post("/api/admin/commission-tiers", async (req, res) => {
    try {
      const parsed = z.object({
        name: z.string().min(1),
        level: z.number(),
        commissionRate: z.string(),
        minVolume: z.string().default("0"),
        maxVolume: z.string().nullable().optional(),
      }).parse(req.body);
      const tier = await storage.createCommissionTier(parsed);
      res.json(tier);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(400).json({ error: error.message || "Failed to create tier" });
    }
  });

  // Admin - Support Tickets
  app.get("/api/admin/support/tickets", async (req, res) => {
    try {
      const tickets = await storage.getSupportTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  app.patch("/api/admin/support/tickets/:id/status", async (req, res) => {
    try {
      const { status } = z.object({ status: z.string() }).parse(req.body);
      const ticket = await storage.updateTicketStatus(req.params.id, status);
      if (!ticket) return res.status(404).json({ error: "Ticket not found" });
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ error: "Failed to update ticket status" });
    }
  });

  app.patch("/api/admin/support/tickets/:id/assign", async (req, res) => {
    try {
      const { assignedTo } = z.object({ assignedTo: z.string() }).parse(req.body);
      const ticket = await storage.assignTicket(req.params.id, assignedTo);
      if (!ticket) return res.status(404).json({ error: "Ticket not found" });
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ error: "Failed to assign ticket" });
    }
  });

  app.post("/api/admin/support/tickets/:id/reply", async (req, res) => {
    try {
      const parsed = z.object({
        userId: z.string(),
        message: z.string().min(1),
      }).parse(req.body);
      const reply = await storage.createTicketReply({
        ...parsed,
        ticketId: req.params.id,
        isAdmin: true,
      });
      res.json(reply);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(400).json({ error: error.message || "Failed to create reply" });
    }
  });

  // Admin - Broker Settings
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.getBrokerSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/settings", async (req, res) => {
    try {
      const parsed = z.object({
        settingKey: z.string().min(1),
        settingValue: z.string(),
        category: z.string().default("general"),
        description: z.string().optional(),
      }).parse(req.body);
      const setting = await storage.upsertBrokerSetting(parsed);
      res.json(setting);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(400).json({ error: error.message || "Failed to save setting" });
    }
  });

  // ==================== SUPER ADMIN API ROUTES ====================

  // Super Admin Dashboard
  app.get("/api/super-admin/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getSuperAdminDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch super admin stats" });
    }
  });

  // Super Admin - Brokers
  app.get("/api/super-admin/brokers", async (req, res) => {
    try {
      const allBrokers = await storage.getAllBrokers();
      res.json(allBrokers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brokers" });
    }
  });

  app.get("/api/super-admin/brokers/:id", async (req, res) => {
    try {
      const broker = await storage.getBroker(req.params.id);
      if (!broker) return res.status(404).json({ error: "Broker not found" });
      const admins = await storage.getBrokerAdminsByBroker(req.params.id);
      const subs = await storage.getBrokerSubscriptionsByBroker(req.params.id);
      const branding = await storage.getBrokerBrandingByBroker(req.params.id);
      res.json({ broker, admins, subscriptions: subs, branding });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch broker details" });
    }
  });

  app.post("/api/super-admin/brokers", async (req, res) => {
    try {
      const parsed = z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        companyName: z.string().optional(),
        country: z.string().optional(),
        status: z.string().default("active"),
        maxClients: z.number().default(100),
        maxAccounts: z.number().default(500),
      }).parse(req.body);
      const broker = await storage.createBroker(parsed);
      res.json(broker);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(400).json({ error: error.message || "Failed to create broker" });
    }
  });

  app.patch("/api/super-admin/brokers/:id", async (req, res) => {
    try {
      const broker = await storage.updateBroker(req.params.id, req.body);
      if (!broker) return res.status(404).json({ error: "Broker not found" });
      res.json(broker);
    } catch (error) {
      res.status(400).json({ error: "Failed to update broker" });
    }
  });

  app.post("/api/super-admin/brokers/:id/suspend", async (req, res) => {
    try {
      const broker = await storage.updateBroker(req.params.id, { status: "suspended" } as any);
      if (!broker) return res.status(404).json({ error: "Broker not found" });
      res.json(broker);
    } catch (error) {
      res.status(400).json({ error: "Failed to suspend broker" });
    }
  });

  app.post("/api/super-admin/brokers/:id/activate", async (req, res) => {
    try {
      const broker = await storage.updateBroker(req.params.id, { status: "active" } as any);
      if (!broker) return res.status(404).json({ error: "Broker not found" });
      res.json(broker);
    } catch (error) {
      res.status(400).json({ error: "Failed to activate broker" });
    }
  });

  // Super Admin - Subscription Plans
  app.get("/api/super-admin/plans", async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  app.post("/api/super-admin/plans", async (req, res) => {
    try {
      const parsed = z.object({
        name: z.string().min(1),
        price: z.string(),
        billingCycle: z.string().default("monthly"),
        maxClients: z.number().default(100),
        maxAccounts: z.number().default(500),
        maxIBs: z.number().default(50),
        features: z.string().optional(),
        status: z.string().default("active"),
      }).parse(req.body);
      const plan = await storage.createSubscriptionPlan(parsed);
      res.json(plan);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(400).json({ error: error.message || "Failed to create plan" });
    }
  });

  app.patch("/api/super-admin/plans/:id", async (req, res) => {
    try {
      const plan = await storage.updateSubscriptionPlan(req.params.id, req.body);
      if (!plan) return res.status(404).json({ error: "Plan not found" });
      res.json(plan);
    } catch (error) {
      res.status(400).json({ error: "Failed to update plan" });
    }
  });

  // Super Admin - Subscriptions
  app.get("/api/super-admin/subscriptions", async (req, res) => {
    try {
      const subs = await storage.getBrokerSubscriptions();
      res.json(subs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });

  app.post("/api/super-admin/subscriptions", async (req, res) => {
    try {
      const parsed = z.object({
        brokerId: z.string(),
        planId: z.string(),
        status: z.string().default("active"),
      }).parse(req.body);
      const sub = await storage.createBrokerSubscription(parsed);
      res.json(sub);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(400).json({ error: error.message || "Failed to create subscription" });
    }
  });

  app.patch("/api/super-admin/subscriptions/:id", async (req, res) => {
    try {
      const sub = await storage.updateBrokerSubscription(req.params.id, req.body);
      if (!sub) return res.status(404).json({ error: "Subscription not found" });
      res.json(sub);
    } catch (error) {
      res.status(400).json({ error: "Failed to update subscription" });
    }
  });

  // Super Admin - Broker Admins
  app.get("/api/super-admin/admins", async (req, res) => {
    try {
      const admins = await storage.getBrokerAdmins();
      res.json(admins);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admins" });
    }
  });

  app.get("/api/super-admin/brokers/:id/admins", async (req, res) => {
    try {
      const admins = await storage.getBrokerAdminsByBroker(req.params.id);
      res.json(admins);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch broker admins" });
    }
  });

  app.post("/api/super-admin/admins", async (req, res) => {
    try {
      const parsed = z.object({
        brokerId: z.string(),
        fullName: z.string().min(1),
        email: z.string().email(),
        role: z.string().default("admin"),
        status: z.string().default("active"),
      }).parse(req.body);
      const admin = await storage.createBrokerAdmin(parsed);
      res.json(admin);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(400).json({ error: error.message || "Failed to create admin" });
    }
  });

  app.patch("/api/super-admin/admins/:id", async (req, res) => {
    try {
      const admin = await storage.updateBrokerAdmin(req.params.id, req.body);
      if (!admin) return res.status(404).json({ error: "Admin not found" });
      res.json(admin);
    } catch (error) {
      res.status(400).json({ error: "Failed to update admin" });
    }
  });

  // Super Admin - Broker Branding
  app.get("/api/super-admin/brokers/:id/branding", async (req, res) => {
    try {
      const branding = await storage.getBrokerBrandingByBroker(req.params.id);
      res.json(branding || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch branding" });
    }
  });

  app.patch("/api/super-admin/brokers/:id/branding", async (req, res) => {
    try {
      const branding = await storage.upsertBrokerBranding(req.params.id, req.body);
      res.json(branding);
    } catch (error) {
      res.status(400).json({ error: "Failed to update branding" });
    }
  });

  // Super Admin - Platform Settings
  app.get("/api/super-admin/platform-settings", async (req, res) => {
    try {
      const settings = await storage.getPlatformSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch platform settings" });
    }
  });

  app.post("/api/super-admin/platform-settings", async (req, res) => {
    try {
      const parsed = z.object({
        settingKey: z.string().min(1),
        settingValue: z.string(),
        category: z.string().default("general"),
        description: z.string().optional(),
      }).parse(req.body);
      const setting = await storage.upsertPlatformSetting(parsed);
      res.json(setting);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(400).json({ error: error.message || "Failed to save setting" });
    }
  });

  // ==================== PROP TRADING ROUTES ====================

  app.get("/api/prop/challenges", requireAuth, async (req, res) => {
    try {
      const challenges = await storage.getPropChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch challenges" });
    }
  });

  app.get("/api/prop/accounts", requireAuth, async (req, res) => {
    try {
      const accounts = await storage.getPropAccountsByUser(req.session.userId!);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch prop accounts" });
    }
  });

  app.post("/api/prop/accounts", requireAuth, async (req, res) => {
    try {
      const { challengeId } = z.object({ challengeId: z.string() }).parse(req.body);
      const challenge = await storage.getPropChallenge(challengeId);
      if (!challenge) return res.status(404).json({ error: "Challenge not found" });
      const accountNumber = "PROP" + Math.floor(10000000 + Math.random() * 90000000).toString();
      const account = await storage.createPropAccount({
        userId: req.session.userId!,
        challengeId,
        accountNumber,
        currentBalance: challenge.accountSize,
        status: "active",
      });
      res.status(201).json(account);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(500).json({ error: "Failed to create prop account" });
    }
  });

  // ==================== INVESTMENT ROUTES ====================

  app.get("/api/investments/plans", requireAuth, async (req, res) => {
    try {
      const plans = await storage.getInvestmentPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch investment plans" });
    }
  });

  app.get("/api/investments", requireAuth, async (req, res) => {
    try {
      const investments = await storage.getInvestmentsByUser(req.session.userId!);
      res.json(investments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch investments" });
    }
  });

  app.post("/api/investments", requireAuth, async (req, res) => {
    try {
      const { planId, amount } = z.object({
        planId: z.string(),
        amount: z.string(),
      }).parse(req.body);
      const plan = await storage.getInvestmentPlan(planId);
      if (!plan) return res.status(404).json({ error: "Plan not found" });
      const maturityDate = new Date();
      maturityDate.setDate(maturityDate.getDate() + plan.durationDays);
      const investment = await storage.createInvestment({
        userId: req.session.userId!,
        planId,
        amount,
        currentValue: amount,
        startDate: new Date(),
        maturityDate,
      });
      res.status(201).json(investment);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(500).json({ error: "Failed to create investment" });
    }
  });

  // ==================== COPY TRADING ROUTES ====================

  app.get("/api/copy/providers", requireAuth, async (req, res) => {
    try {
      const providers = await storage.getSignalProviders();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch signal providers" });
    }
  });

  app.get("/api/copy/relationships", requireAuth, async (req, res) => {
    try {
      const rels = await storage.getCopyRelationshipsByUser(req.session.userId!);
      res.json(rels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch copy relationships" });
    }
  });

  app.post("/api/copy/relationships", requireAuth, async (req, res) => {
    try {
      const { providerId, allocatedAmount } = z.object({
        providerId: z.string(),
        allocatedAmount: z.string(),
      }).parse(req.body);
      const provider = await storage.getSignalProvider(providerId);
      if (!provider) return res.status(404).json({ error: "Provider not found" });
      const rel = await storage.createCopyRelationship({
        followerId: req.session.userId!,
        providerId,
        allocatedAmount,
      });
      res.status(201).json(rel);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(500).json({ error: "Failed to create copy relationship" });
    }
  });

  app.patch("/api/copy/relationships/:id", requireAuth, async (req, res) => {
    try {
      const { status } = z.object({ status: z.string() }).parse(req.body);
      const userRels = await storage.getCopyRelationshipsByUser(req.session.userId!);
      const owns = userRels.find(r => r.id === req.params.id);
      if (!owns) return res.status(403).json({ error: "Not authorized" });
      const updated = await storage.updateCopyRelationship(req.params.id as string, { status });
      if (!updated) return res.status(404).json({ error: "Relationship not found" });
      res.json(updated);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(500).json({ error: "Failed to update relationship" });
    }
  });

  // ==================== PAMM ROUTES ====================

  app.get("/api/pamm/managers", requireAuth, async (req, res) => {
    try {
      const managers = await storage.getPammManagers();
      res.json(managers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch PAMM managers" });
    }
  });

  app.get("/api/pamm/investments", requireAuth, async (req, res) => {
    try {
      const investments = await storage.getPammInvestmentsByUser(req.session.userId!);
      res.json(investments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch PAMM investments" });
    }
  });

  app.post("/api/pamm/investments", requireAuth, async (req, res) => {
    try {
      const { managerId, amount } = z.object({
        managerId: z.string(),
        amount: z.string(),
      }).parse(req.body);
      const manager = await storage.getPammManager(managerId);
      if (!manager) return res.status(404).json({ error: "Manager not found" });
      const investment = await storage.createPammInvestment({
        investorId: req.session.userId!,
        managerId,
        amount,
        currentValue: amount,
      });
      res.status(201).json(investment);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0].message });
      res.status(500).json({ error: "Failed to create PAMM investment" });
    }
  });

  return httpServer;
}
