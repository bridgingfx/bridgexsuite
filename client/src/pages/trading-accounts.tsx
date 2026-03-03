import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Plus,
  Search,
  DollarSign,
  BarChart3,
  Eye,
  Lock,
  Scale,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  Settings2,
  CandlestickChart,
  Layers,
  Globe,
  ArrowRightLeft,
  ChevronRight,
  ChevronLeft,
  Check,
  RefreshCw,
  Gift,
} from "lucide-react";
import type { TradingAccount } from "@shared/schema";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const demoAccountsData = [
  { login: 8829102, server: "BridgeX-Live", leverage: "1:500", balance: 5200, equity: 5350.2, margin: 1240, type: "live", accTier: "ECN", currency: "USD", platform: "MT5" },
  { login: 8829205, server: "BridgeX-Live", leverage: "1:200", balance: 3800, equity: 3720.5, margin: 890, type: "live", accTier: "Standard", currency: "USD", platform: "MT4" },
  { login: 8830011, server: "BridgeX-Demo", leverage: "1:500", balance: 10000, equity: 10245.8, margin: 0, type: "demo", accTier: "ECN", currency: "USD", platform: "MT5" },
  { login: 8830155, server: "BridgeX-Demo", leverage: "1:100", balance: 50000, equity: 50000, margin: 0, type: "demo", accTier: "Standard", currency: "EUR", platform: "cTrader" },
];

const wizardSteps = ["Platform", "Account Tier", "Leverage", "Currency"];

const conversionRates: Record<string, Record<string, number>> = {
  USD: { EUR: 0.92, GBP: 0.79, USD: 1 },
  EUR: { USD: 1.09, GBP: 0.86, EUR: 1 },
  GBP: { USD: 1.27, EUR: 1.16, GBP: 1 },
};

const currencySymbols: Record<string, string> = { USD: "$", EUR: "\u20AC", GBP: "\u00A3" };

