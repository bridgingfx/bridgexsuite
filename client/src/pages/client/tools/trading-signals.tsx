import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Clock, Target, AlertTriangle, BarChart3 } from "lucide-react";
import { useState } from "react";

type SignalDirection = "Buy" | "Sell";
type SignalStatus = "Active" | "Hit TP" | "Hit SL" | "Expired";

interface Signal {
  id: string;
  pair: string;
  direction: SignalDirection;
  entry: string;
  tp1: string;
  tp2: string;
  sl: string;
  status: SignalStatus;
  confidence: number;
  time: string;
  provider: string;
}

const demoSignals: Signal[] = [
  { id: "s1", pair: "EUR/USD", direction: "Buy", entry: "1.0852", tp1: "1.0910", tp2: "1.0965", sl: "1.0790", status: "Active", confidence: 85, time: "2h ago", provider: "BridgeX AI" },
  { id: "s2", pair: "GBP/USD", direction: "Sell", entry: "1.2670", tp1: "1.2600", tp2: "1.2540", sl: "1.2740", status: "Active", confidence: 78, time: "4h ago", provider: "BridgeX AI" },
  { id: "s3", pair: "USD/JPY", direction: "Buy", entry: "149.50", tp1: "150.20", tp2: "150.80", sl: "148.80", status: "Hit TP", confidence: 92, time: "1d ago", provider: "Pro Signals" },
  { id: "s4", pair: "XAU/USD", direction: "Buy", entry: "2035.00", tp1: "2055.00", tp2: "2075.00", sl: "2015.00", status: "Active", confidence: 88, time: "6h ago", provider: "BridgeX AI" },
  { id: "s5", pair: "AUD/USD", direction: "Sell", entry: "0.6531", tp1: "0.6470", tp2: "0.6420", sl: "0.6590", status: "Hit SL", confidence: 65, time: "2d ago", provider: "Pro Signals" },
  { id: "s6", pair: "EUR/GBP", direction: "Buy", entry: "0.8566", tp1: "0.8620", tp2: "0.8670", sl: "0.8510", status: "Active", confidence: 72, time: "1h ago", provider: "BridgeX AI" },
  { id: "s7", pair: "USD/CAD", direction: "Sell", entry: "1.3587", tp1: "1.3520", tp2: "1.3450", sl: "1.3650", status: "Expired", confidence: 60, time: "3d ago", provider: "Pro Signals" },
  { id: "s8", pair: "BTC/USD", direction: "Buy", entry: "42850", tp1: "44000", tp2: "45500", sl: "41500", status: "Active", confidence: 80, time: "3h ago", provider: "BridgeX AI" },
];

const statusColors: Record<SignalStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "Hit TP": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Hit SL": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Expired: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

const filterOptions = ["All", "Active", "Hit TP", "Hit SL", "Expired"] as const;

export default function TradingSignalsPage() {
  const [filter, setFilter] = useState<string>("All");
  const filtered = filter === "All" ? demoSignals : demoSignals.filter((s) => s.status === filter);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-trading-signals-title">
          Trading Signals
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          AI-powered trading signals with entry, TP, and SL levels
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-active-signals">{demoSignals.filter((s) => s.status === "Active").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hit TP</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-hittp-signals">{demoSignals.filter((s) => s.status === "Hit TP").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hit SL</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-hitsl-signals">{demoSignals.filter((s) => s.status === "Hit SL").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-win-rate">72%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {filterOptions.map((opt) => (
          <Button
            key={opt}
            variant={filter === opt ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(opt)}
            data-testid={`button-filter-${opt.toLowerCase().replace(" ", "-")}`}
          >
            {opt}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((signal) => (
          <div key={signal.id} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5" data-testid={`card-signal-${signal.id}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">{signal.pair}</span>
                <Badge className={signal.direction === "Buy" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}>
                  {signal.direction === "Buy" ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {signal.direction}
                </Badge>
              </div>
              <Badge className={statusColors[signal.status]}>{signal.status}</Badge>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Entry</p>
                <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">{signal.entry}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">TP 1</p>
                <p className="text-sm font-mono font-semibold text-emerald-600 dark:text-emerald-400">{signal.tp1}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">TP 2</p>
                <p className="text-sm font-mono font-semibold text-emerald-600 dark:text-emerald-400">{signal.tp2}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">SL</p>
                <p className="text-sm font-mono font-semibold text-red-600 dark:text-red-400">{signal.sl}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{signal.time}</span>
                <span>{signal.provider}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Confidence:</span>
                <span className={`font-semibold ${signal.confidence >= 80 ? "text-emerald-500" : signal.confidence >= 60 ? "text-amber-500" : "text-red-500"}`}>
                  {signal.confidence}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
