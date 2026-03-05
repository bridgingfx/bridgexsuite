import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { PropAccount } from "@shared/schema";
import {
  DollarSign,
  Wallet,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpCircle,
  FileDown,
  TrendingUp,
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Loader2,
  Eye,
  Ban,
} from "lucide-react";

const conversionRates: Record<string, number> = { USD: 1, EUR: 0.85, GBP: 0.79 };
const currencySymbols: Record<string, string> = { USD: "$", EUR: "\u20AC", GBP: "\u00A3" };

type PayoutStatus = "approved" | "pending" | "rejected" | "cancelled";

interface PayoutRecord {
  id: string;
  date: string;
  amount: number;
  currency: string;
  method: string;
  status: PayoutStatus;
  tradingAccount: string;
  tradingPlatform: string;
  approvedDate: string | null;
}

const initialPayoutHistory: PayoutRecord[] = [
  { id: "PAY-1001", date: "2024-01-15", amount: 2500, currency: "USD", method: "Wallet", status: "approved", tradingAccount: "PROP-50821", tradingPlatform: "MT5", approvedDate: "2024-01-16" },
  { id: "PAY-1002", date: "2024-02-01", amount: 1800, currency: "USD", method: "Wallet", status: "approved", tradingAccount: "PROP-100322", tradingPlatform: "MT5", approvedDate: "2024-02-02" },
  { id: "PAY-1003", date: "2024-02-15", amount: 3200, currency: "USD", method: "Wallet", status: "pending", tradingAccount: "PROP-50821", tradingPlatform: "MT5", approvedDate: null },
  { id: "PAY-1004", date: "2024-03-01", amount: 1500, currency: "USD", method: "Wallet", status: "approved", tradingAccount: "PROP-50199", tradingPlatform: "cTrader", approvedDate: "2024-03-02" },
  { id: "PAY-1005", date: "2024-03-15", amount: 900, currency: "USD", method: "Wallet", status: "rejected", tradingAccount: "PROP-100322", tradingPlatform: "MT5", approvedDate: "2024-03-16" },
  { id: "PAY-1006", date: "2024-04-01", amount: 4100, currency: "USD", method: "Wallet", status: "approved", tradingAccount: "PROP-50199", tradingPlatform: "cTrader", approvedDate: "2024-04-02" },
];

const demoInvoices = [
  { id: "INV-2001", date: "2024-01-15", amount: 2500, type: "Payout Receipt" },
  { id: "INV-2002", date: "2024-02-01", amount: 1800, type: "Payout Receipt" },
  { id: "INV-2003", date: "2024-03-01", amount: 1500, type: "Payout Receipt" },
  { id: "INV-2004", date: "2024-04-01", amount: 4100, type: "Payout Receipt" },
];

