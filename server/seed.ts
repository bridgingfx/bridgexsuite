import { db } from "./db";
import { users, tradingAccounts, transactions, kycDocuments, ibReferrals, supportTickets, commissions } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) return;

  console.log("Seeding database...");

  const [admin] = await db.insert(users).values({
    username: "admin@forexcrm.com",
    password: "admin123",
    fullName: "Admin User",
    email: "admin@forexcrm.com",
    phone: "+1 234 567 890",
    role: "admin",
    status: "active",
    kycStatus: "verified",
    country: "United States",
  }).returning();

  const [john] = await db.insert(users).values({
    username: "john.smith@email.com",
    password: "pass123",
    fullName: "John Smith",
    email: "john.smith@email.com",
    phone: "+44 20 7946 0958",
    role: "client",
    status: "active",
    kycStatus: "verified",
    country: "United Kingdom",
  }).returning();

  const [sarah] = await db.insert(users).values({
    username: "sarah.chen@email.com",
    password: "pass123",
    fullName: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+86 138 0013 8000",
    role: "client",
    status: "active",
    kycStatus: "pending",
    country: "China",
  }).returning();

  const [ahmed] = await db.insert(users).values({
    username: "ahmed.hassan@email.com",
    password: "pass123",
    fullName: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    phone: "+971 50 123 4567",
    role: "ib",
    status: "active",
    kycStatus: "verified",
    country: "UAE",
  }).returning();

  const [maria] = await db.insert(users).values({
    username: "maria.garcia@email.com",
    password: "pass123",
    fullName: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+34 612 345 678",
    role: "lead",
    status: "pending",
    kycStatus: "unverified",
    country: "Spain",
  }).returning();

  const [kenji] = await db.insert(users).values({
    username: "kenji.tanaka@email.com",
    password: "pass123",
    fullName: "Kenji Tanaka",
    email: "kenji.tanaka@email.com",
    phone: "+81 90 1234 5678",
    role: "client",
    status: "inactive",
    kycStatus: "rejected",
    country: "Japan",
  }).returning();

  // Trading Accounts
  await db.insert(tradingAccounts).values([
    { userId: john.id, accountNumber: "MT50012345", platform: "MT5", type: "standard", leverage: "1:100", balance: "12450.50", equity: "12890.30", currency: "USD", status: "active" },
    { userId: john.id, accountNumber: "MT40056789", platform: "MT4", type: "ecn", leverage: "1:200", balance: "5230.00", equity: "5180.75", currency: "USD", status: "active" },
    { userId: sarah.id, accountNumber: "MT50098765", platform: "MT5", type: "standard", leverage: "1:100", balance: "8900.25", equity: "9120.50", currency: "USD", status: "active" },
    { userId: ahmed.id, accountNumber: "CT10034567", platform: "cTrader", type: "raw", leverage: "1:500", balance: "25000.00", equity: "24800.00", currency: "USD", status: "active" },
    { userId: sarah.id, accountNumber: "MT50011111", platform: "MT5", type: "demo", leverage: "1:100", balance: "100000.00", equity: "100000.00", currency: "USD", status: "active" },
  ]);

  // Transactions
  await db.insert(transactions).values([
    { userId: john.id, type: "deposit", amount: "5000.00", currency: "USD", status: "completed", method: "bank_transfer", reference: "TXN001ABC" },
    { userId: john.id, type: "deposit", amount: "2500.00", currency: "USD", status: "completed", method: "credit_card", reference: "TXN002DEF" },
    { userId: john.id, type: "withdrawal", amount: "1000.00", currency: "USD", status: "pending", method: "bank_transfer", reference: "TXN003GHI" },
    { userId: sarah.id, type: "deposit", amount: "10000.00", currency: "USD", status: "completed", method: "crypto", reference: "TXN004JKL" },
    { userId: sarah.id, type: "withdrawal", amount: "2000.00", currency: "USD", status: "completed", method: "e_wallet", reference: "TXN005MNO" },
    { userId: ahmed.id, type: "deposit", amount: "25000.00", currency: "USD", status: "completed", method: "bank_transfer", reference: "TXN006PQR" },
    { userId: ahmed.id, type: "deposit", amount: "15000.00", currency: "USD", status: "completed", method: "bank_transfer", reference: "TXN007STU" },
    { userId: ahmed.id, type: "withdrawal", amount: "5000.00", currency: "USD", status: "completed", method: "bank_transfer", reference: "TXN008VWX" },
    { userId: john.id, type: "deposit", amount: "3000.00", currency: "USD", status: "completed", method: "e_wallet", reference: "TXN009YZA" },
    { userId: sarah.id, type: "withdrawal", amount: "500.00", currency: "USD", status: "rejected", method: "crypto", reference: "TXN010BCD" },
  ]);

  // KYC Documents
  await db.insert(kycDocuments).values([
    { userId: john.id, documentType: "passport", fileName: "john_passport.pdf", status: "approved", notes: "Verified successfully" },
    { userId: john.id, documentType: "proof_of_address", fileName: "john_utility_bill.pdf", status: "approved" },
    { userId: sarah.id, documentType: "national_id", fileName: "sarah_national_id.jpg", status: "pending" },
    { userId: sarah.id, documentType: "proof_of_address", fileName: "sarah_bank_statement.pdf", status: "pending" },
    { userId: ahmed.id, documentType: "passport", fileName: "ahmed_passport.pdf", status: "approved" },
    { userId: ahmed.id, documentType: "selfie", fileName: "ahmed_selfie.jpg", status: "approved" },
    { userId: kenji.id, documentType: "drivers_license", fileName: "kenji_license.pdf", status: "rejected", notes: "Document expired" },
  ]);

  // IB Referrals
  await db.insert(ibReferrals).values([
    { ibUserId: ahmed.id, referredUserId: john.id, commission: "450.50", level: 1, status: "active" },
    { ibUserId: ahmed.id, referredUserId: sarah.id, commission: "320.00", level: 1, status: "active" },
    { ibUserId: ahmed.id, referredUserId: kenji.id, commission: "180.00", level: 2, status: "inactive" },
  ]);

  // Support Tickets
  await db.insert(supportTickets).values([
    { userId: john.id, subject: "Withdrawal taking too long", message: "My withdrawal request from 3 days ago is still pending. Please expedite.", priority: "high", status: "open", category: "withdrawal" },
    { userId: sarah.id, subject: "Unable to login to MT5", message: "I am getting an authentication error when trying to login to my MT5 account.", priority: "medium", status: "in_progress", category: "technical" },
    { userId: kenji.id, subject: "KYC document re-submission", message: "I have renewed my driver's license. How can I resubmit for KYC?", priority: "low", status: "closed", category: "kyc" },
    { userId: ahmed.id, subject: "IB commission calculation inquiry", message: "I noticed a discrepancy in my IB commission for last month.", priority: "medium", status: "open", category: "general" },
  ]);

  // Commissions
  await db.insert(commissions).values([
    { userId: ahmed.id, type: "ib_commission", amount: "450.50", source: "John Smith trades", status: "paid" },
    { userId: ahmed.id, type: "ib_commission", amount: "320.00", source: "Sarah Chen trades", status: "paid" },
    { userId: ahmed.id, type: "affiliate", amount: "150.00", source: "New signup bonus", status: "paid" },
    { userId: ahmed.id, type: "referral", amount: "80.00", source: "Kenji Tanaka deposit", status: "pending" },
    { userId: admin.id, type: "ib_commission", amount: "1250.50", source: "Network earnings", status: "paid" },
    { userId: admin.id, type: "affiliate", amount: "550.00", source: "Promotional campaign", status: "paid" },
    { userId: admin.id, type: "referral", amount: "320.75", source: "Investment referrals", status: "paid" },
  ]);

  console.log("Database seeded successfully!");
}
