import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import type { KycDocument, User } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    approved: "bg-emerald-500/10 text-emerald-500",
    pending: "bg-amber-500/10 text-amber-500",
    rejected: "bg-red-500/10 text-red-500",
  };
  return <Badge variant="secondary" className={`${cls[status] || ""} text-xs`}>{status}</Badge>;
}

export default function AdminKycVerification() {
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const { toast } = useToast();

  const { data: documents, isLoading } = useQuery<KycDocument[]>({
    queryKey: ["/api/admin/kyc/documents"],
  });

  const { data: clients } = useQuery<User[]>({
    queryKey: ["/api/admin/clients"],
  });

  const clientMap = new Map((clients || []).map((c) => [c.id, c.fullName]));
  const all = documents || [];
  const pendingDocs = all.filter((d) => d.status === "pending");
  const approvedDocs = all.filter((d) => d.status === "approved");
  const rejectedDocs = all.filter((d) => d.status === "rejected");

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/admin/kyc/documents/${id}/review`, { status: "approved", reviewedBy: "admin" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/kyc/documents"] });
      toast({ title: "Document approved" });
    },
    onError: () => {
      toast({ title: "Failed to approve document", variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      return apiRequest("POST", `/api/admin/kyc/documents/${id}/review`, { status: "rejected", reviewedBy: "admin", notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/kyc/documents"] });
      toast({ title: "Document rejected" });
      setRejectId(null);
      setRejectNotes("");
    },
    onError: () => {
      toast({ title: "Failed to reject document", variant: "destructive" });
    },
  });

  function DocTable({ items }: { items: KycDocument[] }) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Name</TableHead>
            <TableHead>Document Type</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Reviewed By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No documents found</TableCell></TableRow>
          ) : (
            items.map((doc) => (
              <TableRow key={doc.id} data-testid={`row-kyc-doc-${doc.id}`}>
                <TableCell className="font-medium">{clientMap.get(doc.userId) || doc.userId.slice(0, 8)}</TableCell>
                <TableCell className="capitalize">{doc.documentType.replace(/_/g, " ")}</TableCell>
                <TableCell className="text-muted-foreground">{doc.fileName}</TableCell>
                <TableCell><StatusBadge status={doc.status} /></TableCell>
                <TableCell className="text-muted-foreground">{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                <TableCell className="text-muted-foreground">{doc.reviewedBy || "—"}</TableCell>
                <TableCell className="text-right">
                  {doc.status === "pending" && (
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="outline" size="sm" onClick={() => approveMutation.mutate(doc.id)} disabled={approveMutation.isPending} data-testid={`button-approve-kyc-${doc.id}`}>
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setRejectId(doc.id)} data-testid={`button-reject-kyc-${doc.id}`}>
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
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-admin-kyc-title">KYC Verification</h1>
        <p className="text-sm text-muted-foreground">Review and manage KYC documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center"><FileText className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Documents</p>
              <p className="text-lg font-bold" data-testid="stat-total-docs">{all.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-amber-500/10 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Pending Review</p>
              <p className="text-lg font-bold" data-testid="stat-pending-docs">{pendingDocs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-500/10 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-emerald-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="text-lg font-bold" data-testid="stat-approved-docs">{approvedDocs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-red-500/10 flex items-center justify-center"><XCircle className="w-5 h-5 text-red-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Rejected</p>
              <p className="text-lg font-bold" data-testid="stat-rejected-docs">{rejectedDocs.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="border-b px-4 pt-2">
              <TabsList>
                <TabsTrigger value="all" data-testid="tab-all-docs">All Documents</TabsTrigger>
                <TabsTrigger value="pending" data-testid="tab-pending-docs">Pending Review</TabsTrigger>
                <TabsTrigger value="approved" data-testid="tab-approved-docs">Approved</TabsTrigger>
                <TabsTrigger value="rejected" data-testid="tab-rejected-docs">Rejected</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all" className="p-4">
              {isLoading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : <DocTable items={all} />}
            </TabsContent>
            <TabsContent value="pending" className="p-4"><DocTable items={pendingDocs} /></TabsContent>
            <TabsContent value="approved" className="p-4"><DocTable items={approvedDocs} /></TabsContent>
            <TabsContent value="rejected" className="p-4"><DocTable items={rejectedDocs} /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!rejectId} onOpenChange={(v) => { if (!v) { setRejectId(null); setRejectNotes(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Reject Document</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rejection Notes</Label>
              <Textarea value={rejectNotes} onChange={(e) => setRejectNotes(e.target.value)} placeholder="Enter reason for rejection..." rows={3} data-testid="input-kyc-reject-notes" />
            </div>
            <Button className="w-full" variant="destructive" onClick={() => rejectId && rejectMutation.mutate({ id: rejectId, notes: rejectNotes })} disabled={rejectMutation.isPending || !rejectNotes} data-testid="button-confirm-kyc-reject">
              {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
