import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Gift,
  Clock,
  Users,
  Percent,
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const offers = [
  {
    title: "Welcome Bonus",
    value: "30%",
    description: "Get a 30% bonus on your first deposit above $500. Maximum bonus amount is $5,000. Bonus is credited instantly upon deposit approval.",
    type: "Bonus",
    status: "Active",
    expiry: "Mar 31, 2026",
    icon: Gift,
    iconBg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    highlight: true,
    terms: ["Minimum deposit: $500", "Maximum bonus: $5,000", "30x trading volume required", "Valid for new accounts only"],
  },
  {
    title: "Referral Reward",
    value: "$50",
    description: "Earn $50 for every friend you refer who signs up and deposits $200 or more. No limit on referrals.",
    type: "Referral",
    status: "Active",
    expiry: "Ongoing",
    icon: Users,
    iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    highlight: false,
    terms: ["Referee must deposit $200+", "Bonus credited after verification", "Unlimited referrals", "Both parties receive reward"],
  },
  {
    title: "Loyalty Cashback",
    value: "10%",
    description: "Trade 50+ lots per month and receive 10% cashback on spreads. Automatically calculated and credited monthly.",
    type: "Cashback",
    status: "Active",
    expiry: "Ongoing",
    icon: Percent,
    iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    highlight: false,
    terms: ["Minimum 50 lots/month", "Cashback on spread costs", "Auto-credited monthly", "All instruments eligible"],
  },
  {
    title: "VIP Deposit Bonus",
    value: "50%",
    description: "Exclusive 50% deposit bonus for VIP members. Deposit $10,000 or more and receive up to $25,000 in bonus funds.",
    type: "Bonus",
    status: "Active",
    expiry: "Apr 15, 2026",
    icon: Star,
    iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    highlight: false,
    terms: ["VIP members only", "Minimum deposit: $10,000", "Maximum bonus: $25,000", "20x trading volume required"],
  },
];

export default function OffersPage() {
  const { toast } = useToast();
  const [claimedOffers, setClaimedOffers] = useState<Set<number>>(new Set());

  function handleClaim(index: number) {
    setClaimedOffers(prev => new Set(prev).add(index));
    toast({
      title: "Offer Applied",
      description: `${offers[index].title} has been applied to your account.`,
    });
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-page-title">Offers & Promotions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Special bonuses and promotions available to you</p>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-2xl p-6 md:p-8 text-white shadow-lg" data-testid="offers-hero">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Exclusive Offers</h2>
            <p className="text-white/70 text-sm">Boost your trading with our special promotions</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/60 text-xs">Active Offers</p>
            <p className="text-2xl font-bold mt-1" data-testid="text-active-offers-count">{offers.filter(o => o.status === "Active").length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/60 text-xs">Max Bonus</p>
            <p className="text-2xl font-bold mt-1" data-testid="text-max-bonus">50%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/60 text-xs">Claimed</p>
            <p className="text-2xl font-bold mt-1" data-testid="text-claimed-count">{claimedOffers.size}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/60 text-xs">Expiring Soon</p>
            <p className="text-2xl font-bold mt-1" data-testid="text-expiring-count">2</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer, i) => {
          const isClaimed = claimedOffers.has(i);
          return (
            <div
              key={i}
              className={`bg-white dark:bg-[#1c1c2e] rounded-xl border shadow-sm transition-all ${
                offer.highlight
                  ? "border-blue-300 dark:border-blue-700 ring-2 ring-blue-500/20"
                  : "border-gray-100 dark:border-gray-800"
              }`}
              data-testid={`card-offer-${i}`}
            >
              {offer.highlight && (
                <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-t-xl flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">FEATURED OFFER</span>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${offer.iconBg}`}>
                      <offer.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white" data-testid={`text-offer-title-${i}`}>{offer.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          offer.status === "Active"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                        }`} data-testid={`badge-offer-status-${i}`}>
                          {offer.status}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {offer.expiry}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid={`text-offer-value-${i}`}>{offer.value}</span>
                    <p className="text-xs text-gray-400">{offer.type}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{offer.description}</p>

                <div className="space-y-2 mb-4">
                  {offer.terms.map((term, ti) => (
                    <div key={ti} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{term}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full"
                  disabled={offer.status !== "Active" || isClaimed}
                  onClick={() => handleClaim(i)}
                  data-testid={`button-claim-offer-${i}`}
                >
                  {isClaimed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Applied
                    </>
                  ) : offer.status === "Active" ? (
                    <>
                      Claim Offer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    "Expired"
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
