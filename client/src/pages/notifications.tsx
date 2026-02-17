import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  DollarSign,
  Shield,
  TrendingUp,
  CheckCheck,
} from "lucide-react";

const notifications = [
  { id: 1, type: "success", icon: DollarSign, title: "Deposit Confirmed", message: "Your deposit of $5,000.00 has been processed successfully.", time: "2 hours ago", read: false },
  { id: 2, type: "warning", icon: Shield, title: "KYC Document Pending", message: "Your proof of address document is under review.", time: "5 hours ago", read: false },
  { id: 3, type: "info", icon: TrendingUp, title: "New Trading Account", message: "Your MT5 Standard account #78901234 has been created.", time: "1 day ago", read: true },
  { id: 4, type: "success", icon: CheckCircle, title: "Withdrawal Approved", message: "Your withdrawal of $1,000.00 has been approved.", time: "2 days ago", read: true },
  { id: 5, type: "info", icon: Bell, title: "System Maintenance", message: "Scheduled maintenance on Feb 20, 2026 from 2:00 AM to 4:00 AM UTC.", time: "3 days ago", read: true },
  { id: 6, type: "warning", icon: AlertCircle, title: "Margin Call Warning", message: "Account #12345678 is approaching margin call level.", time: "4 days ago", read: true },
];

export default function Notifications() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-notifications-title">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        <Button variant="outline" size="sm" data-testid="button-mark-all-read">
          <CheckCheck className="w-4 h-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const IconComp = notification.icon;
          const colorMap: Record<string, string> = {
            success: "text-emerald-500 bg-emerald-500/10",
            warning: "text-amber-500 bg-amber-500/10",
            info: "text-blue-500 bg-blue-500/10",
          };
          const iconColor = colorMap[notification.type] || colorMap.info;

          return (
            <Card
              key={notification.id}
              className={`${!notification.read ? "border-l-2 border-l-primary" : ""}`}
              data-testid={`notification-${notification.id}`}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
