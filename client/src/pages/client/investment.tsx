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
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  PiggyBank,
  BarChart3,
  Shield,
  Zap,
  Flame,
  ChevronRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Briefcase,
  TrendingDown,
} from "lucide-react";
import type { InvestmentPlan, Investment } from "@shared/schema";

const demoPlanData = [
  {
    id: "plan-1",
    name: "Conservative Growth",
    description: "Low-risk diversified portfolio with steady returns. Ideal for long-term wealth preservation with minimal volatility.",
    expectedReturn: "8-12",
    riskLevel: "Low",
    minInvestment: 1000,
    durationDays: 365,
    icon: Shield,
    iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "plan-2",
    name: "Balanced Tech Fund",
    description: "Medium-risk technology-focused fund targeting growth in AI, cloud computing, and fintech sectors.",
    expectedReturn: "15-20",
    riskLevel: "Medium",
    minInvestment: 5000,
    durationDays: 180,
    icon: BarChart3,
    iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  },
  {
    id: "plan-3",
    name: "Aggressive Crypto",
    description: "High-risk, high-reward cryptocurrency fund. Actively managed portfolio across major and emerging digital assets.",
    expectedReturn: "30+",
    riskLevel: "High",
    minInvestment: 2500,
    durationDays: 90,
    icon: Flame,
    iconBg: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  },
];

const demoPortfolio = [
  { name: "Fixed Yield", allocation: 40, color: "#3b82f6" },
  { name: "Variable", allocation: 25, color: "#10b981" },
  { name: "Real Estate", allocation: 20, color: "#f59e0b" },
  { name: "Crypto Fund", allocation: 15, color: "#8b5cf6" },
];

const portfolioColorMap: Record<string, string> = {
  "Fixed Yield": "bg-blue-500",
  "Variable": "bg-emerald-500",
  "Real Estate": "bg-amber-500",
  "Crypto Fund": "bg-purple-500",
};

const demoInvestments = [
  { id: "inv-1", planName: "Conservative Growth", amount: 5000, currentValue: 5420, profit: 420, status: "active", maturityDate: "2025-12-15" },
  { id: "inv-2", planName: "Balanced Tech Fund", amount: 10000, currentValue: 11200, profit: 1200, status: "active", maturityDate: "2025-09-01" },
  { id: "inv-3", planName: "Aggressive Crypto", amount: 2500, currentValue: 2150, profit: -350, status: "active", maturityDate: "2025-06-30" },
];

const portfolioGrowthData = [
  { month: "Jan", value: 15200 },
  { month: "Feb", value: 15800 },
  { month: "Mar", value: 16100 },
  { month: "Apr", value: 15900 },
  { month: "May", value: 16800 },
  { month: "Jun", value: 17200 },
  { month: "Jul", value: 17600 },
  { month: "Aug", value: 18100 },
  { month: "Sep", value: 18400 },
  { month: "Oct", value: 18770 },
];

const chartTooltipStyle = {
  backgroundColor: "#1e293b",
  borderColor: "#334155",
  borderRadius: "8px",
  color: "#fff",
};

function getRiskColor(riskLevel: string) {
  switch (riskLevel.toLowerCase()) {
    case "low":
      return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
    case "medium":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
    case "high":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    default:
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
    case "matured":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    case "withdrawn":
      return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
  }
}

