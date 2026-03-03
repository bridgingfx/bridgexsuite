import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Filter,
  Download,
  Search,
  ArrowUpDown,
  CreditCard,
  Repeat,
} from "lucide-react";
import { Input } from "@/components/ui/input";

type FilterTab = "all" | "deposits" | "withdrawals" | "internal";

const demoTransactions = [
  { id: 1, type: "deposit", amount: 5000, method: "Bank Transfer", status: "completed", createdAt: "2026-02-15T10:30:00Z", reference: "DEP-001" },
  { id: 2, type: "withdrawal", amount: 1200, method: "Credit Card", status: "completed", createdAt: "2026-02-14T14:20:00Z", reference: "WTH-001" },
  { id: 3, type: "deposit", amount: 3500, method: "Crypto (USDT)", status: "completed", createdAt: "2026-02-13T09:15:00Z", reference: "DEP-002" },
  { id: 4, type: "internal", amount: 800, method: "Internal Transfer", status: "completed", createdAt: "2026-02-12T16:45:00Z", reference: "INT-001" },
  { id: 5, type: "withdrawal", amount: 2000, method: "Bank Transfer", status: "pending", createdAt: "2026-02-11T11:00:00Z", reference: "WTH-002" },
  { id: 6, type: "deposit", amount: 1500, method: "E-Wallet", status: "completed", createdAt: "2026-02-10T08:30:00Z", reference: "DEP-003" },
  { id: 7, type: "deposit", amount: 2500, method: "Credit Card", status: "completed", createdAt: "2026-02-09T13:10:00Z", reference: "DEP-004" },
  { id: 8, type: "withdrawal", amount: 500, method: "Crypto (BTC)", status: "rejected", createdAt: "2026-02-08T15:20:00Z", reference: "WTH-003" },
  { id: 9, type: "internal", amount: 1000, method: "Internal Transfer", status: "completed", createdAt: "2026-02-07T10:00:00Z", reference: "INT-002" },
  { id: 10, type: "deposit", amount: 4000, method: "Bank Transfer", status: "pending", createdAt: "2026-02-06T09:45:00Z", reference: "DEP-005" },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: transactions, isLoading } = useQuery<any[]>({
    queryKey: ["/api/transactions"],
  });

  const allTxns = transactions?.length ? transactions : demoTransactions;

  const deposits = allTxns.filter(t => t.type === "deposit");
  const withdrawals = allTxns.filter(t => t.type === "withdrawal");
  const totalDeposited = deposits.filter(t => t.status === "approved" || t.status === "completed").reduce((s, t) => s + Number(t.amount), 0);
  const totalWithdrawn = withdrawals.filter(t => t.status === "approved" || t.status === "completed").reduce((s, t) => s + Number(t.amount), 0);
  const pendingCount = allTxns.filter(t => t.status === "pending").length;
  const totalTransactions = allTxns.length;

  const kpis = [
    { title: "Total Deposited", value: `$${totalDeposited.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: ArrowUpRight, iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400", trend: "+12.5%", isPositive: true },
    { title: "Total Withdrawn", value: `$${totalWithdrawn.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: ArrowDownRight, iconBg: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400", trend: "-5.2%", isPositive: false },
    { title: "Net Balance", value: `$${(totalDeposited - totalWithdrawn).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400", trend: "+8.3%", isPositive: true },
    { title: "Pending Transactions", value: pendingCount.toString(), icon: Clock, iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400", trend: `${totalTransactions} total`, isPositive: true },
  ];

  const filterTabs: { key: FilterTab; label: string; icon: typeof DollarSign }[] = [
    { key: "all", label: "All", icon: ArrowUpDown },
    { key: "deposits", label: "Deposits", icon: ArrowUpRight },
    { key: "withdrawals", label: "Withdrawals", icon: ArrowDownRight },
    { key: "internal", label: "Internal", icon: Repeat },
  ];

  const filteredTxns = allTxns.filter(t => {
    if (activeTab === "deposits" && t.type !== "deposit") return false;
    if (activeTab === "withdrawals" && t.type !== "withdrawal") return false;
    if (activeTab === "internal" && t.type !== "internal") return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.type?.toLowerCase().includes(q) ||
        t.method?.toLowerCase().includes(q) ||
        t.status?.toLowerCase().includes(q) ||
        t.reference?.toLowerCase().includes(q) ||
        String(t.amount).includes(q)
      );
    }
    return true;
  });

  function getStatusStyle(status: string) {
    switch (status) {
      case "completed":
      case "approved":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
      case "pending":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
      case "rejected":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
    }
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case "deposit":
        return <ArrowUpRight className="w-4 h-4 text-emerald-500" />;
      case "withdrawal":
        return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      case "internal":
        return <Repeat className="w-4 h-4 text-blue-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-500" />;
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-page-title">Finance</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your financial overview and transaction history</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            className="bg-emerald-600 text-white"
            onClick={() => setActiveTab("deposits")}
            data-testid="button-deposit"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Deposit
          </Button>
          <Button
            className="bg-red-600 text-white"
            onClick={() => setActiveTab("withdrawals")}
            data-testid="button-withdraw"
          >
            <ArrowDownRight className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
          <Button variant="outline" size="sm" data-testid="button-export-transactions">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="bg-white dark:bg-[#1c1c2e] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
            data-testid={`card-stat-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.title}</span>
              <div className={`p-3 rounded-lg ${kpi.iconBg}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white" data-testid={`text-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}>
              {kpi.value}
            </div>
            <div className="mt-1">
              {kpi.title === "Pending Transactions" ? (
                <span className="text-xs text-gray-500 dark:text-gray-400">{kpi.trend}</span>
              ) : (
                <span className={`text-xs font-medium ${kpi.isPositive ? "text-emerald-500" : "text-red-500"}`}>
                  {kpi.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#1c1c2e] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-transactions-title">Transaction History</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
                data-testid="input-search-transactions"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                data-testid={`button-filter-${tab.key}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredTxns.length === 0 ? (
            <div className="p-12 text-center">
              <Filter className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No transactions found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Reference</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Method</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.map((txn: any, idx: number) => (
                  <tr
                    key={txn.id || idx}
                    className="border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                    data-testid={`row-transaction-${txn.id || idx}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(txn.type)}
                        <span className="font-medium text-gray-900 dark:text-white capitalize">{txn.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {txn.reference || `TXN-${String(txn.id).padStart(3, "0")}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${txn.type === "deposit" ? "text-emerald-600 dark:text-emerald-400" : txn.type === "withdrawal" ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`}>
                        {txn.type === "deposit" ? "+" : txn.type === "withdrawal" ? "-" : ""}${Number(txn.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{txn.method || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(txn.status)}`} data-testid={`badge-status-${txn.id || idx}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(txn.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
