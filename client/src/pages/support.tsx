import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react";
import type { SupportTicket, TicketReply } from "@shared/schema";

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "open":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "in_progress":
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400";
    case "resolved":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "closed":
      return "bg-gray-500/10 text-gray-500";
    default:
      return "";
  }
}

function getPriorityBadgeClass(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    case "medium":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    default:
      return "";
  }
}

function TicketDetail({ ticket }: { ticket: SupportTicket }) {
  const [replyText, setReplyText] = useState("");
  const { toast } = useToast();

  const { data: replies, isLoading: repliesLoading } = useQuery<TicketReply[]>({
    queryKey: ["/api/support/tickets", ticket.id, "replies"],
    queryFn: async () => {
      const res = await fetch(`/api/support/tickets/${ticket.id}/replies`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch replies");
      return res.json();
    },
  });

  const replyMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/support/tickets/${ticket.id}/replies`, {
        message: replyText,
        isAdmin: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets", ticket.id, "replies"] });
      toast({ title: "Reply sent successfully" });
      setReplyText("");
    },
    onError: () => {
      toast({ title: "Failed to send reply", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Category</span>
          <p className="font-medium text-gray-900 dark:text-white capitalize">{ticket.category}</p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Priority</span>
          <p className="font-medium text-gray-900 dark:text-white capitalize">{ticket.priority}</p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Status</span>
          <p className="font-medium text-gray-900 dark:text-white capitalize">{ticket.status.replace(/_/g, " ")}</p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Created</span>
          <p className="font-medium text-gray-900 dark:text-white">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "N/A"}</p>
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Original Message</p>
        <p className="text-sm text-gray-900 dark:text-white">{ticket.message}</p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">Replies</p>
        {repliesLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading replies...</p>
        ) : !replies || replies.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No replies yet</p>
        ) : (
          replies.map((reply) => (
            <div
              key={reply.id}
              className={`rounded-lg p-4 text-sm ${
                reply.isAdmin ? "bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800" : "bg-gray-50 dark:bg-gray-800/50"
              }`}
              data-testid={`reply-${reply.id}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                <span className="font-medium text-xs text-gray-900 dark:text-white">
                  {reply.isAdmin ? "Support Agent" : "You"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {reply.createdAt ? new Date(reply.createdAt).toLocaleString() : ""}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{reply.message}</p>
            </div>
          ))
        )}
      </div>

      {ticket.status !== "closed" && (
        <div className="flex gap-2">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            rows={2}
            className="flex-1"
            data-testid={`input-reply-${ticket.id}`}
          />
          <Button
            size="icon"
            onClick={() => replyMutation.mutate()}
            disabled={replyMutation.isPending || !replyText.trim()}
            data-testid={`button-send-reply-${ticket.id}`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function Support() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: tickets, isLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/support/tickets"],
  });

  const filtered = (tickets || []).filter((t) =>
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const openCount = (tickets || []).filter((t) => t.status === "open" || t.status === "in_progress").length;
  const resolvedCount = (tickets || []).filter((t) => t.status === "resolved" || t.status === "closed").length;

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

  const statCards = [
    { label: "Open Tickets", value: openCount, icon: MessageSquare, iconBg: "bg-amber-50 dark:bg-amber-900/20", iconColor: "text-amber-500" },
    { label: "Resolved", value: resolvedCount, icon: CheckCircle, iconBg: "bg-emerald-50 dark:bg-emerald-900/20", iconColor: "text-emerald-500" },
    { label: "Total Tickets", value: (tickets || []).length, icon: HelpCircle, iconBg: "bg-sky-50 dark:bg-sky-900/20", iconColor: "text-sky-600" },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-support-title">Support</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create and manage your support tickets</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} data-testid="button-create-ticket">
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</span>
              <div className={`p-3 rounded-lg shrink-0 ${card.iconBg}`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white" data-testid={`text-${card.label.toLowerCase().replace(/\s+/g, '-')}-count`}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6">
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search tickets..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search-tickets"
          />
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">Loading tickets...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
              <HelpCircle className="w-6 h-6 text-sky-600" />
            </div>
            <p className="font-medium text-gray-900 dark:text-white">No support tickets yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create a ticket to get help from our support team</p>
            <Button onClick={() => setCreateOpen(true)} data-testid="button-create-ticket-empty">
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </div>
        ) : (
          <div className="space-y-3" data-testid="table-tickets">
            {filtered.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover-elevate cursor-pointer overflow-visible"
                data-testid={`ticket-row-${ticket.id}`}
              >
                <div
                  className="flex items-center gap-3 flex-wrap"
                  onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{ticket.subject}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge
                        variant="secondary"
                        className={`text-xs capitalize no-default-hover-elevate no-default-active-elevate ${getStatusBadgeClass(ticket.status)}`}
                      >
                        {ticket.status.replace(/_/g, " ")}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs capitalize no-default-hover-elevate no-default-active-elevate ${getPriorityBadgeClass(ticket.priority)}`}
                      >
                        {ticket.priority}
                      </Badge>
                      <Badge variant="secondary" className="text-xs capitalize no-default-hover-elevate no-default-active-elevate">
                        {ticket.category}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid={`button-view-ticket-${ticket.id}`}
                  >
                    {expandedId === ticket.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {expandedId === ticket.id && <TicketDetail ticket={ticket} />}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>Fill in the details below to submit a new support ticket.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Subject</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of your issue"
                data-testid="input-ticket-subject"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Category</Label>
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
              <Label className="text-gray-700 dark:text-gray-300">Priority</Label>
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
              <Label className="text-gray-700 dark:text-gray-300">Message</Label>
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
