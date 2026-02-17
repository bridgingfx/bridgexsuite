import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Shield,
  Settings,
  HelpCircle,
  ChevronDown,
  Trophy,
  PiggyBank,
  Star,
  Download,
  ArrowLeftRight,
  Sparkles,
  LayoutGrid,
  User,
  LogOut,
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
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { title: string; url: string }[];
}

const section1Menu: MenuItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  {
    title: "Wallet",
    url: "/wallet",
    icon: Wallet,
  },
  { title: "KYC Verification", url: "/kyc", icon: Shield },
];

const section2Menu: MenuItem[] = [
  {
    title: "Forex Trading",
    url: "/forex/dashboard",
    icon: TrendingUp,
    children: [
      { title: "Dashboard", url: "/forex/dashboard" },
      { title: "Trading Accounts", url: "/forex/accounts" },
      { title: "Finance", url: "/forex/finance" },
      { title: "Offers", url: "/forex/offers" },
      { title: "IB Dashboard", url: "/forex/ib-dashboard" },
      { title: "PAMM", url: "/forex/pamm" },
      { title: "Copy Trading", url: "/forex/copy-trading" },
    ],
  },
  { title: "Prop Trading", url: "/prop-trading", icon: Trophy },
  { title: "Investments", url: "/investment", icon: PiggyBank },
  { title: "Loyalty Points", url: "/loyalty-points", icon: Star },
  { title: "Download Platform", url: "/download-platform", icon: Download },
];

const section3Menu: MenuItem[] = [
  { title: "P2P Exchange", url: "/p2p-exchange", icon: ArrowLeftRight },
  { title: "AI Center", url: "/ai-center", icon: Sparkles },
];

const section4Menu: MenuItem[] = [
  { title: "Widgets", url: "/widgets", icon: LayoutGrid },
  { title: "Support Desk", url: "/support", icon: HelpCircle },
  { title: "Profile", url: "/profile", icon: User },
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
            <SidebarMenuButton data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '')}`} isActive={isActive}>
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
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const initials = user?.fullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "U";

  async function handleLogout() {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch (e) {}
    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    setLocation("/login");
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight leading-tight">ForexCRM</h2>
            <p className="text-xs text-muted-foreground leading-tight">Trading Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {section1Menu.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4">
          <Separator />
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {section2Menu.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4">
          <Separator />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section3Menu.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4">
          <Separator />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section4Menu.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton data-testid="nav-logout" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3 p-2 rounded-md">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" data-testid="text-user-name">{user?.fullName || "User"}</p>
            <p className="text-xs text-muted-foreground truncate" data-testid="text-user-email">{user?.email || ""}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
