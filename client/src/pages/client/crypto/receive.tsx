import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, QrCode, Wallet, CheckCircle2, Clock } from "lucide-react";

const cryptoAssets = [
  { symbol: "BTC", name: "Bitcoin", network: "Bitcoin", address: "bc1q84x2j7pv9n2k8r4f5y3z6w0t1qm9c8h7d5j2l", icon: "₿" },
  { symbol: "ETH", name: "Ethereum", network: "Ethereum (ERC-20)", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", icon: "Ξ" },
  { symbol: "USDT", name: "Tether", network: "Ethereum (ERC-20)", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", icon: "₮" },
  { symbol: "USDC", name: "USD Coin", network: "Ethereum (ERC-20)", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", icon: "$" },
];

const recentReceives = [
  { id: "r1", from: "0x7e8f...3b2a", amount: "0.15 BTC", usd: "$6,427.50", time: "5h ago", status: "Completed" },
  { id: "r2", from: "0x9c0d...5e4f", amount: "500 USDT", usd: "$500.00", time: "1d ago", status: "Completed" },
  { id: "r3", from: "0x2a1b...8g7h", amount: "1.2 ETH", usd: "$2,773.92", time: "2d ago", status: "Pending" },
];

export default function CryptoReceivePage() {
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState(cryptoAssets[0]);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedAsset.address).then(() => {
      toast({ title: "Address copied to clipboard!" });
    });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-crypto-receive-title">
          Receive Crypto
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Share your wallet address to receive cryptocurrency
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">{asset.name}</p>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Network</label>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white" data-testid="text-network">{selectedAsset.network}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your {selectedAsset.symbol} Address</label>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3">
                <p className="text-sm font-mono text-gray-900 dark:text-white break-all" data-testid="text-wallet-address">
                  {selectedAsset.address}
                </p>
                <Button variant="outline" size="sm" onClick={handleCopy} data-testid="button-copy-address">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-center py-6">
              <div className="w-48 h-48 bg-white rounded-xl border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center" data-testid="qr-code-placeholder">
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">QR Code</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Only send {selectedAsset.symbol} on the {selectedAsset.network} network. Sending other assets or using a different network may result in permanent loss.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Deposits</h3>
            <div className="space-y-3">
              {recentReceives.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0" data-testid={`row-recent-${tx.id}`}>
                  <div>
                    <p className="text-sm font-mono text-gray-900 dark:text-white">{tx.amount}</p>
                    <p className="text-xs text-gray-500">From: {tx.from}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{tx.usd}</p>
                    <div className={`flex items-center gap-1 text-xs ${tx.status === "Completed" ? "text-emerald-500" : "text-amber-500"}`}>
                      {tx.status === "Completed" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
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
