import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface GroupConfig {
  id: number;
  name: string;
  platform: string;
  type: string;
  leverage: string;
  spread: string;
  commission: string;
  minDeposit: string;
  status: string;
}

const initialGroups: GroupConfig[] = [
  { id: 1, name: "Standard", platform: "MT5", type: "Trading", leverage: "1:100", spread: "1.2 pips", commission: "$3.50", minDeposit: "$100", status: "Active" },
  { id: 2, name: "ECN Pro", platform: "MT5", type: "Trading", leverage: "1:500", spread: "0.1 pips", commission: "$7.00", minDeposit: "$5,000", status: "Active" },
  { id: 3, name: "PropFirm Challenge", platform: "MT5", type: "PropFirm", leverage: "1:100", spread: "0.5 pips", commission: "$5.00", minDeposit: "$250", status: "Active" },
  { id: 4, name: "PropFirm Funded", platform: "cTrader", type: "PropFirm", leverage: "1:50", spread: "0.3 pips", commission: "$4.00", minDeposit: "$0", status: "Active" },
  { id: 5, name: "League Bronze", platform: "MT5", type: "League", leverage: "1:200", spread: "1.0 pips", commission: "$2.00", minDeposit: "$50", status: "Active" },
  { id: 6, name: "League Gold", platform: "cTrader", type: "League", leverage: "1:200", spread: "0.8 pips", commission: "$3.00", minDeposit: "$500", status: "Active" },
  { id: 7, name: "Investment Growth", platform: "Vertex", type: "Investment", leverage: "1:10", spread: "2.0 pips", commission: "$1.00", minDeposit: "$1,000", status: "Inactive" },
  { id: 8, name: "Investment Premium", platform: "Vertex", type: "Investment", leverage: "1:20", spread: "1.5 pips", commission: "$1.50", minDeposit: "$10,000", status: "Active" },
  { id: 9, name: "cTrader Standard", platform: "cTrader", type: "Trading", leverage: "1:100", spread: "0.6 pips", commission: "$6.00", minDeposit: "$200", status: "Active" },
  { id: 10, name: "Micro Account", platform: "MT5", type: "Trading", leverage: "1:1000", spread: "1.8 pips", commission: "$0.00", minDeposit: "$10", status: "Active" },
];

const emptyGroupForm = {
  name: "",
  platform: "",
  type: "",
  leverage: "",
  spreadType: "",
  commission: "",
  minDeposit: "",
  maxLeverage: "",
  description: "",
};

