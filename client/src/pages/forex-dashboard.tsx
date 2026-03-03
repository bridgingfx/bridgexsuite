import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Wallet } from "lucide-react";

export default function ForexDashboard() {
  const { data: stats, isLoading } = useQuery<any>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    { title: "Total Balance", value: `$${Number(stats?.totalBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, change: "+2.4%" },
    { title: "Total Equity", value: `$${Number(stats?.totalEquity || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: BarChart3, change: "+1.8%" },
    { title: "Active Accounts", value: stats?.activeAccounts || 0, icon: Activity, change: null },
    { title: "Wallet Balance", value: `$${Number(stats?.walletBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: Wallet, change: null },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Forex Trading Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your forex trading activity</p>
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
              {kpi.change && (
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-emerald-500">{kpi.change}</span> from last month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Your recent trading activity will appear here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Live market data and trends will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
