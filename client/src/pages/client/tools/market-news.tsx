import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, Clock, TrendingUp, Globe, AlertTriangle } from "lucide-react";
import { useState } from "react";

type NewsCategory = "All" | "Forex" | "Crypto" | "Stocks" | "Commodities";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: Exclude<NewsCategory, "All">;
  source: string;
  time: string;
  impact: "High" | "Medium" | "Low";
  image?: string;
}

const demoNews: NewsItem[] = [
  { id: "n1", title: "Fed Signals Potential Rate Cut in Q2 2025", summary: "Federal Reserve Chair hints at possible rate cuts as inflation shows signs of cooling. Markets rally on the news with major indices posting significant gains.", category: "Forex", source: "Reuters", time: "2h ago", impact: "High" },
  { id: "n2", title: "Bitcoin Surges Past $45,000 on ETF Optimism", summary: "BTC breaks through key resistance as institutional interest grows with spot ETF approval rumors gaining momentum.", category: "Crypto", source: "CoinDesk", time: "4h ago", impact: "High" },
  { id: "n3", title: "ECB Maintains Interest Rates, Euro Weakens", summary: "The European Central Bank holds rates steady at 4.50%, signaling a cautious approach amid mixed economic data.", category: "Forex", source: "Bloomberg", time: "6h ago", impact: "Medium" },
  { id: "n4", title: "Gold Hits 3-Month High on Safe Haven Demand", summary: "XAU/USD reaches $2,055 as geopolitical tensions and central bank buying drive precious metal prices higher.", category: "Commodities", source: "MarketWatch", time: "8h ago", impact: "Medium" },
  { id: "n5", title: "Apple Reports Record Revenue, Stock Jumps 5%", summary: "Tech giant beats earnings expectations with strong iPhone sales and growing services revenue.", category: "Stocks", source: "CNBC", time: "12h ago", impact: "Medium" },
  { id: "n6", title: "Ethereum 2.0 Staking Reaches All-Time High", summary: "Over 30 million ETH now staked on the Beacon Chain as the network continues its proof-of-stake transition.", category: "Crypto", source: "The Block", time: "1d ago", impact: "Low" },
  { id: "n7", title: "Oil Prices Drop on Increased US Production", summary: "Crude oil falls below $75 per barrel as US shale production reaches record levels.", category: "Commodities", source: "Reuters", time: "1d ago", impact: "Medium" },
  { id: "n8", title: "BOJ Considers Yield Curve Control Adjustment", summary: "Bank of Japan officials discuss potential changes to monetary policy framework. Yen strengthens on speculation.", category: "Forex", source: "Nikkei", time: "1d ago", impact: "High" },
];

const impactColors = {
  High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const categoryColors: Record<string, string> = {
  Forex: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Crypto: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Stocks: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Commodities: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const filterTabs: NewsCategory[] = ["All", "Forex", "Crypto", "Stocks", "Commodities"];

export default function MarketNewsPage() {
  const [category, setCategory] = useState<NewsCategory>("All");
  const filtered = category === "All" ? demoNews : demoNews.filter((n) => n.category === category);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-market-news-title">
          Market News
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Latest financial news and market updates
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total News</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-total-news">{demoNews.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">High Impact</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-high-impact-news">{demoNews.filter((n) => n.impact === "High").length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sources</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-sources-count">{new Set(demoNews.map((n) => n.source)).size}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white" data-testid="text-categories-count">4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {filterTabs.map((tab) => (
          <Button
            key={tab}
            variant={category === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory(tab)}
            data-testid={`button-filter-${tab.toLowerCase()}`}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((news) => (
          <div key={news.id} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5" data-testid={`card-news-${news.id}`}>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-snug">{news.title}</h3>
              <Badge className={impactColors[news.impact]}>{news.impact}</Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{news.summary}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={categoryColors[news.category]}>{news.category}</Badge>
                <span>{news.source}</span>
              </div>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{news.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
