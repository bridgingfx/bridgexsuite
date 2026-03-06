import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, QrCode, CheckCircle2, Clock } from "lucide-react";

interface Network {
  name: string;
  address: string;
  minDeposit: string;
  confirmations: string;
}

interface CryptoAsset {
  symbol: string;
  name: string;
  networks: Network[];
}

const cryptoAssets: CryptoAsset[] = [
  {
    symbol: "BTC", name: "Bitcoin",
    networks: [
      { name: "Bitcoin", address: "bc1q84x2j7pv9n2k8r4f5y3z6w0t1qm9c8h7d5j2l", minDeposit: "0.0001 BTC", confirmations: "2 confirmations" },
      { name: "BNB Smart Chain (BEP-20)", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", minDeposit: "0.0001 BTC", confirmations: "15 confirmations" },
      { name: "Lightning Network", address: "lnbc1pvjluezsp5...qqqqqqqqqqqqqq", minDeposit: "0.000001 BTC", confirmations: "Instant" },
    ],
  },
  {
    symbol: "ETH", name: "Ethereum",
    networks: [
      { name: "Ethereum (ERC-20)", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", minDeposit: "0.001 ETH", confirmations: "12 confirmations" },
      { name: "Arbitrum One", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", minDeposit: "0.001 ETH", confirmations: "12 confirmations" },
      { name: "Optimism", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", minDeposit: "0.001 ETH", confirmations: "12 confirmations" },
      { name: "BNB Smart Chain (BEP-20)", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", minDeposit: "0.001 ETH", confirmations: "15 confirmations" },
    ],
  },
  {
    symbol: "TRX", name: "Tron",
    networks: [
      { name: "Tron (TRC-20)", address: "TXk93nFQp8M2R7v6JwZ1K5dL9cY2hN3mP2", minDeposit: "1 TRX", confirmations: "20 confirmations" },
    ],
  },
  {
    symbol: "USDT", name: "Tether",
    networks: [
      { name: "Ethereum (ERC-20)", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", minDeposit: "10 USDT", confirmations: "12 confirmations" },
      { name: "Tron (TRC-20)", address: "TXk93nFQp8M2R7v6JwZ1K5dL9cY2hN3mP2", minDeposit: "1 USDT", confirmations: "20 confirmations" },
      { name: "BNB Smart Chain (BEP-20)", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", minDeposit: "1 USDT", confirmations: "15 confirmations" },
      { name: "Solana", address: "7K5f...9mVq", minDeposit: "1 USDT", confirmations: "32 confirmations" },
      { name: "Polygon", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", minDeposit: "1 USDT", confirmations: "128 confirmations" },
    ],
  },
  {
    symbol: "USDC", name: "USD Coin",
    networks: [
      { name: "Ethereum (ERC-20)", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", minDeposit: "10 USDC", confirmations: "12 confirmations" },
      { name: "Tron (TRC-20)", address: "TXk93nFQp8M2R7v6JwZ1K5dL9cY2hN3mP2", minDeposit: "1 USDC", confirmations: "20 confirmations" },
      { name: "BNB Smart Chain (BEP-20)", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", minDeposit: "1 USDC", confirmations: "15 confirmations" },
      { name: "Solana", address: "7K5f...9mVq", minDeposit: "1 USDC", confirmations: "32 confirmations" },
      { name: "Polygon", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", minDeposit: "1 USDC", confirmations: "128 confirmations" },
      { name: "Arbitrum One", address: "0x1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t", minDeposit: "1 USDC", confirmations: "12 confirmations" },
    ],
  },
];

const recentReceives = [
  { id: "r1", from: "0x7e8f...3b2a", amount: "0.15 BTC", usd: "$6,427.50", time: "5h ago", status: "Completed" },
  { id: "r2", from: "TXk9...3mP2", amount: "500 USDT", usd: "$500.00", time: "1d ago", status: "Completed" },
  { id: "r3", from: "0x2a1b...8g7h", amount: "1.2 ETH", usd: "$2,773.92", time: "2d ago", status: "Pending" },
];

export default function CryptoReceivePage() {
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState(cryptoAssets[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(cryptoAssets[0].networks[0]);

  function handleAssetChange(asset: CryptoAsset) {
    setSelectedAsset(asset);
    setSelectedNetwork(asset.networks[0]);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedNetwork.address).then(() => {
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
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {cryptoAssets.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => handleAssetChange(asset)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedAsset.symbol === asset.symbol
                      ? "border-brand-500 bg-brand-500/5 dark:bg-brand-500/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  data-testid={`button-asset-${asset.symbol.toLowerCase()}`}
                >
                  <p className="text-base font-bold text-gray-900 dark:text-white">{asset.symbol}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{asset.name}</p>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Network</label>
              <div className="grid gap-2">
                {selectedAsset.networks.map((network) => (
                  <button
                    key={network.name}
                    onClick={() => setSelectedNetwork(network)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      selectedNetwork.name === network.name
                        ? "border-brand-500 bg-brand-500/5 dark:bg-brand-500/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    data-testid={`button-network-${network.name.toLowerCase().replace(/[\s()/-]/g, '-')}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{network.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{network.confirmations}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Min deposit: {network.minDeposit}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your {selectedAsset.symbol} Address ({selectedNetwork.name})</label>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3">
                <p className="text-sm font-mono text-gray-900 dark:text-white break-all" data-testid="text-wallet-address">
                  {selectedNetwork.address}
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

            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Network</span>
                <span className="font-medium text-gray-900 dark:text-white" data-testid="text-selected-network">{selectedNetwork.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Min Deposit</span>
                <span className="font-mono text-gray-900 dark:text-white" data-testid="text-min-deposit">{selectedNetwork.minDeposit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Confirmations</span>
                <span className="text-gray-900 dark:text-white" data-testid="text-confirmations">{selectedNetwork.confirmations}</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Only send {selectedAsset.symbol} on the <strong>{selectedNetwork.name}</strong> network. Sending other assets or using a different network may result in permanent loss.
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
