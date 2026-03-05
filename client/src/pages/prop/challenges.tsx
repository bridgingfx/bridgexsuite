import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  Zap,
  Target,
  CheckCircle2,
  Shield,
  AlertTriangle,
  Calendar,
  ClipboardList,
  TrendingUp,
  Award,
  DollarSign,
  Percent,
  Clock,
  BarChart3,
  Scale,
  Info,
  Trophy,
  Medal,
  Crown,
} from "lucide-react";

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
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [challengeType, setChallengeType] = useState<ChallengeType>("1-step");
  const [selectedSize, setSelectedSize] = useState("50000");

  const currentData = challengeData[challengeType][selectedSize];
  const userName = user?.fullName?.split(" ")[0] || "Trader";

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
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-6 sm:p-8" data-testid="leaderboard-banner">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <h2 className="text-xl font-bold text-white" data-testid="text-leaderboard-title">Top Traders Leaderboard</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { rank: 1, name: "Alex M.", profit: "+12.4%", prize: "$5,200", icon: Crown, color: "text-yellow-300", bg: "bg-yellow-400/20" },
              { rank: 2, name: "Sarah K.", profit: "+10.8%", prize: "$3,800", icon: Medal, color: "text-gray-200", bg: "bg-white/10" },
              { rank: 3, name: "David R.", profit: "+9.2%", prize: "$2,100", icon: Medal, color: "text-amber-400", bg: "bg-amber-400/15" },
            ].map((trader) => (
              <div
                key={trader.rank}
                className={`flex items-center gap-3 ${trader.bg} rounded-lg p-3`}
                data-testid={`leaderboard-rank-${trader.rank}`}
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <trader.icon className={`w-5 h-5 ${trader.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white">#{trader.rank} {trader.name}</span>
                    <span className="text-xs font-bold text-emerald-300">{trader.profit}</span>
                  </div>
                  <p className="text-xs text-blue-200 mt-0.5">Prize: {trader.prize}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
            <p className="text-xs text-blue-200">Updated daily. Trade consistently to climb the ranks!</p>
            <span className="text-xs text-white/60 font-medium">Season 4 - March 2026</span>
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
                onClick={() => setLocation(`/prop/purchase?type=${challengeType}&size=${selectedSize}&price=${currentData.price}`)}
                data-testid="button-buy-now"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Buy Now
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

    </div>
  );
}
