import { TrendingUp, TrendingDown } from "lucide-react";

const tickerData = [
  { symbol: "EUR/USD", price: "1.0832", change: "+0.12%", up: true },
  { symbol: "GBP/USD", price: "1.2640", change: "-0.05%", up: false },
  { symbol: "USD/JPY", price: "150.20", change: "+0.45%", up: true },
  { symbol: "XAU/USD", price: "2,035.10", change: "+1.20%", up: true },
  { symbol: "XAG/USD", price: "22.45", change: "+0.80%", up: true },
  { symbol: "US30", price: "38,500", change: "+0.50%", up: true },
  { symbol: "NAS100", price: "17,650", change: "-0.20%", up: false },
  { symbol: "SPX500", price: "4,950", change: "+0.35%", up: true },
  { symbol: "BTC/USD", price: "43,500", change: "+2.10%", up: true },
  { symbol: "ETH/USD", price: "2,250", change: "+1.80%", up: true },
  { symbol: "SOL/USD", price: "98.50", change: "-1.50%", up: false },
];

export function TickerBar() {
  const doubled = [...tickerData, ...tickerData];

  return (
    <div className="bg-slate-950 border-b border-slate-800 overflow-hidden h-9 flex items-center relative z-20 shrink-0" data-testid="ticker-bar">
      <div className="flex animate-ticker whitespace-nowrap">
        {doubled.map((item, i) => (
          <div
            key={`${item.symbol}-${i}`}
            className="flex items-center gap-2 px-6 border-r border-slate-800/60 group cursor-default hover:bg-slate-900/50 transition-colors h-9"
          >
            <span className="font-bold text-xs text-slate-400 group-hover:text-slate-200">
              {item.symbol}
            </span>
            <span className="font-mono text-xs text-white">{item.price}</span>
            <span className={`text-xs flex items-center ${item.up ? "text-emerald-400" : "text-red-400"}`}>
              {item.up ? (
                <TrendingUp size={10} className="mr-0.5" />
              ) : (
                <TrendingDown size={10} className="mr-0.5" />
              )}
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
