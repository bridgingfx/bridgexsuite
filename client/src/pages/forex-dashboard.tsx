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
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Globe,
} from "lucide-react";
import { Link } from "wouter";

const recentTrades = [
  { id: 1, pair: "EUR/USD", type: "Buy", lots: 1.5, openPrice: 1.0856, closePrice: 1.0892, profit: 54.0, time: "2 min ago" },
  { id: 2, pair: "GBP/USD", type: "Sell", lots: 2.0, openPrice: 1.2645, closePrice: 1.2618, profit: 54.0, time: "15 min ago" },
  { id: 3, pair: "USD/JPY", type: "Buy", lots: 1.0, openPrice: 149.52, closePrice: 149.38, profit: -14.0, time: "1 hr ago" },
  { id: 4, pair: "XAU/USD", type: "Buy", lots: 0.5, openPrice: 2024.5, closePrice: 2031.8, profit: 36.5, time: "2 hrs ago" },
  { id: 5, pair: "AUD/USD", type: "Sell", lots: 3.0, openPrice: 0.6542, closePrice: 0.6528, profit: 42.0, time: "3 hrs ago" },
];

const marketData = [
  { pair: "EUR/USD", bid: 1.0892, ask: 1.0894, spread: 0.2, change: +0.15 },
  { pair: "GBP/USD", bid: 1.2618, ask: 1.2621, spread: 0.3, change: -0.08 },
  { pair: "USD/JPY", bid: 149.38, ask: 149.41, spread: 0.3, change: +0.22 },
  { pair: "XAU/USD", bid: 2031.8, ask: 2032.3, spread: 0.5, change: +0.45 },
  { pair: "AUD/USD", bid: 0.6528, ask: 0.6530, spread: 0.2, change: -0.12 },
  { pair: "USD/CAD", bid: 1.3542, ask: 1.3545, spread: 0.3, change: +0.05 },
];

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
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-recent-trades-title">Recent Trades</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your latest trading activity</p>
            </div>
            <Link href="/forex/accounts">
              <Badge variant="secondary" className="cursor-pointer" data-testid="link-view-all-trades">View All</Badge>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-recent-trades">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Pair</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Lots</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Profit</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentTrades.map((trade) => (
                  <tr key={trade.id} className="border-b border-gray-50 dark:border-gray-800/50 last:border-0" data-testid={`row-trade-${trade.id}`}>
                    <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{trade.pair}</td>
                    <td className="py-3 px-2">
                      <Badge
                        variant="secondary"
                        className={
                          trade.type === "Buy"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                        }
                        data-testid={`badge-trade-type-${trade.id}`}
                      >
                        {trade.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right text-gray-600 dark:text-gray-300">{trade.lots.toFixed(2)}</td>
                    <td className={`py-3 px-2 text-right font-medium ${trade.profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`} data-testid={`text-trade-profit-${trade.id}`}>
                      {trade.profit >= 0 ? "+" : ""}${trade.profit.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {trade.time}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-market-overview-title">Market Overview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Live forex market prices</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Globe className="w-3.5 h-3.5" />
              Live
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-market-overview">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Pair</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Bid</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Ask</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Spread</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500 dark:text-gray-400">Change</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((item) => (
                  <tr key={item.pair} className="border-b border-gray-50 dark:border-gray-800/50 last:border-0" data-testid={`row-market-${item.pair.replace('/', '-')}`}>
                    <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{item.pair}</td>
                    <td className="py-3 px-2 text-right font-mono text-gray-600 dark:text-gray-300">{item.bid.toFixed(item.bid > 100 ? 1 : 4)}</td>
                    <td className="py-3 px-2 text-right font-mono text-gray-600 dark:text-gray-300">{item.ask.toFixed(item.ask > 100 ? 1 : 4)}</td>
                    <td className="py-3 px-2 text-right text-gray-500 dark:text-gray-400">{item.spread.toFixed(1)}</td>
                    <td className="py-3 px-2 text-right">
                      <div className={`flex items-center justify-end gap-1 font-medium ${item.change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`} data-testid={`text-market-change-${item.pair.replace('/', '-')}`}>
                        {item.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
