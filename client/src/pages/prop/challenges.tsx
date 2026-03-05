import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Trophy,
  Zap,
  Target,
  CheckCircle2,
  Star,
  Shield,
  Clock,
  AlertTriangle,
  RotateCcw,
  TimerReset,
  Gauge,
  Newspaper,
  Calendar,
  Bot,
  Moon,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import type { PropChallenge, PropAccount } from "@shared/schema";

type TabKey = "active" | "passed" | "failed";

const rulesData = [
  { metric: "Profit Target", phase1: "8%", phase2: "5%", funded: "N/A", icon: Target },
  { metric: "Max Daily Loss", phase1: "5%", phase2: "5%", funded: "5%", icon: AlertTriangle },
  { metric: "Max Overall Loss", phase1: "10%", phase2: "10%", funded: "10%", icon: Shield },
  { metric: "Min Trading Days", phase1: "5 days", phase2: "5 days", funded: "N/A", icon: Calendar },
  { metric: "Consistency Rule", phase1: "Yes", phase2: "Yes", funded: "Yes", icon: Gauge },
];

const addOnsData = [
  { id: "leverage", label: "Higher Leverage (1:200)", description: "Double your default leverage", price: "+$50", icon: TrendingUp },
  { id: "news", label: "News Trading Allowed", description: "Trade during high-impact news events", price: "+$30", icon: Newspaper },
  { id: "weekend", label: "Weekend Holding", description: "Keep positions over weekends", price: "+$25", icon: Moon },
  { id: "ea", label: "EA / Algo Trading", description: "Use expert advisors and automated strategies", price: "+$40", icon: Bot },
];

