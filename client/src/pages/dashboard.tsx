import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Plus,
  HelpCircle,
  Shield,
  Eye,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import type { Transaction } from "@shared/schema";

const cashFlowData = [
  { month: "Jan", deposits: 8500, withdrawals: 3200 },
  { month: "Feb", deposits: 9200, withdrawals: 4100 },
  { month: "Mar", deposits: 7800, withdrawals: 3800 },
  { month: "Apr", deposits: 10500, withdrawals: 5200 },
  { month: "May", deposits: 11200, withdrawals: 4800 },
  { month: "Jun", deposits: 12500, withdrawals: 5500 },
  { month: "Jul", deposits: 13800, withdrawals: 6100 },
];

const balanceGrowthData = [
  { month: "Jan", balance: 12000 },
  { month: "Feb", balance: 15400 },
  { month: "Mar", balance: 18200 },
  { month: "Apr", balance: 21500 },
  { month: "May", balance: 19800 },
  { month: "Jun", balance: 23100 },
  { month: "Jul", balance: 24592 },
];

export default function Dashboard() {
  const { user } = useAuth();

  const { data: recentTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions/recent"],
  });

  const { data: stats } = useQuery<{
    walletBalance: number;
    totalDeposits: number;
    totalWithdrawals: number;
    totalCommissions: number;
    tradingAccounts: number;
    openTickets: number;
    totalReferrals: number;
  }>({
    queryKey: ["/api/dashboard/stats"],
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-dashboard-title">
            Welcome back, {user?.fullName || "Trader"}
          </h1>
          <p className="text-sm text-muted-foreground">Here's your trading overview for today</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/wallet">
            <Button size="sm" data-testid="button-quick-deposit">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Quick Deposit
            </Button>
          </Link>
          <Link href="/trading">
            <Button variant="outline" size="sm" data-testid="button-new-account">
              <Plus className="w-4 h-4 mr-2" />
              New Account
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Wallet Balance</span>
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">
              ${(stats?.walletBalance ?? 24592.5).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
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
            <div className="text-2xl font-bold tracking-tight">
              ${(stats?.totalDeposits ?? 12500).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime deposits</p>
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
            <div className="text-2xl font-bold tracking-tight">
              ${(stats?.totalWithdrawals ?? 8450).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime withdrawals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Trading Accounts</span>
              <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">
              {stats?.tradingAccounts ?? 4}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active accounts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Account Balance History</CardTitle>
            <Badge variant="secondary" className="text-xs">Last 7 months</Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[260px]" data-testid="chart-balance-growth">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceGrowthData}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" fill="url(#balanceGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">Deposits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-xs text-muted-foreground">Withdrawals</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[260px]" data-testid="chart-cashflow">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="deposits" fill="rgb(34, 197, 94)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="withdrawals" fill="rgb(248, 113, 113)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/wallet">
              <Button variant="outline" className="w-full justify-start" size="sm" data-testid="button-action-deposit">
                <ArrowUpRight className="w-4 h-4 mr-2 text-emerald-500" />
                Make a Deposit
              </Button>
            </Link>
            <Link href="/wallet">
              <Button variant="outline" className="w-full justify-start" size="sm" data-testid="button-action-withdraw">
                <ArrowDownRight className="w-4 h-4 mr-2 text-red-400" />
                Request Withdrawal
              </Button>
            </Link>
            <Link href="/trading">
              <Button variant="outline" className="w-full justify-start" size="sm" data-testid="button-action-new-account">
                <Plus className="w-4 h-4 mr-2 text-blue-500" />
                Open Trading Account
              </Button>
            </Link>
            <Link href="/kyc">
              <Button variant="outline" className="w-full justify-start" size="sm" data-testid="button-action-kyc">
                <Shield className="w-4 h-4 mr-2 text-amber-500" />
                Verify Identity
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" className="w-full justify-start" size="sm" data-testid="button-action-support">
                <HelpCircle className="w-4 h-4 mr-2 text-purple-500" />
                Get Support
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
            <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
            <Link href="/transactions">
              <Button variant="ghost" size="sm" data-testid="button-view-all-transactions">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-recent-transactions">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentTransactions || []).slice(0, 5).map((tx) => (
                    <tr key={tx.id} className="border-b last:border-0">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          {tx.type === "deposit" ? (
                            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-400" />
                          )}
                          <span className="capitalize">{tx.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={tx.type === "deposit" ? "text-emerald-500" : "text-red-400"}>
                          {tx.type === "deposit" ? "+" : "-"}${Math.abs(Number(tx.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={tx.status === "completed" ? "default" : tx.status === "pending" ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Button variant="ghost" size="sm" data-testid={`button-view-tx-${tx.id}`}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {(!recentTransactions || recentTransactions.length === 0) && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Wallet className="w-8 h-8 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">No recent transactions</p>
                          <Link href="/wallet">
                            <Button variant="outline" size="sm" data-testid="button-first-deposit">
                              Make your first deposit
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
