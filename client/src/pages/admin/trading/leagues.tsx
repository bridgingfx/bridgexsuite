import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Trophy,
  Plus,
  MoreHorizontal,
  Search,
  Pencil,
  XCircle,
  Users,
  StopCircle,
  Eye,
  Ban,
  Gift,
} from "lucide-react";

interface Tournament {
  id: number;
  name: string;
  type: "Demo" | "Live" | "Mixed";
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  currentParticipants: number;
  startDate: string;
  endDate: string;
  status: "Upcoming" | "Live" | "Completed" | "Cancelled";
}

interface Participant {
  id: number;
  rank: number;
  clientName: string;
  accountId: string;
  equity: number;
  pnl: number;
  winRate: number;
  trades: number;
  status: "Active" | "Disqualified";
  tournamentId: number;
}

interface PrizeTier {
  id: number;
  rankFrom: number;
  rankTo: number;
  prize: string;
  type: "Cash" | "Credit" | "Points";
  autoDistribute: boolean;
}

const mockTournaments: Tournament[] = [
  { id: 1, name: "Global FX Championship", type: "Live", entryFee: 100, prizePool: 50000, maxParticipants: 500, currentParticipants: 342, startDate: "2025-02-01", endDate: "2025-02-28", status: "Live" },
  { id: 2, name: "Demo Trading League", type: "Demo", entryFee: 0, prizePool: 10000, maxParticipants: 1000, currentParticipants: 876, startDate: "2025-01-15", endDate: "2025-03-15", status: "Live" },
  { id: 3, name: "Gold Rush Tournament", type: "Live", entryFee: 250, prizePool: 100000, maxParticipants: 200, currentParticipants: 200, startDate: "2024-12-01", endDate: "2025-01-31", status: "Completed" },
  { id: 4, name: "Crypto Futures Cup", type: "Mixed", entryFee: 50, prizePool: 25000, maxParticipants: 300, currentParticipants: 0, startDate: "2025-04-01", endDate: "2025-04-30", status: "Upcoming" },
  { id: 5, name: "Scalpers Challenge", type: "Live", entryFee: 75, prizePool: 15000, maxParticipants: 150, currentParticipants: 98, startDate: "2025-03-01", endDate: "2025-03-31", status: "Upcoming" },
  { id: 6, name: "Indices Masters", type: "Demo", entryFee: 0, prizePool: 5000, maxParticipants: 500, currentParticipants: 500, startDate: "2024-11-01", endDate: "2024-12-31", status: "Completed" },
  { id: 7, name: "Swing Trading Open", type: "Mixed", entryFee: 150, prizePool: 40000, maxParticipants: 250, currentParticipants: 45, startDate: "2025-05-01", endDate: "2025-06-30", status: "Upcoming" },
  { id: 8, name: "Summer Showdown", type: "Live", entryFee: 200, prizePool: 75000, maxParticipants: 400, currentParticipants: 0, startDate: "2025-07-01", endDate: "2025-08-31", status: "Cancelled" },
];

