import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  ArrowLeft,
  CheckCircle2,
  Wallet,
  PiggyBank,
  CircleDot,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  minInvestment: number;
  lockInPeriod: string;
  monthlyRoi: number;
  riskLevel: "Low" | "Medium" | "High";
  expectedReturn: string;
  description: string;
}

const goldProducts: Product[] = [
  {
    id: "gold-saver",
    name: "Gold Saver Plan",
    category: "Gold",
    minInvestment: 500,
    lockInPeriod: "6 Months",
    monthlyRoi: 2.5,
    riskLevel: "Low",
    expectedReturn: "15% p.a.",
    description: "A conservative gold-backed savings plan with stable monthly returns and capital preservation.",
  },
  {
    id: "gold-growth",
    name: "Gold Growth Plan",
    category: "Gold",
    minInvestment: 2500,
    lockInPeriod: "12 Months",
    monthlyRoi: 4.0,
    riskLevel: "Medium",
    expectedReturn: "28% p.a.",
    description: "Leveraged gold investment targeting above-average returns through strategic allocation.",
  },
  {
    id: "gold-premium",
    name: "Gold Premium Plan",
    category: "Gold",
    minInvestment: 10000,
    lockInPeriod: "18 Months",
    monthlyRoi: 5.5,
    riskLevel: "Medium",
    expectedReturn: "40% p.a.",
    description: "Premium gold portfolio with diversified precious metals exposure and higher yield targets.",
  },
];

const cryptoProducts: Product[] = [
  {
    id: "btc-growth",
    name: "BTC Growth Plan",
    category: "Crypto",
    minInvestment: 1000,
    lockInPeriod: "3 Months",
    monthlyRoi: 6.0,
    riskLevel: "High",
    expectedReturn: "45% p.a.",
    description: "Pure Bitcoin exposure with active trading strategies to maximize growth potential.",
  },
  {
    id: "crypto-index",
    name: "Crypto Index Fund",
    category: "Crypto",
    minInvestment: 2000,
    lockInPeriod: "6 Months",
    monthlyRoi: 4.5,
    riskLevel: "Medium",
    expectedReturn: "32% p.a.",
    description: "Diversified crypto basket tracking top 20 digital assets for balanced exposure.",
  },
  {
    id: "stablecoin-yield",
    name: "Stablecoin Yield Plan",
    category: "Crypto",
    minInvestment: 500,
    lockInPeriod: "1 Month",
    monthlyRoi: 1.8,
    riskLevel: "Low",
    expectedReturn: "12% p.a.",
    description: "Low-risk stablecoin lending and yield farming with predictable monthly returns.",
  },
];

const currencyProducts: Product[] = [
  {
    id: "usd-income",
    name: "USD Income Plan",
    category: "Currency",
    minInvestment: 1000,
    lockInPeriod: "3 Months",
    monthlyRoi: 3.0,
    riskLevel: "Low",
    expectedReturn: "20% p.a.",
    description: "USD-denominated fixed income plan with steady monthly distributions and capital safety.",
  },
  {
    id: "forex-alpha",
    name: "Forex Alpha Strategy",
    category: "Currency",
    minInvestment: 5000,
    lockInPeriod: "6 Months",
    monthlyRoi: 5.0,
    riskLevel: "High",
    expectedReturn: "38% p.a.",
    description: "Aggressive forex trading strategy targeting alpha through major and exotic currency pairs.",
  },
  {
    id: "multi-currency",
    name: "Multi Currency Portfolio",
    category: "Currency",
    minInvestment: 3000,
    lockInPeriod: "12 Months",
    monthlyRoi: 3.5,
    riskLevel: "Medium",
    expectedReturn: "25% p.a.",
    description: "Diversified multi-currency portfolio balancing risk across global forex markets.",
  },
];

const allProducts = [...goldProducts, ...cryptoProducts, ...currencyProducts];

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

