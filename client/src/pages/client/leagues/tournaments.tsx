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
import { useLocation } from "wouter";
import {
  Trophy,
  Search,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Flame,
  Filter,
  Wallet,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
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

const walletBalance = 75.00;

export default function LeaguesTournaments() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TournamentStatus | "all">("all");
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinTournament, setJoinTournament] = useState<Tournament | null>(null);

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

  function openJoin(tournament: Tournament) {
    setJoinTournament(tournament);
    setJoinOpen(true);
  }

  function handleJoin() {
    if (!joinTournament) return;
    if (walletBalance < joinTournament.entryFee) return;
    toast({
      title: "Successfully Joined!",
      description: `You've joined ${joinTournament.name}. $${joinTournament.entryFee.toFixed(2)} deducted from your wallet.`,
    });
    setJoinOpen(false);
    setJoinTournament(null);
  }

  function goToDeposit() {
    setJoinOpen(false);
    setJoinTournament(null);
    setLocation("/forex/finance");
  }

  const hasEnoughBalance = joinTournament ? walletBalance >= joinTournament.entryFee : false;

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
                <Button className="w-full" onClick={() => openJoin(tournament)} data-testid={`button-join-${tournament.id}`}>
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

      <Dialog open={joinOpen} onOpenChange={(open) => { if (!open) { setJoinOpen(false); setJoinTournament(null); } }}>
        <DialogContent className="max-w-md bg-[#0f172a] border-gray-800 text-white" data-testid="dialog-join-tournament">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Join Tournament
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Pay from your main wallet to join this tournament.
            </DialogDescription>
          </DialogHeader>

          {joinTournament && (
            <div className="space-y-5">
              <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50">
                <p className="font-bold text-white text-base" data-testid="text-join-tournament-name">{joinTournament.name}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {joinTournament.participants}/{joinTournament.maxParticipants}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(joinTournament.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(joinTournament.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">{joinTournament.type}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/30 text-center">
                  <p className="text-xs text-gray-400 mb-1">Prize Pool</p>
                  <p className="text-lg font-bold text-brand-400">${joinTournament.prize.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/30 text-center">
                  <p className="text-xs text-gray-400 mb-1">Entry Fee</p>
                  <p className="text-lg font-bold text-white">${joinTournament.entryFee.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-gray-800/30">
                <div className="text-center flex-1">
                  <p className="text-xs text-gray-400 mb-1">Pay From</p>
                  <p className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                    <Wallet className="w-4 h-4 text-brand-400" />
                    Main Wallet
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 mx-3 shrink-0" />
                <div className="text-center flex-1">
                  <p className="text-xs text-gray-400 mb-1">Tournament</p>
                  <p className="text-sm font-bold text-white">{joinTournament.name.length > 20 ? joinTournament.name.substring(0, 20) + "..." : joinTournament.name}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Wallet Balance</p>
                  <p className={`text-lg font-bold ${hasEnoughBalance ? "text-emerald-400" : "text-red-400"}`} data-testid="text-wallet-balance">
                    ${walletBalance.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
                  <p className="text-sm text-gray-400">Entry Fee</p>
                  <p className="text-sm font-bold text-white">- ${joinTournament.entryFee.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
                  <p className="text-sm font-medium text-gray-300">Remaining Balance</p>
                  <p className={`text-sm font-bold ${hasEnoughBalance ? "text-emerald-400" : "text-red-400"}`}>
                    ${(walletBalance - joinTournament.entryFee).toFixed(2)}
                  </p>
                </div>
              </div>

              {hasEnoughBalance ? (
                <Button
                  className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
                  onClick={handleJoin}
                  data-testid="button-confirm-join"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Pay ${joinTournament.entryFee.toFixed(2)} & Join
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-800/50">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    <p className="text-sm text-red-300" data-testid="text-insufficient-balance">
                      Insufficient wallet balance. Please top up your wallet to join this tournament.
                    </p>
                  </div>
                  <Button
                    className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700"
                    onClick={goToDeposit}
                    data-testid="button-goto-deposit"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Top Up Wallet
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
