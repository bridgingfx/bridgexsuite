import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/client/app-sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SuperAdminSidebar } from "@/components/super-admin/super-admin-sidebar";
import { ThemeProvider } from "@/lib/theme-provider";
import { WidgetVisibilityProvider } from "@/hooks/use-widget-visibility";
import { WalletCurrencyProvider } from "@/hooks/use-wallet-currency";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnnouncementBar } from "@/components/client/announcement-bar";
import { TickerBar } from "@/components/client/ticker-bar";
import { Bell, Crown, LogOut, Loader2, Search, Globe, X, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

import Dashboard from "@/pages/client/dashboard";
import TradingAccounts from "@/pages/client/trading-accounts";
import WalletPage from "@/pages/client/wallet";
import Transactions from "@/pages/client/transactions";
import KycPage from "@/pages/client/kyc";
import Support from "@/pages/client/support";
import Notifications from "@/pages/client/notifications";
import SettingsPage from "@/pages/client/settings";
import PropTradingPage from "@/pages/client/prop-trading";
import PropDashboard from "@/pages/client/prop/dashboard";
import PropAccounts from "@/pages/client/prop/accounts";
import PropChallenges from "@/pages/client/prop/challenges";
import PropAnalytics from "@/pages/client/prop/analytics";
import PropPayouts from "@/pages/client/prop/payouts";
import PropBonus from "@/pages/client/prop/bonus";
import PropReferral from "@/pages/client/prop/referral";
import PropCertificates from "@/pages/client/prop/certificates";
import PropRules from "@/pages/client/prop/rules";
import PropAccountDetail from "@/pages/client/prop/account-detail";
import PropPurchase from "@/pages/client/prop/purchase";
import InvestmentPage from "@/pages/client/investment";
import InvestmentDashboard from "@/pages/client/investment/dashboard";
import InvestmentProducts from "@/pages/client/investment/products";
import InvestmentMyInvestments from "@/pages/client/investment/my-investments";

import InvestmentROI from "@/pages/client/investment/roi";
import InvestmentHistory from "@/pages/client/investment/history";
import InvestmentLockTracker from "@/pages/client/investment/lock-tracker";
import InvestmentReferral from "@/pages/client/investment/referral";
import InvestmentProfit from "@/pages/client/investment/profit";

import CopyTradingPage from "@/pages/client/copy-trading";
import PammPage from "@/pages/client/pamm";
import AccountDetail from "@/pages/client/account-detail";
import ForexDashboard from "@/pages/client/forex-dashboard";
import OffersPage from "@/pages/client/offers";
import IBDashboard from "@/pages/client/ib-dashboard";
import FinancePage from "@/pages/client/finance";
import LoyaltyPointsPage from "@/pages/client/loyalty-points";
import MerchandisePage from "@/pages/client/rewards/merchandise";
import RewardsTransactionsPage from "@/pages/client/rewards/transactions";
import DownloadPlatformPage from "@/pages/client/download-platform";
import P2PExchangePage from "@/pages/client/p2p-exchange";
import AICenterPage from "@/pages/client/ai-center";
import WidgetsPage from "@/pages/client/widgets";
import EconomicCalendarPage from "@/pages/client/tools/economic-calendar";
import LiveChartsPage from "@/pages/client/tools/live-charts";
import CurrencyConverterPage from "@/pages/client/tools/currency-converter";
import TradingSignalsPage from "@/pages/client/tools/trading-signals";
import MarketNewsPage from "@/pages/client/tools/market-news";
import CryptoSendPage from "@/pages/client/crypto/send";
import CryptoReceivePage from "@/pages/client/crypto/receive";
import CryptoConvertPage from "@/pages/client/crypto/convert";
import ProfilePage from "@/pages/client/profile";
import LeaguesDashboard from "@/pages/client/leagues/dashboard";
import LeaguesTournaments from "@/pages/client/leagues/tournaments";
import MyLeagues from "@/pages/client/leagues/my-leagues";
import LeaguesLeaderboard from "@/pages/client/leagues/leaderboard";
import LeaguesReferral from "@/pages/client/leagues/referral";

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

import ClientLoginPage from "@/pages/client/login";
import AdminLoginPage from "@/pages/admin/login";
import SuperAdminLoginPage from "@/pages/super-admin/login";
import NotFound from "@/pages/not-found";

function RedirectTo({ path }: { path: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation(path);
  }, [path, setLocation]);
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
      <Route path="/wallet" component={WalletPage} />
      <Route path="/wallet/deposits" component={WalletPage} />
      <Route path="/wallet/withdrawals" component={WalletPage} />
      <Route path="/kyc" component={KycPage} />
      <Route path="/kyc/documents" component={KycPage} />
      <Route path="/forex/dashboard" component={ForexDashboard} />
      <Route path="/forex/accounts" component={TradingAccounts} />
      <Route path="/forex/accounts/live" component={TradingAccounts} />
      <Route path="/forex/accounts/demo" component={TradingAccounts} />
      <Route path="/forex/finance" component={FinancePage} />
      <Route path="/forex/offers" component={OffersPage} />
      <Route path="/forex/ib-dashboard" component={IBDashboard} />
      <Route path="/forex/pamm" component={PammPage} />
      <Route path="/forex/copy-trading" component={CopyTradingPage} />
      <Route path="/trading/account/:id">{(params) => <AccountDetail id={params.id} />}</Route>
      <Route path="/prop-trading" component={PropDashboard} />
      <Route path="/prop/dashboard" component={PropDashboard} />
      <Route path="/prop/accounts" component={PropAccounts} />
      <Route path="/prop/account/:id" component={PropAccountDetail} />
      <Route path="/prop/challenges" component={PropChallenges} />
      <Route path="/prop/purchase" component={PropPurchase} />
      <Route path="/prop/analytics" component={PropAnalytics} />
      <Route path="/prop/payouts" component={PropPayouts} />
      <Route path="/prop/bonus" component={PropBonus} />
      <Route path="/prop/referral" component={PropReferral} />
      <Route path="/prop/certificates" component={PropCertificates} />
      <Route path="/prop/rules" component={PropRules} />
      <Route path="/leagues/dashboard" component={LeaguesDashboard} />
      <Route path="/leagues/tournaments" component={LeaguesTournaments} />
      <Route path="/leagues/my-leagues" component={MyLeagues} />
      <Route path="/leagues/leaderboard" component={LeaguesLeaderboard} />
      <Route path="/leagues/referral" component={LeaguesReferral} />
      <Route path="/investment" component={InvestmentDashboard} />
      <Route path="/investment/dashboard" component={InvestmentDashboard} />
      <Route path="/investment/products" component={InvestmentProducts} />
      <Route path="/investment/my-investments" component={InvestmentMyInvestments} />

      <Route path="/investment/roi" component={InvestmentROI} />
      <Route path="/investment/history" component={InvestmentHistory} />
      <Route path="/investment/lock-tracker" component={InvestmentLockTracker} />
      <Route path="/investment/referral" component={InvestmentReferral} />
      <Route path="/investment/profit" component={InvestmentProfit} />

      <Route path="/rewards/loyalty-points" component={LoyaltyPointsPage} />
      <Route path="/rewards/merchandise" component={MerchandisePage} />
      <Route path="/rewards/transactions" component={RewardsTransactionsPage} />
      <Route path="/download-platform" component={DownloadPlatformPage} />
      <Route path="/p2p-exchange" component={P2PExchangePage} />
      <Route path="/crypto/send" component={CryptoSendPage} />
      <Route path="/crypto/receive" component={CryptoReceivePage} />
      <Route path="/crypto/convert" component={CryptoConvertPage} />
      <Route path="/crypto/p2p" component={P2PExchangePage} />
      <Route path="/tools/economic-calendar" component={EconomicCalendarPage} />
      <Route path="/tools/live-charts" component={LiveChartsPage} />
      <Route path="/tools/currency-converter" component={CurrencyConverterPage} />
      <Route path="/tools/trading-signals" component={TradingSignalsPage} />
      <Route path="/tools/market-news" component={MarketNewsPage} />
      <Route path="/ai-center" component={AICenterPage} />
      <Route path="/widgets" component={WidgetsPage} />
      <Route path="/support" component={Support} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/transactions" component={Transactions} />
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

function ClientHeader() {
  const { user } = useAuth();
  const kycStatus = user?.kycStatus || "pending";
  const initials = user?.fullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "U";
  const { data: stats } = useQuery<{ walletBalance: number }>({ queryKey: ["/api/dashboard/stats"] });
  const walletBalance = stats?.walletBalance ?? 0;

  return (
    <header className="h-16 bg-background border-b flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 relative z-30 shadow-sm" data-testid="client-header">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="lg:hidden" data-testid="button-sidebar-toggle" />
        <div className="flex flex-1 max-w-xl mr-auto items-center bg-muted/50 rounded-full px-4 py-2 border-2 border-primary/20 focus-within:border-primary transition-all shadow-sm" data-testid="search-bar">
          <Search size={16} className="text-primary mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search accounts, transactions, or your account..."
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder-muted-foreground w-full"
            data-testid="input-search"
          />
          <button aria-label="Clear search" className="text-muted-foreground hover:text-primary transition-colors p-1" data-testid="button-clear-search">
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <Link href="/wallet">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mr-1 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 cursor-pointer transition-all hover:scale-105" data-testid="header-wallet-balance">
            <Wallet size={14} />
            <span>${Number(walletBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
        </Link>
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mr-2 transition-all hover:scale-105 border" data-testid="badge-kyc-status">
          {kycStatus === "verified" ? (
            <span className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 flex items-center gap-2 px-2 py-0.5 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              Verified
            </span>
          ) : (
            <span className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 flex items-center gap-2 px-2 py-0.5 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-red-400" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              KYC Pending
            </span>
          )}
        </div>
        <button aria-label="Language selector" className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-medium mr-2" data-testid="button-language">
          <Globe size={18} />
          <span className="hidden sm:inline">EN</span>
        </button>
        <Link href="/notifications">
          <button aria-label="Notifications" className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors relative" data-testid="button-notifications">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
          </button>
        </Link>
        <ThemeToggle />
        <Link href="/profile">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px] cursor-pointer hover:ring-2 ring-blue-300 transition-all" data-testid="button-header-avatar">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center border-2 border-background">
              <span className="text-xs font-bold text-primary">{initials}</span>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}

function ClientFooter() {
  return (
    <footer className="py-8 border-t shrink-0" data-testid="client-footer">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
            B
          </div>
          <span className="text-lg font-bold tracking-tight">
            BridgeX Suite<sup className="text-xs text-muted-foreground font-medium ml-0.5">TM</sup>
          </span>
        </div>
        <div className="text-sm text-muted-foreground flex flex-col sm:flex-row items-center gap-2">
          <span>© {new Date().getFullYear()} BridgeX Suite.</span>
          <span className="hidden sm:inline opacity-50">|</span>
          <span>All Rights Reserved.</span>
        </div>
      </div>
    </footer>
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
        <div className="flex flex-col flex-1 overflow-hidden relative">
          <TickerBar />
          <ClientHeader />
          <AnnouncementBar />
          <main className="flex-1 overflow-y-auto bg-muted/30 flex flex-col">
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
              <ClientRouter />
            </div>
            <ClientFooter />
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
        <WidgetVisibilityProvider>
          <WalletCurrencyProvider>
            <TooltipProvider>
              <AppContent />
              <Toaster />
            </TooltipProvider>
          </WalletCurrencyProvider>
        </WidgetVisibilityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
