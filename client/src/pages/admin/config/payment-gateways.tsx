import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Shield, Globe, Save, Wallet, Landmark, ArrowRightLeft, CircleDollarSign, Banknote } from "lucide-react";

interface GatewayConfig {
  id: string;
  name: string;
  description: string;
  icon: typeof CreditCard;
  enabled: boolean;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  testMode: boolean;
  supportedCurrencies: string;
  processingFee: string;
}

const initialGateways: GatewayConfig[] = [
  { id: "nowpayments", name: "NowPayments", description: "Cryptocurrency payment gateway supporting 200+ coins", icon: CircleDollarSign, enabled: false, apiKey: "", secretKey: "", webhookUrl: "", testMode: true, supportedCurrencies: "BTC, ETH, USDT, LTC, XRP", processingFee: "0.5" },
  { id: "paytiko", name: "Paytiko", description: "Multi-currency payment processing for forex brokers", icon: ArrowRightLeft, enabled: false, apiKey: "", secretKey: "", webhookUrl: "", testMode: true, supportedCurrencies: "USD, EUR, GBP", processingFee: "1.5" },
  { id: "xmoney", name: "XMoney", description: "Global digital payment solutions with instant settlements", icon: Globe, enabled: false, apiKey: "", secretKey: "", webhookUrl: "", testMode: true, supportedCurrencies: "USD, EUR, GBP, JPY", processingFee: "1.0" },
  { id: "stripe", name: "Stripe", description: "Online payment processing for internet businesses", icon: CreditCard, enabled: false, apiKey: "", secretKey: "", webhookUrl: "", testMode: true, supportedCurrencies: "USD, EUR, GBP, CAD, AUD", processingFee: "2.9" },
  { id: "paypal", name: "PayPal", description: "Worldwide online payments system with buyer protection", icon: Wallet, enabled: false, apiKey: "", secretKey: "", webhookUrl: "", testMode: true, supportedCurrencies: "USD, EUR, GBP, CAD", processingFee: "3.49" },
  { id: "skrill", name: "Skrill", description: "Digital wallet for online payments and money transfers", icon: Banknote, enabled: false, apiKey: "", secretKey: "", webhookUrl: "", testMode: true, supportedCurrencies: "USD, EUR, GBP", processingFee: "1.45" },
  { id: "neteller", name: "Neteller", description: "E-wallet service for online money transfers and payments", icon: Shield, enabled: false, apiKey: "", secretKey: "", webhookUrl: "", testMode: true, supportedCurrencies: "USD, EUR, GBP", processingFee: "2.5" },
  { id: "fasapay", name: "FasaPay", description: "Online payment gateway popular in Southeast Asia", icon: Landmark, enabled: false, apiKey: "", secretKey: "", webhookUrl: "", testMode: true, supportedCurrencies: "USD, IDR", processingFee: "0.5" },
  { id: "perfect-money", name: "Perfect Money", description: "Internet payment system for business and personal use", icon: CircleDollarSign, enabled: false, apiKey: "", secretKey: "", webhookUrl: "", testMode: true, supportedCurrencies: "USD, EUR, BTC", processingFee: "1.99" },
];

export default function PaymentGatewaysPage() {
  const { toast } = useToast();
  const [gateways, setGateways] = useState<GatewayConfig[]>(initialGateways);

  const updateGateway = (id: string, updates: Partial<GatewayConfig>) => {
    setGateways((prev) =>
      prev.map((gw) => (gw.id === id ? { ...gw, ...updates } : gw))
    );
  };

  const handleSave = (gateway: GatewayConfig) => {
    toast({
      title: `${gateway.name} configuration saved`,
      description: gateway.enabled
        ? "Gateway is active and ready to process payments."
        : "Gateway has been disabled.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-md bg-gradient-to-r from-destructive/90 to-destructive/60 p-6">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight text-white" data-testid="text-payment-gateways-title">
            Payment Gateways
          </h1>
          <p className="mt-1 text-sm text-white/80" data-testid="text-payment-gateways-subtitle">
            Configure and manage payment processing integrations for deposits and withdrawals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {gateways.map((gateway) => {
          const IconComponent = gateway.icon;
          return (
            <Card key={gateway.id} data-testid={`card-gateway-${gateway.id}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center rounded-md bg-muted p-2">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base" data-testid={`text-gateway-name-${gateway.id}`}>
                      {gateway.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground truncate" data-testid={`text-gateway-desc-${gateway.id}`}>
                      {gateway.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge
                    variant={gateway.enabled ? "default" : "secondary"}
                    className="text-xs"
                    data-testid={`badge-gateway-status-${gateway.id}`}
                  >
                    {gateway.enabled ? "Active" : "Inactive"}
                  </Badge>
                  <Switch
                    checked={gateway.enabled}
                    onCheckedChange={(checked) => updateGateway(gateway.id, { enabled: checked })}
                    data-testid={`switch-gateway-enable-${gateway.id}`}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {gateway.enabled && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor={`api-key-${gateway.id}`}>API Key</Label>
                      <Input
                        id={`api-key-${gateway.id}`}
                        value={gateway.apiKey}
                        onChange={(e) => updateGateway(gateway.id, { apiKey: e.target.value })}
                        placeholder="Enter API key"
                        data-testid={`input-api-key-${gateway.id}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`secret-key-${gateway.id}`}>Secret Key</Label>
                      <Input
                        id={`secret-key-${gateway.id}`}
                        type="password"
                        value={gateway.secretKey}
                        onChange={(e) => updateGateway(gateway.id, { secretKey: e.target.value })}
                        placeholder="Enter secret key"
                        data-testid={`input-secret-key-${gateway.id}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`webhook-url-${gateway.id}`}>Webhook URL</Label>
                      <Input
                        id={`webhook-url-${gateway.id}`}
                        value={gateway.webhookUrl}
                        onChange={(e) => updateGateway(gateway.id, { webhookUrl: e.target.value })}
                        placeholder="https://your-domain.com/webhook"
                        data-testid={`input-webhook-url-${gateway.id}`}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">Test Mode</p>
                        <p className="text-xs text-muted-foreground">Use sandbox/test environment</p>
                      </div>
                      <Switch
                        checked={gateway.testMode}
                        onCheckedChange={(checked) => updateGateway(gateway.id, { testMode: checked })}
                        data-testid={`switch-test-mode-${gateway.id}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Supported Currencies</Label>
                      <p className="text-sm text-muted-foreground" data-testid={`text-currencies-${gateway.id}`}>
                        {gateway.supportedCurrencies}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`processing-fee-${gateway.id}`}>Processing Fee %</Label>
                      <Input
                        id={`processing-fee-${gateway.id}`}
                        type="number"
                        step="0.01"
                        value={gateway.processingFee}
                        onChange={(e) => updateGateway(gateway.id, { processingFee: e.target.value })}
                        placeholder="0.00"
                        data-testid={`input-processing-fee-${gateway.id}`}
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleSave(gateway)}
                      data-testid={`button-save-gateway-${gateway.id}`}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Configuration
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}