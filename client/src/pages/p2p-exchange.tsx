import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Shield, Clock, DollarSign } from "lucide-react";

const orders = [
  { trader: "Trader_A1", type: "Buy", currency: "USDT", price: "$1.00", minMax: "$100 - $5,000", method: "Bank Transfer", completionRate: "98.5%" },
  { trader: "Trader_B2", type: "Sell", currency: "USDT", price: "$1.00", minMax: "$50 - $2,000", method: "Card Payment", completionRate: "96.2%" },
  { trader: "Trader_C3", type: "Buy", currency: "BTC", price: "$67,450", minMax: "$500 - $10,000", method: "Wire Transfer", completionRate: "99.1%" },
  { trader: "Trader_D4", type: "Sell", currency: "ETH", price: "$3,250", minMax: "$200 - $8,000", method: "Bank Transfer", completionRate: "97.8%" },
];

export default function P2PExchangePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">P2P Exchange</h1>
          <p className="text-sm text-muted-foreground">Peer-to-peer cryptocurrency exchange</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" data-testid="button-my-orders">My Orders</Button>
          <Button data-testid="button-create-order">Create Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-orders">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Trades</CardTitle>
            <Shield className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-completed-trades">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-volume">$0.00</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Trader</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Currency</th>
                  <th className="pb-2 font-medium">Price</th>
                  <th className="pb-2 font-medium">Limit</th>
                  <th className="pb-2 font-medium">Method</th>
                  <th className="pb-2 font-medium">Rate</th>
                  <th className="pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 font-medium">{order.trader}</td>
                    <td className="py-3">
                      <Badge variant={order.type === "Buy" ? "default" : "secondary"}>{order.type}</Badge>
                    </td>
                    <td className="py-3">{order.currency}</td>
                    <td className="py-3">{order.price}</td>
                    <td className="py-3 text-muted-foreground">{order.minMax}</td>
                    <td className="py-3 text-muted-foreground">{order.method}</td>
                    <td className="py-3 text-muted-foreground">{order.completionRate}</td>
                    <td className="py-3">
                      <Button size="sm" data-testid={`button-trade-${i}`}>Trade</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
