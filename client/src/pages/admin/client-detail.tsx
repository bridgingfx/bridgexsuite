import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
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
import { ArrowLeft, Edit } from "lucide-react";
import { Link } from "wouter";
import type { User, TradingAccount, Transaction, KycDocument, SupportTicket } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-500",
    completed: "bg-emerald-500/10 text-emerald-500",
    approved: "bg-emerald-500/10 text-emerald-500",
    verified: "bg-emerald-500/10 text-emerald-500",
    inactive: "bg-red-500/10 text-red-500",
    rejected: "bg-red-500/10 text-red-500",
    suspended: "bg-amber-500/10 text-amber-500",
    pending: "bg-amber-500/10 text-amber-500",
    open: "bg-blue-500/10 text-blue-500",
    in_progress: "bg-blue-500/10 text-blue-500",
    closed: "bg-muted text-muted-foreground",
  };
  return <Badge variant="secondary" className={`${cls[status] || ""} text-xs`}>{status.replace(/_/g, " ")}</Badge>;
}

interface ClientDetailData {
  client: User;
  accounts: TradingAccount[];
  transactions: Transaction[];
  kycDocuments: KycDocument[];
  tickets: SupportTicket[];
}

export default function AdminClientDetail() {
  const [, params] = useRoute("/admin/clients/:id");
  const clientId = params?.id;
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading } = useQuery<ClientDetailData>({
    queryKey: ["/api/admin/clients", clientId],
    enabled: !!clientId,
  });

  const [editData, setEditData] = useState({ fullName: "", email: "", phone: "", country: "" });

  const editMutation = useMutation({
    mutationFn: async (updates: typeof editData) => {
      return apiRequest("PATCH", `/api/admin/clients/${clientId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients", clientId] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      toast({ title: "Client updated successfully" });
      setEditOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to update client", variant: "destructive" });
    },
  });

  if (isLoading || !data) {
    return (
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <p className="text-muted-foreground">Loading client details...</p>
      </div>
    );
  }

  const { client, accounts, transactions, kycDocuments, tickets } = data;

  const openEdit = () => {
    setEditData({ fullName: client.fullName, email: client.email, phone: client.phone || "", country: client.country || "" });
    setEditOpen(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/admin/clients">
          <Button variant="ghost" size="icon" data-testid="button-back-to-clients">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-client-detail-title">{client.fullName}</h1>
          <p className="text-sm text-muted-foreground">{client.email}</p>
        </div>
        <Button variant="outline" onClick={openEdit} data-testid="button-edit-client">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium" data-testid="text-client-phone">{client.phone || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Country</p>
              <p className="text-sm font-medium" data-testid="text-client-country">{client.country || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <Badge variant="secondary" className="text-xs capitalize">{client.role}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <StatusBadge status={client.status} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">KYC Status</p>
              <StatusBadge status={client.kycStatus} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="text-sm font-medium">{client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="accounts">
            <div className="border-b px-4 pt-2">
              <TabsList>
                <TabsTrigger value="accounts" data-testid="tab-client-accounts">Trading Accounts</TabsTrigger>
                <TabsTrigger value="transactions" data-testid="tab-client-transactions">Transactions</TabsTrigger>
                <TabsTrigger value="kyc" data-testid="tab-client-kyc">KYC Documents</TabsTrigger>
                <TabsTrigger value="tickets" data-testid="tab-client-tickets">Support Tickets</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="accounts" className="p-4">
              <Table data-testid="table-client-accounts">
                <TableHeader>
                  <TableRow>
                    <TableHead>Account #</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Leverage</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Equity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No trading accounts</TableCell></TableRow>
                  ) : (
                    accounts.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-mono">{a.accountNumber}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-xs">{a.platform}</Badge></TableCell>
                        <TableCell className="capitalize">{a.type}</TableCell>
                        <TableCell>{a.leverage}</TableCell>
                        <TableCell className="font-mono">${Number(a.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="font-mono">${Number(a.equity).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell><StatusBadge status={a.status} /></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="transactions" className="p-4">
              <Table data-testid="table-client-transactions">
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No transactions</TableCell></TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-sm">{tx.reference || tx.id.slice(0, 8)}</TableCell>
                        <TableCell>
                          <Badge variant={tx.type === "deposit" ? "default" : "secondary"} className={tx.type === "deposit" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}>
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">${Number(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell><StatusBadge status={tx.status} /></TableCell>
                        <TableCell className="text-muted-foreground capitalize">{(tx.method || "—").replace(/_/g, " ")}</TableCell>
                        <TableCell className="text-muted-foreground">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="kyc" className="p-4">
              <Table data-testid="table-client-kyc">
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Type</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kycDocuments.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No KYC documents</TableCell></TableRow>
                  ) : (
                    kycDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="capitalize">{doc.documentType.replace(/_/g, " ")}</TableCell>
                        <TableCell className="text-muted-foreground">{doc.fileName}</TableCell>
                        <TableCell><StatusBadge status={doc.status} /></TableCell>
                        <TableCell className="text-muted-foreground">{doc.notes || "—"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="tickets" className="p-4">
              <Table data-testid="table-client-tickets">
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No support tickets</TableCell></TableRow>
                  ) : (
                    tickets.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.subject}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`text-xs ${t.priority === "high" ? "bg-red-500/10 text-red-500" : t.priority === "medium" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"}`}>
                            {t.priority}
                          </Badge>
                        </TableCell>
                        <TableCell><StatusBadge status={t.status} /></TableCell>
                        <TableCell className="text-muted-foreground">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={editData.fullName} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} data-testid="input-edit-client-name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} data-testid="input-edit-client-email" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} data-testid="input-edit-client-phone" />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input value={editData.country} onChange={(e) => setEditData({ ...editData, country: e.target.value })} data-testid="input-edit-client-country" />
            </div>
            <Button className="w-full" onClick={() => editMutation.mutate(editData)} disabled={editMutation.isPending} data-testid="button-save-client-edit">
              {editMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
