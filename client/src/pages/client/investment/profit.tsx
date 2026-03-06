import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const summaryStats = [
  {
    label: "Monthly ROI",
    value: "$1,245.00",
    icon: TrendingUp,
    color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Referral Commission",
    value: "$380.00",
    icon: Users,
    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  },
  {
    label: "Total Earnings",
    value: "$1,625.00",
    icon: DollarSign,
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  },
];

const distributionHistory = [
  { id: "PD-001", date: "2025-06-15", type: "Monthly ROI", plan: "Gold Growth Plan", amount: 425.00, status: "paid" as const },
  { id: "PD-002", date: "2025-06-15", type: "Monthly ROI", plan: "BTC Growth Plan", amount: 320.00, status: "paid" as const },
  { id: "PD-003", date: "2025-06-10", type: "Referral Commission", plan: "—", amount: 150.00, status: "paid" as const },
  { id: "PD-004", date: "2025-06-01", type: "Monthly ROI", plan: "USD Income Plan", amount: 180.00, status: "paid" as const },
  { id: "PD-005", date: "2025-05-15", type: "Monthly ROI", plan: "Gold Growth Plan", amount: 425.00, status: "paid" as const },
  { id: "PD-006", date: "2025-05-15", type: "Monthly ROI", plan: "BTC Growth Plan", amount: 310.00, status: "pending" as const },
  { id: "PD-007", date: "2025-05-10", type: "Referral Commission", plan: "—", amount: 230.00, status: "paid" as const },
];

const earningsBreakdown = [
  { name: "Gold ROI", value: 850, color: "#f59e0b" },
  { name: "Crypto ROI", value: 630, color: "#8b5cf6" },
  { name: "Currency ROI", value: 180, color: "#0ea5e9" },
  { name: "Referral Commission", value: 380, color: "#10b981" },
];

export default function InvestmentProfit() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto" data-testid="investment-profit-page">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-profit-title">
          Profit Distribution
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track your earnings from investments and referral commissions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryStats.map((stat) => (
          <Card key={stat.label} className="p-5" data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden" data-testid="section-distribution-history">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-bold text-gray-900 dark:text-white">Distribution History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left" data-testid="table-distribution-history">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {distributionHistory.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
                      data-testid={`row-distribution-${index}`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.plan}</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400 text-right">
                        +${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          item.status === "paid"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }>
                          {item.status === "paid" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card className="p-6" data-testid="chart-earnings-breakdown">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Earnings Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={earningsBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {earningsBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#fff" }}
                  formatter={(value: number) => [`$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, ""]}
                />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value: string) => <span className="text-xs text-gray-500 dark:text-gray-400">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}