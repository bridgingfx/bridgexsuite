import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Gift, ArrowUpRight, Trophy } from "lucide-react";

export default function LoyaltyPointsPage() {
  const points = 2450;
  const tier = "Silver";
  const nextTier = "Gold";
  const pointsToNext = 550;

  const rewards = [
    { name: "Reduced Spreads", points: 500, description: "Get tighter spreads on all major pairs for 30 days" },
    { name: "Free VPS", points: 1000, description: "One month of free VPS hosting for your EAs" },
    { name: "Cash Bonus", points: 2000, description: "$50 cash bonus credited to your trading wallet" },
    { name: "Premium Signals", points: 3000, description: "30 days of premium trading signals access" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Loyalty Points</h1>
        <p className="text-sm text-muted-foreground">Earn points through trading and redeem for rewards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Your Points</CardTitle>
            <Star className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-points">{points.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Tier</CardTitle>
            <Trophy className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-current-tier">{tier}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Tier</CardTitle>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-next-tier">{nextTier}</div>
            <p className="text-xs text-muted-foreground mt-1">{pointsToNext} points to go</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Available Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-base">{reward.name}</CardTitle>
                <Badge variant="secondary">{reward.points} pts</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{reward.description}</p>
                <Button size="sm" disabled={points < reward.points} data-testid={`button-redeem-${i}`}>
                  <Gift className="w-4 h-4 mr-2" />
                  Redeem
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
