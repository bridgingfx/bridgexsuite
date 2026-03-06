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
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  DollarSign,
  Clock,
  RefreshCw,
  Wallet,
  ArrowRight,
  ArrowDownToLine,
  CheckCircle,
} from "lucide-react";

interface RoiRecord {
  id: string;
  investmentPlan: string;
  roiPercent: number;
  amountEarned: number;
  distributionDate: string;
  status: "paid" | "pending" | "scheduled";
  investedAmount: number;
  lockMonthsRemaining: number;
}

const demoRoiData: RoiRecord[] = [
  { id: "ROI-001", investmentPlan: "Gold Saver Plan", roiPercent: 2.5, amountEarned: 125.00, distributionDate: "2025-01-15", status: "paid", investedAmount: 5000, lockMonthsRemaining: 4 },
  { id: "ROI-002", investmentPlan: "BTC Growth Plan", roiPercent: 4.2, amountEarned: 420.00, distributionDate: "2025-01-15", status: "paid", investedAmount: 10000, lockMonthsRemaining: 0 },
  { id: "ROI-003", investmentPlan: "USD Income Plan", roiPercent: 1.8, amountEarned: 90.00, distributionDate: "2025-01-15", status: "paid", investedAmount: 8000, lockMonthsRemaining: 0 },
  { id: "ROI-004", investmentPlan: "Gold Growth Plan", roiPercent: 3.5, amountEarned: 350.00, distributionDate: "2025-02-15", status: "paid", investedAmount: 10000, lockMonthsRemaining: 14 },
  { id: "ROI-005", investmentPlan: "Crypto Index Fund", roiPercent: 5.0, amountEarned: 500.00, distributionDate: "2025-02-15", status: "paid", investedAmount: 10000, lockMonthsRemaining: 2 },
  { id: "ROI-006", investmentPlan: "Multi Currency Portfolio", roiPercent: 2.2, amountEarned: 220.00, distributionDate: "2025-02-15", status: "paid", investedAmount: 10000, lockMonthsRemaining: 8 },
  { id: "ROI-007", investmentPlan: "Gold Saver Plan", roiPercent: 2.5, amountEarned: 125.00, distributionDate: "2025-03-15", status: "paid", investedAmount: 5000, lockMonthsRemaining: 3 },
  { id: "ROI-008", investmentPlan: "BTC Growth Plan", roiPercent: 4.2, amountEarned: 420.00, distributionDate: "2025-03-15", status: "pending", investedAmount: 10000, lockMonthsRemaining: 0 },
  { id: "ROI-009", investmentPlan: "Forex Alpha Strategy", roiPercent: 3.0, amountEarned: 300.00, distributionDate: "2025-04-15", status: "scheduled", investedAmount: 10000, lockMonthsRemaining: 6 },
  { id: "ROI-010", investmentPlan: "Gold Growth Plan", roiPercent: 3.5, amountEarned: 350.00, distributionDate: "2025-04-15", status: "scheduled", investedAmount: 10000, lockMonthsRemaining: 13 },
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
  const [transferOpen, setTransferOpen] = useState(false);
  const [reinvestOpen, setReinvestOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RoiRecord | null>(null);
  const [transferAmount, setTransferAmount] = useState("");

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
    },
    {
      label: "This Month's ROI",
      value: `$${thisMonthRoi.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <TrendingUp className="w-5 h-5" />,
      iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      trend: "+8.3% vs last month",
    },
    {
      label: "Pending Distribution",
      value: `$${pendingDistribution.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <Clock className="w-5 h-5" />,
      iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
      trend: "3 payouts upcoming",
    },
  ];

  function handleTransferClick(record: RoiRecord) {
    setSelectedRecord(record);
    setTransferAmount(String(record.amountEarned));
    setTransferOpen(true);
  }

  function handleTransferConfirm() {
    if (!selectedRecord) return;
    const amount = Number(transferAmount);
    if (!amount || amount <= 0 || amount > selectedRecord.amountEarned) return;
    toast({
      title: "Transfer Successful",
      description: `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} from ${selectedRecord.investmentPlan} has been transferred to your Main Wallet.`,
    });
    setTransferOpen(false);
    setTransferAmount("");
  }

  function handleReinvestClick(record: RoiRecord) {
    setSelectedRecord(record);
    setReinvestOpen(true);
  }

  function handleReinvestConfirm() {
    if (!selectedRecord) return;
    toast({
      title: "Reinvestment Successful",
      description: `$${selectedRecord.amountEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })} has been added to your ${selectedRecord.investmentPlan}. ROI will be adjusted for the remaining lock-in period.`,
    });
    setReinvestOpen(false);
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
                            onClick={() => handleTransferClick(record)}
                            data-testid={`button-transfer-${record.id}`}
                          >
                            <Wallet className="w-4 h-4 mr-1" />
                            Transfer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReinvestClick(record)}
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

      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="max-w-md bg-[#0f172a] border-gray-700 text-white" data-testid="dialog-transfer">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Wallet className="w-5 h-5 text-brand-500" />
              Transfer ROI to Wallet
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Transfer your ROI earnings to your Main Wallet.
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Investment Plan</p>
                    <p className="font-semibold text-white" data-testid="text-transfer-plan">{selectedRecord.investmentPlan}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">ROI Earned</p>
                    <p className="text-lg font-bold text-emerald-400" data-testid="text-transfer-available">
                      ${selectedRecord.amountEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
                <Label className="text-gray-300">Transfer Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="pl-7 border-brand-500 bg-gray-900 text-white"
                    data-testid="input-transfer-amount"
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
                    onClick={() => setTransferAmount(String(Math.floor(selectedRecord.amountEarned * pct / 100)))}
                    data-testid={`button-transfer-pct-${pct}`}
                  >
                    {pct}%
                  </Button>
                ))}
              </div>

              {Number(transferAmount) > selectedRecord.amountEarned && (
                <p className="text-sm text-red-400">Amount exceeds ROI earned</p>
              )}

              <Button
                className="w-full bg-brand-500 hover:bg-brand-600 text-white"
                onClick={handleTransferConfirm}
                disabled={!transferAmount || Number(transferAmount) <= 0 || Number(transferAmount) > selectedRecord.amountEarned}
                data-testid="button-confirm-transfer"
              >
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                Transfer to Main Wallet
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={reinvestOpen} onOpenChange={setReinvestOpen}>
        <DialogContent className="max-w-md bg-[#0f172a] border-gray-700 text-white" data-testid="dialog-reinvest">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <RefreshCw className="w-5 h-5 text-brand-500" />
              Reinvest ROI Earnings
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Add your ROI earnings back to the same investment plan.
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Plan Name</p>
                    <p className="font-semibold text-white" data-testid="text-reinvest-plan">{selectedRecord.investmentPlan}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">ROI Amount</p>
                    <p className="text-lg font-bold text-emerald-400" data-testid="text-reinvest-amount">
                      ${selectedRecord.amountEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-800">
                <p className="text-sm text-blue-300 mb-3">
                  Would you like to reinvest <span className="font-bold text-white">${selectedRecord.amountEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span> back into <span className="font-bold text-white">{selectedRecord.investmentPlan}</span>?
                </p>
                <div className="space-y-2 text-xs text-blue-400">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>Amount will be added to your current investment of <span className="text-white font-medium">${selectedRecord.investedAmount.toLocaleString()}</span></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>New investment total: <span className="text-white font-medium">${(selectedRecord.investedAmount + selectedRecord.amountEarned).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>ROI of <span className="text-white font-medium">{selectedRecord.roiPercent}%</span> will be adjusted for next months until the lock-in period ends</span>
                  </div>
                  {selectedRecord.lockMonthsRemaining > 0 && (
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span><span className="text-white font-medium">{selectedRecord.lockMonthsRemaining}</span> month(s) remaining in lock-in period</span>
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
