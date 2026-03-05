import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Network,
  Users,
  DollarSign,
  TrendingUp,
  Copy,
  Search,
  ArrowUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import type { IbReferral, Commission } from "@shared/schema";
import { useLocation } from "wouter";

const commissionData = [
  { month: "Jan", ib: 320, affiliate: 180, referral: 90 },
  { month: "Feb", ib: 480, affiliate: 250, referral: 120 },
  { month: "Mar", ib: 650, affiliate: 320, referral: 180 },
  { month: "Apr", ib: 580, affiliate: 290, referral: 150 },
  { month: "May", ib: 820, affiliate: 420, referral: 220 },
  { month: "Jun", ib: 950, affiliate: 480, referral: 280 },
];

export default function IbAffiliate() {
  const { toast } = useToast();
  const [location] = useLocation();

  const defaultTab = location === "/ib/referrals" ? "referrals" : location === "/ib/commissions" ? "commissions" : "dashboard";

  const { data: referrals } = useQuery<IbReferral[]>({
    queryKey: ["/api/ib/referrals"],
  });

  const { data: commissions } = useQuery<Commission[]>({
    queryKey: ["/api/commissions"],
  });

  const totalCommissions = (commissions || []).reduce((sum, c) => sum + Number(c.amount), 0);
  const referralLink = "https://bridgexsuite.com/ref/ADMIN123";

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-ib-title">IB / Affiliate Program</h1>
        <p className="text-sm text-muted-foreground">Manage your referral network and earnings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Total Referrals</span>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{(referrals || []).length}</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUp className="w-3 h-3 text-emerald-500" />
              <span className="text-xs text-emerald-500">+3 this month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Active Referrals</span>
              <Network className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{(referrals || []).filter(r => r.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Total Commissions</span>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold text-emerald-500">${totalCommissions.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Conversion Rate</span>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">24.5%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm font-medium mb-1">Your Referral Link</p>
              <p className="text-xs text-muted-foreground">Share this link to earn commissions</p>
            </div>
            <div className="flex items-center gap-2 flex-1 max-w-lg">
              <Input
                value={referralLink}
                readOnly
                className="font-mono text-sm"
                data-testid="input-referral-link"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(referralLink);
                  toast({ title: "Link copied to clipboard" });
                }}
                data-testid="button-copy-link"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue={defaultTab}>
            <div className="border-b px-4 pt-2">
              <TabsList>
                <TabsTrigger value="dashboard" data-testid="tab-ib-dashboard">Overview</TabsTrigger>
                <TabsTrigger value="referrals" data-testid="tab-ib-referrals">Referrals</TabsTrigger>
                <TabsTrigger value="commissions" data-testid="tab-ib-commissions">Commissions</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="p-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={commissionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }} />
                    <Bar dataKey="ib" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="IB Earnings" />
                    <Bar dataKey="affiliate" fill="rgb(34, 197, 94)" radius={[4, 4, 0, 0]} name="Affiliate" />
                    <Bar dataKey="referral" fill="rgb(245, 158, 11)" radius={[4, 4, 0, 0]} name="Referral" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="referrals" className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-referrals">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">Referred User</th>
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">Level</th>
                      <th className="text-right py-3 px-3 font-medium text-muted-foreground">Commission</th>
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(referrals || []).length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">No referrals yet</td></tr>
                    ) : (
                      (referrals || []).map((ref) => (
                        <tr key={ref.id} className="border-b last:border-0">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-7 h-7">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">U</AvatarFallback>
                              </Avatar>
                              <span>User #{ref.referredUserId.slice(0, 8)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <Badge variant="secondary" className="text-xs">Level {ref.level}</Badge>
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-emerald-500">
                            ${Number(ref.commission).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3">
                            <Badge variant={ref.status === "active" ? "default" : "secondary"} className={ref.status === "active" ? "bg-emerald-500/10 text-emerald-500" : ""}>
                              {ref.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{ref.createdAt ? new Date(ref.createdAt).toLocaleDateString() : "N/A"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="commissions" className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="table-commissions">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">Type</th>
                      <th className="text-right py-3 px-3 font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">Source</th>
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(commissions || []).length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">No commissions yet</td></tr>
                    ) : (
                      (commissions || []).map((c) => (
                        <tr key={c.id} className="border-b last:border-0">
                          <td className="py-3 px-3 capitalize">{c.type.replace(/_/g, " ")}</td>
                          <td className="py-3 px-3 text-right font-mono text-emerald-500">
                            ${Number(c.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{c.source || "—"}</td>
                          <td className="py-3 px-3">
                            <Badge variant={c.status === "paid" ? "default" : "secondary"} className={c.status === "paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}>
                              {c.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
