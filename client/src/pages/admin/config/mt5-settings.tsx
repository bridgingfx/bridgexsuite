import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Server,
  Settings,
  Users,
  Activity,
  FileText,
  Wifi,
  WifiOff,
  Save,
  Plus,
  Pencil,
  Trash2,
  Play,
  KeyRound,
  ArrowRightLeft,
  Scale,
} from "lucide-react";

interface ManagerAccount {
  id: string;
  loginId: string;
  name: string;
  role: "Admin" | "Manager" | "Read-Only";
  groupsAccess: string[];
  status: "Active" | "Inactive";
}

interface LogEntry {
  id: string;
  timestamp: string;
  operation: string;
  manager: string;
  account: string;
  amount: string;
  status: "Success" | "Failed" | "Pending";
  details: string;
}

const initialManagers: ManagerAccount[] = [
  { id: "1", loginId: "500", name: "John Admin", role: "Admin", groupsAccess: ["Default", "VIP", "ECN", "Standard"], status: "Active" },
  { id: "2", loginId: "501", name: "Sarah Manager", role: "Manager", groupsAccess: ["Default", "Standard"], status: "Active" },
  { id: "3", loginId: "502", name: "Mike Operations", role: "Manager", groupsAccess: ["VIP", "ECN"], status: "Active" },
  { id: "4", loginId: "503", name: "Emily Reader", role: "Read-Only", groupsAccess: ["Default"], status: "Active" },
  { id: "5", loginId: "504", name: "Tom Backup", role: "Admin", groupsAccess: ["Default", "VIP", "ECN", "Standard"], status: "Inactive" },
];

const initialLogs: LogEntry[] = [
  { id: "1", timestamp: "2025-01-15 14:32:10", operation: "Deposit", manager: "John Admin", account: "10001", amount: "$5,000.00", status: "Success", details: "Balance deposit for client request #4521" },
  { id: "2", timestamp: "2025-01-15 14:28:45", operation: "Withdrawal", manager: "Sarah Manager", account: "10045", amount: "$2,500.00", status: "Success", details: "Approved withdrawal request #4520" },
  { id: "3", timestamp: "2025-01-15 13:55:22", operation: "Change Leverage", manager: "John Admin", account: "10012", amount: "1:200", status: "Success", details: "Leverage changed from 1:100 to 1:200" },
  { id: "4", timestamp: "2025-01-15 13:40:18", operation: "Transfer Group", manager: "Mike Operations", account: "10033", amount: "-", status: "Success", details: "Moved from Standard to VIP group" },
  { id: "5", timestamp: "2025-01-15 13:15:00", operation: "Credit", manager: "John Admin", account: "10008", amount: "$1,000.00", status: "Success", details: "Bonus credit for promotion #P2025" },
  { id: "6", timestamp: "2025-01-15 12:50:33", operation: "Reset Password", manager: "Sarah Manager", account: "10055", amount: "-", status: "Success", details: "Password reset per client request" },
  { id: "7", timestamp: "2025-01-15 12:30:12", operation: "Deposit", manager: "Mike Operations", account: "10022", amount: "$10,000.00", status: "Success", details: "Wire transfer deposit confirmed" },
  { id: "8", timestamp: "2025-01-15 11:45:55", operation: "Withdrawal", manager: "John Admin", account: "10067", amount: "$3,200.00", status: "Failed", details: "Insufficient margin - withdrawal rejected" },
  { id: "9", timestamp: "2025-01-15 11:20:08", operation: "Change Leverage", manager: "Sarah Manager", account: "10041", amount: "1:500", status: "Success", details: "Leverage changed from 1:100 to 1:500" },
  { id: "10", timestamp: "2025-01-15 10:55:44", operation: "Deposit", manager: "Mike Operations", account: "10003", amount: "$750.00", status: "Pending", details: "Awaiting bank confirmation" },
  { id: "11", timestamp: "2025-01-15 10:30:19", operation: "Transfer Group", manager: "John Admin", account: "10090", amount: "-", status: "Success", details: "Moved from ECN to Standard group" },
  { id: "12", timestamp: "2025-01-15 09:50:02", operation: "Credit", manager: "Sarah Manager", account: "10015", amount: "$500.00", status: "Success", details: "Welcome bonus credit applied" },
  { id: "13", timestamp: "2025-01-15 09:15:38", operation: "Deposit", manager: "John Admin", account: "10078", amount: "$25,000.00", status: "Success", details: "Large deposit - verified and approved" },
  { id: "14", timestamp: "2025-01-15 08:45:11", operation: "Reset Password", manager: "Mike Operations", account: "10029", amount: "-", status: "Failed", details: "Account locked - requires admin unlock first" },
  { id: "15", timestamp: "2025-01-15 08:20:55", operation: "Withdrawal", manager: "John Admin", account: "10044", amount: "$1,800.00", status: "Success", details: "Standard withdrawal processed" },
];

