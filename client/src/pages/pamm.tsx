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
import { Landmark } from "lucide-react";
import type { PammManager, PammInvestment } from "@shared/schema";

function getRiskColor(riskLevel: string) {
  switch (riskLevel?.toLowerCase()) {
    case "low":
      return "text-emerald-500";
    case "medium":
      return "text-amber-500";
    case "high":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

export default function PammPage() {
  const { toast } = useToast();
  const [investOpen, setInvestOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<PammManager | null>(null);
  const [investAmount, setInvestAmount] = useState("");

  const { data: managers } = useQuery<PammManager[]>({ queryKey: ["/api/pamm/managers"] });
  const { data: myInvestments } = useQuery<PammInvestment[]>({ queryKey: ["/api/pamm/investments"] });

  const investMutation = useMutation({
    mutationFn: async () => apiRequest("POST", "/api/pamm/investments", { managerId: selectedManager!.id, amount: investAmount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pamm/investments"] });
      toast({ title: "Investment created!" });
      setInvestOpen(false);
    },
    onError: () => toast({ title: "Investment failed", variant: "destructive" }),
  });

  function openInvestDialog(manager: PammManager) {
    setSelectedManager(manager);
    setInvestAmount("");
    setInvestOpen(true);
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-pamm-title">PAMM</h1>
          <p className="text-sm text-muted-foreground">Invest with professional money managers</p>
        </div>
      </div>

      <Tabs defaultValue="managers">
        <TabsList>
          <TabsTrigger value="managers" data-testid="tab-fund-managers">Fund Managers</TabsTrigger>
          <TabsTrigger value="investments" data-testid="tab-my-investments">My Investments</TabsTrigger>
        </TabsList>

        <TabsContent value="managers" className="mt-4">
          {managers && managers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {managers.map((manager) => {
                const riskColor = getRiskColor(manager.riskLevel);
                return (
                  <Card key={manager.id} data-testid={`card-pamm-manager-${manager.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                            <Landmark className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{manager.displayName}</CardTitle>
                            <p className="text-xs text-muted-foreground">{manager.strategy}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className={`text-xs ${riskColor}`}>{manager.riskLevel}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{manager.description}</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-md bg-muted/40 p-3 text-center">
                          <p className="text-xs text-muted-foreground">Total Return</p>
                          <p className="font-bold text-sm text-emerald-500">+{manager.totalReturn}%</p>
                        </div>
                        <div className="rounded-md bg-muted/40 p-3 text-center">
                          <p className="text-xs text-muted-foreground">Monthly</p>
                          <p className="font-bold text-sm">+{manager.monthlyReturn}%</p>
                        </div>
                        <div className="rounded-md bg-muted/40 p-3 text-center">
                          <p className="text-xs text-muted-foreground">AUM</p>
                          <p className="font-bold text-sm">${(Number(manager.totalAum) / 1000000).toFixed(1)}M</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-md bg-muted/40 p-3">
                          <p className="text-xs text-muted-foreground">Performance Fee</p>
                          <p className="font-medium text-sm">{manager.performanceFee}%</p>
                        </div>
                        <div className="rounded-md bg-muted/40 p-3">
                          <p className="text-xs text-muted-foreground">Management Fee</p>
                          <p className="font-medium text-sm">{manager.managementFee}%</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                        <span>{manager.investors} investors</span>
                        <span>Min: ${Number(manager.minInvestment).toLocaleString()}</span>
                      </div>
                      <Button className="w-full" onClick={() => openInvestDialog(manager)} data-testid={`button-pamm-invest-${manager.id}`}>
                        <Landmark className="w-4 h-4 mr-2" />
                        Invest Now
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Landmark className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No fund managers available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="investments" className="mt-4">
          {myInvestments && myInvestments.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Manager</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Invested</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Current Value</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Profit</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Share %</th>
                        <th className="text-left p-4 text-xs font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myInvestments.map((inv) => {
                        const managerName = managers?.find((m) => m.id === inv.managerId)?.displayName ?? "Unknown";
                        const profit = Number(inv.profit);
                        return (
                          <tr key={inv.id} className="border-b last:border-0" data-testid={`row-pamm-investment-${inv.id}`}>
                            <td className="p-4 text-sm font-medium">{managerName}</td>
                            <td className="p-4 text-sm font-mono">${Number(inv.amount).toLocaleString()}</td>
                            <td className="p-4 text-sm font-mono">${Number(inv.currentValue).toLocaleString()}</td>
                            <td className={`p-4 text-sm font-mono ${profit >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                              {profit >= 0 ? "+" : ""}${profit.toLocaleString()}
                            </td>
                            <td className="p-4 text-sm">{inv.sharePercentage}%</td>
                            <td className="p-4">
                              <Badge variant="secondary" className="text-xs">{inv.status}</Badge>
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
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Landmark className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No PAMM investments yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={investOpen} onOpenChange={setInvestOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invest in {selectedManager?.displayName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Investment Amount ($)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                data-testid="input-pamm-amount"
              />
              <p className="text-xs text-muted-foreground">
                Min: ${selectedManager && Number(selectedManager.minInvestment).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[5000, 10000, 25000, 50000].map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  onClick={() => setInvestAmount(String(amt))}
                  data-testid={`button-pamm-amount-${amt}`}
                >
                  ${amt.toLocaleString()}
                </Button>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={() => investMutation.mutate()}
              disabled={investMutation.isPending}
              data-testid="button-confirm-pamm"
            >
              {investMutation.isPending ? "Processing..." : "Confirm Investment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
