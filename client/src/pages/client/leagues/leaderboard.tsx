import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Users,
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  country: string;
  profit: number;
  profitPercent: number;
  trades: number;
  winRate: number;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "AlphaTrader_92", country: "US", profit: 12450, profitPercent: 24.9, trades: 342, winRate: 68.2 },
  { rank: 2, name: "FxMaster_UK", country: "GB", profit: 10200, profitPercent: 20.4, trades: 256, winRate: 72.1 },
  { rank: 3, name: "TokyoScalper", country: "JP", profit: 8900, profitPercent: 17.8, trades: 512, winRate: 61.5 },
  { rank: 4, name: "SwissEdge", country: "CH", profit: 7650, profitPercent: 15.3, trades: 189, winRate: 74.6 },
  { rank: 5, name: "DubaiGold", country: "AE", profit: 6800, profitPercent: 13.6, trades: 278, winRate: 65.8 },
  { rank: 6, name: "John S.", country: "US", profit: 5420, profitPercent: 10.8, trades: 145, winRate: 71.0 },
  { rank: 7, name: "EuroSwing", country: "DE", profit: 4900, profitPercent: 9.8, trades: 98, winRate: 78.5 },
  { rank: 8, name: "AsiaPips", country: "SG", profit: 4200, profitPercent: 8.4, trades: 320, winRate: 58.4 },
  { rank: 9, name: "NordTrader", country: "NO", profit: 3800, profitPercent: 7.6, trades: 167, winRate: 66.3 },
  { rank: 10, name: "CanadianBull", country: "CA", profit: 3500, profitPercent: 7.0, trades: 210, winRate: 62.8 },
];

const leagues = [
  { value: "weekly-scalpers", label: "Weekly Scalpers League" },
  { value: "monthly-masters", label: "Monthly Masters Cup" },
  { value: "spring-championship", label: "Spring Championship 2024" },
];

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return null;
}

function getRankStyle(rank: number) {
  if (rank === 1) return "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border-yellow-200 dark:border-yellow-800";
  if (rank === 2) return "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/30 dark:to-slate-800/30 border-gray-200 dark:border-gray-700";
  if (rank === 3) return "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-800";
  return "border-gray-100 dark:border-gray-800";
}

export default function LeaguesLeaderboard() {
  const [selectedLeague, setSelectedLeague] = useState("weekly-scalpers");

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto" data-testid="leagues-leaderboard-page">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-leaderboard-title">
            Leaderboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            See who's leading the competition
          </p>
        </div>
        <Select value={selectedLeague} onValueChange={setSelectedLeague}>
          <SelectTrigger className="w-[260px]" data-testid="select-league">
            <SelectValue placeholder="Select league" />
          </SelectTrigger>
          <SelectContent>
            {leagues.map((l) => (
              <SelectItem key={l.value} value={l.value} data-testid={`option-league-${l.value}`}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaderboardData.slice(0, 3).map((entry) => (
          <Card
            key={entry.rank}
            className={`p-6 border ${getRankStyle(entry.rank)} text-center`}
            data-testid={`card-top-${entry.rank}`}
          >
            <div className="flex justify-center mb-3">
              {getRankIcon(entry.rank)}
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] mx-auto mb-3">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{entry.name.charAt(0)}</span>
              </div>
            </div>
            <p className="font-bold text-gray-900 dark:text-white">{entry.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{entry.country}</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              +${entry.profit.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              +{entry.profitPercent}% · {entry.winRate}% win rate
            </p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden" data-testid="section-full-leaderboard">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h2 className="font-bold text-gray-900 dark:text-white">Full Rankings</h2>
          <Badge variant="outline" className="ml-auto">
            <Users className="w-3 h-3 mr-1" />
            {leaderboardData.length} traders
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" data-testid="table-leaderboard">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trader</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Profit</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Return</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Trades</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {leaderboardData.map((entry) => (
                <tr
                  key={entry.rank}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 ${entry.name === "John S." ? "bg-brand-50/30 dark:bg-brand-900/5" : ""}`}
                  data-testid={`row-rank-${entry.rank}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(entry.rank) || <span className="text-sm font-bold text-gray-500 dark:text-gray-400 w-5 text-center">{entry.rank}</span>}
                      {entry.rank <= 3 && <span className="text-sm font-bold">#{entry.rank}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[1px]">
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{entry.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {entry.name}
                          {entry.name === "John S." && <Badge className="ml-2 bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-[10px]">You</Badge>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{entry.country}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +${entry.profit.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                    +{entry.profitPercent}%
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-500 dark:text-gray-400">
                    {entry.trades}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-500 dark:text-gray-400">
                    {entry.winRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
