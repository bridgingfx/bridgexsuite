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
  User,
  Lock,
  Bell,
  Palette,
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
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-settings-title">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account preferences and security</p>
      </div>

      <Tabs defaultValue="profile">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          <Card>
            <CardContent className="p-3">
              <TabsList className="flex flex-col w-full h-auto gap-1 bg-transparent">
                <TabsTrigger value="profile" className="w-full justify-start" data-testid="tab-profile">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full justify-start" data-testid="tab-security">
                  <Lock className="w-4 h-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start" data-testid="tab-notifications">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="appearance" className="w-full justify-start" data-testid="tab-appearance">
                  <Palette className="w-4 h-4 mr-2" />
                  Appearance
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          <div>
            <TabsContent value="profile" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 flex-wrap">
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
                  </div>
                  <Button onClick={() => toast({ title: "Profile updated" })} data-testid="button-save-profile">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Update your password regularly for security</p>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  <div className="flex items-center justify-between gap-4 max-w-md">
                    <div>
                      <p className="text-sm font-medium">Google Authenticator</p>
                      <p className="text-xs text-muted-foreground">Not configured</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-enable-2fa">Enable</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Manage your active login sessions</p>
                  <div className="flex items-center justify-between gap-4 p-4 rounded-md bg-muted/40">
                    <div>
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-muted-foreground">Chrome on Windows - IP: 192.168.1.1</p>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 text-xs">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-4">
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
                    <div className="space-y-4">
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-1">Theme</h3>
                    <p className="text-sm text-muted-foreground mb-4">Choose your preferred appearance</p>
                    <div className="flex items-center justify-between gap-4 max-w-md">
                      <div>
                        <p className="text-sm font-medium">Dark Mode</p>
                        <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
                      </div>
                      <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} data-testid="switch-dark-mode" />
                    </div>
                  </div>
                  <Separator />
                  <div className="max-w-md space-y-2">
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
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
