import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  DollarSign,
  Wallet,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpCircle,
  FileDown,
  CreditCard,
  Landmark,
  Bitcoin,
  Shield,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CircleDollarSign,
} from "lucide-react";

const conversionRates: Record<string, number> = { USD: 1, EUR: 0.85, GBP: 0.79 };
const currencySymbols: Record<string, string> = { USD: "$", EUR: "\u20AC", GBP: "\u00A3" };

const demoPayoutHistory = [
  { id: "PAY-1001", date: "2024-01-15", amount: 2500, currency: "USD", method: "Bank Transfer", status: "approved" as const },
  { id: "PAY-1002", date: "2024-02-01", amount: 1800, currency: "USD", method: "Crypto (USDT)", status: "approved" as const },
  { id: "PAY-1003", date: "2024-02-15", amount: 3200, currency: "USD", method: "Bank Transfer", status: "pending" as const },
  { id: "PAY-1004", date: "2024-03-01", amount: 1500, currency: "USD", method: "Wallet", status: "approved" as const },
  { id: "PAY-1005", date: "2024-03-15", amount: 900, currency: "USD", method: "Crypto (USDT)", status: "rejected" as const },
  { id: "PAY-1006", date: "2024-04-01", amount: 4100, currency: "USD", method: "Bank Transfer", status: "approved" as const },
];

const payoutMethods = [
  { id: "bank_transfer", name: "Bank Transfer", icon: Landmark, desc: "1-3 Business Days" },
  { id: "crypto", name: "Crypto (USDT)", icon: Bitcoin, desc: "Instant" },
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, desc: "1-2 Business Days" },
  { id: "wallet", name: "Withdraw to Wallet", icon: Wallet, desc: "Instant" },
];

const demoInvoices = [
  { id: "INV-2001", date: "2024-01-15", amount: 2500, type: "Payout Receipt" },
  { id: "INV-2002", date: "2024-02-01", amount: 1800, type: "Payout Receipt" },
  { id: "INV-2003", date: "2024-03-01", amount: 1500, type: "Payout Receipt" },
  { id: "INV-2004", date: "2024-04-01", amount: 4100, type: "Payout Receipt" },
];

