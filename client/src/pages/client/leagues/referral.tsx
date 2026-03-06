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
  Users,
  Copy,
  Gift,
  DollarSign,
  TrendingUp,
  Share2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeftRight,
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

const referralGrowthData = [
  { month: "Aug", referrals: 1 },
  { month: "Sep", referrals: 2 },
  { month: "Oct", referrals: 4 },
  { month: "Nov", referrals: 5 },
  { month: "Dec", referrals: 7 },
  { month: "Jan", referrals: 9 },
  { month: "Feb", referrals: 10 },
  { month: "Mar", referrals: 12 },
];

const earningsActiveData = [
  { month: "Aug", earnings: 30, activeReferrals: 1 },
  { month: "Sep", earnings: 50, activeReferrals: 2 },
  { month: "Oct", earnings: 100, activeReferrals: 3 },
  { month: "Nov", earnings: 125, activeReferrals: 4 },
  { month: "Dec", earnings: 175, activeReferrals: 5 },
  { month: "Jan", earnings: 250, activeReferrals: 6 },
  { month: "Feb", earnings: 225, activeReferrals: 7 },
  { month: "Mar", earnings: 295, activeReferrals: 8 },
];

const referralStats = {
  totalReferred: 12,
  activeReferrals: 8,
  totalEarnings: 1250,
  pendingEarnings: 350,
};

const referralLink = "https://bridgex.com/leagues/ref/JOHN2024";

const referralHistory = [
  { id: "R-001", name: "Mike T.", date: "2024-03-10", tournamentJoined: "Weekly Scalpers League", commission: 50, status: "paid" as const },
  { id: "R-002", name: "Sarah L.", date: "2024-03-08", tournamentJoined: "Monthly Masters Cup", commission: 75, status: "paid" as const },
  { id: "R-003", name: "Alex K.", date: "2024-03-05", tournamentJoined: "Weekly Scalpers League", commission: 50, status: "pending" as const },
  { id: "R-004", name: "Chris W.", date: "2024-02-28", tournamentJoined: "February Showdown", commission: 100, status: "paid" as const },
  { id: "R-005", name: "Emma D.", date: "2024-02-20", tournamentJoined: "Monthly Masters Cup", commission: 75, status: "paid" as const },
  { id: "R-006", name: "James R.", date: "2024-02-15", tournamentJoined: "New Year Challenge", commission: 30, status: "paid" as const },
];

const tiers = [
  { name: "Bronze", minRefs: 0, commission: "10%", reached: true },
  { name: "Silver", minRefs: 5, commission: "15%", reached: true },
  { name: "Gold", minRefs: 15, commission: "20%", reached: false },
  { name: "Platinum", minRefs: 30, commission: "25%", reached: false },
];

export default function LeaguesReferral() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");

  const availableToTransfer = referralStats.totalEarnings;

  function copyLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Link Copied!", description: "Referral link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  }

  function openTransfer() {
    setTransferAmount("");
    setTransferOpen(true);
  }

  function handleTransfer() {
    const amount = Number(transferAmount);
    if (!amount || amount <= 0 || amount > availableToTransfer) return;
    toast({
      title: "Transfer Successful",
      description: `$${amount.toFixed(2)} transferred from Referral Commission to Main Wallet`,
    });
    setTransferOpen(false);
    setTransferAmount("");
  }

  function setPercentage(pct: number) {
    setTransferAmount((availableToTransfer * pct / 100).toFixed(2));
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto" data-testid="leagues-referral-page">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-referral-title">
          Referral Program
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Invite friends to join leagues and earn commissions on their entry fees
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-r from-brand-500/10 to-cyan-500/10 border-brand-200 dark:border-brand-800" data-testid="section-referral-link">
        <div className="flex items-center gap-3 mb-4">
          <Share2 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Referral Link</h2>
        </div>
        <div className="flex items-center gap-2 max-w-lg">
          <Input
            value={referralLink}
            readOnly
            className="font-mono text-sm"
            data-testid="input-referral-link"
          />
          <Button onClick={copyLink} data-testid="button-copy-link">
            {copied ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Share this link with friends. You earn commission when they join any tournament.
        </p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6" data-testid="stat-total-referred">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Referred</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{referralStats.totalReferred}</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-6" data-testid="stat-active-referrals">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Referrals</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{referralStats.activeReferrals}</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-md">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-6 relative" data-testid="stat-total-earnings">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Earnings</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${referralStats.totalEarnings}</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-md">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={openTransfer}
              data-testid="button-transfer-earnings"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5" />
              Transfer to Wallet
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
                  <linearGradient id="refGrowthGrad" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="referrals" stroke="#0ea5e9" fill="url(#refGrowthGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6" data-testid="chart-earnings-active">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Monthly Earnings & Active Referrals</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsActiveData}>
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

      <Card className="p-6" data-testid="section-commission-tiers">
        <div className="flex items-center gap-2 mb-6">
          <Gift className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Commission Tiers</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-4 rounded-lg border text-center ${
                tier.reached
                  ? "border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-900/10"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              data-testid={`tier-${tier.name.toLowerCase()}`}
            >
              <p className="font-bold text-gray-900 dark:text-white mb-1">{tier.name}</p>
              <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{tier.commission}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tier.minRefs}+ referrals</p>
              {tier.reached && (
                <Badge className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />Reached
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden" data-testid="section-referral-history">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white">Referral History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" data-testid="table-referral-history">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Referral</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tournament</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Commission</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {referralHistory.map((ref) => (
                <tr key={ref.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30" data-testid={`row-referral-${ref.id}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{ref.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(ref.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{ref.tournamentJoined}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400 text-right">+${ref.commission}</td>
                  <td className="px-6 py-4">
                    <Badge className={ref.status === "paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}>
                      {ref.status === "paid" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={transferOpen} onOpenChange={(open) => { if (!open) setTransferOpen(false); }}>
        <DialogContent className="max-w-md bg-[#0f172a] border-gray-800 text-white" data-testid="dialog-transfer-wallet">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <ArrowLeftRight className="w-5 h-5 text-brand-400" />
              Transfer to Wallet
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Transfer your earnings to your main wallet balance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-gray-800/50">
              <div>
                <p className="text-sm text-gray-400">Total Referral Commission</p>
                <p className="text-2xl font-bold text-white" data-testid="text-transfer-available">
                  ${availableToTransfer.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
                <p className="text-sm font-bold text-white">Referral Commission</p>
              </div>
              <ArrowLeftRight className="w-5 h-5 text-gray-500 mx-3 shrink-0" />
              <div className="text-center flex-1">
                <p className="text-xs text-gray-400 mb-1">To</p>
                <p className="text-sm font-bold text-white">Main Wallet</p>
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
                  max={availableToTransfer}
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
              disabled={!transferAmount || Number(transferAmount) <= 0 || Number(transferAmount) > availableToTransfer}
              onClick={handleTransfer}
              data-testid="button-confirm-transfer"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Transfer to Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
