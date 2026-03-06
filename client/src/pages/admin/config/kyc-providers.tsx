import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, ShieldCheck, CheckCircle, Clock, BarChart3 } from "lucide-react";

interface ProviderConfig {
  apiKey: string;
  apiSecret: string;
  webhookUrl: string;
  verificationLevel: string;
  autoApprove: boolean;
  redirectUrl: string;
}

interface Provider {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config: ProviderConfig;
  stats: {
    totalVerifications: number;
    successRate: string;
    avgTime: string;
  };
}

const initialProviders: Provider[] = [
  {
    id: "sumsub",
    name: "Sumsub",
    description: "AI-powered identity verification with global document coverage and liveness detection.",
    enabled: false,
    config: { apiKey: "", apiSecret: "", webhookUrl: "", verificationLevel: "basic", autoApprove: false, redirectUrl: "" },
    stats: { totalVerifications: 12450, successRate: "94.2%", avgTime: "2m 30s" },
  },
  {
    id: "idwise",
    name: "IDWise",
    description: "Seamless identity proofing with advanced biometric matching and fraud prevention.",
    enabled: false,
    config: { apiKey: "", apiSecret: "", webhookUrl: "", verificationLevel: "basic", autoApprove: false, redirectUrl: "" },
    stats: { totalVerifications: 8320, successRate: "91.8%", avgTime: "3m 15s" },
  },
  {
    id: "onfido",
    name: "Onfido",
    description: "Real-identity verification using AI to analyze documents, biometrics, and data.",
    enabled: false,
    config: { apiKey: "", apiSecret: "", webhookUrl: "", verificationLevel: "basic", autoApprove: false, redirectUrl: "" },
    stats: { totalVerifications: 15780, successRate: "96.1%", avgTime: "1m 45s" },
  },
  {
    id: "jumio",
    name: "Jumio",
    description: "End-to-end identity verification with document scanning and facial recognition.",
    enabled: false,
    config: { apiKey: "", apiSecret: "", webhookUrl: "", verificationLevel: "basic", autoApprove: false, redirectUrl: "" },
    stats: { totalVerifications: 9640, successRate: "93.5%", avgTime: "2m 10s" },
  },
  {
    id: "veriff",
    name: "Veriff",
    description: "Intelligent identity verification combining AI automation with expert human review.",
    enabled: false,
    config: { apiKey: "", apiSecret: "", webhookUrl: "", verificationLevel: "basic", autoApprove: false, redirectUrl: "" },
    stats: { totalVerifications: 11200, successRate: "95.3%", avgTime: "2m 00s" },
  },
  {
    id: "shuftipro",
    name: "ShuftiPro",
    description: "Multi-layered identity verification with real-time KYC, KYB, and AML screening.",
    enabled: false,
    config: { apiKey: "", apiSecret: "", webhookUrl: "", verificationLevel: "basic", autoApprove: false, redirectUrl: "" },
    stats: { totalVerifications: 6890, successRate: "90.7%", avgTime: "3m 45s" },
  },
];

export default function KycProvidersPage() {
  const { toast } = useToast();
  const [providers, setProviders] = useState<Provider[]>(initialProviders);

  const handleToggleProvider = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        enabled: p.id === id ? !p.enabled : false,
      }))
    );
  };

  const handleConfigChange = (id: string, field: keyof ProviderConfig, value: string | boolean) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, config: { ...p.config, [field]: value } } : p
      )
    );
  };

  const handleSave = (provider: Provider) => {
    toast({
      title: `${provider.name} settings saved`,
      description: "Provider configuration has been updated successfully.",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white" data-testid="text-kyc-providers-title">
              KYC Providers
            </h1>
            <p className="text-sm text-blue-100">
              Manage identity verification providers and configure KYC integration settings
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} data-testid={`card-provider-${provider.id}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <CardTitle className="text-lg">{provider.name}</CardTitle>
                <Badge
                  variant={provider.enabled ? "default" : "secondary"}
                  data-testid={`badge-status-${provider.id}`}
                >
                  {provider.enabled ? "Active" : "Inactive"}
                </Badge>
              </div>
              <Switch
                checked={provider.enabled}
                onCheckedChange={() => handleToggleProvider(provider.id)}
                data-testid={`switch-provider-${provider.id}`}
              />
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground" data-testid={`text-description-${provider.id}`}>
                {provider.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Verifications</p>
                    <p className="text-sm font-medium" data-testid={`stat-total-${provider.id}`}>
                      {provider.stats.totalVerifications.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                    <p className="text-sm font-medium" data-testid={`stat-success-${provider.id}`}>
                      {provider.stats.successRate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                    <p className="text-sm font-medium" data-testid={`stat-avgtime-${provider.id}`}>
                      {provider.stats.avgTime}
                    </p>
                  </div>
                </div>
              </div>

              {provider.enabled && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input
                        value={provider.config.apiKey}
                        onChange={(e) => handleConfigChange(provider.id, "apiKey", e.target.value)}
                        placeholder="Enter API key"
                        data-testid={`input-api-key-${provider.id}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>API Secret</Label>
                      <Input
                        type="password"
                        value={provider.config.apiSecret}
                        onChange={(e) => handleConfigChange(provider.id, "apiSecret", e.target.value)}
                        placeholder="Enter API secret"
                        data-testid={`input-api-secret-${provider.id}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <Input
                        value={provider.config.webhookUrl}
                        onChange={(e) => handleConfigChange(provider.id, "webhookUrl", e.target.value)}
                        placeholder="https://your-domain.com/webhook/kyc"
                        data-testid={`input-webhook-url-${provider.id}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Verification Level</Label>
                      <Select
                        value={provider.config.verificationLevel}
                        onValueChange={(v) => handleConfigChange(provider.id, "verificationLevel", v)}
                      >
                        <SelectTrigger data-testid={`select-verification-level-${provider.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="full">Full</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Redirect URL</Label>
                      <Input
                        value={provider.config.redirectUrl}
                        onChange={(e) => handleConfigChange(provider.id, "redirectUrl", e.target.value)}
                        placeholder="https://your-domain.com/kyc/complete"
                        data-testid={`input-redirect-url-${provider.id}`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">Auto-approve Verified</p>
                      <p className="text-xs text-muted-foreground">
                        Automatically approve clients after successful verification
                      </p>
                    </div>
                    <Switch
                      checked={provider.config.autoApprove}
                      onCheckedChange={(v) => handleConfigChange(provider.id, "autoApprove", v)}
                      data-testid={`switch-auto-approve-${provider.id}`}
                    />
                  </div>
                  <Button
                    onClick={() => handleSave(provider)}
                    data-testid={`button-save-${provider.id}`}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Provider Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}