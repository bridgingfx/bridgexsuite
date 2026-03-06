import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Shield,
  BarChart3,
  Flame,
  Coins,
  Bitcoin,
  DollarSign,
  TrendingUp,
  Clock,
  Lock,
  Wallet,
  PiggyBank,
  CircleDot,
} from "lucide-react";

const products = [
  {
    id: "gold-saver",
    name: "Gold Saver Plan",
    category: "Gold",
    minInvestment: 500,
    lockInPeriod: "6 Months",
    monthlyROI: 2.5,
    riskLevel: "Low",
    expectedReturn: "15%",
    icon: Coins,
    iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  },
  {
    id: "gold-growth",
    name: "Gold Growth Plan",
    category: "Gold",
    minInvestment: 2000,
    lockInPeriod: "12 Months",
    monthlyROI: 3.5,
    riskLevel: "Medium",
    expectedReturn: "42%",
    icon: TrendingUp,
    iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  },
  {
    id: "gold-premium",
    name: "Gold Premium Plan",
    category: "Gold",
    minInvestment: 10000,
    lockInPeriod: "24 Months",
    monthlyROI: 4.5,
    riskLevel: "Medium",
    expectedReturn: "108%",
    icon: Shield,
    iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  },
  {
    id: "btc-growth",
    name: "BTC Growth Plan",
    category: "Crypto",
    minInvestment: 1000,
    lockInPeriod: "6 Months",
    monthlyROI: 5.0,
    riskLevel: "High",
    expectedReturn: "30%",
    icon: Bitcoin,
    iconBg: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  },
  {
    id: "crypto-index",
    name: "Crypto Index Fund",
    category: "Crypto",
    minInvestment: 2500,
    lockInPeriod: "12 Months",
    monthlyROI: 6.0,
    riskLevel: "High",
    expectedReturn: "72%",
    icon: BarChart3,
    iconBg: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  },
  {
    id: "stablecoin-yield",
    name: "Stablecoin Yield Plan",
    category: "Crypto",
    minInvestment: 500,
    lockInPeriod: "3 Months",
    monthlyROI: 2.0,
    riskLevel: "Low",
    expectedReturn: "6%",
    icon: Shield,
    iconBg: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  },
  {
    id: "usd-income",
    name: "USD Income Plan",
    category: "Currency",
    minInvestment: 1000,
    lockInPeriod: "6 Months",
    monthlyROI: 3.0,
    riskLevel: "Low",
    expectedReturn: "18%",
    icon: DollarSign,
    iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  },
  {
    id: "forex-alpha",
    name: "Forex Alpha Strategy",
    category: "Currency",
    minInvestment: 5000,
    lockInPeriod: "12 Months",
    monthlyROI: 4.0,
    riskLevel: "Medium",
    expectedReturn: "48%",
    icon: Flame,
    iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  },
  {
    id: "multi-currency",
    name: "Multi Currency Portfolio",
    category: "Currency",
    minInvestment: 3000,
    lockInPeriod: "9 Months",
    monthlyROI: 3.5,
    riskLevel: "Medium",
    expectedReturn: "31.5%",
    icon: TrendingUp,
    iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  },
];

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

const steps = [
  { label: "Choose Product", icon: PiggyBank },
  { label: "Enter Amount", icon: DollarSign },
  { label: "Select Wallet", icon: Wallet },
  { label: "Confirm", icon: CheckCircle2 },
];

const wallets = [
  { id: "main", name: "Main Wallet", balance: 25000, icon: Wallet },
  { id: "investment", name: "Investment Wallet", balance: 12500, icon: PiggyBank },
];

