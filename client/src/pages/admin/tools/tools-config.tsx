import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  Calendar,
  LineChart,
  ArrowLeftRight,
  Signal,
  Newspaper,
  Brain,
  ChevronUp,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";

interface SignalProvider {
  id: number;
  name: string;
  winRate: number;
  subscribers: number;
  status: "active" | "inactive";
  fee: string;
}

const initialSignalProviders: SignalProvider[] = [
  { id: 1, name: "FX Leaders", winRate: 72, subscribers: 14200, status: "active", fee: "$49/mo" },
  { id: 2, name: "MQL5 Signals", winRate: 68, subscribers: 31500, status: "active", fee: "$30/mo" },
  { id: 3, name: "ZuluTrade", winRate: 65, subscribers: 8900, status: "active", fee: "Free" },
  { id: 4, name: "TradingView Signals", winRate: 71, subscribers: 22100, status: "inactive", fee: "$39/mo" },
  { id: 5, name: "AutoTrade Pro", winRate: 59, subscribers: 4300, status: "inactive", fee: "$25/mo" },
];

interface ToolOrder {
  id: string;
  label: string;
}

export default function ToolsConfigPage() {
  const { toast } = useToast();

  const [economicCalendar, setEconomicCalendar] = useState({
    enabled: true,
    provider: "tradingview",
    refreshInterval: "5min",
  });

  const [liveCharts, setLiveCharts] = useState({
    enabled: true,
    provider: "tradingview",
    defaultTimeframe: "1h",
  });

  const [currencyConverter, setCurrencyConverter] = useState({
    enabled: true,
    rateProvider: "ecb",
    updateFrequency: "hourly",
  });

  const [tradingSignals, setTradingSignals] = useState({
    enabled: true,
  });

  const [marketNews, setMarketNews] = useState({
    enabled: true,
    sources: {
      reuters: true,
      bloomberg: true,
      forexlive: false,
      fxstreet: true,
      dailyfx: false,
    },
  });

  const [aiCenter, setAiCenter] = useState({
    enabled: false,
    provider: "openai",
    maxQueriesPerDay: "100",
  });

  const [signalProviders, setSignalProviders] = useState<SignalProvider[]>(initialSignalProviders);

  const [toolOrder, setToolOrder] = useState<ToolOrder[]>([
    { id: "economic-calendar", label: "Economic Calendar" },
    { id: "live-charts", label: "Live Charts" },
    { id: "currency-converter", label: "Currency Converter" },
    { id: "trading-signals", label: "Trading Signals" },
    { id: "market-news", label: "Market News" },
    { id: "ai-center", label: "AI Center" },
  ]);

  const moveToolOrder = (index: number, direction: "up" | "down") => {
    const newOrder = [...toolOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setToolOrder(newOrder);
  };

  const toggleProviderStatus = (id: number) => {
    setSignalProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
      )
    );
  };

  const removeProvider = (id: number) => {
    setSignalProviders((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Signal provider removed" });
  };

  const addProvider = () => {
    const newId = Math.max(...signalProviders.map((p) => p.id), 0) + 1;
    setSignalProviders((prev) => [
      ...prev,
      { id: newId, name: `New Provider ${newId}`, winRate: 0, subscribers: 0, status: "inactive", fee: "TBD" },
    ]);
    toast({ title: "New signal provider added" });
  };

  const handleSaveAll = () => {
    toast({ title: "All tools settings saved successfully" });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="rounded-md bg-gradient-to-r from-slate-700 to-gray-600 p-6">
        <h1 className="text-2xl font-bold tracking-tight text-white" data-testid="text-tools-config-title">
          Tools Configuration
        </h1>
        <p className="text-sm text-slate-200 mt-1" data-testid="text-tools-config-subtitle">
          Manage and configure client-facing tools, providers, and display settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card data-testid="card-economic-calendar">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base">Economic Calendar</CardTitle>
            </div>
            <Switch
              checked={economicCalendar.enabled}
              onCheckedChange={(v) => setEconomicCalendar({ ...economicCalendar, enabled: v })}
              data-testid="switch-economic-calendar"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API Provider</Label>
              <Select
                value={economicCalendar.provider}
                onValueChange={(v) => setEconomicCalendar({ ...economicCalendar, provider: v })}
              >
                <SelectTrigger data-testid="select-calendar-provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tradingview">TradingView</SelectItem>
                  <SelectItem value="myfxbook">Myfxbook</SelectItem>
                  <SelectItem value="forexfactory">ForexFactory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Refresh Interval</Label>
              <Select
                value={economicCalendar.refreshInterval}
                onValueChange={(v) => setEconomicCalendar({ ...economicCalendar, refreshInterval: v })}
              >
                <SelectTrigger data-testid="select-calendar-refresh">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1min">1 Minute</SelectItem>
                  <SelectItem value="5min">5 Minutes</SelectItem>
                  <SelectItem value="15min">15 Minutes</SelectItem>
                  <SelectItem value="30min">30 Minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-live-charts">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <LineChart className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base">Live Charts</CardTitle>
            </div>
            <Switch
              checked={liveCharts.enabled}
              onCheckedChange={(v) => setLiveCharts({ ...liveCharts, enabled: v })}
              data-testid="switch-live-charts"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select
                value={liveCharts.provider}
                onValueChange={(v) => setLiveCharts({ ...liveCharts, provider: v })}
              >
                <SelectTrigger data-testid="select-charts-provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tradingview">TradingView</SelectItem>
                  <SelectItem value="metatrader">MetaTrader</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Timeframe</Label>
              <Select
                value={liveCharts.defaultTimeframe}
                onValueChange={(v) => setLiveCharts({ ...liveCharts, defaultTimeframe: v })}
              >
                <SelectTrigger data-testid="select-charts-timeframe">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-currency-converter">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base">Currency Converter</CardTitle>
            </div>
            <Switch
              checked={currencyConverter.enabled}
              onCheckedChange={(v) => setCurrencyConverter({ ...currencyConverter, enabled: v })}
              data-testid="switch-currency-converter"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Rate Provider</Label>
              <Select
                value={currencyConverter.rateProvider}
                onValueChange={(v) => setCurrencyConverter({ ...currencyConverter, rateProvider: v })}
              >
                <SelectTrigger data-testid="select-converter-provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecb">ECB</SelectItem>
                  <SelectItem value="openexchange">OpenExchange</SelectItem>
                  <SelectItem value="fixer">Fixer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Update Frequency</Label>
              <Select
                value={currencyConverter.updateFrequency}
                onValueChange={(v) => setCurrencyConverter({ ...currencyConverter, updateFrequency: v })}
              >
                <SelectTrigger data-testid="select-converter-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-trading-signals">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Signal className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base">Trading Signals</CardTitle>
            </div>
            <Switch
              checked={tradingSignals.enabled}
              onCheckedChange={(v) => setTradingSignals({ ...tradingSignals, enabled: v })}
              data-testid="switch-trading-signals"
            />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {tradingSignals.enabled
                ? "Signal providers are configured below"
                : "Enable to manage signal providers"}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-market-news">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Newspaper className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base">Market News</CardTitle>
            </div>
            <Switch
              checked={marketNews.enabled}
              onCheckedChange={(v) => setMarketNews({ ...marketNews, enabled: v })}
              data-testid="switch-market-news"
            />
          </CardHeader>
          <CardContent className="space-y-3">
            <Label>News Sources</Label>
            {(["reuters", "bloomberg", "forexlive", "fxstreet", "dailyfx"] as const).map((source) => (
              <div className="flex items-center gap-2" key={source}>
                <Checkbox
                  checked={marketNews.sources[source]}
                  onCheckedChange={(v) =>
                    setMarketNews({
                      ...marketNews,
                      sources: { ...marketNews.sources, [source]: !!v },
                    })
                  }
                  data-testid={`checkbox-news-${source}`}
                />
                <span className="text-sm capitalize">
                  {source === "forexlive"
                    ? "ForexLive"
                    : source === "fxstreet"
                      ? "FXStreet"
                      : source === "dailyfx"
                        ? "DailyFX"
                        : source.charAt(0).toUpperCase() + source.slice(1)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card data-testid="card-ai-center">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Brain className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base">AI Center</CardTitle>
            </div>
            <Switch
              checked={aiCenter.enabled}
              onCheckedChange={(v) => setAiCenter({ ...aiCenter, enabled: v })}
              data-testid="switch-ai-center"
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>AI Provider</Label>
              <Select
                value={aiCenter.provider}
                onValueChange={(v) => setAiCenter({ ...aiCenter, provider: v })}
              >
                <SelectTrigger data-testid="select-ai-provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Max Queries/Day</Label>
              <Input
                type="number"
                value={aiCenter.maxQueriesPerDay}
                onChange={(e) => setAiCenter({ ...aiCenter, maxQueriesPerDay: e.target.value })}
                data-testid="input-ai-max-queries"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {tradingSignals.enabled && (
        <Card data-testid="card-signal-providers-section">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-lg">Signal Providers</CardTitle>
            <Button size="sm" onClick={addProvider} data-testid="button-add-provider">
              <Plus className="w-4 h-4 mr-1" />
              Add Provider
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-signal-providers">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Provider Name</th>
                    <th className="pb-2 font-medium">Win Rate</th>
                    <th className="pb-2 font-medium">Subscribers</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Fee</th>
                    <th className="pb-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {signalProviders.map((provider) => (
                    <tr key={provider.id} className="border-b last:border-0" data-testid={`row-provider-${provider.id}`}>
                      <td className="py-3 font-medium" data-testid={`text-provider-name-${provider.id}`}>
                        {provider.name}
                      </td>
                      <td className="py-3" data-testid={`text-provider-winrate-${provider.id}`}>
                        {provider.winRate}%
                      </td>
                      <td className="py-3" data-testid={`text-provider-subscribers-${provider.id}`}>
                        {provider.subscribers.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={provider.status === "active" ? "default" : "secondary"}
                          data-testid={`badge-provider-status-${provider.id}`}
                        >
                          {provider.status}
                        </Badge>
                      </td>
                      <td className="py-3" data-testid={`text-provider-fee-${provider.id}`}>
                        {provider.fee}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleProviderStatus(provider.id)}
                            data-testid={`button-toggle-provider-${provider.id}`}
                          >
                            {provider.status === "active" ? (
                              <PowerOff className="w-4 h-4" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              toast({ title: `Edit ${provider.name}` })
                            }
                            data-testid={`button-edit-provider-${provider.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeProvider(provider.id)}
                            data-testid={`button-remove-provider-${provider.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Card data-testid="card-display-priority">
        <CardHeader>
          <CardTitle className="text-lg">Display Priority</CardTitle>
          <p className="text-sm text-muted-foreground">
            Reorder tools to set their display priority in the client sidebar
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-md">
            {toolOrder.map((tool, index) => (
              <div
                key={tool.id}
                className="flex items-center justify-between gap-2 rounded-md border p-3"
                data-testid={`row-tool-order-${tool.id}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-5 text-center">{index + 1}</span>
                  <span className="text-sm font-medium" data-testid={`text-tool-order-label-${tool.id}`}>
                    {tool.label}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={index === 0}
                    onClick={() => moveToolOrder(index, "up")}
                    data-testid={`button-move-up-${tool.id}`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={index === toolOrder.length - 1}
                    onClick={() => moveToolOrder(index, "down")}
                    data-testid={`button-move-down-${tool.id}`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSaveAll} data-testid="button-save-all-settings">
          <Save className="w-4 h-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
