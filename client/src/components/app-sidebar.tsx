import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Shield,
  Settings,
  HelpCircle,
  ChevronRight,
  Trophy,
  PiggyBank,
  Star,
  Download,
  ArrowLeftRight,
  Sparkles,
  LayoutGrid,
  User,
  LogOut,
  CandlestickChart,
  CircleDollarSign,
  Gift,
  Users,
  BarChart3,
  Copy,
  Wrench,
  Cpu,
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
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface SubMenuItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  children?: SubMenuItem[];
}

const section1Menu: MenuItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, iconColor: "text-blue-500 dark:text-blue-400" },
  { title: "Wallet", url: "/wallet", icon: Wallet, iconColor: "text-emerald-500 dark:text-emerald-400" },
  { title: "KYC Verification", url: "/kyc", icon: Shield, iconColor: "text-amber-500 dark:text-amber-400" },
];

const section2Menu: MenuItem[] = [
  {
    title: "Forex Trading",
    url: "/forex/dashboard",
    icon: CandlestickChart,
    iconColor: "text-indigo-500 dark:text-indigo-400",
    children: [
      { title: "Forex Dashboard", url: "/forex/dashboard", icon: BarChart3 },
      { title: "Trading Accounts", url: "/forex/accounts", icon: TrendingUp },
      { title: "Finance", url: "/forex/finance", icon: CircleDollarSign },
      { title: "Offers", url: "/forex/offers", icon: Gift },
      { title: "IB Dashboard", url: "/forex/ib-dashboard", icon: Users },
      { title: "PAMM", url: "/forex/pamm", icon: BarChart3 },
      { title: "Copy Trading", url: "/forex/copy-trading", icon: Copy },
    ],
  },
  { title: "Prop Trading", url: "/prop-trading", icon: Trophy, iconColor: "text-yellow-500 dark:text-yellow-400" },
  { title: "Investments", url: "/investment", icon: PiggyBank, iconColor: "text-pink-500 dark:text-pink-400" },
  { title: "Loyalty Points", url: "/loyalty-points", icon: Star, iconColor: "text-orange-500 dark:text-orange-400" },
  { title: "Download Platform", url: "/download-platform", icon: Download, iconColor: "text-cyan-500 dark:text-cyan-400" },
];

const section3Menu: MenuItem[] = [
  { title: "P2P Exchange", url: "/p2p-exchange", icon: ArrowLeftRight, iconColor: "text-violet-500 dark:text-violet-400" },
  { title: "AI Center", url: "/ai-center", icon: Sparkles, iconColor: "text-fuchsia-500 dark:text-fuchsia-400" },
];

const section4Menu: MenuItem[] = [
  { title: "Widgets", url: "/widgets", icon: LayoutGrid, iconColor: "text-teal-500 dark:text-teal-400" },
  { title: "Support Desk", url: "/support", icon: HelpCircle, iconColor: "text-sky-500 dark:text-sky-400" },
  { title: "Profile", url: "/profile", icon: User, iconColor: "text-slate-500 dark:text-slate-400" },
  { title: "Settings", url: "/settings", icon: Settings, iconColor: "text-gray-500 dark:text-gray-400" },
];

function NavItem({ item }: { item: MenuItem }) {
  const [location] = useLocation();
  const isActive = location === item.url || (item.children && item.children.some(c => location === c.url));

  if (item.children) {
    return (
      <Collapsible defaultOpen={isActive}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '')}`}
              isActive={isActive}
              className="group/collapsible"
            >
              <span className={cn(
                "flex items-center justify-center w-5 h-5 shrink-0 transition-colors duration-200",
                isActive ? item.iconColor : "text-muted-foreground group-hover/collapsible:text-foreground"
              )}>
                <item.icon className="w-[18px] h-[18px]" />
              </span>
              <span className="font-medium">{item.title}</span>
              <ChevronRight className="ml-auto w-4 h-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <SidebarMenuSub>
              {item.children.map((child) => {
                const childActive = location === child.url;
                return (
                  <SidebarMenuSubItem key={child.url}>
                    <SidebarMenuSubButton asChild isActive={childActive}>
                      <Link href={child.url} data-testid={`nav-${child.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        {child.icon && (
                          <child.icon className={cn(
                            "w-3.5 h-3.5 shrink-0 transition-colors duration-200",
                            childActive ? "text-primary" : "text-muted-foreground"
                          )} />
                        )}
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
      <SidebarMenuButton asChild isActive={isActive} className="group/nav-item">
        <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
          <span className={cn(
            "flex items-center justify-center w-5 h-5 shrink-0 transition-colors duration-200",
            isActive ? item.iconColor : "text-muted-foreground group-hover/nav-item:text-foreground"
          )}>
            <item.icon className="w-[18px] h-[18px]" />
          </span>
          <span className="font-medium">{item.title}</span>
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
      <SidebarHeader className="p-4 pb-2">
        <Link href="/">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
              <CandlestickChart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold tracking-tight leading-tight">ForexCRM</h2>
              <p className="text-[11px] text-muted-foreground leading-tight">Trading Platform</p>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {section1Menu.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/70 px-3">
            Trading
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section2Menu.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/70 px-3">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section3Menu.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/70 px-3">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section4Menu.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  data-testid="nav-logout"
                  onClick={handleLogout}
                  className="group/nav-item text-red-500/70 hover:text-red-500 dark:text-red-400/70 dark:hover:text-red-400"
                >
                  <span className="flex items-center justify-center w-5 h-5 shrink-0 transition-colors duration-200">
                    <LogOut className="w-[18px] h-[18px]" />
                  </span>
                  <span className="font-medium">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 pt-0">
        <Link href="/profile">
          <div className="flex items-center gap-3 p-2.5 rounded-md hover-elevate cursor-pointer transition-colors duration-200">
            <Avatar className="w-9 h-9 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-tight" data-testid="text-user-name">{user?.fullName || "User"}</p>
              <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5" data-testid="text-user-email">{user?.email || ""}</p>
            </div>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
