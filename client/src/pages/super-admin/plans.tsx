import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Plus, Users, BarChart3, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SubscriptionPlan } from "@shared/schema";

export default function SuperAdminPlans() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", price: "", billingCycle: "monthly", maxClients: 100, maxAccounts: 500, maxIBs: 50, features: "",
  });

  const { data: plans = [], isLoading } = useQuery<SubscriptionPlan[]>({ queryKey: ["/api/super-admin/plans"] });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/super-admin/plans", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/super-admin/plans"] });
      toast({ title: "Plan created successfully" });
      setDialogOpen(false);
    },
    onError: () => toast({ title: "Failed to create plan", variant: "destructive" }),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-sa-plans-title">Subscription Plans</h1>
          <p className="text-muted-foreground">Manage pricing tiers and features</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-plan"><Plus className="w-4 h-4 mr-2" />Add Plan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Subscription Plan</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plan Name</Label>
                  <Input data-testid="input-plan-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Price (USD)</Label>
                  <Input data-testid="input-plan-price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Billing Cycle</Label>
                  <Select value={formData.billingCycle} onValueChange={(v) => setFormData({ ...formData, billingCycle: v })}>
                    <SelectTrigger data-testid="select-plan-cycle"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Max IBs</Label>
                  <Input data-testid="input-plan-max-ibs" type="number" value={formData.maxIBs} onChange={(e) => setFormData({ ...formData, maxIBs: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Clients</Label>
                  <Input data-testid="input-plan-max-clients" type="number" value={formData.maxClients} onChange={(e) => setFormData({ ...formData, maxClients: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>Max Accounts</Label>
                  <Input data-testid="input-plan-max-accounts" type="number" value={formData.maxAccounts} onChange={(e) => setFormData({ ...formData, maxAccounts: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Features (comma separated)</Label>
                <Textarea data-testid="input-plan-features" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} />
              </div>
              <Button className="w-full" data-testid="button-submit-plan" onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Plan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-48 bg-muted animate-pulse rounded-md" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="hover-elevate" data-testid={`card-plan-${plan.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg" data-testid={`text-plan-name-${plan.id}`}>{plan.name}</CardTitle>
                  <Badge variant={plan.status === "active" ? "default" : "secondary"}>{plan.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold" data-testid={`text-plan-price-${plan.id}`}>${Number(plan.price).toLocaleString()}</span>
                  <span className="text-muted-foreground">/{plan.billingCycle}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Up to {plan.maxClients} clients</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <span>Up to {plan.maxAccounts} accounts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    <span>Up to {plan.maxIBs} IBs</span>
                  </div>
                </div>
                {plan.features && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Features</p>
                    <div className="flex flex-wrap gap-1">
                      {plan.features.split(",").map((f, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{f.trim()}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {plans.length === 0 && (
            <Card className="col-span-full"><CardContent className="py-12 text-center text-muted-foreground">No plans created yet</CardContent></Card>
          )}
        </div>
      )}
    </div>
  );
}
