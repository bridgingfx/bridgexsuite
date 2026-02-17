import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, BarChart3, Clock, Newspaper, Calculator, Globe, TrendingUp } from "lucide-react";

const widgets = [
  { title: "Economic Calendar", description: "Stay updated with upcoming economic events and their expected impact on markets.", icon: Clock, enabled: true },
  { title: "Market News", description: "Live financial news feed covering forex, commodities, and global markets.", icon: Newspaper, enabled: true },
  { title: "Currency Converter", description: "Quick currency conversion tool supporting all major and minor pairs.", icon: Calculator, enabled: false },
  { title: "Live Charts", description: "Interactive price charts with technical indicators for real-time analysis.", icon: BarChart3, enabled: true },
  { title: "Market Sentiment", description: "See how traders are positioned across major currency pairs.", icon: TrendingUp, enabled: false },
  { title: "World Clock", description: "Track market sessions across different time zones with a world clock display.", icon: Globe, enabled: false },
];

export default function WidgetsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Widgets</h1>
          <p className="text-sm text-muted-foreground">Customize your dashboard with trading widgets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                  <widget.icon className="w-4 h-4" />
                </div>
                <CardTitle className="text-base">{widget.title}</CardTitle>
              </div>
              <Badge variant={widget.enabled ? "default" : "secondary"}>
                {widget.enabled ? "Active" : "Inactive"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{widget.description}</p>
              <Button
                variant={widget.enabled ? "outline" : "default"}
                size="sm"
                data-testid={`button-widget-toggle-${i}`}
              >
                {widget.enabled ? "Disable" : "Enable"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