export default function PropChallengesPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());

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
    { id: "10k", name: "10K Challenge", accountSize: "10000", price: "99", profitTarget: "8", maxDailyDrawdown: "5", maxTotalDrawdown: "10", profitSplit: "80", leverage: "1:100", phases: 2, minTradingDays: 5, maxTradingDays: 30 },
    { id: "25k", name: "25K Challenge", accountSize: "25000", price: "199", profitTarget: "8", maxDailyDrawdown: "5", maxTotalDrawdown: "10", profitSplit: "80", leverage: "1:100", phases: 2, minTradingDays: 5, maxTradingDays: 30 },
    { id: "50k", name: "50K Challenge", accountSize: "50000", price: "299", profitTarget: "8", maxDailyDrawdown: "5", maxTotalDrawdown: "10", profitSplit: "80", leverage: "1:100", phases: 2, minTradingDays: 5, maxTradingDays: 30 },
    { id: "100k", name: "100K Challenge", accountSize: "100000", price: "499", profitTarget: "8", maxDailyDrawdown: "5", maxTotalDrawdown: "10", profitSplit: "85", leverage: "1:100", phases: 2, minTradingDays: 5, maxTradingDays: 30 },
    { id: "200k", name: "200K Challenge", accountSize: "200000", price: "899", profitTarget: "8", maxDailyDrawdown: "5", maxTotalDrawdown: "10", profitSplit: "90", leverage: "1:100", phases: 2, minTradingDays: 5, maxTradingDays: 30 },
  ];

  const displayChallenges = challenges && challenges.length > 0
    ? challenges
    : demoChallenges;

  const popularIndex = Math.floor(displayChallenges.length / 2);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 no-default-hover-elevate no-default-active-elevate" data-testid="badge-status-active">Active</Badge>;
      case "funded":
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 no-default-hover-elevate no-default-active-elevate" data-testid="badge-status-funded">Funded</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 no-default-hover-elevate no-default-active-elevate" data-testid="badge-status-failed">Failed</Badge>;
      case "passed":
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 no-default-hover-elevate no-default-active-elevate" data-testid="badge-status-passed">Passed</Badge>;
      default:
        return <Badge className="no-default-hover-elevate no-default-active-elevate">{status}</Badge>;
    }
  };

  const filteredAccounts = propAccounts?.filter((account) => {
    if (activeTab === "active") return account.status === "active";
    if (activeTab === "passed") return account.status === "funded" || account.status === "passed";
    if (activeTab === "failed") return account.status === "failed";
    return true;
  }) ?? [];

  const demoAccounts: Array<{ id: string; accountNumber: string; status: string; currentPhase: number; currentBalance: string; currentProfit: string; tradingDays: number; startDate: string; challengeName: string }> = propAccounts && propAccounts.length > 0
    ? []
    : [
        { id: "demo-1", accountNumber: "PROP-50K-001", status: "active", currentPhase: 1, currentBalance: "51200.00", currentProfit: "1200.00", tradingDays: 8, startDate: "2025-01-15", challengeName: "50K Challenge" },
        { id: "demo-2", accountNumber: "PROP-100K-002", status: "funded", currentPhase: 2, currentBalance: "104500.00", currentProfit: "4500.00", tradingDays: 22, startDate: "2024-12-01", challengeName: "100K Challenge" },
        { id: "demo-3", accountNumber: "PROP-25K-003", status: "failed", currentPhase: 1, currentBalance: "22100.00", currentProfit: "-2900.00", tradingDays: 4, startDate: "2025-01-10", challengeName: "25K Challenge" },
      ];

  const displayAccounts = propAccounts && propAccounts.length > 0
    ? filteredAccounts
    : demoAccounts.filter((a) => {
        if (activeTab === "active") return a.status === "active";
        if (activeTab === "passed") return a.status === "funded" || a.status === "passed";
        if (activeTab === "failed") return a.status === "failed";
        return true;
      });

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "passed", label: "Passed" },
    { key: "failed", label: "Failed" },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-challenges-title">
          Prop Challenges
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Choose a challenge, prove your skills, and get funded.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-choose-challenge">
          Choose a Challenge
        </h2>
        {challengesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    ))}
                  </div>
                  <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {displayChallenges.map((challenge, index) => {
              const isPopular = index === popularIndex;
              return (
                <Card
                  key={challenge.id}
                  className={`relative p-5 ${
                    isPopular
                      ? "border-brand-500 ring-2 ring-brand-500/20"
                      : ""
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

                  <div className="text-center mb-4 mt-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {challenge.name}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white" data-testid={`text-funding-${challenge.id}`}>
                      ${Number(challenge.accountSize).toLocaleString()}
                    </h3>
                    <p className="text-lg font-semibold text-brand-600 dark:text-brand-400 mt-1" data-testid={`text-price-${challenge.id}`}>
                      ${Number(challenge.price).toFixed(0)}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{challenge.profitTarget}% Profit Target</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Max {challenge.maxDailyDrawdown}% Daily Loss</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Max {challenge.maxTotalDrawdown}% Drawdown</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{challenge.profitSplit}% Profit Split</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Leverage {challenge.leverage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{challenge.phases} Phase Evaluation</span>
                    </div>
                  </div>

                  <Button
                    className={`w-full ${isPopular ? "bg-brand-600 text-white" : ""}`}
                    variant={isPopular ? "default" : "outline"}
                    onClick={() => purchaseMutation.mutate(challenge.id)}
                    disabled={purchaseMutation.isPending}
                    data-testid={`button-purchase-${challenge.id}`}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Start Challenge
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-my-challenges">
          My Challenges
        </h2>
        <div className="flex gap-2 mb-4 flex-wrap">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              onClick={() => setActiveTab(tab.key)}
              data-testid={`button-tab-${tab.key}`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {accountsLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : displayAccounts.length === 0 ? (
          <Card className="p-8 text-center">
            <Trophy className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-gray-500 dark:text-gray-400" data-testid="text-no-challenges">
              No {activeTab} challenges found.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayAccounts.map((account: any) => {
              const balance = Number(account.currentBalance);
              const profit = Number(account.currentProfit);
              const profitPct = balance > 0 ? ((profit / balance) * 100) : 0;
              return (
                <Card key={account.id} className="p-5" data-testid={`card-my-challenge-${account.id}`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white" data-testid={`text-account-number-${account.id}`}>
                          {account.accountNumber || account.challengeName}
                        </h3>
                        {getStatusBadge(account.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                        <span>Phase {account.currentPhase}</span>
                        <span>Balance: ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                        <span className={profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                          {profit >= 0 ? "+" : ""}{profitPct.toFixed(1)}%
                        </span>
                        <span>{account.tradingDays} days traded</span>
                      </div>
                      {account.status === "active" && (
                        <div className="mt-3 max-w-md">
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Profit Target Progress</span>
                            <span>{Math.min(Math.max(profitPct / 8 * 100, 0), 100).toFixed(0)}%</span>
                          </div>
                          <Progress
                            value={Math.min(Math.max(profitPct / 8 * 100, 0), 100)}
                            className="h-2"
                            data-testid={`progress-challenge-${account.id}`}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {account.status === "failed" && (
                        <>
                          <Button variant="outline" data-testid={`button-retry-${account.id}`}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Retry
                          </Button>
                          <Button variant="outline" data-testid={`button-extend-${account.id}`}>
                            <TimerReset className="w-4 h-4 mr-2" />
                            Extend Time
                          </Button>
                        </>
                      )}
                      {account.status === "active" && (
                        <Button variant="outline" data-testid={`button-view-details-${account.id}`}>
                          Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-rules-objectives">
          Rules & Objectives
        </h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-rules">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Rule</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Phase 1</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Phase 2</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Funded</th>
                </tr>
              </thead>
              <tbody>
                {rulesData.map((rule, index) => (
                  <tr
                    key={rule.metric}
                    className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${
                      index % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-800/20"
                    }`}
                    data-testid={`row-rule-${index}`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <rule.icon className="w-4 h-4 text-gray-400" />
                        {rule.metric}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">{rule.phase1}</td>
                    <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">{rule.phase2}</td>
                    <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">{rule.funded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-addons">
          Add-ons
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {addOnsData.map((addon) => {
            const isSelected = selectedAddOns.has(addon.id);
            return (
              <Card
                key={addon.id}
                className={`p-4 cursor-pointer transition-colors toggle-elevate ${isSelected ? "toggle-elevated border-brand-500" : ""}`}
                onClick={() => toggleAddOn(addon.id)}
                data-testid={`card-addon-${addon.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-md flex-shrink-0 ${isSelected ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}>
                    <addon.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{addon.label}</h4>
                      <span className="text-xs font-medium text-brand-600 dark:text-brand-400">{addon.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{addon.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" data-testid="text-retry-extend">
          Retry / Extend Time
        </h2>
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Need another chance?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Retry a failed challenge at a discounted rate or extend the trading period of an active challenge.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button variant="outline" data-testid="button-retry-challenge">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry Challenge
              </Button>
              <Button variant="outline" data-testid="button-extend-time">
                <TimerReset className="w-4 h-4 mr-2" />
                Extend Time
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
