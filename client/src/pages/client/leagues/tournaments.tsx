import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  Search,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Flame,
  Filter,
} from "lucide-react";

type TournamentStatus = "upcoming" | "live" | "completed";

interface Tournament {
  id: string;
  name: string;
  status: TournamentStatus;
  entryFee: number;
  prize: number;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  type: string;
}

const tournaments: Tournament[] = [
  { id: "T-001", name: "Spring Championship 2024", status: "upcoming", entryFee: 50, prize: 10000, startDate: "2024-04-01", endDate: "2024-04-07", participants: 89, maxParticipants: 200, type: "Forex" },
  { id: "T-002", name: "Crypto Pairs Battle", status: "upcoming", entryFee: 25, prize: 5000, startDate: "2024-04-15", endDate: "2024-04-20", participants: 45, maxParticipants: 100, type: "Crypto" },
  { id: "T-003", name: "Gold Rush Tournament", status: "upcoming", entryFee: 100, prize: 25000, startDate: "2024-05-01", endDate: "2024-05-10", participants: 32, maxParticipants: 150, type: "Commodities" },
  { id: "T-004", name: "Weekly Scalpers Sprint #143", status: "live", entryFee: 10, prize: 1000, startDate: "2024-03-11", endDate: "2024-03-15", participants: 64, maxParticipants: 64, type: "Forex" },
  { id: "T-005", name: "Monthly Masters Cup - March", status: "live", entryFee: 75, prize: 15000, startDate: "2024-03-01", endDate: "2024-03-31", participants: 200, maxParticipants: 256, type: "All" },
  { id: "T-006", name: "February Showdown", status: "completed", entryFee: 50, prize: 8000, startDate: "2024-02-01", endDate: "2024-02-28", participants: 128, maxParticipants: 128, type: "Forex" },
  { id: "T-007", name: "New Year Challenge", status: "completed", entryFee: 30, prize: 3000, startDate: "2024-01-15", endDate: "2024-01-22", participants: 96, maxParticipants: 100, type: "Forex" },
];

const statusConfig: Record<TournamentStatus, { color: string; label: string }> = {
  upcoming: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", label: "Upcoming" },
  live: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", label: "Live" },
  completed: { color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", label: "Completed" },
};

export default function LeaguesTournaments() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TournamentStatus | "all">("all");

  const filtered = tournaments.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const tabs: { key: TournamentStatus | "all"; label: string; icon: typeof Trophy }[] = [
    { key: "all", label: "All", icon: Filter },
    { key: "live", label: "Live", icon: Flame },
    { key: "upcoming", label: "Upcoming", icon: Calendar },
    { key: "completed", label: "Completed", icon: Clock },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto" data-testid="leagues-tournaments-page">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-tournaments-title">
          Tournaments
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Browse and join trading tournaments to win prizes
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search tournaments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            data-testid="input-search-tournaments"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filterStatus === tab.key
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              data-testid={`tab-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tournament) => {
          const sc = statusConfig[tournament.status];
          const fillPercent = (tournament.participants / tournament.maxParticipants) * 100;
          return (
            <Card key={tournament.id} className="p-6 space-y-4" data-testid={`card-tournament-${tournament.id}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{tournament.name}</p>
                  <Badge variant="outline" className="mt-1 text-xs">{tournament.type}</Badge>
                </div>
                <Badge className={sc.color}>{sc.label}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Prize Pool</p>
                  <p className="text-lg font-bold text-brand-600 dark:text-brand-400" data-testid={`text-prize-${tournament.id}`}>
                    ${tournament.prize.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Entry Fee</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white" data-testid={`text-fee-${tournament.id}`}>
                    ${tournament.entryFee}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {tournament.participants}/{tournament.maxParticipants}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(tournament.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(tournament.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <Progress value={fillPercent} className="h-1.5" />
              </div>

              {tournament.status === "upcoming" && (
                <Button className="w-full" data-testid={`button-join-${tournament.id}`}>
                  <DollarSign className="w-4 h-4 mr-1" />
                  Join for ${tournament.entryFee}
                </Button>
              )}
              {tournament.status === "live" && (
                <Button variant="outline" className="w-full" data-testid={`button-view-live-${tournament.id}`}>
                  <Flame className="w-4 h-4 mr-1" />
                  View Live
                </Button>
              )}
              {tournament.status === "completed" && (
                <Button variant="ghost" className="w-full" data-testid={`button-view-results-${tournament.id}`}>
                  View Results
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No tournaments found</p>
        </div>
      )}
    </div>
  );
}
