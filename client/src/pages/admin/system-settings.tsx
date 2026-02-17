import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Save, Settings, TrendingUp, DollarSign, Network, Monitor } from "lucide-react";
import type { BrokerSetting } from "@shared/schema";

export default function AdminSystemSettings() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<BrokerSetting[]>({
    queryKey: ["/api/admin/settings"],
  });

  const settingsMap = new Map((settings || []).map((s) => [s.settingKey, s.settingValue]));

  const [general, setGeneral] = useState({
    broker_name: "",
    company_email: "",
    support_phone: "",
    company_address: "",
    timezone: "UTC+0",
  });

  const [trading, setTrading] = useState({
    default_leverage: "1:100",
    allowed_mt4: true,
    allowed_mt5: true,
    allowed_ctrader: false,
    max_accounts_per_client: "5",
    auto_approve_accounts: false,
  });

  const [financial, setFinancial] = useState({
    min_deposit: "100",
    min_withdrawal: "50",
    withdrawal_fee: "0",
    deposit_fee: "0",
    auto_approve_deposits: false,
    auto_approve_withdrawals: false,
  });

  const [commission, setCommission] = useState({
    default_ib_rate: "2.5",
    referral_bonus: "50",
    payout_frequency: "monthly",
  });

  const [platform, setPlatform] = useState({
    maintenance_mode: false,
    registration_enabled: true,
    kyc_required: true,
    two_factor_required: false,
  });

  useEffect(() => {
    if (settings && settings.length > 0) {
      setGeneral({
        broker_name: settingsMap.get("broker_name") || "",
        company_email: settingsMap.get("company_email") || "",
        support_phone: settingsMap.get("support_phone") || "",
        company_address: settingsMap.get("company_address") || "",
        timezone: settingsMap.get("timezone") || "UTC+0",
      });
      setTrading({
        default_leverage: settingsMap.get("default_leverage") || "1:100",
        allowed_mt4: settingsMap.get("allowed_mt4") !== "false",
        allowed_mt5: settingsMap.get("allowed_mt5") !== "false",
        allowed_ctrader: settingsMap.get("allowed_ctrader") === "true",
        max_accounts_per_client: settingsMap.get("max_accounts_per_client") || "5",
        auto_approve_accounts: settingsMap.get("auto_approve_accounts") === "true",
      });
      setFinancial({
        min_deposit: settingsMap.get("min_deposit") || "100",
        min_withdrawal: settingsMap.get("min_withdrawal") || "50",
        withdrawal_fee: settingsMap.get("withdrawal_fee") || "0",
        deposit_fee: settingsMap.get("deposit_fee") || "0",
        auto_approve_deposits: settingsMap.get("auto_approve_deposits") === "true",
        auto_approve_withdrawals: settingsMap.get("auto_approve_withdrawals") === "true",
      });
      setCommission({
        default_ib_rate: settingsMap.get("default_ib_rate") || "2.5",
        referral_bonus: settingsMap.get("referral_bonus") || "50",
        payout_frequency: settingsMap.get("payout_frequency") || "monthly",
      });
      setPlatform({
        maintenance_mode: settingsMap.get("maintenance_mode") === "true",
        registration_enabled: settingsMap.get("registration_enabled") !== "false",
        kyc_required: settingsMap.get("kyc_required") !== "false",
        two_factor_required: settingsMap.get("two_factor_required") === "true",
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async ({ key, value, category }: { key: string; value: string; category: string }) => {
      return apiRequest("POST", "/api/admin/settings", { settingKey: key, settingValue: value, category });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
    },
  });

  const saveCategory = async (category: string, data: Record<string, string | boolean>) => {
    try {
      for (const [key, value] of Object.entries(data)) {
        await saveMutation.mutateAsync({ key, value: String(value), category });
      }
      toast({ title: `${category.charAt(0).toUpperCase() + category.slice(1)} settings saved` });
    } catch {
      toast({ title: "Failed to save settings", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-admin-settings-title">System Settings</h1>
        <p className="text-sm text-muted-foreground">Configure broker platform settings</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="general">
            <div className="border-b px-4 pt-2">
              <TabsList>
                <TabsTrigger value="general" data-testid="tab-settings-general"><Settings className="w-4 h-4 mr-2" /> General</TabsTrigger>
                <TabsTrigger value="trading" data-testid="tab-settings-trading"><TrendingUp className="w-4 h-4 mr-2" /> Trading</TabsTrigger>
                <TabsTrigger value="financial" data-testid="tab-settings-financial"><DollarSign className="w-4 h-4 mr-2" /> Financial</TabsTrigger>
                <TabsTrigger value="commission" data-testid="tab-settings-commission"><Network className="w-4 h-4 mr-2" /> Commission</TabsTrigger>
                <TabsTrigger value="platform" data-testid="tab-settings-platform"><Monitor className="w-4 h-4 mr-2" /> Platform</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="general" className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div className="space-y-2">
                  <Label>Broker Name</Label>
                  <Input value={general.broker_name} onChange={(e) => setGeneral({ ...general, broker_name: e.target.value })} placeholder="Your Broker Name" data-testid="input-broker-name" />
                </div>
                <div className="space-y-2">
                  <Label>Company Email</Label>
                  <Input type="email" value={general.company_email} onChange={(e) => setGeneral({ ...general, company_email: e.target.value })} placeholder="info@company.com" data-testid="input-company-email" />
                </div>
                <div className="space-y-2">
                  <Label>Support Phone</Label>
                  <Input value={general.support_phone} onChange={(e) => setGeneral({ ...general, support_phone: e.target.value })} placeholder="+1 234 567 890" data-testid="input-support-phone" />
                </div>
                <div className="space-y-2">
                  <Label>Company Address</Label>
                  <Input value={general.company_address} onChange={(e) => setGeneral({ ...general, company_address: e.target.value })} placeholder="123 Business St" data-testid="input-company-address" />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={general.timezone} onValueChange={(v) => setGeneral({ ...general, timezone: v })}>
                    <SelectTrigger data-testid="select-timezone"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">UTC-8 (Pacific)</SelectItem>
                      <SelectItem value="UTC-5">UTC-5 (Eastern)</SelectItem>
                      <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                      <SelectItem value="UTC+1">UTC+1 (CET)</SelectItem>
                      <SelectItem value="UTC+3">UTC+3 (EAT)</SelectItem>
                      <SelectItem value="UTC+8">UTC+8 (CST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => saveCategory("general", general)} disabled={saveMutation.isPending} data-testid="button-save-general">
                <Save className="w-4 h-4 mr-2" />
                Save General Settings
              </Button>
            </TabsContent>

            <TabsContent value="trading" className="p-6 space-y-6">
              <div className="space-y-4 max-w-2xl">
                <div className="space-y-2">
                  <Label>Default Leverage</Label>
                  <Select value={trading.default_leverage} onValueChange={(v) => setTrading({ ...trading, default_leverage: v })}>
                    <SelectTrigger data-testid="select-default-leverage"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:50">1:50</SelectItem>
                      <SelectItem value="1:100">1:100</SelectItem>
                      <SelectItem value="1:200">1:200</SelectItem>
                      <SelectItem value="1:500">1:500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Allowed Platforms</Label>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Checkbox checked={trading.allowed_mt4} onCheckedChange={(v) => setTrading({ ...trading, allowed_mt4: !!v })} data-testid="checkbox-mt4" />
                      <span className="text-sm">MT4</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={trading.allowed_mt5} onCheckedChange={(v) => setTrading({ ...trading, allowed_mt5: !!v })} data-testid="checkbox-mt5" />
                      <span className="text-sm">MT5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox checked={trading.allowed_ctrader} onCheckedChange={(v) => setTrading({ ...trading, allowed_ctrader: !!v })} data-testid="checkbox-ctrader" />
                      <span className="text-sm">cTrader</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Max Accounts Per Client</Label>
                  <Input type="number" value={trading.max_accounts_per_client} onChange={(e) => setTrading({ ...trading, max_accounts_per_client: e.target.value })} data-testid="input-max-accounts" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Auto-approve Accounts</p>
                    <p className="text-xs text-muted-foreground">Automatically approve new trading accounts</p>
                  </div>
                  <Switch checked={trading.auto_approve_accounts} onCheckedChange={(v) => setTrading({ ...trading, auto_approve_accounts: v })} data-testid="switch-auto-approve-accounts" />
                </div>
              </div>
              <Button onClick={() => saveCategory("trading", trading)} disabled={saveMutation.isPending} data-testid="button-save-trading">
                <Save className="w-4 h-4 mr-2" />
                Save Trading Settings
              </Button>
            </TabsContent>

            <TabsContent value="financial" className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div className="space-y-2">
                  <Label>Min Deposit Amount ($)</Label>
                  <Input type="number" value={financial.min_deposit} onChange={(e) => setFinancial({ ...financial, min_deposit: e.target.value })} data-testid="input-min-deposit" />
                </div>
                <div className="space-y-2">
                  <Label>Min Withdrawal Amount ($)</Label>
                  <Input type="number" value={financial.min_withdrawal} onChange={(e) => setFinancial({ ...financial, min_withdrawal: e.target.value })} data-testid="input-min-withdrawal" />
                </div>
                <div className="space-y-2">
                  <Label>Withdrawal Fee (%)</Label>
                  <Input type="number" value={financial.withdrawal_fee} onChange={(e) => setFinancial({ ...financial, withdrawal_fee: e.target.value })} data-testid="input-withdrawal-fee" />
                </div>
                <div className="space-y-2">
                  <Label>Deposit Fee (%)</Label>
                  <Input type="number" value={financial.deposit_fee} onChange={(e) => setFinancial({ ...financial, deposit_fee: e.target.value })} data-testid="input-deposit-fee" />
                </div>
              </div>
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Auto-approve Deposits</p>
                    <p className="text-xs text-muted-foreground">Automatically approve deposit requests</p>
                  </div>
                  <Switch checked={financial.auto_approve_deposits} onCheckedChange={(v) => setFinancial({ ...financial, auto_approve_deposits: v })} data-testid="switch-auto-approve-deposits" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Auto-approve Withdrawals</p>
                    <p className="text-xs text-muted-foreground">Automatically approve withdrawal requests</p>
                  </div>
                  <Switch checked={financial.auto_approve_withdrawals} onCheckedChange={(v) => setFinancial({ ...financial, auto_approve_withdrawals: v })} data-testid="switch-auto-approve-withdrawals" />
                </div>
              </div>
              <Button onClick={() => saveCategory("financial", financial)} disabled={saveMutation.isPending} data-testid="button-save-financial">
                <Save className="w-4 h-4 mr-2" />
                Save Financial Settings
              </Button>
            </TabsContent>

            <TabsContent value="commission" className="p-6 space-y-6">
              <div className="space-y-4 max-w-2xl">
                <div className="space-y-2">
                  <Label>Default IB Commission Rate (%)</Label>
                  <Input type="number" value={commission.default_ib_rate} onChange={(e) => setCommission({ ...commission, default_ib_rate: e.target.value })} data-testid="input-ib-rate" />
                </div>
                <div className="space-y-2">
                  <Label>Referral Bonus Amount ($)</Label>
                  <Input type="number" value={commission.referral_bonus} onChange={(e) => setCommission({ ...commission, referral_bonus: e.target.value })} data-testid="input-referral-bonus" />
                </div>
                <div className="space-y-2">
                  <Label>Commission Payout Frequency</Label>
                  <Select value={commission.payout_frequency} onValueChange={(v) => setCommission({ ...commission, payout_frequency: v })}>
                    <SelectTrigger data-testid="select-payout-frequency"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => saveCategory("commission", commission)} disabled={saveMutation.isPending} data-testid="button-save-commission">
                <Save className="w-4 h-4 mr-2" />
                Save Commission Settings
              </Button>
            </TabsContent>

            <TabsContent value="platform" className="p-6 space-y-6">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Maintenance Mode</p>
                    <p className="text-xs text-muted-foreground">Put the platform in maintenance mode</p>
                  </div>
                  <Switch checked={platform.maintenance_mode} onCheckedChange={(v) => setPlatform({ ...platform, maintenance_mode: v })} data-testid="switch-maintenance-mode" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Registration Enabled</p>
                    <p className="text-xs text-muted-foreground">Allow new user registrations</p>
                  </div>
                  <Switch checked={platform.registration_enabled} onCheckedChange={(v) => setPlatform({ ...platform, registration_enabled: v })} data-testid="switch-registration-enabled" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">KYC Required</p>
                    <p className="text-xs text-muted-foreground">Require KYC verification for trading</p>
                  </div>
                  <Switch checked={platform.kyc_required} onCheckedChange={(v) => setPlatform({ ...platform, kyc_required: v })} data-testid="switch-kyc-required" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Two-Factor Auth Required</p>
                    <p className="text-xs text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Switch checked={platform.two_factor_required} onCheckedChange={(v) => setPlatform({ ...platform, two_factor_required: v })} data-testid="switch-two-factor-required" />
                </div>
              </div>
              <Button onClick={() => saveCategory("platform", platform)} disabled={saveMutation.isPending} data-testid="button-save-platform">
                <Save className="w-4 h-4 mr-2" />
                Save Platform Settings
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
