import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  ArrowLeft,
  DollarSign,
  BarChart3,
  Activity,
  Lock,
  Scale,
  Wallet,
  Calendar,
  Hash,
  Monitor,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useLocation } from "wouter";
import type { TradingAccount, Transaction } from "@shared/schema";

interface AccountDetailData {
  account: TradingAccount;
  transactions: Transaction[];
}

function ChangePasswordDialog({
  open,
  onOpenChange,
  accountId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  accountId: string;
}) {
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/trading-accounts/${accountId}/change-password`, { newPassword });
    },
    onSuccess: () => {
      toast({ title: "Password changed successfully" });
      onOpenChange(false);
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: () => {
      toast({ title: "Failed to change password", variant: "destructive" });
    },
  });

  const passwordsMatch = newPassword === confirmPassword;
  const isValid = newPassword.length >= 6 && passwordsMatch;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Trading Password</DialogTitle>
        </DialogHeader>
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
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !isValid}
            data-testid="button-submit-password"
          >
            {mutation.isPending ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChangeLeverageDialog({
  open,
  onOpenChange,
  accountId,
  currentLeverage,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  accountId: string;
  currentLeverage: string;
}) {
  const { toast } = useToast();
  const [leverage, setLeverage] = useState(currentLeverage);

  const mutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/trading-accounts/${accountId}/leverage`, { leverage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts", accountId] });
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      toast({ title: "Leverage updated successfully" });
      onOpenChange(false);
    },
    onError: () => {
      toast({ title: "Failed to update leverage", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Leverage</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Current Leverage</Label>
            <div className="text-sm text-muted-foreground font-mono">{currentLeverage}</div>
          </div>
          <div className="space-y-2">
            <Label>New Leverage</Label>
            <Select value={leverage} onValueChange={setLeverage}>
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
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || leverage === currentLeverage}
            data-testid="button-submit-leverage"
          >
            {mutation.isPending ? "Updating..." : "Update Leverage"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DepositToAccountDialog({
  open,
  onOpenChange,
  accountId,
  accountNumber,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  accountId: string;
  accountNumber: string;
}) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/trading-accounts/${accountId}/deposit`, { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts", accountId] });
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Deposit successful", description: `$${Number(amount).toLocaleString()} deposited to ${accountNumber}` });
      onOpenChange(false);
      setAmount("");
    },
    onError: () => {
      toast({ title: "Deposit failed", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit to {accountNumber}</DialogTitle>
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
                onClick={() => setAmount(v)}
                data-testid={`button-deposit-preset-${v}`}
              >
                ${v}
              </Button>
            ))}
          </div>
          <Button
            className="w-full"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !amount || parseFloat(amount) <= 0}
            data-testid="button-submit-deposit"
          >
            {mutation.isPending ? "Processing..." : "Deposit Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AccountDetail({ id }: { id: string }) {
  const [, navigate] = useLocation();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [leverageOpen, setLeverageOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);

  const { data, isLoading } = useQuery<AccountDetailData>({
    queryKey: ["/api/trading-accounts", id],
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Account not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/trading/live")}>
            Back to Accounts
          </Button>
        </div>
      </div>
    );
  }

  const { account, transactions } = data;
  const profitLoss = Number(account.equity) - Number(account.balance);
  const profitLossPercent = Number(account.balance) > 0 ? (profitLoss / Number(account.balance)) * 100 : 0;

  const deposits = transactions.filter(t => t.type === "deposit");
  const withdrawals = transactions.filter(t => t.type === "withdrawal");
  const totalDeposits = deposits.reduce((s, t) => s + Number(t.amount), 0);
  const totalWithdrawals = withdrawals.reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4 flex-wrap">
        <Button variant="ghost" size="icon" onClick={() => navigate("/trading/live")} data-testid="button-back">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight" data-testid="text-account-title">
              Account {account.accountNumber}
            </h1>
            <Badge
              variant={account.status === "active" ? "default" : "secondary"}
              className={account.status === "active" ? "bg-emerald-500/10 text-emerald-500" : ""}
            >
              {account.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {account.platform} {account.type} account
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setPasswordOpen(true)} data-testid="button-change-password">
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <Button variant="outline" onClick={() => setLeverageOpen(true)} data-testid="button-change-leverage">
            <Scale className="w-4 h-4 mr-2" />
            Change Leverage
          </Button>
          <Button onClick={() => setDepositOpen(true)} data-testid="button-deposit-account">
            <Wallet className="w-4 h-4 mr-2" />
            Deposit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Balance</span>
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight font-mono" data-testid="text-balance">
              ${Number(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Equity</span>
              <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight font-mono" data-testid="text-equity">
              ${Number(account.equity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Profit/Loss</span>
              <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${profitLoss >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                <TrendingUp className={`w-4 h-4 ${profitLoss >= 0 ? "text-emerald-500" : "text-red-500"}`} />
              </div>
            </div>
            <div className={`text-2xl font-bold tracking-tight font-mono ${profitLoss >= 0 ? "text-emerald-500" : "text-red-500"}`} data-testid="text-pnl">
              {profitLoss >= 0 ? "+" : ""}${profitLoss.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{profitLossPercent.toFixed(2)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Leverage</span>
              <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4 text-purple-500" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight" data-testid="text-leverage">
              {account.leverage}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                <Hash className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Account Number</p>
                <p className="text-sm font-mono font-medium" data-testid="text-account-number">{account.accountNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                <Monitor className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Platform</p>
                <p className="text-sm font-medium">{account.platform}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Account Type</p>
                <p className="text-sm font-medium capitalize">{account.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Currency</p>
                <p className="text-sm font-medium">{account.currency}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">
                  {account.createdAt ? new Date(account.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
                </p>
              </div>
            </div>
            <div className="border-t pt-4 mt-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">Total Deposits</span>
                <span className="text-sm font-mono font-medium text-emerald-500">
                  +${totalDeposits.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">Total Withdrawals</span>
                <span className="text-sm font-mono font-medium text-red-500">
                  -${totalWithdrawals.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Transaction History</CardTitle>
            <Badge variant="secondary" className="text-xs">{transactions.length} transactions</Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-account-transactions">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                    <th className="text-right py-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Method</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        No transactions for this account yet
                      </td>
                    </tr>
                  ) : (
                    transactions.map((txn) => (
                      <tr key={txn.id} className="border-b last:border-0" data-testid={`row-txn-${txn.id}`}>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            {txn.type === "deposit" ? (
                              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                            )}
                            <span className="capitalize">{txn.type}</span>
                          </div>
                        </td>
                        <td className={`py-3 px-3 text-right font-mono ${txn.type === "deposit" ? "text-emerald-500" : "text-red-500"}`}>
                          {txn.type === "deposit" ? "+" : "-"}${Number(txn.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-3 text-muted-foreground capitalize">{(txn.method || "—").replace("_", " ")}</td>
                        <td className="py-3 px-3">
                          <Badge
                            variant="secondary"
                            className={
                              txn.status === "approved" || txn.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : txn.status === "pending"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-red-500/10 text-red-500"
                            }
                          >
                            {txn.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground text-xs">
                          {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} accountId={account.id} />
      <ChangeLeverageDialog open={leverageOpen} onOpenChange={setLeverageOpen} accountId={account.id} currentLeverage={account.leverage} />
      <DepositToAccountDialog open={depositOpen} onOpenChange={setDepositOpen} accountId={account.id} accountNumber={account.accountNumber} />
    </div>
  );
}