export default function InvestmentPage() {
  const { toast } = useToast();
  const [investOpen, setInvestOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [selectedDemoPlan, setSelectedDemoPlan] = useState<typeof demoPlanData[0] | null>(null);
  const [investAmount, setInvestAmount] = useState("");

  const { data: plans, isLoading: plansLoading } = useQuery<InvestmentPlan[]>({ queryKey: ["/api/investments/plans"] });
  const { data: myInvestments, isLoading: investmentsLoading } = useQuery<Investment[]>({ queryKey: ["/api/investments"] });

  const investMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/investments", { planId: selectedPlan!.id, amount: investAmount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      toast({ title: "Investment created!" });
      setInvestOpen(false);
      setInvestAmount("");
      setSelectedPlan(null);
    },
    onError: () => {
      toast({ title: "Investment failed", variant: "destructive" });
    },
  });

  function openInvestDialog(plan: InvestmentPlan) {
    setSelectedPlan(plan);
    setSelectedDemoPlan(null);
    setInvestAmount("");
    setInvestOpen(true);
  }

  function openDemoInvestDialog(demoPlan: typeof demoPlanData[0]) {
    setSelectedDemoPlan(demoPlan);
    setSelectedPlan(null);
    setInvestAmount("");
    setInvestOpen(true);
  }

  const totalInvested = demoInvestments.reduce((s, i) => s + i.amount, 0);
  const totalValue = demoInvestments.reduce((s, i) => s + i.currentValue, 0);
  const totalProfit = totalValue - totalInvested;
  const profitPercent = ((totalProfit / totalInvested) * 100).toFixed(1);

  const displayPlans = plans && plans.length > 0 ? plans : null;
  const displayInvestments = myInvestments && myInvestments.length > 0 ? myInvestments : null;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-investment-title">Investment</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Grow your wealth with managed investment plans</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Invested", value: `$${totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, trend: "+3 plans", isPositive: true, icon: <Briefcase className="w-5 h-5" />, iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
          { label: "Current Value", value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, trend: `+${profitPercent}%`, isPositive: true, icon: <DollarSign className="w-5 h-5" />, iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
          { label: "Total Profit", value: `$${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, trend: `+${profitPercent}%`, isPositive: totalProfit >= 0, icon: <TrendingUp className="w-5 h-5" />, iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
          { label: "Active Plans", value: "3", trend: "All performing", isPositive: true, icon: <PiggyBank className="w-5 h-5" />, iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
        ].map((card) => (
          <div key={card.label} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6" data-testid={`stat-card-${card.label.toLowerCase().replace(/\s+/g, '-')}`}>
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
              {card.isPositive ? <TrendingUp size={16} className="text-emerald-500" /> : <TrendingDown size={16} className="text-red-500" />}
              <span className={`font-medium ${card.isPositive ? "text-emerald-500" : "text-red-500"}`}>{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-plans-heading">Available Plans</h2>
          </div>

          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                  <div className="h-48 animate-pulse rounded-md bg-muted" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(displayPlans ? displayPlans.map((plan) => {
                const demo = demoPlanData.find(d => d.name === plan.name) || demoPlanData[0];
                const IconComp = demo.icon;
                return (
                  <div key={plan.id} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6 flex flex-col" data-testid={`card-plan-${plan.id}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-lg ${demo.iconBg}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                        <Badge variant="secondary" className={`text-xs mt-1 ${getRiskColor(plan.riskLevel)}`}>{plan.riskLevel} Risk</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">{plan.description}</p>
                    <div className="text-3xl font-bold text-emerald-500 mb-1">{plan.expectedReturn}%</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Expected Annual Return</p>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-gray-600 dark:text-gray-300">Min: ${Number(plan.minInvestment).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-300">{plan.durationDays} days term</span>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => openInvestDialog(plan)} data-testid={`button-invest-${plan.id}`}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Invest Now
                    </Button>
                  </div>
                );
              }) : demoPlanData.map((plan) => {
                const IconComp = plan.icon;
                return (
                  <div key={plan.id} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6 flex flex-col" data-testid={`card-plan-${plan.id}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-lg ${plan.iconBg}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                        <Badge variant="secondary" className={`text-xs mt-1 ${getRiskColor(plan.riskLevel)}`}>{plan.riskLevel} Risk</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">{plan.description}</p>
                    <div className="text-3xl font-bold text-emerald-500 mb-1">{plan.expectedReturn}%</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Expected Annual Return</p>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-gray-600 dark:text-gray-300">Min: ${plan.minInvestment.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-300">{plan.durationDays} days term</span>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => openDemoInvestDialog(plan)} data-testid={`button-invest-${plan.id}`}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Invest Now
                    </Button>
                  </div>
                );
              }))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-portfolio-heading">Portfolio Allocation</h2>
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <div className="flex justify-center mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={demoPortfolio}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="allocation"
                    nameKey="name"
                    stroke="none"
                  >
                    {demoPortfolio.map((entry, index) => (
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
              {demoPortfolio.map((seg) => (
                <div key={seg.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${portfolioColorMap[seg.name]}`} />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{seg.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{seg.allocation}%</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Value</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-portfolio-value">${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-growth-heading">Portfolio Growth</h2>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={portfolioGrowthData}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [`$${value.toLocaleString()}`, "Portfolio Value"]} />
              <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} fill="url(#portfolioGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-investments-heading">My Investments</h2>
        {investmentsLoading ? (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <div className="h-48 animate-pulse rounded-md bg-muted" />
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Value</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profit/Loss</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Maturity</th>
                  </tr>
                </thead>
                <tbody>
                  {(displayInvestments ? displayInvestments.map((inv) => {
                    const profitNum = Number(inv.profit);
                    const isPositive = profitNum >= 0;
                    return (
                      <tr key={inv.id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0" data-testid={`row-investment-${inv.id}`}>
                        <td className="p-4 text-sm font-medium text-gray-900 dark:text-white" data-testid={`text-plan-name-${inv.id}`}>{inv.planId}</td>
                        <td className="p-4 text-sm font-mono text-gray-900 dark:text-white" data-testid={`text-amount-${inv.id}`}>${Number(inv.amount).toLocaleString()}</td>
                        <td className="p-4 text-sm font-mono text-gray-900 dark:text-white" data-testid={`text-current-value-${inv.id}`}>${Number(inv.currentValue).toLocaleString()}</td>
                        <td className={`p-4 text-sm font-mono ${isPositive ? "text-emerald-500" : "text-red-500"}`} data-testid={`text-profit-${inv.id}`}>
                          {isPositive ? "+" : ""}${profitNum.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className={`text-xs ${getStatusColor(inv.status)}`} data-testid={`badge-status-${inv.id}`}>{inv.status}</Badge>
                        </td>
                        <td className="p-4 text-sm text-gray-500 dark:text-gray-400" data-testid={`text-maturity-${inv.id}`}>
                          {inv.maturityDate ? new Date(inv.maturityDate).toLocaleDateString() : "\u2014"}
                        </td>
                      </tr>
                    );
                  }) : demoInvestments.map((inv) => {
                    const isPositive = inv.profit >= 0;
                    return (
                      <tr key={inv.id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0" data-testid={`row-investment-${inv.id}`}>
                        <td className="p-4 text-sm font-medium text-gray-900 dark:text-white" data-testid={`text-plan-name-${inv.id}`}>{inv.planName}</td>
                        <td className="p-4 text-sm font-mono text-gray-900 dark:text-white" data-testid={`text-amount-${inv.id}`}>${inv.amount.toLocaleString()}</td>
                        <td className="p-4 text-sm font-mono text-gray-900 dark:text-white" data-testid={`text-current-value-${inv.id}`}>${inv.currentValue.toLocaleString()}</td>
                        <td className={`p-4 text-sm font-mono ${isPositive ? "text-emerald-500" : "text-red-500"}`} data-testid={`text-profit-${inv.id}`}>
                          {isPositive ? "+" : ""}${inv.profit.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className={`text-xs ${getStatusColor(inv.status)}`} data-testid={`badge-status-${inv.id}`}>{inv.status}</Badge>
                        </td>
                        <td className="p-4 text-sm text-gray-500 dark:text-gray-400" data-testid={`text-maturity-${inv.id}`}>
                          {new Date(inv.maturityDate).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Dialog open={investOpen} onOpenChange={setInvestOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invest in {selectedPlan?.name || selectedDemoPlan?.name}</DialogTitle>
            <DialogDescription>Enter the amount you want to invest in this plan.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Investment Amount ($)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                data-testid="input-invest-amount"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Min: ${selectedPlan ? Number(selectedPlan.minInvestment).toLocaleString() : selectedDemoPlan?.minInvestment.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[1000, 5000, 10000, 25000].map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  onClick={() => setInvestAmount(String(amt))}
                  data-testid={`button-amount-${amt}`}
                >
                  ${amt.toLocaleString()}
                </Button>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (selectedPlan) {
                  investMutation.mutate();
                } else {
                  toast({ title: "Investment created!" });
                  setInvestOpen(false);
                }
              }}
              disabled={investMutation.isPending}
              data-testid="button-confirm-invest"
            >
              {investMutation.isPending ? "Processing..." : "Confirm Investment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
