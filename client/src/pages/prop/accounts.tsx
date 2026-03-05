import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Briefcase,
  Search,
  Eye,
  EyeOff,
  Copy,
  Monitor,
  Server,
  RefreshCw,
  RotateCcw,
  ArrowUpCircle,
  FileDown,
  Award,
  DollarSign,
  TrendingUp,
  Layers,
  Shield,
  X,
  Target,
  Calendar,
  ChevronRight,
  BarChart3,
  Activity,
} from "lucide-react";
import type { PropAccount } from "@shared/schema";
import { cn } from "@/lib/utils";

const demoAccounts = [
  {
    id: "demo-1",
    userId: "u1",
    challengeId: "50k",
    accountNumber: "PROP-50821",
    currentPhase: 1,
    status: "active",
    currentBalance: "51200.00",
    currentProfit: "1200.00",
    tradingDays: 8,
    startDate: "2024-12-01T00:00:00Z",
    endDate: null,
    createdAt: "2024-12-01T00:00:00Z",
    platform: "MT5",
    server: "BridgeX-Prop",
    leverage: "1:100",
    symbolGroup: "Forex Major",
    masterPassword: "Xk9$mP2v",
    investorPassword: "Rv7#nQ4w",
  },
  {
    id: "demo-2",
    userId: "u1",
    challengeId: "100k",
    accountNumber: "PROP-100322",
    currentPhase: 2,
    status: "active",
    currentBalance: "103500.00",
    currentProfit: "3500.00",
    tradingDays: 14,
    startDate: "2024-11-15T00:00:00Z",
    endDate: null,
    createdAt: "2024-11-15T00:00:00Z",
    platform: "MT5",
    server: "BridgeX-Prop",
    leverage: "1:100",
    symbolGroup: "Forex All",
    masterPassword: "Lm5&jR8t",
    investorPassword: "Wp3!kS6y",
  },
  {
    id: "demo-3",
    userId: "u1",
    challengeId: "50k",
    accountNumber: "PROP-50199",
    currentPhase: 1,
    status: "funded",
    currentBalance: "52800.00",
    currentProfit: "2800.00",
    tradingDays: 22,
    startDate: "2024-10-01T00:00:00Z",
    endDate: null,
    createdAt: "2024-10-01T00:00:00Z",
    platform: "cTrader",
    server: "BridgeX-Funded",
    leverage: "1:100",
    symbolGroup: "Forex Major",
    masterPassword: "Hn2@fT9q",
    investorPassword: "Bx8*dL1z",
  },
];

function maskPassword(password: string) {
  return password.replace(/./g, "\u2022");
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "funded":
      return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    case "failed":
      return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
    case "completed":
      return "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    default:
      return "bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  }
}

