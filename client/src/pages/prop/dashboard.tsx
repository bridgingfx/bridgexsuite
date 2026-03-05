import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { Link } from "wouter";
import type { PropAccount, PropChallenge } from "@shared/schema";

type TabFilter = "active" | "passed" | "breached" | "funded";

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

export default function PropDashboard() {
  const { data: accounts, isLoading: accountsLoading } = useQuery<PropAccount[]>({
    queryKey: ["/api/prop/accounts"],
  });

  const { data: challenges, isLoading: challengesLoading } = useQuery<PropChallenge[]>({
    queryKey: ["/api/prop/challenges"],
  });

  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabFilter>("active");
  const countdown = useCountdownToMidnightUTC();

  const filteredAccounts = useMemo(() => {
    if (!accounts) return [];
    return accounts.filter((a) => {
      if (activeTab === "active") return a.status === "active";
      if (activeTab === "passed") return a.status === "passed";
      if (activeTab === "breached") return a.status === "failed";
      if (activeTab === "funded") return a.status === "funded";
      return true;
    });
  }, [accounts, activeTab]);

  const tabCounts = useMemo(() => {
    if (!accounts) return { active: 0, passed: 0, breached: 0, funded: 0 };
    return {
      active: accounts.filter((a) => a.status === "active").length,
      passed: accounts.filter((a) => a.status === "passed").length,
      breached: accounts.filter((a) => a.status === "failed").length,
      funded: accounts.filter((a) => a.status === "funded").length,
    };
  }, [accounts]);

  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  const selectedAccount = accounts?.find((a) => a.id === selectedAccountId);

  const balance = selectedAccount ? Number(selectedAccount.currentBalance) : 0;
  const profit = selectedAccount ? Number(selectedAccount.currentProfit) : 0;
  const equity = balance + profit;
  const drawdownUsed = selectedAccount ? Math.abs(Math.min(profit, 0)) / (balance * 0.10) * 100 : 0;
  const tradingDays = selectedAccount?.tradingDays ?? 0;
  const currentPhase = selectedAccount?.currentPhase ?? 1;
  const status = selectedAccount?.status ?? "active";
  const profitTarget = balance * 0.08;
  const profitProgress = profitTarget > 0 ? Math.min((profit / profitTarget) * 100, 100) : 0;

  const isLoading = accountsLoading || challengesLoading;

  const tabs: { key: TabFilter; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "passed", label: "Passed" },
    { key: "breached", label: "Breached" },
    { key: "funded", label: "Funded" },
  ];

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
        <div className="flex items-center gap-3 flex-wrap">
          {accounts && accounts.length > 1 && (
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger className="w-[240px]" data-testid="select-account">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id} data-testid={`select-account-option-${acc.id}`}>
                    {acc.accountNumber} - ${Number(acc.currentBalance).toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Link href="/prop/challenges">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 cursor-pointer" data-testid="link-view-challenges">
              View Challenges <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>

      <Card className="p-4 overflow-visible" data-testid="reset-timer-section">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-teal-500 animate-spin" style={{ animationDuration: "3s" }} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Today's Permitted Loss Will Reset In
              </span>
            </div>
            <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0 text-base px-4 py-1 font-mono" data-testid="badge-reset-timer">
              {countdown}
            </Badge>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Highest Profit</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white" data-testid="text-highest-profit-id">
                {selectedAccount?.accountNumber ?? "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Breached Loss</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white" data-testid="text-breached-loss-id">
                -
              </span>
            </div>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" data-testid="kpi-section">
          <Card className="p-6" data-testid="kpi-balance">
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Balance</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h3>
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  ${equity.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h3>
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
                <h3 className={`text-xl font-bold ${profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {profit >= 0 ? "+" : ""}${profit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <div className={`p-3 rounded-md ${profit >= 0 ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}>
                {profit >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
            </div>
          </Card>

          <Card className="p-6" data-testid="kpi-drawdown">
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Drawdown</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {drawdownUsed.toFixed(1)}%
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">of 10% max</p>
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {tradingDays}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">min 5 required</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-md">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6" data-testid="challenge-status-section">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Challenge Status</h2>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
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

        <Card className="p-6" data-testid="next-steps-section">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Next Steps</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">What you need to focus on today.</p>

          <div className="space-y-3">
            {nextSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-md ${step.done ? "bg-emerald-50 dark:bg-emerald-900/10" : "bg-gray-50 dark:bg-gray-800/50"}`}
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

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-md border border-blue-100 dark:border-blue-800/30">
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

      <Card className="p-6" data-testid="my-challenges-section">
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Challenges</h2>
          <Link href="/prop/accounts">
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400 cursor-pointer" data-testid="link-view-all-challenges">
              View All <ArrowRight className="w-3 h-3 inline ml-1" />
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              data-testid={`tab-${tab.key}`}
            >
              {tab.label} ({tabCounts[tab.key]})
            </Button>
          ))}
        </div>

        {filteredAccounts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 dark:text-gray-400" data-testid="text-no-challenges">
              No {activeTab} challenges found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-my-challenges">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Account</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Phase</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Balance</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Profit</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Days</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Progress</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((acc) => {
                  const accBalance = Number(acc.currentBalance);
                  const accProfit = Number(acc.currentProfit);
                  const accProfitPct = accBalance > 0 ? (accProfit / accBalance) * 100 : 0;
                  const accTarget = accBalance * 0.08;
                  const accProgress = accTarget > 0 ? Math.min((accProfit / accTarget) * 100, 100) : 0;
                  return (
                    <tr
                      key={acc.id}
                      className={`border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                        acc.id === selectedAccountId ? "bg-brand-50/50 dark:bg-brand-900/10" : ""
                      }`}
                      onClick={() => setSelectedAccountId(acc.id)}
                      data-testid={`row-challenge-${acc.id}`}
                    >
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 dark:text-white" data-testid={`text-account-number-${acc.id}`}>
                          {acc.accountNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            acc.status === "funded" ? "border-emerald-300 text-emerald-700 dark:text-emerald-400" :
                            acc.status === "failed" ? "border-red-300 text-red-700 dark:text-red-400" :
                            acc.status === "passed" ? "border-blue-300 text-blue-700 dark:text-blue-400" :
                            "border-gray-300 text-gray-700 dark:text-gray-400"
                          }`}
                          data-testid={`badge-status-${acc.id}`}
                        >
                          {acc.status === "failed" ? "Breached" : acc.status.charAt(0).toUpperCase() + acc.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Phase {acc.currentPhase}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                        ${accBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${accProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                          {accProfit >= 0 ? "+" : ""}{accProfitPct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{acc.tradingDays}</td>
                      <td className="py-3 px-4">
                        {acc.status === "active" && (
                          <div className="w-20 mx-auto">
                            <Progress value={Math.max(accProgress, 0)} className="h-2" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/prop/account/${acc.id}`}>
                          <Button variant="ghost" size="sm" data-testid={`button-view-challenge-${acc.id}`}>
                            View <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="p-6" data-testid="announcements-section">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Megaphone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Announcements & Rules Updates</h2>
        </div>

        <div className="space-y-4">
          {demoAnnouncements.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md"
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
      </Card>

      {!isLoading && challenges && challenges.length > 0 && (
        <Card className="p-6" data-testid="available-challenges-section">
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
              <div key={ch.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md" data-testid={`challenge-card-${ch.id}`}>
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
        </Card>
      )}
    </div>
  );
}
