import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Trophy, Zap, Target } from "lucide-react";
import type { PropChallenge, PropAccount } from "@shared/schema";

export default function PropTradingPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("challenges");

  const { data: challenges, isLoading: challengesLoading } = useQuery<PropChallenge[]>({
    queryKey: ["/api/prop/challenges"],
  });

  const { data: propAccounts, isLoading: accountsLoading } = useQuery<PropAccount[]>({
    queryKey: ["/api/prop/accounts"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      return apiRequest("POST", "/api/prop/accounts", { challengeId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prop/accounts"] });
      toast({ title: "Challenge purchased successfully!" });
    },
    onError: () => {
      toast({ title: "Purchase failed", variant: "destructive" });
    },
  });

  const getChallengeName = (challengeId: string) => {
    const challenge = challenges?.find((c) => c.id === challengeId);
    return challenge?.name ?? "Unknown Challenge";
  };

  const getPhaseLabel = (phase: number, status: string) => {
    if (status === "funded") return "Funded";
    return `Phase ${phase}`;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default" as const;
      case "funded":
        return "default" as const;
      case "failed":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-prop-title">Prop Trading</h1>
          <p className="text-sm text-muted-foreground">Get funded and trade with our capital</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="challenges" data-testid="tab-challenges">
            <Target className="w-4 h-4 mr-2" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="accounts" data-testid="tab-accounts">
            <Trophy className="w-4 h-4 mr-2" />
            My Accounts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="mt-4">
          {challengesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-5 bg-muted rounded w-1/3" />
                      <div className="h-8 bg-muted rounded w-1/2" />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-16 bg-muted rounded" />
                        <div className="h-16 bg-muted rounded" />
                        <div className="h-16 bg-muted rounded" />
                        <div className="h-16 bg-muted rounded" />
                      </div>
                      <div className="h-9 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : challenges && challenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id} data-testid={`card-challenge-${challenge.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-lg">{challenge.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{challenge.phases} Phases</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold tracking-tight">${Number(challenge.accountSize).toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Account Size</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-md bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">Profit Target</p>
                        <p className="font-medium text-sm">{challenge.profitTarget}%</p>
                      </div>
                      <div className="rounded-md bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">Daily Drawdown</p>
                        <p className="font-medium text-sm">{challenge.maxDailyDrawdown}%</p>
                      </div>
                      <div className="rounded-md bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">Max Drawdown</p>
                        <p className="font-medium text-sm">{challenge.maxTotalDrawdown}%</p>
                      </div>
                      <div className="rounded-md bg-muted/40 p-3">
                        <p className="text-xs text-muted-foreground">Profit Split</p>
                        <p className="font-medium text-sm">{challenge.profitSplit}%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                      <span>Leverage: {challenge.leverage}</span>
                      <span>{challenge.minTradingDays}-{challenge.maxTradingDays} trading days</span>
                    </div>
                    <Button className="w-full" onClick={() => purchaseMutation.mutate(challenge.id)} disabled={purchaseMutation.isPending} data-testid={`button-purchase-${challenge.id}`}>
                      <Zap className="w-4 h-4 mr-2" />
                      Purchase - ${Number(challenge.price).toFixed(0)}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center gap-2">
                  <Target className="w-8 h-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No challenges available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="accounts" className="mt-4">
          {accountsLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-muted rounded" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : propAccounts && propAccounts.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="table-prop-accounts">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Account</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Challenge</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phase</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Balance</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Profit</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Start Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {propAccounts.map((account) => (
                        <tr key={account.id} className="border-b last:border-0" data-testid={`row-account-${account.id}`}>
                          <td className="py-3 px-4 font-mono text-xs">{account.accountNumber}</td>
                          <td className="py-3 px-4">{getChallengeName(account.challengeId)}</td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary" className="text-xs">
                              {getPhaseLabel(account.currentPhase, account.status)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getStatusVariant(account.status)} className="text-xs capitalize">
                              {account.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            ${Number(account.currentBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={Number(account.currentProfit) >= 0 ? "text-emerald-500" : "text-red-400"}>
                              {Number(account.currentProfit) >= 0 ? "+" : ""}${Number(account.currentProfit).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {account.startDate ? new Date(account.startDate).toLocaleDateString() : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center gap-2">
                  <Trophy className="w-8 h-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No prop accounts yet</p>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("challenges")} data-testid="button-browse-challenges">
                    Browse Challenges
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