interface AccountWithExtras extends PropAccount {
  platform: string;
  server: string;
  leverage: string;
  symbolGroup: string;
  masterPassword: string;
  investorPassword: string;
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

function AccountDetailPanel({ account, onClose }: { account: AccountWithExtras; onClose: () => void }) {
  const balance = Number(account.currentBalance);
  const profit = Number(account.currentProfit);
  const startingBalance = balance - profit;
  const equity = balance + (profit * 0.1);
  const drawdown = startingBalance > 0 ? Math.max(0, ((startingBalance - Math.min(balance, startingBalance)) / startingBalance) * 100) : 0;
  const profitTargetPercent = 8;
  const profitProgress = startingBalance > 0 ? Math.min(100, (profit / (startingBalance * profitTargetPercent / 100)) * 100) : 0;
  const maxDailyDrawdown = 5;
  const maxTotalDrawdown = 10;
  const minTradingDays = 5;
  const maxTradingDays = 30;
  const daysRemaining = Math.max(0, maxTradingDays - account.tradingDays);

  return (
    <Card className="p-6 space-y-6 bg-gray-50 dark:bg-dark-card" data-testid={`panel-account-detail-${account.id}`}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg" data-testid={`text-detail-account-${account.id}`}>
              {account.accountNumber} Details
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {getPhaseLabel(account)} &middot; {getAccountSize(account.challengeId)}
            </p>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="text-gray-400"
          onClick={onClose}
          data-testid={`button-close-detail-${account.id}`}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700" data-testid={`kpi-balance-${account.id}`}>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Balance</p>
          <p className="text-gray-900 dark:text-white text-xl font-bold">${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700" data-testid={`kpi-equity-${account.id}`}>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Equity</p>
          <p className="text-gray-900 dark:text-white text-xl font-bold">${equity.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700" data-testid={`kpi-profit-${account.id}`}>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Profit</p>
          <p className={cn("text-xl font-bold", profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
            {profit >= 0 ? "+" : ""}${profit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700" data-testid={`kpi-drawdown-${account.id}`}>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Drawdown</p>
          <p className="text-amber-600 dark:text-amber-400 text-xl font-bold">{drawdown.toFixed(2)}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700" data-testid={`kpi-days-traded-${account.id}`}>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Days Traded</p>
          <p className="text-gray-900 dark:text-white text-xl font-bold">{account.tradingDays}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Challenge Progress
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Profit Target ({profitTargetPercent}%)</span>
                <span className="text-gray-900 dark:text-white text-sm font-medium">{profitProgress.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className={cn("h-full rounded-full transition-all", profitProgress >= 100 ? "bg-emerald-500" : "bg-blue-500")}
                  style={{ width: `${Math.min(100, profitProgress)}%` }}
                  data-testid={`progress-profit-${account.id}`}
                />
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
                <span className={cn("text-sm font-medium", account.tradingDays >= minTradingDays ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                  {account.tradingDays}/{minTradingDays}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className={cn("h-full rounded-full", account.tradingDays >= minTradingDays ? "bg-emerald-500" : "bg-amber-500")}
                  style={{ width: `${Math.min(100, (account.tradingDays / minTradingDays) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Next Steps
          </h4>
          <div className="space-y-3">
            {account.status === "active" && (
              <>
                {account.tradingDays < minTradingDays && (
                  <div className="flex items-start gap-3 bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                    <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-900 dark:text-white text-sm font-medium">Complete Minimum Trading Days</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                        Trade for {minTradingDays - account.tradingDays} more day(s) to meet the requirement.
                      </p>
                    </div>
                  </div>
                )}
                {profitProgress < 100 && (
                  <div className="flex items-start gap-3 bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-900 dark:text-white text-sm font-medium">Reach Profit Target</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                        You need ${((startingBalance * profitTargetPercent / 100) - profit).toLocaleString("en-US", { minimumFractionDigits: 2 })} more profit to pass this phase.
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-gray-900 dark:text-white text-sm font-medium">Stay Within Drawdown Limits</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                      Keep daily drawdown under {maxDailyDrawdown}% and total drawdown under {maxTotalDrawdown}%.
                    </p>
                  </div>
                </div>
              </>
            )}
            {account.status === "funded" && (
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-900 dark:text-white text-sm font-medium">Request Payout</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                    Your account is funded. You can request a payout from the Payouts page.
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-gray-900 dark:text-white text-sm font-medium">Trading Period</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                  {daysRemaining > 0 ? `${daysRemaining} days remaining in your trading period.` : "Trading period has ended."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function PropAccounts() {
  const [search, setSearch] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: propAccounts, isLoading } = useQuery<PropAccount[]>({
    queryKey: ["/api/prop/accounts"],
  });

  const accounts = propAccounts && propAccounts.length > 0
    ? propAccounts.map((a) => ({
        ...a,
        platform: (a as any).platform || "MT5",
        server: (a as any).server || "BridgeX-Prop",
        leverage: (a as any).leverage || "1:100",
        symbolGroup: (a as any).symbolGroup || "Forex Major",
        masterPassword: (a as any).masterPassword || "••••••••",
        investorPassword: (a as any).investorPassword || "••••••••",
      }))
    : demoAccounts;

  const filtered = accounts.filter((a) =>
    a.accountNumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalAccounts = filtered.length;
  const activeAccounts = filtered.filter((a) => a.status === "active").length;
  const fundedAccounts = filtered.filter((a) => a.status === "funded").length;
  const totalBalance = filtered.reduce((sum, a) => sum + Number(a.currentBalance), 0);

  function togglePassword(accountId: string) {
    setVisiblePasswords((prev) => ({ ...prev, [accountId]: !prev[accountId] }));
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${label} copied to clipboard` });
    });
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-prop-accounts-title">
            Prop Trading Accounts
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your challenge and funded accounts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-total-prop-accounts">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Accounts</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-total-prop-accounts">{totalAccounts}</h3>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">{activeAccounts} in evaluation</div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-funded-accounts">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Funded Accounts</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-funded-accounts">{fundedAccounts}</h3>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Live funded trading</div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-total-balance">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Balance</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-total-balance">
                ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Across all accounts</div>
        </div>

        <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" data-testid="stat-total-profit">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Profit</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400" data-testid="text-total-profit">
                +${filtered.reduce((sum, a) => sum + Number(a.currentProfit), 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Unrealized P&L</div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by account number..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="input-search-prop-accounts"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-10 w-full mb-3" />
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-dark-card p-12 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">
          <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-gray-400" />
          </div>
          <p className="font-medium text-gray-900 dark:text-white mb-1">No prop accounts found</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Start a challenge to get your first prop trading account.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((account) => {
            const isVisible = visiblePasswords[account.id] || false;
            const profit = Number(account.currentProfit);
            const balance = Number(account.currentBalance);
            const profitPercent = balance > 0 ? (profit / balance) * 100 : 0;

            return (
              <div
                key={account.id}
                className="bg-[#0f172a] rounded-xl shadow-sm overflow-visible"
                data-testid={`card-prop-account-${account.id}`}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg font-bold text-sm" data-testid={`badge-platform-${account.id}`}>
                        {account.platform}
                      </span>
                      <span className="font-bold text-white text-base" data-testid={`text-account-number-${account.id}`}>
                        {account.accountNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={cn("text-xs font-bold", getStatusColor(account.status))} data-testid={`badge-status-${account.id}`}>
                        {account.status.toUpperCase()}
                      </Badge>
                      <span className="border border-amber-500 text-amber-400 px-3 py-1 rounded-lg text-xs font-bold" data-testid={`badge-phase-${account.id}`}>
                        {getPhaseLabel(account)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm flex-wrap">
                    <span className="flex items-center gap-1">
                      <Server className="w-3.5 h-3.5" />
                      {account.server}
                    </span>
                    <span className="flex items-center gap-1">
                      <Monitor className="w-3.5 h-3.5" />
                      {account.symbolGroup}
                    </span>
                    <span>Leverage: {account.leverage}</span>
                    <span>Size: {getAccountSize(account.challengeId)}</span>
                  </div>

                  <div className="border-t border-gray-700 mt-4 pt-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-400 uppercase text-xs font-medium tracking-wider">Balance</p>
                        <p className="text-white text-xl font-bold mt-1" data-testid={`text-balance-${account.id}`}>
                          ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 uppercase text-xs font-medium tracking-wider">Profit</p>
                        <p className={cn("text-xl font-bold mt-1", profit >= 0 ? "text-emerald-400" : "text-red-400")} data-testid={`text-profit-${account.id}`}>
                          {profit >= 0 ? "+" : ""}${profit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 uppercase text-xs font-medium tracking-wider">Days Traded</p>
                        <p className="text-white text-xl font-bold mt-1" data-testid={`text-days-${account.id}`}>
                          {account.tradingDays}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 mt-4 pt-4">
                    <p className="text-gray-400 uppercase text-xs font-medium tracking-wider mb-3">Credentials</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-gray-400 text-xs font-medium shrink-0">Master</span>
                          <span className="text-white text-sm font-mono truncate" data-testid={`text-master-password-${account.id}`}>
                            {isVisible ? account.masterPassword : maskPassword(account.masterPassword)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                            onClick={() => copyToClipboard(account.masterPassword, "Master password")}
                            data-testid={`button-copy-master-${account.id}`}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-gray-400 text-xs font-medium shrink-0">Investor</span>
                          <span className="text-white text-sm font-mono truncate" data-testid={`text-investor-password-${account.id}`}>
                            {isVisible ? account.investorPassword : maskPassword(account.investorPassword)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                            onClick={() => copyToClipboard(account.investorPassword, "Investor password")}
                            data-testid={`button-copy-investor-${account.id}`}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-end mt-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-white text-xs"
                          onClick={() => togglePassword(account.id)}
                          data-testid={`button-toggle-password-${account.id}`}
                        >
                          {isVisible ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                          {isVisible ? "Hide" : "Show"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-600 text-blue-300"
                      onClick={() => setSelectedAccountId(selectedAccountId === account.id ? null : account.id)}
                      data-testid={`button-view-${account.id}`}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View
                    </Button>
                    {account.status !== "funded" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300"
                          onClick={() => toast({ title: "Reset requested", description: `Reset request submitted for ${account.accountNumber}` })}
                          data-testid={`button-reset-${account.id}`}
                        >
                          <RefreshCw className="w-3.5 h-3.5 mr-1" />
                          Reset
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300"
                          onClick={() => toast({ title: "Retry requested", description: `Retry request submitted for ${account.accountNumber}` })}
                          data-testid={`button-retry-${account.id}`}
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1" />
                          Retry
                        </Button>
                      </>
                    )}
                    {account.status === "funded" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                        onClick={() => toast({ title: "Coming soon", description: "Upgrade options will be available soon." })}
                        data-testid={`button-upgrade-${account.id}`}
                      >
                        <ArrowUpCircle className="w-3.5 h-3.5 mr-1" />
                        Upgrade
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                      onClick={() => toast({ title: "Certificate downloaded", description: `Certificate for ${account.accountNumber} downloaded.` })}
                      data-testid={`button-certificate-${account.id}`}
                    >
                      <Award className="w-3.5 h-3.5 mr-1" />
                      Certificate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                      onClick={() => toast({ title: "Proof of payout downloaded" })}
                      data-testid={`button-proof-${account.id}`}
                    >
                      <FileDown className="w-3.5 h-3.5 mr-1" />
                      Proof
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedAccountId && (() => {
        const selectedAccount = filtered.find((a) => a.id === selectedAccountId);
        if (!selectedAccount) return null;
        return (
          <AccountDetailPanel
            account={selectedAccount}
            onClose={() => setSelectedAccountId(null)}
          />
        );
      })()}
    </div>
  );
}
