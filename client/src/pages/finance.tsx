import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

export default function FinancePage() {
  const { data: transactions, isLoading } = useQuery<any[]>({
    queryKey: ["/api/transactions"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  const deposits = transactions?.filter(t => t.type === "deposit") || [];
  const withdrawals = transactions?.filter(t => t.type === "withdrawal") || [];
  const totalDeposited = deposits.filter(t => t.status === "approved" || t.status === "completed").reduce((s, t) => s + Number(t.amount), 0);
  const totalWithdrawn = withdrawals.filter(t => t.status === "approved" || t.status === "completed").reduce((s, t) => s + Number(t.amount), 0);
  const pendingCount = transactions?.filter(t => t.status === "pending")?.length || 0;

  const kpis = [
    { title: "Total Deposited", value: `$${totalDeposited.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: ArrowUpRight, color: "text-emerald-500" },
    { title: "Total Withdrawn", value: `$${totalWithdrawn.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: ArrowDownRight, color: "text-red-500" },
    { title: "Net Balance", value: `$${(totalDeposited - totalWithdrawn).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "" },
    { title: "Pending", value: pendingCount, icon: Clock, color: "" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Finance</h1>
        <p className="text-sm text-muted-foreground">Your financial overview and transaction history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className={`w-4 h-4 ${kpi.color || "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`text-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}>{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {!transactions?.length ? (
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Method</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 20).map((txn: any) => (
                    <tr key={txn.id} className="border-b last:border-0">
                      <td className="py-3">
                        <Badge variant={txn.type === "deposit" ? "default" : "secondary"}>{txn.type}</Badge>
                      </td>
                      <td className="py-3 font-medium">${Number(txn.amount).toFixed(2)}</td>
                      <td className="py-3 text-muted-foreground">{txn.method || "N/A"}</td>
                      <td className="py-3">
                        <Badge variant={txn.status === "approved" || txn.status === "completed" ? "default" : "secondary"}>{txn.status}</Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">{new Date(txn.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
