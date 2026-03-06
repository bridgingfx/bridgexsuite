import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  History,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";

type HistoryType = "Investment Started" | "ROI Received" | "Withdrawal" | "Completed";
type HistoryStatus = "Active" | "Completed" | "Cancelled" | "Pending";

interface HistoryEntry {
  id: string;
  date: string;
  type: HistoryType;
  planName: string;
  amount: number;
  status: HistoryStatus;
}

const demoHistoryData: HistoryEntry[] = [
  { id: "h-1", date: "2025-01-15", type: "Investment Started", planName: "Gold Saver Plan", amount: 5000, status: "Active" },
  { id: "h-2", date: "2025-01-20", type: "Investment Started", planName: "BTC Growth Plan", amount: 10000, status: "Active" },
  { id: "h-3", date: "2025-02-01", type: "ROI Received", planName: "Gold Saver Plan", amount: 125, status: "Completed" },
  { id: "h-4", date: "2025-02-05", type: "Investment Started", planName: "USD Income Plan", amount: 3000, status: "Active" },
  { id: "h-5", date: "2025-02-15", type: "ROI Received", planName: "BTC Growth Plan", amount: 450, status: "Completed" },
  { id: "h-6", date: "2025-03-01", type: "ROI Received", planName: "Gold Saver Plan", amount: 130, status: "Completed" },
  { id: "h-7", date: "2025-03-05", type: "Withdrawal", planName: "Forex Alpha Strategy", amount: 2500, status: "Completed" },
  { id: "h-8", date: "2025-03-10", type: "Completed", planName: "Stablecoin Yield Plan", amount: 8000, status: "Completed" },
  { id: "h-9", date: "2025-03-12", type: "Investment Started", planName: "Crypto Index Fund", amount: 7500, status: "Active" },
  { id: "h-10", date: "2025-03-15", type: "ROI Received", planName: "USD Income Plan", amount: 90, status: "Pending" },
  { id: "h-11", date: "2025-03-18", type: "Withdrawal", planName: "Gold Growth Plan", amount: 1500, status: "Cancelled" },
  { id: "h-12", date: "2025-03-20", type: "ROI Received", planName: "BTC Growth Plan", amount: 480, status: "Completed" },
  { id: "h-13", date: "2025-03-22", type: "Investment Started", planName: "Multi Currency Portfolio", amount: 12000, status: "Active" },
  { id: "h-14", date: "2025-03-25", type: "Completed", planName: "Gold Premium Plan", amount: 15000, status: "Completed" },
];

const filterTabs = ["All", "Active", "Completed", "Cancelled"] as const;
type FilterTab = (typeof filterTabs)[number];

function getTypeIcon(type: HistoryType) {
  switch (type) {
    case "Investment Started":
      return <ArrowDownCircle className="w-4 h-4 text-blue-500" />;
    case "ROI Received":
      return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    case "Withdrawal":
      return <ArrowUpCircle className="w-4 h-4 text-amber-500" />;
    case "Completed":
      return <CheckCircle2 className="w-4 h-4 text-purple-500" />;
  }
}

function getTypeBadgeClass(type: HistoryType) {
  switch (type) {
    case "Investment Started":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    case "ROI Received":
      return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
    case "Withdrawal":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
    case "Completed":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
  }
}

function getStatusBadgeClass(status: HistoryStatus) {
  switch (status) {
    case "Active":
      return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
    case "Completed":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    case "Cancelled":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    case "Pending":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
  }
}

export default function InvestmentHistoryPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const filteredData = demoHistoryData.filter((entry) => {
    if (activeTab === "All") return true;
    return entry.status === activeTab;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-history-title">
            Investment History
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Complete record of all your investment activities
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        {filterTabs.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab)}
            data-testid={`button-filter-${tab.toLowerCase()}`}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan Name</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p data-testid="text-no-results">No history records found for this filter.</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                    data-testid={`row-history-${entry.id}`}
                  >
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300" data-testid={`text-date-${entry.id}`}>
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4" data-testid={`text-type-${entry.id}`}>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(entry.type)}
                        <Badge variant="secondary" className={`text-xs ${getTypeBadgeClass(entry.type)}`}>
                          {entry.type}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-white" data-testid={`text-plan-${entry.id}`}>
                      {entry.planName}
                    </td>
                    <td className="p-4 text-sm font-mono text-gray-900 dark:text-white" data-testid={`text-amount-${entry.id}`}>
                      ${entry.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4" data-testid={`badge-status-${entry.id}`}>
                      <Badge variant="secondary" className={`text-xs ${getStatusBadgeClass(entry.status)}`}>
                        {entry.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 text-center" data-testid="text-results-count">
        Showing {filteredData.length} of {demoHistoryData.length} records
      </div>
    </div>
  );
}
