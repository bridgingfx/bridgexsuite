import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowUpDown,
  Search,
} from "lucide-react";
import type { Transaction } from "@shared/schema";

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-500/10 text-amber-500";
    case "approved":
    case "completed":
      return "bg-emerald-500/10 text-emerald-500";
    case "rejected":
      return "bg-red-500/10 text-red-500";
    default:
      return "";
  }
}

function getTypeBadgeClass(type: string) {
  switch (type) {
    case "deposit":
      return "bg-emerald-500/10 text-emerald-500";
    case "withdrawal":
      return "bg-red-500/10 text-red-500";
    case "transfer":
      return "bg-blue-500/10 text-blue-500";
    case "commission":
      return "bg-purple-500/10 text-purple-500";
    default:
      return "";
  }
}

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const txList = Array.isArray(data) ? data : [];

  const filtered = txList.filter((t) => {
    const matchSearch =
      (t.reference || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.notes || "").toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || t.type === typeFilter;
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const depositCount = txList.filter((t) => t.type === "deposit").length;
  const withdrawalCount = txList.filter((t) => t.type === "withdrawal").length;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-transactions-title">Transactions</h1>
          <p className="text-sm text-muted-foreground">View and track all your financial transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Total Transactions</span>
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <ArrowUpDown className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight" data-testid="text-total-transactions">{txList.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All transaction records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Deposits</span>
              <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight" data-testid="text-deposit-count">{depositCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Incoming funds</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Withdrawals</span>
              <div className="w-8 h-8 rounded-md bg-red-400/10 flex items-center justify-center shrink-0">
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight" data-testid="text-withdrawal-count">{withdrawalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Outgoing funds</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-transactions"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-type-filter">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Payment Method</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-3 font-medium text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-muted-foreground">
                      Loading transactions...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <ArrowUpDown className="w-8 h-8 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No transactions found</p>
                        <p className="text-xs text-muted-foreground/70">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx) => (
                    <tr key={tx.id} className="border-b last:border-0" data-testid={`row-transaction-${tx.id}`}>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={`${getTypeBadgeClass(tx.type)} no-default-hover-elevate no-default-active-elevate`}>
                          {tx.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-mono font-medium ${tx.type === "deposit" ? "text-emerald-500" : "text-red-400"}`}>
                          {tx.type === "deposit" ? "+" : "-"}${Math.abs(Number(tx.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary" className={`${getStatusBadgeClass(tx.status)} no-default-hover-elevate no-default-active-elevate`}>
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground capitalize">{(tx.method || "--").replace(/_/g, " ")}</td>
                      <td className="py-3 px-3 text-muted-foreground">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "N/A"}</td>
                      <td className="py-3 px-3 text-muted-foreground text-xs">{tx.notes || tx.reference || "--"}</td>
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