const mockParticipants: Participant[] = [
  { id: 1, rank: 1, clientName: "Alexander Volkov", accountId: "MT5-100234", equity: 15420.50, pnl: 5420.50, winRate: 72.3, trades: 156, status: "Active", tournamentId: 1 },
  { id: 2, rank: 2, clientName: "Sarah Chen", accountId: "MT5-100891", equity: 14850.00, pnl: 4850.00, winRate: 68.1, trades: 203, status: "Active", tournamentId: 1 },
  { id: 3, rank: 3, clientName: "Mohammed Al-Rashid", accountId: "MT5-101102", equity: 13920.75, pnl: 3920.75, winRate: 65.4, trades: 178, status: "Active", tournamentId: 1 },
  { id: 4, rank: 4, clientName: "Elena Petrov", accountId: "MT5-100567", equity: 13200.00, pnl: 3200.00, winRate: 61.2, trades: 142, status: "Active", tournamentId: 1 },
  { id: 5, rank: 5, clientName: "James O'Brien", accountId: "MT5-100445", equity: 12780.25, pnl: 2780.25, winRate: 59.8, trades: 189, status: "Active", tournamentId: 1 },
  { id: 6, rank: 6, clientName: "Yuki Tanaka", accountId: "MT5-101234", equity: 12450.00, pnl: 2450.00, winRate: 57.3, trades: 221, status: "Active", tournamentId: 2 },
  { id: 7, rank: 7, clientName: "Carlos Mendoza", accountId: "MT5-100678", equity: 11980.50, pnl: 1980.50, winRate: 55.1, trades: 167, status: "Disqualified", tournamentId: 1 },
  { id: 8, rank: 8, clientName: "Anya Sharma", accountId: "MT5-101456", equity: 11520.00, pnl: 1520.00, winRate: 53.9, trades: 134, status: "Active", tournamentId: 2 },
  { id: 9, rank: 9, clientName: "Lucas Weber", accountId: "MT5-100912", equity: 11100.75, pnl: 1100.75, winRate: 51.2, trades: 198, status: "Active", tournamentId: 1 },
  { id: 10, rank: 10, clientName: "Fatima Hassan", accountId: "MT5-101789", equity: 10850.00, pnl: 850.00, winRate: 49.8, trades: 145, status: "Active", tournamentId: 2 },
  { id: 11, rank: 11, clientName: "David Kim", accountId: "MT5-100321", equity: 10200.50, pnl: 200.50, winRate: 47.5, trades: 176, status: "Active", tournamentId: 1 },
  { id: 12, rank: 12, clientName: "Maria Santos", accountId: "MT5-101567", equity: 9800.00, pnl: -200.00, winRate: 44.2, trades: 210, status: "Active", tournamentId: 2 },
];

const mockPrizeTiers: PrizeTier[] = [
  { id: 1, rankFrom: 1, rankTo: 1, prize: "$10,000", type: "Cash", autoDistribute: true },
  { id: 2, rankFrom: 2, rankTo: 2, prize: "$5,000", type: "Cash", autoDistribute: true },
  { id: 3, rankFrom: 3, rankTo: 3, prize: "$2,500", type: "Cash", autoDistribute: true },
  { id: 4, rankFrom: 4, rankTo: 10, prize: "$500", type: "Credit", autoDistribute: false },
  { id: 5, rankFrom: 11, rankTo: 25, prize: "1,000 pts", type: "Points", autoDistribute: false },
];

function getRankLabel(from: number, to: number): string {
  if (from === to) {
    if (from === 1) return "1st";
    if (from === 2) return "2nd";
    if (from === 3) return "3rd";
    return `${from}th`;
  }
  return `${from}th - ${to}th`;
}

