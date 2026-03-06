import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Wallet, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";

const cryptoAssets = [
  { symbol: "BTC", name: "Bitcoin", balance: "0.4523", usdValue: "$19,385.20", icon: "₿" },
  { symbol: "ETH", name: "Ethereum", balance: "3.2100", usdValue: "$7,421.50", icon: "Ξ" },
  { symbol: "USDT", name: "Tether", balance: "5,230.00", usdValue: "$5,230.00", icon: "₮" },
  { symbol: "USDC", name: "USD Coin", balance: "2,850.00", usdValue: "$2,850.00", icon: "$" },
];

const recentSends = [
  { id: "s1", to: "0x1a2b...8f9c", amount: "0.05 BTC", usd: "$2,142.50", time: "2h ago", status: "Completed" },
  { id: "s2", to: "0x3d4e...2a1b", amount: "150 USDT", usd: "$150.00", time: "1d ago", status: "Completed" },
  { id: "s3", to: "0x5f6g...4c3d", amount: "0.5 ETH", usd: "$1,155.80", time: "3d ago", status: "Completed" },
];

export default function CryptoSendPage() {
  const [selectedAsset, setSelectedAsset] = useState(cryptoAssets[0]);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-crypto-send-title">
          Send Crypto
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Send cryptocurrency to any wallet address
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Select Asset</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {cryptoAssets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedAsset.symbol === asset.symbol
                      ? "border-brand-500 bg-brand-500/5 dark:bg-brand-500/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  data-testid={`button-asset-${asset.symbol.toLowerCase()}`}
                >
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{asset.icon} {asset.symbol}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{asset.balance}</p>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recipient Address</label>
              <Input
                placeholder="Enter wallet address (0x...)"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                data-testid="input-recipient-address"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount ({selectedAsset.symbol})</label>
                <span className="text-xs text-gray-500">Available: {selectedAsset.balance} {selectedAsset.symbol}</span>
              </div>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="font-mono text-lg"
                data-testid="input-send-amount"
              />
              <div className="flex items-center gap-2">
                {["25", "50", "75", "100"].map((pct) => (
                  <Button key={pct} variant="outline" size="sm" onClick={() => setAmount((parseFloat(selectedAsset.balance.replace(",", "")) * parseInt(pct) / 100).toString())} data-testid={`button-pct-${pct}`}>
                    {pct}%
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Please verify the recipient address carefully. Crypto transactions are irreversible.
              </p>
            </div>

            <Button className="w-full" size="lg" data-testid="button-send-crypto">
              <Send className="w-4 h-4 mr-2" />
              Send {selectedAsset.symbol}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-brand-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Wallet Balance</h3>
            </div>
            <div className="space-y-3">
              {cryptoAssets.map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0" data-testid={`text-balance-${asset.symbol.toLowerCase()}`}>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{asset.icon} {asset.symbol}</span>
                  <div className="text-right">
                    <p className="text-sm font-mono text-gray-900 dark:text-white">{asset.balance}</p>
                    <p className="text-xs text-gray-500">{asset.usdValue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Transfers</h3>
            <div className="space-y-3">
              {recentSends.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0" data-testid={`row-recent-${tx.id}`}>
                  <div>
                    <p className="text-sm font-mono text-gray-900 dark:text-white">{tx.amount}</p>
                    <p className="text-xs text-gray-500">To: {tx.to}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{tx.usd}</p>
                    <div className="flex items-center gap-1 text-xs text-emerald-500">
                      <CheckCircle2 className="w-3 h-3" />
                      {tx.time}
                    </div>
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
