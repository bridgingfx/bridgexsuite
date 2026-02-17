import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CreditCard, Users, TrendingUp, DollarSign, Activity, BarChart3, Globe } from "lucide-react";
import type { Broker } from "@shared/schema";

export default function SuperAdminDashboard() {
  const { data: stats, isLoading } = useQuery<any>({ queryKey: ["/api/super-admin/dashboard/stats"] });
  const { data: brokers } = useQuery<Broker[]>({ queryKey: ["/api/super-admin/brokers"] });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold" data-testid="text-sa-dashboard-title">Super Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-16 bg-muted animate-pulse rounded-md" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  const kpiCards = [
    { title: "Total Brokers", value: stats?.totalBrokers || 0, icon: Building2, color: "text-blue-500" },
    { title: "Active Brokers", value: stats?.activeBrokers || 0, icon: Activity, color: "text-green-500" },
    { title: "Active Subscriptions", value: stats?.activeSubscriptions || 0, icon: CreditCard, color: "text-purple-500" },
    { title: "Monthly Revenue", value: `$${(stats?.mrr || 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-500" },
    { title: "Annual Revenue", value: `$${(stats?.arr || 0).toLocaleString()}`, icon: TrendingUp, color: "text-orange-500" },
    { title: "Total Admin Users", value: stats?.totalAdminUsers || 0, icon: Users, color: "text-indigo-500" },
    { title: "Total Clients", value: stats?.totalClients || 0, icon: Globe, color: "text-cyan-500" },
    { title: "Transaction Volume", value: `$${(stats?.totalTransactionVolume || 0).toLocaleString()}`, icon: BarChart3, color: "text-rose-500" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-sa-dashboard-title">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform-wide overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`text-sa-stat-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}>{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Brokers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(stats?.recentBrokers || []).map((broker: Broker) => (
                <div key={broker.id} className="flex items-center justify-between gap-2 p-3 rounded-md border">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" data-testid={`text-sa-broker-name-${broker.id}`}>{broker.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{broker.email}</p>
                    </div>
                  </div>
                  <Badge variant={broker.status === "active" ? "default" : "secondary"} data-testid={`badge-sa-broker-status-${broker.id}`}>
                    {broker.status}
                  </Badge>
                </div>
              ))}
              {(!stats?.recentBrokers || stats.recentBrokers.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">No brokers yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Suspended Brokers</span>
                <span className="text-sm font-medium" data-testid="text-sa-suspended-brokers">{stats?.suspendedBrokers || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Plans</span>
                <span className="text-sm font-medium" data-testid="text-sa-total-plans">{stats?.totalPlans || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Trading Accounts</span>
                <span className="text-sm font-medium" data-testid="text-sa-total-accounts">{stats?.totalAccounts || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">MRR</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400" data-testid="text-sa-mrr">${(stats?.mrr || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ARR</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400" data-testid="text-sa-arr">${(stats?.arr || 0).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
