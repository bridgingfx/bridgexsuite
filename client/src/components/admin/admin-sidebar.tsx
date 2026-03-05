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

const adminMenu: AdminMenuItem[] = [
  { 
    title: "Dashboard", 
    url: "/admin", 
    icon: LayoutDashboard,
    testId: "admin-nav-dashboard"
  },
  { 
    title: "Client Management", 
    url: "/admin/clients", 
    icon: Users,
    testId: "admin-nav-clients"
  },
  { 
    title: "Trading Accounts", 
    url: "/admin/accounts", 
    icon: TrendingUp,
    testId: "admin-nav-accounts"
  },
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
    title: "KYC Verification", 
    url: "/admin/kyc", 
    icon: FileCheck,
    testId: "admin-nav-kyc"
  },
  { 
    title: "IB Management", 
    url: "/admin/ib", 
    icon: Network,
    testId: "admin-nav-ib"
  },
  { 
    title: "Support Tickets", 
    url: "/admin/support", 
    icon: HelpCircle,
    testId: "admin-nav-support"
  },
  { 
    title: "Reports & Analytics", 
    url: "/admin/reports", 
    icon: BarChart3,
    testId: "admin-nav-reports"
  },
  { 
    title: "System Settings", 
    url: "/admin/settings", 
    icon: Settings,
    testId: "admin-nav-settings"
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
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenu.map((item) => (
                <AdminNavItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
