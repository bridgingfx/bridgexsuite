import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, Settings, Coins, Network, TrendingUp, ArrowDownUp } from "lucide-react";

interface CryptoConfig {
  name: string;
  symbol: string;
  enabled: boolean;
  price: string;
  volume24h: string;
  networks: { name: string; enabled: boolean }[];
  withdrawalFee: string;
  minWithdrawal: string;
  minDeposit: string;
}

const initialCryptos: CryptoConfig[] = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    enabled: true,
    price: "$67,234.50",
    volume24h: "$28.4B",
    networks: [
      { name: "Bitcoin", enabled: true },
      { name: "BNB BEP-20", enabled: false },
      { name: "Lightning", enabled: true },
    ],
    withdrawalFee: "0.0005",
    minWithdrawal: "0.001",
    minDeposit: "0.0001",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    enabled: true,
    price: "$3,456.78",
    volume24h: "$15.2B",
    networks: [
      { name: "ERC-20", enabled: true },
      { name: "Arbitrum", enabled: true },
      { name: "Optimism", enabled: false },
      { name: "BEP-20", enabled: true },
    ],
    withdrawalFee: "0.005",
    minWithdrawal: "0.01",
    minDeposit: "0.001",
  },
  {
    name: "Tether",
    symbol: "USDT",
    enabled: true,
    price: "$1.00",
    volume24h: "$52.1B",
    networks: [
      { name: "ERC-20", enabled: true },
      { name: "TRC-20", enabled: true },
      { name: "BEP-20", enabled: true },
      { name: "Solana", enabled: false },
      { name: "Polygon", enabled: true },
    ],
    withdrawalFee: "1.00",
    minWithdrawal: "10",
    minDeposit: "1",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    enabled: true,
    price: "$1.00",
    volume24h: "$8.7B",
    networks: [
      { name: "ERC-20", enabled: true },
      { name: "Solana", enabled: true },
      { name: "Polygon", enabled: false },
      { name: "Arbitrum", enabled: true },
    ],
    withdrawalFee: "1.00",
    minWithdrawal: "10",
    minDeposit: "1",
  },
  {
    name: "TRON",
    symbol: "TRX",
    enabled: false,
    price: "$0.1234",
    volume24h: "$890M",
    networks: [
      { name: "TRC-20", enabled: true },
      { name: "BEP-20", enabled: false },
    ],
    withdrawalFee: "1.00",
    minWithdrawal: "10",
    minDeposit: "1",
  },
  {
    name: "BNB",
    symbol: "BNB",
    enabled: true,
    price: "$598.45",
    volume24h: "$2.1B",
    networks: [
      { name: "BEP-20", enabled: true },
      { name: "BEP-2", enabled: false },
      { name: "ERC-20", enabled: false },
    ],
    withdrawalFee: "0.005",
    minWithdrawal: "0.01",
    minDeposit: "0.001",
  },
  {
    name: "Solana",
    symbol: "SOL",
    enabled: true,
    price: "$178.90",
    volume24h: "$3.4B",
    networks: [
      { name: "Solana", enabled: true },
      { name: "BEP-20", enabled: false },
    ],
    withdrawalFee: "0.01",
    minWithdrawal: "0.1",
    minDeposit: "0.01",
  },
  {
    name: "XRP",
    symbol: "XRP",
    enabled: false,
    price: "$0.6234",
    volume24h: "$1.8B",
    networks: [
      { name: "XRP Ledger", enabled: true },
      { name: "BEP-20", enabled: false },
    ],
    withdrawalFee: "0.25",
    minWithdrawal: "10",
    minDeposit: "1",
  },
];

