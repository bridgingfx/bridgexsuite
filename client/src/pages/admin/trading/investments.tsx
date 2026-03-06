import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Pause,
  DollarSign,
  BarChart3,
  Calendar,
  Users,
  CircleStop,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
} from "lucide-react";

type PlanCategory = "Gold" | "Crypto" | "Currency" | "Real Estate" | "Stocks";
type PlanStatus = "Active" | "Inactive" | "Closed";
type InvestmentStatus = "Active" | "Locked" | "Matured" | "Withdrawn";
type PayoutType = "ROI" | "Principal" | "Both";
type PayoutStatus = "Pending" | "Approved" | "Paid" | "Failed";

interface Plan {
  id: string;
  name: string;
  category: PlanCategory;
  minInvestment: number;
  maxInvestment: number;
  roiMonthly: number;
  lockInDays: number;
  status: PlanStatus;
  totalInvested: number;
  investors: number;
  riskLevel: "Low" | "Medium" | "High";
  description: string;
  autoCompound: boolean;
}

interface Investment {
  id: string;
  client: string;
  planName: string;
  amountInvested: number;
  currentValue: number;
  roiEarned: number;
  startDate: string;
  lockInEndDate: string;
  status: InvestmentStatus;
}

interface Payout {
  id: string;
  client: string;
  plan: string;
  amount: number;
  type: PayoutType;
  date: string;
  status: PayoutStatus;
}

const mockPlans: Plan[] = [
  { id: "PLN-001", name: "Gold Standard", category: "Gold", minInvestment: 5000, maxInvestment: 100000, roiMonthly: 3.5, lockInDays: 180, status: "Active", totalInvested: 1250000, investors: 48, riskLevel: "Low", description: "Stable gold-backed investment plan", autoCompound: true },
  { id: "PLN-002", name: "Crypto Growth", category: "Crypto", minInvestment: 1000, maxInvestment: 50000, roiMonthly: 8.2, lockInDays: 90, status: "Active", totalInvested: 890000, investors: 125, riskLevel: "High", description: "High-yield cryptocurrency portfolio", autoCompound: false },
  { id: "PLN-003", name: "Forex Elite", category: "Currency", minInvestment: 2500, maxInvestment: 75000, roiMonthly: 5.0, lockInDays: 120, status: "Active", totalInvested: 620000, investors: 67, riskLevel: "Medium", description: "Managed forex trading strategy", autoCompound: true },
  { id: "PLN-004", name: "Real Estate Prime", category: "Real Estate", minInvestment: 10000, maxInvestment: 500000, roiMonthly: 2.8, lockInDays: 365, status: "Active", totalInvested: 3400000, investors: 32, riskLevel: "Low", description: "Premium real estate investment trust", autoCompound: true },
  { id: "PLN-005", name: "Tech Stocks Alpha", category: "Stocks", minInvestment: 2000, maxInvestment: 150000, roiMonthly: 6.5, lockInDays: 60, status: "Active", totalInvested: 980000, investors: 89, riskLevel: "Medium", description: "Technology sector stock portfolio", autoCompound: false },
  { id: "PLN-006", name: "Gold Reserve Plus", category: "Gold", minInvestment: 25000, maxInvestment: 250000, roiMonthly: 4.2, lockInDays: 270, status: "Inactive", totalInvested: 450000, investors: 12, riskLevel: "Low", description: "Premium gold reserve allocation", autoCompound: true },
  { id: "PLN-007", name: "DeFi Yield", category: "Crypto", minInvestment: 500, maxInvestment: 25000, roiMonthly: 12.0, lockInDays: 30, status: "Active", totalInvested: 340000, investors: 210, riskLevel: "High", description: "Decentralized finance yield farming", autoCompound: false },
  { id: "PLN-008", name: "Blue Chip Stocks", category: "Stocks", minInvestment: 5000, maxInvestment: 200000, roiMonthly: 3.8, lockInDays: 180, status: "Closed", totalInvested: 1680000, investors: 56, riskLevel: "Low", description: "Diversified blue-chip stock portfolio", autoCompound: true },
];

