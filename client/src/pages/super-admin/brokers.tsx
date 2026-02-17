import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Plus, Search, Eye, Ban, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import type { Broker } from "@shared/schema";

export default function SuperAdminBrokers() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "", email: "", phone: "", companyName: "", country: "", maxClients: 100, maxAccounts: 500 });

  const { data: brokersList = [], isLoading } = useQuery<Broker[]>({ queryKey: ["/api/super-admin/brokers"] });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/super-admin/brokers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/super-admin/brokers"] });
      toast({ title: "Broker created successfully" });
      setDialogOpen(false);
      setFormData({ name: "", slug: "", email: "", phone: "", companyName: "", country: "", maxClients: 100, maxAccounts: 500 });
    },
    onError: () => toast({ title: "Failed to create broker", variant: "destructive" }),
  });

  const suspendMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/super-admin/brokers/${id}/suspend`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/super-admin/brokers"] });
      toast({ title: "Broker suspended" });
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/super-admin/brokers/${id}/activate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/super-admin/brokers"] });
      toast({ title: "Broker activated" });
    },
  });

  const filtered = brokersList.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-sa-brokers-title">Broker Management</h1>
          <p className="text-muted-foreground">Manage all broker tenants on the platform</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-broker"><Plus className="w-4 h-4 mr-2" />Add Broker</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New Broker</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Broker Name</Label>
                  <Input data-testid="input-broker-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input data-testid="input-broker-slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input data-testid="input-broker-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input data-testid="input-broker-phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input data-testid="input-broker-company" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input data-testid="input-broker-country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Clients</Label>
                  <Input data-testid="input-broker-max-clients" type="number" value={formData.maxClients} onChange={(e) => setFormData({ ...formData, maxClients: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>Max Accounts</Label>
                  <Input data-testid="input-broker-max-accounts" type="number" value={formData.maxAccounts} onChange={(e) => setFormData({ ...formData, maxAccounts: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <Button className="w-full" data-testid="button-submit-broker" onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Broker"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input data-testid="input-broker-search" className="pl-9" placeholder="Search brokers..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-broker-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-12 bg-muted animate-pulse rounded-md" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((broker) => (
            <Card key={broker.id} className="hover-elevate" data-testid={`card-broker-${broker.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate" data-testid={`text-broker-name-${broker.id}`}>{broker.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{broker.email} {broker.country && `| ${broker.country}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Max Clients</p>
                      <p className="text-sm font-medium">{broker.maxClients}</p>
                    </div>
                    <Badge variant={broker.status === "active" ? "default" : broker.status === "suspended" ? "destructive" : "secondary"} data-testid={`badge-broker-status-${broker.id}`}>
                      {broker.status}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Link href={`/super-admin/brokers/${broker.id}`}>
                        <Button variant="ghost" size="icon" data-testid={`button-view-broker-${broker.id}`}><Eye className="w-4 h-4" /></Button>
                      </Link>
                      {broker.status === "active" ? (
                        <Button variant="ghost" size="icon" onClick={() => suspendMutation.mutate(broker.id)} data-testid={`button-suspend-broker-${broker.id}`}><Ban className="w-4 h-4" /></Button>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => activateMutation.mutate(broker.id)} data-testid={`button-activate-broker-${broker.id}`}><CheckCircle className="w-4 h-4" /></Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No brokers found</CardContent></Card>
          )}
        </div>
      )}
    </div>
  );
}
