import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  Users,
  Square,
  TrendingUp,
  Target,
  BarChart3,
  UserPlus,
  Star,
  ArrowUpRight,
  Activity,
  Shield,
} from "lucide-react";
import type { SignalProvider, CopyRelationship } from "@shared/schema";

const demoTraders = [
  {
    id: "trader-1",
    displayName: "Alex Morgan",
    strategy: "Swing Trading",
    description: "Focused on major forex pairs with high win rate. Conservative risk management with strict stop-loss levels.",
    winRate: 78,
    totalReturn: 145.2,
    totalTrades: 1247,
    followers: 342,
    riskScore: 3,
    monthlyFee: 29,
    monthlyReturn: 8.5,
    avatarBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  {
    id: "trader-2",
    displayName: "Sarah Chen",
    strategy: "Scalping Expert",
    description: "High-frequency scalping on EUR/USD and GBP/USD. Multiple small profits with tight risk controls.",
    winRate: 82,
    totalReturn: 210.5,
    totalTrades: 3560,
    followers: 567,
    riskScore: 5,
    monthlyFee: 49,
    monthlyReturn: 12.3,
    avatarBg: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  },
  {
    id: "trader-3",
    displayName: "Marcus Webb",
    strategy: "Trend Following",
    description: "Long-term trend following across crypto and forex. Higher risk with potential for significant returns.",
    winRate: 65,
    totalReturn: 320.8,
    totalTrades: 890,
    followers: 198,
    riskScore: 7,
    monthlyFee: 39,
    monthlyReturn: 15.7,
    avatarBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  },
  {
    id: "trader-4",
    displayName: "Elena Ivanova",
    strategy: "News Trading",
    description: "Capitalizes on economic events and news releases. Quick entries and exits around major announcements.",
    winRate: 71,
    totalReturn: 185.4,
    totalTrades: 2100,
    followers: 425,
    riskScore: 6,
    monthlyFee: 35,
    monthlyReturn: 10.1,
    avatarBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
];

const allocationData = [
  { name: "Alex Morgan", value: 35, color: "#3b82f6" },
  { name: "Sarah Chen", value: 30, color: "#8b5cf6" },
  { name: "Marcus Webb", value: 20, color: "#f59e0b" },
  { name: "Elena Ivanova", value: 15, color: "#10b981" },
];

const performanceData = [
  { month: "Jan", alex: 2.1, sarah: 3.2, marcus: 4.5, elena: 1.8 },
  { month: "Feb", alex: 3.5, sarah: 2.8, marcus: -1.2, elena: 2.4 },
  { month: "Mar", alex: 1.8, sarah: 4.1, marcus: 5.8, elena: 3.1 },
  { month: "Apr", alex: 4.2, sarah: 3.5, marcus: 2.3, elena: 1.5 },
  { month: "May", alex: 2.8, sarah: 5.2, marcus: 6.1, elena: 4.2 },
  { month: "Jun", alex: 3.1, sarah: 2.9, marcus: 3.4, elena: 2.8 },
  { month: "Jul", alex: 5.0, sarah: 4.8, marcus: 7.2, elena: 3.5 },
  { month: "Aug", alex: 2.4, sarah: 3.6, marcus: -0.8, elena: 4.1 },
];

const chartTooltipStyle = {
  backgroundColor: "#1e293b",
  borderColor: "#334155",
  borderRadius: "8px",
  color: "#fff",
};

function riskBadgeColor(score: number): string {
  if (score <= 3) return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
  if (score <= 6) return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
  return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
}

function riskLabel(score: number): string {
  if (score <= 3) return "Low";
  if (score <= 6) return "Medium";
  return "High";
}

export default function CopyTradingPage() {
  const { toast } = useToast();
  const [copyOpen, setCopyOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<SignalProvider | null>(null);
  const [selectedDemo, setSelectedDemo] = useState<typeof demoTraders[0] | null>(null);
  const [copyAmount, setCopyAmount] = useState("");

  const { data: providers } = useQuery<SignalProvider[]>({ queryKey: ["/api/copy/providers"] });
  const { data: myRelationships } = useQuery<CopyRelationship[]>({ queryKey: ["/api/copy/relationships"] });

  const copyMutation = useMutation({
    mutationFn: async () => apiRequest("POST", "/api/copy/relationships", { providerId: selectedProvider!.id, allocatedAmount: copyAmount }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/copy/relationships"] }); toast({ title: "Now copying!" }); setCopyOpen(false); },
    onError: () => toast({ title: "Failed", variant: "destructive" }),
  });

  const stopMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("PATCH", `/api/copy/relationships/${id}`, { status: "stopped" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/copy/relationships"] }); toast({ title: "Stopped copying" }); },
  });

  function openCopyDialog(provider: SignalProvider) {
    setSelectedProvider(provider);
    setSelectedDemo(null);
    setCopyAmount("");
    setCopyOpen(true);
  }

  function openDemoCopyDialog(trader: typeof demoTraders[0]) {
    setSelectedDemo(trader);
    setSelectedProvider(null);
    setCopyAmount("");
    setCopyOpen(true);
  }

  function getInitials(name: string): string {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  }

  function getProviderName(providerId: string): string {
    const provider = providers?.find(p => p.id === providerId);
    return provider?.displayName ?? "Unknown";
  }

  const displayProviders = providers && providers.length > 0 ? providers : null;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-copy-title">Copy Trading</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Follow top traders and copy their strategies automatically</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Top Traders", value: "4", trend: "Available now", icon: <Star className="w-5 h-5" />, iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
          { label: "Avg Win Rate", value: "74%", trend: "+5.2% this month", icon: <Target className="w-5 h-5" />, iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
          { label: "Total Followers", value: "1,532", trend: "+120 this week", icon: <Users className="w-5 h-5" />, iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
          { label: "Best Monthly", value: "+15.7%", trend: "Marcus Webb", icon: <TrendingUp className="w-5 h-5" />, iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-performance-heading">Trader Performance</h2>
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [`${value}%`, ""]} />
                <Line type="monotone" dataKey="alex" stroke="#3b82f6" strokeWidth={2} dot={false} name="Alex Morgan" />
                <Line type="monotone" dataKey="sarah" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Sarah Chen" />
                <Line type="monotone" dataKey="marcus" stroke="#f59e0b" strokeWidth={2} dot={false} name="Marcus Webb" />
                <Line type="monotone" dataKey="elena" stroke="#10b981" strokeWidth={2} dot={false} name="Elena Ivanova" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              {[
                { name: "Alex Morgan", color: "bg-blue-500" },
                { name: "Sarah Chen", color: "bg-purple-500" },
                { name: "Marcus Webb", color: "bg-amber-500" },
                { name: "Elena Ivanova", color: "bg-emerald-500" },
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
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-allocation-heading">Portfolio Allocation</h2>
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <div className="flex justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    nameKey="name"
                    stroke="none"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(value: number) => [`${value}%`, "Allocation"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {allocationData.map((seg) => (
                <div key={seg.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{seg.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{seg.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-traders-heading">Top Traders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(displayProviders ? displayProviders.map(provider => (
            <div key={provider.id} className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all p-6" data-testid={`card-provider-${provider.id}`}>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold">{getInitials(provider.displayName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{provider.displayName}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{provider.strategy}</p>
                  </div>
                </div>
                <Badge variant="secondary" className={`text-xs ${riskBadgeColor(provider.riskScore)}`}>
                  {riskLabel(provider.riskScore)} Risk
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{provider.description}</p>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Win Rate</p>
                  <p className="font-bold text-sm text-gray-900 dark:text-white" data-testid={`text-winrate-${provider.id}`}>{provider.winRate}%</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Profit</p>
                  <p className="font-bold text-sm text-emerald-500" data-testid={`text-return-${provider.id}`}>+{provider.totalReturn}%</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">{provider.followers}</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Risk</p>
                  <p className="font-bold text-sm text-gray-900 dark:text-white" data-testid={`text-risk-${provider.id}`}>{provider.riskScore}/10</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>{provider.totalTrades} total trades</span>
                <span>${Number(provider.monthlyFee).toFixed(0)}/month</span>
              </div>
              <Button className="w-full" onClick={() => openCopyDialog(provider)} data-testid={`button-copy-${provider.id}`}>
                <UserPlus className="w-4 h-4 mr-2" />
                Follow Trader
              </Button>
            </div>
          )) : demoTraders.map(trader => (
            <div key={trader.id} className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all p-6" data-testid={`card-provider-${trader.id}`}>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className={`${trader.avatarBg} text-sm font-semibold`}>{getInitials(trader.displayName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{trader.displayName}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{trader.strategy}</p>
                  </div>
                </div>
                <Badge variant="secondary" className={`text-xs ${riskBadgeColor(trader.riskScore)}`}>
                  {riskLabel(trader.riskScore)} Risk
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{trader.description}</p>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Win Rate</p>
                  <p className="font-bold text-sm text-gray-900 dark:text-white" data-testid={`text-winrate-${trader.id}`}>{trader.winRate}%</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Profit</p>
                  <p className="font-bold text-sm text-emerald-500" data-testid={`text-return-${trader.id}`}>+{trader.totalReturn}%</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">{trader.followers}</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Risk</p>
                  <p className="font-bold text-sm text-gray-900 dark:text-white" data-testid={`text-risk-${trader.id}`}>{trader.riskScore}/10</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>{trader.totalTrades} total trades</span>
                <span>${trader.monthlyFee}/month</span>
              </div>
              <Button className="w-full" onClick={() => openDemoCopyDialog(trader)} data-testid={`button-copy-${trader.id}`}>
                <UserPlus className="w-4 h-4 mr-2" />
                Follow Trader
              </Button>
            </div>
          )))}
        </div>
      </div>

      {myRelationships && myRelationships.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-copies-heading">My Active Copies</h2>
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trader</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Allocated</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">P&L</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trades</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myRelationships.map(rel => {
                    const pnl = Number(rel.currentPnl);
                    return (
                      <tr key={rel.id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0" data-testid={`row-copy-${rel.id}`}>
                        <td className="p-4 text-sm font-medium text-gray-900 dark:text-white" data-testid={`text-provider-name-${rel.id}`}>{getProviderName(rel.providerId)}</td>
                        <td className="p-4 text-sm font-mono text-gray-900 dark:text-white" data-testid={`text-allocated-${rel.id}`}>${Number(rel.allocatedAmount).toLocaleString()}</td>
                        <td className={`p-4 text-sm font-mono ${pnl >= 0 ? "text-emerald-500" : "text-red-500"}`} data-testid={`text-pnl-${rel.id}`}>
                          {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)}
                        </td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300" data-testid={`text-copied-trades-${rel.id}`}>{rel.totalCopiedTrades}</td>
                        <td className="p-4">
                          <Badge variant="secondary" className={`text-xs ${rel.status === "active" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`} data-testid={`badge-status-${rel.id}`}>{rel.status}</Badge>
                        </td>
                        <td className="p-4">
                          {rel.status === "active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => stopMutation.mutate(rel.id)}
                              disabled={stopMutation.isPending}
                              data-testid={`button-stop-${rel.id}`}
                            >
                              <Square className="w-4 h-4 mr-2" />
                              Stop
                            </Button>
                          )}
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

      <Dialog open={copyOpen} onOpenChange={setCopyOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Copy {selectedProvider?.displayName || selectedDemo?.displayName}</DialogTitle>
            <DialogDescription>Enter the amount you want to allocate to this trader.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {(selectedProvider || selectedDemo) && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Win Rate</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedProvider?.winRate || selectedDemo?.winRate}%</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total Return</span>
                  <span className="font-semibold text-emerald-500">+{selectedProvider?.totalReturn || selectedDemo?.totalReturn}%</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Risk Score</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedProvider?.riskScore || selectedDemo?.riskScore}/10</span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Allocation Amount ($)</Label>
              <Input type="number" placeholder="Enter amount" value={copyAmount} onChange={e => setCopyAmount(e.target.value)} data-testid="input-copy-amount" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[500, 1000, 5000, 10000].map(amt => (
                <Button key={amt} variant="outline" size="sm" onClick={() => setCopyAmount(String(amt))} data-testid={`button-copy-amount-${amt}`}>
                  ${amt.toLocaleString()}
                </Button>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (selectedProvider) {
                  copyMutation.mutate();
                } else {
                  toast({ title: "Now copying!" });
                  setCopyOpen(false);
                }
              }}
              disabled={copyMutation.isPending}
              data-testid="button-confirm-copy"
            >
              {copyMutation.isPending ? "Processing..." : "Start Copying"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
