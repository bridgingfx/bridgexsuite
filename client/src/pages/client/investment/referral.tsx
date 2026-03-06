import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Copy,
  DollarSign,
  UserCheck,
  ArrowLeftRight,
  Gift,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const referralLink = "https://investments.com/ref/USR12345";

const totalEarned = 2850.00;

const referralGrowthData = [
  { month: "Aug", referrals: 2 },
  { month: "Sep", referrals: 5 },
  { month: "Oct", referrals: 9 },
  { month: "Nov", referrals: 14 },
  { month: "Dec", referrals: 18 },
  { month: "Jan", referrals: 22 },
  { month: "Feb", referrals: 27 },
  { month: "Mar", referrals: 32 },
];

const earningsReferralsData = [
  { month: "Aug", earnings: 120, activeReferrals: 2 },
  { month: "Sep", earnings: 250, activeReferrals: 4 },
  { month: "Oct", earnings: 380, activeReferrals: 7 },
  { month: "Nov", earnings: 420, activeReferrals: 10 },
  { month: "Dec", earnings: 510, activeReferrals: 13 },
  { month: "Jan", earnings: 395, activeReferrals: 16 },
  { month: "Feb", earnings: 340, activeReferrals: 20 },
  { month: "Mar", earnings: 435, activeReferrals: 24 },
];

