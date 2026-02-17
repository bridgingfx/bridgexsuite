import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Plus, Save, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PlatformSetting } from "@shared/schema";

export default function SuperAdminPlatformConfig() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [formData, setFormData] = useState({ settingKey: "", settingValue: "", category: "general", description: "" });
  const [editValue, setEditValue] = useState("");

  const { data: settings = [], isLoading } = useQuery<PlatformSetting[]>({ queryKey: ["/api/super-admin/platform-settings"] });

  const saveMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/super-admin/platform-settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/super-admin/platform-settings"] });
      toast({ title: "Setting saved" });
      setDialogOpen(false);
      setEditMode(null);
      setFormData({ settingKey: "", settingValue: "", category: "general", description: "" });
    },
    onError: () => toast({ title: "Failed to save setting", variant: "destructive" }),
  });

  const categories = Array.from(new Set(settings.map(s => s.category)));

  const handleEdit = (setting: PlatformSetting) => {
    setEditMode(setting.settingKey);
    setEditValue(setting.settingValue);
  };

  const handleSaveEdit = (setting: PlatformSetting) => {
    saveMutation.mutate({
      settingKey: setting.settingKey,
      settingValue: editValue,
      category: setting.category,
      description: setting.description,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-sa-config-title">Platform Configuration</h1>
          <p className="text-muted-foreground">Manage platform-wide settings and configuration</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-setting"><Plus className="w-4 h-4 mr-2" />Add Setting</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Platform Setting</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Setting Key</Label>
                  <Input data-testid="input-setting-key" value={formData.settingKey} onChange={(e) => setFormData({ ...formData, settingKey: e.target.value })} placeholder="e.g. max_upload_size" />
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input data-testid="input-setting-value" value={formData.settingValue} onChange={(e) => setFormData({ ...formData, settingValue: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger data-testid="select-setting-category"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="limits">Limits</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input data-testid="input-setting-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
              </div>
              <Button className="w-full" data-testid="button-submit-setting" onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : "Save Setting"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-24 bg-muted animate-pulse rounded-md" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg capitalize flex items-center gap-2">
                  <Settings className="w-4 h-4" />{category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {settings.filter(s => s.category === category).map((setting) => (
                    <div key={setting.settingKey} className="flex items-center justify-between gap-4 p-3 rounded-md border" data-testid={`setting-${setting.settingKey}`}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium font-mono">{setting.settingKey}</p>
                          <Badge variant="outline" className="text-xs">{setting.category}</Badge>
                        </div>
                        {setting.description && <p className="text-xs text-muted-foreground mt-1">{setting.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {editMode === setting.settingKey ? (
                          <>
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-40"
                              data-testid={`input-edit-${setting.settingKey}`}
                            />
                            <Button size="sm" onClick={() => handleSaveEdit(setting)} disabled={saveMutation.isPending} data-testid={`button-save-${setting.settingKey}`}>
                              <Save className="w-3 h-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm font-medium" data-testid={`text-setting-value-${setting.settingKey}`}>{setting.settingValue}</span>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(setting)} data-testid={`button-edit-${setting.settingKey}`}>
                              <Edit className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {settings.length === 0 && (
            <Card><CardContent className="py-12 text-center text-muted-foreground">No platform settings configured</CardContent></Card>
          )}
        </div>
      )}
    </div>
  );
}
