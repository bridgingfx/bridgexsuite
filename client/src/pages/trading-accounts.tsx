import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
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
  MoreVertical,
  Eye,
  Lock,
  Scale,
  Wallet,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TradingAccount } from "@shared/schema";
import { useLocation } from "wouter";

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
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Total Accounts</span>
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">{filtered.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Active</span>
              <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">{activeAccounts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Total Balance</span>
              <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">
              ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Total Equity</span>
              <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 text-purple-500" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">
              ${totalEquity.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by account number..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-accounts"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-trading-accounts">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account #</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Leverage</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Balance</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Equity</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-muted-foreground">
                      Loading accounts...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">No trading accounts found</p>
                          <p className="text-sm text-muted-foreground">Get started by opening your first trading account.</p>
                        </div>
                        <Button onClick={() => setAddOpen(true)} data-testid="button-empty-add-account">
                          <Plus className="w-4 h-4 mr-2" />
                          Open New Account
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((account) => (
                    <tr key={account.id} className="border-b last:border-0" data-testid={`row-account-${account.id}`}>
                      <td className="py-3 px-3 font-mono font-medium">{account.accountNumber}</td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className="text-xs">{account.platform}</Badge>
                      </td>
                      <td className="py-3 px-3 capitalize">{account.type}</td>
                      <td className="py-3 px-3">{account.leverage}</td>
                      <td className="py-3 px-3 text-right font-mono">
                        ${Number(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        ${Number(account.equity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={account.status === "active" ? "default" : "secondary"}
                          className={account.status === "active" ? "bg-emerald-500/10 text-emerald-500" : ""}
                        >
                          {account.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-actions-${account.id}`}>
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => navigate(`/trading/account/${account.id}`)}

                              data-testid={`menu-view-${account.id}`}
                            >
                              <Eye className="w-4 h-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => { setSelectedAccount(account); setNewPassword(""); setConfirmPassword(""); setPasswordOpen(true); }}
                              data-testid={`menu-password-${account.id}`}
                            >
                              <Lock className="w-4 h-4 mr-2" /> Change Password
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => { setSelectedAccount(account); setNewLeverage(account.leverage); setLeverageOpen(true); }}
                              data-testid={`menu-leverage-${account.id}`}
                            >
                              <Scale className="w-4 h-4 mr-2" /> Change Leverage
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => { setSelectedAccount(account); setDepositAmount(""); setDepositOpen(true); }}
                              data-testid={`menu-deposit-${account.id}`}
                            >
                              <Wallet className="w-4 h-4 mr-2" /> Deposit from Wallet
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Trading Account</DialogTitle>
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
            <p className="text-xs text-muted-foreground">
              Changing leverage may affect margin requirements for your open positions. Changes take effect immediately.
            </p>
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
            <DialogTitle>Deposit to {selectedAccount?.accountNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-md bg-muted/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Transfer Method</p>
                <p className="text-sm font-medium">Wallet Transfer</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input
                type="number"
                placeholder="Enter deposit amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min="1"
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
                  data-testid={`button-deposit-preset-${v}`}
                >
                  ${v}
                </Button>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => depositMutation.mutate()}
              disabled={depositMutation.isPending || !depositAmount || parseFloat(depositAmount) <= 0}
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
