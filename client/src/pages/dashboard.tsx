import { useQuery } from "@tanstack/react-query";
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
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-2xl p-6 md:p-8 text-white shadow-lg" data-testid="dashboard-hero">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm mb-1">
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-testid="text-dashboard-title">
              {firstName}
            </h1>
            <p className="text-white/70 text-sm mt-1">Here's your portfolio overview for today</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/wallet">
              <Button size="sm" variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-sm" data-testid="button-quick-deposit">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Quick Deposit
              </Button>
            </Link>
            <Link href="/forex/accounts">
              <Button size="sm" variant="outline" className="border-white/20 text-white bg-white/10 backdrop-blur-sm" data-testid="button-new-account">
                <Plus className="w-4 h-4 mr-2" />
                New Account
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Wallet Balance",
            value: `$${(stats?.walletBalance ?? 24592.5).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            trend: "+12.5%",
            isPositive: true,
            icon: <Wallet className="w-5 h-5" />,
            iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
            href: "/wallet",
          },
          {
            label: "Total Deposits",
            value: `$${(stats?.totalDeposits ?? 12500).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            trend: "+8.3%",
            isPositive: true,
            icon: <ArrowUpRight className="w-5 h-5" />,
            iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
            href: "/wallet",
          },
          {
            label: "Total Withdrawals",
            value: `$${(stats?.totalWithdrawals ?? 8450).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            trend: "-3.2%",
            isPositive: false,
            icon: <ArrowDownRight className="w-5 h-5" />,
            iconBg: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
            href: "/wallet",
          },
          {
            label: "Trading Accounts",
            value: stats?.tradingAccounts ?? 4,
            trend: null,
            isPositive: true,
            icon: <CandlestickChart className="w-5 h-5" />,
            iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
            href: "/forex/accounts",
          },
        ].map((card) => (
          <Link key={card.label} href={card.href}>
            <div className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer h-full p-6" data-testid={`stat-card-${card.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{card.label}</p>
                  <h3 className="text-2xl font-bold">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${card.iconBg}`}>
                  {card.icon}
                </div>
              </div>
              {card.trend && (
                <div className="mt-4 flex items-center gap-1 text-sm">
                  {card.isPositive ? (
                    <TrendingUp size={16} className="text-emerald-500" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-500" />
                  )}
                  <span className={card.isPositive ? "text-emerald-500 font-medium" : "text-red-500 font-medium"}>
                    {card.trend}
                  </span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              )}
              {!card.trend && (
                <div className="mt-4 flex items-center gap-1 text-sm">
                  <Activity size={16} className="text-emerald-500" />
                  <span className="text-muted-foreground">All accounts active</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="text-sm font-medium">Account Balance History</h3>
            <Badge variant="secondary" className="text-xs font-normal">Last 7 months</Badge>
          </div>
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
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="text-sm font-medium">Cash Flow</h3>
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
          </div>
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border shadow-sm p-6 lg:col-span-1">
          <h3 className="text-sm font-medium mb-4">Quick Actions</h3>
          <div className="space-y-1.5">
            {[
              { href: "/wallet", icon: ArrowUpRight, label: "Make a Deposit", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", testId: "button-action-deposit" },
              { href: "/wallet", icon: ArrowDownRight, label: "Request Withdrawal", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", testId: "button-action-withdraw" },
              { href: "/forex/accounts", icon: Plus, label: "Open Trading Account", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", testId: "button-action-new-account" },
              { href: "/kyc", icon: Shield, label: "Verify Identity", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", testId: "button-action-kyc" },
              { href: "/support", icon: HelpCircle, label: "Get Support", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20", testId: "button-action-support" },
            ].map((action) => (
              <Link key={action.testId} href={action.href}>
                <div className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group" data-testid={action.testId}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center shrink-0`}>
                      <action.icon className={`w-4 h-4 ${action.color}`} />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between gap-2 p-6 pb-3">
            <h3 className="text-sm font-medium">Recent Transactions</h3>
            <Link href="/transactions">
              <Button variant="ghost" size="sm" className="text-xs" data-testid="button-view-all-transactions">
                View All
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-recent-transactions">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-6 font-medium text-muted-foreground text-xs">Type</th>
                  <th className="text-left py-3 px-6 font-medium text-muted-foreground text-xs">Description</th>
                  <th className="text-left py-3 px-6 font-medium text-muted-foreground text-xs">Date</th>
                  <th className="text-left py-3 px-6 font-medium text-muted-foreground text-xs">Amount</th>
                  <th className="text-left py-3 px-6 font-medium text-muted-foreground text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {(recentTransactions || []).slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors" data-testid={`row-transaction-${tx.id}`}>
                    <td className="py-4 px-6">
                      <span className={`
                        inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                        ${tx.type === "deposit" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        tx.type === "withdrawal" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}
                      `}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-foreground">{tx.type === "deposit" ? "Wallet Deposit" : "Wallet Withdrawal"}</td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}
                    </td>
                    <td className={`py-4 px-6 font-semibold ${tx.type === "withdrawal" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {tx.type === "withdrawal" ? "-" : "+"}${Math.abs(Number(tx.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-medium ${
                          tx.status === "completed" || tx.status === "approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                          tx.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {(!recentTransactions || recentTransactions.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
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
        </div>
      </div>
    </div>
  );
}
