import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Plus,
  Search,
  Filter,
  Download,
  Users,
  UserCheck,
  UserX,
  Clock,
  MoreVertical,
  Mail,
  Phone,
  Globe,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@shared/schema";
import { useRoute, useLocation } from "wouter";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-500",
    inactive: "bg-red-500/10 text-red-500",
    suspended: "bg-amber-500/10 text-amber-500",
    pending: "bg-blue-500/10 text-blue-500",
  };
  return (
    <Badge variant="secondary" className={`${colors[status] || ""} text-xs`}>
      {status}
    </Badge>
  );
}

function KycBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    verified: "bg-emerald-500/10 text-emerald-500",
    pending: "bg-amber-500/10 text-amber-500",
    rejected: "bg-red-500/10 text-red-500",
    unverified: "bg-muted text-muted-foreground",
  };
  return (
    <Badge variant="secondary" className={`${colors[status] || ""} text-xs`}>
      {status}
    </Badge>
  );
}

function AddClientDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    role: "client",
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/clients", {
        ...data,
        username: data.email,
        password: "temp123",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({ title: "Client created successfully" });
      onOpenChange(false);
      setFormData({ fullName: "", email: "", phone: "", country: "", role: "client" });
    },
    onError: () => {
      toast({ title: "Failed to create client", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter full name"
              data-testid="input-client-name"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="client@example.com"
              data-testid="input-client-email"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 890"
              data-testid="input-client-phone"
            />
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Input
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="Enter country"
              data-testid="input-client-country"
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
              <SelectTrigger data-testid="select-client-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="ib">Introducing Broker</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full"
            onClick={() => mutation.mutate(formData)}
            disabled={mutation.isPending || !formData.fullName || !formData.email}
            data-testid="button-submit-client"
          >
            {mutation.isPending ? "Creating..." : "Add Client"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Clients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [, params] = useRoute("/clients/:sub");
  const [location] = useLocation();

  const isLeads = location === "/clients/leads";
  const isNew = location === "/clients/new";

  const { data: clients, isLoading } = useQuery<User[]>({
    queryKey: ["/api/clients"],
  });

  const filtered = (clients || []).filter((c) => {
    const matchSearch =
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchRole = isLeads ? c.role === "lead" : true;
    return matchSearch && matchStatus && matchRole;
  });

  const activeCount = (clients || []).filter((c) => c.status === "active").length;
  const inactiveCount = (clients || []).filter((c) => c.status === "inactive").length;
  const pendingCount = (clients || []).filter((c) => c.kycStatus === "pending").length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-clients-title">
            {isLeads ? "Leads" : "Clients"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLeads ? "Manage your leads and prospects" : "Manage all client accounts"}
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} data-testid="button-add-client">
          <Plus className="w-4 h-4 mr-2" />
          {isLeads ? "Add Lead" : "Add Client"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold">{(clients || []).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-lg font-bold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-red-500/10 flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Inactive</p>
              <p className="text-lg font-bold">{inactiveCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending KYC</p>
              <p className="text-lg font-bold">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-clients"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" data-testid="button-export-clients">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-clients">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Phone</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Country</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">KYC</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Role</th>
                  <th className="text-right py-3 px-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      Loading clients...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      No clients found
                    </td>
                  </tr>
                ) : (
                  filtered.map((client) => (
                    <tr key={client.id} className="border-b last:border-0 hover-elevate" data-testid={`row-client-${client.id}`}>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {client.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{client.fullName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{client.email}</td>
                      <td className="py-3 px-3 text-muted-foreground">{client.phone || "—"}</td>
                      <td className="py-3 px-3 text-muted-foreground">{client.country || "—"}</td>
                      <td className="py-3 px-3"><StatusBadge status={client.status} /></td>
                      <td className="py-3 px-3"><KycBadge status={client.kycStatus} /></td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className="text-xs capitalize">{client.role}</Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-actions-${client.id}`}>
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View Profile</DropdownMenuItem>
                            <DropdownMenuItem><Mail className="w-4 h-4 mr-2" /> Send Email</DropdownMenuItem>
                            <DropdownMenuItem><Phone className="w-4 h-4 mr-2" /> Call</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AddClientDialog open={addOpen || isNew} onOpenChange={(v) => { setAddOpen(v); }} />
    </div>
  );
}
