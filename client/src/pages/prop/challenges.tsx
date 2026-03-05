import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Trophy,
  Zap,
  Target,
  CheckCircle2,
  Shield,
  AlertTriangle,
  Calendar,
  RotateCcw,
  TimerReset,
  ChevronRight,
  Send,
  ClipboardList,
  TrendingUp,
  Award,
  DollarSign,
  Percent,
  Clock,
  BarChart3,
  Scale,
  Info,
} from "lucide-react";
import type { PropChallenge, PropAccount } from "@shared/schema";

type TabKey = "active" | "passed" | "failed";
type ChallengeType = "1-step" | "2-step";

const accountSizes = [
  { label: "$10K", value: "10000" },
  { label: "$25K", value: "25000" },
  { label: "$50K", value: "50000" },
  { label: "$100K", value: "100000" },
  { label: "$200K", value: "200000" },
];

const challengeData: Record<ChallengeType, Record<string, {
  price: string;
  leverage: string;
  tradingPeriod: string;
  minTradingDays: string;
  maxDailyLoss: string;
  maxLoss: string;
  profitTarget: string;
  profitSplit: string;
  phases: number;
  phase2ProfitTarget?: string;
}>> = {
  "1-step": {
    "10000": { price: "89", leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "4%", maxLoss: "6%", profitTarget: "10%", profitSplit: "80%", phases: 1 },
    "25000": { price: "179", leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "4%", maxLoss: "6%", profitTarget: "10%", profitSplit: "80%", phases: 1 },
    "50000": { price: "299", leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "4%", maxLoss: "6%", profitTarget: "10%", profitSplit: "85%", phases: 1 },
    "100000": { price: "499", leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "4%", maxLoss: "6%", profitTarget: "10%", profitSplit: "85%", phases: 1 },
    "200000": { price: "899", leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "4%", maxLoss: "6%", profitTarget: "10%", profitSplit: "90%", phases: 1 },
  },
  "2-step": {
    "10000": { price: "99", leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "5%", maxLoss: "10%", profitTarget: "8%", profitSplit: "80%", phases: 2, phase2ProfitTarget: "5%" },
    "25000": { price: "199", leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "5%", maxLoss: "10%", profitTarget: "8%", profitSplit: "80%", phases: 2, phase2ProfitTarget: "5%" },
    "50000": { price: "299", leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "5%", maxLoss: "10%", profitTarget: "8%", profitSplit: "85%", phases: 2, phase2ProfitTarget: "5%" },
    "100000": { price: "499", leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "5%", maxLoss: "10%", profitTarget: "8%", profitSplit: "85%", phases: 2, phase2ProfitTarget: "5%" },
    "200000": { price: "899", leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "5%", maxLoss: "10%", profitTarget: "8%", profitSplit: "90%", phases: 2, phase2ProfitTarget: "5%" },
  },
};

