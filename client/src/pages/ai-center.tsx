import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  Brain,
  Zap,
  MessageSquare,
  Send,
  Bot,
  User,
  ArrowRight,
} from "lucide-react";

const quickPrompts = [
  { label: "Analysis for EURUSD", icon: BarChart3 },
  { label: "Crypto Sentiment", icon: TrendingUp },
  { label: "Explain Prop Firms", icon: Brain },
  { label: "Risk Management", icon: Zap },
];

const sampleMessages = [
  {
    role: "user" as const,
    content: "What's the current outlook for EURUSD?",
  },
  {
    role: "assistant" as const,
    content:
      "Based on current market analysis, EUR/USD is trading near the 1.0850 level. Key factors to watch:\n\n- **ECB Rate Decision**: Expected to hold rates steady, but forward guidance will be crucial\n- **US NFP Data**: Strong labor market data could strengthen USD\n- **Technical Levels**: Support at 1.0800, resistance at 1.0920\n\nThe pair shows a slight bearish bias in the short term due to dollar strength, but medium-term outlook remains neutral. Consider tight stop-losses if trading this pair currently.",
  },
];

export default function AICenterPage() {
  const [messages, setMessages] = useState(sampleMessages);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: inputValue },
      {
        role: "assistant",
        content:
          "I'm processing your request. This is a demo interface — in production, this would connect to an AI model for real-time market analysis and trading insights.",
      },
    ]);
    setInputValue("");
  };

  const handleQuickPrompt = (label: string) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: label },
      {
        role: "assistant",
        content: `Here's my analysis on "${label}". This is a demo response — the full AI Center would provide detailed, real-time market intelligence powered by advanced language models.`,
      },
    ]);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="bg-gradient-to-br from-violet-600 to-purple-800 dark:from-violet-700 dark:to-purple-900 rounded-2xl p-6 md:p-8 text-white shadow-lg" data-testid="ai-hero">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-testid="text-page-title">AI Center</h1>
            <p className="text-white/70 text-sm">AI-powered tools to enhance your trading decisions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "AI Market Analysis", desc: "Real-time market insights", icon: <BarChart3 className="w-5 h-5" />, iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400", status: "Available" },
          { label: "Trading Signals", desc: "AI-generated trade ideas", icon: <TrendingUp className="w-5 h-5" />, iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400", status: "Available" },
          { label: "Risk Assessment", desc: "Portfolio risk analysis", icon: <Brain className="w-5 h-5" />, iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400", status: "Available" },
          { label: "Strategy Builder", desc: "Create & backtest strategies", icon: <Zap className="w-5 h-5" />, iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400", status: "Coming Soon" },
        ].map((card) => (
          <div key={card.label} className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6" data-testid={`feature-card-${card.label.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="flex justify-between items-start mb-3">
              <div className={`p-3 rounded-lg ${card.iconBg}`}>
                {card.icon}
              </div>
              <Badge variant={card.status === "Available" ? "default" : "secondary"}>
                {card.status}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{card.label}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-visible" data-testid="ai-chat-section">
        <div className="p-4 border-b flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Ask Avi</h2>
          <Badge variant="secondary" className="ml-auto">AI Assistant</Badge>
        </div>

        <div className="p-4 space-y-2 mb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Quick prompts:</p>
          <div className="flex items-center gap-2 flex-wrap">
            {quickPrompts.map((prompt, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => handleQuickPrompt(prompt.label)}
                data-testid={`button-prompt-${i}`}
              >
                <prompt.icon className="w-4 h-4 mr-2" />
                {prompt.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="px-4 space-y-4 max-h-[400px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              data-testid={`chat-message-${i}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl p-4 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t mt-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ask Avi about the markets..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              data-testid="input-ai-chat"
            />
            <Button size="icon" onClick={handleSend} data-testid="button-send-message">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