export default function PropPayouts() {
  const { toast } = useToast();
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawCurrency, setWithdrawCurrency] = useState("USD");
  const [payoutHistory, setPayoutHistory] = useState<PayoutRecord[]>(initialPayoutHistory);
  const [historyPage, setHistoryPage] = useState(1);
  const [viewPayout, setViewPayout] = useState<PayoutRecord | null>(null);
  const perPage = 5;

  const { data: allAccounts, isLoading: accountsLoading } = useQuery<PropAccount[]>({
    queryKey: ["/api/prop/accounts"],
  });

  const fundedAccounts = (allAccounts ?? []).filter(
    (a) => a.status === "funded"
  );

  const selectedAccount = fundedAccounts.find((a) => a.id === selectedAccountId);
  const availableBalance = selectedAccount
    ? Number(selectedAccount.currentBalance)
    : 0;

  const totalEarned = payoutHistory
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + p.amount, 0);

  function getConvertedAmount() {
    const amount = Number(withdrawAmount) || 0;
    const rate = conversionRates[withdrawCurrency] ?? 1;
    return amount * rate;
  }

  function handleOpenWithdraw() {
    if (!selectedAccount) return;
    setWithdrawAmount("");
    setWithdrawCurrency("USD");
    setWithdrawOpen(true);
  }

  function handleWithdrawToWallet() {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0 || amount > availableBalance) return;
    toast({
      title: "Withdrawal Successful",
      description: `${currencySymbols[withdrawCurrency]}${getConvertedAmount().toFixed(2)} withdrawn to ${withdrawCurrency} wallet`,
    });
    setWithdrawOpen(false);
    setWithdrawAmount("");
    setWithdrawCurrency("USD");
  }

  const totalPages = Math.ceil(payoutHistory.length / perPage);
  const paginatedHistory = payoutHistory.slice(
    (historyPage - 1) * perPage,
    historyPage * perPage
  );

  const statusConfig: Record<PayoutStatus, { color: string; icon: typeof CheckCircle2 }> = {
    approved: {
      color:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      icon: CheckCircle2,
    },
    pending: {
      color:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      icon: Clock,
    },
    rejected: {
      color:
        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      icon: XCircle,
    },
    cancelled: {
      color:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      icon: Ban,
    },
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1
          className="text-lg font-bold text-gray-900 dark:text-white"
          data-testid="text-payouts-title"
        >
          Payouts
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Withdraw your prop trading profits to your wallet
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6" data-testid="stat-funded-accounts">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Funded Accounts
              </p>
              <h3
                className="text-2xl font-bold text-gray-900 dark:text-white"
                data-testid="text-funded-count"
              >
                {accountsLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  fundedAccounts.length
                )}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Eligible for withdrawal
          </div>
        </Card>

        <Card className="p-6" data-testid="stat-selected-balance">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Selected Account Balance
              </p>
              <h3
                className="text-2xl font-bold text-gray-900 dark:text-white"
                data-testid="text-available-balance"
              >
                {selectedAccount
                  ? `$${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  : "--"}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {selectedAccount
              ? `Account ${selectedAccount.accountNumber}`
              : "Select an account to view balance"}
          </div>
        </Card>

        <Card className="p-6" data-testid="stat-total-earned">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Total Earned
              </p>
              <h3
                className="text-2xl font-bold text-emerald-600 dark:text-emerald-400"
                data-testid="text-total-earned"
              >
                ${totalEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Lifetime payouts
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-6" data-testid="section-withdraw">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Withdraw to Wallet
          </h2>
        </div>

        <div className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label>Select Funded Account</Label>
            {accountsLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading accounts...
              </div>
            ) : fundedAccounts.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No funded accounts available for withdrawal.
              </p>
            ) : (
              <Select
                value={selectedAccountId}
                onValueChange={setSelectedAccountId}
              >
                <SelectTrigger data-testid="select-funded-account">
                  <SelectValue placeholder="Choose a funded account" />
                </SelectTrigger>
                <SelectContent>
                  {fundedAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id} data-testid={`option-account-${account.id}`}>
                      {account.accountNumber} - $
                      {Number(account.currentBalance).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedAccount && (
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Account
                </span>
                <span
                  className="text-sm font-medium text-gray-900 dark:text-white"
                  data-testid="text-selected-account-number"
                >
                  {selectedAccount.accountNumber}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Balance
                </span>
                <span
                  className="text-sm font-bold text-gray-900 dark:text-white"
                  data-testid="text-selected-account-balance"
                >
                  $
                  {availableBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Profit
                </span>
                <span
                  className="text-sm font-medium text-emerald-600 dark:text-emerald-400"
                  data-testid="text-selected-account-profit"
                >
                  $
                  {Number(selectedAccount.currentProfit).toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2 }
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button
            disabled={!selectedAccount}
            onClick={handleOpenWithdraw}
            data-testid="button-withdraw-to-wallet"
          >
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            Withdraw to Wallet
          </Button>
        </div>
      </Card>

      <Card
        className="overflow-hidden"
        data-testid="section-payout-history"
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white">
            Payout History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table
            className="w-full text-left"
            data-testid="table-payout-history"
          >
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trading Account
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trading Platform
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedHistory.map((payout) => {
                const sc = statusConfig[payout.status];
                const StatusIcon = sc.icon;
                return (
                  <tr
                    key={payout.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
                    data-testid={`row-payout-${payout.id}`}
                  >
                    <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">
                      {payout.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(payout.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                      $
                      {payout.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {payout.method}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white" data-testid={`text-trading-account-${payout.id}`}>
                      {payout.tradingAccount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400" data-testid={`text-trading-platform-${payout.id}`}>
                      {payout.tradingPlatform}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${sc.color}`}
                        data-testid={`badge-status-${payout.id}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {payout.status.charAt(0).toUpperCase() +
                          payout.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-500 dark:text-blue-400"
                          onClick={() => setViewPayout(payout)}
                          data-testid={`button-view-${payout.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {payout.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 dark:text-red-400"
                            onClick={() => {
                              setPayoutHistory((prev) =>
                                prev.map((p) =>
                                  p.id === payout.id
                                    ? { ...p, status: "cancelled" as PayoutStatus, approvedDate: new Date().toISOString().split("T")[0] }
                                    : p
                                )
                              );
                              toast({
                                title: "Withdrawal Cancelled",
                                description: `Payout ${payout.id} has been cancelled.`,
                              });
                            }}
                            data-testid={`button-cancel-${payout.id}`}
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {historyPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={historyPage <= 1}
                onClick={() => setHistoryPage(historyPage - 1)}
                data-testid="button-history-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={historyPage >= totalPages}
                onClick={() => setHistoryPage(historyPage + 1)}
                data-testid="button-history-next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6 space-y-4" data-testid="section-invoices">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h2 className="font-bold text-gray-900 dark:text-white">
            Invoices & Receipts
          </h2>
        </div>
        <div className="space-y-3">
          {demoInvoices.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              data-testid={`row-invoice-${inv.id}`}
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {inv.type}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {inv.id} ·{" "}
                  {new Date(inv.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  · $
                  {inv.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast({
                    title: "Downloading...",
                    description: `${inv.id} receipt`,
                  })
                }
                data-testid={`button-download-${inv.id}`}
              >
                <FileDown className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={!!viewPayout} onOpenChange={(open) => !open && setViewPayout(null)}>
        <DialogContent className="max-w-md" data-testid="dialog-view-payout">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              View the details of this payout transaction.
            </DialogDescription>
          </DialogHeader>
          {viewPayout && (() => {
            const sc = statusConfig[viewPayout.status];
            const StatusIcon = sc.icon;
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</span>
                  <span className="text-sm font-mono font-medium text-gray-900 dark:text-white" data-testid="text-view-id">{viewPayout.id}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Date</span>
                  <span className="text-sm text-gray-900 dark:text-white" data-testid="text-view-date">
                    {new Date(viewPayout.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white" data-testid="text-view-amount">
                    ${viewPayout.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Method</span>
                  <span className="text-sm text-gray-900 dark:text-white" data-testid="text-view-method">{viewPayout.method}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Trading Account</span>
                  <span className="text-sm font-mono text-gray-900 dark:text-white" data-testid="text-view-trading-account">{viewPayout.tradingAccount}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Trading Platform</span>
                  <span className="text-sm text-gray-900 dark:text-white" data-testid="text-view-trading-platform">{viewPayout.tradingPlatform}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${sc.color}`} data-testid="text-view-status">
                    <StatusIcon className="w-3 h-3" />
                    {viewPayout.status.charAt(0).toUpperCase() + viewPayout.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Approved Date</span>
                  <span className="text-sm text-gray-900 dark:text-white" data-testid="text-view-approved-date">
                    {viewPayout.approvedDate
                      ? new Date(viewPayout.approvedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "Pending"}
                  </span>
                </div>
              </div>
            );
          })()}
          <Button variant="outline" className="w-full" onClick={() => setViewPayout(null)} data-testid="button-close-view">
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw to Wallet</DialogTitle>
            <DialogDescription>
              Transfer profits from your funded account to your wallet.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Available Balance
            </p>
            <p
              className="text-xl font-bold text-blue-700 dark:text-blue-300"
              data-testid="text-withdraw-available"
            >
              $
              {availableBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            {selectedAccount && (
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                Account: {selectedAccount.accountNumber}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Destination Wallet Currency</Label>
              <Select
                value={withdrawCurrency}
                onValueChange={setWithdrawCurrency}
              >
                <SelectTrigger data-testid="select-withdraw-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD" data-testid="option-currency-usd">USD ($)</SelectItem>
                  <SelectItem value="EUR" data-testid="option-currency-eur">EUR (&euro;)</SelectItem>
                  <SelectItem value="GBP" data-testid="option-currency-gbp">GBP (&pound;)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                data-testid="input-withdraw-amount"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {["100", "500", "1000"].map((v) => (
                <Button
                  key={v}
                  variant="outline"
                  size="sm"
                  onClick={() => setWithdrawAmount(v)}
                  data-testid={`button-withdraw-amount-${v}`}
                >
                  ${v}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setWithdrawAmount(String(availableBalance))}
                data-testid="button-withdraw-amount-max"
              >
                Max
              </Button>
            </div>

            {withdrawAmount && withdrawCurrency !== "USD" && (
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Conversion: ${Number(withdrawAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  <ArrowRight className="inline w-3 h-3 mx-1" />
                  {currencySymbols[withdrawCurrency]}
                  {getConvertedAmount().toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Rate: 1 USD = {conversionRates[withdrawCurrency]} {withdrawCurrency}
                </p>
              </div>
            )}
          </div>

          <Button
            className="w-full"
            disabled={
              !withdrawAmount ||
              Number(withdrawAmount) <= 0 ||
              Number(withdrawAmount) > availableBalance
            }
            onClick={handleWithdrawToWallet}
            data-testid="button-confirm-withdraw"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Confirm Withdrawal
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
