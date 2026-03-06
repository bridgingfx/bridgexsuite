import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
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
  Wallet,
  CheckCircle,
  Calendar,
  ArrowRight,
} from "lucide-react";

const demoInvestments = [
  {
    id: "inv-1",
    productName: "Gold Saver Plan",
    assetType: "Gold",
    investmentAmount: 5000,
    lockInPeriod: "12 months",
    lockMonths: 12,
    monthlyROI: 2.5,
    currentProfit: 1250,
    status: "Active",
    startDate: "2024-06-15",
    maturityDate: "2025-06-15",
    totalValue: 6250,
    monthsCompleted: 10,
  },
  {
    id: "inv-2",
    productName: "BTC Growth Plan",
    assetType: "Crypto",
    investmentAmount: 10000,
    lockInPeriod: "6 months",
    lockMonths: 6,
    monthlyROI: 4.2,
    currentProfit: 2520,
    status: "Active",
    startDate: "2024-09-01",
    maturityDate: "2025-03-01",
    totalValue: 12520,
    monthsCompleted: 6,
  },
  {
    id: "inv-3",
    productName: "USD Income Plan",
    assetType: "Currency",
    investmentAmount: 8000,
    lockInPeriod: "3 months",
    lockMonths: 3,
    monthlyROI: 1.8,
    currentProfit: 432,
    status: "Matured",
    startDate: "2024-08-01",
    maturityDate: "2024-11-01",
    totalValue: 8432,
    monthsCompleted: 3,
  },
  {
    id: "inv-4",
    productName: "Gold Premium Plan",
    assetType: "Gold",
    investmentAmount: 25000,
    lockInPeriod: "24 months",
    lockMonths: 24,
    monthlyROI: 3.5,
    currentProfit: 8750,
    status: "Locked",
    startDate: "2024-03-10",
    maturityDate: "2026-03-10",
    totalValue: 33750,
    monthsCompleted: 10,
  },
  {
    id: "inv-5",
    productName: "Crypto Index Fund",
    assetType: "Crypto",
    investmentAmount: 3000,
    lockInPeriod: "6 months",
    lockMonths: 6,
    monthlyROI: 3.8,
    currentProfit: -420,
    status: "Active",
    startDate: "2024-11-15",
    maturityDate: "2025-05-15",
    totalValue: 2580,
    monthsCompleted: 4,
  },
  {
    id: "inv-6",
    productName: "Forex Alpha Strategy",
    assetType: "Currency",
    investmentAmount: 15000,
    lockInPeriod: "12 months",
    lockMonths: 12,
    monthlyROI: 2.8,
    currentProfit: 3360,
    status: "Active",
    startDate: "2024-04-20",
    maturityDate: "2025-04-20",
    totalValue: 18360,
    monthsCompleted: 11,
  },
];

type Investment = typeof demoInvestments[0];