export default function StartNewInvestmentPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [amountError, setAmountError] = useState("");

  const product = products.find((p) => p.id === selectedProduct);
  const wallet = wallets.find((w) => w.id === selectedWallet);

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!selectedProduct;
      case 1:
        return !!amount && Number(amount) >= (product?.minInvestment || 0) && !amountError;
      case 2:
        return !!selectedWallet;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    const num = Number(value);
    if (!value) {
      setAmountError("");
    } else if (isNaN(num) || num <= 0) {
      setAmountError("Please enter a valid amount");
    } else if (product && num < product.minInvestment) {
      setAmountError(`Minimum investment is $${product.minInvestment.toLocaleString()}`);
    } else if (wallet && num > wallet.balance) {
      setAmountError("Insufficient wallet balance");
    } else {
      setAmountError("");
    }
  };

  const handleConfirm = () => {
    toast({
      title: "Investment Started Successfully",
      description: `Your $${Number(amount).toLocaleString()} investment in ${product?.name} has been initiated.`,
    });
    setCurrentStep(0);
    setSelectedProduct(null);
    setAmount("");
    setSelectedWallet(null);
    setAmountError("");
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Start New Investment</h1>
        <p className="text-muted-foreground mt-1" data-testid="text-page-subtitle">
          Follow the steps below to create a new investment
        </p>
      </div>

      <div className="flex items-center gap-2" data-testid="step-indicator">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          return (
            <div key={step.label} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-1 flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                  data-testid={`step-icon-${index}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </div>
                <span
                  className={`text-xs text-center ${
                    isActive ? "font-semibold text-foreground" : "text-muted-foreground"
                  }`}
                  data-testid={`step-label-${index}`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mb-5 ${
                    index < currentStep ? "bg-emerald-500" : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <Card className="p-6">
        {currentStep === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" data-testid="text-step-title">Choose an Investment Product</h2>
            <p className="text-sm text-muted-foreground">Select the investment product that suits your goals</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedProduct === p.id;
                return (
                  <Card
                    key={p.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? "ring-2 ring-primary"
                        : "hover-elevate"
                    }`}
                    onClick={() => setSelectedProduct(p.id)}
                    data-testid={`product-card-${p.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-md ${p.iconBg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm" data-testid={`text-product-name-${p.id}`}>{p.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                        </div>
                        <Badge className={`mt-1 ${getRiskColor(p.riskLevel)}`} data-testid={`badge-risk-${p.id}`}>
                          {p.riskLevel} Risk
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between gap-1">
                        <span>Min. Investment</span>
                        <span className="font-medium text-foreground">${p.minInvestment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-1">
                        <span>Lock-in Period</span>
                        <span className="font-medium text-foreground">{p.lockInPeriod}</span>
                      </div>
                      <div className="flex justify-between gap-1">
                        <span>Monthly ROI</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">{p.monthlyROI}%</span>
                      </div>
                      <div className="flex justify-between gap-1">
                        <span>Expected Return</span>
                        <span className="font-medium text-foreground">{p.expectedReturn}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 1 && product && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold" data-testid="text-step-title">Enter Investment Amount</h2>
            <p className="text-sm text-muted-foreground">
              Enter the amount you want to invest in <span className="font-medium text-foreground">{product.name}</span>
            </p>
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${product.iconBg}`}>
                  <product.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium" data-testid="text-selected-product">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category} Investment</p>
                </div>
              </div>
            </Card>
            <div className="space-y-2">
              <label className="text-sm font-medium">Investment Amount (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder={`Min $${product.minInvestment.toLocaleString()}`}
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="pl-9"
                  data-testid="input-amount"
                />
              </div>
              {amountError && (
                <p className="text-xs text-red-500 dark:text-red-400" data-testid="text-amount-error">{amountError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum investment: ${product.minInvestment.toLocaleString()}
              </p>
            </div>
            {amount && Number(amount) >= product.minInvestment && (
              <Card className="p-4 bg-muted/50">
                <h3 className="text-sm font-medium mb-3">Estimated Returns</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly ROI</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400" data-testid="text-monthly-roi">
                      ${(Number(amount) * product.monthlyROI / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lock Period</p>
                    <p className="font-semibold" data-testid="text-lock-period">{product.lockInPeriod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Return</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400" data-testid="text-total-return">
                      {product.expectedReturn}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold" data-testid="text-step-title">Select Payment Wallet</h2>
            <p className="text-sm text-muted-foreground">Choose the wallet to fund your investment from</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wallets.map((w) => {
                const WIcon = w.icon;
                const isSelected = selectedWallet === w.id;
                return (
                  <Card
                    key={w.id}
                    className={`p-5 cursor-pointer transition-colors ${
                      isSelected
                        ? "ring-2 ring-primary"
                        : "hover-elevate"
                    }`}
                    onClick={() => {
                      setSelectedWallet(w.id);
                      if (amount && Number(amount) > w.balance) {
                        setAmountError("Insufficient wallet balance");
                      } else {
                        setAmountError("");
                      }
                    }}
                    data-testid={`wallet-card-${w.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        <WIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium" data-testid={`text-wallet-name-${w.id}`}>{w.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Balance: <span className="font-medium text-foreground" data-testid={`text-wallet-balance-${w.id}`}>${w.balance.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                    {isSelected && amount && Number(amount) > w.balance && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-2">Insufficient balance for this investment</p>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 3 && product && wallet && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold" data-testid="text-step-title">Confirm Your Investment</h2>
            <p className="text-sm text-muted-foreground">Review the details below before confirming</p>
            <Card className="p-5 bg-muted/50 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className={`p-2 rounded-md ${product.iconBg}`}>
                  <product.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold" data-testid="text-confirm-product">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category} Investment</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>Investment Amount</span>
                  </div>
                  <span className="font-semibold" data-testid="text-confirm-amount">${Number(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Lock-in Period</span>
                  </div>
                  <span className="font-semibold" data-testid="text-confirm-lock">{product.lockInPeriod}</span>
                </div>
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Monthly ROI</span>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400" data-testid="text-confirm-roi">{product.monthlyROI}%</span>
                </div>
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CircleDot className="w-4 h-4" />
                    <span>Expected Return</span>
                  </div>
                  <span className="font-semibold" data-testid="text-confirm-return">{product.expectedReturn}</span>
                </div>
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wallet className="w-4 h-4" />
                    <span>Payment Wallet</span>
                  </div>
                  <span className="font-semibold" data-testid="text-confirm-wallet">{wallet.name}</span>
                </div>
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Risk Level</span>
                  </div>
                  <Badge className={getRiskColor(product.riskLevel)} data-testid="badge-confirm-risk">{product.riskLevel}</Badge>
                </div>
              </div>
            </Card>
            <Card className="p-4 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-300">Lock-in Agreement</p>
                  <p className="text-amber-700 dark:text-amber-400 mt-1">
                    By confirming, you agree that your investment of ${Number(amount).toLocaleString()} will be locked for {product.lockInPeriod}. 
                    Early withdrawal may incur penalties. ROI earnings will be distributed monthly to your selected wallet.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {currentStep < 3 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            data-testid="button-next"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleConfirm}
            disabled={!canProceed()}
            data-testid="button-confirm"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirm Investment
          </Button>
        )}
      </div>
    </div>
  );
}
