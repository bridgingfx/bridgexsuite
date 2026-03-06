import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Trophy,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  RotateCcw,
  Clock,
  DollarSign,
  Users,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";

interface Challenge {
  id: number;
  name: string;
  phases: string;
  accountSize: number;
  price: number;
  profitTarget: number;
  maxDailyDrawdown: number;
  maxTotalDrawdown: number;
  minTradingDays: number;
  duration: number;
  profitSplit: number;
  status: "Active" | "Inactive";
}

interface ActiveAccount {
  id: string;
  clientName: string;
  challenge: string;
  currentPhase: string;
  status: "Active" | "Breached" | "Passed" | "Failed";
  currentPL: number;
  drawdown: number;
  daysRemaining: number;
}

interface Payout {
  id: string;
  client: string;
  amount: number;
  profitSplit: string;
  account: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected" | "Paid";
}

const initialChallenges: Challenge[] = [
  { id: 1, name: "Starter Challenge", phases: "1-Phase", accountSize: 10000, price: 99, profitTarget: 10, maxDailyDrawdown: 5, maxTotalDrawdown: 10, minTradingDays: 5, duration: 30, profitSplit: 75, status: "Active" },
  { id: 2, name: "Standard Challenge", phases: "2-Phase", accountSize: 25000, price: 199, profitTarget: 8, maxDailyDrawdown: 5, maxTotalDrawdown: 10, minTradingDays: 5, duration: 45, profitSplit: 80, status: "Active" },
  { id: 3, name: "Professional Challenge", phases: "2-Phase", accountSize: 50000, price: 349, profitTarget: 8, maxDailyDrawdown: 4, maxTotalDrawdown: 8, minTradingDays: 10, duration: 60, profitSplit: 80, status: "Active" },
  { id: 4, name: "Elite Challenge", phases: "3-Phase", accountSize: 100000, price: 549, profitTarget: 6, maxDailyDrawdown: 4, maxTotalDrawdown: 8, minTradingDays: 10, duration: 90, profitSplit: 85, status: "Active" },
  { id: 5, name: "Master Challenge", phases: "2-Phase", accountSize: 200000, price: 999, profitTarget: 8, maxDailyDrawdown: 5, maxTotalDrawdown: 10, minTradingDays: 10, duration: 60, profitSplit: 90, status: "Active" },
  { id: 6, name: "Express Challenge", phases: "1-Phase", accountSize: 10000, price: 149, profitTarget: 12, maxDailyDrawdown: 6, maxTotalDrawdown: 12, minTradingDays: 3, duration: 14, profitSplit: 70, status: "Inactive" },
];

const initialAccounts: ActiveAccount[] = [
  { id: "PA-10001", clientName: "James Wilson", challenge: "Standard Challenge", currentPhase: "Phase 1", status: "Active", currentPL: 1250.00, drawdown: 2.1, daysRemaining: 28 },
  { id: "PA-10002", clientName: "Sarah Chen", challenge: "Professional Challenge", currentPhase: "Phase 2", status: "Active", currentPL: 3420.50, drawdown: 1.8, daysRemaining: 45 },
  { id: "PA-10003", clientName: "Michael Brown", challenge: "Elite Challenge", currentPhase: "Phase 1", status: "Breached", currentPL: -4200.00, drawdown: 8.4, daysRemaining: 0 },
  { id: "PA-10004", clientName: "Emma Davis", challenge: "Starter Challenge", currentPhase: "Phase 1", status: "Passed", currentPL: 1100.00, drawdown: 0.5, daysRemaining: 12 },
  { id: "PA-10005", clientName: "Robert Taylor", challenge: "Master Challenge", currentPhase: "Phase 1", status: "Active", currentPL: 8900.00, drawdown: 3.2, daysRemaining: 35 },
  { id: "PA-10006", clientName: "Lisa Anderson", challenge: "Standard Challenge", currentPhase: "Phase 2", status: "Failed", currentPL: -1800.00, drawdown: 6.5, daysRemaining: 0 },
  { id: "PA-10007", clientName: "David Martinez", challenge: "Professional Challenge", currentPhase: "Phase 1", status: "Active", currentPL: 2100.00, drawdown: 1.2, daysRemaining: 52 },
  { id: "PA-10008", clientName: "Jennifer White", challenge: "Elite Challenge", currentPhase: "Phase 3", status: "Active", currentPL: 5400.00, drawdown: 2.8, daysRemaining: 20 },
  { id: "PA-10009", clientName: "Thomas Lee", challenge: "Starter Challenge", currentPhase: "Phase 1", status: "Active", currentPL: 450.00, drawdown: 0.9, daysRemaining: 22 },
  { id: "PA-10010", clientName: "Amanda Clark", challenge: "Express Challenge", currentPhase: "Phase 1", status: "Breached", currentPL: -1500.00, drawdown: 12.5, daysRemaining: 0 },
];

