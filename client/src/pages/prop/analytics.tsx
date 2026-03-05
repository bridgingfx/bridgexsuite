import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  PieChart,
  Calendar,
  Clock,
  Target,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import type { PropAccount } from "@shared/schema";

const instrumentData = [
  { name: "EURUSD", value: 35, color: "#3b82f6" },
  { name: "GBPUSD", value: 25, color: "#10b981" },
  { name: "XAUUSD", value: 20, color: "#f59e0b" },
  { name: "USDJPY", value: 12, color: "#8b5cf6" },
  { name: "Other", value: 8, color: "#6b7280" },
];

const dailySummaryData = [
  { day: "Mon", profit: 320, loss: -80, net: 240 },
  { day: "Tue", profit: 180, loss: -220, net: -40 },
  { day: "Wed", profit: 450, loss: -50, net: 400 },
  { day: "Thu", profit: 280, loss: -150, net: 130 },
  { day: "Fri", profit: 510, loss: -90, net: 420 },
];

const demoTradeHistory = [
  { id: 1, symbol: "EURUSD", type: "Buy", volume: 1.0, openPrice: 1.0821, closePrice: 1.0856, profit: 350.0, openTime: "2024-01-15 09:30", closeTime: "2024-01-15 14:22", duration: "4h 52m" },
  { id: 2, symbol: "GBPUSD", type: "Sell", volume: 0.5, openPrice: 1.2680, closePrice: 1.2645, profit: 175.0, openTime: "2024-01-15 10:15", closeTime: "2024-01-15 16:45", duration: "6h 30m" },
  { id: 3, symbol: "XAUUSD", type: "Buy", volume: 0.2, openPrice: 2025.50, closePrice: 2018.30, profit: -144.0, openTime: "2024-01-14 08:00", closeTime: "2024-01-14 11:30", duration: "3h 30m" },
  { id: 4, symbol: "USDJPY", type: "Buy", volume: 2.0, openPrice: 149.250, closePrice: 149.680, profit: 576.0, openTime: "2024-01-14 13:00", closeTime: "2024-01-14 17:45", duration: "4h 45m" },
  { id: 5, symbol: "EURUSD", type: "Sell", volume: 1.5, openPrice: 1.0890, closePrice: 1.0875, profit: 225.0, openTime: "2024-01-13 09:00", closeTime: "2024-01-13 12:30", duration: "3h 30m" },
  { id: 6, symbol: "GBPUSD", type: "Buy", volume: 1.0, openPrice: 1.2710, closePrice: 1.2688, profit: -220.0, openTime: "2024-01-13 14:15", closeTime: "2024-01-13 18:00", duration: "3h 45m" },
  { id: 7, symbol: "XAUUSD", type: "Sell", volume: 0.1, openPrice: 2032.00, closePrice: 2028.50, profit: 35.0, openTime: "2024-01-12 10:00", closeTime: "2024-01-12 15:20", duration: "5h 20m" },
  { id: 8, symbol: "EURUSD", type: "Buy", volume: 0.8, openPrice: 1.0800, closePrice: 1.0835, profit: 280.0, openTime: "2024-01-12 08:30", closeTime: "2024-01-12 13:00", duration: "4h 30m" },
];

const openPositions = [
  { id: 1, symbol: "EURUSD", type: "Buy", volume: 1.0, openPrice: 1.0842, currentPrice: 1.0858, profit: 160.0, openTime: "2024-01-16 09:30" },
  { id: 2, symbol: "XAUUSD", type: "Sell", volume: 0.3, openPrice: 2035.20, currentPrice: 2031.80, profit: 102.0, openTime: "2024-01-16 10:45" },
  { id: 3, symbol: "USDJPY", type: "Buy", volume: 1.5, openPrice: 149.80, currentPrice: 149.65, profit: -150.0, openTime: "2024-01-16 11:00" },
];

const chartTooltipStyle = {
  backgroundColor: "#1e293b",
  borderColor: "#334155",
  borderRadius: "8px",
  color: "#fff",
};

const ITEMS_PER_PAGE = 5;

