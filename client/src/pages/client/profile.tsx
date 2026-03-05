import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Shield, Calendar, CheckCircle, Edit } from "lucide-react";
import { Link } from "wouter";

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

  const kycVerified = user?.kycStatus === "approved" || user?.kycStatus === "verified";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white" data-testid="text-page-title">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your account information</p>
      </div>

      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-xl p-6 text-white shadow-sm" data-testid="card-profile-header">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-white/20">
            <AvatarFallback className="bg-white/20 text-white text-3xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h2 className="text-2xl font-bold" data-testid="text-profile-name">{user?.fullName || "User"}</h2>
            <p className="text-brand-100 text-sm mt-1" data-testid="text-profile-email">{user?.email || ""}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap justify-center sm:justify-start">
              {kycVerified ? (
                <Badge className="bg-emerald-500/20 text-white border-0 no-default-hover-elevate no-default-active-elevate">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified Member
                </Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-white border-0 no-default-hover-elevate no-default-active-elevate">
                  <Shield className="w-3 h-3 mr-1" />
                  Unverified
                </Badge>
              )}
              <Badge className="bg-white/15 text-white border-0 no-default-hover-elevate no-default-active-elevate capitalize">
                {user?.role || "client"}
              </Badge>
              <Badge className={`border-0 no-default-hover-elevate no-default-active-elevate ${user?.status === "active" ? "bg-emerald-500/20 text-white" : "bg-white/15 text-white"}`}>
                {user?.status || "N/A"}
              </Badge>
            </div>
          </div>
          <div className="shrink-0">
            <Link href="/settings">
              <Button variant="outline" className="border-white/30 text-white backdrop-blur-sm bg-white/10" data-testid="button-edit-profile">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6" data-testid="card-account-details">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Account Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => (
            <div key={field.label} className="flex items-start gap-3">
              <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg shrink-0">
                <field.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">{field.label}</p>
                <p className="font-semibold text-gray-900 dark:text-white truncate" data-testid={`text-profile-${field.label.toLowerCase().replace(/\s+/g, '-')}`}>{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6" data-testid="card-account-activity">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Last Login</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white" data-testid="text-last-login">Today</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Account Type</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize" data-testid="text-account-type">{user?.role || "client"}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
              <Badge variant="secondary" className={`text-xs no-default-hover-elevate no-default-active-elevate ${user?.status === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : ""}`} data-testid="text-account-status">
                {user?.status || "N/A"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-6" data-testid="card-quick-links">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
          <div className="space-y-3">
            <Link href="/settings">
              <div className="flex items-center gap-3 p-3 rounded-lg hover-elevate cursor-pointer">
                <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
                  <User className="w-4 h-4 text-brand-600" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white" data-testid="link-edit-settings">Edit Settings</span>
              </div>
            </Link>
            <Link href="/kyc">
              <div className="flex items-center gap-3 p-3 rounded-lg hover-elevate cursor-pointer">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Shield className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white" data-testid="link-kyc-verification">KYC Verification</span>
              </div>
            </Link>
            <Link href="/support">
              <div className="flex items-center gap-3 p-3 rounded-lg hover-elevate cursor-pointer">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <Mail className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white" data-testid="link-support">Contact Support</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