export default function GroupConfigPage() {
  const { toast } = useToast();
  const [groups, setGroups] = useState<GroupConfig[]>(initialGroups);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupConfig | null>(null);
  const [groupForm, setGroupForm] = useState(emptyGroupForm);
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const filteredGroups = groups.filter((g) => {
    if (filterPlatform !== "all" && g.platform !== filterPlatform) return false;
    if (filterType !== "all" && g.type !== filterType) return false;
    return true;
  });

  const openAddDialog = () => {
    setEditingGroup(null);
    setGroupForm(emptyGroupForm);
    setDialogOpen(true);
  };

  const openEditDialog = (group: GroupConfig) => {
    setEditingGroup(group);
    setGroupForm({
      name: group.name,
      platform: group.platform,
      type: group.type,
      leverage: group.leverage,
      spreadType: "Variable",
      commission: group.commission,
      minDeposit: group.minDeposit,
      maxLeverage: group.leverage,
      description: "",
    });
    setDialogOpen(true);
  };

  const handleSaveGroup = () => {
    if (!groupForm.name || !groupForm.platform || !groupForm.type) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    if (editingGroup) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === editingGroup.id
            ? { ...g, name: groupForm.name, platform: groupForm.platform, type: groupForm.type, leverage: groupForm.leverage || g.leverage, commission: groupForm.commission || g.commission, minDeposit: groupForm.minDeposit || g.minDeposit }
            : g
        )
      );
      toast({ title: "Group updated successfully" });
    } else {
      const newGroup: GroupConfig = {
        id: Math.max(...groups.map((g) => g.id)) + 1,
        name: groupForm.name,
        platform: groupForm.platform,
        type: groupForm.type,
        leverage: groupForm.leverage || "1:100",
        spread: groupForm.spreadType === "Fixed" ? "1.0 pips" : "0.5 pips",
        commission: groupForm.commission || "$0.00",
        minDeposit: groupForm.minDeposit || "$0",
        status: "Active",
      };
      setGroups((prev) => [...prev, newGroup]);
      toast({ title: "Group created successfully" });
    }
    setDialogOpen(false);
  };

  const handleDeleteGroup = (id: number) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    toast({ title: "Group deleted" });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="rounded-md bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-group-config-title">Group Configuration</h1>
        <p className="text-sm text-muted-foreground mt-1" data-testid="text-group-config-subtitle">
          Manage trading groups, leverage, spreads, and commissions across platforms
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
            <SelectTrigger data-testid="select-filter-platform" className="w-[160px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="MT5">MT5</SelectItem>
              <SelectItem value="cTrader">cTrader</SelectItem>
              <SelectItem value="Vertex">Vertex</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger data-testid="select-filter-type" className="w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Trading">Trading</SelectItem>
              <SelectItem value="PropFirm">PropFirm</SelectItem>
              <SelectItem value="League">League</SelectItem>
              <SelectItem value="Investment">Investment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAddDialog} data-testid="button-add-group">
          <Plus className="w-4 h-4 mr-2" />
          Add Group
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Leverage</TableHead>
                <TableHead>Spread</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Min Deposit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((group) => (
                <TableRow key={group.id} data-testid={`row-group-${group.id}`}>
                  <TableCell className="font-medium" data-testid={`text-group-name-${group.id}`}>{group.name}</TableCell>
                  <TableCell data-testid={`text-group-platform-${group.id}`}>
                    <Badge variant="outline" className="no-default-active-elevate">{group.platform}</Badge>
                  </TableCell>
                  <TableCell data-testid={`text-group-type-${group.id}`}>
                    <Badge variant="secondary" className="no-default-active-elevate">{group.type}</Badge>
                  </TableCell>
                  <TableCell data-testid={`text-group-leverage-${group.id}`}>{group.leverage}</TableCell>
                  <TableCell data-testid={`text-group-spread-${group.id}`}>{group.spread}</TableCell>
                  <TableCell data-testid={`text-group-commission-${group.id}`}>{group.commission}</TableCell>
                  <TableCell data-testid={`text-group-mindeposit-${group.id}`}>{group.minDeposit}</TableCell>
                  <TableCell data-testid={`text-group-status-${group.id}`}>
                    <Badge variant={group.status === "Active" ? "default" : "secondary"} className="no-default-active-elevate">
                      {group.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEditDialog(group)} data-testid={`button-edit-group-${group.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteGroup(group.id)} data-testid={`button-delete-group-${group.id}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredGroups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No groups found matching filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle data-testid="text-dialog-title">{editingGroup ? "Edit Group" : "Add Group"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Group Name</Label>
              <Input
                value={groupForm.name}
                onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                placeholder="Enter group name"
                data-testid="input-group-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={groupForm.platform} onValueChange={(v) => setGroupForm({ ...groupForm, platform: v })}>
                  <SelectTrigger data-testid="select-group-platform"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MT5">MT5</SelectItem>
                    <SelectItem value="cTrader">cTrader</SelectItem>
                    <SelectItem value="Vertex">Vertex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={groupForm.type} onValueChange={(v) => setGroupForm({ ...groupForm, type: v })}>
                  <SelectTrigger data-testid="select-group-type"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trading">Trading</SelectItem>
                    <SelectItem value="PropFirm">PropFirm</SelectItem>
                    <SelectItem value="League">League</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Leverage</Label>
                <Select value={groupForm.leverage} onValueChange={(v) => setGroupForm({ ...groupForm, leverage: v })}>
                  <SelectTrigger data-testid="select-group-leverage"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:10">1:10</SelectItem>
                    <SelectItem value="1:50">1:50</SelectItem>
                    <SelectItem value="1:100">1:100</SelectItem>
                    <SelectItem value="1:200">1:200</SelectItem>
                    <SelectItem value="1:500">1:500</SelectItem>
                    <SelectItem value="1:1000">1:1000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Spread Type</Label>
                <Select value={groupForm.spreadType} onValueChange={(v) => setGroupForm({ ...groupForm, spreadType: v })}>
                  <SelectTrigger data-testid="select-group-spread-type"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Variable">Variable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Commission</Label>
                <Input
                  value={groupForm.commission}
                  onChange={(e) => setGroupForm({ ...groupForm, commission: e.target.value })}
                  placeholder="$0.00"
                  data-testid="input-group-commission"
                />
              </div>
              <div className="space-y-2">
                <Label>Min Deposit</Label>
                <Input
                  value={groupForm.minDeposit}
                  onChange={(e) => setGroupForm({ ...groupForm, minDeposit: e.target.value })}
                  placeholder="$0"
                  data-testid="input-group-min-deposit"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Max Leverage</Label>
              <Input
                value={groupForm.maxLeverage}
                onChange={(e) => setGroupForm({ ...groupForm, maxLeverage: e.target.value })}
                placeholder="1:500"
                data-testid="input-group-max-leverage"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={groupForm.description}
                onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                placeholder="Group description..."
                data-testid="input-group-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} data-testid="button-cancel-group">Cancel</Button>
            <Button onClick={handleSaveGroup} data-testid="button-save-group">
              {editingGroup ? "Update Group" : "Create Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
