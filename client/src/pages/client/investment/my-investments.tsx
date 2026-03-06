import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import {
  Eye,
  RefreshCw,
  ArrowDownToLine,
  History,
  Lock,
  TrendingUp,
  TrendingDown,
  Gem,
  Bitcoin,
  Banknote,
  DollarSign,
  Briefcase,
} from "lucide-react";

const demoInvestments = [
  {
    id: "inv-1",
    productName: "Gold Saver Plan",
    assetType: "Gold",
    investmentAmount: 5000,
    lockInPeriod: "12 months",
    monthlyROI: 2.5,
    currentProfit: 1250,
    status: "Active",
    startDate: "2024-06-15",
    maturityDate: "2025-06-15",
    totalValue: 6250,
  },
  {
    id: "inv-2",
    productName: "BTC Growth Plan",
    assetType: "Crypto",
    investmentAmount: 10000,
    lockInPeriod: "6 months",
    monthlyROI: 4.2,
    currentProfit: 2520,
    status: "Active",
    startDate: "2024-09-01",
    maturityDate: "2025-03-01",
    totalValue: 12520,
  },
  {
    id: "inv-3",
    productName: "USD Income Plan",
    assetType: "Currency",
    investmentAmount: 8000,
    lockInPeriod: "3 months",
    monthlyROI: 1.8,
    currentProfit: 432,
    status: "Matured",
    startDate: "2024-08-01",
    maturityDate: "2024-11-01",
    totalValue: 8432,
  },
  {
    id: "inv-4",
    productName: "Gold Premium Plan",
    assetType: "Gold",
    investmentAmount: 25000,
    lockInPeriod: "24 months",
    monthlyROI: 3.5,
    currentProfit: 8750,
    status: "Locked",
    startDate: "2024-03-10",
    maturityDate: "2026-03-10",
    totalValue: 33750,
  },
  {
    id: "inv-5",
    productName: "Crypto Index Fund",
    assetType: "Crypto",
    investmentAmount: 3000,
    lockInPeriod: "6 months",
    monthlyROI: 3.8,
    currentProfit: -420,
    status: "Active",
    startDate: "2024-11-15",
    maturityDate: "2025-05-15",
    totalValue: 2580,
  },
  {
    id: "inv-6",
    productName: "Forex Alpha Strategy",
    assetType: "Currency",
    investmentAmount: 15000,
    lockInPeriod: "12 months",
    monthlyROI: 2.8,
    currentProfit: 3360,
    status: "Active",
    startDate: "2024-04-20",
    maturityDate: "2025-04-20",
    totalValue: 18360,
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "Active":
      return "border-emerald-500 text-emerald-400";
    case "Matured":
      return "border-blue-500 text-blue-400";
    case "Locked":
      return "border-amber-500 text-amber-400";
    default:
      return "border-gray-500 text-gray-400";
  }
}

function getAssetIcon(assetType: string) {
  switch (assetType) {
    case "Gold":
      return Gem;
    case "Crypto":
      return Bitcoin;
    case "Currency":
      return Banknote;
    default:
      return DollarSign;
  }
}

function getAssetColor(assetType: string) {
  switch (assetType) {
    case "Gold":
      return "text-amber-400";
    case "Crypto":
      return "text-orange-400";
    case "Currency":
      return "text-green-400";
    default:
      return "text-gray-400";
  }
}

