import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { TrendingUp, PiggyBank } from "lucide-react";
import type { InvestmentPlan, Investment } from "@shared/schema";

function getRiskColor(riskLevel: string) {
  switch (riskLevel.toLowerCase()) {
    case "low":
      return "bg-emerald-500/10 text-emerald-500";
    case "medium":
      return "bg-amber-500/10 text-amber-500";
    case "high":
      return "bg-red-500/10 text-red-500";
    default:
      return "bg-amber-500/10 text-amber-500";
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-emerald-500/10 text-emerald-500";
    case "matured":
      return "bg-blue-500/10 text-blue-500";
    case "withdrawn":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function InvestmentPage() {
  const { toast } = useToast();
  const [investOpen, setInvestOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investAmount, setInvestAmount] = useState("");

  const { data: plans, isLoading: plansLoading } = useQuery<InvestmentPlan[]>({ queryKey: ["/api/investments/plans"] });
  const { data: myInvestments, isLoading: investmentsLoading } = useQuery<Investment[]>({ queryKey: ["/api/investments"] });

  const investMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/investments", { planId: selectedPlan!.id, amount: investAmount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      toast({ title: "Investment created!" });
      setInvestOpen(false);
      setInvestAmount("");
      setSelectedPlan(null);
    },
    onError: () => {
      toast({ title: "Investment failed", variant: "destructive" });
    },
  });

  function openInvestDialog(plan: InvestmentPlan) {
    setSelectedPlan(plan);
    setInvestAmount("");
    setInvestOpen(true);
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-investment-title">Investment</h1>
          <p className="text-sm text-muted-foreground">Grow your wealth with managed investment plans</p>
        </div>
      </div>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans" data-testid="tab-plans">Plans</TabsTrigger>
          <TabsTrigger value="my-investments" data-testid="tab-my-investments">My Investments</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-4">
          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-48 animate-pulse rounded-md bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : plans && plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map((plan) => {
                const riskColor = getRiskColor(plan.riskLevel);
                return (
                  <Card key={plan.id} data-testid={`card-plan-${plan.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Badge variant="secondary" className={`text-xs ${riskColor}`}>{plan.riskLevel}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      <div className="text-3xl font-bold tracking-tight text-emerald-500">{plan.expectedReturn}%</div>
                      <p className="text-sm text-muted-foreground">Expected Annual Return</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-md bg-muted/40 p-3">
                          <p className="text-xs text-muted-foreground">Min Investment</p>
                          <p className="font-medium text-sm">${Number(plan.minInvestment).toLocaleString()}</p>
                        </div>
                        <div className="rounded-md bg-muted/40 p-3">
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-medium text-sm">{plan.durationDays} days</p>
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => openInvestDialog(plan)} data-testid={`button-invest-${plan.id}`}>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Invest Now
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                <TrendingUp className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground">No investment plans available at the moment</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-investments" className="mt-4">
          {investmentsLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="h-48 animate-pulse rounded-md bg-muted" />
              </CardContent>
            </Card>
          ) : myInvestments && myInvestments.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Plan</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Amount</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Current Value</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Profit/Loss</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Maturity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myInvestments.map((inv) => {
                        const profitNum = Number(inv.profit);
                        const isPositive = profitNum >= 0;
                        return (
                          <tr key={inv.id} className="border-b last:border-b-0" data-testid={`row-investment-${inv.id}`}>
                            <td className="p-4 text-sm font-medium" data-testid={`text-plan-name-${inv.id}`}>{inv.planId}</td>
                            <td className="p-4 text-sm font-mono" data-testid={`text-amount-${inv.id}`}>${Number(inv.amount).toLocaleString()}</td>
                            <td className="p-4 text-sm font-mono" data-testid={`text-current-value-${inv.id}`}>${Number(inv.currentValue).toLocaleString()}</td>
                            <td className={`p-4 text-sm font-mono ${isPositive ? "text-emerald-500" : "text-red-500"}`} data-testid={`text-profit-${inv.id}`}>
                              {isPositive ? "+" : ""}${profitNum.toLocaleString()}
                            </td>
                            <td className="p-4">
                              <Badge variant="secondary" className={`text-xs ${getStatusColor(inv.status)}`} data-testid={`badge-status-${inv.id}`}>
                                {inv.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground" data-testid={`text-maturity-${inv.id}`}>
                              {inv.maturityDate ? new Date(inv.maturityDate).toLocaleDateString() : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                <PiggyBank className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground">You have no investments yet</p>
                <p className="text-xs text-muted-foreground">Browse available plans to start investing</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={investOpen} onOpenChange={setInvestOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invest in {selectedPlan?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Investment Amount ($)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                data-testid="input-invest-amount"
              />
              <p className="text-xs text-muted-foreground">
                Min: ${selectedPlan && Number(selectedPlan.minInvestment).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[1000, 5000, 10000, 25000].map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  onClick={() => setInvestAmount(String(amt))}
                  data-testid={`button-amount-${amt}`}
                >
                  ${amt.toLocaleString()}
                </Button>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => investMutation.mutate()}
              disabled={investMutation.isPending}
              data-testid="button-confirm-invest"
            >
              {investMutation.isPending ? "Processing..." : "Confirm Investment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}