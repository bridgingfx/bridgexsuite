import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Gift,
  Trophy,
  Crown,
  Gem,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const tiers = [
  { name: "Bronze", minPoints: 0, icon: Star, color: "text-amber-700 dark:text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { name: "Silver", minPoints: 1000, icon: Trophy, color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-800/40" },
  { name: "Gold", minPoints: 3000, icon: Crown, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  { name: "Platinum", minPoints: 10000, icon: Gem, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
];

const rewards = [
  { name: "$10 Trading Credit", points: 1000, description: "Get $10 bonus credited directly to your trading wallet.", icon: Gift, redeemed: false },
  { name: "Free Prop Challenge", points: 5000, description: "Receive a free entry to any Prop Firm challenge of your choice.", icon: Trophy, redeemed: false },
  { name: "VPS Hosting (1 Month)", points: 2500, description: "One month of premium VPS hosting for your trading bots and EAs.", icon: Sparkles, redeemed: false },
  { name: "Reduced Spreads (30 Days)", points: 1500, description: "Enjoy tighter spreads on all major pairs for 30 days.", icon: Star, redeemed: false },
];

const pointsHistory = [
  { date: "2024-01-15", description: "Trading Volume Bonus", points: 250, type: "earned" },
  { date: "2024-01-12", description: "Referral Commission", points: 500, type: "earned" },
  { date: "2024-01-10", description: "Redeemed: $10 Trading Credit", points: -1000, type: "redeemed" },
  { date: "2024-01-08", description: "Deposit Bonus", points: 150, type: "earned" },
  { date: "2024-01-05", description: "Daily Login Streak (7 days)", points: 100, type: "earned" },
  { date: "2024-01-03", description: "First Trade of the Month", points: 50, type: "earned" },
];

export default function LoyaltyPointsPage() {
  const totalPoints = 2450;
  const currentTierIndex = 1;
  const currentTier = tiers[currentTierIndex];
  const nextTier = tiers[currentTierIndex + 1];
  const progressToNext = nextTier ? ((totalPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 : 100;
  const pointsToNext = nextTier ? nextTier.minPoints - totalPoints : 0;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="bg-gradient-to-br from-yellow-500 to-amber-700 dark:from-yellow-600 dark:to-amber-800 rounded-2xl p-6 md:p-8 text-white shadow-lg" data-testid="loyalty-hero">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm mb-1">Loyalty Program</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-testid="text-page-title">Loyalty Points</h1>
            <p className="text-white/70 text-sm mt-1">Earn points through trading and redeem for exclusive rewards</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px]">
              <p className="text-white/60 text-xs mb-1">Total Points</p>
              <p className="text-2xl font-bold" data-testid="text-total-points">{totalPoints.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px]">
              <p className="text-white/60 text-xs mb-1">Current Tier</p>
              <p className="text-2xl font-bold" data-testid="text-current-tier">{currentTier.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6" data-testid="tier-progress-section">
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tier Progress</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {pointsToNext > 0 ? `${pointsToNext.toLocaleString()} points to ${nextTier?.name}` : "Maximum tier reached"}
            </p>
          </div>
          <Badge variant="secondary" data-testid="text-next-tier">{nextTier ? nextTier.name : "Max Tier"}</Badge>
        </div>
        <Progress value={progressToNext} className="h-3 mb-4" data-testid="progress-tier" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`flex items-center gap-3 p-3 rounded-lg border ${i === currentTierIndex ? "border-yellow-400 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/10" : "border-gray-100 dark:border-gray-800"}`}
              data-testid={`tier-card-${tier.name.toLowerCase()}`}
            >
              <div className={`p-2 rounded-lg ${tier.bg}`}>
                <tier.icon className={`w-4 h-4 ${tier.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{tier.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{tier.minPoints.toLocaleString()}+ pts</p>
              </div>
              {i <= currentTierIndex && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Redeemable Rewards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map((reward, i) => {
            const canRedeem = totalPoints >= reward.points;
            return (
              <div
                key={i}
                className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all p-6"
                data-testid={`reward-card-${i}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <reward.icon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <Badge variant="secondary">{reward.points.toLocaleString()} Pts</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{reward.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{reward.description}</p>
                <Button
                  className="w-full"
                  disabled={!canRedeem}
                  data-testid={`button-redeem-${i}`}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  {canRedeem ? "Redeem" : "Not Enough Points"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6" data-testid="points-history-section">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Points History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Description</th>
                <th className="pb-3 font-medium text-gray-500 dark:text-gray-400 text-right">Points</th>
                <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Type</th>
              </tr>
            </thead>
            <tbody>
              {pointsHistory.map((entry, i) => (
                <tr key={i} className="border-b last:border-0" data-testid={`points-history-row-${i}`}>
                  <td className="py-3 text-gray-500 dark:text-gray-400">{entry.date}</td>
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{entry.description}</td>
                  <td className={`py-3 text-right font-semibold ${entry.points > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    {entry.points > 0 ? "+" : ""}{entry.points.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <Badge variant={entry.type === "earned" ? "default" : "secondary"}>
                      {entry.type === "earned" ? "Earned" : "Redeemed"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6" data-testid="tier-benefits-section">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tier Benefits Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Benefit</th>
                {tiers.map((tier) => (
                  <th key={tier.name} className="pb-3 font-medium text-gray-500 dark:text-gray-400 text-center">{tier.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { benefit: "Points Multiplier", values: ["1x", "1.5x", "2x", "3x"] },
                { benefit: "Spread Discount", values: ["0%", "5%", "10%", "20%"] },
                { benefit: "Priority Support", values: ["-", "-", "Yes", "Yes"] },
                { benefit: "Free VPS", values: ["-", "-", "-", "Yes"] },
                { benefit: "Exclusive Events", values: ["-", "-", "Yes", "Yes"] },
              ].map((row, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{row.benefit}</td>
                  {row.values.map((val, j) => (
                    <td key={j} className="py-3 text-center text-gray-500 dark:text-gray-400">
                      {val === "Yes" ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : val === "-" ? <span className="text-gray-300 dark:text-gray-600">-</span> : val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
