import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Download,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { useLocation } from "wouter";

const monthlyFinancials = [
  { month: "Jan", deposits: 45000, withdrawals: 22000, profit: 23000 },
  { month: "Feb", deposits: 52000, withdrawals: 28000, profit: 24000 },
  { month: "Mar", deposits: 48000, withdrawals: 25000, profit: 23000 },
  { month: "Apr", deposits: 61000, withdrawals: 32000, profit: 29000 },
  { month: "May", deposits: 58000, withdrawals: 29000, profit: 29000 },
  { month: "Jun", deposits: 72000, withdrawals: 35000, profit: 37000 },
];

const tradingVolume = [
  { month: "Jan", volume: 1200000 },
  { month: "Feb", volume: 1500000 },
  { month: "Mar", volume: 1350000 },
  { month: "Apr", volume: 1800000 },
  { month: "May", volume: 2100000 },
  { month: "Jun", volume: 2400000 },
];

const accountDistribution = [
  { name: "Standard", value: 45 },
  { name: "ECN", value: 25 },
  { name: "Demo", value: 20 },
  { name: "Raw", value: 10 },
];

const COLORS = ["hsl(217, 91%, 60%)", "rgb(34, 197, 94)", "rgb(245, 158, 11)", "rgb(168, 85, 247)"];

const commissionBreakdown = [
  { month: "Jan", ib: 1200, affiliate: 800, referral: 400 },
  { month: "Feb", ib: 1500, affiliate: 950, referral: 520 },
  { month: "Mar", ib: 1350, affiliate: 880, referral: 480 },
  { month: "Apr", ib: 1800, affiliate: 1100, referral: 650 },
  { month: "May", ib: 2100, affiliate: 1300, referral: 750 },
  { month: "Jun", ib: 2400, affiliate: 1500, referral: 880 },
];

export default function Reports() {
  const [location] = useLocation();
  const defaultTab = location === "/reports/trading" ? "trading" : location === "/reports/commissions" ? "commissions" : "financial";

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-reports-title">Reports</h1>
          <p className="text-sm text-muted-foreground">Comprehensive analytics and reporting</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-[150px]" data-testid="select-report-period">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" data-testid="button-download-report">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue={defaultTab}>
            <div className="border-b px-4 pt-2">
              <TabsList>
                <TabsTrigger value="financial" data-testid="tab-financial">Financial</TabsTrigger>
                <TabsTrigger value="trading" data-testid="tab-trading">Trading</TabsTrigger>
                <TabsTrigger value="commissions" data-testid="tab-commissions">Commissions</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="financial" className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-muted-foreground">Total Deposits</span>
                    </div>
                    <p className="text-2xl font-bold">$336,000</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowDownRight className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-muted-foreground">Total Withdrawals</span>
                    </div>
                    <p className="text-2xl font-bold">$171,000</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Net Profit</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-500">$165,000</p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Monthly Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyFinancials}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }} />
                        <Bar dataKey="deposits" fill="rgb(34, 197, 94)" radius={[4, 4, 0, 0]} name="Deposits" />
                        <Bar dataKey="withdrawals" fill="rgb(248, 113, 113)" radius={[4, 4, 0, 0]} name="Withdrawals" />
                        <Bar dataKey="profit" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Net Profit" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trading" className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Trading Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={tradingVolume}>
                          <defs>
                            <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }} />
                          <Area type="monotone" dataKey="volume" stroke="hsl(var(--primary))" fill="url(#volumeGrad)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Account Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie
                            data={accountDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {accountDistribution.map((entry, index) => (
                              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }} />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-4 flex-wrap mt-2">
                      {accountDistribution.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                          <span className="text-xs text-muted-foreground">{entry.name} ({entry.value}%)</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="commissions" className="p-6 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Commission Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={commissionBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }} />
                        <Bar dataKey="ib" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="IB Commission" />
                        <Bar dataKey="affiliate" fill="rgb(34, 197, 94)" radius={[4, 4, 0, 0]} name="Affiliate" />
                        <Bar dataKey="referral" fill="rgb(245, 158, 11)" radius={[4, 4, 0, 0]} name="Referral" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
