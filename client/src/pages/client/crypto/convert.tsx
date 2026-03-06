import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowDownUp, RefreshCw, Clock, CheckCircle2, TrendingUp } from "lucide-react";

const cryptoAssets = [
  { symbol: "BTC", name: "Bitcoin", balance: "0.4523", priceUsd: 42850, icon: "₿" },
  { symbol: "ETH", name: "Ethereum", balance: "3.2100", priceUsd: 2312, icon: "Ξ" },
  { symbol: "USDT", name: "Tether", balance: "5,230.00", priceUsd: 1, icon: "₮" },
  { symbol: "USDC", name: "USD Coin", balance: "2,850.00", priceUsd: 1, icon: "$" },
  { symbol: "SOL", name: "Solana", balance: "12.500", priceUsd: 98.5, icon: "◎" },
  { symbol: "XRP", name: "Ripple", balance: "1,500.00", priceUsd: 0.62, icon: "✕" },
];

const recentConversions = [
  { id: "c1", from: "0.1 BTC", to: "1.853 ETH", time: "1h ago", status: "Completed" },
  { id: "c2", from: "500 USDT", to: "0.2163 ETH", time: "6h ago", status: "Completed" },
  { id: "c3", from: "1.0 ETH", to: "2,312.00 USDT", time: "1d ago", status: "Completed" },
];

export default function CryptoConvertPage() {
  const [fromAsset, setFromAsset] = useState("BTC");
  const [toAsset, setToAsset] = useState("ETH");
  const [amount, setAmount] = useState("");

  const fromData = cryptoAssets.find((a) => a.symbol === fromAsset)!;
  const toData = cryptoAssets.find((a) => a.symbol === toAsset)!;
  const rate = fromData.priceUsd / toData.priceUsd;
  const convertedAmount = parseFloat(amount || "0") * rate;

  function handleSwap() {
    setFromAsset(toAsset);
    setToAsset(fromAsset);
    setAmount("");
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-crypto-convert-title">
          Convert Crypto
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Instantly convert between cryptocurrencies at market rates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
              <span className="text-xs text-gray-500">Balance: {fromData.balance} {fromAsset}</span>
            </div>
            <div className="flex gap-3">
              <select
                value={fromAsset}
                onChange={(e) => setFromAsset(e.target.value)}
                className="w-32 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm font-medium text-gray-900 dark:text-white"
                data-testid="select-from-asset"
              >
                {cryptoAssets.map((a) => (
                  <option key={a.symbol} value={a.symbol}>{a.icon} {a.symbol}</option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 font-mono text-lg"
                data-testid="input-convert-amount"
              />
            </div>
            <div className="flex items-center gap-2">
              {["25", "50", "75", "100"].map((pct) => (
                <Button key={pct} variant="outline" size="sm" onClick={() => setAmount((parseFloat(fromData.balance.replace(",", "")) * parseInt(pct) / 100).toString())} data-testid={`button-pct-${pct}`}>
                  {pct}%
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0" onClick={handleSwap} data-testid="button-swap-assets">
              <ArrowDownUp className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
            <div className="flex gap-3">
              <select
                value={toAsset}
                onChange={(e) => setToAsset(e.target.value)}
                className="w-32 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm font-medium text-gray-900 dark:text-white"
                data-testid="select-to-asset"
              >
                {cryptoAssets.map((a) => (
                  <option key={a.symbol} value={a.symbol}>{a.icon} {a.symbol}</option>
                ))}
              </select>
              <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-lg font-mono font-bold text-gray-900 dark:text-white" data-testid="text-converted-result">
                  {convertedAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Rate</span>
            <span className="font-mono text-gray-900 dark:text-white" data-testid="text-conversion-rate">
              1 {fromAsset} = {rate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {toAsset}
            </span>
          </div>

          <Button className="w-full" size="lg" data-testid="button-convert-crypto">
            <ArrowDownUp className="w-4 h-4 mr-2" />
            Convert {fromAsset} to {toAsset}
          </Button>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Market Prices</h3>
            <div className="space-y-3">
              {cryptoAssets.map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0" data-testid={`text-price-${asset.symbol.toLowerCase()}`}>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{asset.icon} {asset.symbol}</span>
                  <span className="text-sm font-mono text-gray-700 dark:text-gray-300">${asset.priceUsd.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Conversions</h3>
            <div className="space-y-3">
              {recentConversions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0" data-testid={`row-conversion-${tx.id}`}>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{tx.from} → {tx.to}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-500">
                    <CheckCircle2 className="w-3 h-3" />
                    {tx.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
