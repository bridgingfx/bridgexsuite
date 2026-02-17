import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Users,
  UserCheck,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Shield,
  HelpCircle,
  TrendingUp,
  Network,
  Wallet,
  BarChart3,
} from "lucide-react";

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  totalDeposits: number;
  totalWithdrawals: number;
  netDeposits: number;
  pendingTransactions: number;
  pendingKyc: number;
  openTickets: number;
  totalAccounts: number;
  activeIBs: number;
  totalCommissions: number;
  totalAccountBalance: number;
  recentTransactions: Array<{
    id: string;
    reference: string;
    type: string;
    amount: string;
    status: string;
    createdAt: string;
  }>;
  recentClients: Array<{
    id: string;
    fullName: string;
    email: string;
    status: string;
    kycStatus: string;
    country: string;
    createdAt: string;
  }>;
}

function formatCurrency(value: number) {
  return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

function StatusBadge({ status }: { status: string }) {
  const variant = status === "completed" || status === "approved" || status === "active"
    ? "default"
    : status === "pending"
    ? "secondary"
    : status === "rejected"
    ? "destructive"
    : "outline";
  const className = status === "completed" || status === "approved" || status === "active"
    ? "bg-emerald-500/10 text-emerald-500"
    : status === "pending"
    ? "bg-amber-500/10 text-amber-500"
    : status === "rejected"
    ? "bg-red-500/10 text-red-500"
    : status === "open" || status === "in_progress"
    ? "bg-blue-500/10 text-blue-500"
    : "";
  return (
    <Badge variant={variant} className={`${className} text-xs`}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  const s = stats || {} as DashboardStats;

  const statCards = [
    { title: "Total Clients", value: String(s.totalClients ?? 0), icon: Users, highlight: false },
    { title: "Active Clients", value: String(s.activeClients ?? 0), icon: UserCheck, highlight: false },
    { title: "Total Deposits", value: formatCurrency(s.totalDeposits ?? 0), icon: ArrowUpRight, highlight: false },
    { title: "Total Withdrawals", value: formatCurrency(s.totalWithdrawals ?? 0), icon: ArrowDownRight, highlight: false },
    { title: "Net Deposits", value: formatCurrency(s.netDeposits ?? 0), icon: DollarSign, highlight: false },
    { title: "Pending Transactions", value: String(s.pendingTransactions ?? 0), icon: Clock, highlight: true },
    { title: "Pending KYC", value: String(s.pendingKyc ?? 0), icon: Shield, highlight: true },
    { title: "Open Support Tickets", value: String(s.openTickets ?? 0), icon: HelpCircle, highlight: false },
    { title: "Trading Accounts", value: String(s.totalAccounts ?? 0), icon: TrendingUp, highlight: false },
    { title: "Active IBs", value: String(s.activeIBs ?? 0), icon: Network, highlight: false },
    { title: "Total Commissions", value: formatCurrency(s.totalCommissions ?? 0), icon: BarChart3, highlight: false },
    { title: "Total Account Balance", value: formatCurrency(s.totalAccountBalance ?? 0), icon: Wallet, highlight: false },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-admin-dashboard-title">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">Broker-wide overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className={card.highlight ? "border-amber-500/50" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm text-muted-foreground">{card.title}</span>
                <card.icon className={`w-4 h-4 ${card.highlight ? "text-amber-500" : "text-muted-foreground"}`} />
              </div>
              <div className={`text-2xl font-bold ${card.highlight ? "text-amber-500" : ""}`} data-testid={`stat-${card.title.toLowerCase().replace(/\s+/g, "-")}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table data-testid="table-admin-recent-transactions">
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(s.recentTransactions || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No recent transactions
                  </TableCell>
                </TableRow>
              ) : (
                (s.recentTransactions || []).map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-sm">{tx.reference || tx.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <Badge variant={tx.type === "deposit" ? "default" : "secondary"} className={tx.type === "deposit" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}>
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">${Number(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell><StatusBadge status={tx.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">Recent Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table data-testid="table-admin-recent-clients">
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(s.recentClients || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No recent clients
                  </TableCell>
                </TableRow>
              ) : (
                (s.recentClients || []).map((client) => (
                  <TableRow key={client.id} data-testid={`row-recent-client-${client.id}`}>
                    <TableCell className="font-medium">{client.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{client.email}</TableCell>
                    <TableCell><StatusBadge status={client.status} /></TableCell>
                    <TableCell><StatusBadge status={client.kycStatus} /></TableCell>
                    <TableCell className="text-muted-foreground">{client.country || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
