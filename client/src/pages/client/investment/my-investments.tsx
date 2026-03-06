import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Briefcase,
  Eye,
  RefreshCw,
  ArrowDownToLine,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Gem,
  Bitcoin,
  Banknote,
} from "lucide-react";

const demoInvestments = [
  {
    id: "inv-1",
    productName: "Gold Saver Plan",
    assetType: "Gold",
    investmentAmount: 5000,
    lockInPeriod: "12 months",
    monthlyROI: 2.5,
    currentProfit: 1250,
    status: "Active",
    startDate: "2024-06-15",
    maturityDate: "2025-06-15",
    totalValue: 6250,
    description: "Low-risk gold savings plan with steady monthly returns. Capital preserved in physical gold reserves.",
  },
  {
    id: "inv-2",
    productName: "BTC Growth Plan",
    assetType: "Crypto",
    investmentAmount: 10000,
    lockInPeriod: "6 months",
    monthlyROI: 4.2,
    currentProfit: 2520,
    status: "Active",
    startDate: "2024-09-01",
    maturityDate: "2025-03-01",
    totalValue: 12520,
    description: "Bitcoin-focused growth fund with actively managed positions and DCA strategy.",
  },
  {
    id: "inv-3",
    productName: "USD Income Plan",
    assetType: "Currency",
    investmentAmount: 8000,
    lockInPeriod: "3 months",
    monthlyROI: 1.8,
    currentProfit: 432,
    status: "Matured",
    startDate: "2024-08-01",
    maturityDate: "2024-11-01",
    totalValue: 8432,
    description: "Stable USD-denominated income plan with guaranteed monthly distributions.",
  },
  {
    id: "inv-4",
    productName: "Gold Premium Plan",
    assetType: "Gold",
    investmentAmount: 25000,
    lockInPeriod: "24 months",
    monthlyROI: 3.5,
    currentProfit: 8750,
    status: "Locked",
    startDate: "2024-03-10",
    maturityDate: "2026-03-10",
    totalValue: 33750,
    description: "Premium gold investment with higher allocation in bullion and gold ETFs for enhanced returns.",
  },
  {
    id: "inv-5",
    productName: "Crypto Index Fund",
    assetType: "Crypto",
    investmentAmount: 3000,
    lockInPeriod: "6 months",
    monthlyROI: 3.8,
    currentProfit: -420,
    status: "Active",
    startDate: "2024-11-15",
    maturityDate: "2025-05-15",
    totalValue: 2580,
    description: "Diversified crypto index tracking the top 20 cryptocurrencies by market cap.",
  },
  {
    id: "inv-6",
    productName: "Forex Alpha Strategy",
    assetType: "Currency",
    investmentAmount: 15000,
    lockInPeriod: "12 months",
    monthlyROI: 2.8,
    currentProfit: 3360,
    status: "Active",
    startDate: "2024-04-20",
    maturityDate: "2025-04-20",
    totalValue: 18360,
    description: "Algorithmic forex trading strategy targeting major currency pairs with risk-managed positions.",
  },
];

function getStatusVariant(status: string) {
  switch (status) {
    case "Active":
      return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
    case "Matured":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    case "Locked":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
  }
}

