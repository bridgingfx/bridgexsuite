import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/lib/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

import Dashboard from "@/pages/dashboard";
import Clients from "@/pages/clients";
import TradingAccounts from "@/pages/trading-accounts";
import WalletPage from "@/pages/wallet";
import Transactions from "@/pages/transactions";
import IbAffiliate from "@/pages/ib-affiliate";
import KycPage from "@/pages/kyc";
import Reports from "@/pages/reports";
import Support from "@/pages/support";
import Notifications from "@/pages/notifications";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/clients" component={Clients} />
      <Route path="/clients/new" component={Clients} />
      <Route path="/clients/leads" component={Clients} />
      <Route path="/trading" component={TradingAccounts} />
      <Route path="/trading/live" component={TradingAccounts} />
      <Route path="/trading/demo" component={TradingAccounts} />
      <Route path="/wallet" component={WalletPage} />
      <Route path="/wallet/deposits" component={WalletPage} />
      <Route path="/wallet/withdrawals" component={WalletPage} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/ib" component={IbAffiliate} />
      <Route path="/ib/referrals" component={IbAffiliate} />
      <Route path="/ib/commissions" component={IbAffiliate} />
      <Route path="/kyc" component={KycPage} />
      <Route path="/kyc/documents" component={KycPage} />
      <Route path="/reports" component={Reports} />
      <Route path="/reports/trading" component={Reports} />
      <Route path="/reports/commissions" component={Reports} />
      <Route path="/support" component={Support} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
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
                  </div>
                </header>
                <main className="flex-1 overflow-auto">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
