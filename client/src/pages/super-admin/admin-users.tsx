import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BrokerAdmin, Broker } from "@shared/schema";

export default function SuperAdminAdminUsers() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ brokerId: "", fullName: "", email: "", role: "admin" });

  const { data: admins = [], isLoading } = useQuery<BrokerAdmin[]>({ queryKey: ["/api/super-admin/admins"] });
  const { data: brokersList = [] } = useQuery<Broker[]>({ queryKey: ["/api/super-admin/brokers"] });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/super-admin/admins", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/super-admin/admins"] });
      toast({ title: "Admin user created" });
      setDialogOpen(false);
      setFormData({ brokerId: "", fullName: "", email: "", role: "admin" });
    },
    onError: () => toast({ title: "Failed to create admin", variant: "destructive" }),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/super-admin/admins/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/super-admin/admins"] });
      toast({ title: "Admin status updated" });
    },
  });

  const filtered = admins.filter((a) =>
    a.fullName.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
  );

  const getBrokerName = (brokerId: string) => brokersList.find(b => b.id === brokerId)?.name || "Unknown";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-sa-admins-title">Admin Users</h1>
          <p className="text-muted-foreground">Manage admin users across all brokers</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-admin"><Plus className="w-4 h-4 mr-2" />Add Admin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Admin User</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Broker</Label>
                <Select value={formData.brokerId} onValueChange={(v) => setFormData({ ...formData, brokerId: v })}>
                  <SelectTrigger data-testid="select-admin-broker"><SelectValue placeholder="Select broker" /></SelectTrigger>
                  <SelectContent>
                    {brokersList.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input data-testid="input-admin-name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input data-testid="input-admin-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                  <SelectTrigger data-testid="select-admin-role"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" data-testid="button-submit-admin" onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Admin"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input data-testid="input-admin-search" className="pl-9" placeholder="Search admin users..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-12 bg-muted animate-pulse rounded-md" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((admin) => (
            <Card key={admin.id} data-testid={`card-admin-${admin.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="text-xs">{admin.fullName.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium truncate" data-testid={`text-admin-name-${admin.id}`}>{admin.fullName}</p>
                      <p className="text-sm text-muted-foreground truncate">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{getBrokerName(admin.brokerId)}</Badge>
                    <Badge variant="outline">{admin.role}</Badge>
                    <Badge variant={admin.status === "active" ? "default" : "secondary"} data-testid={`badge-admin-status-${admin.id}`}>{admin.status}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatusMutation.mutate({ id: admin.id, status: admin.status === "active" ? "inactive" : "active" })}
                      data-testid={`button-toggle-admin-${admin.id}`}
                    >
                      {admin.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No admin users found</CardContent></Card>
          )}
        </div>
      )}
    </div>
  );
}