const allGroups = ["Default", "VIP", "ECN", "Standard", "Demo", "Islamic"];

export default function Mt5SettingsPage() {
  const { toast } = useToast();

  const [serverConfig, setServerConfig] = useState({
    serverIp: "192.168.1.100",
    serverPort: "443",
    managerLoginId: "500",
    managerPassword: "",
    webApiUrl: "https://mt5server.example.com/api",
  });

  const [connectionStatus, setConnectionStatus] = useState({
    connected: true,
    lastConnected: "2025-01-15 14:30:00 UTC",
    serverVersion: "5.0.0 Build 4150",
  });

  const [managers, setManagers] = useState<ManagerAccount[]>(initialManagers);
  const [managerDialogOpen, setManagerDialogOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<ManagerAccount | null>(null);
  const [managerForm, setManagerForm] = useState({
    loginId: "",
    password: "",
    name: "",
    role: "Manager" as "Admin" | "Manager" | "Read-Only",
    groupsAccess: [] as string[],
    description: "",
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingManagerId, setDeletingManagerId] = useState<string | null>(null);

  const [batchOp, setBatchOp] = useState({
    operation: "Deposit",
    amount: "",
    target: "single",
    accountOrGroup: "",
    reason: "",
  });
  const [batchConfirmOpen, setBatchConfirmOpen] = useState(false);

  const [quickAction, setQuickAction] = useState({
    type: "",
    account: "",
    value: "",
  });
  const [quickConfirmOpen, setQuickConfirmOpen] = useState(false);

  const [logFilterOp, setLogFilterOp] = useState("all");
  const [logFilterDate, setLogFilterDate] = useState("");

  const filteredLogs = initialLogs.filter((log) => {
    if (logFilterOp !== "all" && log.operation !== logFilterOp) return false;
    if (logFilterDate && !log.timestamp.startsWith(logFilterDate)) return false;
    return true;
  });

  const handleTestConnection = () => {
    setConnectionStatus({ connected: true, lastConnected: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC", serverVersion: "5.0.0 Build 4150" });
    toast({ title: "Connection successful", description: "MT5 server is reachable and authenticated." });
  };

  const handleSaveServerConfig = () => {
    toast({ title: "Server configuration saved", description: "MT5 server settings have been updated." });
  };

  const openAddManager = () => {
    setEditingManager(null);
    setManagerForm({ loginId: "", password: "", name: "", role: "Manager", groupsAccess: [], description: "" });
    setManagerDialogOpen(true);
  };

  const openEditManager = (m: ManagerAccount) => {
    setEditingManager(m);
    setManagerForm({ loginId: m.loginId, password: "", name: m.name, role: m.role, groupsAccess: [...m.groupsAccess], description: "" });
    setManagerDialogOpen(true);
  };

  const handleSaveManager = () => {
    if (!managerForm.loginId || !managerForm.name) {
      toast({ title: "Validation error", description: "Login ID and Name are required.", variant: "destructive" });
      return;
    }
    if (editingManager) {
      setManagers((prev) =>
        prev.map((m) =>
          m.id === editingManager.id
            ? { ...m, loginId: managerForm.loginId, name: managerForm.name, role: managerForm.role, groupsAccess: managerForm.groupsAccess }
            : m
        )
      );
      toast({ title: "Manager updated", description: `Manager ${managerForm.name} has been updated.` });
    } else {
      const newManager: ManagerAccount = {
        id: String(Date.now()),
        loginId: managerForm.loginId,
        name: managerForm.name,
        role: managerForm.role,
        groupsAccess: managerForm.groupsAccess,
        status: "Active",
      };
      setManagers((prev) => [...prev, newManager]);
      toast({ title: "Manager added", description: `Manager ${managerForm.name} has been created.` });
    }
    setManagerDialogOpen(false);
  };

  const handleDeleteManager = () => {
    if (deletingManagerId) {
      setManagers((prev) => prev.filter((m) => m.id !== deletingManagerId));
      toast({ title: "Manager deleted", description: "Manager account has been removed." });
    }
    setDeleteConfirmOpen(false);
    setDeletingManagerId(null);
  };

  const handleExecuteBatch = () => {
    toast({ title: "Operation executed", description: `${batchOp.operation} of $${batchOp.amount} has been processed.` });
    setBatchConfirmOpen(false);
    setBatchOp({ operation: "Deposit", amount: "", target: "single", accountOrGroup: "", reason: "" });
  };

  const handleExecuteQuickAction = () => {
    const labels: Record<string, string> = { leverage: "Change Leverage", transfer: "Transfer Group", password: "Reset Password" };
    toast({ title: `${labels[quickAction.type]} completed`, description: `Action applied to account ${quickAction.account}.` });
    setQuickConfirmOpen(false);
    setQuickAction({ type: "", account: "", value: "" });
  };

  const toggleGroupAccess = (group: string) => {
    setManagerForm((prev) => ({
      ...prev,
      groupsAccess: prev.groupsAccess.includes(group) ? prev.groupsAccess.filter((g) => g !== group) : [...prev.groupsAccess, group],
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-6">
        <h1 className="text-2xl font-bold text-white" data-testid="text-mt5-admin-title">MT5 Administration</h1>
        <p className="text-sm text-blue-100 mt-1">Manage MetaTrader 5 server configuration, manager accounts, and operations</p>
      </div>

      <Tabs defaultValue="server-config">
        <TabsList>
          <TabsTrigger value="server-config" data-testid="tab-server-config"><Server className="w-4 h-4 mr-2" /> Server Config</TabsTrigger>
          <TabsTrigger value="managers" data-testid="tab-managers"><Users className="w-4 h-4 mr-2" /> Manager Accounts</TabsTrigger>
          <TabsTrigger value="operations" data-testid="tab-operations"><Activity className="w-4 h-4 mr-2" /> Operations</TabsTrigger>
          <TabsTrigger value="logs" data-testid="tab-logs"><FileText className="w-4 h-4 mr-2" /> Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="server-config" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Server Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                <div className="space-y-2">
                  <Label>Server IP Address</Label>
                  <Input value={serverConfig.serverIp} onChange={(e) => setServerConfig({ ...serverConfig, serverIp: e.target.value })} placeholder="192.168.1.100" data-testid="input-server-ip" />
                </div>
                <div className="space-y-2">
                  <Label>Server Port</Label>
                  <Input value={serverConfig.serverPort} onChange={(e) => setServerConfig({ ...serverConfig, serverPort: e.target.value })} placeholder="443" data-testid="input-server-port" />
                </div>
                <div className="space-y-2">
                  <Label>Manager Login ID</Label>
                  <Input value={serverConfig.managerLoginId} onChange={(e) => setServerConfig({ ...serverConfig, managerLoginId: e.target.value })} placeholder="500" data-testid="input-manager-login-id" />
                </div>
                <div className="space-y-2">
                  <Label>Manager Password</Label>
                  <Input type="password" value={serverConfig.managerPassword} onChange={(e) => setServerConfig({ ...serverConfig, managerPassword: e.target.value })} placeholder="Enter password" data-testid="input-manager-password" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Web API URL</Label>
                  <Input value={serverConfig.webApiUrl} onChange={(e) => setServerConfig({ ...serverConfig, webApiUrl: e.target.value })} placeholder="https://mt5server.example.com/api" data-testid="input-web-api-url" />
                </div>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      {connectionStatus.connected ? (
                        <Wifi className="w-5 h-5 text-green-500" data-testid="icon-connection-connected" />
                      ) : (
                        <WifiOff className="w-5 h-5 text-red-500" data-testid="icon-connection-disconnected" />
                      )}
                      <span className="text-sm font-medium" data-testid="text-connection-status">
                        {connectionStatus.connected ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground" data-testid="text-last-connected">
                      Last connected: {connectionStatus.lastConnected}
                    </span>
                    <span className="text-sm text-muted-foreground" data-testid="text-server-version">
                      Server: {connectionStatus.serverVersion}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-3 flex-wrap">
                <Button variant="outline" onClick={handleTestConnection} data-testid="button-test-connection">
                  <Wifi className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
                <Button onClick={handleSaveServerConfig} data-testid="button-save-server-config">
                  <Save className="w-4 h-4 mr-2" />
                  Save Server Config
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="managers" className="space-y-6 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Manager Accounts</CardTitle>
              <Button onClick={openAddManager} data-testid="button-add-manager">
                <Plus className="w-4 h-4 mr-2" />
                Add Manager
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Login ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Groups Access</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managers.map((m) => (
                    <TableRow key={m.id} data-testid={`row-manager-${m.id}`}>
                      <TableCell data-testid={`text-manager-login-${m.id}`}>{m.loginId}</TableCell>
                      <TableCell data-testid={`text-manager-name-${m.id}`}>{m.name}</TableCell>
                      <TableCell>
                        <Badge variant={m.role === "Admin" ? "default" : m.role === "Manager" ? "secondary" : "outline"} data-testid={`badge-manager-role-${m.id}`}>
                          {m.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 flex-wrap">
                          {m.groupsAccess.map((g) => (
                            <Badge key={g} variant="outline" className="text-xs" data-testid={`badge-group-${m.id}-${g}`}>{g}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={m.status === "Active" ? "default" : "secondary"} data-testid={`badge-manager-status-${m.id}`}>
                          {m.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openEditManager(m)} data-testid={`button-edit-manager-${m.id}`}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => { setDeletingManagerId(m.id); setDeleteConfirmOpen(true); }} data-testid={`button-delete-manager-${m.id}`}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5" /> Batch Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                <div className="space-y-2">
                  <Label>Balance Operation</Label>
                  <Select value={batchOp.operation} onValueChange={(v) => setBatchOp({ ...batchOp, operation: v })}>
                    <SelectTrigger data-testid="select-batch-operation"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Deposit">Deposit</SelectItem>
                      <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                      <SelectItem value="Credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount ($)</Label>
                  <Input type="number" value={batchOp.amount} onChange={(e) => setBatchOp({ ...batchOp, amount: e.target.value })} placeholder="0.00" data-testid="input-batch-amount" />
                </div>
                <div className="space-y-2">
                  <Label>Target</Label>
                  <Select value={batchOp.target} onValueChange={(v) => setBatchOp({ ...batchOp, target: v })}>
                    <SelectTrigger data-testid="select-batch-target"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Account</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                      <SelectItem value="all">All Accounts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{batchOp.target === "group" ? "Group" : "Account ID"}</Label>
                  {batchOp.target === "group" ? (
                    <Select value={batchOp.accountOrGroup} onValueChange={(v) => setBatchOp({ ...batchOp, accountOrGroup: v })}>
                      <SelectTrigger data-testid="select-batch-group"><SelectValue placeholder="Select group" /></SelectTrigger>
                      <SelectContent>
                        {allGroups.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={batchOp.accountOrGroup} onChange={(e) => setBatchOp({ ...batchOp, accountOrGroup: e.target.value })} placeholder={batchOp.target === "all" ? "All accounts" : "e.g. 10001"} disabled={batchOp.target === "all"} data-testid="input-batch-account" />
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Reason</Label>
                  <Input value={batchOp.reason} onChange={(e) => setBatchOp({ ...batchOp, reason: e.target.value })} placeholder="Reason for this operation" data-testid="input-batch-reason" />
                </div>
              </div>
              <Button onClick={() => setBatchConfirmOpen(true)} disabled={!batchOp.amount} data-testid="button-execute-batch">
                <Play className="w-4 h-4 mr-2" />
                Execute
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Scale className="w-4 h-4" /> Change Leverage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Account ID</Label>
                  <Input placeholder="e.g. 10001" data-testid="input-leverage-account" onChange={(e) => setQuickAction({ type: "leverage", account: e.target.value, value: quickAction.value })} />
                </div>
                <div className="space-y-2">
                  <Label>New Leverage</Label>
                  <Select onValueChange={(v) => setQuickAction((prev) => ({ ...prev, type: "leverage", value: v }))}>
                    <SelectTrigger data-testid="select-leverage-value"><SelectValue placeholder="Select leverage" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:50">1:50</SelectItem>
                      <SelectItem value="1:100">1:100</SelectItem>
                      <SelectItem value="1:200">1:200</SelectItem>
                      <SelectItem value="1:500">1:500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" variant="outline" onClick={() => { setQuickAction((prev) => ({ ...prev, type: "leverage" })); setQuickConfirmOpen(true); }} data-testid="button-change-leverage">
                  Apply
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><ArrowRightLeft className="w-4 h-4" /> Transfer Group</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Account ID</Label>
                  <Input placeholder="e.g. 10001" data-testid="input-transfer-account" onChange={(e) => setQuickAction({ type: "transfer", account: e.target.value, value: quickAction.value })} />
                </div>
                <div className="space-y-2">
                  <Label>New Group</Label>
                  <Select onValueChange={(v) => setQuickAction((prev) => ({ ...prev, type: "transfer", value: v }))}>
                    <SelectTrigger data-testid="select-transfer-group"><SelectValue placeholder="Select group" /></SelectTrigger>
                    <SelectContent>
                      {allGroups.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" variant="outline" onClick={() => { setQuickAction((prev) => ({ ...prev, type: "transfer" })); setQuickConfirmOpen(true); }} data-testid="button-transfer-group">
                  Apply
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><KeyRound className="w-4 h-4" /> Reset Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Account ID</Label>
                  <Input placeholder="e.g. 10001" data-testid="input-reset-account" onChange={(e) => setQuickAction({ type: "password", account: e.target.value, value: "" })} />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="New password" data-testid="input-reset-password" onChange={(e) => setQuickAction((prev) => ({ ...prev, type: "password", value: e.target.value }))} />
                </div>
                <Button className="w-full" variant="outline" onClick={() => { setQuickAction((prev) => ({ ...prev, type: "password" })); setQuickConfirmOpen(true); }} data-testid="button-reset-password">
                  Apply
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Operation Logs</CardTitle>
              <div className="flex items-center gap-3 flex-wrap">
                <Select value={logFilterOp} onValueChange={setLogFilterOp}>
                  <SelectTrigger className="w-[160px]" data-testid="select-log-filter-operation"><SelectValue placeholder="All Operations" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Operations</SelectItem>
                    <SelectItem value="Deposit">Deposit</SelectItem>
                    <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="Credit">Credit</SelectItem>
                    <SelectItem value="Change Leverage">Change Leverage</SelectItem>
                    <SelectItem value="Transfer Group">Transfer Group</SelectItem>
                    <SelectItem value="Reset Password">Reset Password</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" value={logFilterDate} onChange={(e) => setLogFilterDate(e.target.value)} className="w-[160px]" data-testid="input-log-filter-date" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Operation</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} data-testid={`row-log-${log.id}`}>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap" data-testid={`text-log-timestamp-${log.id}`}>{log.timestamp}</TableCell>
                      <TableCell data-testid={`text-log-operation-${log.id}`}>{log.operation}</TableCell>
                      <TableCell data-testid={`text-log-manager-${log.id}`}>{log.manager}</TableCell>
                      <TableCell data-testid={`text-log-account-${log.id}`}>{log.account}</TableCell>
                      <TableCell data-testid={`text-log-amount-${log.id}`}>{log.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={log.status === "Success" ? "default" : log.status === "Failed" ? "destructive" : "secondary"}
                          data-testid={`badge-log-status-${log.id}`}
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[250px] truncate" data-testid={`text-log-details-${log.id}`}>{log.details}</TableCell>
                    </TableRow>
                  ))}
                  {filteredLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No logs found matching the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={managerDialogOpen} onOpenChange={setManagerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle data-testid="text-manager-dialog-title">{editingManager ? "Edit Manager" : "Add Manager"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Login ID</Label>
              <Input value={managerForm.loginId} onChange={(e) => setManagerForm({ ...managerForm, loginId: e.target.value })} placeholder="e.g. 505" data-testid="input-dialog-login-id" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={managerForm.password} onChange={(e) => setManagerForm({ ...managerForm, password: e.target.value })} placeholder="Enter password" data-testid="input-dialog-password" />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={managerForm.name} onChange={(e) => setManagerForm({ ...managerForm, name: e.target.value })} placeholder="Full name" data-testid="input-dialog-name" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={managerForm.role} onValueChange={(v) => setManagerForm({ ...managerForm, role: v as "Admin" | "Manager" | "Read-Only" })}>
                <SelectTrigger data-testid="select-dialog-role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Read-Only">Read-Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Groups Access</Label>
              <div className="flex flex-wrap gap-3">
                {allGroups.map((group) => (
                  <div key={group} className="flex items-center gap-2">
                    <Checkbox
                      checked={managerForm.groupsAccess.includes(group)}
                      onCheckedChange={() => toggleGroupAccess(group)}
                      data-testid={`checkbox-group-${group}`}
                    />
                    <span className="text-sm">{group}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={managerForm.description} onChange={(e) => setManagerForm({ ...managerForm, description: e.target.value })} placeholder="Optional description" data-testid="input-dialog-description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setManagerDialogOpen(false)} data-testid="button-dialog-cancel">Cancel</Button>
            <Button onClick={handleSaveManager} data-testid="button-dialog-save">
              {editingManager ? "Update" : "Add"} Manager
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Manager Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this manager account? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-delete-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteManager} data-testid="button-delete-confirm">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={batchConfirmOpen} onOpenChange={setBatchConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Batch Operation</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to execute a <span className="font-medium">{batchOp.operation}</span> of <span className="font-medium">${batchOp.amount}</span> targeting <span className="font-medium">{batchOp.target === "single" ? `account ${batchOp.accountOrGroup}` : batchOp.target === "group" ? `group ${batchOp.accountOrGroup}` : "all accounts"}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-batch-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleExecuteBatch} data-testid="button-batch-confirm">Execute</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={quickConfirmOpen} onOpenChange={setQuickConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to apply <span className="font-medium">{quickAction.type === "leverage" ? "Change Leverage" : quickAction.type === "transfer" ? "Transfer Group" : "Reset Password"}</span> to account <span className="font-medium">{quickAction.account}</span>. Proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-quick-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleExecuteQuickAction} data-testid="button-quick-confirm">Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}