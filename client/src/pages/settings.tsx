import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Shield,
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

  const tabs = [
    { value: "profile", label: "Profile", icon: User },
    { value: "security", label: "Security", icon: Lock },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-settings-title">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account preferences and security</p>
      </div>

      <Tabs defaultValue="profile">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-3">
            <TabsList className="flex flex-col w-full h-auto gap-1 bg-transparent">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="w-full justify-start" data-testid={`tab-${tab.value}`}>
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div>
            <TabsContent value="profile" className="mt-0">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Profile Information</h3>
                <div className="flex items-center gap-4 flex-wrap mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-sky-50 dark:bg-sky-900/20 text-sky-600 text-lg">AD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Profile Picture</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your profile photo</p>
                    <Button variant="outline" size="sm" className="mt-2" data-testid="button-change-avatar">
                      Change Photo
                    </Button>
                  </div>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Full Name</Label>
                      <Input value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} data-testid="input-settings-name" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Email</Label>
                      <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} data-testid="input-settings-email" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Phone</Label>
                      <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} data-testid="input-settings-phone" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Country</Label>
                      <Input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} data-testid="input-settings-country" />
                    </div>
                  </div>
                  <Button className="mt-6" onClick={() => toast({ title: "Profile updated" })} data-testid="button-save-profile">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0 space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Change Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Update your password regularly for security</p>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Current Password</Label>
                    <Input type="password" placeholder="Enter current password" data-testid="input-current-password" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">New Password</Label>
                    <Input type="password" placeholder="Enter new password" data-testid="input-new-password" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Confirm New Password</Label>
                    <Input type="password" placeholder="Confirm new password" data-testid="input-confirm-password" />
                  </div>
                  <Button data-testid="button-change-password">Update Password</Button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Add an extra layer of security to your account</p>
                <div className="flex items-center justify-between gap-4 max-w-md p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                      <Shield className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Google Authenticator</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Not configured</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-enable-2fa">Enable</Button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Active Sessions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Manage your active login sessions</p>
                <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Current Session</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Chrome on Windows - IP: 192.168.1.1</p>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs no-default-hover-elevate no-default-active-elevate">Active</Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Email Notifications</h4>
                    <div className="space-y-4">
                      {[
                        { key: "emailDeposits", label: "Deposit Confirmations", desc: "Receive email when deposits are processed" },
                        { key: "emailWithdrawals", label: "Withdrawal Updates", desc: "Receive email for withdrawal status changes" },
                        { key: "emailTrading", label: "Trading Alerts", desc: "Get notified about trading activity" },
                        { key: "emailMarketing", label: "Marketing Updates", desc: "Receive promotional emails and offers" },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
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
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Push Notifications</h4>
                    <div className="space-y-4">
                      {[
                        { key: "pushDeposits", label: "Deposit Alerts" },
                        { key: "pushWithdrawals", label: "Withdrawal Alerts" },
                        { key: "pushTrading", label: "Trading Activity" },
                        { key: "pushMarketing", label: "Promotions" },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <Switch
                            checked={(notifications as any)[item.key]}
                            onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                            data-testid={`switch-${item.key}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Appearance</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Theme</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose your preferred appearance</p>
                    <div className="flex items-center justify-between gap-4 max-w-md p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
                      </div>
                      <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} data-testid="switch-dark-mode" />
                    </div>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-6 max-w-md space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Language</Label>
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
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
