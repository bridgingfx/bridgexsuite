import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  DollarSign,
  Clock,
  ArrowRight,
  RefreshCw,
  Wallet,
} from "lucide-react";

const chartTooltipStyle = {
  backgroundColor: "#1e293b",
  borderColor: "#334155",
  borderRadius: "8px",
  color: "#fff",
};

interface RoiRecord {
  id: string;
  investmentPlan: string;
  roiPercent: number;
  amountEarned: number;
  distributionDate: string;
  status: "paid" | "pending" | "scheduled";
}

const demoRoiData: RoiRecord[] = [
  { id: "ROI-001", investmentPlan: "Gold Saver Plan", roiPercent: 2.5, amountEarned: 125.00, distributionDate: "2025-01-15", status: "paid" },
  { id: "ROI-002", investmentPlan: "BTC Growth Plan", roiPercent: 4.2, amountEarned: 420.00, distributionDate: "2025-01-15", status: "paid" },
  { id: "ROI-003", investmentPlan: "USD Income Plan", roiPercent: 1.8, amountEarned: 90.00, distributionDate: "2025-01-15", status: "paid" },
  { id: "ROI-004", investmentPlan: "Gold Growth Plan", roiPercent: 3.5, amountEarned: 350.00, distributionDate: "2025-02-15", status: "paid" },
  { id: "ROI-005", investmentPlan: "Crypto Index Fund", roiPercent: 5.0, amountEarned: 500.00, distributionDate: "2025-02-15", status: "paid" },
  { id: "ROI-006", investmentPlan: "Multi Currency Portfolio", roiPercent: 2.2, amountEarned: 220.00, distributionDate: "2025-02-15", status: "paid" },
  { id: "ROI-007", investmentPlan: "Gold Saver Plan", roiPercent: 2.5, amountEarned: 125.00, distributionDate: "2025-03-15", status: "paid" },
  { id: "ROI-008", investmentPlan: "BTC Growth Plan", roiPercent: 4.2, amountEarned: 420.00, distributionDate: "2025-03-15", status: "pending" },
  { id: "ROI-009", investmentPlan: "Forex Alpha Strategy", roiPercent: 3.0, amountEarned: 300.00, distributionDate: "2025-04-15", status: "scheduled" },
  { id: "ROI-010", investmentPlan: "Gold Growth Plan", roiPercent: 3.5, amountEarned: 350.00, distributionDate: "2025-04-15", status: "scheduled" },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
    case "pending":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
    case "scheduled":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
  }
}

export default function InvestmentRoi() {
  const { toast } = useToast();

  const totalRoiEarned = demoRoiData
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + r.amountEarned, 0);

  const thisMonthRoi = demoRoiData
    .filter((r) => r.distributionDate.startsWith("2025-03"))
    .reduce((sum, r) => sum + r.amountEarned, 0);

  const pendingDistribution = demoRoiData
    .filter((r) => r.status === "pending" || r.status === "scheduled")
    .reduce((sum, r) => sum + r.amountEarned, 0);

  const summaryCards = [
    {
      label: "Total ROI Earned",
      value: `$${totalRoiEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <DollarSign className="w-5 h-5" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
      trend: "+12.5% from last quarter",
      isPositive: true,
    },
    {
      label: "This Month's ROI",
      value: `$${thisMonthRoi.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <TrendingUp className="w-5 h-5" />,
      iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      trend: "+8.3% vs last month",
      isPositive: true,
    },
    {
      label: "Pending Distribution",
      value: `$${pendingDistribution.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <Clock className="w-5 h-5" />,
      iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
      trend: "3 payouts upcoming",
      isPositive: true,
    },
  ];

  function handleTransferToWallet(record: RoiRecord) {
    toast({
      title: "Transferred to Wallet",
      description: `$${record.amountEarned.toFixed(2)} from ${record.investmentPlan} has been transferred to your wallet.`,
    });
  }

  function handleReinvest(record: RoiRecord) {
    toast({
      title: "Reinvested Successfully",
      description: `$${record.amountEarned.toFixed(2)} from ${record.investmentPlan} has been reinvested.`,
    });
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-roi-title">
            ROI Earnings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your monthly returns and distributions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6"
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
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-roi-table-heading">
            ROI Distribution History
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monthly returns from your active investment plans
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" data-testid="table-roi-history">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Investment Plan</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">ROI %</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Amount Earned</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Distribution Date</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {demoRoiData.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                  data-testid={`row-roi-${record.id}`}
                >
                  <td className="p-4">
                    <span className="font-medium text-gray-900 dark:text-white" data-testid={`text-plan-${record.id}`}>
                      {record.investmentPlan}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold" data-testid={`text-roi-percent-${record.id}`}>
                      {record.roiPercent}%
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900 dark:text-white" data-testid={`text-amount-${record.id}`}>
                      ${record.amountEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-600 dark:text-gray-300" data-testid={`text-date-${record.id}`}>
                      {new Date(record.distributionDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge
                      className={`${getStatusBadge(record.status)} no-default-hover-elevate`}
                      data-testid={`badge-status-${record.id}`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {record.status === "paid" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTransferToWallet(record)}
                            data-testid={`button-transfer-${record.id}`}
                          >
                            <Wallet className="w-4 h-4 mr-1" />
                            Transfer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReinvest(record)}
                            data-testid={`button-reinvest-${record.id}`}
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Reinvest
                          </Button>
                        </>
                      )}
                      {record.status === "pending" && (
                        <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">Processing</span>
                      )}
                      {record.status === "scheduled" && (
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Upcoming</span>
                      )}
                    </div>
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
