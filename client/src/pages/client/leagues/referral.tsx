import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";

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

  function copyLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Link Copied!", description: "Referral link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <Card className="p-6" data-testid="stat-total-earnings">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Earnings</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${referralStats.totalEarnings}</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-md">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-6" data-testid="stat-pending-earnings">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pending</p>
              <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">${referralStats.pendingEarnings}</h3>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-md">
              <Clock className="w-5 h-5" />
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
    </div>
  );
}
