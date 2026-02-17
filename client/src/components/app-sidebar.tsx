import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Wallet,
  ArrowUpDown,
  FileText,
  Shield,
  Network,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
  UserCircle,
  DollarSign,
  CreditCard,
  Receipt,
  UserPlus,
  FileCheck,
  PieChart,
  Bell,
  Briefcase,
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

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { title: string; url: string }[];
}

const mainMenu: MenuItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
    children: [
      { title: "All Clients", url: "/clients" },
      { title: "Add Client", url: "/clients/new" },
      { title: "Leads", url: "/clients/leads" },
    ],
  },
  {
    title: "Trading Accounts",
    url: "/trading",
    icon: TrendingUp,
    children: [
      { title: "All Accounts", url: "/trading" },
      { title: "Live Accounts", url: "/trading/live" },
      { title: "Demo Accounts", url: "/trading/demo" },
    ],
  },
  {
    title: "Wallet",
    url: "/wallet",
    icon: Wallet,
    children: [
      { title: "Overview", url: "/wallet" },
      { title: "Deposits", url: "/wallet/deposits" },
      { title: "Withdrawals", url: "/wallet/withdrawals" },
    ],
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: ArrowUpDown,
  },
];

const managementMenu: MenuItem[] = [
  {
    title: "IB / Affiliate",
    url: "/ib",
    icon: Network,
    children: [
      { title: "IB Dashboard", url: "/ib" },
      { title: "Referrals", url: "/ib/referrals" },
      { title: "Commissions", url: "/ib/commissions" },
    ],
  },
  {
    title: "KYC / Documents",
    url: "/kyc",
    icon: Shield,
    children: [
      { title: "Verification", url: "/kyc" },
      { title: "Documents", url: "/kyc/documents" },
    ],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    children: [
      { title: "Financial Reports", url: "/reports" },
      { title: "Trading Reports", url: "/reports/trading" },
      { title: "Commission Reports", url: "/reports/commissions" },
    ],
  },
];

const supportMenu: MenuItem[] = [
  { title: "Support Tickets", url: "/support", icon: HelpCircle },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

function NavItem({ item }: { item: MenuItem }) {
  const [location] = useLocation();
  const isActive = location === item.url || (item.children && item.children.some(c => location === c.url));

  if (item.children) {
    return (
      <Collapsible defaultOpen={isActive}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`} isActive={isActive}>
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
              <ChevronDown className="ml-auto w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((child) => (
                <SidebarMenuSubItem key={child.url}>
                  <SidebarMenuSubButton asChild isActive={location === child.url}>
                    <Link href={child.url} data-testid={`nav-${child.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <span>{child.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
          <item.icon className="w-4 h-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">ForexCRM</h2>
            <p className="text-xs text-muted-foreground">Trading Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenu.map((item) => (
                <NavItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementMenu.map((item) => (
                <NavItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportMenu.map((item) => (
                <NavItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3 p-2 rounded-md">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">admin@forexcrm.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
