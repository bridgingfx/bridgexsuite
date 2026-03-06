import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  ChevronLeft,
  ChevronRight,
  Users,
  MessageSquare,
  Eye,
  XCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Transaction, TradingAccount } from "@shared/schema";

const savedCryptoWallets = [
  { id: 1, asset: "BTC", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", network: "Bitcoin", status: "Active" as const },
  { id: 3, asset: "USDT", address: "TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9", network: "Tron (TRC-20)", status: "Active" as const },
  { id: 4, asset: "ETH", address: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12", network: "Ethereum (ERC-20)", status: "Active" as const },
];

const depositMethods = [
  { id: "crypto", name: "Crypto (USDT)", icon: Bitcoin, desc: "Instant \u2022 Zero Fees" },
  { id: "credit_card", name: "Credit/Debit Card", icon: CreditCard, desc: "Visa/Mastercard \u2022 Instant" },
  { id: "bank_transfer", name: "Bank Transfer", icon: Landmark, desc: "1-3 Business Days" },
];

const withdrawMethods = [
  { id: "bank_transfer", name: "To Bank Account", icon: Landmark, desc: "Withdraw to local bank" },
  { id: "crypto", name: "To Crypto Wallet", icon: Bitcoin, desc: "Withdraw USDT/BTC" },
  { id: "wallet_transfer", name: "Wallet to Wallet", icon: Users, desc: "Transfer to another client" },
];

const demoTransactions = [
  { id: "TXN-1001", type: "deposit", amount: 5000, currency: "USD", status: "completed", date: "2023-10-25", description: "Bank Transfer" },
  { id: "TXN-1002", type: "profit", amount: 125.50, currency: "USD", status: "completed", date: "2023-10-26", description: "Prop Account Payout" },
  { id: "TXN-1003", type: "withdrawal", amount: 1000, currency: "USD", status: "pending", date: "2023-10-27", description: "USDT Withdrawal" },
  { id: "TXN-1004", type: "transfer", amount: 500, currency: "USD", status: "completed", date: "2023-10-28", description: "To MT5 Account 88921" },
];

type EarningType = "ib_commissions" | "affiliate_earning" | "referral_commission" | "rewards_earning";

const earningsData: { key: EarningType; label: string; amount: number; icon: typeof TrendingUp; iconBg: string }[] = [
  { key: "ib_commissions", label: "Total IB Commissions", amount: 450.25, icon: TrendingUp, iconBg: "bg-green-50 dark:bg-green-900/20 text-green-600" },
  { key: "affiliate_earning", label: "Total Affiliate Earning", amount: 320.00, icon: Users, iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600" },
  { key: "referral_commission", label: "Total Referral Commission", amount: 185.50, icon: Gift, iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600" },
  { key: "rewards_earning", label: "Total Rewards Earning", amount: 95.75, icon: RefreshCw, iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600" },
];

export default function WalletPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "deposit" | "withdraw" | "transfer">("overview");
  const [depositForm, setDepositForm] = useState({ method: "", amount: "" });
  const [withdrawForm, setWithdrawForm] = useState({ method: "", amount: "", details: "", message: "" });
  const [transferForm, setTransferForm] = useState({ fromAccount: "wallet", toAccount: "", amount: "" });
  const [transferEarning, setTransferEarning] = useState<EarningType | null>(null);
  const [transferAmount, setTransferAmount] = useState("");

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
      if (withdrawForm.method === "wallet_transfer") {
        return apiRequest("POST", "/api/wallet-transfer", {
          recipientEmail: withdrawForm.details,
          amount: withdrawForm.amount,
          message: withdrawForm.message || undefined,
        });
      }
      return apiRequest("POST", "/api/transactions", {
        type: "withdrawal",
        amount: withdrawForm.amount,
        method: withdrawForm.method,
        currency: "USD",
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      if (withdrawForm.method === "wallet_transfer") {
        toast({ title: `Transfer successful! Funds sent to ${withdrawForm.details}` });
      } else {
        toast({ title: "Withdrawal request submitted successfully" });
      }
      setWithdrawForm({ method: "", amount: "", details: "", message: "" });
      setActiveTab("overview");
    },
    onError: (error: any) => {
      toast({ title: error?.message || "Request failed", variant: "destructive" });
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

  const [txPage, setTxPage] = useState(1);
  const [viewTx, setViewTx] = useState<Transaction | null>(null);
  const txPerPage = 10;

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PATCH", `/api/transactions/${id}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Transaction cancelled", description: "Your withdrawal request has been cancelled." });
    },
    onError: () => {
      toast({ title: "Cancel failed", variant: "destructive" });
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
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="animate-fade-in" data-testid="wallet-overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between" data-testid="wallet-hero">
              <div>
                <p className="text-brand-100 text-sm font-medium mb-1">Total Balance</p>
                <h2 className="text-3xl font-bold mb-4" data-testid="text-total-balance">
                  ${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h2>
              </div>
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

            <div className="grid grid-cols-2 gap-4">
              {earningsData.map((earning) => (
                <div
                  key={earning.key}
                  className="bg-white dark:bg-dark-card p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between"
                  data-testid={`card-${earning.key}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-gray-500 dark:text-gray-400 text-[11px] font-medium leading-tight">{earning.label}</p>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                        ${earning.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className={`p-2 rounded-lg shrink-0 ${earning.iconBg}`}>
                      <earning.icon size={16} />
                    </div>
                  </div>
                  <button
                    onClick={() => { setTransferEarning(earning.key); setTransferAmount(""); }}
                    className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-2 text-left hover:underline flex items-center gap-1"
                    data-testid={`button-transfer-${earning.key}`}
                  >
                    <ArrowLeftRight size={12} />
                    Transfer to Wallet
                  </button>
                </div>
              ))}
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {withdrawForm.method === "wallet_transfer" ? "Amount to Transfer (USD)" : "Amount to Withdraw (USD)"}
                </label>
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
              {withdrawForm.method === "crypto" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Saved Wallet
                  </label>
                  <Select value={withdrawForm.details} onValueChange={(val) => setWithdrawForm({ ...withdrawForm, details: val })}>
                    <SelectTrigger className="w-full p-3 h-auto border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" data-testid="select-withdraw-wallet">
                      <SelectValue placeholder="Choose a saved crypto wallet" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#0f172a] border-gray-200 dark:border-gray-700">
                      {savedCryptoWallets.map((w) => (
                        <SelectItem key={w.id} value={w.address} className="text-gray-900 dark:text-white" data-testid={`option-wallet-${w.id}`}>
                          <div className="flex flex-col">
                            <span className="font-medium">{w.asset} - {w.network}</span>
                            <span className="text-xs text-gray-500">{w.address.slice(0, 12)}...{w.address.slice(-8)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {withdrawForm.details && (
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg" data-testid="selected-wallet-info">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Withdraw to:</p>
                      <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{withdrawForm.details}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {withdrawForm.method === "wallet_transfer" ? "Recipient Email Address" : "Account Number / IBAN"}
                  </label>
                  <input
                    type={withdrawForm.method === "wallet_transfer" ? "email" : "text"}
                    placeholder={withdrawForm.method === "wallet_transfer" ? "Enter recipient's email address" : "Enter account details"}
                    value={withdrawForm.details}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, details: e.target.value })}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    data-testid="input-withdraw-details"
                  />
                </div>
              )}
              {withdrawForm.method === "wallet_transfer" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <span className="flex items-center gap-1"><MessageSquare size={14} /> Message (Optional)</span>
                  </label>
                  <textarea
                    placeholder="Add a note for the recipient..."
                    value={withdrawForm.message}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, message: e.target.value })}
                    rows={3}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                    data-testid="input-withdraw-message"
                  />
                </div>
              )}
              {withdrawForm.method === "wallet_transfer" && withdrawForm.details && withdrawForm.amount && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 animate-fade-in" data-testid="wallet-transfer-summary">
                  <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-1">
                    <Users size={14} /> Transfer Summary
                  </h4>
                  <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <p>Recipient: <span className="font-medium">{withdrawForm.details}</span></p>
                    <p>Amount: <span className="font-bold">${Number(withdrawForm.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></p>
                    {withdrawForm.message && <p>Message: <span className="italic">"{withdrawForm.message}"</span></p>}
                    <p className="text-xs mt-2">Fee: <span className="text-green-600 dark:text-green-400 font-medium">$0.00 (Free)</span></p>
                  </div>
                </div>
              )}
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


      {(() => {
        const txList = transactions && transactions.length > 0 ? transactions : demoTransactions;
        const totalPages = Math.ceil(txList.length / txPerPage);
        const paginatedTx = txList.slice((txPage - 1) * txPerPage, txPage * txPerPage);

        return (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden" data-testid="wallet-transaction-history">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">Transaction History</h3>
              <button className="flex items-center gap-1.5 text-sm text-primary font-medium" data-testid="button-export">
                <Download size={14} /> Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left" data-testid="table-wallet-transactions">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {isLoading ? (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
                  ) : (paginatedTx as any[]).map((tx: any, i: number) => {
                    const globalIdx = (txPage - 1) * txPerPage + i;
                    return (
                      <tr key={tx.id || i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors" data-testid={`row-wallet-tx-${globalIdx}`}>
                        <td className="px-6 py-4 text-sm font-mono text-gray-700 dark:text-gray-300" data-testid={`text-wallet-tx-ref-${globalIdx}`}>
                          {tx.reference || tx.id?.slice(0, 12) || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            tx.type === "deposit" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            tx.type === "withdrawal" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                            tx.type === "profit" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`} data-testid={`badge-wallet-tx-type-${globalIdx}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300" data-testid={`text-wallet-tx-desc-${globalIdx}`}>
                          {tx.method ? tx.method.replace(/_/g, " ") : tx.description || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400" data-testid={`text-wallet-tx-date-${globalIdx}`}>
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : tx.date || "N/A"}
                        </td>
                        <td className={`px-6 py-4 text-sm font-bold ${
                          tx.type === "withdrawal" ? "text-red-500" : "text-green-500"
                        }`} data-testid={`text-wallet-tx-amount-${globalIdx}`}>
                          {tx.type === "withdrawal" ? "-" : "+"}${Math.abs(Number(tx.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm" data-testid={`badge-wallet-tx-status-${globalIdx}`}>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            tx.status === "completed" || tx.status === "approved" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            tx.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                            tx.status === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                            tx.status === "cancelled" ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}>
                            {tx.status === "approved" ? "Approved" : tx.status === "pending" ? "Pending" : tx.status === "rejected" ? "Rejected" : tx.status === "cancelled" ? "Cancelled" : tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewTx(tx)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              title="View details"
                              data-testid={`button-wallet-view-tx-${globalIdx}`}
                            >
                              <Eye size={16} />
                            </button>
                            {tx.status === "pending" && tx.type === "withdrawal" && (
                              <button
                                onClick={() => cancelMutation.mutate(tx.id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Cancel withdrawal"
                                disabled={cancelMutation.isPending}
                                data-testid={`button-wallet-cancel-tx-${globalIdx}`}
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400" data-testid="text-wallet-tx-pagination-info">
                  Showing {(txPage - 1) * txPerPage + 1}–{Math.min(txPage * txPerPage, txList.length)} of {txList.length} transactions
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                    disabled={txPage === 1}
                    data-testid="button-wallet-tx-prev"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  {Array.from({ length: totalPages }, (_, idx) => (
                    <Button
                      key={idx + 1}
                      variant={txPage === idx + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTxPage(idx + 1)}
                      data-testid={`button-wallet-tx-page-${idx + 1}`}
                    >
                      {idx + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTxPage((p) => Math.min(totalPages, p + 1))}
                    disabled={txPage === totalPages}
                    data-testid="button-wallet-tx-next"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      <Dialog open={!!viewTx} onOpenChange={(open) => !open && setViewTx(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Full details for transaction {viewTx?.reference || viewTx?.id?.slice(0, 12)}</DialogDescription>
          </DialogHeader>
          {viewTx && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Reference</p>
                  <p className="font-mono text-sm font-medium text-gray-900 dark:text-white" data-testid="text-wallet-detail-ref">{viewTx.reference || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Type</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-1 ${
                    viewTx.type === "deposit" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    viewTx.type === "withdrawal" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`} data-testid="text-wallet-detail-type">{viewTx.type}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Amount</p>
                  <p className={`text-lg font-bold ${viewTx.type === "withdrawal" ? "text-red-500" : "text-green-500"}`} data-testid="text-wallet-detail-amount">
                    {viewTx.type === "withdrawal" ? "-" : "+"}${Math.abs(Number(viewTx.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Currency</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white" data-testid="text-wallet-detail-currency">{viewTx.currency}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Method</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white capitalize" data-testid="text-wallet-detail-method">{viewTx.method?.replace(/_/g, " ") || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-1 ${
                    viewTx.status === "approved" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                    viewTx.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                    viewTx.status === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                    viewTx.status === "cancelled" ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" :
                    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`} data-testid="text-wallet-detail-status">{viewTx.status}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Created Date & Time</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white" data-testid="text-wallet-detail-created">
                    {viewTx.createdAt ? new Date(viewTx.createdAt).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Approved Date & Time</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white" data-testid="text-wallet-detail-processed">
                    {viewTx.processedAt ? new Date(viewTx.processedAt).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—"}
                  </p>
                </div>
                {viewTx.approvedBy && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Approved By</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white" data-testid="text-wallet-detail-approved-by">{viewTx.approvedBy}</p>
                  </div>
                )}
              </div>
              {viewTx.notes && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Notes / Comment</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300" data-testid="text-wallet-detail-notes">{viewTx.notes}</p>
                </div>
              )}
              {viewTx.rejectionReason && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-500 uppercase mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-700 dark:text-red-400" data-testid="text-wallet-detail-rejection">{viewTx.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!transferEarning} onOpenChange={(open) => !open && setTransferEarning(null)}>
        <DialogContent className="max-w-md" data-testid="dialog-transfer-earning">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-brand-600" />
              Transfer to Wallet
            </DialogTitle>
            <DialogDescription>Transfer your earnings to your main wallet balance.</DialogDescription>
          </DialogHeader>
          {transferEarning && (() => {
            const earning = earningsData.find((e) => e.key === transferEarning);
            if (!earning) return null;
            const parsedAmount = Number(transferAmount) || 0;
            const isValidAmount = parsedAmount > 0 && parsedAmount <= earning.amount;
            return (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{earning.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-earning-amount">
                        ${earning.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Available to transfer</p>
                    </div>
                    <div className={`p-3 rounded-lg ${earning.iconBg}`}>
                      <earning.icon size={24} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-1 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{earning.label.replace("Total ", "")}</p>
                  </div>
                  <ArrowLeftRight className="w-5 h-5 text-gray-400 shrink-0" />
                  <div className="flex-1 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Main Wallet</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      max={earning.amount}
                      min={0}
                      step="0.01"
                      className="w-full pl-7 p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none text-lg font-bold"
                      data-testid="input-transfer-earning-amount"
                    />
                  </div>
                  {transferAmount && parsedAmount > earning.amount && (
                    <p className="text-xs text-red-500">Amount exceeds available balance</p>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "25%", pct: 0.25 },
                    { label: "50%", pct: 0.50 },
                    { label: "75%", pct: 0.75 },
                    { label: "100%", pct: 1.0 },
                  ].map((opt) => (
                    <Button
                      key={opt.label}
                      variant="outline"
                      size="sm"
                      onClick={() => setTransferAmount((earning.amount * opt.pct).toFixed(2))}
                      className={transferAmount === (earning.amount * opt.pct).toFixed(2) ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300" : ""}
                      data-testid={`button-transfer-pct-${opt.label.replace("%", "")}`}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>

                {isValidAmount && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800/30">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <span className="font-bold">${parsedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span> will be transferred from {earning.label.replace("Total ", "")} to your main wallet balance instantly.
                    </p>
                  </div>
                )}

                <Button
                  className="w-full"
                  disabled={!isValidAmount}
                  onClick={() => {
                    toast({
                      title: "Transfer Successful",
                      description: `$${parsedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} from ${earning.label.replace("Total ", "")} has been transferred to your wallet.`,
                    });
                    setTransferEarning(null);
                    setTransferAmount("");
                  }}
                  data-testid="button-confirm-transfer-earning"
                >
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                  Transfer {isValidAmount ? `$${parsedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "to Wallet"}
                </Button>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
