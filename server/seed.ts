import { db } from "./db";
import { users, tradingAccounts, transactions, kycDocuments, ibReferrals, supportTickets, commissions, brokers, subscriptionPlans, brokerSubscriptions, brokerAdmins, brokerBranding, platformSettings } from "@shared/schema";
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

  // ==================== SUPER ADMIN SEED DATA ====================

  const existingBrokers = await db.select().from(brokers);
  if (existingBrokers.length === 0) {
    const [broker1] = await db.insert(brokers).values({
      name: "Alpha Trading Ltd",
      slug: "alpha-trading",
      email: "admin@alphatrading.com",
      phone: "+1 555 100 2000",
      companyName: "Alpha Trading Limited",
      country: "United Kingdom",
      status: "active",
      maxClients: 500,
      maxAccounts: 2000,
    }).returning();

    const [broker2] = await db.insert(brokers).values({
      name: "Pacific Forex Group",
      slug: "pacific-forex",
      email: "info@pacificforex.com",
      phone: "+61 2 8888 9999",
      companyName: "Pacific Forex Group Pty Ltd",
      country: "Australia",
      status: "active",
      maxClients: 200,
      maxAccounts: 1000,
    }).returning();

    const [broker3] = await db.insert(brokers).values({
      name: "Euro Markets AG",
      slug: "euro-markets",
      email: "contact@euromarkets.de",
      phone: "+49 30 1234 5678",
      companyName: "Euro Markets AG",
      country: "Germany",
      status: "suspended",
      maxClients: 100,
      maxAccounts: 500,
    }).returning();

    const [broker4] = await db.insert(brokers).values({
      name: "Gulf Capital FX",
      slug: "gulf-capital",
      email: "support@gulfcapitalfx.ae",
      phone: "+971 4 555 6789",
      companyName: "Gulf Capital FX LLC",
      country: "UAE",
      status: "active",
      maxClients: 300,
      maxAccounts: 1500,
    }).returning();

    const [starter] = await db.insert(subscriptionPlans).values({
      name: "Starter",
      price: "99.00",
      billingCycle: "monthly",
      maxClients: 50,
      maxAccounts: 200,
      maxIBs: 10,
      features: "Basic CRM, Email Support, 1 Admin User",
      status: "active",
    }).returning();

    const [professional] = await db.insert(subscriptionPlans).values({
      name: "Professional",
      price: "299.00",
      billingCycle: "monthly",
      maxClients: 500,
      maxAccounts: 2000,
      maxIBs: 100,
      features: "Full CRM, Priority Support, 5 Admin Users, White-label Branding, API Access",
      status: "active",
    }).returning();

    const [enterprise] = await db.insert(subscriptionPlans).values({
      name: "Enterprise",
      price: "799.00",
      billingCycle: "monthly",
      maxClients: 5000,
      maxAccounts: 20000,
      maxIBs: 1000,
      features: "Full CRM, 24/7 Support, Unlimited Admin Users, White-label, Custom Domain, Dedicated Server, API Access",
      status: "active",
    }).returning();

    await db.insert(brokerSubscriptions).values([
      { brokerId: broker1.id, planId: enterprise.id, status: "active" },
      { brokerId: broker2.id, planId: professional.id, status: "active" },
      { brokerId: broker3.id, planId: starter.id, status: "cancelled" },
      { brokerId: broker4.id, planId: professional.id, status: "active" },
    ]);

    await db.insert(brokerAdmins).values([
      { brokerId: broker1.id, fullName: "James Wilson", email: "james@alphatrading.com", role: "super_admin", status: "active" },
      { brokerId: broker1.id, fullName: "Emily Parker", email: "emily@alphatrading.com", role: "admin", status: "active" },
      { brokerId: broker1.id, fullName: "David Brown", email: "david@alphatrading.com", role: "manager", status: "active" },
      { brokerId: broker2.id, fullName: "Michael Lee", email: "michael@pacificforex.com", role: "super_admin", status: "active" },
      { brokerId: broker2.id, fullName: "Sophie Nguyen", email: "sophie@pacificforex.com", role: "admin", status: "active" },
      { brokerId: broker3.id, fullName: "Hans Mueller", email: "hans@euromarkets.de", role: "super_admin", status: "inactive" },
      { brokerId: broker4.id, fullName: "Rashid Al-Maktoum", email: "rashid@gulfcapitalfx.ae", role: "super_admin", status: "active" },
      { brokerId: broker4.id, fullName: "Fatima Hassan", email: "fatima@gulfcapitalfx.ae", role: "admin", status: "active" },
    ]);

    await db.insert(brokerBranding).values([
      { brokerId: broker1.id, primaryColor: "#1e40af", secondaryColor: "#059669", accentColor: "#d97706", companyTagline: "Trade with confidence", customDomain: "crm.alphatrading.com" },
      { brokerId: broker2.id, primaryColor: "#7c3aed", secondaryColor: "#0891b2", accentColor: "#ea580c", companyTagline: "Your gateway to global markets" },
      { brokerId: broker4.id, primaryColor: "#b91c1c", secondaryColor: "#0f766e", accentColor: "#ca8a04", companyTagline: "Premium trading solutions", customDomain: "portal.gulfcapitalfx.ae" },
    ]);

    await db.insert(platformSettings).values([
      { settingKey: "platform_name", settingValue: "ForexCRM SaaS", category: "general", description: "Platform display name" },
      { settingKey: "support_email", settingValue: "support@forexcrm.com", category: "general", description: "Platform support email" },
      { settingKey: "max_brokers", settingValue: "100", category: "limits", description: "Maximum number of brokers" },
      { settingKey: "trial_days", settingValue: "14", category: "billing", description: "Free trial duration in days" },
      { settingKey: "default_currency", settingValue: "USD", category: "financial", description: "Default platform currency" },
      { settingKey: "maintenance_mode", settingValue: "false", category: "system", description: "Enable maintenance mode" },
    ]);
  }

  console.log("Database seeded successfully!");
}
