import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, TrendingUp, Activity, DollarSign, BarChart3, Edit, Filter } from "lucide-react";
import type { TradingAccount, User } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  const cls: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-500",
    inactive: "bg-red-500/10 text-red-500",
    suspended: "bg-amber-500/10 text-amber-500",
  };
  return <Badge variant="secondary" className={`${cls[status] || ""} text-xs`}>{status}</Badge>;
}

export default function AdminAccounts() {
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ balance: "", leverage: "", status: "" });
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    userId: "",
    platform: "MT5",
    type: "standard",
    leverage: "1:100",
    currency: "USD",
    balance: "0",
  });

  const { data: accounts, isLoading } = useQuery<TradingAccount[]>({
    queryKey: ["/api/admin/trading-accounts"],
  });

  const { data: clients } = useQuery<User[]>({
    queryKey: ["/api/admin/clients"],
  });

  const clientMap = new Map((clients || []).map((c) => [c.id, c.fullName]));

  const filtered = (accounts || []).filter((a) => {
    const matchSearch = a.accountNumber.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = platformFilter === "all" || a.platform === platformFilter;
    const matchType = typeFilter === "all" || a.type === typeFilter;
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchPlatform && matchType && matchStatus;
  });

  const toggleSelectAccount = (id: string) => {
    setSelectedAccounts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedAccounts.size === filtered.length) {
      setSelectedAccounts(new Set());
    } else {
      setSelectedAccounts(new Set(filtered.map(a => a.id)));
    }
  };

  const handleBulkAction = (action: string) => {
    const count = selectedAccounts.size;
    toast({ title: `Bulk ${action}`, description: `${count} account(s) will be ${action === "activate" ? "activated" : action === "suspend" ? "suspended" : "updated"}.` });
    setSelectedAccounts(new Set());
    setBulkAction(null);
  };

  const totalBalance = filtered.reduce((s, a) => s + Number(a.balance), 0);
  const activeCount = filtered.filter((a) => a.status === "active").length;
  const avgBalance = filtered.length > 0 ? totalBalance / filtered.length : 0;

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/admin/trading-accounts", { ...data, equity: data.balance });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trading-accounts"] });
      toast({ title: "Trading account created" });
      setAddOpen(false);
      setFormData({ userId: "", platform: "MT5", type: "standard", leverage: "1:100", currency: "USD", balance: "0" });
    },
    onError: () => {
      toast({ title: "Failed to create account", variant: "destructive" });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof editData }) => {
      return apiRequest("PATCH", `/api/admin/trading-accounts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trading-accounts"] });
      toast({ title: "Account updated" });
      setEditId(null);
    },
    onError: () => {
      toast({ title: "Failed to update account", variant: "destructive" });
    },
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-admin-accounts-title">Trading Accounts</h1>
          <p className="text-sm text-muted-foreground">Manage all trading accounts</p>
        </div>
        <Button onClick={() => setAddOpen(true)} data-testid="button-create-account">
          <Plus className="w-4 h-4 mr-2" />
          Create Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Accounts</p>
              <p className="text-lg font-bold" data-testid="stat-total-accounts">{filtered.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-500/10 flex items-center justify-center"><Activity className="w-5 h-5 text-emerald-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Active Accounts</p>
              <p className="text-lg font-bold" data-testid="stat-active-accounts">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-blue-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Balance</p>
              <p className="text-lg font-bold" data-testid="stat-total-balance">${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-purple-500/10 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-purple-500" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Average Balance</p>
              <p className="text-lg font-bold" data-testid="stat-avg-balance">${avgBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4 space-y-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by account number..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-accounts" />
            </div>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[140px]" data-testid="filter-platform"><SelectValue placeholder="Platform" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="MT5">MT5</SelectItem>
                <SelectItem value="MT4">MT4</SelectItem>
                <SelectItem value="cTrader">cTrader</SelectItem>
                <SelectItem value="Vertex">Vertex</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]" data-testid="filter-type"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="ecn">ECN</SelectItem>
                <SelectItem value="demo">Demo</SelectItem>
                <SelectItem value="raw">Raw Spread</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]" data-testid="filter-status"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectedAccounts.size > 0 && (
            <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <span className="text-sm font-medium">{selectedAccounts.size} account(s) selected</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("activate")} data-testid="button-bulk-activate">Activate</Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("suspend")} data-testid="button-bulk-suspend">Suspend</Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedAccounts(new Set())} data-testid="button-bulk-clear">Clear</Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Table data-testid="table-admin-accounts">
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={filtered.length > 0 && selectedAccounts.size === filtered.length} onCheckedChange={toggleSelectAll} data-testid="checkbox-select-all" />
                </TableHead>
                <TableHead>Account #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Leverage</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Equity</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={12} className="text-center text-muted-foreground py-12">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={12} className="text-center text-muted-foreground py-12">No accounts found</TableCell></TableRow>
              ) : (
                filtered.map((a) => (
                  <TableRow key={a.id} data-testid={`row-admin-account-${a.id}`}>
                    <TableCell>
                      <Checkbox checked={selectedAccounts.has(a.id)} onCheckedChange={() => toggleSelectAccount(a.id)} data-testid={`checkbox-account-${a.id}`} />
                    </TableCell>
                    <TableCell className="font-mono font-medium">{a.accountNumber}</TableCell>
                    <TableCell>{clientMap.get(a.userId) || a.userId.slice(0, 8)}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{a.platform}</Badge></TableCell>
                    <TableCell className="capitalize">{a.type}</TableCell>
                    <TableCell>{a.leverage}</TableCell>
                    <TableCell className="font-mono">${Number(a.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="font-mono">${Number(a.equity).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>{a.currency}</TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => { setEditId(a.id); setEditData({ balance: String(a.balance), leverage: a.leverage, status: a.status }); }} data-testid={`button-edit-account-${a.id}`}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Create Trading Account</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={formData.userId} onValueChange={(v) => setFormData({ ...formData, userId: v })}>
                <SelectTrigger data-testid="select-account-client"><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>
                  {(clients || []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={formData.platform} onValueChange={(v) => setFormData({ ...formData, platform: v })}>
                <SelectTrigger data-testid="select-account-platform"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MT4">MetaTrader 4</SelectItem>
                  <SelectItem value="MT5">MetaTrader 5</SelectItem>
                  <SelectItem value="cTrader">cTrader</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger data-testid="select-account-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="ecn">ECN</SelectItem>
                  <SelectItem value="demo">Demo</SelectItem>
                  <SelectItem value="raw">Raw Spread</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Leverage</Label>
              <Select value={formData.leverage} onValueChange={(v) => setFormData({ ...formData, leverage: v })}>
                <SelectTrigger data-testid="select-account-leverage"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:50">1:50</SelectItem>
                  <SelectItem value="1:100">1:100</SelectItem>
                  <SelectItem value="1:200">1:200</SelectItem>
                  <SelectItem value="1:500">1:500</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                <SelectTrigger data-testid="select-account-currency"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Initial Balance</Label>
              <Input type="number" value={formData.balance} onChange={(e) => setFormData({ ...formData, balance: e.target.value })} placeholder="0.00" data-testid="input-account-balance" />
            </div>
            <Button className="w-full" onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending || !formData.userId} data-testid="button-submit-create-account">
              {createMutation.isPending ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editId} onOpenChange={(v) => { if (!v) setEditId(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Account</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Balance</Label>
              <Input type="number" value={editData.balance} onChange={(e) => setEditData({ ...editData, balance: e.target.value })} data-testid="input-edit-balance" />
            </div>
            <div className="space-y-2">
              <Label>Leverage</Label>
              <Select value={editData.leverage} onValueChange={(v) => setEditData({ ...editData, leverage: v })}>
                <SelectTrigger data-testid="select-edit-leverage"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:50">1:50</SelectItem>
                  <SelectItem value="1:100">1:100</SelectItem>
                  <SelectItem value="1:200">1:200</SelectItem>
                  <SelectItem value="1:500">1:500</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editData.status} onValueChange={(v) => setEditData({ ...editData, status: v })}>
                <SelectTrigger data-testid="select-edit-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => editId && editMutation.mutate({ id: editId, data: editData })} disabled={editMutation.isPending} data-testid="button-save-account-edit">
              {editMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
