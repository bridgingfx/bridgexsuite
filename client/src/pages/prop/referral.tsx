import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Copy,
  DollarSign,
  UserPlus,
  UserCheck,
  Clock,
  ArrowDownToLine,
} from "lucide-react";

const referralLink = "https://propfirm.com/ref/USR12345";

const demoStats = [
  { label: "Total Referrals", value: "24", icon: Users, color: "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400" },
  { label: "Active Referrals", value: "18", icon: UserCheck, color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
  { label: "Total Earned", value: "$1,240.00", icon: DollarSign, color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
  { label: "Pending Rewards", value: "$185.00", icon: Clock, color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      toast({ title: "Referral link copied to clipboard!" });
    }).catch(() => {
      toast({ title: "Failed to copy link", variant: "destructive" });
    });
  };

  const handleWithdraw = () => {
    toast({ title: "Withdrawal request submitted for pending rewards." });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-referral-title">
          Referral Program
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Invite traders and earn commissions on their purchases.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4" data-testid="text-referral-link-title">
          Your Referral Link
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            value={referralLink}
            readOnly
            className="max-w-md font-mono text-sm"
            data-testid="input-referral-link"
          />
          <Button onClick={handleCopyLink} data-testid="button-copy-referral">
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Share this link with other traders. You earn a commission when they purchase a challenge.
        </p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <Button variant="outline" onClick={handleWithdraw} data-testid="button-withdraw-rewards">
          <ArrowDownToLine className="w-4 h-4 mr-2" />
          Withdraw Rewards
        </Button>
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
    </div>
  );
}
