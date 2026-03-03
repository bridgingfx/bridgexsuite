import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
  BarChart, Bar,
} from "recharts";
import {
  Landmark,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Activity,
  ArrowUpRight,
  Shield,
  ChevronRight,
} from "lucide-react";
import type { PammManager, PammInvestment } from "@shared/schema";

const demoManagers = [
  {
    id: "mgr-1",
    displayName: "Alpha Capital Fund",
    strategy: "Multi-Asset Diversified",
    description: "Professional fund management with a diversified approach across forex, indices, and commodities. Consistent returns with controlled drawdown.",
    totalReturn: 85.2,
    monthlyReturn: 4.8,
    totalAum: 2500000,
    investors: 156,
    riskLevel: "Low",
    performanceFee: 20,
    managementFee: 2,
    minInvestment: 5000,
    iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  },
  {
    id: "mgr-2",
    displayName: "Momentum Trading Co",
    strategy: "Momentum & Breakout",
    description: "Specializes in momentum-based strategies targeting breakout opportunities in volatile markets. Higher risk-reward ratio.",
    totalReturn: 142.5,
    monthlyReturn: 7.2,
    totalAum: 1800000,
    investors: 98,
    riskLevel: "Medium",
    performanceFee: 25,
    managementFee: 2.5,
    minInvestment: 10000,
    iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  },
  {
    id: "mgr-3",
    displayName: "Vertex Quant",
    strategy: "Algorithmic Trading",
    description: "Fully automated quantitative strategies using machine learning models. Low human intervention with 24/7 market coverage.",
    totalReturn: 210.8,
    monthlyReturn: 9.5,
    totalAum: 4200000,
    investors: 234,
    riskLevel: "Medium",
    performanceFee: 30,
    managementFee: 3,
    minInvestment: 25000,
    iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "mgr-4",
    displayName: "Phoenix Growth",
    strategy: "Aggressive Growth",
    description: "High-conviction trades targeting rapid capital appreciation. Suitable for investors with high risk tolerance seeking maximum returns.",
    totalReturn: 320.4,
    monthlyReturn: 14.2,
    totalAum: 950000,
    investors: 45,
    riskLevel: "High",
    performanceFee: 35,
    managementFee: 3,
    minInvestment: 10000,
    iconBg: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  },
];

const performanceData = [
  { month: "Jan", alpha: 3.2, momentum: 5.1, vertex: 7.8, phoenix: 12.4 },
  { month: "Feb", alpha: 4.1, momentum: 6.3, vertex: 8.2, phoenix: 10.1 },
  { month: "Mar", alpha: 3.8, momentum: 4.8, vertex: 9.5, phoenix: 15.2 },
  { month: "Apr", alpha: 5.2, momentum: 7.1, vertex: 8.8, phoenix: 11.8 },
  { month: "May", alpha: 4.5, momentum: 6.8, vertex: 10.2, phoenix: 14.5 },
  { month: "Jun", alpha: 4.8, momentum: 7.2, vertex: 9.5, phoenix: 14.2 },
];

const aumGrowthData = [
  { month: "Jan", aum: 7.2 },
  { month: "Feb", aum: 7.8 },
  { month: "Mar", aum: 8.1 },
  { month: "Apr", aum: 8.5 },
  { month: "May", aum: 9.0 },
  { month: "Jun", aum: 9.5 },
];

const chartTooltipStyle = {
  backgroundColor: "#1e293b",
  borderColor: "#334155",
  borderRadius: "8px",
  color: "#fff",
};

function getRiskColor(riskLevel: string) {
  switch (riskLevel?.toLowerCase()) {
    case "low":
      return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
    case "medium":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
    case "high":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
  }
}