export default function PropPayouts() {
  const { toast } = useToast();
  const [payoutAmount, setPayoutAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawCurrency, setWithdrawCurrency] = useState("USD");
  const [historyPage, setHistoryPage] = useState(1);
  const perPage = 5;

  const availableBalance = 8450.00;
  const totalEarned = 14000.00;
  const nextPayoutDate = "2024-04-15";
  const isEligible = true;

  function getConvertedAmount() {
    const amount = Number(withdrawAmount) || 0;
    const rate = conversionRates[withdrawCurrency] ?? 1;
    return amount * rate;
  }

  function handleRequestPayout() {
    if (!payoutAmount || !selectedMethod) return;
    if (selectedMethod === "wallet") {
      setWithdrawAmount("");
      setWithdrawCurrency("USD");
      setWithdrawOpen(true);
      return;
    }
    toast({
      title: "Payout Requested",
      description: `$${Number(payoutAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })} via ${payoutMethods.find(m => m.id === selectedMethod)?.name}`,
    });
    setPayoutAmount("");
    setSelectedMethod("");
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
    setPayoutAmount("");
    setSelectedMethod("");
  }

  const totalPages = Math.ceil(demoPayoutHistory.length / perPage);
  const paginatedHistory = demoPayoutHistory.slice((historyPage - 1) * perPage, historyPage * perPage);

  const statusConfig = {
    approved: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle2 },
    pending: { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
    rejected: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-payouts-title">
          Payouts
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your prop trading payouts and withdrawal requests</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-eligible-status">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Payout Status</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-eligible-status">
                {isEligible ? "Eligible" : "Not Eligible"}
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${isEligible ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400"}`}>
              {isEligible ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">14 days since last payout</div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-available-balance">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Available Balance</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-available-balance">
                ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Withdrawable profit</div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-next-payout">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Next Payout Date</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-next-payout">
                {new Date(nextPayoutDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Bi-weekly cycle</div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-total-earned">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Earned</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400" data-testid="text-total-earned">
                ${totalEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Lifetime payouts</div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-6" data-testid="section-request-payout">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Request Payout</h2>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">Select Payout Method</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {payoutMethods.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center text-center gap-3 transition-all ${
                  selectedMethod === m.id
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500 text-brand-700 dark:text-brand-300"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                data-testid={`card-payout-method-${m.id}`}
              >
                <div className={selectedMethod === m.id ? "text-brand-600" : "text-gray-500"}>
                  <m.icon size={24} />
                </div>
                <div>
                  <span className="block font-bold text-sm text-gray-900 dark:text-white">{m.name}</span>
                  <span className="text-xs text-gray-500 mt-1">{m.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedMethod && selectedMethod !== "wallet" && (
          <div className="max-w-md space-y-4 animate-fade-in">
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input
                type="number"
                placeholder="Enter payout amount"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                data-testid="input-payout-amount"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["500", "1000", "2000"].map((v) => (
                <Button
                  key={v}
                  variant="outline"
                  size="sm"
                  onClick={() => setPayoutAmount(v)}
                  data-testid={`button-payout-amount-${v}`}
                >
                  ${v}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPayoutAmount(String(availableBalance))}
                data-testid="button-payout-amount-max"
              >
                Max
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button
            disabled={!selectedMethod || (selectedMethod !== "wallet" && (!payoutAmount || Number(payoutAmount) <= 0 || Number(payoutAmount) > availableBalance))}
            onClick={handleRequestPayout}
            data-testid="button-request-payout"
          >
            <ArrowUpCircle className="w-4 h-4 mr-2" />
            {selectedMethod === "wallet" ? "Withdraw to Wallet" : "Request Payout"}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden" data-testid="section-payout-history">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white">Payout History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" data-testid="table-payout-history">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedHistory.map((payout) => {
                const sc = statusConfig[payout.status];
                const StatusIcon = sc.icon;
                return (
                  <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30" data-testid={`row-payout-${payout.id}`}>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{payout.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(payout.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                      ${payout.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{payout.method}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${sc.color}`} data-testid={`badge-status-${payout.id}`}>
                        <StatusIcon className="w-3 h-3" />
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </span>
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
              <Button variant="outline" size="icon" disabled={historyPage <= 1} onClick={() => setHistoryPage(historyPage - 1)} data-testid="button-history-prev">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" disabled={historyPage >= totalPages} onClick={() => setHistoryPage(historyPage + 1)} data-testid="button-history-next">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4" data-testid="section-invoices">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <h2 className="font-bold text-gray-900 dark:text-white">Invoices & Receipts</h2>
          </div>
          <div className="space-y-3">
            {demoInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50" data-testid={`row-invoice-${inv.id}`}>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{inv.type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {inv.id} · {new Date(inv.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast({ title: "Downloading...", description: `${inv.id} receipt` })}
                  data-testid={`button-download-${inv.id}`}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-4" data-testid="section-tax-kyc">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <h2 className="font-bold text-gray-900 dark:text-white">Tax & KYC Forms</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50" data-testid="row-kyc-identity">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Identity Verification</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Government-issued ID + Selfie</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" data-testid="badge-kyc-identity">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50" data-testid="row-kyc-address">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Proof of Address</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Utility bill or bank statement</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" data-testid="badge-kyc-address">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50" data-testid="row-tax-w8ben">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">W-8BEN Tax Form</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Required for non-US residents</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast({ title: "Downloading W-8BEN form..." })}
                data-testid="button-download-w8ben"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50" data-testid="row-tax-annual">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Annual Tax Statement</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Summary of all payouts for tax year 2024</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast({ title: "Downloading annual statement..." })}
                data-testid="button-download-annual"
              >
                <FileDown className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw to Wallet</DialogTitle>
            <DialogDescription>Transfer your prop trading profits to your wallet.</DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Available Balance</p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300" data-testid="text-withdraw-available">
              ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Destination Wallet Currency</Label>
              <Select value={withdrawCurrency} onValueChange={setWithdrawCurrency}>
                <SelectTrigger data-testid="select-withdraw-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (&euro;)</SelectItem>
                  <SelectItem value="GBP">GBP (&pound;)</SelectItem>
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
                  You will receive: <span className="font-bold text-gray-900 dark:text-white" data-testid="text-withdraw-converted">{currencySymbols[withdrawCurrency]}{getConvertedAmount().toFixed(2)} {withdrawCurrency}</span>
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Rate: 1 USD = {conversionRates[withdrawCurrency]?.toFixed(4)} {withdrawCurrency}
                </p>
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleWithdrawToWallet}
              disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > availableBalance}
              data-testid="button-submit-withdraw"
            >
              Withdraw Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}