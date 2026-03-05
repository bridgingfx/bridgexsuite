import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Target,
  Shield,
  Clock,
  Megaphone,
} from "lucide-react";
import { Link } from "wouter";
import type { PropAccount, PropChallenge } from "@shared/schema";

const demoAnnouncements = [
  { title: "New 200K Challenge Available", description: "We've launched a new $200,000 account size challenge with competitive pricing.", date: "2024-01-15", type: "new" as const },
  { title: "Updated Drawdown Rules", description: "Max daily drawdown now resets at server midnight (00:00 UTC) instead of rolling 24h.", date: "2024-01-10", type: "update" as const },
  { title: "Weekend Holding Policy Change", description: "Funded traders can now hold positions over weekends without additional fees.", date: "2024-01-05", type: "info" as const },
];

const nextSteps = [
  { label: "Complete at least 1 trade today to maintain activity", icon: Target, done: false },
  { label: "Stay within 5% daily drawdown limit", icon: Shield, done: true },
  { label: "Reach 8% profit target to pass Phase 1", icon: TrendingUp, done: false },
  { label: "Trade for minimum 5 days", icon: Calendar, done: false },
];

export default function PropDashboard() {
  const { data: accounts, isLoading: accountsLoading } = useQuery<PropAccount[]>({
    queryKey: ["/api/prop/accounts"],
  });

  const { data: challenges, isLoading: challengesLoading } = useQuery<PropChallenge[]>({
    queryKey: ["/api/prop/challenges"],
  });

  const activeAccount = accounts?.[0];
  const balance = activeAccount ? Number(activeAccount.currentBalance) : 50000;
  const profit = activeAccount ? Number(activeAccount.currentProfit) : 1200;
  const equity = balance + profit;
  const drawdownUsed = activeAccount ? Math.abs(Math.min(profit, 0)) / (balance * 0.10) * 100 : 2.4;
  const tradingDays = activeAccount?.tradingDays ?? 3;
  const currentPhase = activeAccount?.currentPhase ?? 1;
  const status = activeAccount?.status ?? "active";
  const profitTarget = balance * 0.08;
  const profitProgress = Math.min((profit / profitTarget) * 100, 100);

  const isLoading = accountsLoading || challengesLoading;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto" data-testid="prop-dashboard-page">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-prop-dashboard-title">
            Prop Trading Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor your challenge progress and trading performance.
          </p>
        </div>
        <Link href="/prop/challenges">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 cursor-pointer" data-testid="link-view-challenges">
            View Challenges <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" data-testid="kpi-section">
          <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="kpi-balance">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Balance</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="kpi-equity">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Equity</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  ${equity.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="kpi-profit">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Profit</p>
                <h3 className={`text-xl font-bold ${profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {profit >= 0 ? "+" : ""}${profit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${profit >= 0 ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}>
                {profit >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="kpi-drawdown">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Drawdown</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {drawdownUsed.toFixed(1)}%
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">of 10% max</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="kpi-days-traded">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Days Traded</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {tradingDays}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">min 5 required</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="challenge-status-section">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Challenge Status</h2>

          <div className="flex items-center gap-3 mb-6">
            <Badge className={`${status === "funded" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : status === "failed" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}`} data-testid="badge-account-status">
              {status === "funded" ? "Funded" : status === "failed" ? "Failed" : `Phase ${currentPhase}`}
            </Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {status === "funded" ? "Live funded account" : status === "failed" ? "Challenge failed" : "Evaluation in progress"}
            </span>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((phase) => {
              const label = phase <= 2 ? `Phase ${phase}` : "Funded";
              const isCurrent = status !== "funded" && phase === currentPhase;
              const isPassed = status === "funded" || (status === "active" && phase < currentPhase);
              const isFuture = !isPassed && !isCurrent;

              return (
                <div key={phase} className="flex items-center gap-4" data-testid={`phase-step-${phase}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isPassed ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" :
                    isCurrent ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/30" :
                    "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                  }`}>
                    {isPassed ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{phase}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isFuture ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"}`}>
                      {label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isPassed ? "Completed" : isCurrent ? "In progress" : "Upcoming"}
                    </p>
                  </div>
                  {isCurrent && (
                    <div className="w-24">
                      <Progress value={profitProgress} className="h-2" data-testid="progress-phase-current" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">{profitProgress.toFixed(0)}%</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Profit Target Progress</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  ${profit.toLocaleString("en-US", { minimumFractionDigits: 2 })} / ${profitTarget.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Badge className="bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400" data-testid="badge-profit-progress">
                {profitProgress.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={profitProgress} className="h-2 mt-3" data-testid="progress-profit-target" />
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="next-steps-section">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Next Steps</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">What you need to focus on today.</p>

          <div className="space-y-3">
            {nextSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg ${step.done ? "bg-emerald-50 dark:bg-emerald-900/10" : "bg-gray-50 dark:bg-gray-800/50"}`}
                data-testid={`next-step-${index}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  step.done
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {step.done ? <CheckCircle2 className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                </div>
                <span className={`text-sm ${step.done ? "text-emerald-700 dark:text-emerald-300 line-through" : "text-gray-700 dark:text-gray-300"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Quick Tip</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Focus on consistency rather than large trades. Steady gains help you pass the evaluation faster and with less risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="announcements-section">
        <div className="flex items-center gap-3 mb-6">
          <Megaphone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Announcements & Rules Updates</h2>
        </div>

        <div className="space-y-4">
          {demoAnnouncements.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              data-testid={`announcement-${index}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                item.type === "new"
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  : item.type === "update"
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              }`}>
                {item.type === "new" ? <Layers className="w-4 h-4" /> : item.type === "update" ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <Badge variant="outline" className="text-xs" data-testid={`badge-announcement-type-${index}`}>
                    {item.type === "new" ? "New" : item.type === "update" ? "Update" : "Info"}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isLoading && challenges && challenges.length > 0 && (
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="available-challenges-section">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Available Challenges</h2>
            <Link href="/prop/challenges">
              <span className="text-sm font-medium text-brand-600 dark:text-brand-400 cursor-pointer" data-testid="link-browse-challenges">
                Browse All <ArrowRight className="w-3 h-3 inline ml-1" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.slice(0, 3).map((ch) => (
              <div key={ch.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg" data-testid={`challenge-card-${ch.id}`}>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{ch.name}</p>
                <p className="text-lg font-bold text-brand-600 dark:text-brand-400 mt-1">
                  ${Number(ch.accountSize).toLocaleString()}
                </p>
                <div className="flex items-center justify-between gap-2 mt-2 flex-wrap">
                  <span className="text-xs text-gray-500 dark:text-gray-400">From ${Number(ch.price).toFixed(0)}</span>
                  <Badge variant="outline" className="text-xs">{ch.phases} Phase</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}