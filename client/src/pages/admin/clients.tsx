import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Search, MoreVertical, Eye } from "lucide-react";
import { Link } from "wouter";
import type { User } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-500",
    inactive: "bg-red-500/10 text-red-500",
    suspended: "bg-amber-500/10 text-amber-500",
    pending: "bg-blue-500/10 text-blue-500",
  };
  return <Badge variant="secondary" className={`${cls[status] || ""} text-xs`}>{status}</Badge>;
}

function KycBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    verified: "bg-emerald-500/10 text-emerald-500",
    pending: "bg-amber-500/10 text-amber-500",
    rejected: "bg-red-500/10 text-red-500",
    unverified: "bg-muted text-muted-foreground",
  };
  return <Badge variant="secondary" className={`${cls[status] || ""} text-xs`}>{status}</Badge>;
}

export default function AdminClients() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    country: "",
    role: "client",
  });

  const { data: clients, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/clients"],
  });

  const filtered = (clients || []).filter((c) => {
    const matchSearch = c.fullName.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || c.role === roleFilter;
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/clients", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      toast({ title: "Client created successfully" });
      setAddOpen(false);
      setFormData({ fullName: "", email: "", username: "", password: "", phone: "", country: "", role: "client" });
    },
    onError: () => {
      toast({ title: "Failed to create client", variant: "destructive" });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/admin/clients/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      toast({ title: "Client status updated" });
    },
    onError: () => {
      toast({ title: "Failed to update status", variant: "destructive" });
    },
  });

  const kycMutation = useMutation({
    mutationFn: async ({ id, kycStatus }: { id: string; kycStatus: string }) => {
      return apiRequest("PATCH", `/api/admin/clients/${id}/kyc-status`, { kycStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      toast({ title: "KYC status updated" });
    },
    onError: () => {
      toast({ title: "Failed to update KYC status", variant: "destructive" });
    },
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-admin-clients-title">Client Management</h1>
          <p className="text-sm text-muted-foreground">Manage all client accounts</p>
        </div>
        <Button onClick={() => setAddOpen(true)} data-testid="button-add-client">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-clients"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]" data-testid="select-role-filter">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="ib">IB</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table data-testid="table-admin-clients">
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-12">Loading clients...</TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-12">No clients found</TableCell>
                </TableRow>
              ) : (
                filtered.map((client) => (
                  <TableRow key={client.id} data-testid={`row-admin-client-${client.id}`}>
                    <TableCell className="font-medium">{client.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{client.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs capitalize">{client.role}</Badge>
                    </TableCell>
                    <TableCell><StatusBadge status={client.status} /></TableCell>
                    <TableCell><KycBadge status={client.kycStatus} /></TableCell>
                    <TableCell className="text-muted-foreground">{client.country || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/clients/${client.id}`}>
                          <Button variant="ghost" size="icon" data-testid={`button-view-client-${client.id}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-actions-client-${client.id}`}>
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>Set Status</DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                {["active", "inactive", "suspended"].map((s) => (
                                  <DropdownMenuItem key={s} onClick={() => statusMutation.mutate({ id: client.id, status: s })} data-testid={`button-set-status-${s}-${client.id}`}>
                                    {s}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>Set KYC Status</DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                {["verified", "pending", "unverified", "rejected"].map((s) => (
                                  <DropdownMenuItem key={s} onClick={() => kycMutation.mutate({ id: client.id, kycStatus: s })} data-testid={`button-set-kyc-${s}-${client.id}`}>
                                    {s}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Enter full name" data-testid="input-admin-client-name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="client@example.com" data-testid="input-admin-client-email" />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="username" data-testid="input-admin-client-username" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Password" data-testid="input-admin-client-password" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 234 567 890" data-testid="input-admin-client-phone" />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Country" data-testid="input-admin-client-country" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                <SelectTrigger data-testid="select-admin-client-role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="ib">Introducing Broker</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={() => createMutation.mutate(formData)}
              disabled={createMutation.isPending || !formData.fullName || !formData.email || !formData.username || !formData.password}
              data-testid="button-submit-admin-client"
            >
              {createMutation.isPending ? "Creating..." : "Add Client"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
