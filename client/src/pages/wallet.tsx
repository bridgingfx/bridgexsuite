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
  const { toast } = useToast();

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
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
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
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Available Balance</span>
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <WalletIcon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">Available for trading</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Total Deposits</span>
              <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-emerald-500">${totalDeposits.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">All-time deposits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Total Withdrawals</span>
              <div className="w-8 h-8 rounded-md bg-red-400/10 flex items-center justify-center shrink-0">
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-red-400">${totalWithdrawals.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">All-time withdrawals</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-sm font-medium">Balance History</CardTitle>
          <Badge variant="secondary" className="text-xs">Last 7 months</Badge>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={walletHistory}>
                <defs>
                  <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" fill="url(#walletGrad)" strokeWidth={2} />
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
                <TabsTrigger value="deposits" data-testid="tab-deposits">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawals" data-testid="tab-withdrawals">Withdrawals</TabsTrigger>
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
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">Type</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">Amount</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">Method</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">Date</th>
            <th className="text-left py-3 px-3 font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Loading...</td></tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-16 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                    <Inbox className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No transactions found</p>
                  <p className="text-xs text-muted-foreground">Your transactions will appear here</p>
                </div>
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id} className="border-b last:border-0">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    {tx.type === "deposit" ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-400" />
                    )}
                    <span className="capitalize">{tx.type}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className={tx.type === "deposit" ? "text-emerald-500" : "text-red-400"}>
                    {tx.type === "deposit" ? "+" : "-"}${Math.abs(Number(tx.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="py-3 px-3 text-muted-foreground capitalize">{(tx.method || "—").replace(/_/g, " ")}</td>
                <td className="py-3 px-3 text-muted-foreground">
                  {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="py-3 px-3">
                  <Badge
                    variant={tx.status === "completed" ? "default" : tx.status === "pending" ? "secondary" : "destructive"}
                    className={tx.status === "completed" ? "bg-emerald-500/10 text-emerald-500" : tx.status === "pending" ? "bg-amber-500/10 text-amber-500" : ""}
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
