import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/lib/theme-provider";
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  Shield,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const [profile, setProfile] = useState({
    fullName: "Admin User",
    email: "admin@forexcrm.com",
    phone: "+1 234 567 890",
    country: "United States",
    timezone: "UTC-5",
    language: "en",
  });

  const [notifications, setNotifications] = useState({
    emailDeposits: true,
    emailWithdrawals: true,
    emailTrading: false,
    emailMarketing: false,
    pushDeposits: true,
    pushWithdrawals: true,
    pushTrading: true,
    pushMarketing: false,
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-settings-title">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account preferences</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="profile">
            <div className="border-b px-4 pt-2">
              <TabsList>
                <TabsTrigger value="profile" data-testid="tab-profile"><User className="w-4 h-4 mr-2" /> Profile</TabsTrigger>
                <TabsTrigger value="security" data-testid="tab-security"><Lock className="w-4 h-4 mr-2" /> Security</TabsTrigger>
                <TabsTrigger value="notifications" data-testid="tab-notifications"><Bell className="w-4 h-4 mr-2" /> Notifications</TabsTrigger>
                <TabsTrigger value="appearance" data-testid="tab-appearance"><Palette className="w-4 h-4 mr-2" /> Appearance</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">AD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">Update your profile photo</p>
                  <Button variant="outline" size="sm" className="mt-2" data-testid="button-change-avatar">
                    Change Photo
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} data-testid="input-settings-name" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} data-testid="input-settings-email" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} data-testid="input-settings-phone" />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} data-testid="input-settings-country" />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(v) => setProfile({ ...profile, timezone: v })}>
                    <SelectTrigger data-testid="select-timezone"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-5">UTC-5 (Eastern)</SelectItem>
                      <SelectItem value="UTC-6">UTC-6 (Central)</SelectItem>
                      <SelectItem value="UTC-7">UTC-7 (Mountain)</SelectItem>
                      <SelectItem value="UTC-8">UTC-8 (Pacific)</SelectItem>
                      <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                      <SelectItem value="UTC+1">UTC+1 (CET)</SelectItem>
                      <SelectItem value="UTC+3">UTC+3 (EAT)</SelectItem>
                      <SelectItem value="UTC+8">UTC+8 (CST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={profile.language} onValueChange={(v) => setProfile({ ...profile, language: v })}>
                    <SelectTrigger data-testid="select-language"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => toast({ title: "Profile updated" })} data-testid="button-save-profile">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </TabsContent>

            <TabsContent value="security" className="p-6 space-y-6">
              <div>
                <h3 className="font-medium mb-1">Change Password</h3>
                <p className="text-sm text-muted-foreground mb-4">Update your password regularly for security</p>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" placeholder="Enter current password" data-testid="input-current-password" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="Enter new password" data-testid="input-new-password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" placeholder="Confirm new password" data-testid="input-confirm-password" />
                  </div>
                  <Button data-testid="button-change-password">Update Password</Button>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-1">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
                <div className="flex items-center justify-between gap-4 max-w-md">
                  <div>
                    <p className="text-sm font-medium">Google Authenticator</p>
                    <p className="text-xs text-muted-foreground">Not configured</p>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-enable-2fa">Enable</Button>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-1">Active Sessions</h3>
                <p className="text-sm text-muted-foreground mb-4">Manage your active login sessions</p>
                <Card>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-muted-foreground">Chrome on Windows - IP: 192.168.1.1</p>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 text-xs">Active</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="p-6 space-y-6">
              <div>
                <h3 className="font-medium mb-4">Email Notifications</h3>
                <div className="space-y-4 max-w-lg">
                  {[
                    { key: "emailDeposits", label: "Deposit Confirmations", desc: "Receive email when deposits are processed" },
                    { key: "emailWithdrawals", label: "Withdrawal Updates", desc: "Receive email for withdrawal status changes" },
                    { key: "emailTrading", label: "Trading Alerts", desc: "Get notified about trading activity" },
                    { key: "emailMarketing", label: "Marketing Updates", desc: "Receive promotional emails and offers" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={(notifications as any)[item.key]}
                        onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                        data-testid={`switch-${item.key}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-4">Push Notifications</h3>
                <div className="space-y-4 max-w-lg">
                  {[
                    { key: "pushDeposits", label: "Deposit Alerts" },
                    { key: "pushWithdrawals", label: "Withdrawal Alerts" },
                    { key: "pushTrading", label: "Trading Activity" },
                    { key: "pushMarketing", label: "Promotions" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium">{item.label}</p>
                      <Switch
                        checked={(notifications as any)[item.key]}
                        onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                        data-testid={`switch-${item.key}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="p-6 space-y-6">
              <div className="max-w-lg">
                <h3 className="font-medium mb-1">Theme</h3>
                <p className="text-sm text-muted-foreground mb-4">Choose your preferred appearance</p>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
                  </div>
                  <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} data-testid="switch-dark-mode" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
