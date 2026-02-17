import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Search, MessageSquare, Clock, CheckCircle, AlertCircle, Send } from "lucide-react";
import type { SupportTicket, User, TicketReply } from "@shared/schema";

function PriorityBadge({ priority }: { priority: string }) {
  const cls: Record<string, string> = {
    high: "bg-red-500/10 text-red-500",
    medium: "bg-amber-500/10 text-amber-500",
    low: "bg-emerald-500/10 text-emerald-500",
  };
  return <Badge variant="secondary" className={`${cls[priority] || ""} text-xs`}>{priority}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    open: "bg-blue-500/10 text-blue-500",
    in_progress: "bg-amber-500/10 text-amber-500",
    closed: "bg-muted text-muted-foreground",
  };
  return <Badge variant="secondary" className={`${cls[status] || ""} text-xs`}>{status.replace(/_/g, " ")}</Badge>;
}

export default function AdminSupportAdmin() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [statusChangeId, setStatusChangeId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const { toast } = useToast();

  const { data: tickets, isLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/admin/support/tickets"],
  });

  const { data: clients } = useQuery<User[]>({
    queryKey: ["/api/admin/clients"],
  });

  const clientMap = new Map((clients || []).map((c) => [c.id, c.fullName]));
  const adminUser = (clients || []).find((c) => c.role === "admin");

  const all = (tickets || []).filter((t) => t.subject.toLowerCase().includes(search.toLowerCase()));
  const openTickets = all.filter((t) => t.status === "open");
  const inProgressTickets = all.filter((t) => t.status === "in_progress");
  const closedTickets = all.filter((t) => t.status === "closed");

  const { data: replies } = useQuery<TicketReply[]>({
    queryKey: ["/api/support/tickets", expandedId, "replies"],
    enabled: !!expandedId,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/admin/support/tickets/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support/tickets"] });
      toast({ title: "Ticket status updated" });
      setStatusChangeId(null);
    },
    onError: () => {
      toast({ title: "Failed to update status", variant: "destructive" });
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      return apiRequest("POST", `/api/admin/support/tickets/${ticketId}/reply`, {
        userId: adminUser?.id || "",
        message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets", expandedId, "replies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support/tickets"] });
      toast({ title: "Reply sent" });
      setReplyMessage("");
    },
    onError: () => {
      toast({ title: "Failed to send reply", variant: "destructive" });
    },
  });

  function TicketTable({ items }: { items: SupportTicket[] }) {
    return (
      <div className="space-y-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No tickets found</TableCell></TableRow>
            ) : (
              items.map((ticket) => (
                <>
                  <TableRow key={ticket.id} className="cursor-pointer" onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)} data-testid={`row-ticket-${ticket.id}`}>
                    <TableCell className="font-mono text-sm">{ticket.id.slice(0, 8)}</TableCell>
                    <TableCell className="font-medium">{clientMap.get(ticket.userId) || ticket.userId.slice(0, 8)}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell><PriorityBadge priority={ticket.priority} /></TableCell>
                    <TableCell><StatusBadge status={ticket.status} /></TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs capitalize">{ticket.category}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" onClick={() => { setStatusChangeId(ticket.id); setNewStatus(ticket.status); }} data-testid={`button-change-status-${ticket.id}`}>
                        Change Status
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedId === ticket.id && (
                    <TableRow key={`${ticket.id}-detail`}>
                      <TableCell colSpan={8} className="bg-muted/30">
                        <div className="p-4 space-y-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Message</p>
                            <p className="text-sm">{ticket.message}</p>
                          </div>
                          {(replies || []).length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">Replies</p>
                              {(replies || []).map((r) => (
                                <div key={r.id} className={`p-3 rounded-md text-sm ${r.isAdmin ? "bg-primary/5 ml-4" : "bg-muted mr-4"}`}>
                                  <p className="text-xs text-muted-foreground mb-1">{r.isAdmin ? "Admin" : clientMap.get(r.userId) || "User"} - {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</p>
                                  <p>{r.message}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Textarea
                              placeholder="Type your reply..."
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              className="flex-1"
                              rows={2}
                              data-testid={`input-reply-${ticket.id}`}
                            />
                            <Button
                              size="icon"
                              onClick={() => replyMutation.mutate({ ticketId: ticket.id, message: replyMessage })}
                              disabled={replyMutation.isPending || !replyMessage}
                              data-testid={`button-send-reply-${ticket.id}`}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-admin-support-title">Support Management</h1>
        <p className="text-sm text-muted-foreground">Manage support tickets and client inquiries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Tickets</p>
              <p className="text-lg font-bold" data-testid="stat-total-tickets">{(tickets || []).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-blue-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Open</p>
              <p className="text-lg font-bold" data-testid="stat-open-tickets">{openTickets.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-amber-500/10 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">In Progress</p>
              <p className="text-lg font-bold" data-testid="stat-in-progress-tickets">{inProgressTickets.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-500/10 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-emerald-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Closed</p>
              <p className="text-lg font-bold" data-testid="stat-closed-tickets">{closedTickets.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="border-b px-4 pt-2 flex items-center justify-between gap-4 flex-wrap">
              <TabsList>
                <TabsTrigger value="all" data-testid="tab-all-tickets">All Tickets</TabsTrigger>
                <TabsTrigger value="open" data-testid="tab-open-tickets">Open</TabsTrigger>
                <TabsTrigger value="in_progress" data-testid="tab-in-progress-tickets">In Progress</TabsTrigger>
                <TabsTrigger value="closed" data-testid="tab-closed-tickets">Closed</TabsTrigger>
              </TabsList>
              <div className="relative max-w-sm pb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by subject..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-tickets" />
              </div>
            </div>
            <TabsContent value="all" className="p-4">
              {isLoading ? <p className="text-center text-muted-foreground py-8">Loading...</p> : <TicketTable items={all} />}
            </TabsContent>
            <TabsContent value="open" className="p-4"><TicketTable items={openTickets} /></TabsContent>
            <TabsContent value="in_progress" className="p-4"><TicketTable items={inProgressTickets} /></TabsContent>
            <TabsContent value="closed" className="p-4"><TicketTable items={closedTickets} /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!statusChangeId} onOpenChange={(v) => { if (!v) setStatusChangeId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Change Ticket Status</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger data-testid="select-ticket-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => statusChangeId && statusMutation.mutate({ id: statusChangeId, status: newStatus })} disabled={statusMutation.isPending} data-testid="button-confirm-status-change">
              {statusMutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