function getAssetIcon(assetType: string) {
  switch (assetType) {
    case "Gold":
      return <Gem className="h-4 w-4 text-amber-500" />;
    case "Crypto":
      return <Bitcoin className="h-4 w-4 text-orange-500" />;
    case "Currency":
      return <Banknote className="h-4 w-4 text-green-500" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
}

export default function MyInvestmentsPage() {
  const { toast } = useToast();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<typeof demoInvestments[0] | null>(null);

  const handleViewDetails = (investment: typeof demoInvestments[0]) => {
    setSelectedInvestment(investment);
    setDetailsOpen(true);
  };

  const handleReinvest = (investment: typeof demoInvestments[0]) => {
    toast({
      title: "Profit Reinvested",
      description: `$${Math.max(0, investment.currentProfit).toLocaleString()} from ${investment.productName} has been reinvested.`,
    });
  };

  const handleWithdrawal = (investment: typeof demoInvestments[0]) => {
    if (investment.status === "Locked") {
      toast({
        title: "Withdrawal Not Available",
        description: "This investment is still within its lock-in period.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Withdrawal Requested",
      description: `Withdrawal request for ${investment.productName} has been submitted.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        <Briefcase className="h-6 w-6 text-pink-500 dark:text-pink-400" />
        <h1 className="text-2xl font-bold" data-testid="text-page-title">My Investments</h1>
      </div>

      <Card data-testid="card-investments-table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="p-4 font-medium">Product Name</th>
                <th className="p-4 font-medium">Asset Type</th>
                <th className="p-4 font-medium">Investment Amount</th>
                <th className="p-4 font-medium">Lock-in Period</th>
                <th className="p-4 font-medium">Monthly ROI</th>
                <th className="p-4 font-medium">Current Profit</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {demoInvestments.map((inv) => (
                <tr key={inv.id} className="border-b last:border-b-0" data-testid={`row-investment-${inv.id}`}>
                  <td className="p-4 font-medium" data-testid={`text-product-name-${inv.id}`}>{inv.productName}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2" data-testid={`text-asset-type-${inv.id}`}>
                      {getAssetIcon(inv.assetType)}
                      <span>{inv.assetType}</span>
                    </div>
                  </td>
                  <td className="p-4" data-testid={`text-amount-${inv.id}`}>${inv.investmentAmount.toLocaleString()}</td>
                  <td className="p-4" data-testid={`text-lockin-${inv.id}`}>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{inv.lockInPeriod}</span>
                    </div>
                  </td>
                  <td className="p-4" data-testid={`text-roi-${inv.id}`}>{inv.monthlyROI}%</td>
                  <td className="p-4">
                    <span
                      className={`flex items-center gap-1 ${inv.currentProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                      data-testid={`text-profit-${inv.id}`}
                    >
                      {inv.currentProfit >= 0 ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      {inv.currentProfit >= 0 ? "+" : ""}${inv.currentProfit.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge className={`${getStatusVariant(inv.status)} no-default-hover-elevate no-default-active-elevate`} data-testid={`badge-status-${inv.id}`}>
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleViewDetails(inv)}
                        data-testid={`button-view-details-${inv.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleReinvest(inv)}
                        disabled={inv.currentProfit <= 0}
                        data-testid={`button-reinvest-${inv.id}`}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleWithdrawal(inv)}
                        disabled={inv.status === "Locked"}
                        data-testid={`button-withdraw-${inv.id}`}
                      >
                        <ArrowDownToLine className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle data-testid="text-dialog-title">Investment Details</DialogTitle>
          </DialogHeader>
          {selectedInvestment && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {getAssetIcon(selectedInvestment.assetType)}
                <div>
                  <p className="font-semibold text-lg" data-testid="text-detail-product">{selectedInvestment.productName}</p>
                  <p className="text-sm text-muted-foreground" data-testid="text-detail-asset-type">{selectedInvestment.assetType}</p>
                </div>
                <Badge className={`ml-auto ${getStatusVariant(selectedInvestment.status)} no-default-hover-elevate no-default-active-elevate`} data-testid="badge-detail-status">
                  {selectedInvestment.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground" data-testid="text-detail-description">{selectedInvestment.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Investment Amount</p>
                  <p className="font-semibold" data-testid="text-detail-amount">${selectedInvestment.investmentAmount.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Current Value</p>
                  <p className="font-semibold" data-testid="text-detail-value">${selectedInvestment.totalValue.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Current Profit</p>
                  <p className={`font-semibold ${selectedInvestment.currentProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`} data-testid="text-detail-profit">
                    {selectedInvestment.currentProfit >= 0 ? "+" : ""}${selectedInvestment.currentProfit.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Monthly ROI</p>
                  <p className="font-semibold" data-testid="text-detail-roi">{selectedInvestment.monthlyROI}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Lock-in Period</p>
                  <p className="font-semibold" data-testid="text-detail-lockin">{selectedInvestment.lockInPeriod}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-semibold" data-testid="text-detail-start">{selectedInvestment.startDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Maturity Date</p>
                  <p className="font-semibold" data-testid="text-detail-maturity">{selectedInvestment.maturityDate}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 flex-wrap">
                <Button
                  onClick={() => {
                    handleReinvest(selectedInvestment);
                    setDetailsOpen(false);
                  }}
                  disabled={selectedInvestment.currentProfit <= 0}
                  data-testid="button-detail-reinvest"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reinvest Profit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleWithdrawal(selectedInvestment);
                    setDetailsOpen(false);
                  }}
                  disabled={selectedInvestment.status === "Locked"}
                  data-testid="button-detail-withdraw"
                >
                  <ArrowDownToLine className="h-4 w-4 mr-2" />
                  Request Withdrawal
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}