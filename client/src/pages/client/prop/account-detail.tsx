import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  Target,
  Shield,
  Clock,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Monitor,
  Server,
  RotateCcw,
  Award,
  Megaphone,
  Layers,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { PropAccount } from "@shared/schema";
import { cn } from "@/lib/utils";

interface AccountWithExtras extends PropAccount {
  platform: string;
  server: string;
  leverage: string;
  symbolGroup: string;
  masterPassword: string;
  investorPassword: string;
}

const demoAccounts: AccountWithExtras[] = [
  {
    id: "demo-1", userId: "u1", challengeId: "50k", accountNumber: "PROP-50821",
    currentPhase: 1, status: "active", currentBalance: "51200.00", currentProfit: "1200.00",
    tradingDays: 8, startDate: "2024-12-01T00:00:00Z", endDate: null, createdAt: "2024-12-01T00:00:00Z",
    platform: "MT5", server: "BridgeX-Prop", leverage: "1:100", symbolGroup: "Forex Major",
    masterPassword: "Xk9$mP2v", investorPassword: "Rv7#nQ4w",
  },
  {
    id: "demo-2", userId: "u1", challengeId: "100k", accountNumber: "PROP-100322",
    currentPhase: 2, status: "active", currentBalance: "103500.00", currentProfit: "3500.00",
    tradingDays: 14, startDate: "2024-11-15T00:00:00Z", endDate: null, createdAt: "2024-11-15T00:00:00Z",
    platform: "MT5", server: "BridgeX-Prop", leverage: "1:100", symbolGroup: "Forex All",
    masterPassword: "Lm5&jR8t", investorPassword: "Wp3!kS6y",
  },
  {
    id: "demo-3", userId: "u1", challengeId: "50k", accountNumber: "PROP-50199",
    currentPhase: 1, status: "funded", currentBalance: "52800.00", currentProfit: "2800.00",
    tradingDays: 22, startDate: "2024-10-01T00:00:00Z", endDate: null, createdAt: "2024-10-01T00:00:00Z",
    platform: "cTrader", server: "BridgeX-Funded", leverage: "1:100", symbolGroup: "Forex Major",
    masterPassword: "Hn2@fT9q", investorPassword: "Bx8*dL1z",
  },
];

const demoAnnouncements = [
  { title: "New 200K Challenge Available", description: "We've launched a new $200,000 account size challenge with competitive pricing.", date: "2024-01-15", type: "new" as const },
  { title: "Updated Drawdown Rules", description: "Max daily drawdown now resets at server midnight (00:00 UTC) instead of rolling 24h.", date: "2024-01-10", type: "update" as const },
  { title: "Weekend Holding Policy Change", description: "Funded traders can now hold positions over weekends without additional fees.", date: "2024-01-05", type: "info" as const },
];

function maskPassword(password: string) {
  return password.replace(/./g, "\u2022");
}

function getStatusColor(status: string) {
  switch (status) {
    case "active": return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "funded": return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    case "failed": return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
    case "completed": return "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    default: return "bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  }
}

function getPhaseLabel(account: { status: string; currentPhase: number }) {
  if (account.status === "funded") return "Funded";
  if (account.status === "failed") return "Failed";
  return `Phase ${account.currentPhase}`;
}

function getAccountSize(challengeId: string) {
  if (challengeId.includes("10k") || challengeId.includes("10")) return "$10,000";
  if (challengeId.includes("100k") || challengeId.includes("100")) return "$100,000";
  if (challengeId.includes("50k") || challengeId.includes("50")) return "$50,000";
  if (challengeId.includes("200k") || challengeId.includes("200")) return "$200,000";
  return "$50,000";
}

function useCountdownToMidnightUTC() {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    function calc() {
      const now = new Date();
      const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, []);
  return timeLeft;
}