const mockInvestments: Investment[] = [
  { id: "INV-10001", client: "James Wilson", planName: "Gold Standard", amountInvested: 25000, currentValue: 27625, roiEarned: 2625, startDate: "2024-08-15", lockInEndDate: "2025-02-11", status: "Active" },
  { id: "INV-10002", client: "Sarah Chen", planName: "Crypto Growth", amountInvested: 10000, currentValue: 12460, roiEarned: 2460, startDate: "2024-09-01", lockInEndDate: "2024-11-30", status: "Locked" },
  { id: "INV-10003", client: "Michael Brown", planName: "Forex Elite", amountInvested: 15000, currentValue: 17250, roiEarned: 2250, startDate: "2024-07-20", lockInEndDate: "2024-11-17", status: "Matured" },
  { id: "INV-10004", client: "Emily Davis", planName: "Real Estate Prime", amountInvested: 50000, currentValue: 54200, roiEarned: 4200, startDate: "2024-06-01", lockInEndDate: "2025-05-31", status: "Locked" },
  { id: "INV-10005", client: "Robert Taylor", planName: "Tech Stocks Alpha", amountInvested: 8000, currentValue: 9560, roiEarned: 1560, startDate: "2024-10-01", lockInEndDate: "2024-11-30", status: "Active" },
  { id: "INV-10006", client: "Lisa Anderson", planName: "DeFi Yield", amountInvested: 5000, currentValue: 6800, roiEarned: 1800, startDate: "2024-10-15", lockInEndDate: "2024-11-14", status: "Active" },
  { id: "INV-10007", client: "David Martinez", planName: "Gold Standard", amountInvested: 40000, currentValue: 44200, roiEarned: 4200, startDate: "2024-09-10", lockInEndDate: "2025-03-09", status: "Locked" },
  { id: "INV-10008", client: "Jennifer White", planName: "Blue Chip Stocks", amountInvested: 20000, currentValue: 22280, roiEarned: 2280, startDate: "2024-05-01", lockInEndDate: "2024-10-28", status: "Withdrawn" },
  { id: "INV-10009", client: "Thomas Lee", planName: "Forex Elite", amountInvested: 30000, currentValue: 34500, roiEarned: 4500, startDate: "2024-08-01", lockInEndDate: "2024-11-29", status: "Active" },
  { id: "INV-10010", client: "Amanda Clark", planName: "Crypto Growth", amountInvested: 12000, currentValue: 14952, roiEarned: 2952, startDate: "2024-09-20", lockInEndDate: "2024-12-19", status: "Locked" },
];

const mockPayouts: Payout[] = [
  { id: "PAY-5001", client: "James Wilson", plan: "Gold Standard", amount: 875, type: "ROI", date: "2024-11-01", status: "Paid" },
  { id: "PAY-5002", client: "Sarah Chen", plan: "Crypto Growth", amount: 820, type: "ROI", date: "2024-11-01", status: "Approved" },
  { id: "PAY-5003", client: "Michael Brown", plan: "Forex Elite", amount: 17250, type: "Both", date: "2024-11-17", status: "Pending" },
  { id: "PAY-5004", client: "Emily Davis", plan: "Real Estate Prime", amount: 1400, type: "ROI", date: "2024-11-01", status: "Paid" },
  { id: "PAY-5005", client: "Robert Taylor", plan: "Tech Stocks Alpha", amount: 520, type: "ROI", date: "2024-11-01", status: "Pending" },
  { id: "PAY-5006", client: "Lisa Anderson", plan: "DeFi Yield", amount: 600, type: "ROI", date: "2024-11-15", status: "Failed" },
  { id: "PAY-5007", client: "Jennifer White", plan: "Blue Chip Stocks", amount: 22280, type: "Principal", date: "2024-10-28", status: "Paid" },
  { id: "PAY-5008", client: "Thomas Lee", plan: "Forex Elite", amount: 1500, type: "ROI", date: "2024-11-01", status: "Pending" },
];

