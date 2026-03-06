import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeftRight,
  Settings,
  BarChart3,
  Shield,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

type TradeStatus = "Open" | "In Escrow" | "Completed" | "Disputed" | "Cancelled";

interface P2PTrade {
  id: string;
  buyer: string;
  seller: string;
  crypto: string;
  amount: string;
  fiatAmount: string;
  paymentMethod: string;
  status: TradeStatus;
  created: string;
}

const initialTrades: P2PTrade[] = [
  { id: "P2P-1001", buyer: "Alice Johnson", seller: "Bob Smith", crypto: "BTC", amount: "0.05", fiatAmount: "$3,361.73", paymentMethod: "Bank Transfer", status: "In Escrow", created: "2024-01-15 14:30" },
  { id: "P2P-1002", buyer: "Charlie Lee", seller: "Diana Ross", crypto: "ETH", amount: "2.5", fiatAmount: "$8,641.95", paymentMethod: "PayPal", status: "Open", created: "2024-01-15 13:15" },
  { id: "P2P-1003", buyer: "Eve Wilson", seller: "Frank Chen", crypto: "USDT", amount: "5000", fiatAmount: "$5,000.00", paymentMethod: "Wise", status: "Completed", created: "2024-01-14 09:45" },
  { id: "P2P-1004", buyer: "Grace Kim", seller: "Henry Wang", crypto: "BTC", amount: "0.1", fiatAmount: "$6,723.45", paymentMethod: "Bank Transfer", status: "Disputed", created: "2024-01-14 16:20" },
  { id: "P2P-1005", buyer: "Ivan Petrov", seller: "Julia Adams", crypto: "SOL", amount: "50", fiatAmount: "$8,945.00", paymentMethod: "Skrill", status: "In Escrow", created: "2024-01-13 11:00" },
  { id: "P2P-1006", buyer: "Karen Li", seller: "Leo Brown", crypto: "ETH", amount: "1.0", fiatAmount: "$3,456.78", paymentMethod: "Cash", status: "Cancelled", created: "2024-01-13 08:30" },
  { id: "P2P-1007", buyer: "Mike Davis", seller: "Nina Patel", crypto: "USDT", amount: "2500", fiatAmount: "$2,500.00", paymentMethod: "Bank Transfer", status: "Completed", created: "2024-01-12 15:45" },
  { id: "P2P-1008", buyer: "Oscar Green", seller: "Paula White", crypto: "BNB", amount: "10", fiatAmount: "$5,984.50", paymentMethod: "PayPal", status: "Disputed", created: "2024-01-12 10:15" },
  { id: "P2P-1009", buyer: "Quinn Taylor", seller: "Rachel Moore", crypto: "BTC", amount: "0.02", fiatAmount: "$1,344.69", paymentMethod: "Wise", status: "Open", created: "2024-01-11 17:30" },
  { id: "P2P-1010", buyer: "Sam Harris", seller: "Tina Clark", crypto: "USDC", amount: "1000", fiatAmount: "$1,000.00", paymentMethod: "Bank Transfer", status: "Completed", created: "2024-01-11 12:00" },
];

const statusVariant: Record<TradeStatus, "default" | "secondary" | "destructive" | "outline"> = {
  "Open": "outline",
  "In Escrow": "secondary",
  "Completed": "default",
  "Disputed": "destructive",
  "Cancelled": "secondary",
};

const paymentMethods = ["Bank Transfer", "PayPal", "Wise", "Skrill", "Cash"];

