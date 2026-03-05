import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Target,
  Monitor,
  MonitorSmartphone,
  Volume2,
  Users,
  Eye,
  ArrowRightLeft,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "wouter";
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

const profitData = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 350 },
  { name: "Wed", value: 200 },
  { name: "Thu", value: 450 },
  { name: "Fri", value: 580 },
];

const volumeData = [
  { name: "Mon", lots: 2.5 },
  { name: "Tue", lots: 4 },
  { name: "Wed", lots: 3.2 },
  { name: "Thu", lots: 5.5 },
  { name: "Fri", lots: 4.8 },
];

const demoRecentTransactions = [
  { id: "TXN-2001", type: "transfer", direction: "wallet_to_trading", amount: 2000, currency: "USD", status: "completed", date: "2025-03-04", description: "Wallet → MT5 #46468922" },
  { id: "TXN-2002", type: "transfer", direction: "trading_to_wallet", amount: 500, currency: "USD", status: "completed", date: "2025-03-03", description: "MT5 #89353096 → Wallet" },
  { id: "TXN-2003", type: "transfer", direction: "internal", amount: 1000, currency: "USD", status: "pending", date: "2025-03-02", description: "MT5 #46468922 → cTrader #29654448" },
  { id: "TXN-2004", type: "transfer", direction: "wallet_to_trading", amount: 3500, currency: "USD", status: "completed", date: "2025-03-01", description: "Wallet → MT5 #46468922" },
  { id: "TXN-2005", type: "transfer", direction: "trading_to_wallet", amount: 750, currency: "USD", status: "completed", date: "2025-02-28", description: "cTrader #29654448 → Wallet" },
];

const chartTooltipStyle = {
  backgroundColor: "#1e293b",
  borderColor: "#334155",
  borderRadius: "8px",
  color: "#fff",
};

function getDirectionLabel(direction: string) {
  switch (direction) {
    case "wallet_to_trading": return "Wallet → Trading";
    case "trading_to_wallet": return "Trading → Wallet";
    case "internal": return "Internal Transfer";
    default: return direction;
  }
}

function getDirectionColor(direction: string) {
  switch (direction) {
    case "wallet_to_trading": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "trading_to_wallet": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "internal": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

export default function ForexDashboard() {
  const { data: stats, isLoading } = useQuery<any>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentTxns } = useQuery<any[]>({
    queryKey: ["/api/transactions/recent"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Equity",
      value: `$${(stats?.totalEquity ?? 15350.2).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      trend: "+5.2%",
      isPositive: true,
      icon: <BarChart3 className="w-5 h-5" />,
      iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      href: "/forex/accounts",
    },
    {
      label: "Total Balance",
      value: `$${(stats?.totalBalance ?? 14800).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      trend: "+2.1%",
      isPositive: true,
      icon: <DollarSign className="w-5 h-5" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
      href: "/forex/accounts",
    },
    {
      label: "Trading Credits",
      value: `$${(500).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      trend: null,
      subtext: "Available bonus credits",
      isPositive: true,
      icon: <Activity className="w-5 h-5" />,
      iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      href: "/forex/accounts",
    },
    {
      label: "Profit Today",
      value: "+$245.50",
      trend: "+12%",
      subtext: "Daily Goal: $200",
      isPositive: true,
      icon: <Target className="w-5 h-5" />,
      iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
      href: "/forex/accounts",
    },
  ];

  const secondRowCards = [
    {
      label: "Live Accounts",
      value: `${stats?.liveAccounts ?? 3}`,
      icon: <Monitor className="w-5 h-5" />,
      iconBg: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
      href: "/forex/accounts/live",
    },
    {
      label: "Demo Accounts",
      value: `${stats?.demoAccounts ?? 1}`,
      icon: <MonitorSmartphone className="w-5 h-5" />,
      iconBg: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400",
      href: "/forex/accounts/demo",
    },
    {
      label: "Total Volume Traded",
      value: `${(stats?.totalVolume ?? 20.0).toLocaleString("en-US", { minimumFractionDigits: 2 })} Lots`,
      icon: <Volume2 className="w-5 h-5" />,
      iconBg: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
      href: "/forex/accounts",
    },
    {
      label: "Total IB Earnings",
      value: `$${(stats?.ibEarnings ?? 1250.5).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <Users className="w-5 h-5" />,
      iconBg: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
      href: "/forex/ib-dashboard",
    },
  ];

  const transferTxns = recentTxns && recentTxns.length > 0
    ? recentTxns
        .filter((tx: any) => tx.type === "transfer" || tx.type === "internal_transfer" || tx.method === "internal_transfer" || tx.method === "wallet_transfer")
        .slice(0, 5)
    : [];

  const displayTxns = transferTxns.length > 0 ? transferTxns : demoRecentTransactions;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-page-title">
          Forex Trading Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Monitor your trading performance and market activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stat-row-wallet">
        {kpis.map((card) => (
          <Link key={card.label} href={card.href}>
            <div
              className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
              data-testid={`stat-card-${card.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
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
                    <TrendingDown size={16} className="text-red-500" />
                  )}
                  <span className={card.isPositive ? "text-emerald-500 font-medium" : "text-red-500 font-medium"}>
                    {card.trend}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                </div>
              )}
              {!card.trend && card.subtext && (
                <div className="mt-4 flex items-center gap-1 text-sm">
                  <Activity size={16} className="text-blue-500" />
                  <span className="text-gray-500 dark:text-gray-400">{card.subtext}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stat-row-accounts">
        {secondRowCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div
              className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer h-full"
              data-testid={`stat-card-${card.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${card.iconBg}`}>
                  {card.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-profit-chart-title">Profit Growth (This Week)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Daily profit performance</p>
          </div>
          <div className="h-80" data-testid="chart-profit-growth">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#profitGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-volume-chart-title">Volume Traded (Lots)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Daily trading volume</p>
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

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden" data-testid="transaction-history">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-transaction-history-title">Transaction History</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Latest wallet & trading account transfers</p>
          </div>
          <Link href="/forex/finance">
            <span className="inline-flex items-center gap-1 text-sm text-primary font-medium cursor-pointer hover:underline" data-testid="link-view-all-transactions">
              View All <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" data-testid="table-transaction-history">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {displayTxns.map((tx: any, i: number) => {
                const direction = tx.direction || tx.method || tx.type || "transfer";
                const directionLabel = tx.direction ? getDirectionLabel(tx.direction) : (tx.method ? tx.method.replace(/_/g, " ") : getDirectionLabel(direction));
                const directionColorClass = tx.direction ? getDirectionColor(tx.direction) : getDirectionColor(direction);

                return (
                  <tr key={tx.id || i} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors" data-testid={`row-transaction-${i}`}>
                    <td className="px-6 py-4 text-sm font-mono text-gray-700 dark:text-gray-300" data-testid={`text-tx-ref-${i}`}>
                      {tx.reference || tx.id?.toString().slice(0, 12) || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${directionColorClass}`} data-testid={`badge-tx-type-${i}`}>
                        <ArrowRightLeft size={12} />
                        {directionLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300" data-testid={`text-tx-desc-${i}`}>
                      {tx.description || tx.notes || "Fund Transfer"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400" data-testid={`text-tx-date-${i}`}>
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : tx.date || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white" data-testid={`text-tx-amount-${i}`}>
                      ${Math.abs(Number(tx.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })} {tx.currency || "USD"}
                    </td>
                    <td className="px-6 py-4 text-sm" data-testid={`badge-tx-status-${i}`}>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        tx.status === "completed" || tx.status === "approved" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        tx.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                        tx.status === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {displayTxns.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No recent transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
