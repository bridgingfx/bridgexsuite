import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Gift,
  Percent,
  Tag,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

const demoPromotions = [
  {
    id: "promo-1",
    code: "SUMMER25",
    discount: 25,
    description: "Summer Sale - 25% off all challenges",
    validity: "Valid until Aug 31, 2025",
    terms: "Applicable on first purchase only. Cannot be combined with other offers.",
    active: true,
  },
  {
    id: "promo-2",
    code: "LOYALTY15",
    discount: 15,
    description: "Loyalty Discount - 15% off next challenge",
    validity: "Valid until Dec 31, 2025",
    terms: "For returning traders who completed at least one challenge.",
    active: true,
  },
  {
    id: "promo-3",
    code: "REFER10",
    discount: 10,
    description: "Referral Bonus - 10% off any plan",
    validity: "Valid until Sep 30, 2025",
    terms: "Applied automatically when referred by an existing member.",
    active: true,
  },
  {
    id: "promo-4",
    code: "NEWYEAR30",
    discount: 30,
    description: "New Year Special - 30% off 100K challenges",
    validity: "Expired Jan 31, 2025",
    terms: "Only valid for 100K challenge tier. One use per account.",
    active: false,
  },
];

const demoAppliedBonuses = [
  {
    id: "b-1",
    code: "WELCOME20",
    discount: 20,
    appliedDate: "2025-01-15",
    status: "used" as const,
    challengeName: "50K Challenge",
  },
  {
    id: "b-2",
    code: "LOYALTY15",
    discount: 15,
    appliedDate: "2025-03-20",
    status: "active" as const,
    challengeName: "100K Challenge",
  },
  {
    id: "b-3",
    code: "FLASHSALE",
    discount: 40,
    appliedDate: "2024-11-25",
    status: "expired" as const,
    challengeName: "10K Challenge",
  },
];

export default function PropBonus() {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");

  const handleApplyCode = () => {
    if (!promoCode.trim()) {
      toast({ title: "Please enter a promo code", variant: "destructive" });
      return;
    }
    toast({ title: `Promo code "${promoCode}" applied successfully!` });
    setPromoCode("");
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "used":
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
      case "expired":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-bonus-title">
          Bonus & Promotions
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Apply promo codes and view available promotions.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4" data-testid="text-promo-input-title">
          Apply Promo Code
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="max-w-xs"
            data-testid="input-promo-code"
          />
          <Button onClick={handleApplyCode} data-testid="button-apply-promo">
            <Tag className="w-4 h-4 mr-2" />
            Apply
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4" data-testid="text-active-promos-title">
          Active Promotions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoPromotions.map((promo) => (
            <Card
              key={promo.id}
              className={`p-5 ${!promo.active ? "opacity-60" : ""}`}
              data-testid={`card-promo-${promo.id}`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white" data-testid={`text-promo-code-${promo.id}`}>
                      {promo.code}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{promo.discount}% OFF</p>
                  </div>
                </div>
                <Badge className={promo.active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}>
                  {promo.active ? "Active" : "Expired"}
                </Badge>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{promo.description}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <Clock className="w-3 h-3" />
                <span>{promo.validity}</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{promo.terms}</p>
              {promo.active && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    setPromoCode(promo.code);
                    toast({ title: `Code "${promo.code}" copied to input` });
                  }}
                  data-testid={`button-use-promo-${promo.id}`}
                >
                  <ArrowRight className="w-3 h-3 mr-1" />
                  Use Code
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4" data-testid="text-my-bonuses-title">
          My Bonuses
        </h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-my-bonuses">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Discount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Challenge</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Applied Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {demoAppliedBonuses.map((bonus, index) => (
                  <tr
                    key={bonus.id}
                    className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${
                      index % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-800/20"
                    }`}
                    data-testid={`row-bonus-${index}`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{bonus.code}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{bonus.discount}%</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{bonus.challengeName}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{bonus.appliedDate}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColor(bonus.status)}>
                        {bonus.status === "active" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {bonus.status === "expired" && <XCircle className="w-3 h-3 mr-1" />}
                        {bonus.status.charAt(0).toUpperCase() + bonus.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
