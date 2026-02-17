import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Network, Users, DollarSign, TrendingUp, Plus } from "lucide-react";
import type { IbReferral, Commission, CommissionTier, User } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-500",
    paid: "bg-emerald-500/10 text-emerald-500",
    pending: "bg-amber-500/10 text-amber-500",
    inactive: "bg-red-500/10 text-red-500",
  };
  return <Badge variant="secondary" className={`${cls[status] || ""} text-xs`}>{status}</Badge>;
}

export default function AdminIbManagement() {
  const [addTierOpen, setAddTierOpen] = useState(false);
  const { toast } = useToast();

  const [tierForm, setTierForm] = useState({
    name: "",
    level: "1",
    commissionRate: "",
    minVolume: "0",
    maxVolume: "",
  });

  const { data: referrals } = useQuery<IbReferral[]>({ queryKey: ["/api/admin/ib/referrals"] });
  const { data: commissions } = useQuery<Commission[]>({ queryKey: ["/api/admin/commissions"] });
  const { data: tiers } = useQuery<CommissionTier[]>({ queryKey: ["/api/admin/commission-tiers"] });
  const { data: clients } = useQuery<User[]>({ queryKey: ["/api/admin/clients"] });

  const clientMap = new Map((clients || []).map((c) => [c.id, c.fullName]));
  const ibClients = (clients || []).filter((c) => c.role === "ib");
  const totalCommissions = (commissions || []).reduce((s, c) => s + Number(c.amount), 0);
  const activeRefs = (referrals || []).filter((r) => r.status === "active").length;

  const tierMutation = useMutation({
    mutationFn: async (data: typeof tierForm) => {
      return apiRequest("POST", "/api/admin/commission-tiers", {
        name: data.name,
        level: Number(data.level),
        commissionRate: data.commissionRate,
        minVolume: data.minVolume,
        maxVolume: data.maxVolume || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/commission-tiers"] });
      toast({ title: "Commission tier created" });
      setAddTierOpen(false);
      setTierForm({ name: "", level: "1", commissionRate: "", minVolume: "0", maxVolume: "" });
    },
    onError: () => {
      toast({ title: "Failed to create tier", variant: "destructive" });
    },
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-admin-ib-title">IB / Affiliate Management</h1>
        <p className="text-sm text-muted-foreground">Manage introducing brokers, referrals, and commissions</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="overview">
            <div className="border-b px-4 pt-2">
              <TabsList>
                <TabsTrigger value="overview" data-testid="tab-ib-overview">Overview</TabsTrigger>
                <TabsTrigger value="referrals" data-testid="tab-ib-referrals">Referrals</TabsTrigger>
                <TabsTrigger value="commissions" data-testid="tab-ib-commissions">Commissions</TabsTrigger>
                <TabsTrigger value="tiers" data-testid="tab-ib-tiers">Commission Tiers</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center"><Network className="w-5 h-5 text-primary" /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total IBs</p>
                      <p className="text-lg font-bold" data-testid="stat-total-ibs">{ibClients.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center"><Users className="w-5 h-5 text-blue-500" /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Referrals</p>
                      <p className="text-lg font-bold" data-testid="stat-total-referrals">{(referrals || []).length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-emerald-500/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-emerald-500" /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Commissions</p>
                      <p className="text-lg font-bold" data-testid="stat-total-commissions">${totalCommissions.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-amber-500/10 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-amber-500" /></div>
                    <div>
                      <p className="text-xs text-muted-foreground">Active Referrals</p>
                      <p className="text-lg font-bold" data-testid="stat-active-referrals">{activeRefs}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="referrals" className="p-4">
              <Table data-testid="table-admin-referrals">
                <TableHeader>
                  <TableRow>
                    <TableHead>IB Name</TableHead>
                    <TableHead>Referred Client</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(referrals || []).length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No referrals found</TableCell></TableRow>
                  ) : (
                    (referrals || []).map((ref) => (
                      <TableRow key={ref.id} data-testid={`row-referral-${ref.id}`}>
                        <TableCell className="font-medium">{clientMap.get(ref.ibUserId) || ref.ibUserId.slice(0, 8)}</TableCell>
                        <TableCell>{clientMap.get(ref.referredUserId) || ref.referredUserId.slice(0, 8)}</TableCell>
                        <TableCell className="font-mono text-emerald-500">${Number(ref.commission).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-xs">Level {ref.level}</Badge></TableCell>
                        <TableCell><StatusBadge status={ref.status} /></TableCell>
                        <TableCell className="text-muted-foreground">{ref.createdAt ? new Date(ref.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="commissions" className="p-4">
              <Table data-testid="table-admin-commissions">
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(commissions || []).length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No commissions found</TableCell></TableRow>
                  ) : (
                    (commissions || []).map((c) => (
                      <TableRow key={c.id} data-testid={`row-commission-${c.id}`}>
                        <TableCell className="font-medium">{clientMap.get(c.userId) || c.userId.slice(0, 8)}</TableCell>
                        <TableCell className="capitalize">{c.type.replace(/_/g, " ")}</TableCell>
                        <TableCell className="font-mono text-emerald-500">${Number(c.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-muted-foreground">{c.source || "—"}</TableCell>
                        <TableCell><StatusBadge status={c.status} /></TableCell>
                        <TableCell className="text-muted-foreground">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="tiers" className="p-4 space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setAddTierOpen(true)} data-testid="button-add-tier">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tier
                </Button>
              </div>
              <Table data-testid="table-commission-tiers">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Rate %</TableHead>
                    <TableHead>Min Volume</TableHead>
                    <TableHead>Max Volume</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(tiers || []).length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No commission tiers</TableCell></TableRow>
                  ) : (
                    (tiers || []).map((t) => (
                      <TableRow key={t.id} data-testid={`row-tier-${t.id}`}>
                        <TableCell className="font-medium">{t.name}</TableCell>
                        <TableCell>{t.level}</TableCell>
                        <TableCell>{Number(t.commissionRate).toFixed(2)}%</TableCell>
                        <TableCell className="font-mono">${Number(t.minVolume).toLocaleString()}</TableCell>
                        <TableCell className="font-mono">{t.maxVolume ? `$${Number(t.maxVolume).toLocaleString()}` : "Unlimited"}</TableCell>
                        <TableCell><StatusBadge status={t.status} /></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={addTierOpen} onOpenChange={setAddTierOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Commission Tier</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={tierForm.name} onChange={(e) => setTierForm({ ...tierForm, name: e.target.value })} placeholder="Tier name" data-testid="input-tier-name" />
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Input type="number" value={tierForm.level} onChange={(e) => setTierForm({ ...tierForm, level: e.target.value })} data-testid="input-tier-level" />
            </div>
            <div className="space-y-2">
              <Label>Commission Rate (%)</Label>
              <Input type="number" value={tierForm.commissionRate} onChange={(e) => setTierForm({ ...tierForm, commissionRate: e.target.value })} placeholder="e.g. 2.5" data-testid="input-tier-rate" />
            </div>
            <div className="space-y-2">
              <Label>Min Volume</Label>
              <Input type="number" value={tierForm.minVolume} onChange={(e) => setTierForm({ ...tierForm, minVolume: e.target.value })} data-testid="input-tier-min-volume" />
            </div>
            <div className="space-y-2">
              <Label>Max Volume</Label>
              <Input type="number" value={tierForm.maxVolume} onChange={(e) => setTierForm({ ...tierForm, maxVolume: e.target.value })} placeholder="Leave empty for unlimited" data-testid="input-tier-max-volume" />
            </div>
            <Button className="w-full" onClick={() => tierMutation.mutate(tierForm)} disabled={tierMutation.isPending || !tierForm.name || !tierForm.commissionRate} data-testid="button-submit-tier">
              {tierMutation.isPending ? "Creating..." : "Create Tier"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
