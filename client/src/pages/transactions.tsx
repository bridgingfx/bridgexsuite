import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Download,
  Filter,
  DollarSign,
} from "lucide-react";
import type { Transaction } from "@shared/schema";

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const filtered = (transactions || []).filter((t) => {
    const matchSearch = (t.reference || "").toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || t.type === typeFilter;
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalAmount = filtered.reduce((sum, t) => {
    return sum + (t.type === "deposit" ? Number(t.amount) : -Number(t.amount));
  }, 0);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-transactions-title">Transactions</h1>
          <p className="text-sm text-muted-foreground">View all financial transactions</p>
        </div>
        <Button variant="outline" size="sm" data-testid="button-export-transactions">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Transactions</p>
              <p className="text-lg font-bold">{(transactions || []).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Deposits</p>
              <p className="text-lg font-bold">{(transactions || []).filter(t => t.type === "deposit").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-red-500/10 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Withdrawals</p>
              <p className="text-lg font-bold">{(transactions || []).filter(t => t.type === "withdrawal").length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-transactions" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]" data-testid="select-type-filter">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-transactions">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Method</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Reference</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">No transactions found</td></tr>
                ) : (
                  filtered.map((tx) => (
                    <tr key={tx.id} className="border-b last:border-0">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          {tx.type === "deposit" ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-red-400" />}
                          <span className="capitalize">{tx.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={tx.type === "deposit" ? "text-emerald-500 font-medium" : "text-red-400 font-medium"}>
                          {tx.type === "deposit" ? "+" : "-"}${Math.abs(Number(tx.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground capitalize">{(tx.method || "—").replace(/_/g, " ")}</td>
                      <td className="py-3 px-3 text-muted-foreground font-mono text-xs">{tx.reference || "—"}</td>
                      <td className="py-3 px-3 text-muted-foreground">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "N/A"}</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={tx.status === "completed" ? "default" : tx.status === "pending" ? "secondary" : "destructive"}
                          className={tx.status === "completed" ? "bg-emerald-500/10 text-emerald-500" : tx.status === "pending" ? "bg-amber-500/10 text-amber-500" : ""}
                        >
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