function getStatusVariant(status: string) {
  switch (status) {
    case "Live":
    case "Active":
      return "default" as const;
    case "Upcoming":
      return "secondary" as const;
    case "Completed":
      return "outline" as const;
    case "Cancelled":
    case "Disqualified":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

function getTypeVariant(type: string) {
  switch (type) {
    case "Live":
      return "default" as const;
    case "Demo":
      return "secondary" as const;
    case "Mixed":
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

export default function LeaguesPage() {
  const { toast } = useToast();
  const [tournaments, setTournaments] = useState<Tournament[]>(mockTournaments);
  const [prizeTiers, setPrizeTiers] = useState<PrizeTier[]>(mockPrizeTiers);
  const [createTournamentOpen, setCreateTournamentOpen] = useState(false);
  const [addPrizeTierOpen, setAddPrizeTierOpen] = useState(false);
  const [disqualifyOpen, setDisqualifyOpen] = useState(false);
  const [distributeConfirmOpen, setDistributeConfirmOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [disqualifyReason, setDisqualifyReason] = useState("");
  const [selectedTournamentFilter, setSelectedTournamentFilter] = useState("all");
  const [participantSearch, setParticipantSearch] = useState("");

  const [newTournament, setNewTournament] = useState({
    name: "",
    type: "Demo" as "Demo" | "Live" | "Mixed",
    entryFee: "",
    prizePool: "",
    maxParticipants: "",
    startDate: "",
    endDate: "",
    rules: "",
    autoStart: false,
  });

  const [newPrizeTier, setNewPrizeTier] = useState({
    rankFrom: "",
    rankTo: "",
    prizeAmount: "",
    prizeType: "Cash" as "Cash" | "Credit" | "Points",
  });

  const handleCreateTournament = () => {
    if (!newTournament.name || !newTournament.prizePool || !newTournament.startDate || !newTournament.endDate) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    const created: Tournament = {
      id: tournaments.length + 1,
      name: newTournament.name,
      type: newTournament.type,
      entryFee: parseFloat(newTournament.entryFee) || 0,
      prizePool: parseFloat(newTournament.prizePool) || 0,
      maxParticipants: parseInt(newTournament.maxParticipants) || 100,
      currentParticipants: 0,
      startDate: newTournament.startDate,
      endDate: newTournament.endDate,
      status: "Upcoming",
    };
    setTournaments([...tournaments, created]);
    setCreateTournamentOpen(false);
    setNewTournament({ name: "", type: "Demo", entryFee: "", prizePool: "", maxParticipants: "", startDate: "", endDate: "", rules: "", autoStart: false });
    toast({ title: "Tournament created successfully" });
  };

  const handleCancelTournament = (id: number) => {
    setTournaments(tournaments.map((t) => (t.id === id ? { ...t, status: "Cancelled" as const } : t)));
    toast({ title: "Tournament cancelled" });
  };

  const handleEndEarly = (id: number) => {
    setTournaments(tournaments.map((t) => (t.id === id ? { ...t, status: "Completed" as const } : t)));
    toast({ title: "Tournament ended early" });
  };

  const handleDisqualify = () => {
    if (!disqualifyReason) {
      toast({ title: "Please provide a reason", variant: "destructive" });
      return;
    }
    toast({ title: `${selectedParticipant?.clientName} has been disqualified`, description: `Reason: ${disqualifyReason}` });
    setDisqualifyOpen(false);
    setDisqualifyReason("");
    setSelectedParticipant(null);
  };

  const handleAddPrizeTier = () => {
    if (!newPrizeTier.rankFrom || !newPrizeTier.rankTo || !newPrizeTier.prizeAmount) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    const tier: PrizeTier = {
      id: prizeTiers.length + 1,
      rankFrom: parseInt(newPrizeTier.rankFrom),
      rankTo: parseInt(newPrizeTier.rankTo),
      prize: newPrizeTier.prizeType === "Points" ? `${newPrizeTier.prizeAmount} pts` : `$${newPrizeTier.prizeAmount}`,
      type: newPrizeTier.prizeType,
      autoDistribute: false,
    };
    setPrizeTiers([...prizeTiers, tier]);
    setAddPrizeTierOpen(false);
    setNewPrizeTier({ rankFrom: "", rankTo: "", prizeAmount: "", prizeType: "Cash" });
    toast({ title: "Prize tier added successfully" });
  };

  const handleDistributePrizes = () => {
    setDistributeConfirmOpen(false);
    toast({ title: "Prizes distributed successfully", description: "All eligible participants have been awarded their prizes." });
  };

  const filteredParticipants = mockParticipants.filter((p) => {
    const matchesTournament = selectedTournamentFilter === "all" || p.tournamentId === parseInt(selectedTournamentFilter);
    const matchesSearch = !participantSearch || p.clientName.toLowerCase().includes(participantSearch.toLowerCase());
    return matchesTournament && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white" data-testid="text-leagues-title">
              Leagues Management
            </h1>
            <p className="text-sm text-emerald-100" data-testid="text-leagues-subtitle">
              Create and manage trading tournaments, track participants, and distribute prizes
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="tournaments">
            <div className="border-b px-4 pt-2">
              <TabsList>
                <TabsTrigger value="tournaments" data-testid="tab-tournaments">
                  <Trophy className="w-4 h-4 mr-2" /> Tournaments
                </TabsTrigger>
                <TabsTrigger value="participants" data-testid="tab-participants">
                  <Users className="w-4 h-4 mr-2" /> Participants
                </TabsTrigger>
                <TabsTrigger value="prizes" data-testid="tab-prizes">
                  <Gift className="w-4 h-4 mr-2" /> Prize Distribution
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="tournaments" className="p-6 space-y-4">
              <div className="flex items-center justify-end">
                <Button onClick={() => setCreateTournamentOpen(true)} data-testid="button-create-tournament">
                  <Plus className="w-4 h-4 mr-2" /> Create Tournament
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tournament Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Entry Fee</TableHead>
                      <TableHead>Prize Pool</TableHead>
                      <TableHead>Max</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tournaments.map((t) => (
                      <TableRow key={t.id} data-testid={`row-tournament-${t.id}`}>
                        <TableCell className="font-medium" data-testid={`text-tournament-name-${t.id}`}>{t.name}</TableCell>
                        <TableCell><Badge variant={getTypeVariant(t.type)} data-testid={`badge-tournament-type-${t.id}`}>{t.type}</Badge></TableCell>
                        <TableCell data-testid={`text-entry-fee-${t.id}`}>{t.entryFee === 0 ? "Free" : `$${t.entryFee}`}</TableCell>
                        <TableCell data-testid={`text-prize-pool-${t.id}`}>${t.prizePool.toLocaleString()}</TableCell>
                        <TableCell data-testid={`text-max-participants-${t.id}`}>{t.maxParticipants}</TableCell>
                        <TableCell data-testid={`text-current-participants-${t.id}`}>{t.currentParticipants}</TableCell>
                        <TableCell>{t.startDate}</TableCell>
                        <TableCell>{t.endDate}</TableCell>
                        <TableCell><Badge variant={getStatusVariant(t.status)} data-testid={`badge-tournament-status-${t.id}`}>{t.status}</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" data-testid={`button-tournament-actions-${t.id}`}>
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem data-testid={`action-edit-tournament-${t.id}`}>
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              {(t.status === "Upcoming" || t.status === "Live") && (
                                <DropdownMenuItem
                                  onClick={() => handleCancelTournament(t.id)}
                                  data-testid={`action-cancel-tournament-${t.id}`}
                                >
                                  <XCircle className="w-4 h-4 mr-2" /> Cancel
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem data-testid={`action-view-participants-${t.id}`}>
                                <Users className="w-4 h-4 mr-2" /> View Participants
                              </DropdownMenuItem>
                              {t.status === "Live" && (
                                <DropdownMenuItem
                                  onClick={() => handleEndEarly(t.id)}
                                  data-testid={`action-end-early-${t.id}`}
                                >
                                  <StopCircle className="w-4 h-4 mr-2" /> End Early
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="participants" className="p-6 space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="w-64">
                  <Select value={selectedTournamentFilter} onValueChange={setSelectedTournamentFilter}>
                    <SelectTrigger data-testid="select-tournament-filter">
                      <SelectValue placeholder="Select Tournament" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tournaments</SelectItem>
                      {tournaments.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by client name..."
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                    className="pl-9"
                    data-testid="input-participant-search"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Account ID</TableHead>
                      <TableHead>Equity</TableHead>
                      <TableHead>P/L</TableHead>
                      <TableHead>Win Rate %</TableHead>
                      <TableHead>Trades</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParticipants.map((p) => (
                      <TableRow key={p.id} data-testid={`row-participant-${p.id}`}>
                        <TableCell className="font-medium" data-testid={`text-participant-rank-${p.id}`}>#{p.rank}</TableCell>
                        <TableCell data-testid={`text-participant-name-${p.id}`}>{p.clientName}</TableCell>
                        <TableCell data-testid={`text-participant-account-${p.id}`}>{p.accountId}</TableCell>
                        <TableCell data-testid={`text-participant-equity-${p.id}`}>${p.equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell data-testid={`text-participant-pnl-${p.id}`}>
                          <span className={p.pnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                            {p.pnl >= 0 ? "+" : ""}${p.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </TableCell>
                        <TableCell data-testid={`text-participant-winrate-${p.id}`}>{p.winRate}%</TableCell>
                        <TableCell data-testid={`text-participant-trades-${p.id}`}>{p.trades}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(p.status)} data-testid={`badge-participant-status-${p.id}`}>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" data-testid={`button-participant-actions-${p.id}`}>
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {p.status === "Active" && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedParticipant(p);
                                    setDisqualifyOpen(true);
                                  }}
                                  data-testid={`action-disqualify-${p.id}`}
                                >
                                  <Ban className="w-4 h-4 mr-2" /> Disqualify
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem data-testid={`action-view-account-${p.id}`}>
                                <Eye className="w-4 h-4 mr-2" /> View Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="prizes" className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="w-64">
                  <Select defaultValue="3">
                    <SelectTrigger data-testid="select-prize-tournament">
                      <SelectValue placeholder="Select Tournament" />
                    </SelectTrigger>
                    <SelectContent>
                      {tournaments.filter((t) => t.status === "Completed").map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" onClick={() => setAddPrizeTierOpen(true)} data-testid="button-add-prize-tier">
                    <Plus className="w-4 h-4 mr-2" /> Add Prize Tier
                  </Button>
                  <Button onClick={() => setDistributeConfirmOpen(true)} data-testid="button-distribute-prizes">
                    <Gift className="w-4 h-4 mr-2" /> Distribute Prizes
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Prize</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Auto-distribute</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prizeTiers.map((tier) => (
                      <TableRow key={tier.id} data-testid={`row-prize-tier-${tier.id}`}>
                        <TableCell className="font-medium" data-testid={`text-prize-rank-${tier.id}`}>
                          {getRankLabel(tier.rankFrom, tier.rankTo)}
                        </TableCell>
                        <TableCell data-testid={`text-prize-amount-${tier.id}`}>{tier.prize}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" data-testid={`badge-prize-type-${tier.id}`}>{tier.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={tier.autoDistribute}
                            onCheckedChange={(checked) => {
                              setPrizeTiers(prizeTiers.map((t) => t.id === tier.id ? { ...t, autoDistribute: checked } : t));
                            }}
                            data-testid={`switch-auto-distribute-${tier.id}`}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={createTournamentOpen} onOpenChange={setCreateTournamentOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Tournament</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tournament Name</Label>
              <Input
                value={newTournament.name}
                onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                placeholder="Enter tournament name"
                data-testid="input-tournament-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={newTournament.type} onValueChange={(v) => setNewTournament({ ...newTournament, type: v as "Demo" | "Live" | "Mixed" })}>
                <SelectTrigger data-testid="select-tournament-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Demo">Demo</SelectItem>
                  <SelectItem value="Live">Live</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Entry Fee ($)</Label>
                <Input
                  type="number"
                  value={newTournament.entryFee}
                  onChange={(e) => setNewTournament({ ...newTournament, entryFee: e.target.value })}
                  placeholder="0"
                  data-testid="input-tournament-entry-fee"
                />
              </div>
              <div className="space-y-2">
                <Label>Prize Pool ($)</Label>
                <Input
                  type="number"
                  value={newTournament.prizePool}
                  onChange={(e) => setNewTournament({ ...newTournament, prizePool: e.target.value })}
                  placeholder="10000"
                  data-testid="input-tournament-prize-pool"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Max Participants</Label>
              <Input
                type="number"
                value={newTournament.maxParticipants}
                onChange={(e) => setNewTournament({ ...newTournament, maxParticipants: e.target.value })}
                placeholder="100"
                data-testid="input-tournament-max-participants"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={newTournament.startDate}
                  onChange={(e) => setNewTournament({ ...newTournament, startDate: e.target.value })}
                  data-testid="input-tournament-start-date"
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={newTournament.endDate}
                  onChange={(e) => setNewTournament({ ...newTournament, endDate: e.target.value })}
                  data-testid="input-tournament-end-date"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Rules</Label>
              <Textarea
                value={newTournament.rules}
                onChange={(e) => setNewTournament({ ...newTournament, rules: e.target.value })}
                placeholder="Enter tournament rules..."
                data-testid="textarea-tournament-rules"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Auto-start</p>
                <p className="text-xs text-muted-foreground">Automatically start tournament on start date</p>
              </div>
              <Switch
                checked={newTournament.autoStart}
                onCheckedChange={(v) => setNewTournament({ ...newTournament, autoStart: v })}
                data-testid="switch-tournament-auto-start"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateTournamentOpen(false)} data-testid="button-cancel-create">
              Cancel
            </Button>
            <Button onClick={handleCreateTournament} data-testid="button-submit-tournament">
              Create Tournament
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={disqualifyOpen} onOpenChange={setDisqualifyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disqualify Participant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to disqualify <span className="font-medium text-foreground">{selectedParticipant?.clientName}</span>?
            </p>
            <div className="space-y-2">
              <Label>Reason for Disqualification</Label>
              <Textarea
                value={disqualifyReason}
                onChange={(e) => setDisqualifyReason(e.target.value)}
                placeholder="Enter reason..."
                data-testid="textarea-disqualify-reason"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisqualifyOpen(false)} data-testid="button-cancel-disqualify">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDisqualify} data-testid="button-confirm-disqualify">
              Disqualify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addPrizeTierOpen} onOpenChange={setAddPrizeTierOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Prize Tier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rank From</Label>
                <Input
                  type="number"
                  value={newPrizeTier.rankFrom}
                  onChange={(e) => setNewPrizeTier({ ...newPrizeTier, rankFrom: e.target.value })}
                  placeholder="1"
                  data-testid="input-prize-rank-from"
                />
              </div>
              <div className="space-y-2">
                <Label>Rank To</Label>
                <Input
                  type="number"
                  value={newPrizeTier.rankTo}
                  onChange={(e) => setNewPrizeTier({ ...newPrizeTier, rankTo: e.target.value })}
                  placeholder="1"
                  data-testid="input-prize-rank-to"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Prize Amount</Label>
              <Input
                type="number"
                value={newPrizeTier.prizeAmount}
                onChange={(e) => setNewPrizeTier({ ...newPrizeTier, prizeAmount: e.target.value })}
                placeholder="1000"
                data-testid="input-prize-amount"
              />
            </div>
            <div className="space-y-2">
              <Label>Prize Type</Label>
              <Select value={newPrizeTier.prizeType} onValueChange={(v) => setNewPrizeTier({ ...newPrizeTier, prizeType: v as "Cash" | "Credit" | "Points" })}>
                <SelectTrigger data-testid="select-prize-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Credit">Credit</SelectItem>
                  <SelectItem value="Points">Points</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPrizeTierOpen(false)} data-testid="button-cancel-prize-tier">
              Cancel
            </Button>
            <Button onClick={handleAddPrizeTier} data-testid="button-submit-prize-tier">
              Add Prize Tier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={distributeConfirmOpen} onOpenChange={setDistributeConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Distribute Prizes</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to distribute prizes for this completed tournament? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDistributeConfirmOpen(false)} data-testid="button-cancel-distribute">
              Cancel
            </Button>
            <Button onClick={handleDistributePrizes} data-testid="button-confirm-distribute">
              Confirm Distribution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}