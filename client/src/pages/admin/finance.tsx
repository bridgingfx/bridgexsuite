import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { Transaction } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    completed: "bg-emerald-500/10 text-emerald-500",
    approved: "bg-emerald-500/10 text-emerald-500",
    pending: "bg-amber-500/10 text-amber-500",
    rejected: "bg-red-500/10 text-red-500",
  };
  return <Badge variant="secondary" className={`${cls[status] || ""} text-xs`}>{status}</Badge>;
}

export default function AdminFinance() {
  const [search, setSearch] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const { toast } = useToast();

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/admin/transactions"],
  });

  const all = transactions || [];
  const deposits = all.filter((t) => t.type === "deposit");
  const withdrawals = all.filter((t) => t.type === "withdrawal");
  const pending = all.filter((t) => t.status === "pending");
  const totalDeposits = deposits.reduce((s, d) => s + Number(d.amount), 0);
  const totalWithdrawals = withdrawals.reduce((s, w) => s + Number(w.amount), 0);

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/admin/transactions/${id}/approve`, { approvedBy: "admin" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
      toast({ title: "Transaction approved" });
    },
    onError: () => {
      toast({ title: "Failed to approve transaction", variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      return apiRequest("POST", `/api/admin/transactions/${id}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
      toast({ title: "Transaction rejected" });
      setRejectId(null);
      setRejectReason("");
    },
    onError: () => {
      toast({ title: "Failed to reject transaction", variant: "destructive" });
    },
  });

  const filterBySearch = (txns: Transaction[]) =>
    txns.filter((t) => (t.reference || t.id).toLowerCase().includes(search.toLowerCase()));

  function TransactionTable({ items }: { items: Transaction[] }) {
    const filtered = filterBySearch(items);
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No transactions found</TableCell></TableRow>
          ) : (
            filtered.map((tx) => (
              <TableRow key={tx.id} data-testid={`row-admin-tx-${tx.id}`}>
                <TableCell className="font-mono text-sm">{tx.reference || tx.id.slice(0, 8)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{tx.userId.slice(0, 8)}...</TableCell>
                <TableCell>
                  <Badge variant={tx.type === "deposit" ? "default" : "secondary"} className={tx.type === "deposit" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}>
                    {tx.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">${Number(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-muted-foreground capitalize">{(tx.method || "—").replace(/_/g, " ")}</TableCell>
                <TableCell><StatusBadge status={tx.status} /></TableCell>
                <TableCell className="text-muted-foreground">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                <TableCell className="text-right">
                  {tx.status === "pending" && (
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="outline" size="sm" onClick={() => approveMutation.mutate(tx.id)} disabled={approveMutation.isPending} data-testid={`button-approve-tx-${tx.id}`}>
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setRejectId(tx.id)} data-testid={`button-reject-tx-${tx.id}`}>
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-admin-finance-title">Financial Operations</h1>
        <p className="text-sm text-muted-foreground">Manage deposits, withdrawals, and approvals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Deposits</p>
              <p className="text-lg font-bold" data-testid="stat-total-deposits">${totalDeposits.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-red-500/10 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Withdrawals</p>
              <p className="text-lg font-bold" data-testid="stat-total-withdrawals">${totalWithdrawals.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-lg font-bold" data-testid="stat-pending-count">{pending.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Net Position</p>
              <p className="text-lg font-bold" data-testid="stat-net-position">${(totalDeposits - totalWithdrawals).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="border-b px-4 pt-2 flex items-center justify-between gap-4 flex-wrap">
              <TabsList>
                <TabsTrigger value="all" data-testid="tab-all-transactions">All Transactions</TabsTrigger>
                <TabsTrigger value="pending" data-testid="tab-pending-approvals">Pending Approvals</TabsTrigger>
                <TabsTrigger value="deposits" data-testid="tab-deposits">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawals" data-testid="tab-withdrawals">Withdrawals</TabsTrigger>
              </TabsList>
              <div className="relative max-w-sm pb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by reference..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-transactions" />
              </div>
            </div>
            <TabsContent value="all" className="p-4">
              {isLoading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : <TransactionTable items={all} />}
            </TabsContent>
            <TabsContent value="pending" className="p-4">
              <TransactionTable items={pending} />
            </TabsContent>
            <TabsContent value="deposits" className="p-4">
              <TransactionTable items={deposits} />
            </TabsContent>
            <TabsContent value="withdrawals" className="p-4">
              <TransactionTable items={withdrawals} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!rejectId} onOpenChange={(v) => { if (!v) { setRejectId(null); setRejectReason(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={3}
                data-testid="input-reject-reason"
              />
            </div>
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => rejectId && rejectMutation.mutate({ id: rejectId, reason: rejectReason })}
              disabled={rejectMutation.isPending || !rejectReason}
              data-testid="button-confirm-reject"
            >
              {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
