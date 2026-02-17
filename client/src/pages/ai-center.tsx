import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BarChart3, TrendingUp, Brain, Zap, MessageSquare } from "lucide-react";

const features = [
  {
    title: "AI Market Analysis",
    description: "Get AI-powered analysis of current market conditions, trends, and potential opportunities across major forex pairs.",
    icon: BarChart3,
    status: "Available",
  },
  {
    title: "Trading Signals",
    description: "Receive AI-generated trading signals based on technical and fundamental analysis with entry, stop-loss, and take-profit levels.",
    icon: TrendingUp,
    status: "Available",
  },
  {
    title: "Risk Assessment",
    description: "Analyze your portfolio risk exposure and get personalized recommendations to optimize your risk management strategy.",
    icon: Brain,
    status: "Available",
  },
  {
    title: "Strategy Builder",
    description: "Create and backtest custom trading strategies using natural language. Describe your strategy and let AI build it.",
    icon: Zap,
    status: "Coming Soon",
  },
  {
    title: "AI Trading Assistant",
    description: "Chat with an AI assistant that understands forex markets, trading concepts, and can help answer your trading questions.",
    icon: MessageSquare,
    status: "Coming Soon",
  },
];

export default function AICenterPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">AI Center</h1>
          <p className="text-sm text-muted-foreground">AI-powered tools to enhance your trading</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, i) => (
          <Card key={i}>
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <feature.icon className="w-5 h-5 text-muted-foreground" />
                <Badge variant={feature.status === "Available" ? "default" : "secondary"}>
                  {feature.status}
                </Badge>
              </div>
              <CardTitle className="text-base">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{feature.description}</p>
              <Button
                className="w-full"
                variant={feature.status === "Available" ? "default" : "outline"}
                disabled={feature.status !== "Available"}
                data-testid={`button-feature-${i}`}
              >
                {feature.status === "Available" ? "Launch" : "Coming Soon"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
