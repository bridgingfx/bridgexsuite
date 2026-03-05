import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  ArrowLeft,
  DollarSign,
  Lock,
  Scale,
  Wallet,
  TrendingUp,
  Gift,
  Settings,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
} from "lucide-react";
import { useLocation } from "wouter";
import type { TradingAccount, Transaction } from "@shared/schema";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface AccountDetailData {
  account: TradingAccount;
  transactions: Transaction[];
}

const profitData = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 8000 },
  { name: "Wed", value: 12000 },
  { name: "Thu", value: 13000 },
  { name: "Fri", value: 13500 },
  { name: "Sat", value: 13200 },
  { name: "Sun", value: 13400 },
];

const volumeData = [
  { name: "Mon", lots: 2 },
  { name: "Tue", lots: 2 },
  { name: "Wed", lots: 3 },
  { name: "Thu", lots: 2 },
  { name: "Fri", lots: 5 },
];

const openPositions = [
  { symbol: "EURUSD", type: "Buy", vol: 1, open: 1.082, curr: 1.0845, profit: 250 },
  { symbol: "GBPUSD", type: "Sell", vol: 0.5, open: 1.265, curr: 1.263, profit: 100 },
  { symbol: "XAUUSD", type: "Buy", vol: 0.1, open: 2020, curr: 2015, profit: -50 },
  { symbol: "USDJPY", type: "Buy", vol: 2, open: 149.5, curr: 149.8, profit: 400 },
];

const chartTooltipStyle = {
  backgroundColor: "#1e293b",
  borderColor: "#334155",
  borderRadius: "8px",
  color: "#fff",
};

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
          <DialogDescription>Enter a new password for this trading account.</DialogDescription>
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
          <DialogDescription>Select a new leverage level for this account.</DialogDescription>
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
          <DialogDescription>Transfer funds from your wallet to this trading account.</DialogDescription>
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