export default function PropAccountDetail() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const [visiblePasswords, setVisiblePasswords] = useState(false);
  const countdown = useCountdownToMidnightUTC();

  const { data: propAccounts, isLoading } = useQuery<PropAccount[]>({
    queryKey: ["/api/prop/accounts"],
  });

  const accounts: AccountWithExtras[] = useMemo(() => {
    if (propAccounts && propAccounts.length > 0) {
      return propAccounts.map((a) => ({
        ...a,
        platform: (a as any).platform || "MT5",
        server: (a as any).server || "BridgeX-Prop",
        leverage: (a as any).leverage || "1:100",
        symbolGroup: (a as any).symbolGroup || "Forex Major",
        masterPassword: (a as any).masterPassword || "••••••••",
        investorPassword: (a as any).investorPassword || "••••••••",
      }));
    }
    return demoAccounts;
  }, [propAccounts]);

  const account = accounts.find((a) => a.id === params.id);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto text-center py-16">
        <p className="text-gray-500 dark:text-gray-400">Account not found.</p>
        <Link href="/prop/accounts">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Accounts
          </Button>
        </Link>
      </div>
    );
  }

  const balance = Number(account.currentBalance);
  const profit = Number(account.currentProfit);
  const startingBalance = balance - profit;
  const equity = balance + (profit * 0.1);
  const drawdownUsed = Math.abs(Math.min(profit, 0)) / (balance * 0.10) * 100;
  const tradingDays = account.tradingDays;
  const currentPhase = account.currentPhase;
  const status = account.status;
  const profitTargetPercent = 8;
  const profitTarget = startingBalance * profitTargetPercent / 100;
  const profitProgress = profitTarget > 0 ? Math.min((profit / profitTarget) * 100, 100) : 0;
  const maxDailyDrawdown = 5;
  const maxTotalDrawdown = 10;
  const minTradingDays = 5;
  const maxTradingDays = 30;
  const daysRemaining = Math.max(0, maxTradingDays - tradingDays);
  const drawdown = startingBalance > 0 ? Math.max(0, ((startingBalance - Math.min(balance, startingBalance)) / startingBalance) * 100) : 0;

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${label} copied to clipboard` });
    });
  }

  const nextSteps = [];
  if (status === "active") {
    if (tradingDays < minTradingDays) {
      nextSteps.push({ label: `Complete at least ${minTradingDays - tradingDays} more trading day(s)`, icon: Calendar, done: false });
    } else {
      nextSteps.push({ label: "Minimum trading days completed", icon: Calendar, done: true });
    }
    nextSteps.push({ label: `Stay within ${maxDailyDrawdown}% daily drawdown limit`, icon: Shield, done: drawdownUsed < maxDailyDrawdown });
    if (profitProgress >= 100) {
      nextSteps.push({ label: `Profit target of ${profitTargetPercent}% reached`, icon: TrendingUp, done: true });
    } else {
      nextSteps.push({ label: `Reach ${profitTargetPercent}% profit target ($${(profitTarget - profit).toLocaleString("en-US", { minimumFractionDigits: 2 })} remaining)`, icon: Target, done: false });
    }
  }
  if (status === "funded") {
    nextSteps.push({ label: "Your account is funded — you can request payouts", icon: DollarSign, done: true });
    nextSteps.push({ label: "Maintain drawdown limits to keep funded status", icon: Shield, done: true });
  }
  if (status === "failed") {
    nextSteps.push({ label: "Challenge failed — consider resetting or retrying", icon: AlertTriangle, done: false });
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto" data-testid="prop-account-detail-page">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/prop/accounts">
            <Button variant="ghost" size="icon" className="shrink-0" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-account-title">
                {account.accountNumber}
              </h1>
              <Badge className={cn("text-xs font-bold", getStatusColor(status))} data-testid="badge-account-status">
                {status.toUpperCase()}
              </Badge>
              <span className="border border-amber-500 text-amber-600 dark:text-amber-400 px-3 py-0.5 rounded-lg text-xs font-bold">
                {getPhaseLabel(account)}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {account.platform} &middot; {account.server} &middot; {account.leverage} &middot; {getAccountSize(account.challengeId)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {status !== "funded" && (
            <>
              <Button size="sm" variant="outline" onClick={() => toast({ title: "Reset requested", description: `Reset request submitted for ${account.accountNumber}` })} data-testid="button-reset">
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reset
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast({ title: "Retry requested", description: `Retry request submitted for ${account.accountNumber}` })} data-testid="button-retry">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retry
              </Button>
            </>
          )}
          {status === "funded" && (
            <Link href="/prop/payouts">
              <Button size="sm" variant="outline" data-testid="button-request-payout">
                <DollarSign className="w-3.5 h-3.5 mr-1" /> Request Payout
              </Button>
            </Link>
          )}
          <Button size="sm" variant="outline" onClick={() => toast({ title: "Certificate downloaded" })} data-testid="button-certificate">
            <Award className="w-3.5 h-3.5 mr-1" /> Certificate
          </Button>
        </div>
      </div>

      <Card className="p-4 overflow-visible" data-testid="reset-timer-section">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-teal-500 animate-spin" style={{ animationDuration: "3s" }} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Today's Permitted Loss Will Reset In</span>
            </div>
            <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 text-base px-4 py-1 font-mono" data-testid="badge-reset-timer">
              {countdown}
            </Badge>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Days Remaining</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{daysRemaining}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Trading Period</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{maxTradingDays} Days</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" data-testid="kpi-section">
        <Card className="p-6" data-testid="kpi-balance">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Balance</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-md">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-6" data-testid="kpi-equity">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Equity</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">${equity.toLocaleString("en-US", { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-md">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-6" data-testid="kpi-profit">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Profit</p>
              <h3 className={cn("text-xl font-bold", profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                {profit >= 0 ? "+" : ""}${profit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className={cn("p-3 rounded-md", profit >= 0 ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400")}>
              {profit >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>
        </Card>
        <Card className="p-6" data-testid="kpi-drawdown">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Drawdown</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{drawdownUsed.toFixed(1)}%</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">of {maxTotalDrawdown}% max</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-6" data-testid="kpi-days-traded">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Days Traded</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tradingDays}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">min {minTradingDays} required</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-md">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6" data-testid="challenge-status-section">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Challenge Status</h2>
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <Badge className={cn(status === "funded" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : status === "failed" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400")}>
              {status === "funded" ? "Funded" : status === "failed" ? "Failed" : `Phase ${currentPhase}`}
            </Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {status === "funded" ? "Live funded account" : status === "failed" ? "Challenge failed" : "Evaluation in progress"}
            </span>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((phase) => {
              const label = phase <= 2 ? `Phase ${phase}` : "Funded";
              const isCurrent = status !== "funded" && status !== "failed" && phase === currentPhase;
              const isPassed = status === "funded" || (status === "active" && phase < currentPhase);
              const isFuture = !isPassed && !isCurrent;
              return (
                <div key={phase} className="flex items-center gap-4" data-testid={`phase-step-${phase}`}>
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    isPassed ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" :
                    isCurrent ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/30" :
                    "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                  )}>
                    {isPassed ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{phase}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium", isFuture ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white")}>{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{isPassed ? "Completed" : isCurrent ? "In progress" : "Upcoming"}</p>
                  </div>
                  {isCurrent && (
                    <div className="w-24">
                      <Progress value={profitProgress} className="h-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">{profitProgress.toFixed(0)}%</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md">
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
        </Card>

        <div className="space-y-6">
          <Card className="p-6" data-testid="challenge-progress-section">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Challenge Progress
            </h2>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Profit Target ({profitTargetPercent}%)</span>
                  <span className="text-gray-900 dark:text-white text-sm font-medium">{profitProgress.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className={cn("h-full rounded-full transition-all", profitProgress >= 100 ? "bg-emerald-500" : "bg-blue-500")} style={{ width: `${Math.min(100, profitProgress)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Max Daily Drawdown ({maxDailyDrawdown}%)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Within Limits</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, (drawdown / maxDailyDrawdown) * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Max Total Drawdown ({maxTotalDrawdown}%)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Within Limits</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, (drawdown / maxTotalDrawdown) * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Min Trading Days ({minTradingDays})</span>
                  <span className={cn("text-sm font-medium", tradingDays >= minTradingDays ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                    {tradingDays}/{minTradingDays}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className={cn("h-full rounded-full", tradingDays >= minTradingDays ? "bg-emerald-500" : "bg-amber-500")} style={{ width: `${Math.min(100, (tradingDays / minTradingDays) * 100)}%` }} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6" data-testid="next-steps-section">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Next Steps</h2>
            <div className="space-y-3">
              {nextSteps.map((step, index) => (
                <div key={index} className={cn("flex items-center gap-3 p-3 rounded-md", step.done ? "bg-emerald-50 dark:bg-emerald-900/10" : "bg-gray-50 dark:bg-gray-800/50")} data-testid={`next-step-${index}`}>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    step.done ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  )}>
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                  </div>
                  <span className={cn("text-sm", step.done ? "text-emerald-700 dark:text-emerald-300 line-through" : "text-gray-700 dark:text-gray-300")}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-md border border-blue-100 dark:border-blue-800/30">
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
          </Card>
        </div>
      </div>

      <Card className="p-6" data-testid="account-info-section">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Account Information</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Platform</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-gray-500" /> {account.platform}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Server</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-gray-500" /> {account.server}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Leverage</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{account.leverage}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Symbol Group</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{account.symbolGroup}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Account Size</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{getAccountSize(account.challengeId)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Start Date</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {account.startDate ? new Date(account.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Credentials</h3>
              <Button size="sm" variant="ghost" className="text-xs" onClick={() => setVisiblePasswords(!visiblePasswords)} data-testid="button-toggle-passwords">
                {visiblePasswords ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                {visiblePasswords ? "Hide All" : "Show All"}
              </Button>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Account Number</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-mono font-bold text-gray-900 dark:text-white">{account.accountNumber}</p>
                  <Button size="icon" variant="ghost" onClick={() => copyToClipboard(account.accountNumber, "Account number")} data-testid="button-copy-account-number">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Master Password</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-mono font-bold text-gray-900 dark:text-white" data-testid="text-master-password">
                    {visiblePasswords ? account.masterPassword : maskPassword(account.masterPassword)}
                  </p>
                  <Button size="icon" variant="ghost" onClick={() => copyToClipboard(account.masterPassword, "Master password")} data-testid="button-copy-master">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Investor Password</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-mono font-bold text-gray-900 dark:text-white" data-testid="text-investor-password">
                    {visiblePasswords ? account.investorPassword : maskPassword(account.investorPassword)}
                  </p>
                  <Button size="icon" variant="ghost" onClick={() => copyToClipboard(account.investorPassword, "Investor password")} data-testid="button-copy-investor">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6" data-testid="announcements-section">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Megaphone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Announcements & Rules Updates</h2>
        </div>
        <div className="space-y-4">
          {demoAnnouncements.map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md" data-testid={`announcement-${index}`}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                item.type === "new" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" :
                item.type === "update" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" :
                "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              )}>
                {item.type === "new" ? <Layers className="w-4 h-4" /> : item.type === "update" ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {item.type === "new" ? "New" : item.type === "update" ? "Update" : "Info"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
