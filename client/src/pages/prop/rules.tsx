import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Shield,
  AlertTriangle,
  Ban,
  Newspaper,
  Copy,
  Bot,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  TrendingDown,
  Scale,
  FileWarning,
  Calendar,
  Info,
  Percent,
  Activity,
  Zap,
} from "lucide-react";

const tradingRuleCategories = [
  {
    title: "Profit & Loss Limits",
    icon: Target,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    rules: [
      { rule: "Profit Target (Phase 1)", value: "8% of initial balance" },
      { rule: "Profit Target (Phase 2)", value: "5% of initial balance" },
      { rule: "Maximum Daily Loss", value: "5% of starting daily equity" },
      { rule: "Maximum Overall Drawdown", value: "10% of initial balance" },
    ],
  },
  {
    title: "Trading Activity",
    icon: Activity,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    rules: [
      { rule: "Minimum Trading Days", value: "5 calendar days per phase" },
      { rule: "Maximum Trading Period", value: "No time limit" },
      { rule: "Weekend Holding", value: "Allowed (unless add-on disabled)" },
      { rule: "Overnight Holding", value: "Allowed" },
    ],
  },
  {
    title: "Position Sizing",
    icon: Scale,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    rules: [
      { rule: "Maximum Leverage", value: "1:100 (Forex), 1:20 (Indices)" },
      { rule: "Maximum Lot Size", value: "Based on account size" },
      { rule: "Maximum Open Positions", value: "No limit" },
      { rule: "Hedging", value: "Allowed on same account" },
    ],
  },
  {
    title: "Consistency Rules",
    icon: Percent,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    rules: [
      { rule: "Single Day Profit Cap", value: "No single day > 40% of total profit" },
      { rule: "Lot Size Consistency", value: "Must remain within 2x of average" },
      { rule: "Trading Style Consistency", value: "Maintain consistent strategy" },
      { rule: "Minimum Trades", value: "At least 1 trade per trading day" },
    ],
  },
];

const restrictedStrategies = [
  { strategy: "Martingale / Grid Trading", severity: "High", description: "Doubling down on losing positions is strictly prohibited" },
  { strategy: "Latency Arbitrage", severity: "High", description: "Exploiting price feed delays between brokers" },
  { strategy: "Tick Scalping", severity: "Medium", description: "Opening and closing trades within 1-2 seconds repeatedly" },
  { strategy: "Account Passing Services", severity: "High", description: "Using third-party services to pass challenges" },
  { strategy: "Copy Trading Between Prop Accounts", severity: "High", description: "Mirroring trades across multiple prop firm accounts" },
  { strategy: "Guaranteed Limit Order Fills", severity: "Medium", description: "Exploiting guaranteed fills during high-impact events" },
];

const policies = [
  {
    title: "News Trading Policy",
    icon: Newspaper,
    description: "Trading during high-impact news events is permitted with specific restrictions. Traders must not open new positions within 2 minutes before and after high-impact news releases (as defined by ForexFactory red-folder events). Existing positions may remain open but stop-loss orders are strongly recommended. Violations during news windows may result in trade invalidation. Add-on available to remove this restriction.",
    status: "Restricted",
    statusColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    title: "Copy Trading Policy",
    icon: Copy,
    description: "Copy trading from personal live accounts to your prop account is allowed. However, copying trades from other prop firm accounts (yours or others) is strictly prohibited. Signal services are permitted as long as you are the decision maker. Group trading where multiple users execute identical trades simultaneously is subject to review and may be flagged.",
    status: "Conditional",
    statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    title: "EA / HFT Policy",
    icon: Bot,
    description: "Expert Advisors (EAs) are allowed on all account types. However, High-Frequency Trading (HFT) strategies that execute more than 200 trades per day or hold positions for less than 30 seconds on average are prohibited. EAs must not exploit platform inefficiencies such as latency gaps, price feed errors, or server overloads. All EAs must include proper risk management (stop-loss on every position).",
    status: "Allowed with Limits",
    statusColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
];

const breachLogs = [
  { date: "2025-01-15", rule: "Max Daily Loss", details: "Daily loss exceeded 5% limit (-5.3%)", severity: "Critical" },
  { date: "2025-01-10", rule: "News Trading", details: "Position opened within 2-min NFP window", severity: "Warning" },
  { date: "2024-12-28", rule: "Consistency Rule", details: "Single day profit exceeded 40% of total", severity: "Warning" },
  { date: "2024-12-20", rule: "Tick Scalping", details: "3 trades held for less than 5 seconds", severity: "Minor" },
  { date: "2024-12-15", rule: "Max Overall Drawdown", details: "Account drawdown reached 9.8% (approaching limit)", severity: "Warning" },
];

const termsContent = [
  "1. By purchasing a challenge, you agree to abide by all trading rules and objectives outlined in this document.",
  "2. The company reserves the right to revoke funded status if any rules are violated, whether detected immediately or retroactively.",
  "3. Profit splits are processed bi-weekly for funded accounts. The default split is 80/20 in favor of the trader.",
  "4. Challenge fees are non-refundable once the first trade has been placed on the evaluation account.",
  "5. Traders may hold a maximum of 3 active challenge accounts simultaneously.",
  "6. The company may update trading rules with 7 days prior notice. Existing accounts will be grandfathered under their original terms for 30 days.",
  "7. All disputes must be submitted in writing within 14 days of the event in question.",
  "8. Simulated trading environments may experience occasional downtime for maintenance. Trading days lost due to platform issues will be credited.",
  "9. The trader acknowledges that all evaluation accounts operate in a simulated environment and no real capital is at risk during the challenge phase.",
  "10. Funded accounts operate with real capital managed by the firm. The trader acts as an independent contractor, not an employee.",
];

const riskDisclosureContent = [
  "Trading foreign exchange, indices, and commodities carries a high level of risk and may not be suitable for all investors.",
  "Past performance in evaluation phases does not guarantee future results in funded accounts.",
  "Leverage can work both for and against you. While it can amplify profits, it can also amplify losses.",
  "You should only trade with funds you can afford to lose. Challenge fees should be considered a cost of entry, not an investment.",
  "Market conditions can change rapidly. Gaps, slippage, and liquidity issues may affect trade execution and results.",
  "The firm is not responsible for losses incurred due to third-party platform outages, internet connectivity issues, or force majeure events.",
];

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    Critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    High: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    Warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    Minor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };
  return (
    <Badge className={`${styles[severity] || ""} border-0`} data-testid={`badge-severity-${severity.toLowerCase()}`}>
      {severity}
    </Badge>
  );
}