export default function P2PManagementPage() {
  const { toast } = useToast();
  const [trades, setTrades] = useState<P2PTrade[]>(initialTrades);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<P2PTrade | null>(null);
  const [resolution, setResolution] = useState<string>("buyer");

  const [settings, setSettings] = useState({
    p2pEnabled: true,
    escrowTimeout: "24",
    minTradeAmount: "10",
    maxTradeAmount: "50000",
    disputeAutoResolution: "7",
    supportedPayments: ["Bank Transfer", "PayPal", "Wise", "Skrill", "Cash"] as string[],
  });

  const togglePayment = (method: string) => {
    setSettings((prev) => ({
      ...prev,
      supportedPayments: prev.supportedPayments.includes(method)
        ? prev.supportedPayments.filter((m) => m !== method)
        : [...prev.supportedPayments, method],
    }));
  };

  const updateTradeStatus = (tradeId: string, newStatus: TradeStatus) => {
    setTrades((prev) => prev.map((t) => (t.id === tradeId ? { ...t, status: newStatus } : t)));
  };

  const handleReleaseEscrow = (trade: P2PTrade) => {
    updateTradeStatus(trade.id, "Completed");
    toast({ title: "Escrow released", description: `Trade ${trade.id} has been completed.` });
  };

  const handleCancel = (trade: P2PTrade) => {
    updateTradeStatus(trade.id, "Cancelled");
    toast({ title: "Trade cancelled", description: `Trade ${trade.id} has been cancelled.` });
  };

  const handleOpenDispute = (trade: P2PTrade) => {
    updateTradeStatus(trade.id, "Disputed");
    toast({ title: "Dispute opened", description: `Trade ${trade.id} is now in dispute.`, variant: "destructive" });
  };

  const handleResolveClick = (trade: P2PTrade) => {
    setSelectedTrade(trade);
    setResolution("buyer");
    setResolveDialogOpen(true);
  };

  const handleResolveDispute = () => {
    if (!selectedTrade) return;
    updateTradeStatus(selectedTrade.id, "Completed");
    toast({
      title: "Dispute resolved",
      description: `Trade ${selectedTrade.id} resolved in favor of the ${resolution}.`,
    });
    setResolveDialogOpen(false);
    setSelectedTrade(null);
  };

  const activeTrades = trades.filter((t) => t.status === "Open" || t.status === "In Escrow").length;
  const disputedTrades = trades.filter((t) => t.status === "Disputed");
  const completedTrades = trades.filter((t) => t.status === "Completed").length;
  const totalVolume = "$47,857.10";
  const completionRate = trades.length > 0 ? ((completedTrades / trades.length) * 100).toFixed(1) : "0";

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="rounded-md bg-gradient-to-r from-violet-600 to-purple-500 p-6">
        <div className="flex items-center gap-3 flex-wrap">
          <ArrowLeftRight className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white" data-testid="text-p2p-management-title">
              P2P Exchange Management
            </h1>
            <p className="text-violet-100 text-sm">
              Manage peer-to-peer trading, escrow, and dispute resolution
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="stat-total-volume">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Total P2P Volume</p>
                <p className="text-xl font-bold" data-testid="text-total-volume">{totalVolume}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-active-trades">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Active Trades</p>
                <p className="text-xl font-bold" data-testid="text-active-trades">{activeTrades}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-disputes">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <AlertTriangle className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Disputes</p>
                <p className="text-xl font-bold" data-testid="text-disputes">{disputedTrades.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-completion-rate">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <CheckCircle className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
                <p className="text-xl font-bold" data-testid="text-completion-rate">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="settings">
            <div className="border-b px-4 pt-2">
              <TabsList>
                <TabsTrigger value="settings" data-testid="tab-p2p-settings">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </TabsTrigger>
                <TabsTrigger value="trades" data-testid="tab-p2p-trades">
                  <BarChart3 className="w-4 h-4 mr-2" /> Active Trades
                </TabsTrigger>
                <TabsTrigger value="disputes" data-testid="tab-p2p-disputes">
                  <Shield className="w-4 h-4 mr-2" /> Dispute Resolution
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="settings" className="p-6 space-y-6">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Enable P2P Trading</p>
                    <p className="text-xs text-muted-foreground">Allow users to trade crypto peer-to-peer</p>
                  </div>
                  <Switch
                    checked={settings.p2pEnabled}
                    onCheckedChange={(v) => setSettings({ ...settings, p2pEnabled: v })}
                    data-testid="switch-p2p-enabled"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Escrow Timeout (hours)</Label>
                    <Input
                      type="number"
                      value={settings.escrowTimeout}
                      onChange={(e) => setSettings({ ...settings, escrowTimeout: e.target.value })}
                      data-testid="input-escrow-timeout"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dispute Auto-resolution (days)</Label>
                    <Input
                      type="number"
                      value={settings.disputeAutoResolution}
                      onChange={(e) => setSettings({ ...settings, disputeAutoResolution: e.target.value })}
                      data-testid="input-dispute-auto-resolution"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Min Trade Amount ($)</Label>
                    <Input
                      type="number"
                      value={settings.minTradeAmount}
                      onChange={(e) => setSettings({ ...settings, minTradeAmount: e.target.value })}
                      data-testid="input-min-trade-amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Trade Amount ($)</Label>
                    <Input
                      type="number"
                      value={settings.maxTradeAmount}
                      onChange={(e) => setSettings({ ...settings, maxTradeAmount: e.target.value })}
                      data-testid="input-max-trade-amount"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Supported Payment Methods</Label>
                  <div className="flex items-center gap-4 flex-wrap">
                    {paymentMethods.map((method) => (
                      <div key={method} className="flex items-center gap-2">
                        <Checkbox
                          checked={settings.supportedPayments.includes(method)}
                          onCheckedChange={() => togglePayment(method)}
                          data-testid={`checkbox-payment-${method.toLowerCase().replace(/\s+/g, "-")}`}
                        />
                        <span className="text-sm">{method}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => toast({ title: "P2P settings saved", description: "Configuration updated successfully." })}
                data-testid="button-save-p2p-settings"
              >
                <Settings className="w-4 h-4 mr-2" />
                Save P2P Settings
              </Button>
            </TabsContent>

            <TabsContent value="trades" className="p-6 space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trade ID</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Crypto</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Fiat Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id} data-testid={`row-trade-${trade.id}`}>
                        <TableCell className="font-medium" data-testid={`text-trade-id-${trade.id}`}>{trade.id}</TableCell>
                        <TableCell data-testid={`text-buyer-${trade.id}`}>{trade.buyer}</TableCell>
                        <TableCell data-testid={`text-seller-${trade.id}`}>{trade.seller}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" data-testid={`badge-crypto-${trade.id}`}>{trade.crypto}</Badge>
                        </TableCell>
                        <TableCell data-testid={`text-amount-${trade.id}`}>{trade.amount}</TableCell>
                        <TableCell data-testid={`text-fiat-${trade.id}`}>{trade.fiatAmount}</TableCell>
                        <TableCell data-testid={`text-payment-${trade.id}`}>{trade.paymentMethod}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[trade.status]} data-testid={`badge-status-${trade.id}`}>
                            {trade.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground" data-testid={`text-created-${trade.id}`}>{trade.created}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 flex-wrap">
                            {trade.status === "In Escrow" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReleaseEscrow(trade)}
                                data-testid={`button-release-${trade.id}`}
                              >
                                Release
                              </Button>
                            )}
                            {(trade.status === "Open" || trade.status === "In Escrow") && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCancel(trade)}
                                  data-testid={`button-cancel-${trade.id}`}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleOpenDispute(trade)}
                                  data-testid={`button-dispute-${trade.id}`}
                                >
                                  Dispute
                                </Button>
                              </>
                            )}
                            {trade.status === "Disputed" && (
                              <Button
                                size="sm"
                                onClick={() => handleResolveClick(trade)}
                                data-testid={`button-resolve-${trade.id}`}
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="disputes" className="p-6 space-y-4">
              <h3 className="text-lg font-semibold" data-testid="text-disputes-title">Disputed Trades</h3>
              {disputedTrades.length === 0 ? (
                <p className="text-sm text-muted-foreground" data-testid="text-no-disputes">No active disputes.</p>
              ) : (
                <div className="space-y-4">
                  {disputedTrades.map((trade) => (
                    <Card key={trade.id} data-testid={`card-dispute-${trade.id}`}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                            <span className="font-semibold">{trade.id}</span>
                            <Badge variant="destructive">Disputed</Badge>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleResolveClick(trade)}
                            data-testid={`button-resolve-dispute-${trade.id}`}
                          >
                            Resolve Dispute
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Buyer</p>
                            <p className="font-medium">{trade.buyer}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Seller</p>
                            <p className="font-medium">{trade.seller}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Crypto</p>
                            <p className="font-medium">{trade.amount} {trade.crypto}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Fiat Amount</p>
                            <p className="font-medium">{trade.fiatAmount}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Payment Method</p>
                            <p className="font-medium">{trade.paymentMethod}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Created</p>
                            <p className="font-medium">{trade.created}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent data-testid="dialog-resolve-dispute">
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              Choose how to resolve trade {selectedTrade?.id}. Funds will be awarded to the selected party.
            </DialogDescription>
          </DialogHeader>
          {selectedTrade && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Buyer</p>
                  <p className="font-medium">{selectedTrade.buyer}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Seller</p>
                  <p className="font-medium">{selectedTrade.seller}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Amount</p>
                  <p className="font-medium">{selectedTrade.amount} {selectedTrade.crypto}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Fiat</p>
                  <p className="font-medium">{selectedTrade.fiatAmount}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Award funds to</Label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger data-testid="select-resolution">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer - {selectedTrade.buyer}</SelectItem>
                    <SelectItem value="seller">Seller - {selectedTrade.seller}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)} data-testid="button-cancel-resolve">
              Cancel
            </Button>
            <Button onClick={handleResolveDispute} data-testid="button-confirm-resolve">
              Confirm Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
