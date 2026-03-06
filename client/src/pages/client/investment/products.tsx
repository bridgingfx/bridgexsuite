import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Coins,
  Bitcoin,
  DollarSign,
  Clock,
  TrendingUp,
  Shield,
  AlertTriangle,
  Zap,
  Lock,
  ArrowRight,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  minInvestment: number;
  lockInPeriod: string;
  monthlyRoi: string;
  riskLevel: "Low" | "Medium" | "High";
  expectedReturn: string;
  description: string;
}

const goldProducts: Product[] = [
  {
    id: "gold-saver",
    name: "Gold Saver Plan",
    minInvestment: 500,
    lockInPeriod: "6 Months",
    monthlyRoi: "2.5%",
    riskLevel: "Low",
    expectedReturn: "15% p.a.",
    description: "A conservative gold-backed savings plan with stable monthly returns and capital preservation.",
  },
  {
    id: "gold-growth",
    name: "Gold Growth Plan",
    minInvestment: 2500,
    lockInPeriod: "12 Months",
    monthlyRoi: "4.0%",
    riskLevel: "Medium",
    expectedReturn: "28% p.a.",
    description: "Leveraged gold investment targeting above-average returns through strategic allocation.",
  },
  {
    id: "gold-premium",
    name: "Gold Premium Plan",
    minInvestment: 10000,
    lockInPeriod: "18 Months",
    monthlyRoi: "5.5%",
    riskLevel: "Medium",
    expectedReturn: "40% p.a.",
    description: "Premium gold portfolio with diversified precious metals exposure and higher yield targets.",
  },
];

const cryptoProducts: Product[] = [
  {
    id: "btc-growth",
    name: "BTC Growth Plan",
    minInvestment: 1000,
    lockInPeriod: "3 Months",
    monthlyRoi: "6.0%",
    riskLevel: "High",
    expectedReturn: "45% p.a.",
    description: "Pure Bitcoin exposure with active trading strategies to maximize growth potential.",
  },
  {
    id: "crypto-index",
    name: "Crypto Index Fund",
    minInvestment: 2000,
    lockInPeriod: "6 Months",
    monthlyRoi: "4.5%",
    riskLevel: "Medium",
    expectedReturn: "32% p.a.",
    description: "Diversified crypto basket tracking top 20 digital assets for balanced exposure.",
  },
  {
    id: "stablecoin-yield",
    name: "Stablecoin Yield Plan",
    minInvestment: 500,
    lockInPeriod: "1 Month",
    monthlyRoi: "1.8%",
    riskLevel: "Low",
    expectedReturn: "12% p.a.",
    description: "Low-risk stablecoin lending and yield farming with predictable monthly returns.",
  },
];

const currencyProducts: Product[] = [
  {
    id: "usd-income",
    name: "USD Income Plan",
    minInvestment: 1000,
    lockInPeriod: "3 Months",
    monthlyRoi: "3.0%",
    riskLevel: "Low",
    expectedReturn: "20% p.a.",
    description: "USD-denominated fixed income plan with steady monthly distributions and capital safety.",
  },
  {
    id: "forex-alpha",
    name: "Forex Alpha Strategy",
    minInvestment: 5000,
    lockInPeriod: "6 Months",
    monthlyRoi: "5.0%",
    riskLevel: "High",
    expectedReturn: "38% p.a.",
    description: "Aggressive forex trading strategy targeting alpha through major and exotic currency pairs.",
  },
  {
    id: "multi-currency",
    name: "Multi Currency Portfolio",
    minInvestment: 3000,
    lockInPeriod: "12 Months",
    monthlyRoi: "3.5%",
    riskLevel: "Medium",
    expectedReturn: "25% p.a.",
    description: "Diversified multi-currency portfolio balancing risk across global forex markets.",
  },
];

const riskBadgeVariant = (risk: string) => {
  switch (risk) {
    case "Low":
      return "outline" as const;
    case "Medium":
      return "secondary" as const;
    case "High":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
};

const riskIcon = (risk: string) => {
  switch (risk) {
    case "Low":
      return <Shield className="w-3 h-3 mr-1" />;
    case "Medium":
      return <AlertTriangle className="w-3 h-3 mr-1" />;
    case "High":
      return <Zap className="w-3 h-3 mr-1" />;
    default:
      return null;
  }
};

function ProductCard({ product }: { product: Product }) {
  const { toast } = useToast();

  return (
    <Card className="p-5 flex flex-col gap-4" data-testid={`card-product-${product.id}`}>
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <h3 className="text-lg font-semibold" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        <Badge variant={riskBadgeVariant(product.riskLevel)} data-testid={`badge-risk-${product.id}`}>
          {riskIcon(product.riskLevel)}
          {product.riskLevel} Risk
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground" data-testid={`text-product-desc-${product.id}`}>
        {product.description}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Min Investment</p>
            <p className="text-sm font-medium" data-testid={`text-min-investment-${product.id}`}>
              ${product.minInvestment.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Lock-in Period</p>
            <p className="text-sm font-medium" data-testid={`text-lock-period-${product.id}`}>
              {product.lockInPeriod}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Monthly ROI</p>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400" data-testid={`text-monthly-roi-${product.id}`}>
              {product.monthlyRoi}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Expected Return</p>
            <p className="text-sm font-medium" data-testid={`text-expected-return-${product.id}`}>
              {product.expectedReturn}
            </p>
          </div>
        </div>
      </div>

      <Button
        className="w-full mt-auto"
        data-testid={`button-invest-${product.id}`}
        onClick={() => {
          toast({
            title: "Investment Request",
            description: `Redirecting to invest in ${product.name}...`,
          });
        }}
      >
        Invest Now
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Card>
  );
}

export default function InvestmentProductsPage() {
  const [activeTab, setActiveTab] = useState("gold");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Investment Products</h1>
        <p className="text-muted-foreground mt-1" data-testid="text-page-subtitle">
          Browse available investment plans across Gold, Crypto, and Currency markets
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="tabs-products">
        <TabsList data-testid="tabs-list-products">
          <TabsTrigger value="gold" data-testid="tab-gold">
            <Coins className="w-4 h-4 mr-2" />
            Gold Investment
          </TabsTrigger>
          <TabsTrigger value="crypto" data-testid="tab-crypto">
            <Bitcoin className="w-4 h-4 mr-2" />
            Crypto Investment
          </TabsTrigger>
          <TabsTrigger value="currency" data-testid="tab-currency">
            <DollarSign className="w-4 h-4 mr-2" />
            Currency Investment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gold" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goldProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="crypto" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cryptoProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="currency" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currencyProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}