export default function PropChallengesPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const [challengeType, setChallengeType] = useState<ChallengeType>("1-step");
  const [selectedSize, setSelectedSize] = useState("50000");

  const { data: challenges, isLoading: challengesLoading } = useQuery<PropChallenge[]>({
    queryKey: ["/api/prop/challenges"],
  });

  const { data: propAccounts, isLoading: accountsLoading } = useQuery<PropAccount[]>({
    queryKey: ["/api/prop/accounts"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (data: { challengeType: string; accountSize: string }) => {
      return apiRequest("POST", "/api/prop/accounts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prop/accounts"] });
      toast({ title: "Challenge purchased successfully!" });
    },
    onError: () => {
      toast({ title: "Purchase failed", variant: "destructive" });
    },
  });

  const currentData = challengeData[challengeType][selectedSize];
  const userName = user?.fullName?.split(" ")[0] || "Trader";

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

  const tabs: { key: TabKey; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "passed", label: "Passed" },
    { key: "failed", label: "Failed" },
  ];

  const phaseRules = [
    { icon: Scale, label: "Leverage", value: currentData.leverage },
    { icon: Clock, label: "Trading Period", value: currentData.tradingPeriod },
    { icon: Calendar, label: "Min Trading Days", value: currentData.minTradingDays },
    { icon: AlertTriangle, label: "Max Daily Loss", value: currentData.maxDailyLoss },
    { icon: Shield, label: "Max Loss", value: currentData.maxLoss },
    { icon: Target, label: "Profit Target", value: currentData.profitTarget },
    { icon: Percent, label: "Profit Split", value: currentData.profitSplit },
  ];

  const fundedRules = [
    { icon: Scale, label: "Leverage", value: currentData.leverage },
    { icon: Clock, label: "Trading Period", value: "Unlimited" },
    { icon: Calendar, label: "Min Trading Days", value: "N/A" },
    { icon: AlertTriangle, label: "Max Daily Loss", value: currentData.maxDailyLoss },
    { icon: Shield, label: "Max Loss", value: currentData.maxLoss },
    { icon: Target, label: "Profit Target", value: "N/A" },
    { icon: Percent, label: "Profit Split", value: currentData.profitSplit },
  ];

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div className="relative overflow-visible rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-6 sm:p-8">
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="text-welcome-banner">
              Welcome, {userName}
            </h1>
            <p className="text-blue-100 mt-2 max-w-lg text-sm sm:text-base">
              Take the first step toward becoming a funded trader. Choose your challenge, prove your skills, and trade with our capital.
            </p>
          </div>
          <div className="hidden sm:block">
            <Send className="w-16 h-16 text-white/30" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center" data-testid="text-get-started">
          Get Started in 3 Easy Steps
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 text-center" data-testid="card-step-1">
            <div className="mx-auto w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
              <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Step 1</div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Choose a Plan</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select your challenge type and account size that fits your trading style.</p>
          </Card>
          <Card className="p-5 text-center" data-testid="card-step-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Step 2</div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Start Trading</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Trade within the rules and hit your profit target to pass the evaluation.</p>
          </Card>
          <Card className="p-5 text-center" data-testid="card-step-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
              <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">Step 3</div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Evaluation Passed</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get funded and start earning real profits with up to {currentData.profitSplit} profit split.</p>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 text-center" data-testid="text-proven-model">
          Proven Model | Fair Rules | Real Profits
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          Select your preferred challenge type and account size below.
        </p>

        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md border border-gray-200 dark:border-gray-700 p-1 gap-1">
            <Button
              variant={challengeType === "1-step" ? "default" : "ghost"}
              onClick={() => setChallengeType("1-step")}
              data-testid="button-1-step"
            >
              The 1-Step Challenge
            </Button>
            <Button
              variant={challengeType === "2-step" ? "default" : "ghost"}
              onClick={() => setChallengeType("2-step")}
              data-testid="button-2-step"
            >
              The Classic 2-Step Challenge
            </Button>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6 max-w-2xl mx-auto">
          {challengeType === "1-step"
            ? "Our 1-Step Challenge is designed for experienced traders who want a faster path to funding. Pass a single evaluation phase and get funded immediately."
            : "The Classic 2-Step Challenge provides a structured evaluation with two phases. Demonstrate consistent trading across both phases to earn your funded account."}
        </p>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {accountSizes.map((size) => (
            <Button
              key={size.value}
              variant={selectedSize === size.value ? "default" : "outline"}
              onClick={() => setSelectedSize(size.value)}
              data-testid={`button-size-${size.value}`}
            >
              {size.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3 p-6" data-testid="card-phase-details">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Phase 1 {challengeType === "2-step" ? "Details" : "- Evaluation"}
            </h3>
            <div className="space-y-3">
              {phaseRules.map((rule) => (
                <div key={rule.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <rule.icon className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{rule.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white" data-testid={`text-phase1-${rule.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    {rule.value}
                  </span>
                </div>
              ))}
            </div>

            {challengeType === "2-step" && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  Phase 2 Details
                </h3>
                <div className="space-y-3">
                  {phaseRules.map((rule) => (
                    <div key={`p2-${rule.label}`} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <rule.icon className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{rule.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white" data-testid={`text-phase2-${rule.label.toLowerCase().replace(/\s+/g, "-")}`}>
                        {rule.label === "Profit Target" ? currentData.phase2ProfitTarget || rule.value : rule.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 text-center" data-testid="card-pricing">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {challengeType === "1-step" ? "1-Step Challenge" : "2-Step Challenge"} - ${Number(selectedSize).toLocaleString()}
              </p>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1" data-testid="text-price-display">
                ${currentData.price}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Pay once, own it forever</p>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-0"
                onClick={() => purchaseMutation.mutate({ challengeType, accountSize: selectedSize })}
                disabled={purchaseMutation.isPending}
                data-testid="button-buy-now"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                {purchaseMutation.isPending ? "Processing..." : "Buy Now"}
              </Button>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Instant account activation</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Up to {currentData.profitSplit} profit split</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>No time limits</span>
              </div>
            </Card>

            <Card className="p-4" data-testid="card-trading-name">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Trading Name</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Your funded account will be registered under your verified profile name. Ensure your KYC documents are up to date.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6">
          <Card className="p-6" data-testid="card-funded-phase">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Funded Phase
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-3">
              {fundedRules.map((rule) => (
                <div key={`funded-${rule.label}`} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <rule.icon className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{rule.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white" data-testid={`text-funded-${rule.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    {rule.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
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
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2" />
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-md" />
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
    </div>
  );
}
