import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  DollarSign,
  Shield,
  TrendingUp,
  CheckCheck,
  Inbox,
} from "lucide-react";

const initialNotifications = [
  { id: 1, type: "success", icon: DollarSign, title: "Deposit Confirmed", message: "Your deposit of $5,000.00 has been processed successfully.", time: "2 hours ago", read: false },
  { id: 2, type: "warning", icon: Shield, title: "KYC Document Pending", message: "Your proof of address document is under review.", time: "5 hours ago", read: false },
  { id: 3, type: "info", icon: TrendingUp, title: "New Trading Account", message: "Your MT5 Standard account #78901234 has been created.", time: "1 day ago", read: true },
  { id: 4, type: "success", icon: CheckCircle, title: "Withdrawal Approved", message: "Your withdrawal of $1,000.00 has been approved.", time: "2 days ago", read: true },
  { id: 5, type: "info", icon: Bell, title: "System Maintenance", message: "Scheduled maintenance on Feb 20, 2026 from 2:00 AM to 4:00 AM UTC.", time: "3 days ago", read: true },
  { id: 6, type: "warning", icon: AlertCircle, title: "Margin Call Warning", message: "Account #12345678 is approaching margin call level.", time: "4 days ago", read: true },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const colorMap: Record<string, string> = {
    success: "text-emerald-500 bg-emerald-500/10",
    warning: "text-amber-500 bg-amber-500/10",
    info: "text-blue-500 bg-blue-500/10",
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-notifications-title">Notifications</h1>
          <p className="text-sm text-muted-foreground">Stay updated with your account activity</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead} data-testid="button-mark-all-read">
          <CheckCheck className="w-4 h-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Unread</span>
              <div className="w-8 h-8 rounded-md bg-amber-500/10 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-amber-500" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight" data-testid="text-unread-count">{unreadCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Notifications awaiting your attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Total</span>
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Inbox className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight" data-testid="text-total-count">{notifications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All notifications</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0" data-testid="list-notifications">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Bell className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const IconComp = notification.icon;
                const iconColor = colorMap[notification.type] || colorMap.info;

                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 cursor-pointer transition-colors ${
                      !notification.read ? "bg-muted/40" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
