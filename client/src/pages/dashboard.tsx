import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  CreditCard,
  HelpCircle,
  Network,
  Gift,
  Star,
  ArrowUp,
  ArrowDown,
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
  LineChart,
  Line,
} from "recharts";
import { Link } from "wouter";
import type { Transaction } from "@shared/schema";

const cashFlowData = [
  { month: "Jan", commissions: 1200, deposits: 8500, withdrawals: 3200 },
  { month: "Feb", commissions: 1800, deposits: 9200, withdrawals: 4100 },
  { month: "Mar", commissions: 1500, deposits: 7800, withdrawals: 3800 },
  { month: "Apr", commissions: 2100, deposits: 10500, withdrawals: 5200 },
  { month: "May", commissions: 2400, deposits: 11200, withdrawals: 4800 },
  { month: "Jun", commissions: 2800, deposits: 12500, withdrawals: 5500 },
  { month: "Jul", commissions: 3200, deposits: 13800, withdrawals: 6100 },
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

const commissionData = [
  { month: "Jan", affiliate: 200, ib: 500, referral: 120 },
  { month: "Feb", affiliate: 350, ib: 720, referral: 180 },
  { month: "Mar", affiliate: 280, ib: 650, referral: 150 },
  { month: "Apr", affiliate: 420, ib: 880, referral: 220 },
  { month: "May", affiliate: 380, ib: 950, referral: 250 },
  { month: "Jun", affiliate: 550, ib: 1250, referral: 320 },
];

const investmentGrowthData = [
  { month: "Jan", total: 1200 },
  { month: "Feb", total: 1800 },
  { month: "Mar", total: 2500 },
  { month: "Apr", total: 3100 },
  { month: "May", total: 3800 },
  { month: "Jun", total: 4500 },
  { month: "Jul", total: 5200 },
];

function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  href,
  positive = true,
}: {
  title: string;
  value: string;
  change: string;
  changeLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  positive?: boolean;
}) {
  return (
    <Link href={href}>
      <Card className="hover-elevate cursor-pointer transition-all">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-sm text-muted-foreground">{title}</span>
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          <div className="flex items-center gap-1 mt-1">
            {positive ? (
              <ArrowUp className="w-3 h-3 text-emerald-500" />
            ) : (
              <ArrowDown className="w-3 h-3 text-red-500" />
            )}
            <span className={`text-xs font-medium ${positive ? "text-emerald-500" : "text-red-500"}`}>
              {change}
            </span>
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function QuickStatCard({
  title,
  value,
  icon: Icon,
  href,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover-elevate cursor-pointer">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-lg font-bold">{value}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EarningCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  href,
  positive = true,
}: {
  title: string;
  value: string;
  change: string;
  changeLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  positive?: boolean;
}) {
  return (
    <Link href={href}>
      <Card className="hover-elevate cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">{title}</span>
          </div>
          <div className="text-xl font-bold">{value}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className={`text-xs font-medium ${positive ? "text-emerald-500" : "text-red-500"}`}>
              {positive ? "+" : ""}{change}
            </span>
            <span className="text-xs text-muted-foreground">{changeLabel}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Dashboard() {
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-dashboard-title">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back, Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Wallet Balance"
          value={`$${(stats?.walletBalance ?? 24592.5).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          change="+12.5%"
          changeLabel="vs last month"
          icon={Wallet}
          href="/wallet"
        />
        <StatCard
          title="Total Deposits"
          value={`$${(stats?.totalDeposits ?? 12500).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          change="+8.4%"
          changeLabel="vs last month"
          icon={ArrowUpRight}
          href="/wallet/deposits"
        />
        <StatCard
          title="Total Withdrawals"
          value={`$${(stats?.totalWithdrawals ?? 8450).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          change="+5.2%"
          changeLabel="vs last month"
          icon={ArrowDownRight}
          href="/wallet/withdrawals"
          positive={false}
        />
        <StatCard
          title="Commissions"
          value={`$${(stats?.totalCommissions ?? 2121.25).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          change="+$340.00"
          changeLabel="vs last month"
          icon={DollarSign}
          href="/ib/commissions"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-base font-semibold">Cash Flow Analytics</CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Commissions</span>
              </div>
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
            <div className="h-[240px]" data-testid="chart-cashflow">
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
                  <Bar dataKey="commissions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="deposits" fill="rgb(34, 197, 94)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="withdrawals" fill="rgb(248, 113, 113)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-base font-semibold">Wallet Balance Growth</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]" data-testid="chart-balance-growth">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatCard title="Trading Accounts" value={String(stats?.tradingAccounts ?? 4)} icon={TrendingUp} href="/trading" />
        <QuickStatCard title="Prop Accounts" value="2 Active" icon={BarChart3} href="/trading" />
        <QuickStatCard title="Total Investments" value="$5,200.00" icon={CreditCard} href="/reports" />
        <QuickStatCard title="Support Tickets" value={`${stats?.openTickets ?? 1} Open`} icon={HelpCircle} href="/support" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EarningCard title="IB Earnings" value="$1,250.50" change="15%" changeLabel="vs last month" icon={Network} href="/ib" />
        <EarningCard title="Affiliate Earnings" value="$550.00" change="5%" changeLabel="vs last month" icon={Users} href="/ib" />
        <EarningCard title="Inv. Referral Earnings" value="$320.75" change="8%" changeLabel="vs last month" icon={Gift} href="/ib/referrals" />
        <EarningCard title="Loyalty Points" value="1,250 Pts" change="150" changeLabel="vs last month" icon={Star} href="/settings" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-base font-semibold">Commission Analytics</CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Affiliate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">IB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs text-muted-foreground">Referral</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]" data-testid="chart-commissions">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commissionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }} />
                  <Bar dataKey="affiliate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ib" fill="rgb(34, 197, 94)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="referral" fill="rgb(245, 158, 11)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-base font-semibold">Total Investment Growth</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]" data-testid="chart-investment-growth">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={investmentGrowthData}>
                  <defs>
                    <linearGradient id="investGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(34, 197, 94)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="rgb(34, 197, 94)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="total" stroke="rgb(34, 197, 94)" fill="url(#investGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
          <Link href="/transactions">
            <Button variant="outline" size="sm" data-testid="button-view-all-transactions">
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
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No recent transactions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
