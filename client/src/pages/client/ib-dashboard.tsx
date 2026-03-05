import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Users,
  DollarSign,
  Link2,
  TrendingUp,
  Copy,
  UserPlus,
  ArrowUpRight,
  ChevronRight,
  BarChart3,
  Share2,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const commissionChartData = [
  { month: "Jan", commission: 180 },
  { month: "Feb", commission: 220 },
  { month: "Mar", commission: 150 },
  { month: "Apr", commission: 310 },
  { month: "May", commission: 280 },
  { month: "Jun", commission: 420 },
  { month: "Jul", commission: 350 },
];

const demoReferrals = [
  { id: 1, name: "James Wilson", email: "james.w@email.com", status: "active", joinedDate: "2026-01-15", deposits: 5200, commission: 156, tier: "Gold" },
  { id: 2, name: "Sarah Chen", email: "sarah.c@email.com", status: "active", joinedDate: "2026-01-22", deposits: 3800, commission: 114, tier: "Silver" },
  { id: 3, name: "Michael Brown", email: "m.brown@email.com", status: "active", joinedDate: "2026-02-01", deposits: 8500, commission: 255, tier: "Platinum" },
  { id: 4, name: "Emily Davis", email: "emily.d@email.com", status: "pending", joinedDate: "2026-02-08", deposits: 0, commission: 0, tier: "Bronze" },
  { id: 5, name: "Robert Taylor", email: "r.taylor@email.com", status: "active", joinedDate: "2026-02-10", deposits: 2100, commission: 63, tier: "Silver" },
  { id: 6, name: "Lisa Anderson", email: "l.ander@email.com", status: "inactive", joinedDate: "2025-12-20", deposits: 1500, commission: 45, tier: "Bronze" },
  { id: 7, name: "David Kim", email: "d.kim@email.com", status: "active", joinedDate: "2025-11-05", deposits: 4200, commission: 126, tier: "Gold" },
  { id: 8, name: "Anna Martinez", email: "a.martinez@email.com", status: "active", joinedDate: "2025-11-18", deposits: 6800, commission: 204, tier: "Platinum" },
  { id: 9, name: "Chris Evans", email: "c.evans@email.com", status: "active", joinedDate: "2025-12-03", deposits: 3100, commission: 93, tier: "Silver" },
  { id: 10, name: "Sophia Lee", email: "s.lee@email.com", status: "active", joinedDate: "2025-12-15", deposits: 7500, commission: 225, tier: "Gold" },
  { id: 11, name: "Daniel Park", email: "d.park@email.com", status: "active", joinedDate: "2026-01-02", deposits: 2800, commission: 84, tier: "Silver" },
  { id: 12, name: "Olivia White", email: "o.white@email.com", status: "active", joinedDate: "2026-01-08", deposits: 4500, commission: 135, tier: "Gold" },
  { id: 13, name: "Ethan Clark", email: "e.clark@email.com", status: "active", joinedDate: "2026-01-12", deposits: 1900, commission: 57, tier: "Bronze" },
  { id: 14, name: "Isabella Jones", email: "i.jones@email.com", status: "pending", joinedDate: "2026-02-05", deposits: 0, commission: 0, tier: "Bronze" },
  { id: 15, name: "Liam Scott", email: "l.scott@email.com", status: "active", joinedDate: "2025-10-20", deposits: 9200, commission: 276, tier: "Platinum" },
  { id: 16, name: "Mia Thompson", email: "m.thompson@email.com", status: "active", joinedDate: "2025-10-28", deposits: 3600, commission: 108, tier: "Silver" },
  { id: 17, name: "Noah Harris", email: "n.harris@email.com", status: "active", joinedDate: "2025-11-10", deposits: 5100, commission: 153, tier: "Gold" },
  { id: 18, name: "Ava Robinson", email: "a.robinson@email.com", status: "inactive", joinedDate: "2025-09-15", deposits: 800, commission: 24, tier: "Bronze" },
  { id: 19, name: "William King", email: "w.king@email.com", status: "active", joinedDate: "2025-12-22", deposits: 6200, commission: 186, tier: "Gold" },
  { id: 20, name: "Charlotte Adams", email: "c.adams@email.com", status: "active", joinedDate: "2026-01-05", deposits: 2500, commission: 75, tier: "Silver" },
  { id: 21, name: "Benjamin Wright", email: "b.wright@email.com", status: "pending", joinedDate: "2026-02-12", deposits: 0, commission: 0, tier: "Bronze" },
  { id: 22, name: "Harper Green", email: "h.green@email.com", status: "active", joinedDate: "2025-11-25", deposits: 4800, commission: 144, tier: "Gold" },
  { id: 23, name: "Mason Baker", email: "m.baker@email.com", status: "inactive", joinedDate: "2025-08-30", deposits: 600, commission: 18, tier: "Bronze" },
  { id: 24, name: "Ella Turner", email: "e.turner@email.com", status: "active", joinedDate: "2026-01-28", deposits: 3400, commission: 102, tier: "Silver" },
];