function WithdrawFromAccountDialog({
  open,
  onOpenChange,
  accountId,
  accountNumber,
  availableBalance,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  accountId: string;
  accountNumber: string;
  availableBalance: number;
}) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/trading-accounts/${accountId}/withdraw`, { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts", accountId] });
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Withdrawal submitted", description: `$${Number(amount).toLocaleString()} withdrawal from ${accountNumber}` });
      onOpenChange(false);
      setAmount("");
    },
    onError: () => {
      toast({ title: "Withdrawal failed", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw from {accountNumber}</DialogTitle>
          <DialogDescription>Transfer funds from this trading account to your wallet.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 rounded-md bg-muted/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Available Balance</p>
              <p className="text-sm font-bold font-mono" data-testid="text-withdraw-available">
                ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Amount (USD)</Label>
            <Input
              type="number"
              placeholder="Enter withdrawal amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max={availableBalance.toString()}
              data-testid="input-withdraw-amount"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {["100", "500", "1000"].map((v) => (
              <Button
                key={v}
                variant="outline"
                size="sm"
                onClick={() => setAmount(v)}
                data-testid={`button-withdraw-preset-${v}`}
              >
                ${v}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount(availableBalance.toString())}
              data-testid="button-withdraw-preset-max"
            >
              Max
            </Button>
          </div>
          <Button
            className="w-full"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
            data-testid="button-submit-withdraw"
          >
            {mutation.isPending ? "Processing..." : "Withdraw Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InternalTransferDialog({
  open,
  onOpenChange,
  fromAccountId,
  fromAccountNumber,
  availableBalance,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  fromAccountId: string;
  fromAccountNumber: string;
  availableBalance: number;
}) {
  const { toast } = useToast();
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");

  const { data: accounts } = useQuery<TradingAccount[]>({
    queryKey: ["/api/trading-accounts"],
  });

  const otherAccounts = (accounts || []).filter((a) => a.id !== fromAccountId);

  const mutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/trading-accounts/internal-transfer", {
        fromAccountId,
        toAccountId,
        amount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts", fromAccountId] });
      queryClient.invalidateQueries({ queryKey: ["/api/trading-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Transfer successful", description: `$${Number(amount).toLocaleString()} transferred` });
      onOpenChange(false);
      setAmount("");
      setToAccountId("");
    },
    onError: () => {
      toast({ title: "Transfer failed", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Internal Transfer</DialogTitle>
          <DialogDescription>Transfer funds between your trading accounts.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 rounded-md bg-muted/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">From Account</p>
              <p className="text-sm font-bold font-mono">{fromAccountNumber}</p>
              <p className="text-xs text-muted-foreground">
                Available: ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Transfer To</Label>
            <Select value={toAccountId} onValueChange={setToAccountId}>
              <SelectTrigger data-testid="select-transfer-to-account">
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {otherAccounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.accountNumber} ({acc.platform}) - ${Number(acc.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Amount (USD)</Label>
            <Input
              type="number"
              placeholder="Enter transfer amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max={availableBalance.toString()}
              data-testid="input-transfer-amount"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {["100", "500", "1000"].map((v) => (
              <Button
                key={v}
                variant="outline"
                size="sm"
                onClick={() => setAmount(v)}
                data-testid={`button-transfer-preset-${v}`}
              >
                ${v}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount(availableBalance.toString())}
              data-testid="button-transfer-preset-max"
            >
              Max
            </Button>
          </div>
          <Button
            className="w-full"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !amount || !toAccountId || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
            data-testid="button-submit-transfer"
          >
            {mutation.isPending ? "Processing..." : "Transfer Now"}
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
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

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
          <Button variant="outline" className="mt-4" onClick={() => navigate("/forex/accounts")}>
            Back to Accounts
          </Button>
        </div>
      </div>
    );
  }

  const { account } = data;
  const balance = Number(account.balance);
  const equity = Number(account.equity);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4 flex-wrap">
        <Button variant="ghost" size="icon" onClick={() => navigate("/forex/accounts")} data-testid="button-back">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-account-title">
            Account #{account.accountNumber}
          </h1>
          <p className="text-sm text-gray-400">
            Platform: {account.platform} | Server: BridgeX-{account.type === "demo" ? "Demo" : "Live"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="default" onClick={() => setDepositOpen(true)} data-testid="button-deposit-account">
            <ArrowDownCircle className="w-4 h-4 mr-2" />
            Deposit
          </Button>
          <Button variant="outline" onClick={() => setWithdrawOpen(true)} data-testid="button-withdraw-account">
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
          <Button variant="outline" onClick={() => setTransferOpen(true)} data-testid="button-transfer-account">
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            Internal Transfer
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setPasswordOpen(true)} data-testid="button-settings-gear">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
          data-testid="stat-card-total-equity"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Equity</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                ${equity.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <TrendingUp size={16} className="text-emerald-500" />
            <span className="text-emerald-500 font-medium">+5.2%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">vs yesterday</span>
          </div>
        </div>

        <div
          className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
          data-testid="stat-card-total-balance"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Balance</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <TrendingUp size={16} className="text-emerald-500" />
            <span className="text-emerald-500 font-medium">+2.1%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">vs yesterday</span>
          </div>
        </div>

        <div
          className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
          data-testid="stat-card-total-credit"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Credit Avail</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">$150.00</h3>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
              <Gift className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Broker Credit</span>
          </div>
        </div>

        <div
          className="bg-white dark:bg-dark-card p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
          data-testid="stat-card-profit-today"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Profit Today</p>
              <h3 className="text-2xl font-bold text-emerald-500">+$245.50</h3>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <TrendingUp size={16} className="text-emerald-500" />
            <span className="text-emerald-500 font-medium">+12%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Daily Goal: $200</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-profit-chart-title">Profit Growth</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Weekly profit performance</p>
          </div>
          <div className="h-80" data-testid="chart-profit-growth">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="acctProfitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#acctProfitGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-volume-chart-title">Volume Traded</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Daily trading volume in lots</p>
          </div>
          <div className="h-80" data-testid="chart-volume-traded">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="lots" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-positions-title">Live Open Positions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Currently active trades</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-open-positions">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Symbol</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Type</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Volume</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Open Price</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Current Price</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Profit</th>
              </tr>
            </thead>
            <tbody>
              {openPositions.map((pos) => (
                <tr key={pos.symbol} className="border-b border-gray-50 dark:border-gray-800/50 last:border-0" data-testid={`row-position-${pos.symbol}`}>
                  <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{pos.symbol}</td>
                  <td className="py-3 px-2">
                    <Badge
                      variant="secondary"
                      className={
                        pos.type === "Buy"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }
                      data-testid={`badge-position-type-${pos.symbol}`}
                    >
                      {pos.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-300">{pos.vol.toFixed(2)}</td>
                  <td className="py-3 px-2 text-right font-mono text-gray-600 dark:text-gray-300">{pos.open.toFixed(pos.open > 100 ? 1 : 4)}</td>
                  <td className="py-3 px-2 text-right font-mono text-gray-600 dark:text-gray-300">{pos.curr.toFixed(pos.curr > 100 ? 1 : 4)}</td>
                  <td className={`py-3 px-2 text-right font-medium ${pos.profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`} data-testid={`text-position-profit-${pos.symbol}`}>
                    {pos.profit >= 0 ? "+" : ""}${Math.abs(pos.profit).toFixed(2)} USD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} accountId={account.id} />
      <ChangeLeverageDialog open={leverageOpen} onOpenChange={setLeverageOpen} accountId={account.id} currentLeverage={account.leverage} />
      <DepositToAccountDialog open={depositOpen} onOpenChange={setDepositOpen} accountId={account.id} accountNumber={account.accountNumber} />
      <WithdrawFromAccountDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} accountId={account.id} accountNumber={account.accountNumber} availableBalance={balance} />
      <InternalTransferDialog open={transferOpen} onOpenChange={setTransferOpen} fromAccountId={account.id} fromAccountNumber={account.accountNumber} availableBalance={balance} />
    </div>
  );
}