const categoryColors: Record<PlanCategory, string> = {
  Gold: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Crypto: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Currency: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Real Estate": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Stocks: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
};

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Active":
    case "Paid":
    case "Approved":
      return "default";
    case "Locked":
    case "Pending":
      return "secondary";
    case "Inactive":
    case "Failed":
    case "Withdrawn":
      return "destructive";
    default:
      return "outline";
  }
}

const emptyPlanForm = {
  name: "",
  category: "Gold" as PlanCategory,
  minInvestment: "",
  maxInvestment: "",
  roiMonthly: "",
  lockInDays: "",
  riskLevel: "Medium" as "Low" | "Medium" | "High",
  description: "",
  autoCompound: false,
  active: true,
};

export default function InvestmentsPage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
  const [payouts, setPayouts] = useState<Payout[]>(mockPayouts);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planForm, setPlanForm] = useState(emptyPlanForm);
  const [distributionSettings, setDistributionSettings] = useState({
    autoDistribute: true,
    distributionDay: "1st",
    minPayoutAmount: "50",
  });

  const totalAUM = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const activePlansCount = plans.filter((p) => p.status === "Active").length;
  const monthlyDistributions = payouts.filter((p) => p.type === "ROI" || p.type === "Both").reduce((sum, p) => sum + p.amount, 0);
  const avgROI = plans.filter((p) => p.status === "Active").reduce((sum, p) => sum + p.roiMonthly, 0) / (activePlansCount || 1);

  const openCreateDialog = () => {
    setPlanForm(emptyPlanForm);
    setEditingPlan(null);
    setCreateDialogOpen(true);
  };

  const openEditDialog = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      category: plan.category,
      minInvestment: String(plan.minInvestment),
      maxInvestment: String(plan.maxInvestment),
      roiMonthly: String(plan.roiMonthly),
      lockInDays: String(plan.lockInDays),
      riskLevel: plan.riskLevel,
      description: plan.description,
      autoCompound: plan.autoCompound,
      active: plan.status === "Active",
    });
    setCreateDialogOpen(true);
  };

  const handleSavePlan = () => {
    if (!planForm.name || !planForm.minInvestment || !planForm.maxInvestment || !planForm.roiMonthly || !planForm.lockInDays) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    if (editingPlan) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id
            ? {
                ...p,
                name: planForm.name,
                category: planForm.category,
                minInvestment: Number(planForm.minInvestment),
                maxInvestment: Number(planForm.maxInvestment),
                roiMonthly: Number(planForm.roiMonthly),
                lockInDays: Number(planForm.lockInDays),
                riskLevel: planForm.riskLevel,
                description: planForm.description,
                autoCompound: planForm.autoCompound,
                status: planForm.active ? "Active" : "Inactive" as PlanStatus,
              }
            : p
        )
      );
      toast({ title: "Plan updated successfully" });
    } else {
      const newPlan: Plan = {
        id: `PLN-${String(plans.length + 1).padStart(3, "0")}`,
        name: planForm.name,
        category: planForm.category,
        minInvestment: Number(planForm.minInvestment),
        maxInvestment: Number(planForm.maxInvestment),
        roiMonthly: Number(planForm.roiMonthly),
        lockInDays: Number(planForm.lockInDays),
        status: planForm.active ? "Active" : "Inactive",
        totalInvested: 0,
        investors: 0,
        riskLevel: planForm.riskLevel,
        description: planForm.description,
        autoCompound: planForm.autoCompound,
      };
      setPlans((prev) => [...prev, newPlan]);
      toast({ title: "Plan created successfully" });
    }
    setCreateDialogOpen(false);
  };

  const handleDeletePlan = (planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
    toast({ title: "Plan deleted" });
  };

  const handlePausePlan = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId ? { ...p, status: p.status === "Active" ? "Inactive" as PlanStatus : "Active" as PlanStatus } : p
      )
    );
    toast({ title: "Plan status updated" });
  };

  const handleInvestmentAction = (investmentId: string, action: string) => {
    setInvestments((prev) =>
      prev.map((inv) => {
        if (inv.id !== investmentId) return inv;
        switch (action) {
          case "pause":
            return { ...inv, status: "Locked" as InvestmentStatus };
          case "terminate":
            return { ...inv, status: "Withdrawn" as InvestmentStatus, currentValue: inv.currentValue * 0.95 };
          case "extend":
            const endDate = new Date(inv.lockInEndDate);
            endDate.setDate(endDate.getDate() + 30);
            return { ...inv, lockInEndDate: endDate.toISOString().split("T")[0] };
          default:
            return inv;
        }
      })
    );
    const actionLabels: Record<string, string> = { pause: "Investment paused", terminate: "Investment terminated (5% penalty applied)", extend: "Lock-in extended by 30 days" };
    toast({ title: actionLabels[action] || "Action completed" });
  };

  const handlePayoutAction = (payoutId: string, action: string) => {
    setPayouts((prev) =>
      prev.map((p) => {
        if (p.id !== payoutId) return p;
        switch (action) {
          case "approve":
            return { ...p, status: "Approved" as PayoutStatus };
          case "reject":
            return { ...p, status: "Failed" as PayoutStatus };
          case "markPaid":
            return { ...p, status: "Paid" as PayoutStatus };
          default:
            return p;
        }
      })
    );
    const actionLabels: Record<string, string> = { approve: "Payout approved", reject: "Payout rejected", markPaid: "Payout marked as paid" };
    toast({ title: actionLabels[action] || "Action completed" });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-md bg-gradient-to-r from-amber-600 to-orange-500 p-6">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white" data-testid="text-investments-title">Investment Management</h1>
          <p className="text-amber-100 text-sm mt-1">Manage investment plans, monitor active investments, and process payouts</p>
        </div>
      </div>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans" data-testid="tab-plans">Plans</TabsTrigger>
          <TabsTrigger value="active" data-testid="tab-active-investments">Active Investments</TabsTrigger>
          <TabsTrigger value="payouts" data-testid="tab-payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-muted-foreground">Manage investment plans and their configurations</p>
            <Button onClick={openCreateDialog} data-testid="button-create-plan">
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Min Investment</TableHead>
                    <TableHead>Max Investment</TableHead>
                    <TableHead>ROI % (Monthly)</TableHead>
                    <TableHead>Lock-in (Days)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Invested</TableHead>
                    <TableHead>Investors</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id} data-testid={`row-plan-${plan.id}`}>
                      <TableCell className="font-medium" data-testid={`text-plan-name-${plan.id}`}>{plan.name}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${categoryColors[plan.category]}`} data-testid={`text-plan-category-${plan.id}`}>
                          {plan.category}
                        </span>
                      </TableCell>
                      <TableCell data-testid={`text-plan-min-${plan.id}`}>${plan.minInvestment.toLocaleString()}</TableCell>
                      <TableCell data-testid={`text-plan-max-${plan.id}`}>${plan.maxInvestment.toLocaleString()}</TableCell>
                      <TableCell data-testid={`text-plan-roi-${plan.id}`}>{plan.roiMonthly}%</TableCell>
                      <TableCell data-testid={`text-plan-lockin-${plan.id}`}>{plan.lockInDays}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(plan.status)} data-testid={`badge-plan-status-${plan.id}`}>{plan.status}</Badge>
                      </TableCell>
                      <TableCell data-testid={`text-plan-total-${plan.id}`}>${plan.totalInvested.toLocaleString()}</TableCell>
                      <TableCell data-testid={`text-plan-investors-${plan.id}`}>{plan.investors}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" data-testid={`button-plan-actions-${plan.id}`}>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(plan)} data-testid={`button-edit-plan-${plan.id}`}>
                              <Pencil className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePausePlan(plan.id)} data-testid={`button-pause-plan-${plan.id}`}>
                              <Pause className="w-4 h-4 mr-2" /> {plan.status === "Active" ? "Pause" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeletePlan(plan.id)} className="text-destructive" data-testid={`button-delete-plan-${plan.id}`}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-aum">${totalAUM.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-active-plans">{activePlansCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Distributions</CardTitle>
                <CreditCard className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-monthly-distributions">${monthlyDistributions.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-avg-roi">{avgROI.toFixed(1)}%</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investment ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Amount Invested</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>ROI Earned</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Lock-in End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((inv) => (
                    <TableRow key={inv.id} data-testid={`row-investment-${inv.id}`}>
                      <TableCell className="font-medium" data-testid={`text-inv-id-${inv.id}`}>{inv.id}</TableCell>
                      <TableCell data-testid={`text-inv-client-${inv.id}`}>{inv.client}</TableCell>
                      <TableCell data-testid={`text-inv-plan-${inv.id}`}>{inv.planName}</TableCell>
                      <TableCell data-testid={`text-inv-amount-${inv.id}`}>${inv.amountInvested.toLocaleString()}</TableCell>
                      <TableCell data-testid={`text-inv-value-${inv.id}`}>${inv.currentValue.toLocaleString()}</TableCell>
                      <TableCell className="text-green-600 dark:text-green-400" data-testid={`text-inv-roi-${inv.id}`}>+${inv.roiEarned.toLocaleString()}</TableCell>
                      <TableCell data-testid={`text-inv-start-${inv.id}`}>{inv.startDate}</TableCell>
                      <TableCell data-testid={`text-inv-end-${inv.id}`}>{inv.lockInEndDate}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(inv.status)} data-testid={`badge-inv-status-${inv.id}`}>{inv.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" data-testid={`button-inv-actions-${inv.id}`}>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleInvestmentAction(inv.id, "pause")} data-testid={`button-pause-inv-${inv.id}`}>
                              <Pause className="w-4 h-4 mr-2" /> Pause
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleInvestmentAction(inv.id, "terminate")} className="text-destructive" data-testid={`button-terminate-inv-${inv.id}`}>
                              <CircleStop className="w-4 h-4 mr-2" /> Terminate Early
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleInvestmentAction(inv.id, "extend")} data-testid={`button-extend-inv-${inv.id}`}>
                              <Clock className="w-4 h-4 mr-2" /> Extend Lock-in
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((payout) => (
                    <TableRow key={payout.id} data-testid={`row-payout-${payout.id}`}>
                      <TableCell className="font-medium" data-testid={`text-payout-id-${payout.id}`}>{payout.id}</TableCell>
                      <TableCell data-testid={`text-payout-client-${payout.id}`}>{payout.client}</TableCell>
                      <TableCell data-testid={`text-payout-plan-${payout.id}`}>{payout.plan}</TableCell>
                      <TableCell data-testid={`text-payout-amount-${payout.id}`}>${payout.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" data-testid={`badge-payout-type-${payout.id}`}>{payout.type}</Badge>
                      </TableCell>
                      <TableCell data-testid={`text-payout-date-${payout.id}`}>{payout.date}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(payout.status)} data-testid={`badge-payout-status-${payout.id}`}>{payout.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" data-testid={`button-payout-actions-${payout.id}`}>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePayoutAction(payout.id, "approve")} data-testid={`button-approve-payout-${payout.id}`}>
                              <CheckCircle className="w-4 h-4 mr-2" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePayoutAction(payout.id, "reject")} className="text-destructive" data-testid={`button-reject-payout-${payout.id}`}>
                              <XCircle className="w-4 h-4 mr-2" /> Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePayoutAction(payout.id, "markPaid")} data-testid={`button-markpaid-payout-${payout.id}`}>
                              <DollarSign className="w-4 h-4 mr-2" /> Mark Paid
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribution Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Auto-distribute ROI</p>
                  <p className="text-xs text-muted-foreground">Automatically distribute ROI to investors</p>
                </div>
                <Switch
                  checked={distributionSettings.autoDistribute}
                  onCheckedChange={(v) => setDistributionSettings((s) => ({ ...s, autoDistribute: v }))}
                  data-testid="switch-auto-distribute"
                />
              </div>
              <div className="space-y-2">
                <Label>Distribution Day</Label>
                <Select value={distributionSettings.distributionDay} onValueChange={(v) => setDistributionSettings((s) => ({ ...s, distributionDay: v }))}>
                  <SelectTrigger data-testid="select-distribution-day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st of month</SelectItem>
                    <SelectItem value="15th">15th of month</SelectItem>
                    <SelectItem value="last">Last day of month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Min Payout Amount ($)</Label>
                <Input
                  type="number"
                  value={distributionSettings.minPayoutAmount}
                  onChange={(e) => setDistributionSettings((s) => ({ ...s, minPayoutAmount: e.target.value }))}
                  data-testid="input-min-payout-amount"
                />
              </div>
              <Button
                onClick={() => toast({ title: "Distribution settings saved" })}
                data-testid="button-save-distribution"
              >
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle data-testid="text-plan-dialog-title">{editingPlan ? "Edit Plan" : "Create Plan"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={planForm.name}
                onChange={(e) => setPlanForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Investment plan name"
                data-testid="input-plan-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={planForm.category} onValueChange={(v) => setPlanForm((f) => ({ ...f, category: v as PlanCategory }))}>
                <SelectTrigger data-testid="select-plan-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Crypto">Crypto</SelectItem>
                  <SelectItem value="Currency">Currency</SelectItem>
                  <SelectItem value="Real Estate">Real Estate</SelectItem>
                  <SelectItem value="Stocks">Stocks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Investment ($)</Label>
                <Input
                  type="number"
                  value={planForm.minInvestment}
                  onChange={(e) => setPlanForm((f) => ({ ...f, minInvestment: e.target.value }))}
                  placeholder="1000"
                  data-testid="input-plan-min-investment"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Investment ($)</Label>
                <Input
                  type="number"
                  value={planForm.maxInvestment}
                  onChange={(e) => setPlanForm((f) => ({ ...f, maxInvestment: e.target.value }))}
                  placeholder="100000"
                  data-testid="input-plan-max-investment"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Monthly ROI (%)</Label>
                <Input
                  type="number"
                  value={planForm.roiMonthly}
                  onChange={(e) => setPlanForm((f) => ({ ...f, roiMonthly: e.target.value }))}
                  placeholder="5.0"
                  data-testid="input-plan-roi"
                />
              </div>
              <div className="space-y-2">
                <Label>Lock-in Period (days)</Label>
                <Input
                  type="number"
                  value={planForm.lockInDays}
                  onChange={(e) => setPlanForm((f) => ({ ...f, lockInDays: e.target.value }))}
                  placeholder="90"
                  data-testid="input-plan-lockin-days"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Risk Level</Label>
              <Select value={planForm.riskLevel} onValueChange={(v) => setPlanForm((f) => ({ ...f, riskLevel: v as "Low" | "Medium" | "High" }))}>
                <SelectTrigger data-testid="select-plan-risk-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={planForm.description}
                onChange={(e) => setPlanForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe this investment plan..."
                data-testid="textarea-plan-description"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Auto-compound</p>
                <p className="text-xs text-muted-foreground">Automatically reinvest earned ROI</p>
              </div>
              <Switch
                checked={planForm.autoCompound}
                onCheckedChange={(v) => setPlanForm((f) => ({ ...f, autoCompound: v }))}
                data-testid="switch-plan-auto-compound"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-xs text-muted-foreground">Set plan as active or inactive</p>
              </div>
              <Switch
                checked={planForm.active}
                onCheckedChange={(v) => setPlanForm((f) => ({ ...f, active: v }))}
                data-testid="switch-plan-status"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} data-testid="button-cancel-plan">Cancel</Button>
            <Button onClick={handleSavePlan} data-testid="button-save-plan">
              {editingPlan ? "Update Plan" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}