export default function PropAnalytics() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: propAccounts, isLoading } = useQuery<PropAccount[]>({
    queryKey: ["/api/prop/accounts"],
  });

  const activeAccount = propAccounts?.[0];

  const totalPages = Math.ceil(demoTradeHistory.length / ITEMS_PER_PAGE);
  const paginatedTrades = demoTradeHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const balance = activeAccount ? Number(activeAccount.currentBalance) : 50000;
  const profit = activeAccount ? Number(activeAccount.currentProfit) : 1277;
  const dailyDDUsed = 2.1;
  const overallDDUsed = 3.8;
  const maxDailyDD = 5;
  const maxOverallDD = 10;

  const kpis = [
    {
      label: "Total Trades",
      value: "48",
      subtext: "This month",
      icon: <BarChart3 className="w-5 h-5" />,
      iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Win Rate",
      value: "68.7%",
      subtext: "33 wins / 15 losses",
      icon: <Target className="w-5 h-5" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Net Profit",
      value: `$${profit.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      subtext: `${((profit / balance) * 100).toFixed(2)}% return`,
      icon: <DollarSign className="w-5 h-5" />,
      iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Avg Trade Duration",
      value: "4h 22m",
      subtext: "Intraday style",
      icon: <Clock className="w-5 h-5" />,
      iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-analytics-title">
            Prop Trading Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Performance metrics, trade history, and risk analysis
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" data-testid="button-download-pdf">
            <FileText className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" data-testid="button-export-csv">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
            data-testid={`stat-${kpi.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{kpi.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${kpi.iconBg}`}>
                {kpi.icon}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm">
              <Activity size={14} className="text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400">{kpi.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-trade-history-title">Trade History</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recent closed trades</p>
            </div>
            <Badge variant="secondary" data-testid="badge-total-trades">{demoTradeHistory.length} trades</Badge>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-trade-history">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Symbol</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Type</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Volume</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Open</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Close</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Profit</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Duration</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTrades.map((trade) => (
                <tr
                  key={trade.id}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  data-testid={`row-trade-${trade.id}`}
                >
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{trade.symbol}</td>
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-300">{trade.volume.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-mono text-gray-600 dark:text-gray-300">
                    {trade.openPrice.toFixed(trade.openPrice > 100 ? 2 : 4)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-600 dark:text-gray-300">
                    {trade.closePrice.toFixed(trade.closePrice > 100 ? 2 : 4)}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${trade.profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`} data-testid={`text-trade-profit-${trade.id}`}>
                    {trade.profit >= 0 ? "+" : ""}${trade.profit.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{trade.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2 flex-wrap">
          <p className="text-sm text-gray-500 dark:text-gray-400" data-testid="text-pagination-info">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              data-testid="button-next-page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-open-positions-title">Open Positions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Currently active trades</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-open-positions">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Symbol</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Type</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Volume</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Open Price</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Current Price</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">P/L</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Open Time</th>
              </tr>
            </thead>
            <tbody>
              {openPositions.map((pos) => (
                <tr
                  key={pos.id}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  data-testid={`row-position-${pos.id}`}
                >
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{pos.symbol}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="secondary"
                      className={
                        pos.type === "Buy"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }
                    >
                      {pos.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-300">{pos.volume.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-mono text-gray-600 dark:text-gray-300">
                    {pos.openPrice.toFixed(pos.openPrice > 100 ? 2 : 4)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-600 dark:text-gray-300">
                    {pos.currentPrice.toFixed(pos.currentPrice > 100 ? 2 : 4)}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${pos.profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`} data-testid={`text-position-pl-${pos.id}`}>
                    {pos.profit >= 0 ? "+" : ""}${pos.profit.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{pos.openTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-daily-summary-title">Daily Summary</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Profit and loss breakdown by day</p>
          </div>
          <div className="h-72" data-testid="chart-daily-summary">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySummaryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend />
                <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="loss" name="Loss" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-instrument-breakdown-title">Instrument Breakdown</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Trade distribution by instrument</p>
          </div>
          <div className="h-72 flex items-center" data-testid="chart-instrument-breakdown">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={instrumentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {instrumentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-risk-metrics-title">Risk Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div data-testid="metric-daily-dd">
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Drawdown Used</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{dailyDDUsed}% / {maxDailyDD}%</span>
            </div>
            <Progress value={(dailyDDUsed / maxDailyDD) * 100} className="h-3" data-testid="progress-daily-dd" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {(maxDailyDD - dailyDDUsed).toFixed(1)}% remaining today
            </p>
          </div>

          <div data-testid="metric-overall-dd">
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Drawdown Used</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{overallDDUsed}% / {maxOverallDD}%</span>
            </div>
            <Progress value={(overallDDUsed / maxOverallDD) * 100} className="h-3" data-testid="progress-overall-dd" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {(maxOverallDD - overallDDUsed).toFixed(1)}% remaining overall
            </p>
          </div>

          <div data-testid="metric-risk-per-trade">
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Risk Per Trade</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">1.2%</span>
            </div>
            <Progress value={24} className="h-3" data-testid="progress-risk-per-trade" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Recommended: Below 2% per trade
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-reports-title">Reports</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Download detailed trading reports</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="justify-start" data-testid="button-report-daily">
            <Calendar className="w-4 h-4 mr-2" />
            Daily Report
          </Button>
          <Button variant="outline" className="justify-start" data-testid="button-report-weekly">
            <Calendar className="w-4 h-4 mr-2" />
            Weekly Report
          </Button>
          <Button variant="outline" className="justify-start" data-testid="button-report-monthly">
            <Calendar className="w-4 h-4 mr-2" />
            Monthly Report
          </Button>
          <Button variant="outline" className="justify-start" data-testid="button-report-full">
            <FileText className="w-4 h-4 mr-2" />
            Full Trade Log
          </Button>
        </div>
      </div>
    </div>
  );
}
