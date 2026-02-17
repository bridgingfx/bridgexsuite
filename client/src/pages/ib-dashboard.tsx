import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, DollarSign, Link2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function IBDashboard() {
  const { toast } = useToast();
  const { data: referrals, isLoading: refLoading } = useQuery<any[]>({
    queryKey: ["/api/ib/referrals"],
  });
  const { data: commissions, isLoading: comLoading } = useQuery<any[]>({
    queryKey: ["/api/commissions"],
  });

  const isLoading = refLoading || comLoading;
  const totalReferrals = referrals?.length || 0;
  const activeReferrals = referrals?.filter((r: any) => r.status === "active")?.length || 0;
  const totalCommission = commissions?.reduce((s: number, c: any) => s + Number(c.amount), 0) || 0;
  const pendingCommission = commissions?.filter((c: any) => c.status === "pending")?.reduce((s: number, c: any) => s + Number(c.amount), 0) || 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  const kpis = [
    { title: "Total Referrals", value: totalReferrals, icon: Users },
    { title: "Active Referrals", value: activeReferrals, icon: Link2 },
    { title: "Total Commission", value: `$${totalCommission.toFixed(2)}`, icon: DollarSign },
    { title: "Pending Commission", value: `$${pendingCommission.toFixed(2)}`, icon: TrendingUp },
  ];

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/?ref=IB-001`);
    toast({ title: "Referral link copied to clipboard" });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">IB Dashboard</h1>
          <p className="text-sm text-muted-foreground">Introducing Broker program overview</p>
        </div>
        <Button onClick={copyLink} data-testid="button-copy-referral">
          <Link2 className="w-4 h-4 mr-2" />
          Copy Referral Link
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`text-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}>{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