export default function PammPage() {
  const { toast } = useToast();
  const [investOpen, setInvestOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<PammManager | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<typeof demoManagers[0] | null>(null);
  const [investAmount, setInvestAmount] = useState("");

  const { data: managers } = useQuery<PammManager[]>({ queryKey: ["/api/pamm/managers"] });
  const { data: myInvestments } = useQuery<PammInvestment[]>({ queryKey: ["/api/pamm/investments"] });

  const investMutation = useMutation({
    mutationFn: async () => apiRequest("POST", "/api/pamm/investments", { managerId: selectedManager!.id, amount: investAmount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pamm/investments"] });
      toast({ title: "Investment created!" });
      setInvestOpen(false);
    },
    onError: () => toast({ title: "Investment failed", variant: "destructive" }),
  });

  function openInvestDialog(manager: PammManager) {
    setSelectedManager(manager);
    setSelectedDemo(null);
    setInvestAmount("");
    setInvestOpen(true);
  }

  function openDemoInvestDialog(demoMgr: typeof demoManagers[0]) {
    setSelectedDemo(demoMgr);
    setSelectedManager(null);
    setInvestAmount("");
    setInvestOpen(true);
  }

  const displayManagers = managers && managers.length > 0 ? managers : null;

  const totalAum = demoManagers.reduce((s, m) => s + m.totalAum, 0);
  const totalInvestors = demoManagers.reduce((s, m) => s + m.investors, 0);
  const avgMonthly = (demoManagers.reduce((s, m) => s + m.monthlyReturn, 0) / demoManagers.length).toFixed(1);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-pamm-title">PAMM Accounts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Invest with professional money managers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total AUM", value: `$${(totalAum / 1000000).toFixed(1)}M`, trend: "+12.5% this quarter", icon: <DollarSign className="w-5 h-5" />, iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
          { label: "Total Investors", value: totalInvestors.toLocaleString(), trend: "+28 this month", icon: <Users className="w-5 h-5" />, iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
          { label: "Avg Monthly Return", value: `${avgMonthly}%`, trend: "Across all funds", icon: <TrendingUp className="w-5 h-5" />, iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
          { label: "Fund Managers", value: "4", trend: "All verified", icon: <Shield className="w-5 h-5" />, iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
        ].map((card) => (
          <div key={card.label} className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all p-6" data-testid={`stat-card-${card.label.toLowerCase().replace(/\s+/g, '-')}`}>
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
              <Activity size={16} className="text-emerald-500" />
              <span className="text-gray-500 dark:text-gray-400">{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-performance-heading">Monthly Performance (%)</h2>
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [`${value}%`, ""]} />
                <Bar dataKey="alpha" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Alpha Capital" />
                <Bar dataKey="momentum" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Momentum Trading" />
                <Bar dataKey="vertex" fill="#10b981" radius={[2, 2, 0, 0]} name="Vertex Quant" />
                <Bar dataKey="phoenix" fill="#ef4444" radius={[2, 2, 0, 0]} name="Phoenix Growth" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              {[
                { name: "Alpha Capital", color: "bg-blue-500" },
                { name: "Momentum Trading", color: "bg-purple-500" },
                { name: "Vertex Quant", color: "bg-emerald-500" },
                { name: "Phoenix Growth", color: "bg-red-500" },
              ].map((legend) => (
                <div key={legend.name} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${legend.color}`} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{legend.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-aum-heading">AUM Growth ($M)</h2>
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={aumGrowthData}>
                <defs>
                  <linearGradient id="aumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [`$${value}M`, "Total AUM"]} />
                <Area type="monotone" dataKey="aum" stroke="#0ea5e9" strokeWidth={2} fill="url(#aumGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-managers-heading">Fund Managers</h2>
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Manager</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Strategy</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Funds</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Investors</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monthly Return</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Return</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Risk</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {(displayManagers ? displayManagers.map((manager) => (
                  <tr key={manager.id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0" data-testid={`card-pamm-manager-${manager.id}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                          <Landmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{manager.displayName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{manager.strategy}</td>
                    <td className="p-4 text-sm font-mono text-gray-900 dark:text-white">${(Number(manager.totalAum) / 1000000).toFixed(1)}M</td>
                    <td className="p-4 text-sm text-gray-900 dark:text-white">{manager.investors}</td>
                    <td className="p-4 text-sm font-mono text-emerald-500">+{manager.monthlyReturn}%</td>
                    <td className="p-4 text-sm font-mono text-emerald-500">+{manager.totalReturn}%</td>
                    <td className="p-4">
                      <Badge variant="secondary" className={`text-xs ${getRiskColor(manager.riskLevel)}`}>{manager.riskLevel}</Badge>
                    </td>
                    <td className="p-4">
                      <Button size="sm" onClick={() => openInvestDialog(manager)} data-testid={`button-pamm-invest-${manager.id}`}>
                        Invest
                      </Button>
                    </td>
                  </tr>
                )) : demoManagers.map((manager) => (
                  <tr key={manager.id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0" data-testid={`card-pamm-manager-${manager.id}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${manager.iconBg} flex items-center justify-center shrink-0`}>
                          <Landmark className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{manager.displayName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{manager.strategy}</td>
                    <td className="p-4 text-sm font-mono text-gray-900 dark:text-white">${(manager.totalAum / 1000000).toFixed(1)}M</td>
                    <td className="p-4 text-sm text-gray-900 dark:text-white">{manager.investors}</td>
                    <td className="p-4 text-sm font-mono text-emerald-500">+{manager.monthlyReturn}%</td>
                    <td className="p-4 text-sm font-mono text-emerald-500">+{manager.totalReturn}%</td>
                    <td className="p-4">
                      <Badge variant="secondary" className={`text-xs ${getRiskColor(manager.riskLevel)}`}>{manager.riskLevel}</Badge>
                    </td>
                    <td className="p-4">
                      <Button size="sm" onClick={() => openDemoInvestDialog(manager)} data-testid={`button-pamm-invest-${manager.id}`}>
                        Invest
                      </Button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(displayManagers || demoManagers).map((manager) => {
          const mgr = manager as any;
          return (
            <div key={mgr.id} className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all p-6" data-testid={`card-pamm-detail-${mgr.id}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-lg ${mgr.iconBg || "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"}`}>
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{mgr.displayName}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{mgr.strategy}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{mgr.description}</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Performance Fee</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{mgr.performanceFee}%</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Management Fee</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{mgr.managementFee}%</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Min Investment</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${Number(mgr.minInvestment).toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {myInvestments && myInvestments.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-my-investments-heading">My PAMM Investments</h2>
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Manager</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invested</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Value</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profit</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Share %</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myInvestments.map((inv) => {
                    const managerName = managers?.find((m) => m.id === inv.managerId)?.displayName ?? "Unknown";
                    const profit = Number(inv.profit);
                    return (
                      <tr key={inv.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0" data-testid={`row-pamm-investment-${inv.id}`}>
                        <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{managerName}</td>
                        <td className="p-4 text-sm font-mono text-gray-900 dark:text-white">${Number(inv.amount).toLocaleString()}</td>
                        <td className="p-4 text-sm font-mono text-gray-900 dark:text-white">${Number(inv.currentValue).toLocaleString()}</td>
                        <td className={`p-4 text-sm font-mono ${profit >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {profit >= 0 ? "+" : ""}${profit.toLocaleString()}
                        </td>
                        <td className="p-4 text-sm text-gray-900 dark:text-white">{inv.sharePercentage}%</td>
                        <td className="p-4">
                          <Badge variant="secondary" className={`text-xs ${inv.status === "active" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>{inv.status}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <Dialog open={investOpen} onOpenChange={setInvestOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invest in {selectedManager?.displayName || selectedDemo?.displayName}</DialogTitle>
            <DialogDescription>Enter the amount you want to invest in this PAMM fund.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {(selectedManager || selectedDemo) && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Monthly Return</span>
                  <span className="font-semibold text-emerald-500">+{selectedManager?.monthlyReturn || selectedDemo?.monthlyReturn}%</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Return</span>
                  <span className="font-semibold text-emerald-500">+{selectedManager?.totalReturn || selectedDemo?.totalReturn}%</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Performance Fee</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedManager?.performanceFee || selectedDemo?.performanceFee}%</span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Investment Amount ($)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                data-testid="input-pamm-amount"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Min: ${selectedManager ? Number(selectedManager.minInvestment).toLocaleString() : selectedDemo?.minInvestment.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[5000, 10000, 25000, 50000].map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  onClick={() => setInvestAmount(String(amt))}
                  data-testid={`button-pamm-amount-${amt}`}
                >
                  ${amt.toLocaleString()}
                </Button>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (selectedManager) {
                  investMutation.mutate();
                } else {
                  toast({ title: "Investment created!" });
                  setInvestOpen(false);
                }
              }}
              disabled={investMutation.isPending}
              data-testid="button-confirm-pamm"
            >
              {investMutation.isPending ? "Processing..." : "Confirm Investment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
