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
  Legend,
} from "recharts";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import type { Transaction } from "@shared/schema";

const cashFlowData = [
  { name: "Jan", deposit: 4000, withdraw: 2400, commission: 450 },
  { name: "Feb", deposit: 3000, withdraw: 1398, commission: 320 },
  { name: "Mar", deposit: 2000, withdraw: 9800, commission: 150 },
  { name: "Apr", deposit: 2780, withdraw: 3908, commission: 290 },
  { name: "May", deposit: 1890, withdraw: 4800, commission: 480 },
  { name: "Jun", deposit: 2390, withdraw: 3800, commission: 350 },
  { name: "Jul", deposit: 3490, withdraw: 4300, commission: 510 },
];

const balanceGrowthData = [
  { name: "Jan", value: 18000 },
  { name: "Feb", value: 21000 },
  { name: "Mar", value: 19500 },
  { name: "Apr", value: 24500 },
  { name: "May", value: 28000 },
  { name: "Jun", value: 32000 },
  { name: "Jul", value: 34500 },
];

const commissionData = [
  { name: "Jan", ib: 500, affiliate: 200, referral: 100 },
  { name: "Feb", ib: 650, affiliate: 250, referral: 120 },
  { name: "Mar", ib: 550, affiliate: 300, referral: 150 },
  { name: "Apr", ib: 800, affiliate: 350, referral: 180 },
  { name: "May", ib: 950, affiliate: 400, referral: 220 },
  { name: "Jun", ib: 1100, affiliate: 450, referral: 280 },
];

const investmentGrowthData = [
  { name: "Jan", value: 1000 },
  { name: "Feb", value: 1200 },
  { name: "Mar", value: 2500 },
  { name: "Apr", value: 2800 },
  { name: "May", value: 4000 },
  { name: "Jun", value: 4800 },
  { name: "Jul", value: 5200 },
];

const demoTransactions = [
  { id: "TXN-1001", type: "deposit", amount: 5000, currency: "USD", status: "completed", date: "2023-10-25", description: "Bank Transfer" },
  { id: "TXN-1002", type: "profit", amount: 125.50, currency: "USD", status: "completed", date: "2023-10-26", description: "Prop Account Payout" },
  { id: "TXN-1003", type: "withdrawal", amount: 1000, currency: "USD", status: "pending", date: "2023-10-27", description: "USDT Withdrawal" },
  { id: "TXN-1004", type: "transfer", amount: 500, currency: "USD", status: "completed", date: "2023-10-28", description: "To MT5 Account 88921" },
];

const tooltipStyle = {
  backgroundColor: "#1e293b",
  borderColor: "#334155",
  borderRadius: "8px",
  color: "#fff",
};

const tooltipItemStyle = { color: "#fff" };

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  isPositive?: boolean;
  icon: JSX.Element;
  link?: string;
}

