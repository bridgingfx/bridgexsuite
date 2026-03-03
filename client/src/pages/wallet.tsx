import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  Landmark,
  CreditCard,
  Bitcoin,
  TrendingUp,
  Plus,
  Send,
  Download,
  Gift,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import type { Transaction, TradingAccount } from "@shared/schema";

const depositMethods = [
  { id: "crypto", name: "Crypto (USDT)", icon: Bitcoin, desc: "Instant \u2022 Zero Fees" },
  { id: "credit_card", name: "Credit/Debit Card", icon: CreditCard, desc: "Visa/Mastercard \u2022 Instant" },
  { id: "bank_transfer", name: "Bank Transfer", icon: Landmark, desc: "1-3 Business Days" },
];

const withdrawMethods = [
  { id: "bank_transfer", name: "To Bank Account", icon: Landmark, desc: "Withdraw to local bank" },
  { id: "crypto", name: "To Crypto Wallet", icon: Bitcoin, desc: "Withdraw USDT/BTC" },
];

const demoTransactions = [
  { id: "TXN-1001", type: "deposit", amount: 5000, currency: "USD", status: "completed", date: "2023-10-25", description: "Bank Transfer" },
  { id: "TXN-1002", type: "profit", amount: 125.50, currency: "USD", status: "completed", date: "2023-10-26", description: "Prop Account Payout" },
  { id: "TXN-1003", type: "withdrawal", amount: 1000, currency: "USD", status: "pending", date: "2023-10-27", description: "USDT Withdrawal" },
  { id: "TXN-1004", type: "transfer", amount: 500, currency: "USD", status: "completed", date: "2023-10-28", description: "To MT5 Account 88921" },
];

