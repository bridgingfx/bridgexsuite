import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Shield, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const initials = user?.fullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "U";

  const fields = [
    { label: "Full Name", value: user?.fullName || "N/A", icon: User },
    { label: "Email", value: user?.email || "N/A", icon: Mail },
    { label: "Phone", value: user?.phone || "N/A", icon: Phone },
    { label: "Country", value: user?.country || "N/A", icon: MapPin },
    { label: "KYC Status", value: user?.kycStatus || "N/A", icon: Shield },
    { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A", icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-page-title">Profile</h1>
        <p className="text-sm text-muted-foreground">Your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-lg font-semibold" data-testid="text-profile-name">{user?.fullName || "User"}</p>
              <p className="text-sm text-muted-foreground" data-testid="text-profile-email">{user?.email || ""}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Badge variant={user?.status === "active" ? "default" : "secondary"}>
                {user?.status || "N/A"}
              </Badge>
              <Badge variant="secondary">{user?.role || "client"}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <field.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{field.label}</p>
                    <p className="text-sm font-medium" data-testid={`text-profile-${field.label.toLowerCase().replace(/\s+/g, '-')}`}>{field.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
