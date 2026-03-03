import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  CandlestickChart,
  Trophy,
  PiggyBank,
  Headphones,
  Users,
  UserPlus,
  Gift,
  Star,
  DollarSign,
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

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  subtext?: string;
  isPositive?: boolean;
  icon: JSX.Element;
  iconBg: string;
  href: string;
  testId: string;
}

function StatCard({ title, value, trend, subtext, isPositive = true, icon, iconBg, href, testId }: StatCardProps) {
  return (
    <Link href={href}>
      <div
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer h-full p-6"
        data-testid={testId}
      >
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{value}</h3>
          </div>
          <div className={`p-3 rounded-lg shrink-0 ${iconBg}`}>
            {icon}
          </div>
        </div>
        {(trend || subtext) && (
          <div className="mt-4 flex items-center gap-1 text-sm flex-wrap">
            {trend && (
              <>
                {isPositive ? (
                  <TrendingUp size={16} className="text-emerald-500" />
                ) : (
                  <TrendingDown size={16} className="text-red-500" />
                )}
                <span className={isPositive ? "text-emerald-500 font-medium" : "text-red-500 font-medium"}>
                  {trend}
                </span>
              </>
            )}
            {subtext && (
              <span className="text-gray-500 dark:text-gray-400 ml-1">{subtext}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

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

  const row1Cards: StatCardProps[] = [
    {
      title: "Wallet Balance",
      value: `$${(stats?.walletBalance ?? 24592.5).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      trend: "+12.5%",
      subtext: "vs last month",
      isPositive: true,
      icon: <Wallet className="w-5 h-5" />,
      iconBg: "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400",
      href: "/wallet",
      testId: "stat-card-wallet-balance",
    },
    {
      title: "Wallet Deposit",
      value: `$${(stats?.totalDeposits ?? 12500).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      trend: "+8.4%",
      subtext: "vs last month",
      isPositive: true,
      icon: <ArrowUpRight className="w-5 h-5" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
      href: "/wallet",
      testId: "stat-card-wallet-deposit",
    },
    {
      title: "Wallet Withdrawal",
      value: `$${(stats?.totalWithdrawals ?? 8450).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      trend: "+5.2%",
      subtext: "vs last month",
      isPositive: false,
      icon: <ArrowDownRight className="w-5 h-5" />,
      iconBg: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
      href: "/wallet",
      testId: "stat-card-wallet-withdrawal",
    },
    {
      title: "Commissions",
      value: `$${(stats?.totalCommissions ?? 2121.25).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      trend: "+$340.00",
      subtext: "this month",
      isPositive: true,
      icon: <DollarSign className="w-5 h-5" />,
      iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      href: "/forex/ib-dashboard",
      testId: "stat-card-commissions",
    },
  ];

  const row2Cards: StatCardProps[] = [
    {
      title: "Trading Accounts",
      value: `${stats?.tradingAccounts ?? 4}`,
      subtext: "All accounts active",
      icon: <CandlestickChart className="w-5 h-5" />,
      iconBg: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
      href: "/forex/accounts",
      testId: "stat-card-trading-accounts",
    },
    {
      title: "Prop Accounts",
      value: "2",
      subtext: "Active",
      icon: <Trophy className="w-5 h-5" />,
      iconBg: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
      href: "/prop-trading",
      testId: "stat-card-prop-accounts",
    },
    {
      title: "Total Investments",
      value: "$5,200.00",
      subtext: "Across all plans",
      icon: <PiggyBank className="w-5 h-5" />,
      iconBg: "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
      href: "/investment",
      testId: "stat-card-total-investments",
    },
    {
      title: "Support Tickets",
      value: `${stats?.openTickets ?? 1}`,
      subtext: "Open",
      icon: <Headphones className="w-5 h-5" />,
      iconBg: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
      href: "/support",
      testId: "stat-card-support-tickets",
    },
  ];

  const row3Cards: StatCardProps[] = [
    {
      title: "IB Earnings",
      value: "$1,250.50",
      trend: "+15%",
      subtext: "vs last month",
      isPositive: true,
      icon: <Users className="w-5 h-5" />,
      iconBg: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
      href: "/forex/ib-dashboard",
      testId: "stat-card-ib-earnings",
    },
    {
      title: "Affiliate Earnings",
      value: "$550.00",
      trend: "+5%",
      subtext: "vs last month",
      isPositive: true,
      icon: <UserPlus className="w-5 h-5" />,
      iconBg: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400",
      href: "/forex/ib-dashboard",
      testId: "stat-card-affiliate-earnings",
    },
    {
      title: "Inv. Referral Earnings",
      value: "$320.75",
      trend: "+8%",
      subtext: "vs last month",
      isPositive: true,
      icon: <Gift className="w-5 h-5" />,
      iconBg: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
      href: "/forex/ib-dashboard",
      testId: "stat-card-inv-referral-earnings",
    },
    {
      title: "Loyalty Points",
      value: "1,250 Pts",
      trend: "+150",
      subtext: "this month",
      isPositive: true,
      icon: <Star className="w-5 h-5" />,
      iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
      href: "/loyalty-points",
      testId: "stat-card-loyalty-points",
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto" data-testid="dashboard-page">
      <div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-dashboard-title">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Here's your portfolio overview for today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stat-row-1">
        {row1Cards.map((card) => (
          <StatCard key={card.testId} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stat-row-2">
        {row2Cards.map((card) => (
          <StatCard key={card.testId} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stat-row-3">
        {row3Cards.map((card) => (
          <StatCard key={card.testId} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Wallet Balance Growth</h3>
            <Badge variant="secondary" className="text-xs font-normal">Last 7 months</Badge>
          </div>
          <div className="h-[280px]" data-testid="chart-balance-growth">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceGrowthData}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
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
                <Area type="monotone" dataKey="balance" stroke="#0ea5e9" fill="url(#balanceGradient)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#0ea5e9", fill: "hsl(var(--background))" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cash Flow</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Deposits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Withdrawals</span>
              </div>
            </div>
          </div>
          <div className="h-[280px]" data-testid="chart-cashflow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
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
    </div>
  );
}