const initialPayouts: Payout[] = [
  { id: "PO-5001", client: "Emma Davis", amount: 825.00, profitSplit: "75/25", account: "PA-10004", requestDate: "2025-01-15", status: "Pending" },
  { id: "PO-5002", client: "Sarah Chen", amount: 2736.40, profitSplit: "80/20", account: "PA-10002", requestDate: "2025-01-14", status: "Approved" },
  { id: "PO-5003", client: "Robert Taylor", amount: 8010.00, profitSplit: "90/10", account: "PA-10005", requestDate: "2025-01-12", status: "Paid" },
  { id: "PO-5004", client: "Jennifer White", amount: 4590.00, profitSplit: "85/15", account: "PA-10008", requestDate: "2025-01-10", status: "Paid" },
  { id: "PO-5005", client: "David Martinez", amount: 1680.00, profitSplit: "80/20", account: "PA-10007", requestDate: "2025-01-16", status: "Pending" },
  { id: "PO-5006", client: "Thomas Lee", amount: 337.50, profitSplit: "75/25", account: "PA-10009", requestDate: "2025-01-08", status: "Rejected" },
];

const defaultChallenge: Omit<Challenge, "id"> = {
  name: "",
  phases: "2-Phase",
  accountSize: 25000,
  price: 0,
  profitTarget: 8,
  maxDailyDrawdown: 5,
  maxTotalDrawdown: 10,
  minTradingDays: 5,
  duration: 30,
  profitSplit: 80,
  status: "Active",
};

