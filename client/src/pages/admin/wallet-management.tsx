import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet,
  Search,
  Download,
  Snowflake,
  Unlock,
  Eye,
  DollarSign,
  CreditCard,
  ArrowUpDown,
} from "lucide-react";

interface WalletTransaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  description: string;
}

interface WalletEntry {
  id: string;
  clientName: string;
  walletId: string;
  type: "Fiat" | "Crypto";
  currency: string;
  balance: number;
  isDefault: boolean;
  status: "Active" | "Frozen";
  createdDate: string;
  transactions: WalletTransaction[];
}

const mockWallets: WalletEntry[] = [
  {
    id: "1", clientName: "John Smith", walletId: "W-10001", type: "Fiat", currency: "USD", balance: 12500.00, isDefault: true, status: "Active", createdDate: "2024-01-15",
    transactions: [
      { id: "t1", date: "2024-03-10", type: "Deposit", amount: 5000, description: "Wire transfer" },
      { id: "t2", date: "2024-03-08", type: "Withdrawal", amount: -1200, description: "Bank withdrawal" },
      { id: "t3", date: "2024-03-05", type: "Credit", amount: 200, description: "Referral bonus" },
      { id: "t4", date: "2024-03-01", type: "Debit", amount: -50, description: "Transfer fee" },
      { id: "t5", date: "2024-02-28", type: "Deposit", amount: 3000, description: "Card deposit" },
    ],
  },
  {
    id: "2", clientName: "John Smith", walletId: "W-10002", type: "Crypto", currency: "BTC", balance: 1.2345, isDefault: false, status: "Active", createdDate: "2024-01-15",
    transactions: [
      { id: "t6", date: "2024-03-09", type: "Deposit", amount: 0.5, description: "BTC transfer in" },
      { id: "t7", date: "2024-03-07", type: "Withdrawal", amount: -0.1, description: "BTC transfer out" },
      { id: "t8", date: "2024-03-03", type: "Deposit", amount: 0.3, description: "Trading profit" },
      { id: "t9", date: "2024-02-28", type: "Deposit", amount: 0.2, description: "BTC purchase" },
      { id: "t10", date: "2024-02-25", type: "Deposit", amount: 0.3345, description: "Initial deposit" },
    ],
  },
  {
    id: "3", clientName: "Sarah Johnson", walletId: "W-10003", type: "Fiat", currency: "EUR", balance: 8750.50, isDefault: true, status: "Active", createdDate: "2024-02-01",
    transactions: [
      { id: "t11", date: "2024-03-10", type: "Deposit", amount: 2000, description: "SEPA transfer" },
      { id: "t12", date: "2024-03-06", type: "Withdrawal", amount: -500, description: "Bank payout" },
      { id: "t13", date: "2024-03-02", type: "Credit", amount: 100, description: "Loyalty reward" },
      { id: "t14", date: "2024-02-27", type: "Deposit", amount: 4000, description: "Wire transfer" },
      { id: "t15", date: "2024-02-20", type: "Deposit", amount: 3150.5, description: "Initial deposit" },
    ],
  },
  {
    id: "4", clientName: "Sarah Johnson", walletId: "W-10004", type: "Crypto", currency: "ETH", balance: 15.789, isDefault: false, status: "Active", createdDate: "2024-02-01",
    transactions: [
      { id: "t16", date: "2024-03-09", type: "Deposit", amount: 5.0, description: "ETH transfer" },
      { id: "t17", date: "2024-03-05", type: "Withdrawal", amount: -2.0, description: "ETH withdrawal" },
      { id: "t18", date: "2024-03-01", type: "Deposit", amount: 3.5, description: "Swap from BTC" },
      { id: "t19", date: "2024-02-25", type: "Deposit", amount: 4.289, description: "Purchase" },
      { id: "t20", date: "2024-02-15", type: "Deposit", amount: 5.0, description: "Initial deposit" },
    ],
  },
  {
    id: "5", clientName: "Michael Chen", walletId: "W-10005", type: "Fiat", currency: "USD", balance: 45230.00, isDefault: true, status: "Active", createdDate: "2024-01-20",
    transactions: [
      { id: "t21", date: "2024-03-10", type: "Deposit", amount: 10000, description: "Wire transfer" },
      { id: "t22", date: "2024-03-07", type: "Credit", amount: 500, description: "IB commission" },
      { id: "t23", date: "2024-03-03", type: "Withdrawal", amount: -2000, description: "Bank withdrawal" },
      { id: "t24", date: "2024-02-28", type: "Deposit", amount: 15000, description: "Wire transfer" },
      { id: "t25", date: "2024-02-20", type: "Deposit", amount: 21730, description: "Initial deposit" },
    ],
  },
  {
    id: "6", clientName: "Michael Chen", walletId: "W-10006", type: "Crypto", currency: "USDT", balance: 25000.00, isDefault: false, status: "Active", createdDate: "2024-01-20",
    transactions: [
      { id: "t26", date: "2024-03-08", type: "Deposit", amount: 10000, description: "USDT transfer" },
      { id: "t27", date: "2024-03-04", type: "Withdrawal", amount: -5000, description: "USDT payout" },
      { id: "t28", date: "2024-02-28", type: "Deposit", amount: 8000, description: "Swap" },
      { id: "t29", date: "2024-02-20", type: "Deposit", amount: 7000, description: "Purchase" },
      { id: "t30", date: "2024-02-15", type: "Deposit", amount: 5000, description: "Initial deposit" },
    ],
  },
  {
    id: "7", clientName: "Emma Wilson", walletId: "W-10007", type: "Fiat", currency: "GBP", balance: 3200.75, isDefault: true, status: "Frozen", createdDate: "2024-02-10",
    transactions: [
      { id: "t31", date: "2024-03-01", type: "Deposit", amount: 1500, description: "Bank transfer" },
      { id: "t32", date: "2024-02-25", type: "Deposit", amount: 1000, description: "Card deposit" },
      { id: "t33", date: "2024-02-20", type: "Credit", amount: 200.75, description: "Bonus" },
      { id: "t34", date: "2024-02-15", type: "Deposit", amount: 500, description: "Initial deposit" },
      { id: "t35", date: "2024-02-10", type: "Debit", amount: 0, description: "Account opened" },
    ],
  },
  {
    id: "8", clientName: "Emma Wilson", walletId: "W-10008", type: "Crypto", currency: "BTC", balance: 0.0567, isDefault: false, status: "Frozen", createdDate: "2024-02-10",
    transactions: [
      { id: "t36", date: "2024-02-28", type: "Deposit", amount: 0.03, description: "BTC transfer" },
      { id: "t37", date: "2024-02-20", type: "Deposit", amount: 0.0267, description: "Purchase" },
      { id: "t38", date: "2024-02-15", type: "Withdrawal", amount: -0.01, description: "Withdrawal" },
      { id: "t39", date: "2024-02-12", type: "Deposit", amount: 0.01, description: "Test deposit" },
      { id: "t40", date: "2024-02-10", type: "Debit", amount: 0, description: "Account opened" },
    ],
  },
  {
    id: "9", clientName: "David Park", walletId: "W-10009", type: "Fiat", currency: "USD", balance: 67890.25, isDefault: true, status: "Active", createdDate: "2023-12-05",
    transactions: [
      { id: "t41", date: "2024-03-10", type: "Deposit", amount: 20000, description: "Wire transfer" },
      { id: "t42", date: "2024-03-06", type: "Credit", amount: 1500, description: "IB payout" },
      { id: "t43", date: "2024-03-01", type: "Withdrawal", amount: -5000, description: "Withdrawal" },
      { id: "t44", date: "2024-02-25", type: "Deposit", amount: 15000, description: "Wire transfer" },
      { id: "t45", date: "2024-02-15", type: "Deposit", amount: 36390.25, description: "Account transfer" },
    ],
  },
  {
    id: "10", clientName: "David Park", walletId: "W-10010", type: "Crypto", currency: "ETH", balance: 42.5, isDefault: false, status: "Active", createdDate: "2023-12-05",
    transactions: [
      { id: "t46", date: "2024-03-09", type: "Deposit", amount: 10, description: "ETH transfer" },
      { id: "t47", date: "2024-03-05", type: "Withdrawal", amount: -5, description: "ETH payout" },
      { id: "t48", date: "2024-02-28", type: "Deposit", amount: 15, description: "Swap" },
      { id: "t49", date: "2024-02-20", type: "Deposit", amount: 12.5, description: "Purchase" },
      { id: "t50", date: "2024-02-10", type: "Deposit", amount: 10, description: "Initial deposit" },
    ],
  },
  {
    id: "11", clientName: "Lisa Martinez", walletId: "W-10011", type: "Fiat", currency: "EUR", balance: 15340.00, isDefault: true, status: "Active", createdDate: "2024-01-08",
    transactions: [
      { id: "t51", date: "2024-03-10", type: "Deposit", amount: 5000, description: "SEPA transfer" },
      { id: "t52", date: "2024-03-05", type: "Withdrawal", amount: -1500, description: "Withdrawal" },
      { id: "t53", date: "2024-03-01", type: "Credit", amount: 340, description: "Cashback" },
      { id: "t54", date: "2024-02-25", type: "Deposit", amount: 6000, description: "Wire" },
      { id: "t55", date: "2024-02-15", type: "Deposit", amount: 5500, description: "Initial deposit" },
    ],
  },
  {
    id: "12", clientName: "Lisa Martinez", walletId: "W-10012", type: "Crypto", currency: "USDT", balance: 8500.00, isDefault: false, status: "Active", createdDate: "2024-01-08",
    transactions: [
      { id: "t56", date: "2024-03-08", type: "Deposit", amount: 3000, description: "USDT transfer" },
      { id: "t57", date: "2024-03-04", type: "Withdrawal", amount: -1500, description: "USDT withdrawal" },
      { id: "t58", date: "2024-02-28", type: "Deposit", amount: 2000, description: "Swap" },
      { id: "t59", date: "2024-02-20", type: "Deposit", amount: 3000, description: "Purchase" },
      { id: "t60", date: "2024-02-12", type: "Deposit", amount: 2000, description: "Initial deposit" },
    ],
  },
  {
    id: "13", clientName: "Robert Taylor", walletId: "W-10013", type: "Fiat", currency: "GBP", balance: 920.00, isDefault: true, status: "Frozen", createdDate: "2024-02-20",
    transactions: [
      { id: "t61", date: "2024-03-01", type: "Deposit", amount: 500, description: "Card deposit" },
      { id: "t62", date: "2024-02-25", type: "Deposit", amount: 420, description: "Bank transfer" },
      { id: "t63", date: "2024-02-22", type: "Debit", amount: -50, description: "Fee" },
      { id: "t64", date: "2024-02-21", type: "Deposit", amount: 50, description: "Test deposit" },
      { id: "t65", date: "2024-02-20", type: "Debit", amount: 0, description: "Account opened" },
    ],
  },
  {
    id: "14", clientName: "Anna Kowalski", walletId: "W-10014", type: "Fiat", currency: "USD", balance: 31200.50, isDefault: true, status: "Active", createdDate: "2024-01-25",
    transactions: [
      { id: "t66", date: "2024-03-10", type: "Deposit", amount: 10000, description: "Wire transfer" },
      { id: "t67", date: "2024-03-06", type: "Withdrawal", amount: -3000, description: "Withdrawal" },
      { id: "t68", date: "2024-03-02", type: "Credit", amount: 200.5, description: "Bonus" },
      { id: "t69", date: "2024-02-25", type: "Deposit", amount: 12000, description: "Wire transfer" },
      { id: "t70", date: "2024-02-15", type: "Deposit", amount: 12000, description: "Initial deposit" },
    ],
  },
  {
    id: "15", clientName: "Anna Kowalski", walletId: "W-10015", type: "Crypto", currency: "BTC", balance: 0.8901, isDefault: false, status: "Active", createdDate: "2024-01-25",
    transactions: [
      { id: "t71", date: "2024-03-09", type: "Deposit", amount: 0.3, description: "BTC deposit" },
      { id: "t72", date: "2024-03-05", type: "Withdrawal", amount: -0.1, description: "BTC withdrawal" },
      { id: "t73", date: "2024-03-01", type: "Deposit", amount: 0.2, description: "Swap" },
      { id: "t74", date: "2024-02-25", type: "Deposit", amount: 0.2901, description: "Purchase" },
      { id: "t75", date: "2024-02-15", type: "Deposit", amount: 0.2, description: "Initial deposit" },
    ],
  },
  {
    id: "16", clientName: "James Cooper", walletId: "W-10016", type: "Fiat", currency: "EUR", balance: 5670.00, isDefault: true, status: "Active", createdDate: "2024-02-05",
    transactions: [
      { id: "t76", date: "2024-03-08", type: "Deposit", amount: 2000, description: "SEPA" },
      { id: "t77", date: "2024-03-03", type: "Withdrawal", amount: -800, description: "Withdrawal" },
      { id: "t78", date: "2024-02-28", type: "Credit", amount: 70, description: "Referral" },
      { id: "t79", date: "2024-02-20", type: "Deposit", amount: 2400, description: "Wire" },
      { id: "t80", date: "2024-02-10", type: "Deposit", amount: 2000, description: "Initial deposit" },
    ],
  },
  {
    id: "17", clientName: "James Cooper", walletId: "W-10017", type: "Crypto", currency: "ETH", balance: 7.25, isDefault: false, status: "Active", createdDate: "2024-02-05",
    transactions: [
      { id: "t81", date: "2024-03-07", type: "Deposit", amount: 3.0, description: "ETH transfer" },
      { id: "t82", date: "2024-03-02", type: "Withdrawal", amount: -1.0, description: "ETH payout" },
      { id: "t83", date: "2024-02-26", type: "Deposit", amount: 2.0, description: "Purchase" },
      { id: "t84", date: "2024-02-18", type: "Deposit", amount: 1.75, description: "Swap" },
      { id: "t85", date: "2024-02-10", type: "Deposit", amount: 1.5, description: "Initial deposit" },
    ],
  },
  {
    id: "18", clientName: "Sophie Nguyen", walletId: "W-10018", type: "Fiat", currency: "USD", balance: 0, isDefault: true, status: "Frozen", createdDate: "2024-03-01",
    transactions: [
      { id: "t86", date: "2024-03-05", type: "Withdrawal", amount: -1000, description: "Suspicious withdrawal" },
      { id: "t87", date: "2024-03-03", type: "Deposit", amount: 1000, description: "Card deposit" },
      { id: "t88", date: "2024-03-02", type: "Debit", amount: -500, description: "Chargeback" },
      { id: "t89", date: "2024-03-01", type: "Deposit", amount: 500, description: "Card deposit" },
      { id: "t90", date: "2024-03-01", type: "Debit", amount: 0, description: "Account opened" },
    ],
  },
];

