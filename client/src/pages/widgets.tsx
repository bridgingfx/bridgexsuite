import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  BarChart3,
  Clock,
  Newspaper,
  Calculator,
  Globe,
  TrendingUp,
  Settings,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Widget {
  title: string;
  description: string;
  icon: typeof Clock;
  enabled: boolean;
  category: string;
  color: string;
  bg: string;
}

const initialWidgets: Widget[] = [
  {
    title: "Economic Calendar",
    description: "Stay updated with upcoming economic events, central bank decisions, and their expected impact on forex and commodity markets.",
    icon: Clock,
    enabled: true,
    category: "Market Data",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Market News",
    description: "Live financial news feed covering forex, commodities, indices, and global macro events from top sources.",
    icon: Newspaper,
    enabled: true,
    category: "Market Data",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    title: "Currency Converter",
    description: "Quick currency conversion tool supporting all major, minor, and exotic pairs with real-time exchange rates.",
    icon: Calculator,
    enabled: false,
    category: "Tools",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    title: "Live Charts",
    description: "Interactive price charts with 50+ technical indicators, drawing tools, and multi-timeframe analysis for real-time trading.",
    icon: BarChart3,
    enabled: true,
    category: "Analysis",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    title: "Market Sentiment",
    description: "See how retail and institutional traders are positioned across major currency pairs and commodities.",
    icon: TrendingUp,
    enabled: false,
    category: "Analysis",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
  },
  {
    title: "World Clock",
    description: "Track market sessions across major financial centers — New York, London, Tokyo, Sydney — with timezone overlays.",
    icon: Globe,
    enabled: false,
    category: "Tools",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
  },
];

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState(initialWidgets);

  const toggleWidget = (index: number) => {
    setWidgets((prev) =>
      prev.map((w, i) => (i === index ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const enabledCount = widgets.filter((w) => w.enabled).length;

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
        <div className="flex items-center gap-2">
          <Badge variant="secondary" data-testid="text-active-count">
            {enabledCount} Active
          </Badge>
          <Badge variant="secondary">
            {widgets.length - enabledCount} Inactive
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Widgets", value: widgets.length.toString(), icon: <LayoutGrid className="w-5 h-5" />, iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
          { label: "Active Widgets", value: enabledCount.toString(), icon: <CheckCircle2 className="w-5 h-5" />, iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
          { label: "Inactive Widgets", value: (widgets.length - enabledCount).toString(), icon: <XCircle className="w-5 h-5" />, iconBg: "bg-gray-100 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400" },
          { label: "Categories", value: "3", icon: <Settings className="w-5 h-5" />, iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, i) => (
          <div
            key={i}
            className={`bg-card rounded-xl border shadow-sm hover:shadow-md transition-all p-6 ${widget.enabled ? "border-emerald-200 dark:border-emerald-800/50" : ""}`}
            data-testid={`widget-card-${i}`}
          >
            <div className="flex items-start justify-between gap-2 mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${widget.bg}`}>
                  <widget.icon className={`w-5 h-5 ${widget.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{widget.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{widget.category}</p>
                </div>
              </div>
              <Badge variant={widget.enabled ? "default" : "secondary"}>
                {widget.enabled ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{widget.description}</p>
            <Button
              variant={widget.enabled ? "outline" : "default"}
              className="w-full"
              onClick={() => toggleWidget(i)}
              data-testid={`button-widget-toggle-${i}`}
            >
              {widget.enabled ? (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Disable Widget
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Enable Widget
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
