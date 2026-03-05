import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  FileDown,
  ShoppingCart,
  ArrowDownToLine,
  Award,
} from "lucide-react";

const demoCertificates = {
  purchase: [
    { id: "pc-1", title: "50K Challenge Purchase", date: "2025-01-15", amount: "$299.00", details: "50K Standard Challenge - Phase 1" },
    { id: "pc-2", title: "100K Challenge Purchase", date: "2025-03-20", amount: "$499.00", details: "100K Standard Challenge - Phase 1" },
  ],
  withdrawal: [
    { id: "wc-1", title: "Profit Withdrawal", date: "2025-04-10", amount: "$1,200.00", details: "Funded Account #FA-2851 - April Payout" },
    { id: "wc-2", title: "Profit Withdrawal", date: "2025-05-12", amount: "$850.00", details: "Funded Account #FA-2851 - May Payout" },
    { id: "wc-3", title: "Referral Withdrawal", date: "2025-05-25", amount: "$185.00", details: "Referral Commission Withdrawal" },
  ],
  achievement: [
    { id: "ac-1", title: "Phase 1 Passed", date: "2025-02-28", amount: "50K Challenge", details: "Completed Phase 1 evaluation with 9.2% profit" },
    { id: "ac-2", title: "Phase 2 Passed", date: "2025-03-15", amount: "50K Challenge", details: "Completed Phase 2 evaluation with 5.8% profit" },
    { id: "ac-3", title: "Funded Trader", date: "2025-03-18", amount: "50K Account", details: "Congratulations! You are now a funded trader" },
  ],
};

const categoryConfig = {
  purchase: { label: "Purchase Certificates", icon: ShoppingCart, color: "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400" },
  withdrawal: { label: "Withdrawal Certificates", icon: ArrowDownToLine, color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
  achievement: { label: "Achievement Certificates", icon: Award, color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
};

export default function PropCertificates() {
  const { toast } = useToast();

  const handleDownload = (certTitle: string) => {
    toast({ title: `Downloading certificate: ${certTitle}` });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" data-testid="text-certificates-title">
          Certificates
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Download certificates for your purchases, withdrawals, and achievements.
        </p>
      </div>

      {(Object.keys(demoCertificates) as Array<keyof typeof demoCertificates>).map((category) => {
        const config = categoryConfig[category];
        const certs = demoCertificates[category];
        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-2 rounded-lg ${config.color}`}>
                <config.icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white" data-testid={`text-category-${category}`}>
                {config.label}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certs.map((cert) => (
                <Card key={cert.id} className="p-5" data-testid={`card-cert-${cert.id}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white" data-testid={`text-cert-title-${cert.id}`}>
                      {cert.title}
                    </h3>
                    <Badge variant="secondary" className="shrink-0">
                      {category === "achievement" ? "Achievement" : category === "purchase" ? "Purchase" : "Withdrawal"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1" data-testid={`text-cert-amount-${cert.id}`}>
                    {cert.amount}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{cert.details}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{cert.date}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(cert.title)}
                    data-testid={`button-download-${cert.id}`}
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
