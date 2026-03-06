import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Swords,
  Trophy,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
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
  const [tab, setTab] = useState<LeagueStatus | "all">("all");

  const filtered = tab === "all" ? myLeagues : myLeagues.filter((l) => l.status === tab);

  const tabs: { key: LeagueStatus | "all"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "upcoming", label: "Upcoming" },
  ];

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
            ${myLeagues.reduce((sum, l) => sum + l.profit, 0).toLocaleString()}
          </h3>
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
    </div>
  );
}
