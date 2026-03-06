import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Shield,
  Network,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  FileCheck,
  ArrowLeft,
  CreditCard,
  Fingerprint,
  Server,
  Monitor,
  Trophy,
  PieChart,
  Gift,
  Star,
  ShoppingBag,
  Bitcoin,
  ArrowLeftRight,
  Wrench,
  Wallet,
  Layers,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AdminMenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { title: string; url: string }[];
  testId?: string;
}

const mainMenu: AdminMenuItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    testId: "admin-nav-dashboard",
  },
  {
    title: "Client Management",
    url: "/admin/clients",
    icon: Users,
    testId: "admin-nav-clients",
  },
];

const tradingMenu: AdminMenuItem[] = [
  {
    title: "Trading Accounts",
    url: "/admin/accounts",
    icon: TrendingUp,
    testId: "admin-nav-accounts",
  },
  {
    title: "Prop Trading",
    url: "/admin/trading/prop",
    icon: Trophy,
    testId: "admin-nav-prop",
    children: [
      { title: "Challenges", url: "/admin/trading/prop" },
      { title: "Active Accounts", url: "/admin/trading/prop/accounts" },
      { title: "Payouts", url: "/admin/trading/prop/payouts" },
    ],
  },
  {
    title: "Leagues",
    url: "/admin/trading/leagues",
    icon: Trophy,
    testId: "admin-nav-leagues",
    children: [
      { title: "Tournaments", url: "/admin/trading/leagues" },
      { title: "Participants", url: "/admin/trading/leagues/participants" },
      { title: "Prize Distribution", url: "/admin/trading/leagues/prizes" },
    ],
  },
  {
    title: "Investments",
    url: "/admin/trading/investments",
    icon: PieChart,
    testId: "admin-nav-investments",
    children: [
      { title: "Plans", url: "/admin/trading/investments" },
      { title: "Active Investments", url: "/admin/trading/investments/active" },
      { title: "Payouts", url: "/admin/trading/investments/payouts" },
    ],
  },
];

const financeMenu: AdminMenuItem[] = [
  {
    title: "Financial Operations",
    url: "/admin/finance",
    icon: BarChart3,
    testId: "admin-nav-finance",
    children: [
      { title: "All Transactions", url: "/admin/finance" },
      { title: "Pending Approvals", url: "/admin/finance/pending" },
      { title: "Deposits", url: "/admin/finance/deposits" },
      { title: "Withdrawals", url: "/admin/finance/withdrawals" },
    ],
  },
  {
    title: "Wallet Management",
    url: "/admin/wallets",
    icon: Wallet,
    testId: "admin-nav-wallets",
  },
];

const rewardsMenu: AdminMenuItem[] = [
  {
    title: "Loyalty Points",
    url: "/admin/rewards/loyalty-config",
    icon: Star,
    testId: "admin-nav-loyalty",
  },
  {
    title: "Merchandise Orders",
    url: "/admin/rewards/merchandise-orders",
    icon: ShoppingBag,
    testId: "admin-nav-merch-orders",
  },
];

const exchangeMenu: AdminMenuItem[] = [
  {
    title: "Exchange Settings",
    url: "/admin/crypto/exchange-settings",
    icon: Bitcoin,
    testId: "admin-nav-exchange-settings",
  },
  {
    title: "P2P Management",
    url: "/admin/crypto/p2p",
    icon: ArrowLeftRight,
    testId: "admin-nav-p2p",
  },
];

const operationsMenu: AdminMenuItem[] = [
  {
    title: "KYC Verification",
    url: "/admin/kyc",
    icon: FileCheck,
    testId: "admin-nav-kyc",
  },
  {
    title: "IB Management",
    url: "/admin/ib",
    icon: Network,
    testId: "admin-nav-ib",
  },
  {
    title: "Support Tickets",
    url: "/admin/support",
    icon: HelpCircle,
    testId: "admin-nav-support",
  },
  {
    title: "Tools Configuration",
    url: "/admin/tools/config",
    icon: Wrench,
    testId: "admin-nav-tools",
  },
  {
    title: "Reports & Analytics",
    url: "/admin/reports",
    icon: BarChart3,
    testId: "admin-nav-reports",
  },
];

const configMenu: AdminMenuItem[] = [
  {
    title: "Payment Gateways",
    url: "/admin/config/payment-gateways",
    icon: CreditCard,
    testId: "admin-nav-payment-gateways",
  },
  {
    title: "KYC Providers",
    url: "/admin/config/kyc-providers",
    icon: Fingerprint,
    testId: "admin-nav-kyc-providers",
  },
  {
    title: "Trading Platforms",
    url: "/admin/config/trading-platforms",
    icon: Monitor,
    testId: "admin-nav-trading-platforms",
  },
  {
    title: "Group Configuration",
    url: "/admin/config/groups",
    icon: Layers,
    testId: "admin-nav-groups",
  },
  {
    title: "MT5 Settings",
    url: "/admin/config/mt5-settings",
    icon: Server,
    testId: "admin-nav-mt5",
  },
  {
    title: "System Settings",
    url: "/admin/settings",
    icon: Settings,
    testId: "admin-nav-settings",
  },
];

function AdminNavItem({ item }: { item: AdminMenuItem }) {
  const [location] = useLocation();
  const isActive = location === item.url || (item.children && item.children.some(c => location === c.url));

  if (item.children) {
    return (
      <Collapsible defaultOpen={isActive}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              data-testid={item.testId}
              isActive={isActive}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
              <ChevronDown className="ml-auto w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((child) => {
                const childTestId = `admin-nav-${child.title.toLowerCase().replace(/\s+/g, '-')}`;
                return (
                  <SidebarMenuSubItem key={child.url}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={location === child.url}
                      data-testid={childTestId}
                    >
                      <Link href={child.url}>
                        <span>{child.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} data-testid={item.testId}>
        <Link href={item.url}>
          <item.icon className="w-4 h-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function AdminMenuSection({ label, items }: { label: string; items: AdminMenuItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <AdminNavItem key={item.url} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-destructive flex items-center justify-center">
            <Shield className="w-5 h-5 text-destructive-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">BridgeX Suite Admin</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenu.map((item) => (
                <AdminNavItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <AdminMenuSection label="Trading" items={tradingMenu} />
        <AdminMenuSection label="Finance" items={financeMenu} />
        <AdminMenuSection label="Rewards" items={rewardsMenu} />
        <AdminMenuSection label="Exchange" items={exchangeMenu} />
        <AdminMenuSection label="Operations" items={operationsMenu} />
        <AdminMenuSection label="Configuration" items={configMenu} />
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 p-2 rounded-md">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-destructive/10 text-destructive text-xs">AU</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">System Administrator</p>
            </div>
          </div>
          <Link href="/">
            <button
              className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent text-sm text-muted-foreground hover:text-sidebar-accent-foreground transition-colors"
              data-testid="admin-nav-back-to-crm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Client CRM</span>
            </button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
