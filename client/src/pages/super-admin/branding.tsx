import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Palette, Globe, Building2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Broker, BrokerBranding } from "@shared/schema";

export default function SuperAdminBranding() {
  const { toast } = useToast();
  const [selectedBrokerId, setSelectedBrokerId] = useState<string>("");
  const [formData, setFormData] = useState({
    primaryColor: "#3b82f6", secondaryColor: "#10b981", accentColor: "#f59e0b",
    companyTagline: "", customDomain: "", logoUrl: "",
  });

  const { data: brokersList = [] } = useQuery<Broker[]>({ queryKey: ["/api/super-admin/brokers"] });

  const { data: currentBranding, isLoading: brandingLoading } = useQuery<BrokerBranding>({
    queryKey: ["/api/super-admin/brokers", selectedBrokerId, "branding"],
    enabled: !!selectedBrokerId,
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", `/api/super-admin/brokers/${selectedBrokerId}/branding`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/super-admin/brokers", selectedBrokerId, "branding"] });
      toast({ title: "Branding saved successfully" });
    },
    onError: () => toast({ title: "Failed to save branding", variant: "destructive" }),
  });

  const handleBrokerSelect = (id: string) => {
    setSelectedBrokerId(id);
  };

  const handleLoad = () => {
    if (currentBranding && 'primaryColor' in currentBranding) {
      setFormData({
        primaryColor: currentBranding.primaryColor || "#3b82f6",
        secondaryColor: currentBranding.secondaryColor || "#10b981",
        accentColor: currentBranding.accentColor || "#f59e0b",
        companyTagline: currentBranding.companyTagline || "",
        customDomain: currentBranding.customDomain || "",
        logoUrl: currentBranding.logoUrl || "",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-sa-branding-title">White-Label Branding</h1>
        <p className="text-muted-foreground">Configure branding for each broker tenant</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Label className="mb-2 block">Select Broker</Label>
              <Select value={selectedBrokerId} onValueChange={(v) => { handleBrokerSelect(v); }}>
                <SelectTrigger data-testid="select-branding-broker"><SelectValue placeholder="Choose a broker" /></SelectTrigger>
                <SelectContent>
                  {brokersList.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedBrokerId && (
              <Button variant="outline" className="mt-6" onClick={handleLoad} data-testid="button-load-branding">
                Load Current
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedBrokerId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Palette className="w-4 h-4" />Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex items-center gap-3">
                  <input type="color" value={formData.primaryColor} onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })} className="w-10 h-10 rounded-md border cursor-pointer" data-testid="input-branding-primary-color" />
                  <Input value={formData.primaryColor} onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })} className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex items-center gap-3">
                  <input type="color" value={formData.secondaryColor} onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })} className="w-10 h-10 rounded-md border cursor-pointer" data-testid="input-branding-secondary-color" />
                  <Input value={formData.secondaryColor} onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })} className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex items-center gap-3">
                  <input type="color" value={formData.accentColor} onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })} className="w-10 h-10 rounded-md border cursor-pointer" data-testid="input-branding-accent-color" />
                  <Input value={formData.accentColor} onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })} className="flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Globe className="w-4 h-4" />Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input data-testid="input-branding-logo" value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Company Tagline</Label>
                <Input data-testid="input-branding-tagline" value={formData.companyTagline} onChange={(e) => setFormData({ ...formData, companyTagline: e.target.value })} placeholder="Your brand message" />
              </div>
              <div className="space-y-2">
                <Label>Custom Domain</Label>
                <Input data-testid="input-branding-domain" value={formData.customDomain} onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })} placeholder="crm.yourdomain.com" />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ backgroundColor: formData.primaryColor }}>
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: formData.primaryColor }}>
                      {brokersList.find(b => b.id === selectedBrokerId)?.name || "Broker Name"}
                    </p>
                    <p className="text-sm text-muted-foreground">{formData.companyTagline || "Company tagline"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-4 py-2 rounded-md text-white text-sm" style={{ backgroundColor: formData.primaryColor }}>Primary</div>
                  <div className="px-4 py-2 rounded-md text-white text-sm" style={{ backgroundColor: formData.secondaryColor }}>Secondary</div>
                  <div className="px-4 py-2 rounded-md text-white text-sm" style={{ backgroundColor: formData.accentColor }}>Accent</div>
                </div>
              </div>
              <Button className="w-full mt-4" onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending} data-testid="button-save-branding">
                <Save className="w-4 h-4 mr-2" />{saveMutation.isPending ? "Saving..." : "Save Branding"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