export default function ExchangeSettingsPage() {
  const { toast } = useToast();
  const [cryptos, setCryptos] = useState<CryptoConfig[]>(initialCryptos);
  const [conversionFee, setConversionFee] = useState("0.5");

  const updateCrypto = (index: number, updates: Partial<CryptoConfig>) => {
    setCryptos((prev) => prev.map((c, i) => (i === index ? { ...c, ...updates } : c)));
  };

  const toggleNetwork = (cryptoIndex: number, networkIndex: number) => {
    setCryptos((prev) =>
      prev.map((c, ci) =>
        ci === cryptoIndex
          ? {
              ...c,
              networks: c.networks.map((n, ni) =>
                ni === networkIndex ? { ...n, enabled: !n.enabled } : n
              ),
            }
          : c
      )
    );
  };

  const handleSave = () => {
    toast({
      title: "Exchange settings saved",
      description: "Cryptocurrency exchange configuration has been updated successfully.",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="rounded-md bg-gradient-to-r from-orange-600 to-amber-500 p-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Coins className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-2xl font-bold text-white" data-testid="text-exchange-settings-title">
              Crypto Exchange Settings
            </h1>
            <p className="text-orange-100 text-sm">
              Configure supported cryptocurrencies, networks, and fee structures
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            <Settings className="w-5 h-5" />
            Supported Cryptocurrencies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {cryptos.map((crypto, index) => (
              <Card
                key={crypto.symbol}
                className={!crypto.enabled ? "opacity-60" : ""}
                data-testid={`card-crypto-${crypto.symbol.toLowerCase()}`}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold" data-testid={`text-crypto-name-${crypto.symbol.toLowerCase()}`}>
                        {crypto.name}
                      </span>
                      <Badge variant="secondary" data-testid={`badge-crypto-symbol-${crypto.symbol.toLowerCase()}`}>
                        {crypto.symbol}
                      </Badge>
                    </div>
                    <Switch
                      checked={crypto.enabled}
                      onCheckedChange={(v) => updateCrypto(index, { enabled: v })}
                      data-testid={`switch-crypto-${crypto.symbol.toLowerCase()}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Price</span>
                      <span className="text-sm font-medium" data-testid={`text-price-${crypto.symbol.toLowerCase()}`}>
                        {crypto.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">24h Volume</span>
                      <span className="text-sm font-medium" data-testid={`text-volume-${crypto.symbol.toLowerCase()}`}>
                        {crypto.volume24h}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            <Network className="w-5 h-5" />
            Network Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {cryptos
            .filter((c) => c.enabled)
            .map((crypto) => {
              const originalIndex = cryptos.findIndex((c) => c.symbol === crypto.symbol);
              return (
                <div key={crypto.symbol} className="space-y-2" data-testid={`network-config-${crypto.symbol.toLowerCase()}`}>
                  <h4 className="text-sm font-semibold">
                    {crypto.name} ({crypto.symbol}) Networks
                  </h4>
                  <div className="flex items-center gap-4 flex-wrap">
                    {crypto.networks.map((network, ni) => (
                      <div key={network.name} className="flex items-center gap-2">
                        <Checkbox
                          checked={network.enabled}
                          onCheckedChange={() => toggleNetwork(originalIndex, ni)}
                          data-testid={`checkbox-network-${crypto.symbol.toLowerCase()}-${network.name.toLowerCase().replace(/[\s-]+/g, "-")}`}
                        />
                        <span className="text-sm">{network.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            <TrendingUp className="w-5 h-5" />
            Fee Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 max-w-xs">
            <Label>Conversion Fee (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={conversionFee}
              onChange={(e) => setConversionFee(e.target.value)}
              data-testid="input-conversion-fee"
            />
          </div>

          <div className="space-y-4">
            {cryptos
              .filter((c) => c.enabled)
              .map((crypto) => {
                const originalIndex = cryptos.findIndex((c) => c.symbol === crypto.symbol);
                return (
                  <div
                    key={crypto.symbol}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
                    data-testid={`fee-row-${crypto.symbol.toLowerCase()}`}
                  >
                    <div className="flex items-center gap-2">
                      <ArrowDownUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {crypto.symbol}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Withdrawal Fee</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={crypto.withdrawalFee}
                        onChange={(e) => updateCrypto(originalIndex, { withdrawalFee: e.target.value })}
                        data-testid={`input-withdrawal-fee-${crypto.symbol.toLowerCase()}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Min Withdrawal</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={crypto.minWithdrawal}
                        onChange={(e) => updateCrypto(originalIndex, { minWithdrawal: e.target.value })}
                        data-testid={`input-min-withdrawal-${crypto.symbol.toLowerCase()}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Min Deposit</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={crypto.minDeposit}
                        onChange={(e) => updateCrypto(originalIndex, { minDeposit: e.target.value })}
                        data-testid={`input-min-deposit-${crypto.symbol.toLowerCase()}`}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} data-testid="button-save-exchange-settings">
          <Save className="w-4 h-4 mr-2" />
          Save Exchange Settings
        </Button>
      </div>
    </div>
  );
}
