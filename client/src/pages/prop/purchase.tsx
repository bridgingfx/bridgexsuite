import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  CheckCircle2,
  ArrowLeft,
  Info,
  Tag,
} from "lucide-react";

const addOns = {
  profitSplit: [
    { id: "profit-plus-5", name: "Profit Plus 5", price: 25.00, description: "+5% profit split increase" },
    { id: "profit-plus-10", name: "Profit Plus 10", price: 30.00, description: "+10% profit split increase" },
  ],
  dailyLoss: [
    { id: "flexishield", name: "FlexiShield", price: 25.00, description: "Extended daily loss limit" },
    { id: "bufferzone", name: "BufferZone", price: 30.00, description: "Maximum daily loss buffer" },
  ],
  maxLoss: [
    { id: "deepguard", name: "DeepGuard", price: 30.00, description: "Extended max loss limit" },
  ],
  minDays: [
    { id: "fasttrack", name: "FastTrack", price: 25.00, description: "Reduced minimum trading days" },
    { id: "express-entry", name: "Express Entry", price: 30.00, description: "Minimum trading days waiver" },
  ],
};

export default function PropPurchasePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const params = new URLSearchParams(window.location.search);
  const challengeType = params.get("type") || "1-step";
  const accountSize = params.get("size") || "50000";
  const price = params.get("price") || "299";

  const challengeData: Record<string, Record<string, {
    leverage: string; tradingPeriod: string; minTradingDays: string;
    maxDailyLoss: string; maxLoss: string; profitTarget: string; profitSplit: string;
  }>> = {
    "1-step": {
      "10000": { leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "4%", maxLoss: "6%", profitTarget: "10%", profitSplit: "80%" },
      "25000": { leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "4%", maxLoss: "6%", profitTarget: "10%", profitSplit: "80%" },
      "50000": { leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "4%", maxLoss: "6%", profitTarget: "10%", profitSplit: "85%" },
      "100000": { leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "4%", maxLoss: "6%", profitTarget: "10%", profitSplit: "85%" },
      "200000": { leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "4%", maxLoss: "6%", profitTarget: "10%", profitSplit: "90%" },
    },
    "2-step": {
      "10000": { leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "5%", maxLoss: "10%", profitTarget: "8%", profitSplit: "80%" },
      "25000": { leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "5%", maxLoss: "10%", profitTarget: "8%", profitSplit: "80%" },
      "50000": { leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "5%", maxLoss: "10%", profitTarget: "8%", profitSplit: "85%" },
      "100000": { leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "5%", maxLoss: "10%", profitTarget: "8%", profitSplit: "85%" },
      "200000": { leverage: "1:100", tradingPeriod: "Unlimited", minTradingDays: "5 Days", maxDailyLoss: "5%", maxLoss: "10%", profitTarget: "8%", profitSplit: "90%" },
    },
  };

  const data = challengeData[challengeType]?.[accountSize] || challengeData["1-step"]["50000"];
  const basePrice = Number(price);
  const sizeNum = Number(accountSize);
  const maxDailyLossUsd = (sizeNum * parseFloat(data.maxDailyLoss) / 100).toFixed(0);
  const maxLossUsd = (sizeNum * parseFloat(data.maxLoss) / 100).toFixed(0);
  const profitTargetUsd = (sizeNum * parseFloat(data.profitTarget) / 100).toFixed(0);

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("crypto");

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const allAddOnsList = [...addOns.profitSplit, ...addOns.dailyLoss, ...addOns.maxLoss, ...addOns.minDays];
  const addOnsTotal = useMemo(() => {
    return selectedAddOns.reduce((sum, id) => {
      const addon = allAddOnsList.find((a) => a.id === id);
      return sum + (addon?.price || 0);
    }, 0);
  }, [selectedAddOns]);

  const subTotal = basePrice - couponDiscount;
  const total = subTotal + addOnsTotal;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "BRIDGEX10") {
      setCouponDiscount(basePrice * 0.10);
      toast({ title: "Coupon applied!", description: "10% discount applied to your order." });
    } else if (couponCode.toUpperCase() === "FIRST20") {
      setCouponDiscount(basePrice * 0.20);
      toast({ title: "Coupon applied!", description: "20% discount applied to your order." });
    } else {
      setCouponDiscount(0);
      toast({ title: "Invalid coupon code", variant: "destructive" });
    }
  };

  const purchaseMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/prop/accounts", {
        challengeType,
        accountSize,
        addOns: selectedAddOns,
        couponCode: couponCode || undefined,
        paymentMethod: selectedPayment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prop/accounts"] });
      toast({ title: "Challenge purchased successfully!" });
      setLocation("/prop/accounts");
    },
    onError: () => {
      toast({ title: "Purchase failed", variant: "destructive" });
    },
  });

  const phaseDetails = [
    { label: "Leverage Up To", value: data.leverage },
    { label: "Trading Period", value: `${data.tradingPeriod === "Unlimited" ? "30 Days" : data.tradingPeriod}` },
    { label: "Minimum Trading Days", value: data.minTradingDays },
    { label: `Max Daily Loss`, value: `${maxDailyLossUsd} USD (${data.maxDailyLoss})` },
    { label: "Max Loss", value: `${maxLossUsd} USD (${data.maxLoss})` },
    { label: "Profit Target", value: `${profitTargetUsd} USD (${data.profitTarget})` },
    { label: "Profit Split", value: `Up to ${data.profitSplit}` },
  ];

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto" data-testid="purchase-page">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/prop/challenges")}
          data-testid="button-back-to-challenges"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-purchase-title">
          Purchase Account
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-6 text-white" data-testid="card-phase-summary">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-bold">Phase 1</h2>
              <span className="px-3 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                {challengeType === "1-step" ? "Instant" : "2-Step"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {phaseDetails.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white/80 shrink-0" />
                  <span className="text-sm">
                    {item.label}: <span className="font-medium">{item.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Card className="p-6" data-testid="card-price-summary">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">Pay once, own it forever</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-1" data-testid="text-total-price">
              ${total.toFixed(2)} <span className="text-base font-normal text-gray-500">USD</span>
            </p>

            <div className="mt-4">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Coupon code</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Enter Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="pl-9 text-sm"
                    data-testid="input-coupon-code"
                  />
                </div>
                <Button
                  onClick={handleApplyCoupon}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-0"
                  data-testid="button-apply-coupon"
                >
                  Apply
                </Button>
              </div>
            </div>

            <div className="mt-5 border-t pt-4 space-y-2">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Summary</p>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Regular Price</span>
                <span data-testid="text-regular-price">${basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Coupon Discount</span>
                <span className="text-red-500" data-testid="text-coupon-discount">-${couponDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
                <span>Sub Total</span>
                <span data-testid="text-subtotal">${subTotal.toFixed(2)}</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white pt-1">Add-ons</p>
              {selectedAddOns.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500" data-testid="text-no-addons">No Ads Added</p>
              ) : (
                selectedAddOns.map((id) => {
                  const addon = allAddOnsList.find((a) => a.id === id);
                  return addon ? (
                    <div key={id} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{addon.name}</span>
                      <span>${addon.price.toFixed(2)}</span>
                    </div>
                  ) : null;
                })
              )}
              <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t">
                <span>Total</span>
                <span data-testid="text-final-total">${total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6" data-testid="card-addons">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Add-ons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Profit Split</h3>
            {addOns.profitSplit.map((addon) => (
              <label
                key={addon.id}
                className="flex items-center justify-between gap-3 cursor-pointer"
                data-testid={`addon-${addon.id}`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedAddOns.includes(addon.id)}
                    onCheckedChange={() => toggleAddOn(addon.id)}
                    data-testid={`checkbox-${addon.id}`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {addon.name} - ${addon.price.toFixed(2)}%
                  </span>
                </div>
                <Info className="w-4 h-4 text-gray-400" />
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Drawdown Limits - Daily Loss</h3>
            {addOns.dailyLoss.map((addon) => (
              <label
                key={addon.id}
                className="flex items-center justify-between gap-3 cursor-pointer"
                data-testid={`addon-${addon.id}`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedAddOns.includes(addon.id)}
                    onCheckedChange={() => toggleAddOn(addon.id)}
                    data-testid={`checkbox-${addon.id}`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {addon.name} - ${addon.price.toFixed(2)}%
                  </span>
                </div>
                <Info className="w-4 h-4 text-gray-400" />
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Drawdown Limits - Max Loss</h3>
            {addOns.maxLoss.map((addon) => (
              <label
                key={addon.id}
                className="flex items-center justify-between gap-3 cursor-pointer"
                data-testid={`addon-${addon.id}`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedAddOns.includes(addon.id)}
                    onCheckedChange={() => toggleAddOn(addon.id)}
                    data-testid={`checkbox-${addon.id}`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {addon.name} - ${addon.price.toFixed(2)}%
                  </span>
                </div>
                <Info className="w-4 h-4 text-gray-400" />
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Minimum Trading Days</h3>
            {addOns.minDays.map((addon) => (
              <label
                key={addon.id}
                className="flex items-center justify-between gap-3 cursor-pointer"
                data-testid={`addon-${addon.id}`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedAddOns.includes(addon.id)}
                    onCheckedChange={() => toggleAddOn(addon.id)}
                    data-testid={`checkbox-${addon.id}`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {addon.name} - ${addon.price.toFixed(2)}%
                  </span>
                </div>
                <Info className="w-4 h-4 text-gray-400" />
              </label>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6" data-testid="card-payment-method">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Select Payment Method</h2>
        <label
          className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            selectedPayment === "crypto"
              ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
              : "border-gray-200 dark:border-gray-700"
          }`}
          data-testid="payment-crypto"
        >
          <input
            type="radio"
            name="payment"
            value="crypto"
            checked={selectedPayment === "crypto"}
            onChange={() => setSelectedPayment("crypto")}
            className="accent-blue-500"
            data-testid="radio-crypto-payment"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 leading-none">
              NOW<br />
              <span className="text-[10px] text-green-500">Payments</span>
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Crypto Payment</span>
          </div>
        </label>
      </Card>

      <div className="flex justify-end">
        <Button
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-0"
          size="lg"
          onClick={() => purchaseMutation.mutate()}
          disabled={purchaseMutation.isPending}
          data-testid="button-confirm-purchase"
        >
          {purchaseMutation.isPending ? "Processing..." : `Pay $${total.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}
