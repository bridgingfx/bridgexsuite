import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
  HelpCircle,
  Plus,
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import type { SupportTicket } from "@shared/schema";

export default function Support() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: tickets, isLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/support/tickets"],
  });

  const filtered = (tickets || []).filter((t) =>
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const openCount = (tickets || []).filter((t) => t.status === "open").length;
  const closedCount = (tickets || []).filter((t) => t.status === "closed").length;

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "medium",
    category: "general",
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/support/tickets", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets"] });
      toast({ title: "Ticket created successfully" });
      setCreateOpen(false);
      setFormData({ subject: "", message: "", priority: "medium", category: "general" });
    },
    onError: () => {
      toast({ title: "Failed to create ticket", variant: "destructive" });
    },
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-support-title">Support</h1>
          <p className="text-sm text-muted-foreground">Get help and manage support tickets</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} data-testid="button-create-ticket">
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Tickets</p>
              <p className="text-lg font-bold">{(tickets || []).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Open</p>
              <p className="text-lg font-bold">{openCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Resolved</p>
              <p className="text-lg font-bold">{closedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search tickets..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-tickets" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-tickets">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Subject</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Priority</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">No tickets found</td></tr>
                ) : (
                  filtered.map((ticket) => (
                    <tr key={ticket.id} className="border-b last:border-0">
                      <td className="py-3 px-3 font-medium">{ticket.subject}</td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className="text-xs capitalize">{ticket.category}</Badge>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            ticket.priority === "high" ? "bg-red-500/10 text-red-500" :
                            ticket.priority === "medium" ? "bg-amber-500/10 text-amber-500" :
                            "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {ticket.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={ticket.status === "closed" ? "default" : "secondary"}
                          className={ticket.status === "open" ? "bg-emerald-500/10 text-emerald-500" : ticket.status === "in_progress" ? "bg-blue-500/10 text-blue-500" : ""}
                        >
                          {ticket.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "N/A"}</td>
                      <td className="py-3 px-3 text-right">
                        <Button variant="ghost" size="icon" data-testid={`button-view-ticket-${ticket.id}`}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of your issue"
                data-testid="input-ticket-subject"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger data-testid="select-ticket-category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="trading">Trading</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="kyc">KYC</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                <SelectTrigger data-testid="select-ticket-priority"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows={4}
                data-testid="input-ticket-message"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !formData.subject || !formData.message}
              data-testid="button-submit-ticket"
            >
              {createMutation.isPending ? "Creating..." : "Submit Ticket"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