export default function MyInvestmentsPage() {
  const [, navigate] = useLocation();

  const totalInvested = demoInvestments.reduce((s, i) => s + i.investmentAmount, 0);
  const totalValue = demoInvestments.reduce((s, i) => s + i.totalValue, 0);
  const totalProfit = demoInvestments.reduce((s, i) => s + i.currentProfit, 0);
  const activeCount = demoInvestments.filter((i) => i.status === "Active").length;

  const cardActions = [
    { label: "View", icon: Eye, action: (_inv: typeof demoInvestments[0]) => navigate("/investment/roi") },
    { label: "Reinvest", icon: RefreshCw, action: (_inv: typeof demoInvestments[0]) => navigate("/investment/products") },
    { label: "Withdraw", icon: ArrowDownToLine, action: (_inv: typeof demoInvestments[0]) => navigate("/investment/roi") },
    { label: "History", icon: History, action: (_inv: typeof demoInvestments[0]) => navigate("/investment/history") },
    { label: "Lock-in", icon: Lock, action: (_inv: typeof demoInvestments[0]) => navigate("/investment/lock-tracker") },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-page-title">
          My Investments
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your active investment plans</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all" data-testid="stat-total-invested">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Invested</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">{demoInvestments.length} plans</div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all" data-testid="stat-total-value">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Value</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Across all investments</div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all" data-testid="stat-total-profit">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Profit</p>
              <h3 className={`text-2xl font-bold ${totalProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                {totalProfit >= 0 ? "+" : ""}${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${totalProfit >= 0 ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400"}`}>
              {totalProfit >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {totalInvested > 0 ? `${((totalProfit / totalInvested) * 100).toFixed(1)}% return` : "No returns"}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all" data-testid="stat-active-plans">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Plans</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{activeCount}</h3>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Currently generating ROI</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {demoInvestments.map((inv) => {
          const AssetIcon = getAssetIcon(inv.assetType);
          const assetColor = getAssetColor(inv.assetType);
          const profitPositive = inv.currentProfit >= 0;

          return (
            <div
              key={inv.id}
              className="bg-[#0f172a] rounded-xl shadow-sm overflow-visible"
              data-testid={`card-investment-${inv.id}`}
            >
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className={`bg-gray-800 p-2 rounded-lg ${assetColor}`}>
                      <AssetIcon className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="font-bold text-white text-base" data-testid={`text-product-name-${inv.id}`}>
                        {inv.productName}
                      </span>
                      <p className="text-gray-400 text-xs mt-0.5">{inv.assetType} Investment</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`border px-3 py-1 rounded-lg text-xs font-bold ${getStatusBadge(inv.status)}`} data-testid={`badge-status-${inv.id}`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-700 mt-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 uppercase text-xs font-medium tracking-wider">Invested</p>
                      <p className="text-white text-2xl font-bold mt-1" data-testid={`text-invested-${inv.id}`}>
                        ${inv.investmentAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase text-xs font-medium tracking-wider">Current Value</p>
                      <p className="text-emerald-400 text-2xl font-bold mt-1" data-testid={`text-value-${inv.id}`}>
                        ${inv.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase text-xs font-medium tracking-wider">Profit</p>
                      <p className={`text-base font-semibold mt-1 ${profitPositive ? "text-emerald-400" : "text-red-400"}`} data-testid={`text-profit-${inv.id}`}>
                        {profitPositive ? "+" : ""}${inv.currentProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase text-xs font-medium tracking-wider">Monthly ROI</p>
                      <p className="text-white text-base font-semibold mt-1" data-testid={`text-roi-${inv.id}`}>
                        {inv.monthlyROI}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 mt-4 pt-3">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Lock-in: {inv.lockInPeriod}</span>
                    <span>Maturity: {new Date(inv.maturityDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 px-2 py-3">
                <div className="grid grid-cols-5">
                  {cardActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => action.action(inv)}
                      className="flex flex-col items-center justify-center cursor-pointer group"
                      data-testid={`button-action-${action.label.toLowerCase()}-${inv.id}`}
                    >
                      <action.icon className="text-gray-400 w-5 h-5 group-hover:text-white transition-colors" />
                      <span className="text-gray-400 text-[10px] mt-1 group-hover:text-white transition-colors">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {demoInvestments.length === 0 && (
        <div className="bg-white dark:bg-dark-card p-12 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">
          <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-gray-400" />
          </div>
          <p className="font-medium text-gray-900 dark:text-white mb-1">No investments found</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Browse investment products to get started.</p>
        </div>
      )}
    </div>
  );
}
