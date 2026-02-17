import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Dashboard
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
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
      const accounts = await storage.getTradingAccounts();
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
      let userId = parsed.userId;
      if (!userId) {
        const clients = await storage.getAllClients();
        const adminUser = clients.find(c => c.role === "admin") || clients[0];
        if (!adminUser) return res.status(400).json({ error: "No user available" });
        userId = adminUser.id;
      }
      const account = await storage.createTradingAccount({ ...parsed, userId, accountNumber: "" });
      res.json(account);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: error.message || "Failed to create account" });
    }
  });

  // Transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const txns = await storage.getTransactions();
      res.json(txns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/recent", async (req, res) => {
    try {
      const txns = await storage.getRecentTransactions(5);
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
      let userId = parsed.userId;
      if (!userId) {
        const clients = await storage.getAllClients();
        const adminUser = clients.find(c => c.role === "admin") || clients[0];
        if (!adminUser) return res.status(400).json({ error: "No user available" });
        userId = adminUser.id;
      }
      const txn = await storage.createTransaction({ ...parsed, userId });
      res.json(txn);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: error.message || "Failed to create transaction" });
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
      const docs = await storage.getKycDocuments();
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
      let userId = parsed.userId;
      if (!userId) {
        const clients = await storage.getAllClients();
        const adminUser = clients.find(c => c.role === "admin") || clients[0];
        if (!adminUser) return res.status(400).json({ error: "No user available" });
        userId = adminUser.id;
      }
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
      const tickets = await storage.getSupportTickets();
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
      let userId = parsed.userId;
      if (!userId) {
        const clients = await storage.getAllClients();
        const adminUser = clients.find(c => c.role === "admin") || clients[0];
        if (!adminUser) return res.status(400).json({ error: "No user available" });
        userId = adminUser.id;
      }
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

  return httpServer;
}