export default function IBDashboard() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data: referrals, isLoading: refLoading } = useQuery<any[]>({
    queryKey: ["/api/ib/referrals"],
  });
  const { data: commissions, isLoading: comLoading } = useQuery<any[]>({
    queryKey: ["/api/commissions"],
  });

  const isLoading = refLoading || comLoading;

  const allReferrals = referrals?.length ? referrals : demoReferrals;
  const totalReferrals = allReferrals.length;
  const activeClients = allReferrals.filter((r: any) => r.status === "active").length;
  const totalCommission = commissions?.reduce((s: number, c: any) => s + Number(c.amount), 0) || 3450;
  const pendingCommission = commissions?.filter((c: any) => c.status === "pending")?.reduce((s: number, c: any) => s + Number(c.amount), 0) || 280;

  const referralLink = `${window.location.origin}/?ref=IB-001`;

  const kpis = [
    { title: "Total Referrals", value: totalReferrals.toString(), icon: Users, iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400", trend: "+3 this month", isPositive: true },
    { title: "Active Clients", value: activeClients.toString(), icon: UserPlus, iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400", trend: "+2 new", isPositive: true },
    { title: "Total Commission", value: `$${totalCommission.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400", trend: "+15.3%", isPositive: true },
    { title: "Pending Commission", value: `$${pendingCommission.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: Clock, iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400", trend: "Processing", isPositive: true },
  ];

  function copyLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Referral link copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  }

  function getTierStyle(tier: string) {
    switch (tier) {
      case "Platinum":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
      case "Gold":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
      case "Silver":
        return "bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300";
      default:
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-page-title">IB Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Introducing Broker program overview</p>
        </div>
        <Button variant="outline" size="sm" data-testid="button-share-program">
          <Share2 className="w-4 h-4 mr-2" />
          Share Program
        </Button>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-2xl p-6 text-white shadow-lg" data-testid="ib-referral-section">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Link2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Your Referral Link</h2>
              <p className="text-white/70 text-sm">Share this link to earn commissions on referrals</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5 font-mono text-sm truncate" data-testid="text-referral-link">
            {referralLink}
          </div>
          <Button
            variant="outline"
            className="border-white/30 text-white bg-white/10 backdrop-blur-sm shrink-0"
            onClick={copyLink}
            data-testid="button-copy-referral"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="bg-white dark:bg-[#1c1c2e] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
            data-testid={`card-stat-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.title}</span>
              <div className={`p-3 rounded-lg ${kpi.iconBg}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white" data-testid={`text-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}>
              {kpi.value}
            </div>
            <div className="mt-1">
              <span className="text-xs font-medium text-emerald-500">{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1c1c2e] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-commission-chart-title">Commission Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commissionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#fff" }}
                  formatter={(value: number) => [`$${value}`, "Commission"]}
                />
                <Bar dataKey="commission" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1c1c2e] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-tier-info-title">IB Tier Benefits</h3>
          <div className="space-y-4">
            {[
              { tier: "Bronze", commission: "1.0 pip", minReferrals: "0", color: "bg-orange-500" },
              { tier: "Silver", commission: "1.5 pips", minReferrals: "5", color: "bg-gray-400" },
              { tier: "Gold", commission: "2.0 pips", minReferrals: "15", color: "bg-amber-500" },
              { tier: "Platinum", commission: "3.0 pips", minReferrals: "30", color: "bg-purple-500" },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50" data-testid={`row-tier-${t.tier.toLowerCase()}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${t.color}`} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{t.tier}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Min {t.minReferrals} referrals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.commission}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">per lot</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1c1c2e] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-referrals-table-title">Referral Network</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your referred clients and their activity</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-gray-500 dark:text-gray-400">
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Tier</th>
                <th className="px-6 py-3 font-medium">Total Deposits</th>
                <th className="px-6 py-3 font-medium">Commission</th>
                <th className="px-6 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {(allReferrals as any[]).map((ref: any, idx: number) => (
                <tr
                  key={ref.id || idx}
                  className="border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                  data-testid={`row-referral-${ref.id || idx}`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{ref.name || ref.email || `User ${ref.id}`}</p>
                      <p className="text-xs text-gray-400">{ref.email || ""}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ref.status === "active"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : ref.status === "pending"
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    }`}>
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierStyle(ref.tier || "Bronze")}`}>
                      <Award className="w-3 h-3 mr-1" />
                      {ref.tier || "Bronze"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    ${(ref.deposits || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    ${(ref.commission || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {ref.joinedDate ? new Date(ref.joinedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
