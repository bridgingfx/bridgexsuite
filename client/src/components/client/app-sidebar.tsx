import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Shield,
  Settings,
  HelpCircle,
  ChevronRight,
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
  CandlestickChart,
  CircleDollarSign,
  Gift,
  Users,
  BarChart3,
  Copy,
  Briefcase,
  Target,
  Award,
  BookOpen,
  Swords,
  Package,
  FolderOpen,
  Percent,
  History,
  Lock,
  Share2,
  PieChart,
  Wrench,
  Calendar,
  LineChart,
  ArrowDownUp,
  Radio,
  Newspaper,
  Bitcoin,
  Send,
  ArrowDownToLine,
} from "lucide-react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface SubMenuItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
}

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
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
      { title: "Dashboard", url: "/forex/dashboard", icon: BarChart3 },
      { title: "Trading Accounts", url: "/forex/accounts", icon: TrendingUp },
      { title: "Finance", url: "/forex/finance", icon: CircleDollarSign },
      { title: "Offers", url: "/forex/offers", icon: Gift },
      { title: "IB Dashboard", url: "/forex/ib-dashboard", icon: Users },
      { title: "PAMM", url: "/forex/pamm", icon: BarChart3 },
      { title: "Copy Trading", url: "/forex/copy-trading", icon: Copy },
    ],
  },
  {
    title: "Prop Trading",
    url: "/prop/dashboard",
    icon: Trophy,
    iconColor: "text-yellow-500 dark:text-yellow-400",
    children: [
      { title: "Dashboard", url: "/prop/dashboard", icon: LayoutDashboard },
      { title: "Start Challenge", url: "/prop/challenges", icon: Target },
      { title: "Prop Accounts", url: "/prop/accounts", icon: Briefcase },
      { title: "Analytics", url: "/prop/analytics", icon: BarChart3 },
      { title: "Payouts", url: "/prop/payouts", icon: CircleDollarSign },
      { title: "Bonus & Promos", url: "/prop/bonus", icon: Gift },
      { title: "Affiliate", url: "/prop/referral", icon: Users },
      { title: "Certificates", url: "/prop/certificates", icon: Award },
      { title: "Rules & Compliance", url: "/prop/rules", icon: BookOpen },
    ],
  },
  {
    title: "Leagues",
    url: "/leagues/dashboard",
    icon: Swords,
    iconColor: "text-rose-500 dark:text-rose-400",
    children: [
      { title: "Dashboard", url: "/leagues/dashboard", icon: LayoutDashboard },
      { title: "Tournaments", url: "/leagues/tournaments", icon: Trophy },
      { title: "My Leagues", url: "/leagues/my-leagues", icon: Award },
      { title: "Leaderboard", url: "/leagues/leaderboard", icon: BarChart3 },
      { title: "Referral", url: "/leagues/referral", icon: Users },
    ],
  },
  {
    title: "Investments",
    url: "/investment/dashboard",
    icon: PiggyBank,
    iconColor: "text-pink-500 dark:text-pink-400",
    children: [
      { title: "Dashboard", url: "/investment/dashboard", icon: LayoutDashboard },
      { title: "Products", url: "/investment/products", icon: Package },
      { title: "My Investments", url: "/investment/my-investments", icon: FolderOpen },
      { title: "ROI Earnings", url: "/investment/roi", icon: Percent },
      { title: "Investment History", url: "/investment/history", icon: History },
      { title: "Lock-in Tracker", url: "/investment/lock-tracker", icon: Lock },
      { title: "Referral Commission", url: "/investment/referral", icon: Share2 },
      { title: "Profit Distribution", url: "/investment/profit", icon: PieChart },
    ],
  },
  { title: "Loyalty Points", url: "/loyalty-points", icon: Star, iconColor: "text-orange-500 dark:text-orange-400" },
  { title: "Download Platform", url: "/download-platform", icon: Download, iconColor: "text-cyan-500 dark:text-cyan-400" },
];

const section3Menu: MenuItem[] = [
  {
    title: "Crypto Exchange",
    url: "/crypto/send",
    icon: Bitcoin,
    iconColor: "text-orange-500 dark:text-orange-400",
    children: [
      { title: "Send", url: "/crypto/send", icon: Send },
      { title: "Receive", url: "/crypto/receive", icon: ArrowDownToLine },
      { title: "Convert", url: "/crypto/convert", icon: ArrowDownUp },
      { title: "P2P Exchange", url: "/crypto/p2p", icon: ArrowLeftRight },
    ],
  },
  {
    title: "Tools",
    url: "/tools/economic-calendar",
    icon: Wrench,
    iconColor: "text-violet-500 dark:text-violet-400",
    children: [
      { title: "Economic Calendar", url: "/tools/economic-calendar", icon: Calendar },
      { title: "Live Charts", url: "/tools/live-charts", icon: LineChart },
      { title: "Currency Converter", url: "/tools/currency-converter", icon: ArrowDownUp },
      { title: "Trading Signals", url: "/tools/trading-signals", icon: Radio },
      { title: "Market News", url: "/tools/market-news", icon: Newspaper },
    ],
  },
  { title: "AI Center", url: "/ai-center", icon: Sparkles, iconColor: "text-fuchsia-500 dark:text-fuchsia-400" },
];

