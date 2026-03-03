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

const openPositions = [
  { symbol: "EURUSD", type: "Buy", vol: 1, open: 1.082, curr: 1.0845, profit: 250 },
  { symbol: "GBPUSD", type: "Sell", vol: 0.5, open: 1.265, curr: 1.263, profit: 100 },
  { symbol: "XAUUSD", type: "Buy", vol: 0.1, open: 2020, curr: 2015, profit: -50 },
  { symbol: "USDJPY", type: "Buy", vol: 2, open: 149.5, curr: 149.8, profit: 400 },
];

const chartTooltipStyle = {
  backgroundColor: "#1e293b",
  borderColor: "#334155",
  borderRadius: "8px",
  color: "#fff",
};

export default function ForexDashboard() {
  const { data: stats, isLoading } = useQuery<any>({
    queryKey: ["/api/dashboard/stats"],
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
      label: "Used Margin",
      value: `$${(1240).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      trend: null,
      subtext: "Level: 1,240%",
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

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-page-title">
          Forex Trading Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Monitor your trading performance and market activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-positions-title">Live Open Positions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Currently active trades</p>
          </div>
          <Link href="/forex/accounts">
            <Badge variant="secondary" className="cursor-pointer" data-testid="link-view-all-accounts">View All Accounts</Badge>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-open-positions">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Symbol</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Type</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Volume</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Open Price</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Current Price</th>
                <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Profit</th>
              </tr>
            </thead>
            <tbody>
              {openPositions.map((pos) => (
                <tr key={pos.symbol} className="border-b border-gray-50 dark:border-gray-800/50 last:border-0" data-testid={`row-position-${pos.symbol}`}>
                  <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{pos.symbol}</td>
                  <td className="py-3 px-2">
                    <Badge
                      variant="secondary"
                      className={
                        pos.type === "Buy"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }
                      data-testid={`badge-position-type-${pos.symbol}`}
                    >
                      {pos.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-300">{pos.vol.toFixed(2)}</td>
                  <td className="py-3 px-2 text-right font-mono text-gray-600 dark:text-gray-300">{pos.open.toFixed(pos.open > 100 ? 1 : 4)}</td>
                  <td className="py-3 px-2 text-right font-mono text-gray-600 dark:text-gray-300">{pos.curr.toFixed(pos.curr > 100 ? 1 : 4)}</td>
                  <td className={`py-3 px-2 text-right font-medium ${pos.profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`} data-testid={`text-position-profit-${pos.symbol}`}>
                    {pos.profit >= 0 ? "+" : ""}${Math.abs(pos.profit).toFixed(2)}
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
