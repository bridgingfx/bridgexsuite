import { Switch, Route, useLocation } from "wouter";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SuperAdminSidebar } from "@/components/super-admin-sidebar";
import { ThemeProvider } from "@/lib/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, Crown, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

import Dashboard from "@/pages/dashboard";
import TradingAccounts from "@/pages/trading-accounts";
import WalletPage from "@/pages/wallet";
import Transactions from "@/pages/transactions";
import KycPage from "@/pages/kyc";
import Support from "@/pages/support";
import Notifications from "@/pages/notifications";
import SettingsPage from "@/pages/settings";
import PropTradingPage from "@/pages/prop-trading";
import InvestmentPage from "@/pages/investment";
import CopyTradingPage from "@/pages/copy-trading";
import PammPage from "@/pages/pamm";

import AdminDashboard from "@/pages/admin/dashboard";
import AdminClients from "@/pages/admin/clients";
import AdminClientDetail from "@/pages/admin/client-detail";
import AdminFinance from "@/pages/admin/finance";
import AdminAccounts from "@/pages/admin/accounts";
import AdminKycVerification from "@/pages/admin/kyc-verification";
import AdminIbManagement from "@/pages/admin/ib-management";
import AdminSupport from "@/pages/admin/support-admin";
import AdminReports from "@/pages/admin/reports";
import AdminSettings from "@/pages/admin/system-settings";

import SuperAdminDashboard from "@/pages/super-admin/dashboard";
import SuperAdminBrokers from "@/pages/super-admin/brokers";
import SuperAdminBrokerDetail from "@/pages/super-admin/broker-detail";
import SuperAdminPlans from "@/pages/super-admin/plans";
import SuperAdminAdminUsers from "@/pages/super-admin/admin-users";
import SuperAdminBranding from "@/pages/super-admin/branding";
import SuperAdminAnalytics from "@/pages/super-admin/analytics";
import SuperAdminPlatformConfig from "@/pages/super-admin/platform-config";

import ClientLoginPage from "@/pages/login";
import AdminLoginPage from "@/pages/admin/login";
import SuperAdminLoginPage from "@/pages/super-admin/login";
import NotFound from "@/pages/not-found";

function RedirectTo({ path }: { path: string }) {
  const [, setLocation] = useLocation();
  setLocation(path);
  return null;
}

function LogoutButton() {
  const [location, setLocation] = useLocation();

  async function handleLogout() {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch (e) {}
    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    if (location.startsWith("/super-admin")) {
      setLocation("/super-admin/login");
    } else if (location.startsWith("/admin")) {
      setLocation("/admin/login");
    } else {
      setLocation("/login");
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-logout">
      <LogOut className="w-4 h-4" />
    </Button>
  );
}

function ClientRouter() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/trading" component={TradingAccounts} />
      <Route path="/trading/live" component={TradingAccounts} />
      <Route path="/trading/demo" component={TradingAccounts} />
      <Route path="/wallet" component={WalletPage} />
      <Route path="/wallet/deposits" component={WalletPage} />
      <Route path="/wallet/withdrawals" component={WalletPage} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/kyc" component={KycPage} />
      <Route path="/kyc/documents" component={KycPage} />
      <Route path="/support" component={Support} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/prop-trading" component={PropTradingPage} />
      <Route path="/investment" component={InvestmentPage} />
      <Route path="/copy-trading" component={CopyTradingPage} />
      <Route path="/pamm" component={PammPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/clients" component={AdminClients} />
      <Route path="/admin/clients/:id" component={AdminClientDetail} />
      <Route path="/admin/finance" component={AdminFinance} />
      <Route path="/admin/finance/pending" component={AdminFinance} />
      <Route path="/admin/finance/deposits" component={AdminFinance} />
      <Route path="/admin/finance/withdrawals" component={AdminFinance} />
      <Route path="/admin/accounts" component={AdminAccounts} />
      <Route path="/admin/kyc" component={AdminKycVerification} />
      <Route path="/admin/ib" component={AdminIbManagement} />
      <Route path="/admin/support" component={AdminSupport} />
      <Route path="/admin/reports" component={AdminReports} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function SuperAdminRouter() {
  return (
    <Switch>
      <Route path="/super-admin" component={SuperAdminDashboard} />
      <Route path="/super-admin/brokers" component={SuperAdminBrokers} />
      <Route path="/super-admin/brokers/:id" component={SuperAdminBrokerDetail} />
      <Route path="/super-admin/plans" component={SuperAdminPlans} />
      <Route path="/super-admin/admins" component={SuperAdminAdminUsers} />
      <Route path="/super-admin/branding" component={SuperAdminBranding} />
      <Route path="/super-admin/analytics" component={SuperAdminAnalytics} />
      <Route path="/super-admin/config" component={SuperAdminPlatformConfig} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ClientLayout() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-background sticky top-0 z-50">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-1">
              <Link href="/notifications">
                <Button variant="ghost" size="icon" data-testid="button-notifications">
                  <Bell className="w-4 h-4" />
                </Button>
              </Link>
              <ThemeToggle />
              <LogoutButton />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <ClientRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AdminLayout() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-background sticky top-0 z-50">
            <SidebarTrigger data-testid="button-admin-sidebar-toggle" />
            <div className="flex items-center gap-1">
              <Link href="/super-admin">
                <Button variant="ghost" size="icon" data-testid="button-super-admin-panel">
                  <Crown className="w-4 h-4" />
                </Button>
              </Link>
              <ThemeToggle />
              <LogoutButton />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <AdminRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function SuperAdminLayout() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <SuperAdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-background sticky top-0 z-50">
            <SidebarTrigger data-testid="button-sa-sidebar-toggle" />
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <LogoutButton />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <SuperAdminRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AuthenticatedApp() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const isSuperAdmin = location.startsWith("/super-admin");
  const isAdmin = location.startsWith("/admin");

  if (isSuperAdmin && user?.role !== "super_admin") {
    setLocation(user?.role === "admin" ? "/admin" : "/");
    return null;
  }
  if (isAdmin && user?.role !== "admin" && user?.role !== "super_admin") {
    setLocation("/");
    return null;
  }

  return isSuperAdmin ? <SuperAdminLayout /> : isAdmin ? <AdminLayout /> : <ClientLayout />;
}

function AppContent() {
  const [location] = useLocation();
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (location === "/login" || (location === "/" && !isAuthenticated)) {
    if (isAuthenticated && user) {
      if (user.role === "super_admin") {
        return <RedirectTo path="/super-admin" />;
      } else if (user.role === "admin") {
        return <RedirectTo path="/admin" />;
      } else {
        return <RedirectTo path="/" />;
      }
    }
    return <ClientLoginPage />;
  }

  if (location === "/admin/login") {
    if (isAuthenticated && (user?.role === "admin" || user?.role === "super_admin")) {
      return <RedirectTo path="/admin" />;
    }
    return <AdminLoginPage />;
  }

  if (location === "/super-admin/login") {
    if (isAuthenticated && user?.role === "super_admin") {
      return <RedirectTo path="/super-admin" />;
    }
    return <SuperAdminLoginPage />;
  }

  if (!isAuthenticated) {
    if (location.startsWith("/super-admin")) {
      return <RedirectTo path="/super-admin/login" />;
    }
    if (location.startsWith("/admin")) {
      return <RedirectTo path="/admin/login" />;
    }
    return <RedirectTo path="/login" />;
  }

  return <AuthenticatedApp />;
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
