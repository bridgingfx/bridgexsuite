import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Users, Square } from "lucide-react";
import type { SignalProvider, CopyRelationship } from "@shared/schema";

function riskBadgeColor(score: number): string {
  if (score <= 3) return "bg-emerald-500/10 text-emerald-500";
  if (score <= 6) return "bg-amber-500/10 text-amber-500";
  return "bg-red-500/10 text-red-500";
}

export default function CopyTradingPage() {
  const { toast } = useToast();
  const [copyOpen, setCopyOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<SignalProvider | null>(null);
  const [copyAmount, setCopyAmount] = useState("");

  const { data: providers } = useQuery<SignalProvider[]>({ queryKey: ["/api/copy/providers"] });
  const { data: myRelationships } = useQuery<CopyRelationship[]>({ queryKey: ["/api/copy/relationships"] });

  const copyMutation = useMutation({
    mutationFn: async () => apiRequest("POST", "/api/copy/relationships", { providerId: selectedProvider!.id, allocatedAmount: copyAmount }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/copy/relationships"] }); toast({ title: "Now copying!" }); setCopyOpen(false); },
    onError: () => toast({ title: "Failed", variant: "destructive" }),
  });

  const stopMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("PATCH", `/api/copy/relationships/${id}`, { status: "stopped" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/copy/relationships"] }); toast({ title: "Stopped copying" }); },
  });

  function openCopyDialog(provider: SignalProvider) {
    setSelectedProvider(provider);
    setCopyAmount("");
    setCopyOpen(true);
  }

  function getInitials(name: string): string {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  }

  function getProviderName(providerId: string): string {
    const provider = providers?.find(p => p.id === providerId);
    return provider?.displayName ?? "Unknown";
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-copy-title">Copy Trading</h1>
          <p className="text-sm text-muted-foreground">Follow top traders and copy their strategies automatically</p>
        </div>
      </div>

      <Tabs defaultValue="providers">
        <TabsList>
          <TabsTrigger value="providers" data-testid="tab-signal-providers">Signal Providers</TabsTrigger>
          <TabsTrigger value="copies" data-testid="tab-my-copies">My Copies</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers?.map(provider => (
              <Card key={provider.id} data-testid={`card-provider-${provider.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">{getInitials(provider.displayName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{provider.displayName}</CardTitle>
                        <p className="text-xs text-muted-foreground">{provider.strategy}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`text-xs ${riskBadgeColor(provider.riskScore)}`}>
                      Risk: {provider.riskScore}/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-md bg-muted/40 p-3 text-center">
                      <p className="text-xs text-muted-foreground">Return</p>
                      <p className="font-bold text-sm text-emerald-500" data-testid={`text-return-${provider.id}`}>+{provider.totalReturn}%</p>
                    </div>
                    <div className="rounded-md bg-muted/40 p-3 text-center">
                      <p className="text-xs text-muted-foreground">Win Rate</p>
                      <p className="font-bold text-sm" data-testid={`text-winrate-${provider.id}`}>{provider.winRate}%</p>
                    </div>
                    <div className="rounded-md bg-muted/40 p-3 text-center">
                      <p className="text-xs text-muted-foreground">Trades</p>
                      <p className="font-bold text-sm" data-testid={`text-trades-${provider.id}`}>{provider.totalTrades}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                    <span>{provider.followers} followers</span>
                    <span>${Number(provider.monthlyFee).toFixed(0)}/month</span>
                  </div>
                  <Button className="w-full" onClick={() => openCopyDialog(provider)} data-testid={`button-copy-${provider.id}`}>
                    <Users className="w-4 h-4 mr-2" />
                    Start Copying
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {providers && providers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="w-10 h-10 mb-3" />
              <p className="text-sm">No signal providers available</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="copies" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {myRelationships && myRelationships.length > 0 ? (
                <div className="divide-y">
                  {myRelationships.map(rel => {
                    const pnl = Number(rel.currentPnl);
                    return (
                      <div key={rel.id} className="flex items-center justify-between gap-4 flex-wrap p-4" data-testid={`row-copy-${rel.id}`}>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="font-medium text-sm" data-testid={`text-provider-name-${rel.id}`}>{getProviderName(rel.providerId)}</span>
                          <span className="font-mono text-sm" data-testid={`text-allocated-${rel.id}`}>${Number(rel.allocatedAmount).toLocaleString()}</span>
                          <span className={`font-mono text-sm ${pnl >= 0 ? "text-emerald-500" : "text-red-500"}`} data-testid={`text-pnl-${rel.id}`}>
                            {pnl >= 0 ? "+" : ""}{pnl.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground" data-testid={`text-copied-trades-${rel.id}`}>{rel.totalCopiedTrades} trades</span>
                          <Badge variant="secondary" className="text-xs" data-testid={`badge-status-${rel.id}`}>{rel.status}</Badge>
                        </div>
                        {rel.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => stopMutation.mutate(rel.id)}
                            disabled={stopMutation.isPending}
                            data-testid={`button-stop-${rel.id}`}
                          >
                            <Square className="w-4 h-4 mr-2" />
                            Stop Copying
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Users className="w-10 h-10 mb-3" />
                  <p className="text-sm">Not copying anyone yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={copyOpen} onOpenChange={setCopyOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Copy {selectedProvider?.displayName}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Allocation Amount ($)</Label>
              <Input type="number" placeholder="Enter amount" value={copyAmount} onChange={e => setCopyAmount(e.target.value)} data-testid="input-copy-amount" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {[500, 1000, 5000, 10000].map(amt => (
                <Button key={amt} variant="outline" size="sm" onClick={() => setCopyAmount(String(amt))} data-testid={`button-copy-amount-${amt}`}>
                  ${amt.toLocaleString()}
                </Button>
              ))}
            </div>
            <Button className="w-full" onClick={() => copyMutation.mutate()} disabled={copyMutation.isPending} data-testid="button-confirm-copy">
              {copyMutation.isPending ? "Processing..." : "Start Copying"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