const section4Menu: MenuItem[] = [
  { title: "Widgets", url: "/widgets", icon: LayoutGrid, iconColor: "text-teal-500 dark:text-teal-400" },
  { title: "Support Desk", url: "/support", icon: HelpCircle, iconColor: "text-sky-500 dark:text-sky-400" },
  { title: "Profile", url: "/profile", icon: User, iconColor: "text-slate-500 dark:text-slate-400" },
  { title: "Settings", url: "/settings", icon: Settings, iconColor: "text-gray-500 dark:text-gray-400" },
];

function NavItem({ item, expandedMenu, onToggle }: { item: MenuItem; expandedMenu: string; onToggle: (name: string) => void }) {
  const [location] = useLocation();
  const isActive = location === item.url || (item.children && item.children.some(c => location === c.url));

  if (item.children) {
    const isExpanded = expandedMenu === item.title;
    return (
      <SidebarMenuItem>
        <button
          onClick={() => onToggle(item.title)}
          aria-expanded={isExpanded}
          aria-controls={`submenu-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
          data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '')}`}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200",
            isExpanded
              ? "bg-muted/60 dark:bg-muted/30 text-foreground font-semibold"
              : "text-muted-foreground hover:bg-muted/40 dark:hover:bg-muted/20 hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <span className={cn("flex items-center justify-center w-5 h-5 shrink-0", item.iconColor || "")}>
              <item.icon className="w-[18px] h-[18px]" />
            </span>
            <span>{item.title}</span>
          </div>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {isExpanded && (
          <div id={`submenu-${item.title.toLowerCase().replace(/\s+/g, '-')}`} role="region" className="pl-4 space-y-1 mt-1 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
            {item.children.map((child) => {
              const childActive = location === child.url;
              return (
                <Link
                  key={child.url}
                  href={child.url}
                  data-testid={`nav-${child.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 border-l-2",
                    childActive
                      ? "border-primary text-primary bg-primary/5 dark:bg-primary/10 font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {child.icon && <child.icon className={cn("w-3.5 h-3.5 shrink-0", childActive ? "text-primary" : "")} />}
                  <span>{child.title}</span>
                </Link>
              );
            })}
          </div>
        )}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} className={cn("group/nav-item", isActive && "translate-x-0.5")}>
        <Link href={item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
          <span className={cn(
            "flex items-center justify-center w-5 h-5 shrink-0 transition-colors duration-200",
            item.iconColor || "text-muted-foreground group-hover/nav-item:text-foreground"
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
  const [location] = useLocation();
  const initials = user?.fullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "U";

  const defaultExpanded = location.startsWith("/forex") ? "Forex Trading" : location.startsWith("/prop") ? "Prop Trading" : location.startsWith("/leagues") ? "Leagues" : location.startsWith("/investment") ? "Investments" : location.startsWith("/crypto") ? "Crypto Exchange" : location.startsWith("/tools") ? "Tools" : "";
  const [expandedMenu, setExpandedMenu] = useState(defaultExpanded);

  function handleToggle(name: string) {
    setExpandedMenu(prev => prev === name ? "" : name);
  }

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
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 group-hover:scale-105">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none">BridgeX Suite</span>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-widest leading-none mt-1">Trading Platform</span>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="custom-scrollbar flex flex-col flex-1 overflow-y-auto">
        <div className="flex flex-col items-center pt-6 pb-6 px-4 border-b mx-3 mb-2">
          <Link href="/profile" className="flex flex-col items-center group cursor-pointer">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-500 mb-3 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center border-2 border-background">
                <span className="text-lg font-bold text-primary">{initials}</span>
              </div>
            </div>
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors" data-testid="text-sidebar-user-name">
              {user?.fullName || "User"}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid="text-sidebar-user-email">
              {user?.email || ""}
            </p>
          </Link>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-0.5">
              {section1Menu.map((item) => (
                <NavItem key={item.title} item={item} expandedMenu={expandedMenu} onToggle={handleToggle} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/70 px-5">
            Trading
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-0.5">
              {section2Menu.map((item) => (
                <NavItem key={item.title} item={item} expandedMenu={expandedMenu} onToggle={handleToggle} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/70 px-5">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-0.5">
              {section3Menu.map((item) => (
                <NavItem key={item.title} item={item} expandedMenu={expandedMenu} onToggle={handleToggle} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto pt-2 border-t">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/70 px-5">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-0.5">
              {section4Menu.map((item) => (
                <NavItem key={item.title} item={item} expandedMenu={expandedMenu} onToggle={handleToggle} />
              ))}
              <SidebarMenuItem>
                <button
                  data-testid="nav-logout"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <span className="flex items-center justify-center w-5 h-5 shrink-0">
                    <LogOut className="w-[18px] h-[18px]" />
                  </span>
                  <span className="font-medium">Logout</span>
                </button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 pt-0 border-t">
        <div className="flex items-center justify-center gap-2.5 py-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            B
          </div>
          <span className="text-xs font-bold tracking-tight">
            BridgeX Suite<sup className="text-[8px] text-muted-foreground font-medium ml-0.5">TM</sup>
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
