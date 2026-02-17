import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Gift, Percent, Clock } from "lucide-react";

const offers = [
  { title: "Welcome Bonus", description: "Get 30% bonus on your first deposit above $500", type: "Bonus", status: "Active", expiry: "Mar 31, 2026" },
  { title: "Referral Reward", description: "Earn $50 for every friend you refer who deposits $200+", type: "Referral", status: "Active", expiry: "Ongoing" },
  { title: "Loyalty Cashback", description: "Trade 50+ lots per month and receive 10% cashback on spreads", type: "Cashback", status: "Active", expiry: "Ongoing" },
  { title: "Swap-Free Promotion", description: "Zero swap fees on all major pairs for new accounts", type: "Promotion", status: "Expired", expiry: "Jan 31, 2026" },
];

export default function OffersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Offers</h1>
        <p className="text-sm text-muted-foreground">Special promotions and bonuses available to you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base">{offer.title}</CardTitle>
                <Badge variant={offer.status === "Active" ? "default" : "secondary"} data-testid={`badge-offer-status-${i}`}>
                  {offer.status}
                </Badge>
              </div>
              <Gift className="w-5 h-5 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{offer.description}</p>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{offer.expiry}</span>
                </div>
                <Button size="sm" disabled={offer.status !== "Active"} data-testid={`button-claim-offer-${i}`}>
                  {offer.status === "Active" ? "Claim Offer" : "Expired"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
