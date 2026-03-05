import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Trophy,
  Zap,
  Target,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  DollarSign,
  Layers,
  ArrowRight,
  Star,
  Shield,
  Clock,
  AlertTriangle,
} from "lucide-react";
import type { PropChallenge, PropAccount } from "@shared/schema";

const demoFeatures = [
  { label: "8% Profit Target", icon: Target },
  { label: "Max 10% Drawdown", icon: Shield },
  { label: "Max 5% Daily Loss", icon: AlertTriangle },
  { label: "No Time Limit", icon: Clock },
];

const tradingRules = [
  { metric: "Max Daily Loss", phase1: "5%", phase2: "5%", funded: "5%" },
  { metric: "Max Total Drawdown", phase1: "10%", phase2: "10%", funded: "10%" },
  { metric: "Profit Target", phase1: "8%", phase2: "5%", funded: "N/A" },
  { metric: "Minimum Trading Days", phase1: "5 days", phase2: "5 days", funded: "N/A" },
  { metric: "Maximum Trading Period", phase1: "No Limit", phase2: "No Limit", funded: "No Limit" },
];

export default function PropTradingPage() {
  const { toast } = useToast();

  const { data: challenges, isLoading: challengesLoading } = useQuery<PropChallenge[]>({
    queryKey: ["/api/prop/challenges"],
  });

  const { data: propAccounts, isLoading: accountsLoading } = useQuery<PropAccount[]>({
    queryKey: ["/api/prop/accounts"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      return apiRequest("POST", "/api/prop/accounts", { challengeId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prop/accounts"] });
      toast({ title: "Challenge purchased successfully!" });
    },
    onError: () => {
      toast({ title: "Purchase failed", variant: "destructive" });
    },
  });

  const demoChallenges = [
    { id: "10k", name: "10K Challenge", accountSize: "10000", price: "99", profitTarget: "8", maxDailyDrawdown: "5", maxTotalDrawdown: "10", profitSplit: "80", leverage: "1:100", phases: 2, minTradingDays: 5, maxTradingDays: 30, popular: false },
    { id: "50k", name: "50K Challenge", accountSize: "50000", price: "299", profitTarget: "8", maxDailyDrawdown: "5", maxTotalDrawdown: "10", profitSplit: "80", leverage: "1:100", phases: 2, minTradingDays: 5, maxTradingDays: 30, popular: true },
    { id: "100k", name: "100K Challenge", accountSize: "100000", price: "499", profitTarget: "8", maxDailyDrawdown: "5", maxTotalDrawdown: "10", profitSplit: "80", leverage: "1:100", phases: 2, minTradingDays: 5, maxTradingDays: 30, popular: false },
  ];

  const displayChallenges = challenges && challenges.length > 0 ? challenges.map((c, i) => ({
    ...c,
    popular: i === 1,
  })) : demoChallenges;

  const activeAccount = propAccounts?.[0];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-prop-title">
            Prop Firm Challenges
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Prove your skills and get funded up to $200,000.
          </p>
        </div>
        <Button variant="outline" data-testid="button-view-dashboard">
          <BarChart3 className="w-4 h-4 mr-2" />
          View Dashboard
        </Button>
      </div>

      {challengesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayChallenges.map((challenge) => {
            const isPopular = challenge.popular;
            return (
              <div
                key={challenge.id}
                className={`relative bg-white dark:bg-dark-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-all ${
                  isPopular
                    ? "border-brand-500 ring-2 ring-brand-500/20 bg-brand-50 dark:bg-brand-900/10"
                    : "border-gray-100 dark:border-gray-800"
                }`}
                data-testid={`card-challenge-${challenge.id}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-brand-600 text-white border-0">
                      <Star className="w-3 h-3 mr-1" />
                      POPULAR
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6 mt-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {challenge.name}
                  </p>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white" data-testid={`text-funding-${challenge.id}`}>
                    ${Number(challenge.accountSize).toLocaleString()}
                  </h2>
                  <p className="text-lg font-semibold text-brand-600 dark:text-brand-400 mt-1" data-testid={`text-price-${challenge.id}`}>
                    ${Number(challenge.price).toFixed(0)}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {demoFeatures.map((feature) => (
                    <div key={feature.label} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature.label}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{challenge.profitSplit}% Profit Split</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Leverage {challenge.leverage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{challenge.phases} Phase Evaluation</span>
                  </div>
                </div>

                <Button
                  className={`w-full ${isPopular ? "bg-brand-600 text-white" : ""}`}
                  variant={isPopular ? "default" : "outline"}
                  onClick={() => purchaseMutation.mutate(challenge.id)}
                  disabled={purchaseMutation.isPending}
                  data-testid={`button-start-challenge-${challenge.id}`}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Start Challenge
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-active-challenge-title">
          Active Challenge Status
        </h2>
        {accountsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activeAccount ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-account-size">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Account</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    ${Number(activeAccount.currentBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Evaluation</p>
                </div>
                <div className="p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-phase">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phase</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {activeAccount.status === "funded" ? "Funded" : `Phase ${activeAccount.currentPhase}`}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activeAccount.status === "funded" ? "Live Trading" : "Evaluation"}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-equity">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Equity</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    ${Number(activeAccount.currentBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className={`text-xs font-medium ${Number(activeAccount.currentProfit) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {Number(activeAccount.currentProfit) >= 0 ? "+" : ""}
                      {((Number(activeAccount.currentProfit) / Math.max(Number(activeAccount.currentBalance), 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-profit-target">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Profit Target</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {Math.min(((Number(activeAccount.currentProfit) / Math.max(Number(activeAccount.currentBalance) * 0.08, 1)) * 100), 100).toFixed(1)}%
                  </h3>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <Progress
                value={Math.min(((Number(activeAccount.currentProfit) / Math.max(Number(activeAccount.currentBalance) * 0.08, 1)) * 100), 100)}
                className="h-2"
                data-testid="progress-profit-target"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                ${Number(activeAccount.currentProfit).toLocaleString("en-US", { minimumFractionDigits: 2 })} / ${(Number(activeAccount.currentBalance) * 0.08).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-account-demo">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Account</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">$50K</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Evaluation</p>
                </div>
                <div className="p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-phase-demo">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phase</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Phase 1</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Evaluation</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-equity-demo">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Equity</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">$51,200.00</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-500">+2.4%</span>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-profit-demo">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Profit Target</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">60.0%</h3>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <Progress value={60} className="h-2" data-testid="progress-profit-target-demo" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">$2,400.00 / $4,000.00</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-trading-rules-title">
          Trading Rules
        </h2>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-trading-rules">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Metric</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Phase 1</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Phase 2</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Funded</th>
                </tr>
              </thead>
              <tbody>
                {tradingRules.map((rule, index) => (
                  <tr
                    key={rule.metric}
                    className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${
                      index % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-800/20"
                    }`}
                    data-testid={`row-rule-${index}`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{rule.metric}</td>
                    <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">{rule.phase1}</td>
                    <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">{rule.phase2}</td>
                    <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">{rule.funded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
