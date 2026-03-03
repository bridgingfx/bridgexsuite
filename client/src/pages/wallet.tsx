import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  Landmark,
  CreditCard,
  Bitcoin,
  Smartphone,
  TrendingUp,
  Shield,
  Inbox,
  Check,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Transaction } from "@shared/schema";
import { useLocation } from "wouter";

const walletHistory = [
  { month: "Jan", balance: 15000 },
  { month: "Feb", balance: 18200 },
  { month: "Mar", balance: 16800 },
  { month: "Apr", balance: 21500 },
  { month: "May", balance: 19800 },
  { month: "Jun", balance: 23100 },
  { month: "Jul", balance: 24592 },
];

const paymentMethods = [
  { id: "bank_transfer", label: "Bank Transfer", icon: Landmark, description: "1-3 business days", color: "text-sky-500 dark:text-sky-400", bg: "bg-sky-500/10 dark:bg-sky-400/10" },
  { id: "credit_card", label: "Credit Card", icon: CreditCard, description: "Instant", color: "text-violet-500 dark:text-violet-400", bg: "bg-violet-500/10 dark:bg-violet-400/10" },
  { id: "crypto", label: "Crypto", icon: Bitcoin, description: "~30 minutes", color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-500/10 dark:bg-amber-400/10" },
  { id: "e_wallet", label: "E-Wallet", icon: Smartphone, description: "Instant", color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/10 dark:bg-emerald-400/10" },
];

function TransactionDialog({
  open,
  onOpenChange,
  type,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: "deposit" | "withdrawal";
}) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank_transfer");

  const mutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/transactions", {
        type,
        amount,
        method,
        currency: "USD",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: `${type === "deposit" ? "Deposit" : "Withdrawal"} request submitted` });
      onOpenChange(false);
      setAmount("");
    },
    onError: () => {
      toast({ title: "Request failed", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{type === "deposit" ? "Make a Deposit" : "Request Withdrawal"}</DialogTitle>
          <DialogDescription>{type === "deposit" ? "Add funds to your wallet balance." : "Request a withdrawal from your wallet."}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Amount (USD)</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-testid={`input-${type}-amount`}
            />
          </div>
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger data-testid={`select-${type}-method`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
                <SelectItem value="e_wallet">E-Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {["100", "500", "1000", "5000"].map((v) => (
              <Button
                key={v}
                variant="outline"
                size="sm"
                onClick={() => setAmount(v)}
                className={amount === v ? "border-primary" : ""}
                data-testid={`button-amount-${v}`}
              >
                ${v}
              </Button>
            ))}
          </div>
          <Button
            className="w-full"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !amount}
            data-testid={`button-submit-${type}`}
          >
            {mutation.isPending ? "Processing..." : type === "deposit" ? "Deposit Now" : "Request Withdrawal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function WalletPage() {
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("bank_transfer");
  const [txFilter, setTxFilter] = useState<"all" | "deposit" | "withdrawal">("all");
  const [, setLocation] = useLocation();

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const deposits = (transactions || []).filter((t) => t.type === "deposit");
  const withdrawals = (transactions || []).filter((t) => t.type === "withdrawal");
  const totalDeposits = deposits.reduce((sum, d) => sum + Number(d.amount), 0);
  const totalWithdrawals = withdrawals.reduce((sum, w) => sum + Number(w.amount), 0);
  const walletBalance = totalDeposits - totalWithdrawals || 24592.50;
  const availableBalance = walletBalance * 0.85;
  const reservedMargin = walletBalance * 0.15;

  const filteredTransactions = txFilter === "all"
    ? (transactions || [])
    : (transactions || []).filter((t) => t.type === txFilter);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="bg-gradient-to-br from-sky-600 to-sky-800 dark:from-sky-700 dark:to-sky-900 p-6 rounded-xl text-white shadow-lg" data-testid="wallet-hero">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/15 rounded-lg">
              <WalletIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-sky-100">Total Balance</p>
              <h1 className="text-3xl font-bold tracking-tight" data-testid="text-total-balance">
                ${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/15 text-white border-0 no-default-hover-elevate no-default-active-elevate">
              <Shield className="w-3 h-3 mr-1" />
              Secured
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4" data-testid="text-available-balance">
            <p className="text-sm text-sky-100 mb-1">Available Balance</p>
            <p className="text-xl font-bold">${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4" data-testid="text-reserved-margin">
            <p className="text-sm text-sky-100 mb-1">Reserved Margin</p>
            <p className="text-xl font-bold">${reservedMargin.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button
          className="bg-emerald-600 text-white border-emerald-600"
          onClick={() => setDepositOpen(true)}
          data-testid="button-deposit"
        >
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Deposit
        </Button>
        <Button
          className="bg-red-500 text-white border-red-500"
          onClick={() => setWithdrawOpen(true)}
          data-testid="button-withdraw"
        >
          <ArrowDownRight className="w-4 h-4 mr-2" />
          Withdraw
        </Button>
        <Button
          className="bg-sky-600 text-white border-sky-600"
          onClick={() => setLocation("/trading-accounts")}
          data-testid="button-transfer"
        >
          <ArrowLeftRight className="w-4 h-4 mr-2" />
          Transfer
        </Button>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-payment-methods-title">Payment Methods</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paymentMethods.map((pm) => {
            const isSelected = selectedPayment === pm.id;
            return (
              <Card
                key={pm.id}
                className={`cursor-pointer transition-all rounded-xl ${isSelected ? "ring-2 ring-sky-500/40 border-sky-500 dark:border-sky-400" : "border-gray-100 dark:border-gray-800"}`}
                onClick={() => setSelectedPayment(pm.id)}
                data-testid={`card-payment-${pm.id}`}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${pm.bg}`}>
                    <pm.icon className={`w-5 h-5 ${pm.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{pm.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{pm.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="bg-white dark:bg-card border border-gray-100 dark:border-gray-800 shadow-sm rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Wallet Balance Growth</CardTitle>
          <Badge variant="secondary" className="text-xs font-normal">Last 7 months</Badge>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={walletHistory}>
                <defs>
                  <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Balance"]}
                />
                <Area type="monotone" dataKey="balance" stroke="#0ea5e9" fill="url(#walletGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#0ea5e9", fill: "hsl(var(--background))" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-card border border-gray-100 dark:border-gray-800 shadow-sm rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 flex-wrap">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Transaction History</CardTitle>
          <div className="flex items-center gap-1">
            {([
              { key: "all", label: "All" },
              { key: "deposit", label: `Deposits (${deposits.length})` },
              { key: "withdrawal", label: `Withdrawals (${withdrawals.length})` },
            ] as const).map((tab) => (
              <Button
                key={tab.key}
                variant={txFilter === tab.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setTxFilter(tab.key)}
                data-testid={`button-filter-${tab.key}`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <TransactionTable transactions={filteredTransactions} isLoading={isLoading} />
        </CardContent>
      </Card>

      <TransactionDialog open={depositOpen} onOpenChange={setDepositOpen} type="deposit" />
      <TransactionDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} type="withdrawal" />
    </div>
  );
}

function TransactionTable({ transactions, isLoading }: { transactions: Transaction[]; isLoading: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Type</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Amount</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Method</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Status</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={5} className="py-12 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-sky-500/10 dark:bg-sky-400/10 flex items-center justify-center">
                    <Inbox className="w-6 h-6 text-sky-500 dark:text-sky-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">No transactions found</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Your transactions will appear here</p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0" data-testid={`row-transaction-${tx.id}`}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tx.type === "deposit" ? "bg-emerald-500/10 dark:bg-emerald-400/10" : "bg-red-500/10 dark:bg-red-400/10"}`}>
                      {tx.type === "deposit" ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500 dark:text-red-400" />
                      )}
                    </div>
                    <span className="capitalize font-medium text-gray-900 dark:text-white">{tx.type}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`font-semibold ${tx.type === "deposit" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                    {tx.type === "deposit" ? "+" : "-"}${Math.abs(Number(tx.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 dark:text-gray-400 capitalize">{(tx.method || "-").replace(/_/g, " ")}</td>
                <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                  {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-medium capitalize ${
                      tx.status === "completed" || tx.status === "approved" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                      tx.status === "pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                      tx.status === "rejected" ? "bg-red-500/10 text-red-500 dark:text-red-400" : ""
                    }`}
                    data-testid={`badge-status-${tx.id}`}
                  >
                    {tx.status}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
