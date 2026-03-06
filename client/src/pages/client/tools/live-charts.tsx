import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CandlestickChart, BarChart3, TrendingUp, Maximize2 } from "lucide-react";

const symbols = [
  { label: "EUR/USD", value: "FX:EURUSD" },
  { label: "GBP/USD", value: "FX:GBPUSD" },
  { label: "USD/JPY", value: "FX:USDJPY" },
  { label: "USD/CHF", value: "FX:USDCHF" },
  { label: "AUD/USD", value: "FX:AUDUSD" },
  { label: "BTC/USD", value: "BITSTAMP:BTCUSD" },
  { label: "ETH/USD", value: "BITSTAMP:ETHUSD" },
  { label: "XAU/USD", value: "TVC:GOLD" },
];

const timeframes = ["1m", "5m", "15m", "1H", "4H", "1D", "1W"];

export default function LiveChartsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSymbol, setActiveSymbol] = useState(symbols[0]);
  const [activeTimeframe, setActiveTimeframe] = useState("1H");

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof (window as any).TradingView !== "undefined" && containerRef.current) {
        new (window as any).TradingView.widget({
          container_id: containerRef.current.id,
          symbol: activeSymbol.value,
          interval: activeTimeframe === "1m" ? "1" : activeTimeframe === "5m" ? "5" : activeTimeframe === "15m" ? "15" : activeTimeframe === "1H" ? "60" : activeTimeframe === "4H" ? "240" : activeTimeframe === "1D" ? "D" : "W",
          theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          width: "100%",
          height: "500",
          save_image: false,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [activeSymbol, activeTimeframe]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-live-charts-title">
          Live Charts
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Real-time charts powered by TradingView
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <CandlestickChart className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Symbol:</span>
        </div>
        {symbols.map((sym) => (
          <Button
            key={sym.value}
            variant={activeSymbol.value === sym.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSymbol(sym)}
            data-testid={`button-symbol-${sym.label.toLowerCase().replace("/", "")}`}
          >
            {sym.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Timeframe:</span>
        </div>
        {timeframes.map((tf) => (
          <Button
            key={tf}
            variant={activeTimeframe === tf ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTimeframe(tf)}
            data-testid={`button-timeframe-${tf.toLowerCase()}`}
          >
            {tf}
          </Button>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-1">
        <div id="tradingview-chart" ref={containerRef} data-testid="chart-tradingview-container" className="min-h-[500px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current Symbol</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-current-symbol">{activeSymbol.label}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Timeframe</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-current-timeframe">{activeTimeframe}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Maximize2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Chart Type</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">Candlestick</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
