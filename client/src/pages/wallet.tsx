import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Inbox,
  TrendingUp,
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
  const [location] = useLocation();

  const defaultTab = location === "/wallet/deposits" ? "deposits" : location === "/wallet/withdrawals" ? "withdrawals" : "overview";

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const deposits = (transactions || []).filter((t) => t.type === "deposit");
  const withdrawals = (transactions || []).filter((t) => t.type === "withdrawal");
  const totalDeposits = deposits.reduce((sum, d) => sum + Number(d.amount), 0);
  const totalWithdrawals = withdrawals.reduce((sum, w) => sum + Number(w.amount), 0);
  const walletBalance = totalDeposits - totalWithdrawals;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-wallet-title">Wallet</h1>
          <p className="text-sm text-muted-foreground">Manage your funds, deposits, and withdrawals</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setDepositOpen(true)} data-testid="button-deposit">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Deposit
          </Button>
          <Button variant="outline" onClick={() => setWithdrawOpen(true)} data-testid="button-withdraw">
            <ArrowDownRight className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-card-blue rounded-md md:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Available Balance</span>
              <div className="w-10 h-10 rounded-md bg-blue-500/15 dark:bg-blue-400/15 flex items-center justify-center shrink-0">
                <WalletIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold tracking-tight">${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center gap-0.5 text-xs text-emerald-500 dark:text-emerald-400 font-medium">
                <TrendingUp className="w-3 h-3" />
                Available for trading
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-card-emerald rounded-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Total Deposits</span>
              <div className="w-10 h-10 rounded-md bg-emerald-500/15 dark:bg-emerald-400/15 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">${totalDeposits.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-2">{deposits.length} transactions</p>
          </CardContent>
        </Card>
        <Card className="gradient-card-red rounded-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Total Withdrawals</span>
              <div className="w-10 h-10 rounded-md bg-red-400/15 flex items-center justify-center shrink-0">
                <ArrowDownRight className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <div className="text-3xl font-bold tracking-tight text-red-500 dark:text-red-400">${totalWithdrawals.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-2">{withdrawals.length} transactions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-sm font-medium">Balance History</CardTitle>
          <Badge variant="secondary" className="text-xs font-normal">Last 7 months</Badge>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={walletHistory}>
                <defs>
                  <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Balance"]}
                />
                <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" fill="url(#walletGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--primary))", fill: "hsl(var(--background))" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue={defaultTab}>
            <div className="border-b px-4 pt-2">
              <TabsList>
                <TabsTrigger value="overview" data-testid="tab-overview">All Transactions</TabsTrigger>
                <TabsTrigger value="deposits" data-testid="tab-deposits">Deposits ({deposits.length})</TabsTrigger>
                <TabsTrigger value="withdrawals" data-testid="tab-withdrawals">Withdrawals ({withdrawals.length})</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-4">
              <TransactionTable transactions={transactions || []} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="deposits" className="p-4">
              <TransactionTable transactions={deposits} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="withdrawals" className="p-4">
              <TransactionTable transactions={withdrawals} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
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
          <tr className="border-b">
            <th className="text-left py-3 px-3 font-medium text-muted-foreground text-xs">Type</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground text-xs">Amount</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground text-xs">Method</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground text-xs">Date</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground text-xs">Status</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Loading...</td></tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                    <Inbox className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">No transactions found</p>
                    <p className="text-xs text-muted-foreground">Your transactions will appear here</p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${tx.type === "deposit" ? "bg-emerald-500/10" : "bg-red-400/10"}`}>
                      {tx.type === "deposit" ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                      )}
                    </div>
                    <span className="capitalize">{tx.type}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className={`font-medium ${tx.type === "deposit" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                    {tx.type === "deposit" ? "+" : "-"}${Math.abs(Number(tx.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="py-3 px-3 text-muted-foreground capitalize">{(tx.method || "-").replace(/_/g, " ")}</td>
                <td className="py-3 px-3 text-muted-foreground">
                  {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                </td>
                <td className="py-3 px-3">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-medium ${
                      tx.status === "completed" || tx.status === "approved" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                      tx.status === "pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                      tx.status === "rejected" ? "bg-red-500/10 text-red-500 dark:text-red-400" : ""
                    }`}
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