export default function PropTradingPage() {
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [accounts, setAccounts] = useState<ActiveAccount[]>(initialAccounts);
  const [payouts, setPayouts] = useState<Payout[]>(initialPayouts);

  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [challengeForm, setChallengeForm] = useState<Omit<Challenge, "id">>(defaultChallenge);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; id: string; label: string } | null>(null);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectPayoutId, setRejectPayoutId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [deleteChallengeId, setDeleteChallengeId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [accountFilter, setAccountFilter] = useState<string>("All");

  const openAddChallenge = () => {
    setEditingChallenge(null);
    setChallengeForm(defaultChallenge);
    setChallengeDialogOpen(true);
  };

  const openEditChallenge = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    const { id: _, ...rest } = challenge;
    setChallengeForm(rest);
    setChallengeDialogOpen(true);
  };

  const saveChallenge = () => {
    if (!challengeForm.name.trim()) {
      toast({ title: "Challenge name is required", variant: "destructive" });
      return;
    }
    if (editingChallenge) {
      setChallenges((prev) =>
        prev.map((c) => (c.id === editingChallenge.id ? { ...challengeForm, id: editingChallenge.id } : c))
      );
      toast({ title: "Challenge updated successfully" });
    } else {
      const newId = Math.max(...challenges.map((c) => c.id), 0) + 1;
      setChallenges((prev) => [...prev, { ...challengeForm, id: newId }]);
      toast({ title: "Challenge created successfully" });
    }
    setChallengeDialogOpen(false);
  };

  const confirmDeleteChallenge = (id: number) => {
    setDeleteChallengeId(id);
    setDeleteDialogOpen(true);
  };

  const deleteChallenge = () => {
    if (deleteChallengeId !== null) {
      setChallenges((prev) => prev.filter((c) => c.id !== deleteChallengeId));
      toast({ title: "Challenge deleted" });
    }
    setDeleteDialogOpen(false);
    setDeleteChallengeId(null);
  };

  const openConfirmAction = (type: string, id: string, label: string) => {
    setConfirmAction({ type, id, label });
    setConfirmDialogOpen(true);
  };

  const executeAccountAction = () => {
    if (!confirmAction) return;
    const { type, id } = confirmAction;
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        switch (type) {
          case "pass":
            return { ...a, status: "Passed" as const };
          case "fail":
            return { ...a, status: "Failed" as const };
          case "reset":
            return { ...a, status: "Active" as const, currentPL: 0, drawdown: 0, daysRemaining: 30 };
          case "extend":
            return { ...a, daysRemaining: a.daysRemaining + 14 };
          case "refund":
            return { ...a, status: "Failed" as const, daysRemaining: 0 };
          default:
            return a;
        }
      })
    );
    toast({ title: `Account ${id} - ${confirmAction.label} action completed` });
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  const approvePayout = (id: string) => {
    setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Approved" as const } : p)));
    toast({ title: `Payout ${id} approved` });
  };

  const openRejectDialog = (id: string) => {
    setRejectPayoutId(id);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const rejectPayout = () => {
    if (rejectPayoutId) {
      setPayouts((prev) => prev.map((p) => (p.id === rejectPayoutId ? { ...p, status: "Rejected" as const } : p)));
      toast({ title: `Payout ${rejectPayoutId} rejected`, description: rejectReason || undefined });
    }
    setRejectDialogOpen(false);
    setRejectPayoutId(null);
    setRejectReason("");
  };

  const markAsPaid = (id: string) => {
    setPayouts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Paid" as const } : p)));
    toast({ title: `Payout ${id} marked as paid` });
  };

  const filteredAccounts = accountFilter === "All" ? accounts : accounts.filter((a) => a.status === accountFilter);

  const totalPayouts = payouts.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const pendingAmount = payouts.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  const thisMonthPayouts = payouts.filter((p) => p.status === "Paid" && p.requestDate.startsWith("2025-01")).reduce((s, p) => s + p.amount, 0);

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Passed": case "Approved": case "Paid": return "default";
      case "Breached": case "Failed": case "Rejected": return "destructive";
      case "Pending": return "secondary";
      case "Inactive": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="rounded-md bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border p-6">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-prop-trading-title">
          <Trophy className="inline-block w-6 h-6 mr-2 -mt-1" />
          Prop Trading Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage challenges, funded accounts, and trader payouts
        </p>
      </div>

      <Tabs defaultValue="challenges">
        <TabsList>
          <TabsTrigger value="challenges" data-testid="tab-challenges">Challenges</TabsTrigger>
          <TabsTrigger value="accounts" data-testid="tab-accounts">Active Accounts</TabsTrigger>
          <TabsTrigger value="payouts" data-testid="tab-payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4 mt-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-lg font-semibold">Trading Challenges</h2>
            <Button onClick={openAddChallenge} data-testid="button-add-challenge">
              <Plus className="w-4 h-4 mr-2" />
              Add Challenge
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Challenge Name</TableHead>
                      <TableHead>Phases</TableHead>
                      <TableHead>Account Size</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Profit Target %</TableHead>
                      <TableHead>Max Daily DD %</TableHead>
                      <TableHead>Max Total DD %</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {challenges.map((c) => (
                      <TableRow key={c.id} data-testid={`row-challenge-${c.id}`}>
                        <TableCell className="font-medium" data-testid={`text-challenge-name-${c.id}`}>{c.name}</TableCell>
                        <TableCell data-testid={`text-challenge-phases-${c.id}`}>{c.phases}</TableCell>
                        <TableCell data-testid={`text-challenge-size-${c.id}`}>${c.accountSize.toLocaleString()}</TableCell>
                        <TableCell data-testid={`text-challenge-price-${c.id}`}>${c.price}</TableCell>
                        <TableCell data-testid={`text-challenge-target-${c.id}`}>{c.profitTarget}%</TableCell>
                        <TableCell data-testid={`text-challenge-daily-dd-${c.id}`}>{c.maxDailyDrawdown}%</TableCell>
                        <TableCell data-testid={`text-challenge-total-dd-${c.id}`}>{c.maxTotalDrawdown}%</TableCell>
                        <TableCell data-testid={`text-challenge-duration-${c.id}`}>{c.duration} days</TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant(c.status)} data-testid={`badge-challenge-status-${c.id}`}>
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="ghost" onClick={() => openEditChallenge(c)} data-testid={`button-edit-challenge-${c.id}`}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => confirmDeleteChallenge(c.id)} data-testid={`button-delete-challenge-${c.id}`}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4 mt-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-lg font-semibold">Active Accounts</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {["All", "Active", "Breached", "Passed", "Failed"].map((f) => (
                <Button
                  key={f}
                  variant={accountFilter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAccountFilter(f)}
                  data-testid={`button-filter-${f.toLowerCase()}`}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account ID</TableHead>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Challenge</TableHead>
                      <TableHead>Current Phase</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Current P/L</TableHead>
                      <TableHead>Drawdown %</TableHead>
                      <TableHead>Days Remaining</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((a) => (
                      <TableRow key={a.id} data-testid={`row-account-${a.id}`}>
                        <TableCell className="font-mono text-sm" data-testid={`text-account-id-${a.id}`}>{a.id}</TableCell>
                        <TableCell className="font-medium" data-testid={`text-account-client-${a.id}`}>{a.clientName}</TableCell>
                        <TableCell data-testid={`text-account-challenge-${a.id}`}>{a.challenge}</TableCell>
                        <TableCell data-testid={`text-account-phase-${a.id}`}>{a.currentPhase}</TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant(a.status)} data-testid={`badge-account-status-${a.id}`}>
                            {a.status}
                          </Badge>
                        </TableCell>
                        <TableCell data-testid={`text-account-pl-${a.id}`}>
                          <span className={a.currentPL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                            {a.currentPL >= 0 ? "+" : ""}${a.currentPL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </TableCell>
                        <TableCell data-testid={`text-account-dd-${a.id}`}>{a.drawdown}%</TableCell>
                        <TableCell data-testid={`text-account-days-${a.id}`}>{a.daysRemaining}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="ghost" onClick={() => openConfirmAction("pass", a.id, "Pass")} data-testid={`button-pass-${a.id}`}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => openConfirmAction("fail", a.id, "Fail")} data-testid={`button-fail-${a.id}`}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => openConfirmAction("reset", a.id, "Reset")} data-testid={`button-reset-${a.id}`}>
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => openConfirmAction("extend", a.id, "Extend Duration")} data-testid={`button-extend-${a.id}`}>
                              <Clock className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => openConfirmAction("refund", a.id, "Refund")} data-testid={`button-refund-${a.id}`}>
                              <DollarSign className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-payouts">${totalPayouts.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                <CreditCard className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-pending-amount">${pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-this-month-payouts">${thisMonthPayouts.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payout ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Profit Split</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((p) => (
                      <TableRow key={p.id} data-testid={`row-payout-${p.id}`}>
                        <TableCell className="font-mono text-sm" data-testid={`text-payout-id-${p.id}`}>{p.id}</TableCell>
                        <TableCell className="font-medium" data-testid={`text-payout-client-${p.id}`}>{p.client}</TableCell>
                        <TableCell data-testid={`text-payout-amount-${p.id}`}>${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell data-testid={`text-payout-split-${p.id}`}>{p.profitSplit}</TableCell>
                        <TableCell className="font-mono text-sm" data-testid={`text-payout-account-${p.id}`}>{p.account}</TableCell>
                        <TableCell data-testid={`text-payout-date-${p.id}`}>{p.requestDate}</TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant(p.status)} data-testid={`badge-payout-status-${p.id}`}>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {p.status === "Pending" && (
                              <>
                                <Button size="sm" variant="outline" onClick={() => approvePayout(p.id)} data-testid={`button-approve-payout-${p.id}`}>
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => openRejectDialog(p.id)} data-testid={`button-reject-payout-${p.id}`}>
                                  Reject
                                </Button>
                              </>
                            )}
                            {p.status === "Approved" && (
                              <Button size="sm" variant="outline" onClick={() => markAsPaid(p.id)} data-testid={`button-mark-paid-${p.id}`}>
                                Mark as Paid
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={challengeDialogOpen} onOpenChange={setChallengeDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle data-testid="text-challenge-dialog-title">
              {editingChallenge ? "Edit Challenge" : "Add Challenge"}
            </DialogTitle>
            <DialogDescription>
              {editingChallenge ? "Update challenge configuration" : "Create a new trading challenge"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={challengeForm.name}
                onChange={(e) => setChallengeForm({ ...challengeForm, name: e.target.value })}
                placeholder="Challenge name"
                data-testid="input-challenge-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phases</Label>
                <Select value={challengeForm.phases} onValueChange={(v) => setChallengeForm({ ...challengeForm, phases: v })}>
                  <SelectTrigger data-testid="select-challenge-phases"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-Phase">1-Phase</SelectItem>
                    <SelectItem value="2-Phase">2-Phase</SelectItem>
                    <SelectItem value="3-Phase">3-Phase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Account Size</Label>
                <Select value={String(challengeForm.accountSize)} onValueChange={(v) => setChallengeForm({ ...challengeForm, accountSize: Number(v) })}>
                  <SelectTrigger data-testid="select-challenge-size"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10000">$10,000</SelectItem>
                    <SelectItem value="25000">$25,000</SelectItem>
                    <SelectItem value="50000">$50,000</SelectItem>
                    <SelectItem value="100000">$100,000</SelectItem>
                    <SelectItem value="200000">$200,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  value={challengeForm.price}
                  onChange={(e) => setChallengeForm({ ...challengeForm, price: Number(e.target.value) })}
                  data-testid="input-challenge-price"
                />
              </div>
              <div className="space-y-2">
                <Label>Profit Target (%)</Label>
                <Input
                  type="number"
                  value={challengeForm.profitTarget}
                  onChange={(e) => setChallengeForm({ ...challengeForm, profitTarget: Number(e.target.value) })}
                  data-testid="input-challenge-profit-target"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Daily Drawdown (%)</Label>
                <Input
                  type="number"
                  value={challengeForm.maxDailyDrawdown}
                  onChange={(e) => setChallengeForm({ ...challengeForm, maxDailyDrawdown: Number(e.target.value) })}
                  data-testid="input-challenge-daily-dd"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Total Drawdown (%)</Label>
                <Input
                  type="number"
                  value={challengeForm.maxTotalDrawdown}
                  onChange={(e) => setChallengeForm({ ...challengeForm, maxTotalDrawdown: Number(e.target.value) })}
                  data-testid="input-challenge-total-dd"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Trading Days</Label>
                <Input
                  type="number"
                  value={challengeForm.minTradingDays}
                  onChange={(e) => setChallengeForm({ ...challengeForm, minTradingDays: Number(e.target.value) })}
                  data-testid="input-challenge-min-days"
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (days)</Label>
                <Input
                  type="number"
                  value={challengeForm.duration}
                  onChange={(e) => setChallengeForm({ ...challengeForm, duration: Number(e.target.value) })}
                  data-testid="input-challenge-duration"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Profit Split (%)</Label>
              <Input
                type="number"
                value={challengeForm.profitSplit}
                onChange={(e) => setChallengeForm({ ...challengeForm, profitSplit: Number(e.target.value) })}
                data-testid="input-challenge-profit-split"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label>Status</Label>
              <Switch
                checked={challengeForm.status === "Active"}
                onCheckedChange={(v) => setChallengeForm({ ...challengeForm, status: v ? "Active" : "Inactive" })}
                data-testid="switch-challenge-status"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChallengeDialogOpen(false)} data-testid="button-cancel-challenge">
              Cancel
            </Button>
            <Button onClick={saveChallenge} data-testid="button-save-challenge">
              {editingChallenge ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Challenge</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this challenge? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteChallenge} data-testid="button-confirm-delete">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmAction?.label.toLowerCase()} account {confirmAction?.id}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} data-testid="button-cancel-action">
              Cancel
            </Button>
            <Button onClick={executeAccountAction} data-testid="button-confirm-action">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payout</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting payout {rejectPayoutId}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason"
              data-testid="input-reject-reason"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} data-testid="button-cancel-reject">
              Cancel
            </Button>
            <Button variant="destructive" onClick={rejectPayout} data-testid="button-confirm-reject">
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
