import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { TradingAccount, Transaction } from "@shared/schema";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Gift,
  TrendingUp,
  TrendingDown,
  Download,
  Send,
  AlertTriangle,
  ArrowLeftRight,
  FileText,
} from "lucide-react";

type FinanceTab = "overview" | "deposit" | "withdraw" | "internal_transfer";

const currencyRates: Record<string, Record<string, number>> = {
  USD: { EUR: 0.92, GBP: 0.79, JPY: 149.5, USD: 1 },
  EUR: { USD: 1.09, GBP: 0.86, JPY: 162.5, EUR: 1 },
  GBP: { USD: 1.27, EUR: 1.16, JPY: 189.0, GBP: 1 },
  JPY: { USD: 0.0067, EUR: 0.0062, GBP: 0.0053, JPY: 1 },
};

function getConversionRate(from: string, to: string): number {
  if (from === to) return 1;
  return currencyRates[from]?.[to] || 1.1;
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<FinanceTab>("overview");
  const [depositForm, setDepositForm] = useState({ accountId: "", amount: "" });
  const [withdrawForm, setWithdrawForm] = useState({ accountId: "", amount: "" });
  const [transferForm, setTransferForm] = useState({ fromId: "", toId: "", amount: "", error: "" });
  const [commissionDialog, setCommissionDialog] = useState(false);
  const [commissionAmount, setCommissionAmount] = useState("");
  const { toast } = useToast();

  const { data: tradingAccounts, isLoading: loadingAccounts } = useQuery<TradingAccount[]>({
    queryKey: ["/api/trading-accounts"],
  });

  const { data: transactions, isLoading: loadingTxns } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: commissions } = useQuery<any[]>({
    queryKey: ["/api/commissions"],
  });

  const paidCommissions = commissions?.filter((c: any) => c.status === "paid") || [];
  const totalCommissions = paidCommissions.reduce((s: number, c: any) => s + Number(c.amount), 0) || 450.25;

  const tradingTxns = (transactions || []).filter(
    (t) => t.method === "wallet_transfer" || t.method === "commission_transfer" || t.method === "internal_transfer" || t.notes?.includes("trading") || t.notes?.includes("MT5") || t.notes?.includes("Trading")
  );

  const allTxns = transactions || [];
  const totalDeposited = allTxns.filter(t => t.type === "deposit" && (t.status === "approved" || t.status === "completed")).reduce((s, t) => s + Number(t.amount), 0);
  const totalWithdrawn = allTxns.filter(t => t.type === "withdrawal" && (t.status === "approved" || t.status === "completed")).reduce((s, t) => s + Number(t.amount), 0);
  const walletBalance = totalDeposited - totalWithdrawn;

  const accounts = tradingAccounts || [];

  const depositMutation = useMutation({
    mutationFn: async () => {
      const account = accounts.find(a => a.id === depositForm.accountId);
      if (!account) throw new Error("Select a trading account");
      return apiRequest("POST", `/api/trading-accounts/${depositForm.accountId}/deposit`, {
        amount: depositForm.amount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Deposit to trading account successful" });
      setDepositForm({ accountId: "", amount: "" });
      setActiveTab("overview");
    },
    onError: (error: any) => {
      toast({ title: error?.message || "Deposit failed", variant: "destructive" });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      const account = accounts.find(a => a.id === withdrawForm.accountId);
      if (!account) throw new Error("Select a trading account");
      return apiRequest("POST", `/api/trading-accounts/${withdrawForm.accountId}/withdraw`, {
        amount: withdrawForm.amount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Withdrawal from trading account successful" });
      setWithdrawForm({ accountId: "", amount: "" });
      setActiveTab("overview");
    },
    onError: (error: any) => {
      toast({ title: error?.message || "Withdrawal failed", variant: "destructive" });
    },
  });

  const transferMutation = useMutation({
    mutationFn: async () => {
      const fromAcc = accounts.find(a => a.id === transferForm.fromId);
      const toAcc = accounts.find(a => a.id === transferForm.toId);
      if (!fromAcc || !toAcc) throw new Error("Select both accounts");
      const amount = parseFloat(transferForm.amount);
      if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");
      if (amount > Number(fromAcc.balance)) throw new Error("Insufficient balance in source account");
      return apiRequest("POST", "/api/trading-accounts/internal-transfer", {
        fromAccountId: transferForm.fromId,
        toAccountId: transferForm.toId,
        amount: transferForm.amount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({ title: "Internal transfer completed successfully" });
      setTransferForm({ fromId: "", toId: "", amount: "", error: "" });
      setActiveTab("overview");
    },
    onError: (error: any) => {
      toast({ title: error?.message || "Transfer failed", variant: "destructive" });
    },
  });

  const commissionTransferMutation = useMutation({
    mutationFn: async (amount: string) => {
      return apiRequest("POST", "/api/commission-transfer", { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/commissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: `$${commissionAmount || totalCommissions.toFixed(2)} commission transferred to wallet` });
      setCommissionDialog(false);
      setCommissionAmount("");
    },
    onError: (error: any) => {
      toast({ title: error?.message || "Commission transfer failed", variant: "destructive" });
    },
  });

  const handleDownloadPDF = () => {
    const displayTxns = tradingTxns.length > 0 ? tradingTxns : allTxns;
    let csv = "ID,Type,Description,Date,Amount,Status\n";
    displayTxns.forEach((t, i) => {
      const ref = `TXN-${String(t.id).padStart(4, "0")}`;
      const desc = t.notes || t.method || "N/A";
      const date = new Date(t.createdAt!).toLocaleDateString("en-US");
      const prefix = t.type === "withdrawal" ? "-" : "+";
      csv += `${ref},${t.type},"${desc}",${date},${prefix}$${Number(t.amount).toFixed(2)},${t.status}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trading-finance-transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Transaction history exported" });
  };

  const fromAccount = accounts.find(a => a.id === transferForm.fromId);
  const toAccount = accounts.find(a => a.id === transferForm.toId);
  const conversionRate = fromAccount && toAccount ? getConversionRate(fromAccount.currency || "USD", toAccount.currency || "USD") : 1;
  const convertedAmount = transferForm.amount ? (parseFloat(transferForm.amount) * conversionRate).toFixed(2) : "0.00";

  if (loadingAccounts || loadingTxns) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const displayTxns = tradingTxns.length > 0 ? tradingTxns : allTxns.slice(0, 10);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">Finance</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your trading account finances</p>
        </div>
        <div className="flex gap-2">
          {(["overview", "deposit", "withdraw", "internal_transfer"] as FinanceTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                activeTab === tab
                  ? "bg-brand-600 text-white"
                  : "bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              }`}
              data-testid={`button-tab-${tab}`}
            >
              {tab === "overview" ? "Overview" : tab === "deposit" ? "Deposit" : tab === "withdraw" ? "Withdraw" : "Internal Transfer"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 rounded-2xl text-white shadow-lg" data-testid="card-total-balance">
            <p className="text-brand-100 text-sm font-medium mb-1">Total Balance</p>
            <h2 className="text-3xl font-bold mb-4">${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h2>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-500/50">
              <div>
                <p className="text-xs text-brand-200 uppercase">Available</p>
                <p className="font-semibold text-lg">${Math.max(0, walletBalance - accounts.reduce((s, a) => s + Number(a.margin || 0), 0)).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-xs text-brand-200 uppercase">In Trading</p>
                <p className="font-semibold text-lg">${accounts.reduce((s, a) => s + Number(a.balance || 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${totalCommissions.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h3>
              <button
                onClick={() => {
                  setCommissionAmount("");
                  setCommissionDialog(true);
                }}
                disabled={totalCommissions <= 0}
                className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-1 disabled:opacity-50"
                data-testid="button-transfer-commission"
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
            <ArrowUpRight className="text-green-500" /> Deposit to Trading Account
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Transfer funds from your main wallet to a trading account.</p>

          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Select Trading Account</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {accounts.filter(a => a.type !== "demo").map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => setDepositForm({ ...depositForm, accountId: acc.id })}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    depositForm.accountId === acc.id
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  data-testid={`card-deposit-account-${acc.id}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{acc.platform} #{acc.login}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">{acc.accountTier}</span>
                  </div>
                  <p className="text-xs text-gray-500">Balance: <span className="font-semibold">${Number(acc.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></p>
                  <p className="text-xs text-gray-400">{acc.currency} • {acc.leverage}</p>
                </div>
              ))}
              {accounts.filter(a => a.type !== "demo").length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full">No live trading accounts found. Create one first.</p>
              )}
            </div>
          </div>

          {depositForm.accountId && (
            <div className="animate-fade-in max-w-md space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm text-gray-500">Source</span>
                <span className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1">
                  <Wallet size={14} /> Main Wallet (${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })})
                </span>
              </div>
              <div>
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
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              disabled={!depositForm.accountId || !depositForm.amount || depositMutation.isPending}
              onClick={() => depositMutation.mutate()}
              className="px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
              data-testid="button-submit-deposit"
            >
              <Send size={18} /> {depositMutation.isPending ? "Processing..." : "Submit Deposit"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "withdraw" && (
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-100 dark:border-gray-800 animate-fade-in space-y-6" data-testid="withdraw-form">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ArrowDownRight className="text-red-500" /> Withdraw from Trading Account
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Transfer funds from a trading account back to your main wallet.</p>

          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Select Trading Account</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {accounts.filter(a => a.type !== "demo").map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => setWithdrawForm({ ...withdrawForm, accountId: acc.id })}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    withdrawForm.accountId === acc.id
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  data-testid={`card-withdraw-account-${acc.id}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{acc.platform} #{acc.login}</span>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">${Number(acc.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <p className="text-xs text-gray-400">{acc.currency} • {acc.leverage} • {acc.accountTier}</p>
                </div>
              ))}
            </div>
          </div>

          {withdrawForm.accountId && (
            <div className="animate-fade-in max-w-md space-y-4">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-sm rounded-lg border border-yellow-100 dark:border-yellow-900/50">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <p>Please ensure you have sufficient free margin before withdrawing to avoid margin calls on open positions.</p>
              </div>
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
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              disabled={!withdrawForm.accountId || !withdrawForm.amount || withdrawMutation.isPending}
              onClick={() => withdrawMutation.mutate()}
              className="px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
              data-testid="button-submit-withdraw"
            >
              <Send size={18} /> {withdrawMutation.isPending ? "Processing..." : "Submit Request"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "internal_transfer" && (
        <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-100 dark:border-gray-800 animate-fade-in space-y-6" data-testid="internal-transfer-form">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ArrowLeftRight className="text-blue-500" /> Internal Transfer
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Transfer funds between your trading accounts. Currency conversion applies for different currency accounts.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">From Account</h4>
              <div className="space-y-2">
                {accounts.filter(a => a.type !== "demo").map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => setTransferForm({ ...transferForm, fromId: acc.id, error: "" })}
                    className={`p-3 border rounded-xl cursor-pointer transition-all ${
                      transferForm.fromId === acc.id
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                    data-testid={`card-transfer-from-${acc.id}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{acc.platform} #{acc.login}</span>
                      <span className="font-bold text-gray-900 dark:text-white">${Number(acc.balance).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-400">{acc.currency} • {acc.accountTier}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">To Account</h4>
              <div className="space-y-2">
                {accounts.filter(a => a.type !== "demo" && a.id !== transferForm.fromId).map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => setTransferForm({ ...transferForm, toId: acc.id, error: "" })}
                    className={`p-3 border rounded-xl cursor-pointer transition-all ${
                      transferForm.toId === acc.id
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                    data-testid={`card-transfer-to-${acc.id}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{acc.platform} #{acc.login}</span>
                      <span className="font-bold text-gray-900 dark:text-white">${Number(acc.balance).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-400">{acc.currency} • {acc.accountTier}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {transferForm.fromId && transferForm.toId && (
            <div className="animate-fade-in max-w-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transfer Amount ({fromAccount?.currency || "USD"})</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={transferForm.amount}
                    onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value, error: "" })}
                    className="w-full pl-8 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none text-lg font-bold"
                    data-testid="input-transfer-amount"
                  />
                </div>
              </div>

              {fromAccount && toAccount && fromAccount.currency !== toAccount.currency && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4" data-testid="conversion-info">
                  <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-1">
                    <ArrowLeftRight size={14} /> Currency Conversion
                  </h4>
                  <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <p>From: <span className="font-medium">{fromAccount.currency}</span> → To: <span className="font-medium">{toAccount.currency}</span></p>
                    <p>Rate: <span className="font-bold">1 {fromAccount.currency} = {conversionRate.toFixed(4)} {toAccount.currency}</span></p>
                    {transferForm.amount && (
                      <p>Recipient gets: <span className="font-bold text-blue-900 dark:text-blue-200">{convertedAmount} {toAccount.currency}</span></p>
                    )}
                  </div>
                </div>
              )}

              {transferForm.error && (
                <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertTriangle size={14} /> {transferForm.error}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              disabled={!transferForm.fromId || !transferForm.toId || !transferForm.amount || transferMutation.isPending}
              onClick={() => {
                const amt = parseFloat(transferForm.amount);
                if (fromAccount && amt > Number(fromAccount.balance)) {
                  setTransferForm({ ...transferForm, error: "Account does not have sufficient balance to Transfer" });
                  return;
                }
                transferMutation.mutate();
              }}
              className="px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
              data-testid="button-submit-transfer"
            >
              <Send size={18} /> {transferMutation.isPending ? "Processing..." : "Transfer Funds"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden" data-testid="card-transaction-history">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 dark:text-white">Transaction History</h3>
          <button
            onClick={handleDownloadPDF}
            className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            data-testid="button-export-transactions"
          >
            <Download size={16} /> Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
              {displayTxns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    No transactions found
                  </td>
                </tr>
              ) : (
                displayTxns.map((txn, idx) => (
                  <tr key={txn.id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors" data-testid={`row-transaction-${txn.id || idx}`}>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      TXN-{String(txn.id).padStart(4, "0")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        txn.type === "deposit"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : txn.type === "withdrawal"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}>
                        {txn.type === "deposit" && <ArrowUpRight size={12} className="mr-1" />}
                        {txn.type === "withdrawal" && <ArrowDownRight size={12} className="mr-1" />}
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {txn.notes || txn.method || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(txn.createdAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold ${
                      txn.type === "withdrawal" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                    }`}>
                      {txn.type === "withdrawal" ? "-" : "+"}${Number(txn.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={txn.status === "completed" || txn.status === "approved" ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={commissionDialog} onOpenChange={setCommissionDialog}>
        <DialogContent className="sm:max-w-md bg-[#0f172a] border-gray-800 text-white p-0 overflow-hidden">
          <div className="p-6 space-y-5">
            <DialogHeader className="space-y-1.5">
              <DialogTitle className="flex items-center gap-2 text-white text-lg font-bold">
                <ArrowLeftRight size={20} className="text-brand-400" />
                Transfer to Wallet
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-sm">
                Transfer your earnings to your main wallet balance.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-between p-5 bg-[#1e293b] rounded-xl border border-gray-700/50">
              <div>
                <p className="text-sm text-purple-400 font-medium">Total IB Commission</p>
                <p className="text-3xl font-bold text-white mt-1" data-testid="text-available-commission">
                  ${totalCommissions.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Available to transfer</p>
              </div>
              <div className="p-3 bg-purple-600/20 rounded-xl">
                <Gift size={24} className="text-purple-400" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1e293b] rounded-xl border border-gray-700/50">
              <div className="text-center flex-1">
                <p className="text-xs text-gray-400 mb-1">From</p>
                <p className="font-bold text-white text-sm">IB Commission</p>
              </div>
              <div className="px-3">
                <ArrowLeftRight size={18} className="text-gray-500" />
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-gray-400 mb-1">To</p>
                <p className="font-bold text-white text-sm">Main Wallet</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 font-bold text-lg">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={totalCommissions}
                  placeholder="0.00"
                  value={commissionAmount}
                  onChange={(e) => setCommissionAmount(e.target.value)}
                  className="w-full pl-9 p-3.5 rounded-xl border-2 border-brand-500 bg-[#1e293b] text-white focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none text-lg font-bold placeholder-gray-600"
                  data-testid="input-commission-amount"
                />
              </div>
              {parseFloat(commissionAmount) > totalCommissions && (
                <p className="text-xs text-red-400 mt-1.5">Amount exceeds available commission balance</p>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((pct) => {
                const pctAmount = (totalCommissions * pct / 100).toFixed(2);
                const isActive = commissionAmount === pctAmount;
                return (
                  <button
                    key={pct}
                    onClick={() => setCommissionAmount(pctAmount)}
                    className={`py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                      isActive
                        ? "bg-brand-600 border-brand-500 text-white"
                        : "bg-[#1e293b] border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                    }`}
                    data-testid={`button-commission-${pct}`}
                  >
                    {pct}%
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => commissionTransferMutation.mutate(commissionAmount)}
              disabled={
                commissionTransferMutation.isPending ||
                !commissionAmount ||
                parseFloat(commissionAmount) <= 0 ||
                parseFloat(commissionAmount) > totalCommissions
              }
              className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 text-base"
              data-testid="button-confirm-commission"
            >
              <ArrowLeftRight size={18} />
              {commissionTransferMutation.isPending ? "Transferring..." : "Transfer to Wallet"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
