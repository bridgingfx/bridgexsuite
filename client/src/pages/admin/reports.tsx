import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AdminReports() {
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/admin/dashboard/stats"],
  });

  const { data: transactions = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/transactions"],
  });

  const { data: clients = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/clients"],
  });

  const { data: commissions = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/commissions"],
  });

  const deposits = transactions.filter((t: any) => t.type === "deposit");
  const withdrawals = transactions.filter((t: any) => t.type === "withdrawal");

  const depositsByMethod = deposits.reduce((acc: any, t: any) => {
    const method = t.method || "unknown";
    acc[method] = (acc[method] || 0) + Number(t.amount);
    return acc;
  }, {});

  const methodChartData = Object.entries(depositsByMethod).map(([name, value]) => ({ name, value }));

  const statusData = [
    { name: "Completed", value: transactions.filter((t: any) => t.status === "completed").length },
    { name: "Pending", value: transactions.filter((t: any) => t.status === "pending").length },
    { name: "Rejected", value: transactions.filter((t: any) => t.status === "rejected").length },
  ].filter(d => d.value > 0);

  const roleData = [
    { name: "Clients", value: clients.filter((c: any) => c.role === "client").length },
    { name: "IBs", value: clients.filter((c: any) => c.role === "ib").length },
    { name: "Leads", value: clients.filter((c: any) => c.role === "lead").length },
    { name: "Admins", value: clients.filter((c: any) => c.role === "admin").length },
  ].filter(d => d.value > 0);

  const kycData = [
    { name: "Verified", value: clients.filter((c: any) => c.kycStatus === "verified").length },
    { name: "Pending", value: clients.filter((c: any) => c.kycStatus === "pending").length },
    { name: "Unverified", value: clients.filter((c: any) => c.kycStatus === "unverified").length },
    { name: "Rejected", value: clients.filter((c: any) => c.kycStatus === "rejected").length },
  ].filter(d => d.value > 0);

  const financialOverview = [
    { name: "Deposits", amount: stats?.totalDeposits || 0 },
    { name: "Withdrawals", amount: stats?.totalWithdrawals || 0 },
    { name: "Net", amount: stats?.netDeposits || 0 },
    { name: "Commissions", amount: stats?.totalCommissions || 0 },
  ];

  const commissionByType = commissions.reduce((acc: any, c: any) => {
    acc[c.type] = (acc[c.type] || 0) + Number(c.amount);
    return acc;
  }, {});

  const commissionChartData = Object.entries(commissionByType).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-admin-reports-title">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Comprehensive broker performance analytics</p>
        </div>
      </div>

      <Tabs defaultValue="financial" data-testid="admin-reports-tabs">
        <TabsList>
          <TabsTrigger value="financial" data-testid="tab-financial">Financial</TabsTrigger>
          <TabsTrigger value="clients" data-testid="tab-clients">Clients</TabsTrigger>
          <TabsTrigger value="trading" data-testid="tab-trading">Trading</TabsTrigger>
          <TabsTrigger value="commissions" data-testid="tab-commissions">Commissions</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-deposits">${(stats?.totalDeposits || 0).toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-withdrawals">${(stats?.totalWithdrawals || 0).toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Net Position</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-net-position">${(stats?.netDeposits || 0).toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-pending-txns">{stats?.pendingTransactions || 0}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={financialOverview}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Transaction Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {statusData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deposits by Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={methodChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.filter((c: any) => c.status === "active").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">KYC Verified</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.filter((c: any) => c.kycStatus === "verified").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Active IBs</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.filter((c: any) => c.role === "ib").length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Users by Role</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={roleData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {roleData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">KYC Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={kycData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {kycData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Trading Accounts</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalAccounts || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeAccounts || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(stats?.totalAccountBalance || 0).toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalReferrals || 0}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trading Volume Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: "Deposits", count: deposits.length, volume: deposits.reduce((s: number, t: any) => s + Number(t.amount), 0) },
                  { name: "Withdrawals", count: withdrawals.length, volume: withdrawals.reduce((s: number, t: any) => s + Number(t.amount), 0) },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                  <Bar dataKey="volume" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(stats?.totalCommissions || 0).toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Paid</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${commissions.filter((c: any) => c.status === "paid").reduce((s: number, c: any) => s + Number(c.amount), 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${commissions.filter((c: any) => c.status === "pending").reduce((s: number, c: any) => s + Number(c.amount), 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Commission by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={commissionChartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: $${Number(value).toLocaleString()}`}>
                      {commissionChartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Commission Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={commissionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                    <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
