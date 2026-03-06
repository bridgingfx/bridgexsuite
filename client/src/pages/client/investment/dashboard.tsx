import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  PiggyBank,
  Lock,
  Wallet,
} from "lucide-react";

const chartTooltipStyle = {
  backgroundColor: "#1e293b",
  borderColor: "#334155",
  borderRadius: "8px",
  color: "#fff",
};

const portfolioGrowthData = [
  { month: "Jan", value: 15200 },
  { month: "Feb", value: 15800 },
  { month: "Mar", value: 16100 },
  { month: "Apr", value: 15900 },
  { month: "May", value: 16800 },
  { month: "Jun", value: 17200 },
  { month: "Jul", value: 17600 },
  { month: "Aug", value: 18100 },
  { month: "Sep", value: 18400 },
  { month: "Oct", value: 18770 },
];

const monthlyRoiData = [
  { month: "Jan", roi: 320 },
  { month: "Feb", roi: 410 },
  { month: "Mar", roi: 380 },
  { month: "Apr", roi: 290 },
  { month: "May", roi: 520 },
  { month: "Jun", roi: 480 },
  { month: "Jul", roi: 550 },
  { month: "Aug", roi: 610 },
  { month: "Sep", roi: 590 },
  { month: "Oct", roi: 640 },
];

const assetAllocationData = [
  { name: "Gold", value: 35, color: "#f59e0b" },
  { name: "Crypto", value: 40, color: "#8b5cf6" },
  { name: "Forex", value: 25, color: "#3b82f6" },
];

const assetColorMap: Record<string, string> = {
  Gold: "bg-amber-500",
  Crypto: "bg-purple-500",
  Forex: "bg-blue-500",
};

const totalInvested = 17500;
const currentPortfolioValue = 18770;
const monthlyRoiEarned = 640;
const activeInvestmentPlans = 5;
const lockedCapital = 12000;
const availableProfit = 1270;

const statCards = [
  {
    label: "Total Invested",
    value: `$${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    trend: "+12.4% all time",
    isPositive: true,
    icon: <DollarSign className="w-5 h-5" />,
    iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  },
  {
    label: "Current Portfolio Value",
    value: `$${currentPortfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    trend: "+7.3% this quarter",
    isPositive: true,
    icon: <Briefcase className="w-5 h-5" />,
    iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Monthly ROI Earned",
    value: `$${monthlyRoiEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    trend: "+8.5% vs last month",
    isPositive: true,
    icon: <TrendingUp className="w-5 h-5" />,
    iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  },
  {
    label: "Active Investment Plans",
    value: String(activeInvestmentPlans),
    trend: "2 maturing soon",
    isPositive: true,
    icon: <PiggyBank className="w-5 h-5" />,
    iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  },
  {
    label: "Locked Capital",
    value: `$${lockedCapital.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    trend: "3 active lock-ins",
    isPositive: true,
    icon: <Lock className="w-5 h-5" />,
    iconBg: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  },
  {
    label: "Available Profit",
    value: `$${availableProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    trend: "Ready to withdraw",
    isPositive: true,
    icon: <Wallet className="w-5 h-5" />,
    iconBg: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
  },
];

export default function InvestmentDashboard() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-investment-dashboard-title">
            Investment Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview of your investment portfolio and performance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Card
            key={card.label}
            className="p-6"
            data-testid={`stat-card-${card.label.toLowerCase().replace(/\s+/g, "-")}`}
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
            <div className="mt-4 flex items-center gap-1 text-sm">
              <TrendingUp size={16} className="text-emerald-500" />
              <span className="font-medium text-emerald-500">{card.trend}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6" data-testid="chart-portfolio-growth">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Portfolio Growth</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={portfolioGrowthData}>
              <defs>
                <linearGradient id="dashboardPortfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [`$${value.toLocaleString()}`, "Portfolio Value"]} />
              <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} fill="url(#dashboardPortfolioGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6" data-testid="chart-monthly-roi">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Monthly ROI</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRoiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [`$${value.toLocaleString()}`, "ROI Earned"]} />
              <Bar dataKey="roi" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6" data-testid="chart-asset-allocation">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Asset Allocation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={assetAllocationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {assetAllocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(value: number) => [`${value}%`, "Allocation"]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-4">
            {assetAllocationData.map((asset) => (
              <div key={asset.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${assetColorMap[asset.name]}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{asset.name}</span>
                </div>
                <Badge variant="secondary" data-testid={`badge-allocation-${asset.name.toLowerCase()}`}>
                  {asset.value}%
                </Badge>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Portfolio</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-total-portfolio-value">
                  ${currentPortfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
