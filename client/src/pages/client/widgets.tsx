import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useWidgetVisibility } from "@/hooks/use-widget-visibility";
import {
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Settings,
  TrendingUp,
  Trophy,
  Award,
  PiggyBank,
  Star,
  Download,
  Bitcoin,
  Calendar,
  LineChart,
  Newspaper,
  ArrowDownUp,
  Sparkles,
  Radio,
  Calculator,
} from "lucide-react";

interface WidgetDef {
  title: string;
  description: string;
  icon: typeof TrendingUp;
  category: string;
  color: string;
  bg: string;
}

const widgetDefs: WidgetDef[] = [
  {
    title: "Forex Trading",
    description: "Access global forex markets with competitive spreads, leverage options, and advanced order management for all major, minor, and exotic currency pairs.",
    icon: TrendingUp,
    category: "Trading",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Prop Trading",
    description: "Join funded trading challenges with professional capital allocation, profit sharing, and risk management frameworks for aspiring traders.",
    icon: Trophy,
    category: "Trading",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  {
    title: "Leagues",
    description: "Compete in trading leagues and tournaments against other traders, climb leaderboards, and win prizes based on your performance.",
    icon: Award,
    category: "Trading",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    title: "Investments",
    description: "Build and manage diversified investment portfolios with access to stocks, ETFs, bonds, and managed fund options for long-term growth.",
    icon: PiggyBank,
    category: "Trading",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    title: "Loyalty Points",
    description: "Earn loyalty points through trading activity and engagement, redeem for exclusive rewards, fee discounts, and premium features.",
    icon: Star,
    category: "Rewards",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    title: "Download Platform",
    description: "Download and install desktop and mobile trading platforms including MetaTrader 4, MetaTrader 5, and proprietary trading applications.",
    icon: Download,
    category: "Platform",
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
  },
  {
    title: "Crypto Exchange",
    description: "Trade cryptocurrencies including Bitcoin, Ethereum, and altcoins with secure wallet management, instant swaps, and competitive fees.",
    icon: Bitcoin,
    category: "Trading",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    title: "Economic Calendar",
    description: "Stay updated with upcoming economic events, central bank decisions, and their expected impact on forex and commodity markets.",
    icon: Calendar,
    category: "Tools",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/20",
  },
  {
    title: "Live Charts",
    description: "Interactive price charts with 50+ technical indicators, drawing tools, and multi-timeframe analysis for real-time trading decisions.",
    icon: LineChart,
    category: "Tools",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    title: "Market News",
    description: "Live financial news feed covering forex, commodities, indices, and global macro events from top sources worldwide.",
    icon: Newspaper,
    category: "Tools",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    title: "Currency Converter",
    description: "Quick currency conversion tool supporting all major, minor, and exotic pairs with real-time exchange rates and historical data.",
    icon: ArrowDownUp,
    category: "Tools",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-900/20",
  },
  {
    title: "AI Center",
    description: "Access AI-powered market analysis, automated pattern recognition, sentiment analysis, and intelligent trading recommendations.",
    icon: Sparkles,
    category: "Tools",
    color: "text-fuchsia-600 dark:text-fuchsia-400",
    bg: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
  },
  {
    title: "Trading Signals",
    description: "Receive AI-powered trading signals with entry/exit points, stop-loss, and take-profit levels for major currency pairs.",
    icon: Radio,
    category: "Tools",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20",
  },
];

export default function WidgetsPage() {
  const { visibility, setVisibility, isVisible } = useWidgetVisibility();

  const enabledCount = widgetDefs.filter((w) => isVisible(w.title)).length;
  const categoriesSet = new Set(widgetDefs.map((w) => w.category));
  const categoriesCount = categoriesSet.size;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <LayoutGrid className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-page-title">Widgets</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customize your dashboard with trading widgets</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" data-testid="text-active-count">
            {enabledCount} Active
          </Badge>
          <Badge variant="secondary" data-testid="text-inactive-count">
            {widgetDefs.length - enabledCount} Inactive
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Widgets", value: widgetDefs.length.toString(), icon: <LayoutGrid className="w-5 h-5" />, iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
          { label: "Active Widgets", value: enabledCount.toString(), icon: <CheckCircle2 className="w-5 h-5" />, iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
          { label: "Inactive Widgets", value: (widgetDefs.length - enabledCount).toString(), icon: <XCircle className="w-5 h-5" />, iconBg: "bg-gray-100 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400" },
          { label: "Categories", value: categoriesCount.toString(), icon: <Settings className="w-5 h-5" />, iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
        ].map((card) => (
          <div key={card.label} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6" data-testid={`stat-card-${card.label.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="flex justify-between items-start gap-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgetDefs.map((widget, i) => {
          const enabled = isVisible(widget.title);
          return (
            <div
              key={widget.title}
              className={`bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6 ${enabled ? "border-emerald-200 dark:border-emerald-800/50" : ""}`}
              data-testid={`widget-card-${i}`}
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${widget.bg}`}>
                    <widget.icon className={`w-5 h-5 ${widget.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white" data-testid={`text-widget-title-${i}`}>{widget.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400" data-testid={`text-widget-category-${i}`}>{widget.category}</p>
                  </div>
                </div>
                <Badge variant={enabled ? "default" : "secondary"} data-testid={`badge-widget-status-${i}`}>
                  {enabled ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed" data-testid={`text-widget-description-${i}`}>{widget.description}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {enabled ? "Enabled" : "Disabled"}
                </span>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => setVisibility(widget.title, !enabled)}
                  data-testid={`switch-widget-toggle-${i}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