function formatBalance(balance: number, currency: string): string {
  if (["BTC", "ETH"].includes(currency)) {
    return `${balance.toFixed(4)} ${currency}`;
  }
  return `${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export default function WalletManagementPage() {
  const { toast } = useToast();
  const [wallets, setWallets] = useState<WalletEntry[]>(mockWallets);
  const [searchQuery, setSearchQuery] = useState("");
  const [currencyTypeFilter, setCurrencyTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [adjustDialog, setAdjustDialog] = useState<WalletEntry | null>(null);
  const [adjustType, setAdjustType] = useState("credit");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [freezeDialog, setFreezeDialog] = useState<WalletEntry | null>(null);
  const [txDialog, setTxDialog] = useState<WalletEntry | null>(null);
  const [bulkFreezeDialog, setBulkFreezeDialog] = useState<"freeze" | "unfreeze" | null>(null);

  const filtered = wallets.filter((w) => {
    if (searchQuery && !w.clientName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (currencyTypeFilter !== "all" && w.type.toLowerCase() !== currencyTypeFilter) return false;
    if (statusFilter !== "all" && w.status.toLowerCase() !== statusFilter) return false;
    if (currencyFilter !== "all" && w.currency !== currencyFilter) return false;
    return true;
  });

  const totalWallets = wallets.length;
  const totalFiat = wallets.filter((w) => w.type === "Fiat").reduce((s, w) => s + w.balance, 0);
  const totalCrypto = wallets.filter((w) => w.type === "Crypto").reduce((s, w) => s + w.balance, 0);
  const frozenWallets = wallets.filter((w) => w.status === "Frozen").length;

  const allFilteredSelected = filtered.length > 0 && filtered.every((w) => selectedIds.has(w.id));

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((w) => next.delete(w.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((w) => next.add(w.id));
        return next;
      });
    }
  }

  function handleAdjustBalance() {
    if (!adjustDialog || !adjustAmount || !adjustReason) return;
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount <= 0) return;
    setWallets((prev) =>
      prev.map((w) =>
        w.id === adjustDialog.id
          ? { ...w, balance: adjustType === "credit" ? w.balance + amount : Math.max(0, w.balance - amount) }
          : w
      )
    );
    toast({ title: `Balance ${adjustType === "credit" ? "credited" : "debited"} successfully`, description: `${formatBalance(amount, adjustDialog.currency)} ${adjustType === "credit" ? "added to" : "removed from"} ${adjustDialog.walletId}` });
    setAdjustDialog(null);
    setAdjustAmount("");
    setAdjustReason("");
    setAdjustType("credit");
  }

  function handleFreezeToggle() {
    if (!freezeDialog) return;
    const newStatus = freezeDialog.status === "Active" ? "Frozen" : "Active";
    setWallets((prev) =>
      prev.map((w) => (w.id === freezeDialog.id ? { ...w, status: newStatus } : w))
    );
    toast({ title: `Wallet ${newStatus === "Frozen" ? "frozen" : "unfrozen"}`, description: `${freezeDialog.walletId} is now ${newStatus.toLowerCase()}` });
    setFreezeDialog(null);
  }

  function handleBulkAction() {
    if (!bulkFreezeDialog) return;
    const newStatus = bulkFreezeDialog === "freeze" ? "Frozen" as const : "Active" as const;
    setWallets((prev) =>
      prev.map((w) => (selectedIds.has(w.id) ? { ...w, status: newStatus } : w))
    );
    toast({ title: `Bulk ${bulkFreezeDialog} completed`, description: `${selectedIds.size} wallet(s) ${bulkFreezeDialog === "freeze" ? "frozen" : "unfrozen"}` });
    setBulkFreezeDialog(null);
    setSelectedIds(new Set());
  }

  function handleExport() {
    toast({ title: "Export started", description: "Your wallet data export is being prepared" });
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="rounded-md bg-gradient-to-r from-cyan-600 to-teal-600 p-6">
        <h1 className="text-2xl font-bold text-white" data-testid="text-wallet-management-title">
          Wallet Management
        </h1>
        <p className="text-cyan-100 text-sm mt-1">
          Manage client wallets, adjust balances, and monitor wallet activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-wallets">{totalWallets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Fiat Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-fiat">${totalFiat.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Crypto Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-crypto">{totalCrypto.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Frozen Wallets</CardTitle>
            <Snowflake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-frozen-wallets">{frozenWallets}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs text-muted-foreground mb-1 block">Client Name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-client"
                />
              </div>
            </div>
            <div className="min-w-[140px]">
              <Label className="text-xs text-muted-foreground mb-1 block">Currency Type</Label>
              <Select value={currencyTypeFilter} onValueChange={setCurrencyTypeFilter}>
                <SelectTrigger data-testid="select-currency-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="fiat">Fiat</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[140px]">
              <Label className="text-xs text-muted-foreground mb-1 block">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="frozen">Frozen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[140px]">
              <Label className="text-xs text-muted-foreground mb-1 block">Currency</Label>
              <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                <SelectTrigger data-testid="select-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              {selectedIds.size > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkFreezeDialog("freeze")}
                    data-testid="button-bulk-freeze"
                  >
                    <Snowflake className="h-4 w-4 mr-1" />
                    Freeze ({selectedIds.size})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkFreezeDialog("unfreeze")}
                    data-testid="button-bulk-unfreeze"
                  >
                    <Unlock className="h-4 w-4 mr-1" />
                    Unfreeze ({selectedIds.size})
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={handleExport} data-testid="button-export">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allFilteredSelected}
                      onCheckedChange={toggleSelectAll}
                      data-testid="checkbox-select-all"
                    />
                  </TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Wallet ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                      No wallets found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((wallet) => (
                    <TableRow key={wallet.id} data-testid={`row-wallet-${wallet.id}`}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(wallet.id)}
                          onCheckedChange={() => toggleSelect(wallet.id)}
                          data-testid={`checkbox-wallet-${wallet.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium" data-testid={`text-client-name-${wallet.id}`}>
                        {wallet.clientName}
                      </TableCell>
                      <TableCell className="text-muted-foreground" data-testid={`text-wallet-id-${wallet.id}`}>
                        {wallet.walletId}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs" data-testid={`badge-type-${wallet.id}`}>
                          {wallet.type}
                        </Badge>
                      </TableCell>
                      <TableCell data-testid={`text-currency-${wallet.id}`}>{wallet.currency}</TableCell>
                      <TableCell className="font-medium" data-testid={`text-balance-${wallet.id}`}>
                        {formatBalance(wallet.balance, wallet.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${wallet.isDefault ? "bg-emerald-500/10 text-emerald-500" : ""}`}
                          data-testid={`badge-default-${wallet.id}`}
                        >
                          {wallet.isDefault ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${wallet.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                          data-testid={`badge-status-${wallet.id}`}
                        >
                          {wallet.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground" data-testid={`text-created-${wallet.id}`}>
                        {wallet.createdDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setAdjustDialog(wallet);
                              setAdjustType("credit");
                              setAdjustAmount("");
                              setAdjustReason("");
                            }}
                            data-testid={`button-adjust-${wallet.id}`}
                          >
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setFreezeDialog(wallet)}
                            data-testid={`button-freeze-${wallet.id}`}
                          >
                            {wallet.status === "Active" ? <Snowflake className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setTxDialog(wallet)}
                            data-testid={`button-view-transactions-${wallet.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!adjustDialog} onOpenChange={(open) => !open && setAdjustDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Balance - {adjustDialog?.walletId}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={adjustType} onValueChange={setAdjustType}>
                <SelectTrigger data-testid="select-adjust-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                data-testid="input-adjust-amount"
              />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                placeholder="Enter reason for adjustment..."
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                data-testid="textarea-adjust-reason"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialog(null)} data-testid="button-adjust-cancel">
              Cancel
            </Button>
            <Button
              onClick={handleAdjustBalance}
              disabled={!adjustAmount || !adjustReason}
              data-testid="button-adjust-confirm"
            >
              Confirm Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!freezeDialog} onOpenChange={(open) => !open && setFreezeDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {freezeDialog?.status === "Active" ? "Freeze" : "Unfreeze"} Wallet
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to {freezeDialog?.status === "Active" ? "freeze" : "unfreeze"} wallet{" "}
            <span className="font-medium">{freezeDialog?.walletId}</span> belonging to{" "}
            <span className="font-medium">{freezeDialog?.clientName}</span>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFreezeDialog(null)} data-testid="button-freeze-cancel">
              Cancel
            </Button>
            <Button
              variant={freezeDialog?.status === "Active" ? "destructive" : "default"}
              onClick={handleFreezeToggle}
              data-testid="button-freeze-confirm"
            >
              {freezeDialog?.status === "Active" ? "Freeze Wallet" : "Unfreeze Wallet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!txDialog} onOpenChange={(open) => !open && setTxDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Recent Transactions - {txDialog?.walletId}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txDialog?.transactions.map((tx) => (
                  <TableRow key={tx.id} data-testid={`row-transaction-${tx.id}`}>
                    <TableCell className="text-muted-foreground text-xs">{tx.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs" data-testid={`badge-tx-type-${tx.id}`}>
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`font-medium text-xs ${tx.amount >= 0 ? "text-emerald-500" : "text-red-500"}`}
                      data-testid={`text-tx-amount-${tx.id}`}
                    >
                      {tx.amount >= 0 ? "+" : ""}
                      {formatBalance(Math.abs(tx.amount), txDialog.currency)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{tx.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTxDialog(null)} data-testid="button-close-transactions">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!bulkFreezeDialog} onOpenChange={(open) => !open && setBulkFreezeDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Bulk {bulkFreezeDialog === "freeze" ? "Freeze" : "Unfreeze"} Wallets
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to {bulkFreezeDialog} {selectedIds.size} selected wallet(s)?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkFreezeDialog(null)} data-testid="button-bulk-cancel">
              Cancel
            </Button>
            <Button
              variant={bulkFreezeDialog === "freeze" ? "destructive" : "default"}
              onClick={handleBulkAction}
              data-testid="button-bulk-confirm"
            >
              {bulkFreezeDialog === "freeze" ? "Freeze All" : "Unfreeze All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