const demoStats = [
  { label: "Active Investors", value: "24", icon: UserCheck, color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400", hasTransfer: false },
  { label: "Total Referral Earnings", value: `$${totalEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400", hasTransfer: true },
];

const demoCommissions = [
  { id: "c-1", investorName: "john.d***@email.com", investmentAmount: "$5,000.00", commissionPct: "5%", commissionEarned: "$250.00", status: "paid" as const },
  { id: "c-2", investorName: "sarah.m***@email.com", investmentAmount: "$10,000.00", commissionPct: "5%", commissionEarned: "$500.00", status: "paid" as const },
  { id: "c-3", investorName: "mike.r***@email.com", investmentAmount: "$2,500.00", commissionPct: "5%", commissionEarned: "$125.00", status: "pending" as const },
  { id: "c-4", investorName: "anna.k***@email.com", investmentAmount: "$15,000.00", commissionPct: "5%", commissionEarned: "$750.00", status: "paid" as const },
  { id: "c-5", investorName: "david.l***@email.com", investmentAmount: "$8,000.00", commissionPct: "5%", commissionEarned: "$400.00", status: "pending" as const },
  { id: "c-6", investorName: "lisa.p***@email.com", investmentAmount: "$20,000.00", commissionPct: "5%", commissionEarned: "$1,000.00", status: "paid" as const },
];

const ITEMS_PER_PAGE = 5;

export default function InvestmentReferral() {
  const { toast } = useToast();
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      toast({ title: "Referral link copied to clipboard!" });
    }).catch(() => {
      toast({ title: "Failed to copy link", variant: "destructive" });
    });
  };

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0 || amount > totalEarned) return;
    toast({ title: `$${amount.toFixed(2)} transferred to wallet successfully` });
    setTransferOpen(false);
    setTransferAmount("");
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-referral-title">
          Referral Commission
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Invite investors and earn commissions on their investments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {demoStats.map((stat) => (
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
            {stat.hasTransfer && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => { setTransferAmount(""); setTransferOpen(true); }}
                  data-testid="button-transfer-referral"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5" />
                  Transfer to Wallet
                </Button>
              </div>
            )}
          </Card>
        ))}

        <Card className="p-5" data-testid="card-referral-link">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your Referral Link</p>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="font-mono text-xs h-9"
                  data-testid="input-referral-link"
                />
              </div>
            </div>
            <div className="p-3 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400">
              <Copy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button
              size="sm"
              className="w-full"
              onClick={handleCopyLink}
              data-testid="button-copy-referral"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              Copy Link
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6" data-testid="chart-referral-growth">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Referral Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={referralGrowthData}>
                <defs>
                  <linearGradient id="investRefGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#fff" }}
                  formatter={(value: number) => [value, "Referrals"]}
                />
                <Area type="monotone" dataKey="referrals" stroke="#0ea5e9" fill="url(#investRefGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6" data-testid="chart-earnings-referrals">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Monthly Earnings & Active Referrals</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsReferralsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#fff" }}
                  formatter={(value: number, name: string) => [name === "earnings" ? `$${value}` : value, name === "earnings" ? "Earnings" : "Active Referrals"]}
                />
                <Bar yAxisId="left" dataKey="earnings" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="activeReferrals" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Earnings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-purple-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Active Referrals</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white" data-testid="text-commission-history-title">
          Commission History
        </h2>
        {!showAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setShowAll(true); setCurrentPage(1); }}
            data-testid="button-view-all-commissions"
          >
            View All
          </Button>
        )}
        {showAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setShowAll(false); setCurrentPage(1); }}
            data-testid="button-paginate-commissions"
          >
            Show Less
          </Button>
        )}
      </div>

      {(() => {
        const totalPages = Math.ceil(demoCommissions.length / ITEMS_PER_PAGE);
        const displayedCommissions = showAll
          ? demoCommissions
          : demoCommissions.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

        return (
          <>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-commissions">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Investor Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Investment Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Commission %</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Commission Earned</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedCommissions.map((commission, index) => (
                      <tr
                        key={commission.id}
                        className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${
                          index % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-800/20"
                        }`}
                        data-testid={`row-commission-${commission.id}`}
                      >
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{commission.investorName}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{commission.investmentAmount}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{commission.commissionPct}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{commission.commissionEarned}</td>
                        <td className="py-3 px-4">
                          <Badge className={
                            commission.status === "paid"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          }>
                            {commission.status === "paid" ? "Paid" : "Pending"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {!showAll && totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm text-gray-500 dark:text-gray-400" data-testid="text-commission-page-info">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, demoCommissions.length)} of {demoCommissions.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    data-testid="button-commission-prev"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      data-testid={`button-commission-page-${page}`}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    data-testid="button-commission-next"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {showAll && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center" data-testid="text-commission-total">
                Showing all {demoCommissions.length} records
              </p>
            )}

            {!showAll && totalPages <= 1 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center" data-testid="text-commission-total">
                Showing {demoCommissions.length} records
              </p>
            )}
          </>
        );
      })()}

      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="sm:max-w-md bg-[#0f172a] border-gray-800 text-white p-0 overflow-hidden">
          <div className="p-6 space-y-5">
            <DialogHeader className="space-y-1.5">
              <DialogTitle className="flex items-center gap-2 text-white text-lg font-bold">
                <ArrowLeftRight size={20} className="text-brand-400" />
                Transfer to Wallet
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-sm">
                Transfer your referral earnings to your main wallet balance.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-between p-5 bg-[#1e293b] rounded-xl border border-gray-700/50">
              <div>
                <p className="text-sm text-purple-400 font-medium">Total Referral Earnings</p>
                <p className="text-3xl font-bold text-white mt-1" data-testid="text-transfer-available">
                  ${totalEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Available to transfer</p>
              </div>
              <div className="p-3 bg-purple-600/20 rounded-xl">
                <Gift size={24} className="text-purple-400" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1e293b] rounded-xl border border-gray-700/50">
              <div className="text-center flex-1">
                <p className="text-xs text-gray-400 mb-1">From</p>
                <p className="font-bold text-white text-sm">Referral Commission</p>
              </div>
              <div className="px-3">
                <ArrowLeftRight size={18} className="text-gray-500" />
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-gray-400 mb-1">To</p>
                <p className="font-bold text-white text-sm">Main Wallet</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 font-bold text-lg">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={totalEarned}
                  placeholder="0.00"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full pl-9 p-3.5 rounded-xl border-2 border-brand-500 bg-[#1e293b] text-white focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none text-lg font-bold placeholder-gray-600"
                  data-testid="input-transfer-amount"
                />
              </div>
              {parseFloat(transferAmount) > totalEarned && (
                <p className="text-xs text-red-400 mt-1.5">Amount exceeds available balance</p>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((pct) => {
                const pctAmount = (totalEarned * pct / 100).toFixed(2);
                const isActive = transferAmount === pctAmount;
                return (
                  <button
                    key={pct}
                    onClick={() => setTransferAmount(pctAmount)}
                    className={`py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                      isActive
                        ? "bg-brand-600 border-brand-500 text-white"
                        : "bg-[#1e293b] border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                    }`}
                    data-testid={`button-transfer-${pct}`}
                  >
                    {pct}%
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleTransfer}
              disabled={
                !transferAmount ||
                parseFloat(transferAmount) <= 0 ||
                parseFloat(transferAmount) > totalEarned
              }
              className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 text-base"
              data-testid="button-confirm-transfer"
            >
              <ArrowLeftRight size={18} />
              Transfer to Wallet
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
