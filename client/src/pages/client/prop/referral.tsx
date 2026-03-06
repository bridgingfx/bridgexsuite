import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Copy,
  DollarSign,
  UserPlus,
  UserCheck,
  ArrowLeftRight,
  Gift,
} from "lucide-react";

const affiliateLink = "https://propfirm.com/ref/USR12345";

const totalEarned = 1240.00;

const demoStats = [
  { label: "Total Affiliates", value: "24", icon: Users, color: "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400" },
  { label: "Active Affiliates", value: "18", icon: UserCheck, color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
];

const demoCommissions = [
  { id: "c-1", referredUser: "john.d***@email.com", challenge: "50K Challenge", commission: "$45.00", date: "2025-06-10", status: "paid" as const },
  { id: "c-2", referredUser: "sarah.m***@email.com", challenge: "100K Challenge", commission: "$75.00", date: "2025-06-05", status: "paid" as const },
  { id: "c-3", referredUser: "mike.r***@email.com", challenge: "10K Challenge", commission: "$15.00", date: "2025-05-28", status: "pending" as const },
  { id: "c-4", referredUser: "anna.k***@email.com", challenge: "50K Challenge", commission: "$45.00", date: "2025-05-20", status: "paid" as const },
  { id: "c-5", referredUser: "david.l***@email.com", challenge: "100K Challenge", commission: "$75.00", date: "2025-05-15", status: "pending" as const },
  { id: "c-6", referredUser: "lisa.p***@email.com", challenge: "50K Challenge", commission: "$45.00", date: "2025-05-10", status: "paid" as const },
];

export default function PropReferral() {
  const { toast } = useToast();
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(affiliateLink).then(() => {
      toast({ title: "Affiliate link copied to clipboard!" });
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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-affiliate-title">
          Affiliate Program
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Invite traders and earn commissions on their purchases.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4" data-testid="text-affiliate-link-title">
          Your Affiliate Link
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            value={affiliateLink}
            readOnly
            className="max-w-md font-mono text-sm"
            data-testid="input-affiliate-link"
          />
          <Button onClick={handleCopyLink} data-testid="button-copy-affiliate">
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Share this link with other traders. You earn a commission when they purchase a challenge.
        </p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5" data-testid="card-stat-total-affiliate-earning">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Affiliate Earning</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-stat-total-affiliate-earning">
                ${totalEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => { setTransferAmount(""); setTransferOpen(true); }}
              data-testid="button-transfer-affiliate"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5" />
              Transfer to Wallet
            </Button>
          </div>
        </Card>
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
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white" data-testid="text-commission-history-title">
          Commission History
        </h2>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-commissions">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Referred User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Challenge</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Commission</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoCommissions.map((commission, index) => (
                <tr
                  key={commission.id}
                  className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${
                    index % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-800/20"
                  }`}
                  data-testid={`row-commission-${index}`}
                >
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{commission.referredUser}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{commission.challenge}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{commission.commission}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{commission.date}</td>
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

      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="sm:max-w-md bg-[#0f172a] border-gray-800 text-white p-0 overflow-hidden">
          <div className="p-6 space-y-5">
            <DialogHeader className="space-y-1.5">
              <DialogTitle className="flex items-center gap-2 text-white text-lg font-bold">
                <ArrowLeftRight size={20} className="text-brand-400" />
                Transfer to Wallet
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-sm">
                Transfer your earnings to your main wallet balance.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-between p-5 bg-[#1e293b] rounded-xl border border-gray-700/50">
              <div>
                <p className="text-sm text-purple-400 font-medium">Total Affiliate Earning</p>
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
                <p className="font-bold text-white text-sm">Affiliate Commission</p>
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
