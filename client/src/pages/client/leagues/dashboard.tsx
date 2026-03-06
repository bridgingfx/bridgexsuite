import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Swords,
  Trophy,
  Users,
  TrendingUp,
  Calendar,
  ArrowRight,
  Star,
  Target,
  Clock,
  Flame,
} from "lucide-react";
import { Link } from "wouter";

const activeLeagues = [
  { id: "LG-001", name: "Weekly Scalpers League", rank: 3, totalParticipants: 128, profit: 2450, endDate: "2024-03-15", status: "active" as const },
  { id: "LG-002", name: "Monthly Masters Cup", rank: 12, totalParticipants: 256, profit: 5120, endDate: "2024-03-31", status: "active" as const },
];

const upcomingTournaments = [
  { id: "T-001", name: "Spring Championship 2024", entryFee: 50, prize: 10000, startDate: "2024-04-01", participants: 89, maxParticipants: 200 },
  { id: "T-002", name: "Crypto Pairs Battle", entryFee: 25, prize: 5000, startDate: "2024-04-15", participants: 45, maxParticipants: 100 },
  { id: "T-003", name: "Gold Rush Tournament", entryFee: 100, prize: 25000, startDate: "2024-05-01", participants: 32, maxParticipants: 150 },
];

const recentResults = [
  { league: "Daily Sprint #142", rank: 1, prize: 500, date: "2024-03-10" },
  { league: "Pairs Challenge #78", rank: 5, prize: 100, date: "2024-03-08" },
  { league: "Weekend Warriors", rank: 2, prize: 300, date: "2024-03-03" },
];

export default function LeaguesDashboard() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto" data-testid="leagues-dashboard-page">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-leagues-title">
            Leagues
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Compete with traders worldwide and climb the leaderboard
          </p>
        </div>
        <Link href="/leagues/tournaments">
          <Button data-testid="button-browse-tournaments">
            <Trophy className="w-4 h-4 mr-2" />
            Browse Tournaments
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="leagues-stats">
        <Card className="p-6" data-testid="stat-active-leagues">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Leagues</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">2</h3>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-md">
              <Swords className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="stat-total-winnings">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Winnings</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">$900</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-md">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="stat-best-rank">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Best Rank</p>
              <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">#1</h3>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-md">
              <Star className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6" data-testid="stat-tournaments-joined">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tournaments Joined</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">14</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md">
              <Target className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6" data-testid="section-active-leagues">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Active Leagues
            </h2>
            <Link href="/leagues/my-leagues">
              <span className="text-sm font-medium text-brand-600 dark:text-brand-400 cursor-pointer" data-testid="link-view-all-leagues">
                View All <ArrowRight className="w-3 h-3 inline ml-1" />
              </span>
            </Link>
          </div>
          <div className="space-y-4">
            {activeLeagues.map((league) => (
              <div key={league.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-3" data-testid={`card-league-${league.id}`}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{league.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      <Users className="w-3 h-3 inline mr-1" />{league.totalParticipants} participants
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Rank #{league.rank}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3 inline mr-1" />Ends {new Date(league.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">+${league.profit.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6" data-testid="section-recent-results">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Recent Results
            </h2>
            <Link href="/leagues/leaderboard">
              <span className="text-sm font-medium text-brand-600 dark:text-brand-400 cursor-pointer" data-testid="link-view-leaderboard">
                Leaderboard <ArrowRight className="w-3 h-3 inline ml-1" />
              </span>
            </Link>
          </div>
          <div className="space-y-3">
            {recentResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50" data-testid={`row-result-${index}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    result.rank === 1 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                    result.rank <= 3 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                    "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}>
                    #{result.rank}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{result.league}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(result.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+${result.prize}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6" data-testid="section-upcoming-tournaments">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Upcoming Tournaments
          </h2>
          <Link href="/leagues/tournaments">
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400 cursor-pointer" data-testid="link-view-all-tournaments">
              View All <ArrowRight className="w-3 h-3 inline ml-1" />
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingTournaments.map((tournament) => (
            <div key={tournament.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3" data-testid={`card-tournament-${tournament.id}`}>
              <p className="font-semibold text-gray-900 dark:text-white">{tournament.name}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Prize Pool</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">${tournament.prize.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Entry Fee</span>
                <span className="font-medium text-gray-900 dark:text-white">${tournament.entryFee}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{tournament.participants}/{tournament.maxParticipants} joined</span>
                  <span>Starts {new Date(tournament.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
                <Progress value={(tournament.participants / tournament.maxParticipants) * 100} className="h-1.5" />
              </div>
              <Button variant="outline" size="sm" className="w-full" data-testid={`button-join-${tournament.id}`}>
                Join Tournament
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