function StatCard({ title, value, trend, isPositive = true, icon, link }: StatCardProps) {
  const content = (
    <div
      className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
      data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex justify-between items-start">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
        <div className="p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg shrink-0">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          {isPositive ? (
            <ArrowUpRight size={16} className="text-green-500" />
          ) : (
            <ArrowDownRight size={16} className="text-red-500" />
          )}
          <span className={isPositive ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
            {trend}
          </span>
          <span className="text-gray-400 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
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

  const { data: recentTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions/recent"],
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto" data-testid="dashboard-page">
      <div className="flex items-center gap-6 flex-wrap" data-testid="dashboard-header">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-dashboard-title">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, Trader.</p>
        </div>
        <div className="w-full flex-1 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800" data-testid="leaderboard-top">
          <img
            src="https://placehold.co/1200x120/2563eb/ffffff?text=Special+Offer:+Get+100%25+Deposit+Bonus+Now!"
            alt="Special Offer"
            className="w-full h-20 object-cover transition-transform hover:scale-[1.01]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stat-row-1">
        <StatCard
          title="Wallet Balance"
          value={`$${(stats?.walletBalance ?? 24592.5).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          trend="+12.5%"
          isPositive={true}
          icon={<Wallet size={20} />}
          link="/wallet"
        />
        <StatCard
          title="Wallet Deposit"
          value={`$${(stats?.totalDeposits ?? 12500).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          trend="+8.4%"
          isPositive={true}
          icon={<ArrowUpRight size={20} />}
          link="/wallet"
        />
        <StatCard
          title="Wallet Withdrawal"
          value={`$${(stats?.totalWithdrawals ?? 8450).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          trend="+5.2%"
          isPositive={false}
          icon={<ArrowDownRight size={20} />}
          link="/wallet"
        />
        <StatCard
          title="Commissions"
          value={`$${(stats?.totalCommissions ?? 2121.25).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          trend="+$340.00"
          isPositive={true}
          icon={<DollarSign size={20} />}
          link="/forex/ib-dashboard"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Cash Flow Analytics</h2>
          <div className="h-80 w-full" data-testid="chart-cashflow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                <Legend />
                <Bar dataKey="deposit" name="Deposits" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="withdraw" name="Withdrawals" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="commission" name="Commissions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Wallet Balance Growth</h2>
          <div className="h-80 w-full" data-testid="chart-balance-growth">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceGrowthData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stat-row-2">
        <StatCard
          title="Trading Accounts"
          value={`${stats?.tradingAccounts ?? 4}`}
          icon={<CandlestickChart size={20} />}
          link="/forex/accounts"
        />
        <StatCard
          title="Prop Accounts"
          value="2 Active"
          icon={<Trophy size={20} />}
          link="/prop-trading"
        />
        <StatCard
          title="Total Investments"
          value="$5,200.00"
          icon={<PiggyBank size={20} />}
          link="/investment"
        />
        <StatCard
          title="Support Tickets"
          value={`${stats?.openTickets ?? 1} Open`}
          icon={<Headphones size={20} />}
          link="/support"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stat-row-3">
        <StatCard
          title="IB Earnings"
          value="$1,250.50"
          trend="+15%"
          isPositive={true}
          icon={<Users size={20} />}
          link="/forex/ib-dashboard"
        />
        <StatCard
          title="Affiliate Earnings"
          value="$550.00"
          trend="+5%"
          isPositive={true}
          icon={<UserPlus size={20} />}
          link="/forex/ib-dashboard"
        />
        <StatCard
          title="Inv. Referral Earnings"
          value="$320.75"
          trend="+8%"
          isPositive={true}
          icon={<Gift size={20} />}
          link="/investment"
        />
        <StatCard
          title="Loyalty Points"
          value="1,250 Pts"
          trend="+150"
          isPositive={true}
          icon={<Star size={20} />}
          link="/loyalty-points"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Commission Breakdown</h2>
          <div className="h-80 w-full" data-testid="chart-commission">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commissionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                <Legend />
                <Bar dataKey="ib" name="IB Commission" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="affiliate" name="Affiliate" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="referral" name="Inv. Referral" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Total Investment Growth</h2>
          <div className="h-80 w-full" data-testid="chart-investment-growth">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={investmentGrowthData}>
                <defs>
                  <linearGradient id="colorInvGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorInvGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hidden sm:block" data-testid="leaderboard-bottom">
        <img
          src="https://placehold.co/1200x120/16a34a/ffffff?text=New+Feature:+Zero+Commission+Crypto+Trading"
          alt="Promotion"
          className="w-full h-24 md:h-32 object-cover transition-transform hover:scale-[1.01]"
        />
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden" data-testid="recent-transactions">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" data-testid="table-recent-transactions">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {(recentTransactions && recentTransactions.length > 0 ? recentTransactions.slice(0, 5) : demoTransactions).map((tx: any, i: number) => (
                <tr key={tx.id || i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors" data-testid={`row-transaction-${i}`}>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      tx.type === "deposit" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      tx.type === "withdrawal" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                      tx.type === "profit" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold ${
                    tx.type === "withdrawal" ? "text-red-500" : "text-green-500"
                  }`}>
                    {tx.type === "withdrawal" ? "-" : "+"}${Math.abs(Number(tx.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : tx.date || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      tx.status === "completed" || tx.status === "approved" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      tx.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
