import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  Shield,
  DollarSign,
  Clock,
  TrendingUp,
  Star,
  CheckCircle2,
  Users,
} from "lucide-react";

const currencies = ["USDT", "BTC", "ETH", "USDC"];

const traders = [
  {
    name: "CryptoKing_88",
    completionRate: 98.5,
    orders: 1243,
    price: 1.0,
    currency: "USDT",
    minLimit: 100,
    maxLimit: 5000,
    methods: ["Bank Transfer", "Revolut"],
    type: "buy",
    online: true,
    avgRelease: "5 min",
  },
  {
    name: "TradeFlow_Pro",
    completionRate: 99.1,
    orders: 2580,
    price: 1.0,
    currency: "USDT",
    minLimit: 50,
    maxLimit: 10000,
    methods: ["Wise", "Bank Transfer"],
    type: "buy",
    online: true,
    avgRelease: "3 min",
  },
  {
    name: "SwiftPay_Mike",
    completionRate: 96.2,
    orders: 856,
    price: 1.01,
    currency: "USDT",
    minLimit: 200,
    maxLimit: 8000,
    methods: ["Skrill", "Revolut"],
    type: "sell",
    online: false,
    avgRelease: "8 min",
  },
  {
    name: "DigitalFX_99",
    completionRate: 97.8,
    orders: 1672,
    price: 0.999,
    currency: "USDT",
    minLimit: 500,
    maxLimit: 20000,
    methods: ["Bank Transfer", "Wise", "Skrill"],
    type: "buy",
    online: true,
    avgRelease: "4 min",
  },
  {
    name: "P2P_Master",
    completionRate: 95.5,
    orders: 432,
    price: 1.005,
    currency: "USDT",
    minLimit: 100,
    maxLimit: 3000,
    methods: ["Revolut", "Skrill"],
    type: "sell",
    online: true,
    avgRelease: "6 min",
  },
];

export default function P2PExchangePage() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [selectedCurrency, setSelectedCurrency] = useState("USDT");

  const filteredTraders = traders.filter(
    (t) => t.type === activeTab && t.currency === selectedCurrency
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">P2P Exchange</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Buy and sell crypto directly with other traders</p>
        </div>
        <Button variant="outline" data-testid="button-my-orders">
          <Clock className="w-4 h-4 mr-2" />
          My Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Orders", value: "0", icon: <ArrowLeftRight className="w-5 h-5" />, iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
          { label: "Completed Trades", value: "0", icon: <Shield className="w-5 h-5" />, iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
          { label: "Total Volume", value: "$0.00", icon: <DollarSign className="w-5 h-5" />, iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
          { label: "Avg. Completion", value: "0 min", icon: <Clock className="w-5 h-5" />, iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
        ].map((card) => (
          <div key={card.label} className="bg-card rounded-xl border shadow-sm p-6" data-testid={`stat-card-${card.label.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "buy" ? "default" : "outline"}
              onClick={() => setActiveTab("buy")}
              data-testid="button-tab-buy"
              className={activeTab === "buy" ? "bg-emerald-600 dark:bg-emerald-700" : ""}
            >
              Buy
            </Button>
            <Button
              variant={activeTab === "sell" ? "default" : "outline"}
              onClick={() => setActiveTab("sell")}
              data-testid="button-tab-sell"
              className={activeTab === "sell" ? "bg-red-600 dark:bg-red-700" : ""}
            >
              Sell
            </Button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {currencies.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={selectedCurrency === c ? "default" : "outline"}
                onClick={() => setSelectedCurrency(c)}
                data-testid={`button-currency-${c.toLowerCase()}`}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredTraders.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400" data-testid="text-no-traders">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No traders available for this selection</p>
            </div>
          )}
          {filteredTraders.map((trader, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 hover:shadow-md transition-all"
              data-testid={`trader-listing-${i}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                      {trader.name.charAt(0)}
                    </div>
                    {trader.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 dark:text-white">{trader.name}</p>
                      {trader.completionRate >= 98 && (
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      <span>{trader.orders} orders</span>
                      <span>{trader.completionRate}% completion</span>
                      <span>~{trader.avgRelease}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-wrap">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">${trader.price.toFixed(3)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Limit</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${trader.minLimit.toLocaleString()} - ${trader.maxLimit.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment Methods</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {trader.methods.map((m) => (
                        <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    className={activeTab === "buy" ? "bg-emerald-600 dark:bg-emerald-700" : "bg-red-600 dark:bg-red-700"}
                    data-testid={`button-trade-${i}`}
                  >
                    {activeTab === "buy" ? "Buy" : "Sell"} {selectedCurrency}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
