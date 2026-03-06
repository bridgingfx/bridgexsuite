import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  ArrowLeftRight,
  Gift,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

const walletBalance = 4850.00;

const transactionHistory = [
  { id: "TXN-001", date: "2025-06-15", type: "ROI Credit", description: "Gold Growth Plan - Monthly ROI", amount: 425.00, status: "completed" as const },
  { id: "TXN-002", date: "2025-06-15", type: "ROI Credit", description: "BTC Growth Plan - Monthly ROI", amount: 320.00, status: "completed" as const },
  { id: "TXN-003", date: "2025-06-12", type: "Referral Commission", description: "Referral bonus from user mike.t***", amount: 75.00, status: "completed" as const },
  { id: "TXN-004", date: "2025-06-10", type: "Withdrawal", description: "Withdrawal to main wallet", amount: -1500.00, status: "completed" as const },
  { id: "TXN-005", date: "2025-06-05", type: "Investment Purchase", description: "USD Income Plan - New Investment", amount: -5000.00, status: "completed" as const },
  { id: "TXN-006", date: "2025-06-01", type: "ROI Credit", description: "USD Income Plan - Monthly ROI", amount: 180.00, status: "completed" as const },
  { id: "TXN-007", date: "2025-05-28", type: "Referral Commission", description: "Referral bonus from user sarah.l***", amount: 150.00, status: "pending" as const },
  { id: "TXN-008", date: "2025-05-20", type: "Investment Purchase", description: "Gold Growth Plan - Reinvestment", amount: -2000.00, status: "completed" as const },
];

const actionCards = [
  {
    label: "Transfer to Investment",
    description: "Fund a new or existing investment",
    icon: ArrowUpCircle,
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    action: "transfer",
  },
  {
    label: "Receive ROI",
    description: "ROI earnings auto-credited here",
    icon: TrendingUp,
    color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    action: "receive",
  },
  {
    label: "Withdraw Profit",
    description: "Withdraw to your main wallet",
    icon: ArrowDownCircle,
    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    action: "withdraw",
  },
];

export default function InvestmentWallet() {
  const { toast } = useToast();
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");

  function openTransfer() {
    setTransferAmount("");
    setTransferOpen(true);
  }

  function handleTransfer() {
    const amount = Number(transferAmount);
    if (!amount || amount <= 0 || amount > walletBalance) return;
    toast({
      title: "Transfer Successful",
      description: `$${amount.toFixed(2)} transferred from Investment Wallet to new investment`,
    });
    setTransferOpen(false);
    setTransferAmount("");
  }

  function setPercentage(pct: number) {
    setTransferAmount((walletBalance * pct / 100).toFixed(2));
  }

  function handleAction(action: string) {
    if (action === "transfer") {
      openTransfer();
    } else if (action === "receive") {
      toast({ title: "ROI earnings are automatically credited to your investment wallet each payout cycle." });
    } else if (action === "withdraw") {
      toast({ title: "Withdrawal request submitted", description: "Your withdrawal will be processed within 24 hours." });
    }
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto" data-testid="investment-wallet-page">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-wallet-title">
          Investment Wallet
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your investment wallet balance and transactions
        </p>
      </div>

      <Card className="p-6" data-testid="card-wallet-balance">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Wallet Balance</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-wallet-balance">
              ${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available for investments and withdrawals</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actionCards.map((card) => (
          <Card
            key={card.label}
            className="p-5 hover-elevate cursor-pointer"
            onClick={() => handleAction(card.action)}
            data-testid={`card-action-${card.action}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{card.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden" data-testid="section-transaction-history">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" data-testid="table-transactions">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {transactionHistory.map((txn, index) => (
                <tr
                  key={txn.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
                  data-testid={`row-transaction-${index}`}
                >
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(txn.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={
                      txn.type === "ROI Credit"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : txn.type === "Referral Commission"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        : txn.type === "Investment Purchase"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }>
                      {txn.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{txn.description}</td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${txn.amount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    {txn.amount >= 0 ? "+" : ""}${Math.abs(txn.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={
                      txn.status === "completed"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }>
                      {txn.status === "completed" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={transferOpen} onOpenChange={(open) => { if (!open) setTransferOpen(false); }}>
        <DialogContent className="max-w-md bg-[#0f172a] border-gray-800 text-white" data-testid="dialog-transfer-investment">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <ArrowLeftRight className="w-5 h-5 text-brand-400" />
              Transfer to Investment
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Transfer funds from your investment wallet to a new investment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-gray-800/50">
              <div>
                <p className="text-sm text-gray-400">Investment Wallet Balance</p>
                <p className="text-2xl font-bold text-white" data-testid="text-transfer-available">
                  ${walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">Available to transfer</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-900/30">
                <Gift className="w-6 h-6 text-purple-400" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-gray-800/30">
              <div className="text-center flex-1">
                <p className="text-xs text-gray-400 mb-1">From</p>
                <p className="text-sm font-bold text-white">Investment Wallet</p>
              </div>
              <ArrowLeftRight className="w-5 h-5 text-gray-500 mx-3 shrink-0" />
              <div className="text-center flex-1">
                <p className="text-xs text-gray-400 mb-1">To</p>
                <p className="text-sm font-bold text-white">New Investment</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-white">Amount (USD)</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 font-semibold">$</span>
                <Input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  min={0}
                  max={walletBalance}
                  step={0.01}
                  className="pl-8 bg-gray-900 border-brand-500 text-white text-lg font-semibold h-12 focus:ring-brand-500"
                  data-testid="input-transfer-amount"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setPercentage(pct)}
                    className="py-2 px-3 rounded-lg border border-gray-700 bg-gray-800/50 text-sm font-medium text-gray-300 hover:border-brand-500 hover:text-white transition-colors"
                    data-testid={`button-pct-${pct}`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
              disabled={!transferAmount || Number(transferAmount) <= 0 || Number(transferAmount) > walletBalance}
              onClick={handleTransfer}
              data-testid="button-confirm-transfer"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Transfer to Investment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}