export default function WalletPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "deposit" | "withdraw" | "transfer">("overview");
  const [depositForm, setDepositForm] = useState({ method: "", amount: "" });
  const [withdrawForm, setWithdrawForm] = useState({ method: "", amount: "", details: "" });
  const [transferForm, setTransferForm] = useState({ fromAccount: "wallet", toAccount: "", amount: "" });

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const depositMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/transactions", {
        type: "deposit",
        amount: depositForm.amount,
        method: depositForm.method,
        currency: "USD",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Deposit request submitted successfully" });
      setDepositForm({ method: "", amount: "" });
      setActiveTab("overview");
    },
    onError: () => {
      toast({ title: "Deposit request failed", variant: "destructive" });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/transactions", {
        type: "withdrawal",
        amount: withdrawForm.amount,
        method: withdrawForm.method,
        currency: "USD",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Withdrawal request submitted successfully" });
      setWithdrawForm({ method: "", amount: "", details: "" });
      setActiveTab("overview");
    },
    onError: () => {
      toast({ title: "Withdrawal request failed", variant: "destructive" });
    },
  });

  const { data: tradingAccounts } = useQuery<TradingAccount[]>({
    queryKey: ["/api/trading-accounts"],
  });

  const transferMutation = useMutation({
    mutationFn: async () => {
      const { fromAccount, toAccount, amount } = transferForm;
      if (fromAccount === "wallet" && toAccount) {
        return apiRequest("POST", `/api/trading-accounts/${toAccount}/deposit`, { amount });
      }
      return apiRequest("POST", "/api/transactions", {
        type: "internal_transfer",
        amount,
        method: "internal_transfer",
        currency: "USD",
        notes: `Internal transfer from ${fromAccount} to ${toAccount}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      toast({ title: "Transfer completed successfully" });
      setTransferForm({ fromAccount: "wallet", toAccount: "", amount: "" });
      setActiveTab("overview");
    },
    onError: (error: any) => {
      toast({ title: error?.message || "Transfer failed", variant: "destructive" });
    },
  });

  const deposits = (transactions || []).filter((t) => t.type === "deposit");
  const withdrawals = (transactions || []).filter((t) => t.type === "withdrawal");
  const totalDeposits = deposits.reduce((sum, d) => sum + Number(d.amount), 0);
  const totalWithdrawals = withdrawals.reduce((sum, w) => sum + Number(w.amount), 0);
  const walletBalance = totalDeposits - totalWithdrawals || 24592.50;

  const activeAccounts = (tradingAccounts || []).filter((a) => a.status === "active");

  const swapAccounts = () => {
    setTransferForm((prev) => ({
      ...prev,
      fromAccount: prev.toAccount || "wallet",
      toAccount: prev.fromAccount,
    }));
  };

  const allTx = transactions && transactions.length > 0 ? transactions : demoTransactions;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-wallet-title">My Wallet</h1>
        <div className="flex gap-2" data-testid="wallet-tabs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "overview" ? "bg-brand-600 text-white" : "bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"}`}
            data-testid="button-tab-overview"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("deposit")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "deposit" ? "bg-brand-600 text-white" : "bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"}`}
            data-testid="button-tab-deposit"
          >
            Deposit
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "withdraw" ? "bg-brand-600 text-white" : "bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"}`}
            data-testid="button-tab-withdraw"
          >
            Withdraw
          </button>
          <button
            onClick={() => setActiveTab("transfer")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "transfer" ? "bg-brand-600 text-white" : "bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"}`}
            data-testid="button-tab-transfer"
          >
            Internal Transfer
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" data-testid="wallet-overview">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 rounded-2xl text-white shadow-lg" data-testid="wallet-hero">
            <p className="text-brand-100 text-sm font-medium mb-1">Total Balance</p>
            <h2 className="text-3xl font-bold mb-4" data-testid="text-total-balance">
              ${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h2>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-500/50">
              <div>
                <p className="text-xs text-brand-200 uppercase">Available</p>
                <p className="font-semibold text-lg" data-testid="text-available-balance">
                  ${(walletBalance * 0.74).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-200 uppercase">Locked</p>
                <p className="font-semibold text-lg" data-testid="text-locked-balance">
                  ${(walletBalance * 0.26).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between" data-testid="card-trading-credits">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Trading Credits</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">$0.00</h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
              <Gift size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between" data-testid="card-ib-commissions">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">IB Commissions</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">$450.25</h3>
              <button
                className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-1"
                data-testid="button-transfer-to-wallet"
              >
                Transfer to Wallet
              </button>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "deposit" && (
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-100 dark:border-gray-800 animate-fade-in space-y-6" data-testid="deposit-form">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ArrowUpRight className="text-green-500" /> Add Funds to Wallet
          </h3>

          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Select Payment Method</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {depositMethods.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setDepositForm({ ...depositForm, method: m.id })}
                  className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center text-center gap-3 transition-all ${
                    depositForm.method === m.id
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500 text-brand-700 dark:text-brand-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  data-testid={`card-deposit-method-${m.id}`}
                >
                  <div className={depositForm.method === m.id ? "text-brand-600" : "text-gray-500"}>
                    <m.icon size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-sm">{m.name}</span>
                    <span className="text-xs text-gray-500 mt-1">{m.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {depositForm.method && (
            <div className="animate-fade-in max-w-md">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={depositForm.amount}
                  onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                  className="w-full pl-8 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none text-lg font-bold"
                  data-testid="input-deposit-amount"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              disabled={!depositForm.method || !depositForm.amount || depositMutation.isPending}
              onClick={() => depositMutation.mutate()}
              className="px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
              data-testid="button-process-deposit"
            >
              <Plus size={18} /> {depositMutation.isPending ? "Processing..." : "Process Deposit"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "withdraw" && (
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-100 dark:border-gray-800 animate-fade-in space-y-6" data-testid="withdraw-form">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ArrowDownRight className="text-red-500" /> Withdraw Funds
          </h3>

          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Select Withdrawal Method</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {withdrawMethods.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setWithdrawForm({ ...withdrawForm, method: m.id })}
                  className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center text-center gap-3 transition-all ${
                    withdrawForm.method === m.id
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500 text-brand-700 dark:text-brand-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  data-testid={`card-withdraw-method-${m.id}`}
                >
                  <div className={withdrawForm.method === m.id ? "text-brand-600" : "text-gray-500"}>
                    <m.icon size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-sm">{m.name}</span>
                    <span className="text-xs text-gray-500 mt-1">{m.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {withdrawForm.method && (
            <div className="animate-fade-in max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount to Withdraw (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                    className="w-full pl-8 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none text-lg font-bold"
                    data-testid="input-withdraw-amount"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {withdrawForm.method === "crypto" ? "Wallet Address (TRC20)" : "Account Number / IBAN"}
                </label>
                <input
                  type="text"
                  placeholder={withdrawForm.method === "crypto" ? "Enter wallet address" : "Enter account details"}
                  value={withdrawForm.details}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, details: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  data-testid="input-withdraw-details"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              disabled={!withdrawForm.method || !withdrawForm.amount || !withdrawForm.details || withdrawMutation.isPending}
              onClick={() => withdrawMutation.mutate()}
              className="px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
              data-testid="button-submit-withdrawal"
            >
              <Send size={18} /> {withdrawMutation.isPending ? "Processing..." : "Submit Request"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "transfer" && (
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-100 dark:border-gray-800 animate-fade-in space-y-6" data-testid="transfer-form">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ArrowLeftRight className="text-blue-500" /> Internal Transfer
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Transfer funds between your wallet and trading accounts instantly with zero fees.
          </p>

          <div className="max-w-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
              <select
                value={transferForm.fromAccount}
                onChange={(e) => setTransferForm({ ...transferForm, fromAccount: e.target.value, toAccount: "" })}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                data-testid="select-transfer-from"
              >
                <option value="wallet">Main Wallet (${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })})</option>
                {activeAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountNumber} - {acc.platform} {acc.type.toUpperCase()} (${Number(acc.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <button
                onClick={swapAccounts}
                className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-brand-600 hover:border-brand-500 transition-all"
                data-testid="button-swap-accounts"
              >
                <RefreshCw size={20} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
              <select
                value={transferForm.toAccount}
                onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                data-testid="select-transfer-to"
              >
                <option value="">Select destination account</option>
                {transferForm.fromAccount !== "wallet" && (
                  <option value="wallet">Main Wallet (${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })})</option>
                )}
                {activeAccounts
                  .filter((acc) => acc.id !== transferForm.fromAccount)
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountNumber} - {acc.platform} {acc.type.toUpperCase()} (${Number(acc.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                  className="w-full pl-8 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none text-lg font-bold"
                  data-testid="input-transfer-amount"
                />
              </div>
            </div>

            {transferForm.fromAccount && transferForm.toAccount && transferForm.amount && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 animate-fade-in" data-testid="transfer-summary">
                <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2">Transfer Summary</h4>
                <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <p>From: <span className="font-medium">{transferForm.fromAccount === "wallet" ? "Main Wallet" : activeAccounts.find(a => a.id === transferForm.fromAccount)?.accountNumber || transferForm.fromAccount}</span></p>
                  <p>To: <span className="font-medium">{transferForm.toAccount === "wallet" ? "Main Wallet" : activeAccounts.find(a => a.id === transferForm.toAccount)?.accountNumber || transferForm.toAccount}</span></p>
                  <p>Amount: <span className="font-bold">${Number(transferForm.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></p>
                  <p className="text-xs mt-2">Fee: <span className="text-green-600 dark:text-green-400 font-medium">$0.00 (Free)</span></p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              disabled={!transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount || transferMutation.isPending}
              onClick={() => transferMutation.mutate()}
              className="px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
              data-testid="button-execute-transfer"
            >
              <ArrowLeftRight size={18} /> {transferMutation.isPending ? "Processing..." : "Execute Transfer"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden" data-testid="transaction-history">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 dark:text-white">Transaction History</h3>
          <button className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1" data-testid="button-export">
            <Download size={16} /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" data-testid="table-transactions">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
              ) : (allTx as any[]).map((tx: any, i: number) => (
                <tr key={tx.id || i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors" data-testid={`row-transaction-${i}`}>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {tx.reference || tx.id}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      tx.type === "deposit" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                      tx.type === "withdrawal" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {tx.description || tx.method?.replace(/_/g, " ") || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : tx.date || "N/A"}
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold ${
                    tx.type === "withdrawal" ? "text-red-500" : "text-green-500"
                  }`}>
                    {tx.type === "withdrawal" ? "-" : "+"}${Math.abs(Number(tx.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      tx.status === "completed" || tx.status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                      tx.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