function getRiskColor(riskLevel: string) {
  switch (riskLevel.toLowerCase()) {
    case "low":
      return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
    case "medium":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
    case "high":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

const categoryIcon = (category: string) => {
  switch (category) {
    case "Gold":
      return Coins;
    case "Crypto":
      return Bitcoin;
    case "Currency":
      return DollarSign;
    default:
      return DollarSign;
  }
};

const categoryIconBg = (category: string) => {
  switch (category) {
    case "Gold":
      return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400";
    case "Crypto":
      return "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400";
    case "Currency":
      return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const wallets = [
  { id: "main", name: "Main Wallet", balance: 25000, icon: Wallet },
];

const wizardSteps = [
  { label: "Product", icon: PiggyBank },
  { label: "Amount", icon: DollarSign },
  { label: "Wallet", icon: Wallet },
  { label: "Confirm", icon: CheckCircle2 },
];

function ProductCard({ product, onInvest }: { product: Product; onInvest: (product: Product) => void }) {
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
              {product.monthlyRoi}%
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
        onClick={() => onInvest(product)}
      >
        Invest Now
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </Card>
  );
}

export default function InvestmentProductsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("gold");
  const [investOpen, setInvestOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const wallet = wallets.find((w) => w.id === selectedWallet);

  function openInvestDialog(product: Product) {
    setSelectedProduct(product);
    setWizardStep(0);
    setAmount("");
    setAmountError("");
    setSelectedWallet(null);
    setInvestOpen(true);
  }

  function closeDialog() {
    setInvestOpen(false);
    setSelectedProduct(null);
    setWizardStep(0);
    setAmount("");
    setAmountError("");
    setSelectedWallet(null);
  }

  function handleAmountChange(value: string) {
    setAmount(value);
    const num = Number(value);
    if (!value) {
      setAmountError("");
    } else if (isNaN(num) || num <= 0) {
      setAmountError("Please enter a valid amount");
    } else if (selectedProduct && num < selectedProduct.minInvestment) {
      setAmountError(`Minimum investment is $${selectedProduct.minInvestment.toLocaleString()}`);
    } else {
      setAmountError("");
    }
  }

  function canProceed() {
    switch (wizardStep) {
      case 0:
        return true;
      case 1:
        return !!amount && Number(amount) >= (selectedProduct?.minInvestment || 0) && !amountError;
      case 2:
        return !!selectedWallet;
      case 3:
        return true;
      default:
        return false;
    }
  }

  function handleNext() {
    if (wizardStep < 3 && canProceed()) {
      setWizardStep(wizardStep + 1);
    }
  }

  function handleBack() {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
    }
  }

  function handleConfirm() {
    if (!selectedProduct) return;
    toast({
      title: "Investment Started Successfully",
      description: `Your $${Number(amount).toLocaleString()} investment in ${selectedProduct.name} has been initiated.`,
    });
    closeDialog();
  }

  const CatIcon = selectedProduct ? categoryIcon(selectedProduct.category) : DollarSign;
  const catBg = selectedProduct ? categoryIconBg(selectedProduct.category) : "";

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
              <ProductCard key={product.id} product={product} onInvest={openInvestDialog} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="crypto" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cryptoProducts.map((product) => (
              <ProductCard key={product.id} product={product} onInvest={openInvestDialog} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="currency" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currencyProducts.map((product) => (
              <ProductCard key={product.id} product={product} onInvest={openInvestDialog} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={investOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-2xl bg-[#0f172a] border-gray-800 text-white" data-testid="dialog-invest-wizard">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-pink-400" />
              Invest in {selectedProduct?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Complete the steps below to start your investment
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 mb-2" data-testid="dialog-step-indicator">
            {wizardSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === wizardStep;
              const isCompleted = index < wizardStep;
              return (
                <div key={step.label} className="flex items-center gap-2 flex-1">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isActive
                            ? "bg-brand-500 text-white"
                            : "bg-gray-700 text-gray-400"
                      }`}
                      data-testid={`dialog-step-icon-${index}`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-[10px] text-center ${
                        isActive ? "font-semibold text-white" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < wizardSteps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mb-5 ${
                        index < wizardStep ? "bg-emerald-500" : "bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {selectedProduct && (
            <div className="space-y-4">
              {wizardStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-300" data-testid="dialog-step-title">Selected Product</h3>
                  <Card className="p-4 bg-gray-800/50 border-brand-500 ring-2 ring-brand-500" data-testid="dialog-selected-product">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-md ${catBg}`}>
                        <CatIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-white" data-testid="dialog-product-name">{selectedProduct.name}</span>
                          <CheckCircle2 className="w-4 h-4 text-brand-400" />
                        </div>
                        <Badge className={`mt-1 ${getRiskColor(selectedProduct.riskLevel)}`}>{selectedProduct.riskLevel} Risk</Badge>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between gap-1 text-gray-400">
                        <span>Min. Investment</span>
                        <span className="font-medium text-white">${selectedProduct.minInvestment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-1 text-gray-400">
                        <span>Lock-in Period</span>
                        <span className="font-medium text-white">{selectedProduct.lockInPeriod}</span>
                      </div>
                      <div className="flex justify-between gap-1 text-gray-400">
                        <span>Monthly ROI</span>
                        <span className="font-medium text-emerald-400">{selectedProduct.monthlyRoi}%</span>
                      </div>
                      <div className="flex justify-between gap-1 text-gray-400">
                        <span>Expected Return</span>
                        <span className="font-medium text-white">{selectedProduct.expectedReturn}</span>
                      </div>
                    </div>
                  </Card>
                  <p className="text-xs text-gray-500">Click Next to enter your investment amount</p>
                </div>
              )}

              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-300" data-testid="dialog-step-title">Enter Investment Amount</h3>
                  <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center gap-3">
                    <div className={`p-2 rounded-md ${catBg}`}>
                      <CatIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{selectedProduct.name}</p>
                      <p className="text-xs text-gray-400">{selectedProduct.category} Investment</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Investment Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <Input
                        type="number"
                        placeholder={`Min $${selectedProduct.minInvestment.toLocaleString()}`}
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className="pl-7 bg-gray-900 border-brand-500 text-white placeholder:text-gray-500"
                        data-testid="dialog-input-amount"
                      />
                    </div>
                    {amountError && (
                      <p className="text-xs text-red-400" data-testid="dialog-amount-error">{amountError}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Minimum investment: ${selectedProduct.minInvestment.toLocaleString()}
                    </p>
                  </div>
                  {amount && Number(amount) >= selectedProduct.minInvestment && (
                    <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700">
                      <p className="text-xs font-medium text-gray-300 mb-2">Estimated Returns</p>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-[10px] text-gray-400">Monthly ROI</p>
                          <p className="text-sm font-semibold text-emerald-400" data-testid="dialog-est-monthly">
                            ${(Number(amount) * selectedProduct.monthlyRoi / 100).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400">Lock Period</p>
                          <p className="text-sm font-semibold text-white">{selectedProduct.lockInPeriod}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400">Total Return</p>
                          <p className="text-sm font-semibold text-emerald-400">{selectedProduct.expectedReturn}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-300" data-testid="dialog-step-title">Select Payment Wallet</h3>
                  <p className="text-xs text-gray-500">Choose the wallet to fund your investment from</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {wallets.map((w) => {
                      const WIcon = w.icon;
                      const isSelected = selectedWallet === w.id;
                      const insufficient = amount && Number(amount) > w.balance;
                      return (
                        <div
                          key={w.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            isSelected
                              ? "border-brand-500 ring-2 ring-brand-500 bg-gray-800/50"
                              : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                          }`}
                          onClick={() => {
                            setSelectedWallet(w.id);
                            if (amount && Number(amount) > w.balance) {
                              setAmountError("Insufficient wallet balance");
                            } else {
                              setAmountError("");
                            }
                          }}
                          data-testid={`dialog-wallet-${w.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-brand-500/20 text-brand-400">
                              <WIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white text-sm">{w.name}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5">
                                Balance: <span className={`font-medium ${insufficient ? "text-red-400" : "text-emerald-400"}`}>${w.balance.toLocaleString()}</span>
                              </p>
                            </div>
                          </div>
                          {isSelected && insufficient && (
                            <p className="text-xs text-red-400 mt-2">Insufficient balance for this investment</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {wizardStep === 3 && wallet && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-300" data-testid="dialog-step-title">Confirm Your Investment</h3>
                  <p className="text-xs text-gray-500">Review the details below before confirming</p>
                  <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-700">
                      <div className={`p-2 rounded-md ${catBg}`}>
                        <CatIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white" data-testid="dialog-confirm-product">{selectedProduct.name}</p>
                        <p className="text-xs text-gray-400">{selectedProduct.category} Investment</p>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-sm text-gray-400">
                          <DollarSign className="w-4 h-4" /> Investment Amount
                        </span>
                        <span className="font-semibold text-white" data-testid="dialog-confirm-amount">${Number(amount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-sm text-gray-400">
                          <Lock className="w-4 h-4" /> Lock-in Period
                        </span>
                        <span className="font-semibold text-white">{selectedProduct.lockInPeriod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-sm text-gray-400">
                          <TrendingUp className="w-4 h-4" /> Monthly ROI
                        </span>
                        <span className="font-semibold text-emerald-400">{selectedProduct.monthlyRoi}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-sm text-gray-400">
                          <CircleDot className="w-4 h-4" /> Expected Return
                        </span>
                        <span className="font-semibold text-white">{selectedProduct.expectedReturn}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-sm text-gray-400">
                          <Wallet className="w-4 h-4" /> Payment Wallet
                        </span>
                        <span className="font-semibold text-white">{wallet.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-sm text-gray-400">
                          <Shield className="w-4 h-4" /> Risk Level
                        </span>
                        <Badge className={getRiskColor(selectedProduct.riskLevel)}>{selectedProduct.riskLevel}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-amber-800/50 bg-amber-900/10">
                    <div className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div className="text-xs">
                        <p className="font-medium text-amber-300">Lock-in Agreement</p>
                        <p className="text-amber-400/80 mt-1">
                          By confirming, you agree that your investment of ${Number(amount).toLocaleString()} will be locked for {selectedProduct.lockInPeriod}. 
                          Early withdrawal may incur penalties. ROI earnings will be distributed monthly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-2">
            <Button
              variant="outline"
              onClick={wizardStep === 0 ? closeDialog : handleBack}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              data-testid="dialog-button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {wizardStep === 0 ? "Cancel" : "Back"}
            </Button>
            {wizardStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="dialog-button-next"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleConfirm}
                className="bg-emerald-600 hover:bg-emerald-700"
                data-testid="dialog-button-confirm"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm Investment
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