function generateMonthlyHistory(inv: Investment) {
  const start = new Date(inv.startDate);
  const rows = [];
  for (let m = 0; m < inv.monthsCompleted; m++) {
    const monthDate = new Date(start);
    monthDate.setMonth(monthDate.getMonth() + m + 1);
    const roiAmount = (inv.investmentAmount * inv.monthlyROI) / 100;
    const isReinvested = m % 3 === 1;
    rows.push({
      month: m + 1,
      date: monthDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      roiAmount,
      action: isReinvested ? "Reinvested" : "Transferred to Wallet",
    });
  }
  return rows;
}

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
  const { toast } = useToast();

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [reinvestOpen, setReinvestOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const totalInvested = demoInvestments.reduce((s, i) => s + i.investmentAmount, 0);
  const totalValue = demoInvestments.reduce((s, i) => s + i.totalValue, 0);
  const totalProfit = demoInvestments.reduce((s, i) => s + i.currentProfit, 0);
  const activeCount = demoInvestments.filter((i) => i.status === "Active").length;

  function handleWithdrawClick(inv: Investment) {
    if (inv.status === "Locked") {
      toast({
        title: "Withdrawal Not Available",
        description: "This investment is still within its lock-in period.",
        variant: "destructive",
      });
      return;
    }
    setSelectedInvestment(inv);
    setWithdrawAmount("");
    setWithdrawOpen(true);
  }

  function handleHistoryClick(inv: Investment) {
    setSelectedInvestment(inv);
    setHistoryOpen(true);
  }

  function handleWithdrawConfirm() {
    if (!selectedInvestment) return;
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) return;
    if (amount > Math.max(0, selectedInvestment.currentProfit)) {
      toast({
        title: "Insufficient Profit",
        description: "Withdrawal amount cannot exceed available profit.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Withdrawal Successful",
      description: `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} from ${selectedInvestment.productName} has been transferred to your Main Wallet.`,
    });
    setWithdrawOpen(false);
    setWithdrawAmount("");
  }

  function handleReinvestClick(inv: Investment) {
    if (inv.currentProfit <= 0) {
      toast({
        title: "No Profit to Reinvest",
        description: "This investment has no available profit to reinvest.",
        variant: "destructive",
      });
      return;
    }
    setSelectedInvestment(inv);
    setReinvestOpen(true);
  }

  function handleReinvestConfirm() {
    if (!selectedInvestment) return;
    const profit = Math.max(0, selectedInvestment.currentProfit);
    toast({
      title: "Reinvestment Successful",
      description: `$${profit.toLocaleString("en-US", { minimumFractionDigits: 2 })} has been added to your ${selectedInvestment.productName}. ROI will be adjusted for the remaining lock-in period.`,
    });
    setReinvestOpen(false);
  }

  const cardActions = [
    { label: "View", icon: Eye, action: (inv: Investment) => navigate("/investment/roi") },
    { label: "Reinvest", icon: RefreshCw, action: (inv: Investment) => handleReinvestClick(inv) },
    { label: "Withdraw", icon: ArrowDownToLine, action: (inv: Investment) => handleWithdrawClick(inv) },
    { label: "History", icon: History, action: (inv: Investment) => handleHistoryClick(inv) },
    { label: "Lock-in", icon: Lock, action: (inv: Investment) => navigate("/investment/lock-tracker") },
  ];

  const availableProfit = selectedInvestment ? Math.max(0, selectedInvestment.currentProfit) : 0;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-page-title">
          My Investments
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your active investment plans</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="max-w-md bg-[#0f172a] border-gray-700 text-white" data-testid="dialog-withdraw">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Wallet className="w-5 h-5 text-brand-500" />
              Withdraw Profit to Wallet
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Transfer investment profits to your Main Wallet.
            </DialogDescription>
          </DialogHeader>

          {selectedInvestment && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Investment Plan</p>
                    <p className="font-semibold text-white" data-testid="text-withdraw-plan">{selectedInvestment.productName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Available Profit</p>
                    <p className="text-lg font-bold text-emerald-400" data-testid="text-withdraw-available">
                      ${availableProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-900/30 text-blue-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Main Wallet</p>
                    <p className="text-xs text-gray-400">Destination wallet</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Withdrawal Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="pl-7 border-brand-500 bg-gray-900 text-white"
                    data-testid="input-withdraw-amount"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((pct) => (
                  <Button
                    key={pct}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => setWithdrawAmount(String(Math.floor(availableProfit * pct / 100)))}
                    data-testid={`button-withdraw-pct-${pct}`}
                  >
                    {pct}%
                  </Button>
                ))}
              </div>

              {Number(withdrawAmount) > availableProfit && (
                <p className="text-sm text-red-400">Amount exceeds available profit</p>
              )}

              <Button
                className="w-full bg-brand-500 hover:bg-brand-600 text-white"
                onClick={handleWithdrawConfirm}
                disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > availableProfit}
                data-testid="button-confirm-withdraw"
              >
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                Withdraw to Main Wallet
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-lg bg-[#0f172a] border-gray-700 text-white" data-testid="dialog-history">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <History className="w-5 h-5 text-brand-500" />
              Investment History
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Monthly ROI distribution details for this investment.
            </DialogDescription>
          </DialogHeader>

          {selectedInvestment && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Plan Name</p>
                    <p className="font-semibold text-white" data-testid="text-history-plan">{selectedInvestment.productName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Investment Amount</p>
                    <p className="font-semibold text-white">${selectedInvestment.investmentAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> Start Date</p>
                    <p className="font-semibold text-white">{new Date(selectedInvestment.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Months</p>
                    <p className="font-semibold text-white">{selectedInvestment.lockMonths} months</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Months Completed</p>
                    <p className="font-semibold text-emerald-400">{selectedInvestment.monthsCompleted} of {selectedInvestment.lockMonths}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Monthly ROI</p>
                    <p className="font-semibold text-white">{selectedInvestment.monthlyROI}%</p>
                  </div>
                </div>
              </div>

              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm" data-testid="table-history">
                  <thead>
                    <tr className="border-b border-gray-700 text-left">
                      <th className="p-2 text-xs text-gray-400 font-medium">Month</th>
                      <th className="p-2 text-xs text-gray-400 font-medium">Date</th>
                      <th className="p-2 text-xs text-gray-400 font-medium">ROI Earned</th>
                      <th className="p-2 text-xs text-gray-400 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generateMonthlyHistory(selectedInvestment).map((row) => (
                      <tr key={row.month} className="border-b border-gray-800/50 last:border-0" data-testid={`row-history-${row.month}`}>
                        <td className="p-2 text-gray-300">#{row.month}</td>
                        <td className="p-2 text-gray-300">{row.date}</td>
                        <td className="p-2 text-emerald-400 font-medium">${row.roiAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                        <td className="p-2">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${
                            row.action === "Reinvested"
                              ? "bg-blue-900/30 text-blue-400"
                              : "bg-emerald-900/30 text-emerald-400"
                          }`}>
                            {row.action === "Reinvested" ? <RefreshCw className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                            {row.action}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedInvestment.monthsCompleted < selectedInvestment.lockMonths && (
                <div className="p-2 rounded-lg bg-amber-900/20 border border-amber-800 text-center">
                  <p className="text-xs text-amber-400">
                    {selectedInvestment.lockMonths - selectedInvestment.monthsCompleted} month(s) remaining until maturity
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={reinvestOpen} onOpenChange={setReinvestOpen}>
        <DialogContent className="max-w-md bg-[#0f172a] border-gray-700 text-white" data-testid="dialog-reinvest">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <RefreshCw className="w-5 h-5 text-brand-500" />
              Reinvest Profit
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Add your profit back to the same investment plan.
            </DialogDescription>
          </DialogHeader>

          {selectedInvestment && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Plan Name</p>
                    <p className="font-semibold text-white" data-testid="text-reinvest-plan">{selectedInvestment.productName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Profit Amount</p>
                    <p className="text-lg font-bold text-emerald-400" data-testid="text-reinvest-amount">
                      ${Math.max(0, selectedInvestment.currentProfit).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-800">
                <p className="text-sm text-blue-300 mb-3">
                  Would you like to reinvest <span className="font-bold text-white">${Math.max(0, selectedInvestment.currentProfit).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span> back into <span className="font-bold text-white">{selectedInvestment.productName}</span>?
                </p>
                <div className="space-y-2 text-xs text-blue-400">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>Amount will be added to your current investment of <span className="text-white font-medium">${selectedInvestment.investmentAmount.toLocaleString()}</span></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>New investment total: <span className="text-white font-medium">${(selectedInvestment.investmentAmount + Math.max(0, selectedInvestment.currentProfit)).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>ROI of <span className="text-white font-medium">{selectedInvestment.monthlyROI}%</span> will be adjusted for next months until the lock-in period ends</span>
                  </div>
                  {selectedInvestment.lockMonths - selectedInvestment.monthsCompleted > 0 && (
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span><span className="text-white font-medium">{selectedInvestment.lockMonths - selectedInvestment.monthsCompleted}</span> month(s) remaining in lock-in period</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                  onClick={() => setReinvestOpen(false)}
                  data-testid="button-reinvest-cancel"
                >
                  No, Cancel
                </Button>
                <Button
                  className="flex-1 bg-brand-500 hover:bg-brand-600 text-white"
                  onClick={handleReinvestConfirm}
                  data-testid="button-reinvest-confirm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Yes, Reinvest
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
