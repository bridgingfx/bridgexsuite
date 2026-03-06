import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Pencil, Crown, Star } from "lucide-react";

interface TierConfig {
  id: string;
  name: string;
  minPoints: number;
  multiplier: number;
  benefits: string;
  color: string;
}

const defaultTiers: TierConfig[] = [
  { id: "1", name: "Bronze", minPoints: 0, multiplier: 1.0, benefits: "Basic rewards access, monthly newsletters", color: "bg-amber-700 text-white" },
  { id: "2", name: "Silver", minPoints: 5000, multiplier: 1.25, benefits: "Priority support, exclusive webinars, 5% bonus on deposits", color: "bg-gray-400 text-white" },
  { id: "3", name: "Gold", minPoints: 25000, multiplier: 1.5, benefits: "Dedicated account manager, premium signals, 10% bonus", color: "bg-yellow-500 text-white" },
  { id: "4", name: "Platinum", minPoints: 100000, multiplier: 2.0, benefits: "VIP events, custom trading conditions, 15% bonus", color: "bg-slate-600 text-white" },
  { id: "5", name: "Diamond", minPoints: 500000, multiplier: 3.0, benefits: "All benefits, personal advisor, zero fees, 25% bonus", color: "bg-blue-500 text-white" },
];

export default function LoyaltyConfigPage() {
  const { toast } = useToast();

  const [earningRules, setEarningRules] = useState({
    pointsPerLot: "10",
    depositBonusPer100: "5",
    referralPoints: "500",
    signUpBonus: "100",
    kycCompletionBonus: "250",
  });

  const [tiers, setTiers] = useState<TierConfig[]>(defaultTiers);

  const [expirySettings, setExpirySettings] = useState({
    expiryMonths: "12",
    notificationDays: "30",
    autoRenew: true,
  });

  const [tierDialogOpen, setTierDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<TierConfig | null>(null);
  const [tierForm, setTierForm] = useState({
    name: "",
    minPoints: "",
    multiplier: "",
    benefits: "",
    color: "bg-gray-500 text-white",
  });

  const openAddTier = () => {
    setEditingTier(null);
    setTierForm({ name: "", minPoints: "", multiplier: "", benefits: "", color: "bg-gray-500 text-white" });
    setTierDialogOpen(true);
  };

  const openEditTier = (tier: TierConfig) => {
    setEditingTier(tier);
    setTierForm({
      name: tier.name,
      minPoints: String(tier.minPoints),
      multiplier: String(tier.multiplier),
      benefits: tier.benefits,
      color: tier.color,
    });
    setTierDialogOpen(true);
  };

  const saveTier = () => {
    if (!tierForm.name || !tierForm.minPoints || !tierForm.multiplier) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const newTier: TierConfig = {
      id: editingTier?.id || String(Date.now()),
      name: tierForm.name,
      minPoints: Number(tierForm.minPoints),
      multiplier: Number(tierForm.multiplier),
      benefits: tierForm.benefits,
      color: tierForm.color,
    };

    if (editingTier) {
      setTiers(tiers.map((t) => (t.id === editingTier.id ? newTier : t)));
      toast({ title: `Tier "${newTier.name}" updated successfully` });
    } else {
      setTiers([...tiers, newTier]);
      toast({ title: `Tier "${newTier.name}" added successfully` });
    }

    setTierDialogOpen(false);
  };

  const handleSaveConfiguration = () => {
    toast({ title: "Loyalty configuration saved successfully" });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="rounded-md bg-gradient-to-r from-purple-600 to-purple-800 p-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Crown className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white" data-testid="text-loyalty-config-title">
              Loyalty Points Configuration
            </h1>
            <p className="text-sm text-purple-200">
              Configure points earning rules, tiers, and expiry settings
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            <Star className="w-5 h-5" />
            Points Earning Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Points per Lot Traded</Label>
              <Input
                type="number"
                value={earningRules.pointsPerLot}
                onChange={(e) => setEarningRules({ ...earningRules, pointsPerLot: e.target.value })}
                data-testid="input-points-per-lot"
              />
            </div>
            <div className="space-y-2">
              <Label>Deposit Bonus Points per $100</Label>
              <Input
                type="number"
                value={earningRules.depositBonusPer100}
                onChange={(e) => setEarningRules({ ...earningRules, depositBonusPer100: e.target.value })}
                data-testid="input-deposit-bonus-points"
              />
            </div>
            <div className="space-y-2">
              <Label>Referral Points</Label>
              <Input
                type="number"
                value={earningRules.referralPoints}
                onChange={(e) => setEarningRules({ ...earningRules, referralPoints: e.target.value })}
                data-testid="input-referral-points"
              />
            </div>
            <div className="space-y-2">
              <Label>Sign-up Bonus</Label>
              <Input
                type="number"
                value={earningRules.signUpBonus}
                onChange={(e) => setEarningRules({ ...earningRules, signUpBonus: e.target.value })}
                data-testid="input-signup-bonus"
              />
            </div>
            <div className="space-y-2">
              <Label>KYC Completion Bonus</Label>
              <Input
                type="number"
                value={earningRules.kycCompletionBonus}
                onChange={(e) => setEarningRules({ ...earningRules, kycCompletionBonus: e.target.value })}
                data-testid="input-kyc-bonus"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Tier Configuration</CardTitle>
          <Button onClick={openAddTier} data-testid="button-add-tier">
            <Plus className="w-4 h-4 mr-2" />
            Add Tier
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier Name</TableHead>
                <TableHead>Min Points</TableHead>
                <TableHead>Points Multiplier</TableHead>
                <TableHead>Benefits</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiers.map((tier) => (
                <TableRow key={tier.id} data-testid={`row-tier-${tier.id}`}>
                  <TableCell className="font-medium" data-testid={`text-tier-name-${tier.id}`}>
                    {tier.name}
                  </TableCell>
                  <TableCell data-testid={`text-tier-points-${tier.id}`}>
                    {tier.minPoints.toLocaleString()}
                  </TableCell>
                  <TableCell data-testid={`text-tier-multiplier-${tier.id}`}>
                    {tier.multiplier}x
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate" data-testid={`text-tier-benefits-${tier.id}`}>
                    {tier.benefits}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${tier.color} no-default-hover-elevate no-default-active-elevate`} data-testid={`badge-tier-${tier.id}`}>
                      {tier.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEditTier(tier)}
                      data-testid={`button-edit-tier-${tier.id}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expiry Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>Points Expire After (Months)</Label>
              <Input
                type="number"
                value={expirySettings.expiryMonths}
                onChange={(e) => setExpirySettings({ ...expirySettings, expiryMonths: e.target.value })}
                data-testid="input-expiry-months"
              />
            </div>
            <div className="space-y-2">
              <Label>Notification Before Expiry (Days)</Label>
              <Input
                type="number"
                value={expirySettings.notificationDays}
                onChange={(e) => setExpirySettings({ ...expirySettings, notificationDays: e.target.value })}
                data-testid="input-notification-days"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Auto-renew on Activity</p>
                <p className="text-xs text-muted-foreground">Reset expiry timer when points are earned</p>
              </div>
              <Switch
                checked={expirySettings.autoRenew}
                onCheckedChange={(v) => setExpirySettings({ ...expirySettings, autoRenew: v })}
                data-testid="switch-auto-renew"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveConfiguration} data-testid="button-save-config">
          <Save className="w-4 h-4 mr-2" />
          Save Configuration
        </Button>
      </div>

      <Dialog open={tierDialogOpen} onOpenChange={setTierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle data-testid="text-tier-dialog-title">
              {editingTier ? "Edit Tier" : "Add New Tier"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tier Name</Label>
              <Input
                value={tierForm.name}
                onChange={(e) => setTierForm({ ...tierForm, name: e.target.value })}
                placeholder="e.g. Gold"
                data-testid="input-tier-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Minimum Points</Label>
              <Input
                type="number"
                value={tierForm.minPoints}
                onChange={(e) => setTierForm({ ...tierForm, minPoints: e.target.value })}
                placeholder="e.g. 25000"
                data-testid="input-tier-min-points"
              />
            </div>
            <div className="space-y-2">
              <Label>Points Multiplier</Label>
              <Input
                type="number"
                step="0.1"
                value={tierForm.multiplier}
                onChange={(e) => setTierForm({ ...tierForm, multiplier: e.target.value })}
                placeholder="e.g. 1.5"
                data-testid="input-tier-multiplier"
              />
            </div>
            <div className="space-y-2">
              <Label>Benefits Description</Label>
              <Input
                value={tierForm.benefits}
                onChange={(e) => setTierForm({ ...tierForm, benefits: e.target.value })}
                placeholder="Describe tier benefits"
                data-testid="input-tier-benefits"
              />
            </div>
            <div className="space-y-2">
              <Label>Badge Color</Label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "Bronze", value: "bg-amber-700 text-white" },
                  { label: "Silver", value: "bg-gray-400 text-white" },
                  { label: "Gold", value: "bg-yellow-500 text-white" },
                  { label: "Platinum", value: "bg-slate-600 text-white" },
                  { label: "Blue", value: "bg-blue-500 text-white" },
                  { label: "Purple", value: "bg-purple-500 text-white" },
                  { label: "Green", value: "bg-emerald-500 text-white" },
                ].map((c) => (
                  <Badge
                    key={c.value}
                    className={`${c.value} cursor-pointer toggle-elevate ${tierForm.color === c.value ? "ring-2 ring-offset-2 ring-foreground toggle-elevated" : ""}`}
                    onClick={() => setTierForm({ ...tierForm, color: c.value })}
                    data-testid={`badge-color-${c.label.toLowerCase()}`}
                  >
                    {c.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTierDialogOpen(false)} data-testid="button-tier-cancel">
              Cancel
            </Button>
            <Button onClick={saveTier} data-testid="button-tier-save">
              {editingTier ? "Update Tier" : "Add Tier"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}