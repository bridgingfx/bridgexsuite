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
  Settings2,
  CandlestickChart,
  Layers,
  Globe,
  ArrowRightLeft,
  ChevronRight,
  ChevronLeft,
  Check,
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
    const matchType = isLive ? a.type === "live" || a.type === "standard" : isDemo ? a.type === "demo" : true;
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
  const passwordMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAccount) throw new Error("No account selected");
      return apiRequest("POST", `/api/trading-accounts/${selectedAccount.id}/change-password`, { newPassword });
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

  const passwordsMatch = newPassword === confirmPassword;
  const isPasswordValid = newPassword.length >= 6 && passwordsMatch;

  function getPlatformColor(platform: string) {
    switch (platform) {
      case "MT5": return { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400" };
      case "MT4": return { text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20", badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" };
      case "cTrader": return { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" };
      default: return { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400" };
    }
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
            <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
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
            const { pnl, pnlPercent } = getPnl(account);
            const platformColor = getPlatformColor(account.platform);
            const isPositive = pnl >= 0;

            return (
              <div
                key={account.id}
                className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all"
                data-testid={`card-account-${account.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-3 rounded-lg", platformColor.bg)}>
                      <CandlestickChart className={cn("w-5 h-5", platformColor.text)} />
                    </div>
                    <div>
                      <p className="font-mono font-semibold text-gray-900 dark:text-white" data-testid={`text-account-number-${account.id}`}>
                        {account.accountNumber}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="secondary" className={cn("text-xs", platformColor.badge)} data-testid={`badge-platform-${account.id}`}>
                          {account.platform}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{account.type}</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Globe className="w-3 h-3" />
                          BridgeX-{account.type === "demo" ? "Demo" : "Live"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      account.status === "active" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    )}
                    data-testid={`badge-status-${account.id}`}
                  >
                    {account.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Balance</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white" data-testid={`text-balance-${account.id}`}>
                      ${Number(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Equity</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white" data-testid={`text-equity-${account.id}`}>
                      ${Number(account.equity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Margin</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white" data-testid={`text-margin-${account.id}`}>
                      ${(Number(account.equity) - Number(account.balance) > 0 ? (Number(account.equity) - Number(account.balance)) : 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md",
                    isPositive ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" : "text-red-500 dark:text-red-400 bg-red-500/10"
                  )}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span data-testid={`text-pnl-${account.id}`}>
                      {isPositive ? "+" : ""}${pnl.toFixed(2)} ({pnlPercent.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                    <Scale className="w-3 h-3" />
                    <span>{account.leverage}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => { setSelectedAccount(account); setDepositAmount(""); setDepositOpen(true); }}
                    data-testid={`button-deposit-${account.id}`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                    Deposit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => { setSelectedAccount(account); setWithdrawOpen(true); }}
                    data-testid={`button-withdraw-${account.id}`}
                  >
                    <ArrowDownRight className="w-3.5 h-3.5 mr-1" />
                    Withdraw
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => { setSelectedAccount(account); setTransferOpen(true); }}
                    data-testid={`button-transfer-${account.id}`}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 mr-1" />
                    Transfer
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => navigate(`/trading/account/${account.id}`)}
                    data-testid={`button-webtrader-${account.id}`}
                  >
                    <Globe className="w-3.5 h-3.5 mr-1" />
                    WebTrader
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => { setSelectedAccount(account); setNewPassword(""); setConfirmPassword(""); setPasswordOpen(true); }}
                    data-testid={`button-password-${account.id}`}
                  >
                    <Lock className="w-3.5 h-3.5 mr-1" />
                    Password
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => { setSelectedAccount(account); setNewLeverage(account.leverage); setLeverageOpen(true); }}
                    data-testid={`button-leverage-${account.id}`}
                  >
                    <Settings2 className="w-3.5 h-3.5 mr-1" />
                    Leverage
                  </Button>
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
            <DialogTitle>Change Trading Password</DialogTitle>
            <DialogDescription>Set a new password for your trading account.</DialogDescription>
          </DialogHeader>
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Available: <span className="font-medium text-gray-900 dark:text-white">${Number(selectedAccount?.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </p>
          <Button variant="outline" className="w-full" onClick={() => setWithdrawOpen(false)} data-testid="button-close-withdraw">
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Internal Transfer</DialogTitle>
            <DialogDescription>Transfer funds between your trading accounts.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <ArrowRightLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Transfer from</p>
              <p className="font-mono font-medium text-sm text-gray-900 dark:text-white">{selectedAccount?.accountNumber}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Available: <span className="font-medium text-gray-900 dark:text-white">${Number(selectedAccount?.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </p>
          <Button variant="outline" className="w-full" onClick={() => setTransferOpen(false)} data-testid="button-close-transfer">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
