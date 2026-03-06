import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Swords,
  Trophy,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  ArrowLeftRight,
  Gift,
} from "lucide-react";
import { Link } from "wouter";

type LeagueStatus = "active" | "completed" | "upcoming";

interface MyLeague {
  id: string;
  name: string;
  status: LeagueStatus;
  rank: number;
  totalParticipants: number;
  profit: number;
  entryFee: number;
  prize: number;
  startDate: string;
  endDate: string;
  progress: number;
}

const myLeagues: MyLeague[] = [
  { id: "LG-001", name: "Weekly Scalpers League", status: "active", rank: 3, totalParticipants: 128, profit: 2450, entryFee: 10, prize: 1000, startDate: "2024-03-11", endDate: "2024-03-15", progress: 65 },
  { id: "LG-002", name: "Monthly Masters Cup", status: "active", rank: 12, totalParticipants: 256, profit: 5120, entryFee: 75, prize: 15000, startDate: "2024-03-01", endDate: "2024-03-31", progress: 40 },
  { id: "LG-003", name: "February Showdown", status: "completed", rank: 5, totalParticipants: 128, profit: 1800, entryFee: 50, prize: 8000, startDate: "2024-02-01", endDate: "2024-02-28", progress: 100 },
  { id: "LG-004", name: "New Year Challenge", status: "completed", rank: 1, totalParticipants: 96, profit: 3200, entryFee: 30, prize: 3000, startDate: "2024-01-15", endDate: "2024-01-22", progress: 100 },
  { id: "LG-005", name: "Spring Championship 2024", status: "upcoming", rank: 0, totalParticipants: 89, profit: 0, entryFee: 50, prize: 10000, startDate: "2024-04-01", endDate: "2024-04-07", progress: 0 },
];

const statusConfig: Record<LeagueStatus, { color: string; label: string }> = {
  active: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", label: "Active" },
  completed: { color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", label: "Completed" },
  upcoming: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", label: "Upcoming" },
};

export default function MyLeagues() {
  const { toast } = useToast();
  const [tab, setTab] = useState<LeagueStatus | "all">("all");
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");

  const totalProfit = myLeagues.reduce((sum, l) => sum + l.profit, 0);

  const filtered = tab === "all" ? myLeagues : myLeagues.filter((l) => l.status === tab);

  const tabs: { key: LeagueStatus | "all"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "upcoming", label: "Upcoming" },
  ];

  function openTransfer() {
    setTransferAmount("");
    setTransferOpen(true);
  }

  function handleTransfer() {
    const amount = Number(transferAmount);
    if (!amount || amount <= 0 || amount > totalProfit) return;
    toast({
      title: "Transfer Successful",
      description: `$${amount.toFixed(2)} transferred from League Winnings to Main Wallet`,
    });
    setTransferOpen(false);
    setTransferAmount("");
  }

  function setPercentage(pct: number) {
    setTransferAmount((totalProfit * pct / 100).toFixed(2));
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto" data-testid="my-leagues-page">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-my-leagues-title">
            My Leagues
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track all the leagues and tournaments you've joined
          </p>
        </div>
        <Link href="/leagues/tournaments">
          <Button variant="outline" data-testid="button-find-more">
            <Swords className="w-4 h-4 mr-2" />
            Find More Leagues
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6" data-testid="stat-total-joined">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Joined</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{myLeagues.length}</h3>
        </Card>
        <Card className="p-6" data-testid="stat-wins">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">1st Place Wins</p>
          <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{myLeagues.filter(l => l.rank === 1).length}</h3>
        </Card>
        <Card className="p-6" data-testid="stat-total-profit">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Profit</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ${totalProfit.toLocaleString()}
          </h3>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => openTransfer()}
              data-testid="button-transfer-profit"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5" />
              Transfer to Wallet
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-visible" data-testid="leagues-list-card">
        <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 px-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              data-testid={`tab-${t.key}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No leagues in this category</p>
            </div>
          ) : (
            filtered.map((league) => {
              const sc = statusConfig[league.status];
              return (
                <div key={league.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3" data-testid={`card-my-league-${league.id}`}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{league.name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span><Users className="w-3 h-3 inline mr-1" />{league.totalParticipants} participants</span>
                        <span><Calendar className="w-3 h-3 inline mr-1" />{new Date(league.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(league.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {league.rank > 0 && (
                        <Badge className={`${league.rank <= 3 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}>
                          Rank #{league.rank}
                        </Badge>
                      )}
                      <Badge className={sc.color}>{sc.label}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Prize Pool</p>
                      <p className="text-sm font-bold text-brand-600 dark:text-brand-400">${league.prize.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Entry Fee</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">${league.entryFee}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Profit</p>
                      <p className={`text-sm font-bold flex items-center gap-1 ${league.profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                        {league.profit >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        ${league.profit.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {league.status === "active" && (
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{league.progress}%</span>
                      </div>
                      <Progress value={league.progress} className="h-1.5" />
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      </Card>

      <Dialog open={transferOpen} onOpenChange={(open) => { if (!open) setTransferOpen(false); }}>
        <DialogContent className="max-w-md bg-[#0f172a] border-gray-800 text-white" data-testid="dialog-transfer-wallet">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <ArrowLeftRight className="w-5 h-5 text-brand-400" />
              Transfer to Wallet
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Transfer your earnings to your main wallet balance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-gray-800/50">
              <div>
                <p className="text-sm text-gray-400">Total League Winnings</p>
                <p className="text-2xl font-bold text-white" data-testid="text-transfer-available">
                  ${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">Available to transfer</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-900/30">
                <Gift className="w-6 h-6 text-purple-400" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-gray-800/30">
              <div className="text-center flex-1">
                <p className="text-xs text-gray-400 mb-1">From</p>
                <p className="text-sm font-bold text-white">League Winnings</p>
              </div>
              <ArrowLeftRight className="w-5 h-5 text-gray-500 mx-3 shrink-0" />
              <div className="text-center flex-1">
                <p className="text-xs text-gray-400 mb-1">To</p>
                <p className="text-sm font-bold text-white">Main Wallet</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-white">Amount (USD)</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 font-semibold">$</span>
                <Input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  min={0}
                  max={totalProfit}
                  step={0.01}
                  className="pl-8 bg-gray-900 border-brand-500 text-white text-lg font-semibold h-12 focus:ring-brand-500"
                  data-testid="input-transfer-amount"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setPercentage(pct)}
                    className="py-2 px-3 rounded-lg border border-gray-700 bg-gray-800/50 text-sm font-medium text-gray-300 hover:border-brand-500 hover:text-white transition-colors"
                    data-testid={`button-pct-${pct}`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
              disabled={!transferAmount || Number(transferAmount) <= 0 || Number(transferAmount) > totalProfit}
              onClick={handleTransfer}
              data-testid="button-confirm-transfer"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Transfer to Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