export default function PropRulesPage() {
  const [showTerms, setShowTerms] = useState(false);
  const [showRiskDisclosure, setShowRiskDisclosure] = useState(false);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-rules-title">
          Rules & Compliance
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review all trading rules, policies, and compliance requirements for prop trading accounts.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2" data-testid="text-trading-rules-section">
          <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          Trading Rules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tradingRuleCategories.map((category) => (
            <Card key={category.title} className="p-5" data-testid={`card-rule-category-${category.title.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{category.title}</h3>
              </div>
              <div className="space-y-3">
                {category.rules.map((item) => (
                  <div key={item.rule} className="flex items-start justify-between gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.rule}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white text-right whitespace-nowrap">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2" data-testid="text-restricted-strategies-section">
          <Ban className="w-5 h-5 text-red-500" />
          Restricted Strategies
        </h2>
        <Card className="overflow-hidden" data-testid="card-restricted-strategies">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-restricted-strategies">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Strategy</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Description</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Severity</th>
                </tr>
              </thead>
              <tbody>
                {restrictedStrategies.map((item, index) => (
                  <tr
                    key={item.strategy}
                    className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${index % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-800/20"}`}
                    data-testid={`row-restricted-${index}`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{item.strategy}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{item.description}</td>
                    <td className="py-3 px-4 text-center">
                      <SeverityBadge severity={item.severity} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2" data-testid="text-policies-section">
          <Shield className="w-5 h-5 text-blue-500" />
          Trading Policies
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {policies.map((policy) => (
            <Card key={policy.title} className="p-5" data-testid={`card-policy-${policy.title.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <policy.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{policy.title}</h3>
                </div>
                <Badge className={`${policy.statusColor} border-0`} data-testid={`badge-policy-status-${policy.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  {policy.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {policy.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2" data-testid="text-breach-logs-section">
          <FileWarning className="w-5 h-5 text-amber-500" />
          Breach Logs
        </h2>
        <Card className="overflow-hidden" data-testid="card-breach-logs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-breach-logs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Rule Violated</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Details</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Severity</th>
                </tr>
              </thead>
              <tbody>
                {breachLogs.map((log, index) => (
                  <tr
                    key={`${log.date}-${log.rule}`}
                    className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${index % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-800/20"}`}
                    data-testid={`row-breach-${index}`}
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {log.date}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{log.rule}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{log.details}</td>
                    <td className="py-3 px-4 text-center">
                      <SeverityBadge severity={log.severity} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div>
        <Card className="overflow-hidden" data-testid="card-terms-conditions">
          <button
            className="w-full flex items-center justify-between gap-2 p-5 text-left hover-elevate"
            onClick={() => setShowTerms(!showTerms)}
            data-testid="button-toggle-terms"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Terms & Conditions</h3>
            </div>
            {showTerms ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {showTerms && (
            <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="space-y-3">
                {termsContent.map((term, index) => (
                  <p key={index} className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed" data-testid={`text-term-${index}`}>
                    {term}
                  </p>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <div>
        <Card className="overflow-hidden" data-testid="card-risk-disclosure">
          <button
            className="w-full flex items-center justify-between gap-2 p-5 text-left hover-elevate"
            onClick={() => setShowRiskDisclosure(!showRiskDisclosure)}
            data-testid="button-toggle-risk-disclosure"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Risk Disclosure</h3>
            </div>
            {showRiskDisclosure ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {showRiskDisclosure && (
            <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="space-y-3">
                {riskDisclosureContent.map((item, index) => (
                  <div key={index} className="flex items-start gap-3" data-testid={`text-risk-${index}`}>
                    <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
