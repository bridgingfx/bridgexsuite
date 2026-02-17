import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Users,
  Palette,
  BarChart3,
  Settings,
  ChevronDown,
  ArrowLeft,
  Crown,
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
  testId?: string;
}

const superAdminMenu: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/super-admin",
    icon: LayoutDashboard,
    testId: "sa-nav-dashboard",
  },
  {
    title: "Broker Management",
    url: "/super-admin/brokers",
    icon: Building2,
    testId: "sa-nav-brokers",
  },
  {
    title: "Subscription Plans",
    url: "/super-admin/plans",
    icon: CreditCard,
    testId: "sa-nav-plans",
  },
  {
    title: "Admin Users",
    url: "/super-admin/admins",
    icon: Users,
    testId: "sa-nav-admins",
  },
  {
    title: "White-Label Branding",
    url: "/super-admin/branding",
    icon: Palette,
    testId: "sa-nav-branding",
  },
  {
    title: "Platform Analytics",
    url: "/super-admin/analytics",
    icon: BarChart3,
    testId: "sa-nav-analytics",
  },
  {
    title: "Platform Config",
    url: "/super-admin/config",
    icon: Settings,
    testId: "sa-nav-config",
  },
];

function SuperAdminNavItem({ item }: { item: MenuItem }) {
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
              {item.children.map((child) => (
                <SidebarMenuSubItem key={child.url}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={location === child.url}
                  >
                    <Link href={child.url}>
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
      <SidebarMenuButton asChild isActive={isActive} data-testid={item.testId}>
        <Link href={item.url}>
          <item.icon className="w-4 h-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function SuperAdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">ForexCRM</h2>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {superAdminMenu.map((item) => (
                <SuperAdminNavItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 p-2 rounded-md">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">SA</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Super Admin</p>
              <p className="text-xs text-muted-foreground truncate">Platform Owner</p>
            </div>
          </div>
          <Link href="/admin">
            <button
              className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent text-sm text-muted-foreground hover:text-sidebar-accent-foreground transition-colors"
              data-testid="sa-nav-back-to-admin"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Admin CRM</span>
            </button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