export default function TradingAccounts() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [leverageOpen, setLeverageOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<TradingAccount | null>(null);

  const [wizardStep, setWizardStep] = useState(0);

  const isLive = location === "/forex/accounts/live" || location === "/forex/accounts";
  const isDemo = location === "/forex/accounts/demo";
  const activeTab = isDemo ? "demo" : "live";

  const { data: accounts, isLoading } = useQuery<TradingAccount[]>({
    queryKey: ["/api/trading-accounts"],
  });

  const filtered = (accounts || []).filter((a) => {
    const matchSearch = a.accountNumber.toLowerCase().includes(search.toLowerCase());
    const matchType = isLive ? a.type !== "demo" : isDemo ? a.type === "demo" : true;
    return matchSearch && matchType;
  });

  const totalBalance = filtered.reduce((sum, a) => sum + Number(a.balance), 0);
  const totalEquity = filtered.reduce((sum, a) => sum + Number(a.equity), 0);
  const activeAccounts = filtered.filter((a) => a.status === "active").length;
  const totalPnl = totalEquity - totalBalance;

  const [formData, setFormData] = useState({
    platform: "",
    type: "",
    leverage: "",
    currency: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/trading-accounts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      toast({ title: "Trading account created" });
      setAddOpen(false);
      setWizardStep(0);
      setFormData({ platform: "", type: "", leverage: "", currency: "" });
    },
    onError: () => {
      toast({ title: "Failed to create account", variant: "destructive" });
    },
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordType, setPasswordType] = useState<"master" | "investor">("master");
  const passwordMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAccount) throw new Error("No account selected");
      return apiRequest("POST", `/api/trading-accounts/${selectedAccount.id}/change-password`, { newPassword, passwordType });
    },
    onSuccess: () => {
      toast({ title: "Password changed successfully" });
      setPasswordOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: () => {
      toast({ title: "Failed to change password", variant: "destructive" });
    },
  });

  const [newLeverage, setNewLeverage] = useState("1:100");
  const leverageMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAccount) throw new Error("No account selected");
      return apiRequest("PATCH", `/api/trading-accounts/${selectedAccount.id}/leverage`, { leverage: newLeverage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      toast({ title: "Leverage updated successfully" });
      setLeverageOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to update leverage", variant: "destructive" });
    },
  });

  const [depositAmount, setDepositAmount] = useState("");
  const depositMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAccount) throw new Error("No account selected");
      return apiRequest("POST", `/api/trading-accounts/${selectedAccount.id}/deposit`, { amount: depositAmount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Deposit successful", description: `$${Number(depositAmount).toLocaleString()} deposited to ${selectedAccount?.accountNumber}` });
      setDepositOpen(false);
      setDepositAmount("");
    },
    onError: () => {
      toast({ title: "Deposit failed", variant: "destructive" });
    },
  });

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawCurrency, setWithdrawCurrency] = useState("USD");
  const withdrawMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAccount) throw new Error("No account selected");
      return apiRequest("POST", `/api/trading-accounts/${selectedAccount.id}/withdraw`, { amount: Number(withdrawAmount) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Withdrawal successful", description: `${currencySymbols[withdrawCurrency]}${getConvertedAmount().toFixed(2)} withdrawn to ${withdrawCurrency} wallet` });
      setWithdrawOpen(false);
      setWithdrawAmount("");
      setWithdrawCurrency("USD");
    },
    onError: () => {
      toast({ title: "Withdrawal failed", variant: "destructive" });
    },
  });

  function getConvertedAmount() {
    const amount = Number(withdrawAmount) || 0;
    const accountCurrency = selectedAccount?.currency || "USD";
    const rate = conversionRates[accountCurrency]?.[withdrawCurrency] ?? 1;
    return amount * rate;
  }

  const [transferAmount, setTransferAmount] = useState("");
  const [transferToAccountId, setTransferToAccountId] = useState("");

  const transferToAccount = (accounts || []).find((a) => String(a.id) === transferToAccountId) || null;

  function getTransferConversionRate() {
    if (!selectedAccount || !transferToAccount) return 1;
    if (selectedAccount.currency === transferToAccount.currency) return 1;
    return conversionRates[selectedAccount.currency]?.[transferToAccount.currency] ?? 1;
  }

  function getTransferConvertedAmount() {
    const amount = Number(transferAmount) || 0;
    return amount * getTransferConversionRate();
  }

  const transferMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAccount || !transferToAccountId) throw new Error("Missing accounts");
      return apiRequest("POST", "/api/trading-accounts/internal-transfer", {
        fromAccountId: String(selectedAccount.id),
        toAccountId: transferToAccountId,
        amount: transferAmount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      const rate = getTransferConversionRate();
      const converted = getTransferConvertedAmount();
      const fromCurrency = selectedAccount?.currency || "USD";
      const toCurrency = transferToAccount?.currency || "USD";
      const desc = fromCurrency !== toCurrency
        ? `${currencySymbols[fromCurrency]}${Number(transferAmount).toLocaleString()} → ${currencySymbols[toCurrency]}${converted.toFixed(2)} transferred`
        : `${currencySymbols[fromCurrency]}${Number(transferAmount).toLocaleString()} transferred`;
      toast({ title: "Transfer successful", description: desc });
      setTransferOpen(false);
      setTransferAmount("");
      setTransferToAccountId("");
    },
    onError: (error: any) => {
      toast({ title: "Transfer failed", description: error?.message || "Could not complete transfer", variant: "destructive" });
    },
  });

  const passwordsMatch = newPassword === confirmPassword;
  const isPasswordValid = newPassword.length >= 6 && passwordsMatch;

  function getAccountTier(account: TradingAccount) {
    const type = account.type?.toUpperCase();
    if (type === "ECN" || type === "STANDARD" || type === "RAW") return type;
    if (type === "LIVE") return "ECN";
    return type || "ECN";
  }

  function getPnl(account: TradingAccount) {
    const balance = Number(account.balance);
    const equity = Number(account.equity);
    const pnl = equity - balance;
    const pnlPercent = balance > 0 ? (pnl / balance) * 100 : 0;
    return { pnl, pnlPercent };
  }

  function canAdvanceWizard() {
    if (wizardStep === 0) return !!formData.platform;
    if (wizardStep === 1) return !!formData.type;
    if (wizardStep === 2) return !!formData.leverage;
    if (wizardStep === 3) return !!formData.currency;
    return false;
  }

  const cardActions = [
    { label: "View", icon: Eye, action: (account: TradingAccount) => navigate(`/trading/account/${account.id}`) },
    { label: "Password", icon: Lock, action: (account: TradingAccount) => { setSelectedAccount(account); setNewPassword(""); setConfirmPassword(""); setPasswordType("master"); setPasswordOpen(true); } },
    { label: "Leverage", icon: RefreshCw, action: (account: TradingAccount) => { setSelectedAccount(account); setNewLeverage(account.leverage); setLeverageOpen(true); } },
    { label: "Deposit", icon: ArrowDownCircle, action: (account: TradingAccount) => { setSelectedAccount(account); setDepositAmount(""); setDepositOpen(true); } },
    { label: "Withdraw", icon: ArrowUpCircle, action: (account: TradingAccount) => { setSelectedAccount(account); setWithdrawAmount(""); setWithdrawCurrency("USD"); setWithdrawOpen(true); } },
    { label: "Transfer", icon: ArrowLeftRight, action: (account: TradingAccount) => { setSelectedAccount(account); setTransferAmount(""); setTransferToAccountId(""); setTransferOpen(true); } },
    { label: "Bonus", icon: Gift, action: () => { toast({ title: "Coming soon", description: "Bonus feature is coming soon." }); } },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-trading-title">
            Trading Accounts
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your MT4, MT5, and cTrader trading accounts</p>
        </div>
        <Button onClick={() => { setAddOpen(true); setWizardStep(0); setFormData({ platform: "", type: "", leverage: "", currency: "" }); }} data-testid="button-add-account">
          <Plus className="w-4 h-4 mr-2" />
          Open New Account
        </Button>
      </div>

      <div className="flex gap-2" data-testid="tabs-account-type">
        <Button
          variant={activeTab === "live" ? "default" : "outline"}
          size="sm"
          onClick={() => navigate("/forex/accounts/live")}
          data-testid="tab-live"
        >
          Live Accounts
        </Button>
        <Button
          variant={activeTab === "demo" ? "default" : "outline"}
          size="sm"
          onClick={() => navigate("/forex/accounts/demo")}
          data-testid="tab-demo"
        >
          Demo Accounts
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all" data-testid="stat-total-accounts">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Accounts</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-total-accounts">{filtered.length}</h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">{activeAccounts} active</div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all" data-testid="stat-total-balance">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Balance</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-total-balance">
                ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Across all accounts</div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all" data-testid="stat-total-equity">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Equity</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-total-equity">
                ${totalEquity.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Current market value</div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all" data-testid="stat-unrealized-pnl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Unrealized P&L</p>
              <h3 className={cn("text-2xl font-bold", totalPnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400")} data-testid="text-total-pnl">
                {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className={cn("p-3 rounded-lg", totalPnl >= 0 ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400")}>
              {totalPnl >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {totalBalance > 0 ? `${((totalPnl / totalBalance) * 100).toFixed(2)}% return` : "No open positions"}
          </div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by account number..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="input-search-accounts"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#0f172a] p-6 rounded-xl shadow-sm">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-10 w-full mb-3" />
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-dark-card p-12 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">
          <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <CandlestickChart className="w-7 h-7 text-gray-400" />
          </div>
          <p className="font-medium text-gray-900 dark:text-white mb-1">No trading accounts found</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Get started by opening your first trading account.</p>
          <Button onClick={() => { setAddOpen(true); setWizardStep(0); }} data-testid="button-empty-add-account">
            <Plus className="w-4 h-4 mr-2" />
            Open New Account
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((account) => {
            const credit = 0;
            const accountTier = getAccountTier(account);

            return (
              <div
                key={account.id}
                className="bg-[#0f172a] rounded-xl shadow-sm overflow-visible"
                data-testid={`card-account-${account.id}`}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg font-bold text-sm" data-testid={`badge-platform-${account.id}`}>
                        {account.platform}
                      </span>
                      <span className="font-bold text-white text-base" data-testid={`text-account-number-${account.id}`}>
                        {account.accountNumber}
                      </span>
                      <a
                        href="https://webtrader.leveragemarkets.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 cursor-pointer hover:text-white transition-colors"
                        data-testid={`button-webtrader-${account.id}`}
                      >
                        <CandlestickChart className="w-5 h-5" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="border border-emerald-500 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold" data-testid={`badge-status-${account.id}`}>
                        {account.type === "demo" ? "DEMO" : "LIVE"}
                      </span>
                      <span className="border border-gray-500 text-gray-300 px-3 py-1 rounded-lg text-xs font-bold" data-testid={`badge-tier-${account.id}`}>
                        {accountTier}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mt-2">
                    BridgeX-{account.type === "demo" ? "Demo" : "Live"}
                  </p>

                  <div className="border-t border-gray-700 mt-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 uppercase text-xs font-medium tracking-wider">Balance</p>
                        <p className="text-white text-2xl font-bold mt-1" data-testid={`text-balance-${account.id}`}>
                          ${Number(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 uppercase text-xs font-medium tracking-wider">Equity</p>
                        <p className="text-emerald-400 text-2xl font-bold mt-1" data-testid={`text-equity-${account.id}`}>
                          ${Number(account.equity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 uppercase text-xs font-medium tracking-wider">Credit</p>
                        <p className="text-emerald-400 text-base font-semibold mt-1" data-testid={`text-credit-${account.id}`}>
                          ${credit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 uppercase text-xs font-medium tracking-wider">Leverage</p>
                        <p className="text-white text-base font-semibold mt-1" data-testid={`text-leverage-${account.id}`}>
                          {account.leverage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 px-2 py-3">
                  <div className="grid grid-cols-7">
                    {cardActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => action.action(account)}
                        className="flex flex-col items-center justify-center cursor-pointer group"
                        data-testid={`button-action-${action.label.toLowerCase()}-${account.id}`}
                      >
                        <action.icon className="text-gray-400 w-5 h-5 group-hover:text-white transition-colors" />
                        <span className="text-gray-400 text-[10px] mt-1 group-hover:text-white transition-colors">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => { setAddOpen(true); setWizardStep(0); setFormData({ platform: "", type: "", leverage: "", currency: "" }); }}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-transparent cursor-pointer transition-all min-h-[280px]"
            data-testid="card-open-new-account"
          >
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">Open New Account</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Create a new MT4, MT5, or cTrader trading account</p>
          </button>
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={(open) => { setAddOpen(open); if (!open) { setWizardStep(0); setFormData({ platform: "", type: "", leverage: "", currency: "" }); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Trading Account</DialogTitle>
            <DialogDescription>Follow the steps to set up your new trading account.</DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 mb-6" data-testid="wizard-steps">
            {wizardSteps.map((step, i) => (
              <div key={step} className="flex items-center gap-2 flex-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors",
                  i < wizardStep
                    ? "bg-emerald-500 text-white"
                    : i === wizardStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                )} data-testid={`wizard-step-${i}`}>
                  {i < wizardStep ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < wizardSteps.length - 1 && (
                  <div className={cn("h-0.5 flex-1", i < wizardStep ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700")} />
                )}
              </div>
            ))}
          </div>

          <div className="mb-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Step {wizardStep + 1} of {wizardSteps.length}</p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select {wizardSteps[wizardStep]}</h3>
          </div>

          {wizardStep === 0 && (
            <div className="grid grid-cols-3 gap-3" data-testid="wizard-platform-options">
              {[
                { value: "MT5", label: "MetaTrader 5", desc: "Most popular" },
                { value: "MT4", label: "MetaTrader 4", desc: "Classic" },
                { value: "cTrader", label: "cTrader", desc: "Advanced" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setFormData({ ...formData, platform: p.value })}
                  className={cn(
                    "p-4 rounded-xl border-2 text-center transition-all cursor-pointer",
                    formData.platform === p.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card"
                  )}
                  data-testid={`option-platform-${p.value}`}
                >
                  <CandlestickChart className={cn("w-6 h-6 mx-auto mb-2", formData.platform === p.value ? "text-blue-600 dark:text-blue-400" : "text-gray-400")} />
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{p.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.desc}</p>
                </button>
              ))}
            </div>
          )}

          {wizardStep === 1 && (
            <div className="grid grid-cols-2 gap-3" data-testid="wizard-tier-options">
              {[
                { value: "standard", label: "Standard", desc: "Spreads from 1.0 pip" },
                { value: "ecn", label: "ECN", desc: "Raw spreads + commission" },
                { value: "raw", label: "Raw Spread", desc: "Lowest spreads available" },
                { value: "demo", label: "Demo", desc: "Practice with virtual funds" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setFormData({ ...formData, type: t.value })}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all cursor-pointer",
                    formData.type === t.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card"
                  )}
                  data-testid={`option-tier-${t.value}`}
                >
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{t.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          )}

          {wizardStep === 2 && (
            <div className="grid grid-cols-2 gap-3" data-testid="wizard-leverage-options">
              {["1:50", "1:100", "1:200", "1:500"].map((lev) => (
                <button
                  key={lev}
                  onClick={() => setFormData({ ...formData, leverage: lev })}
                  className={cn(
                    "p-4 rounded-xl border-2 text-center transition-all cursor-pointer",
                    formData.leverage === lev
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card"
                  )}
                  data-testid={`option-leverage-${lev}`}
                >
                  <p className="font-semibold text-lg text-gray-900 dark:text-white">{lev}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {lev === "1:50" ? "Conservative" : lev === "1:100" ? "Standard" : lev === "1:200" ? "Moderate" : "Aggressive"}
                  </p>
                </button>
              ))}
            </div>
          )}

          {wizardStep === 3 && (
            <div className="grid grid-cols-3 gap-3" data-testid="wizard-currency-options">
              {[
                { value: "USD", symbol: "$" },
                { value: "EUR", symbol: "\u20AC" },
                { value: "GBP", symbol: "\u00A3" },
              ].map((c) => (
                <button
                  key={c.value}
                  onClick={() => setFormData({ ...formData, currency: c.value })}
                  className={cn(
                    "p-4 rounded-xl border-2 text-center transition-all cursor-pointer",
                    formData.currency === c.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card"
                  )}
                  data-testid={`option-currency-${c.value}`}
                >
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{c.symbol}</p>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{c.value}</p>
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setWizardStep(Math.max(0, wizardStep - 1))}
              disabled={wizardStep === 0}
              data-testid="button-wizard-back"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            {wizardStep < wizardSteps.length - 1 ? (
              <Button
                onClick={() => setWizardStep(wizardStep + 1)}
                disabled={!canAdvanceWizard()}
                data-testid="button-wizard-next"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={() => createMutation.mutate(formData)}
                disabled={createMutation.isPending || !canAdvanceWizard()}
                data-testid="button-create-account"
              >
                {createMutation.isPending ? "Creating..." : "Create Account"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change {passwordType === "master" ? "Master" : "Investor"} Password</DialogTitle>
            <DialogDescription>Set a new {passwordType} password for your trading account.</DialogDescription>
          </DialogHeader>

          <div className="flex rounded-lg overflow-visible mb-2">
            <button
              onClick={() => setPasswordType("master")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-l-lg transition-colors",
                passwordType === "master"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              )}
              data-testid="button-password-type-master"
            >
              Master Password
            </button>
            <button
              onClick={() => setPasswordType("investor")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-r-lg transition-colors",
                passwordType === "investor"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              )}
              data-testid="button-password-type-investor"
            >
              Investor Password
            </button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Account: <span className="font-mono font-medium text-gray-900 dark:text-white">{selectedAccount?.accountNumber}</span>
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="Enter new password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                data-testid="input-new-password"
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                data-testid="input-confirm-password"
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>
            <Button
              className="w-full"
              onClick={() => passwordMutation.mutate()}
              disabled={passwordMutation.isPending || !isPasswordValid}
              data-testid="button-submit-password"
            >
              {passwordMutation.isPending ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={leverageOpen} onOpenChange={setLeverageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Leverage</DialogTitle>
            <DialogDescription>Update the leverage ratio for your trading account.</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Account: <span className="font-mono font-medium text-gray-900 dark:text-white">{selectedAccount?.accountNumber}</span>
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Leverage</Label>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">{selectedAccount?.leverage}</div>
            </div>
            <div className="space-y-2">
              <Label>New Leverage</Label>
              <Select value={newLeverage} onValueChange={setNewLeverage}>
                <SelectTrigger data-testid="select-new-leverage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:50">1:50</SelectItem>
                  <SelectItem value="1:100">1:100</SelectItem>
                  <SelectItem value="1:200">1:200</SelectItem>
                  <SelectItem value="1:500">1:500</SelectItem>
                  <SelectItem value="1:1000">1:1000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-3">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Changing leverage may affect margin requirements for your open positions. Changes take effect immediately.
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() => leverageMutation.mutate()}
              disabled={leverageMutation.isPending || newLeverage === selectedAccount?.leverage}
              data-testid="button-submit-leverage"
            >
              {leverageMutation.isPending ? "Updating..." : "Update Leverage"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Deposit from Wallet</DialogTitle>
            <DialogDescription>Transfer funds from your wallet to your trading account.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Deposit to</p>
              <p className="font-mono font-medium text-sm text-gray-900 dark:text-white">{selectedAccount?.accountNumber}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                data-testid="input-deposit-amount"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["100", "500", "1000", "5000"].map((v) => (
                <Button
                  key={v}
                  variant="outline"
                  size="sm"
                  onClick={() => setDepositAmount(v)}
                  data-testid={`button-deposit-amount-${v}`}
                >
                  ${v}
                </Button>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => depositMutation.mutate()}
              disabled={depositMutation.isPending || !depositAmount}
              data-testid="button-submit-deposit"
            >
              {depositMutation.isPending ? "Processing..." : "Deposit Now"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw to Wallet</DialogTitle>
            <DialogDescription>Transfer funds from your trading account to your wallet.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Withdraw from</p>
              <p className="font-mono font-medium text-sm text-gray-900 dark:text-white">{selectedAccount?.accountNumber}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Available Balance</p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300" data-testid="text-withdraw-available">
              ${Number(selectedAccount?.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Destination Wallet Currency</Label>
              <Select value={withdrawCurrency} onValueChange={setWithdrawCurrency}>
                <SelectTrigger data-testid="select-withdraw-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (&euro;)</SelectItem>
                  <SelectItem value="GBP">GBP (&pound;)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amount ({selectedAccount?.currency || "USD"})</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                data-testid="input-withdraw-amount"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {["100", "500", "1000"].map((v) => (
                <Button
                  key={v}
                  variant="outline"
                  size="sm"
                  onClick={() => setWithdrawAmount(v)}
                  data-testid={`button-withdraw-amount-${v}`}
                >
                  ${v}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWithdrawAmount(String(Number(selectedAccount?.balance || 0)))}
                data-testid="button-withdraw-amount-max"
              >
                Max
              </Button>
            </div>

            {withdrawAmount && (selectedAccount?.currency || "USD") !== withdrawCurrency && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  You will receive: <span className="font-bold text-gray-900 dark:text-white" data-testid="text-withdraw-converted">{currencySymbols[withdrawCurrency]}{getConvertedAmount().toFixed(2)} {withdrawCurrency}</span>
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Rate: 1 {selectedAccount?.currency || "USD"} = {conversionRates[selectedAccount?.currency || "USD"]?.[withdrawCurrency]?.toFixed(4)} {withdrawCurrency}
                </p>
              </div>
            )}

            <Button
              className="w-full"
              onClick={() => withdrawMutation.mutate()}
              disabled={withdrawMutation.isPending || !withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > Number(selectedAccount?.balance || 0)}
              data-testid="button-submit-withdraw"
            >
              {withdrawMutation.isPending ? "Processing..." : "Withdraw Now"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Internal Transfer</DialogTitle>
            <DialogDescription>Transfer funds between your trading accounts.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Transfer From</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <ArrowRightLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-mono font-medium text-sm text-gray-900 dark:text-white" data-testid="text-transfer-from-account">{selectedAccount?.accountNumber}</p>
                    <p className="text-xs text-gray-400">{selectedAccount?.platform} · {selectedAccount?.currency}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white" data-testid="text-transfer-from-balance">
                  {currencySymbols[selectedAccount?.currency || "USD"]}{Number(selectedAccount?.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-700 dark:text-gray-300">Transfer To</Label>
              <Select value={transferToAccountId} onValueChange={setTransferToAccountId}>
                <SelectTrigger className="mt-1" data-testid="select-transfer-to">
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  {(accounts || [])
                    .filter((a) => selectedAccount && a.id !== selectedAccount.id)
                    .map((a) => (
                      <SelectItem key={a.id} value={String(a.id)} data-testid={`option-transfer-to-${a.id}`}>
                        {a.accountNumber} · {a.platform} · {a.currency} ({currencySymbols[a.currency || "USD"]}{Number(a.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {transferToAccount && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Destination Account</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-mono font-medium text-sm text-gray-900 dark:text-white" data-testid="text-transfer-to-account">{transferToAccount.accountNumber}</p>
                      <p className="text-xs text-gray-400">{transferToAccount.platform} · {transferToAccount.currency}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white" data-testid="text-transfer-to-balance">
                    {currencySymbols[transferToAccount.currency || "USD"]}{Number(transferToAccount.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            )}

            <div>
              <Label className="text-sm text-gray-700 dark:text-gray-300">Amount ({selectedAccount?.currency || "USD"})</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="mt-1"
                data-testid="input-transfer-amount"
              />
              <div className="flex gap-2 mt-2">
                {[100, 500, 1000].map((preset) => (
                  <Button key={preset} variant="outline" size="sm" onClick={() => setTransferAmount(String(preset))} data-testid={`button-transfer-preset-${preset}`}>
                    {currencySymbols[selectedAccount?.currency || "USD"]}{preset}
                  </Button>
                ))}
                <Button variant="outline" size="sm" onClick={() => setTransferAmount(String(Number(selectedAccount?.balance || 0)))} data-testid="button-transfer-max">
                  Max
                </Button>
              </div>
            </div>

            {transferToAccount && selectedAccount && selectedAccount.currency !== transferToAccount.currency && Number(transferAmount) > 0 && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Exchange Rate</span>
                  <span className="font-medium text-gray-900 dark:text-white" data-testid="text-transfer-rate">
                    1 {selectedAccount.currency} = {getTransferConversionRate().toFixed(4)} {transferToAccount.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">You send</span>
                  <span className="font-medium text-gray-900 dark:text-white" data-testid="text-transfer-send">
                    {currencySymbols[selectedAccount.currency]}{Number(transferAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })} {selectedAccount.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Recipient gets</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400" data-testid="text-transfer-receive">
                    {currencySymbols[transferToAccount.currency]}{getTransferConvertedAmount().toFixed(2)} {transferToAccount.currency}
                  </span>
                </div>
              </div>
            )}

            <Button
              className="w-full"
              onClick={() => transferMutation.mutate()}
              disabled={transferMutation.isPending || !transferAmount || !transferToAccountId || Number(transferAmount) <= 0 || Number(transferAmount) > Number(selectedAccount?.balance || 0)}
              data-testid="button-submit-transfer"
            >
              {transferMutation.isPending ? "Processing..." : "Transfer Now"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}