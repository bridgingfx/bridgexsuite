import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
  Eye,
  Lock,
  Scale,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Settings2,
  CandlestickChart,
  Layers,
} from "lucide-react";
import type { TradingAccount } from "@shared/schema";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function TradingAccounts() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [leverageOpen, setLeverageOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<TradingAccount | null>(null);

  const isLive = location === "/forex/accounts/live" || location === "/forex/accounts";
  const isDemo = location === "/forex/accounts/demo";

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
    platform: "MT5",
    type: "standard",
    leverage: "1:100",
    currency: "USD",
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/trading-accounts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      toast({ title: "Trading account created" });
      setAddOpen(false);
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
      case "MT5": return { text: "text-blue-500 dark:text-blue-400", bg: "bg-blue-500/10 dark:bg-blue-400/10" };
      case "MT4": return { text: "text-indigo-500 dark:text-indigo-400", bg: "bg-indigo-500/10 dark:bg-indigo-400/10" };
      case "cTrader": return { text: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/10 dark:bg-emerald-400/10" };
      default: return { text: "text-primary", bg: "bg-primary/10" };
    }
  }

  function getPnl(account: TradingAccount) {
    const balance = Number(account.balance);
    const equity = Number(account.equity);
    const pnl = equity - balance;
    const pnlPercent = balance > 0 ? (pnl / balance) * 100 : 0;
    return { pnl, pnlPercent };
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-trading-title">
            {isLive ? "Live Accounts" : isDemo ? "Demo Accounts" : "Trading Accounts"}
          </h1>
          <p className="text-sm text-muted-foreground">Manage your MT4, MT5, and cTrader accounts</p>
        </div>
        <Button onClick={() => setAddOpen(true)} data-testid="button-add-account">
          <Plus className="w-4 h-4 mr-2" />
          Open New Account
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="gradient-card-blue rounded-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Total Accounts</span>
              <div className="w-9 h-9 rounded-md bg-blue-500/15 dark:bg-blue-400/15 flex items-center justify-center shrink-0">
                <Layers className="w-[18px] h-[18px] text-blue-500 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight" data-testid="text-total-accounts">{filtered.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{activeAccounts} active</p>
          </CardContent>
        </Card>
        <Card className="gradient-card-emerald rounded-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Total Balance</span>
              <div className="w-9 h-9 rounded-md bg-emerald-500/15 dark:bg-emerald-400/15 flex items-center justify-center shrink-0">
                <DollarSign className="w-[18px] h-[18px] text-emerald-500 dark:text-emerald-400" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight" data-testid="text-total-balance">
              ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all accounts</p>
          </CardContent>
        </Card>
        <Card className="gradient-card-purple rounded-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Total Equity</span>
              <div className="w-9 h-9 rounded-md bg-purple-500/15 dark:bg-purple-400/15 flex items-center justify-center shrink-0">
                <BarChart3 className="w-[18px] h-[18px] text-purple-500 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight" data-testid="text-total-equity">
              ${totalEquity.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Current market value</p>
          </CardContent>
        </Card>
        <Card className={cn("rounded-md", totalPnl >= 0 ? "gradient-card-emerald" : "gradient-card-red")}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Unrealized P&L</span>
              <div className={cn("w-9 h-9 rounded-md flex items-center justify-center shrink-0", totalPnl >= 0 ? "bg-emerald-500/15" : "bg-red-400/15")}>
                {totalPnl >= 0 ? (
                  <ArrowUpRight className="w-[18px] h-[18px] text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-[18px] h-[18px] text-red-400" />
                )}
              </div>
            </div>
            <div className={cn("text-2xl font-bold tracking-tight", totalPnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400")} data-testid="text-total-pnl">
              {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalBalance > 0 ? `${((totalPnl / totalBalance) * 100).toFixed(2)}% return` : "No open positions"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by account number..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="input-search-accounts"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-md">
              <CardContent className="p-5 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="rounded-md">
          <CardContent className="py-16 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-md bg-muted flex items-center justify-center">
              <CandlestickChart className="w-7 h-7 text-muted-foreground" />
            </div>
            <div className="space-y-1 text-center">
              <p className="font-medium">No trading accounts found</p>
              <p className="text-sm text-muted-foreground">Get started by opening your first trading account.</p>
            </div>
            <Button onClick={() => setAddOpen(true)} data-testid="button-empty-add-account">
              <Plus className="w-4 h-4 mr-2" />
              Open New Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((account) => {
            const { pnl, pnlPercent } = getPnl(account);
            const platformColor = getPlatformColor(account.platform);
            const isPositive = pnl >= 0;

            return (
              <Card
                key={account.id}
                className="rounded-md hover:border-primary/30 dark:hover:border-primary/30 cursor-pointer transition-all duration-200 group"
                onClick={() => navigate(`/trading/account/${account.id}`)}
                data-testid={`card-account-${account.id}`}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-11 h-11 rounded-md flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105", platformColor.bg)}>
                        <CandlestickChart className={cn("w-5 h-5", platformColor.text)} />
                      </div>
                      <div>
                        <p className="font-mono font-semibold text-sm" data-testid={`text-account-number-${account.id}`}>
                          {account.accountNumber}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">{account.platform}</Badge>
                          <span className="text-[11px] text-muted-foreground capitalize">{account.type}</span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] font-medium",
                        account.status === "active" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      )}
                      data-testid={`badge-status-${account.id}`}
                    >
                      {account.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-3 rounded-md bg-muted/40 dark:bg-muted/20">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Balance</p>
                      <p className="text-lg font-bold tracking-tight" data-testid={`text-balance-${account.id}`}>
                        ${Number(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Equity</p>
                      <p className="text-lg font-bold tracking-tight" data-testid={`text-equity-${account.id}`}>
                        ${Number(account.equity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md",
                        isPositive ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" : "text-red-500 dark:text-red-400 bg-red-500/10"
                      )}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span data-testid={`text-pnl-${account.id}`}>
                          {isPositive ? "+" : ""}${pnl.toFixed(2)} ({pnlPercent.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                      <Scale className="w-3 h-3" />
                      <span>{account.leverage}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[11px] px-0 h-9"
                      onClick={() => navigate(`/trading/account/${account.id}`)}
                      data-testid={`button-view-${account.id}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[11px] px-0 h-9"
                      onClick={() => { setSelectedAccount(account); setNewPassword(""); setConfirmPassword(""); setPasswordOpen(true); }}
                      data-testid={`button-password-${account.id}`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[11px] px-0 h-9"
                      onClick={() => { setSelectedAccount(account); setNewLeverage(account.leverage); setLeverageOpen(true); }}
                      data-testid={`button-leverage-${account.id}`}
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      className="text-[11px] px-0 h-9"
                      onClick={() => { setSelectedAccount(account); setDepositAmount(""); setDepositOpen(true); }}
                      data-testid={`button-deposit-${account.id}`}
                    >
                      <Wallet className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Trading Account</DialogTitle>
            <DialogDescription>Select platform, type, leverage, and currency for your new account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={formData.platform} onValueChange={(v) => setFormData({ ...formData, platform: v })}>
                <SelectTrigger data-testid="select-platform"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MT4">MetaTrader 4</SelectItem>
                  <SelectItem value="MT5">MetaTrader 5</SelectItem>
                  <SelectItem value="cTrader">cTrader</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger data-testid="select-account-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="ecn">ECN</SelectItem>
                  <SelectItem value="demo">Demo</SelectItem>
                  <SelectItem value="raw">Raw Spread</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Leverage</Label>
              <Select value={formData.leverage} onValueChange={(v) => setFormData({ ...formData, leverage: v })}>
                <SelectTrigger data-testid="select-leverage"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:50">1:50</SelectItem>
                  <SelectItem value="1:100">1:100</SelectItem>
                  <SelectItem value="1:200">1:200</SelectItem>
                  <SelectItem value="1:500">1:500</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                <SelectTrigger data-testid="select-currency"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={() => createMutation.mutate(formData)}
              disabled={createMutation.isPending}
              data-testid="button-create-account"
            >
              {createMutation.isPending ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Trading Password</DialogTitle>
            <DialogDescription>Set a new password for your trading account.</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Account: <span className="font-mono font-medium text-foreground">{selectedAccount?.accountNumber}</span>
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
                <p className="text-xs text-destructive">Passwords do not match</p>
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
          <p className="text-sm text-muted-foreground">
            Account: <span className="font-mono font-medium text-foreground">{selectedAccount?.accountNumber}</span>
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Leverage</Label>
              <div className="text-sm text-muted-foreground font-mono">{selectedAccount?.leverage}</div>
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
            <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3">
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
          <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
            <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Deposit to</p>
              <p className="font-mono font-medium text-sm">{selectedAccount?.accountNumber}</p>
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
    </div>
  );
}
