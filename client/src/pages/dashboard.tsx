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
  BarChart3,
  CandlestickChart,
  ChevronRight,
  Activity,
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

  const firstName = user?.fullName?.split(" ")[0] || "Trader";

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="rounded-md hero-gradient dark:hero-gradient-dark p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] right-[-5%] w-48 h-48 rounded-full bg-white/5 blur-xl" />
          <div className="absolute bottom-[-10%] left-[20%] w-32 h-32 rounded-full bg-white/5 blur-lg" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm mb-1">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-testid="text-dashboard-title">
              {firstName}
            </h1>
            <p className="text-white/70 text-sm mt-1">Here's your portfolio overview for today</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/wallet">
              <Button size="sm" variant="outline" className="border-white/30 text-white" data-testid="button-quick-deposit">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Quick Deposit
              </Button>
            </Link>
            <Link href="/forex/accounts">
              <Button size="sm" variant="outline" className="border-white/20 text-white" data-testid="button-new-account">
                <Plus className="w-4 h-4 mr-2" />
                New Account
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="gradient-card-blue rounded-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Wallet Balance</span>
              <div className="w-9 h-9 rounded-md bg-blue-500/15 dark:bg-blue-400/15 flex items-center justify-center shrink-0">
                <Wallet className="w-[18px] h-[18px] text-blue-500 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">
              ${(stats?.walletBalance ?? 24592.5).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center gap-0.5 text-xs text-emerald-500 dark:text-emerald-400 font-medium">
                <ArrowUpRight className="w-3 h-3" />
                12.5%
              </div>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card-emerald rounded-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Total Deposits</span>
              <div className="w-9 h-9 rounded-md bg-emerald-500/15 dark:bg-emerald-400/15 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-[18px] h-[18px] text-emerald-500 dark:text-emerald-400" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">
              ${(stats?.totalDeposits ?? 12500).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center gap-0.5 text-xs text-emerald-500 dark:text-emerald-400 font-medium">
                <ArrowUpRight className="w-3 h-3" />
                8.3%
              </div>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card-red rounded-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Total Withdrawals</span>
              <div className="w-9 h-9 rounded-md bg-red-400/15 dark:bg-red-400/15 flex items-center justify-center shrink-0">
                <ArrowDownRight className="w-[18px] h-[18px] text-red-400" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">
              ${(stats?.totalWithdrawals ?? 8450).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center gap-0.5 text-xs text-red-400 font-medium">
                <ArrowDownRight className="w-3 h-3" />
                3.2%
              </div>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card-purple rounded-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Trading Accounts</span>
              <div className="w-9 h-9 rounded-md bg-purple-500/15 dark:bg-purple-400/15 flex items-center justify-center shrink-0">
                <CandlestickChart className="w-[18px] h-[18px] text-purple-500 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight">
              {stats?.tradingAccounts ?? 4}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Activity className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
              <span className="text-xs text-muted-foreground">All accounts active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Account Balance History</CardTitle>
            <Badge variant="secondary" className="text-xs font-normal">Last 7 months</Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[260px]" data-testid="chart-balance-growth">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceGrowthData}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
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
                  <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" fill="url(#balanceGradient)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--primary))", fill: "hsl(var(--background))" }} />
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
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">Deposits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-xs text-muted-foreground">Withdrawals</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[260px]" data-testid="chart-cashflow">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`]}
                  />
                  <Bar dataKey="deposits" fill="rgb(34, 197, 94)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="withdrawals" fill="rgb(248, 113, 113)" radius={[4, 4, 0, 0]} maxBarSize={32} />
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
          <CardContent className="space-y-1.5">
            {[
              { href: "/wallet", icon: ArrowUpRight, label: "Make a Deposit", color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/10", testId: "button-action-deposit" },
              { href: "/wallet", icon: ArrowDownRight, label: "Request Withdrawal", color: "text-red-400", bg: "bg-red-400/10", testId: "button-action-withdraw" },
              { href: "/forex/accounts", icon: Plus, label: "Open Trading Account", color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-500/10", testId: "button-action-new-account" },
              { href: "/kyc", icon: Shield, label: "Verify Identity", color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-500/10", testId: "button-action-kyc" },
              { href: "/support", icon: HelpCircle, label: "Get Support", color: "text-purple-500 dark:text-purple-400", bg: "bg-purple-500/10", testId: "button-action-support" },
            ].map((action) => (
              <Link key={action.testId} href={action.href}>
                <Button variant="ghost" className="w-full justify-between h-11 px-3 group" size="sm" data-testid={action.testId}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-md ${action.bg} flex items-center justify-center shrink-0`}>
                      <action.icon className={`w-4 h-4 ${action.color}`} />
                    </div>
                    <span className="text-sm">{action.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
            <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
            <Link href="/transactions">
              <Button variant="ghost" size="sm" className="text-xs" data-testid="button-view-all-transactions">
                View All
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-recent-transactions">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground text-xs">Type</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground text-xs">Amount</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground text-xs">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground text-xs">Status</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground text-xs">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentTransactions || []).slice(0, 5).map((tx) => (
                    <tr key={tx.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${tx.type === "deposit" ? "bg-emerald-500/10" : "bg-red-400/10"}`}>
                            {tx.type === "deposit" ? (
                              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                            )}
                          </div>
                          <span className="capitalize text-sm">{tx.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`font-medium ${tx.type === "deposit" ? "text-emerald-500 dark:text-emerald-400" : "text-red-400"}`}>
                          {tx.type === "deposit" ? "+" : "-"}${Math.abs(Number(tx.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground text-sm">
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}
                      </td>
                      <td className="py-3 px-2">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-medium ${
                            tx.status === "completed" || tx.status === "approved" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                            tx.status === "pending" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                            "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" data-testid={`button-view-tx-${tx.id}`}>
                          <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {(!recentTransactions || recentTransactions.length === 0) && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-muted-foreground/50" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">No recent transactions</p>
                            <p className="text-xs text-muted-foreground">Your activity will appear here</p>
                          </div>
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
