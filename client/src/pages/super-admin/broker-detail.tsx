import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, Users, CreditCard, Palette, Globe, Mail, Phone, MapPin } from "lucide-react";
import type { Broker, BrokerAdmin, BrokerSubscription, BrokerBranding } from "@shared/schema";

export default function SuperAdminBrokerDetail() {
  const [, params] = useRoute("/super-admin/brokers/:id");
  const brokerId = params?.id;

  const { data, isLoading } = useQuery<{
    broker: Broker;
    admins: BrokerAdmin[];
    subscriptions: BrokerSubscription[];
    branding: BrokerBranding | null;
  }>({
    queryKey: ["/api/super-admin/brokers", brokerId],
    enabled: !!brokerId,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
        <div className="h-64 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  if (!data?.broker) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Broker not found</p>
        <Link href="/super-admin/brokers"><Button variant="ghost" className="mt-4"><ArrowLeft className="w-4 h-4 mr-2" />Back to Brokers</Button></Link>
      </div>
    );
  }

  const { broker, admins, subscriptions, branding } = data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/super-admin/brokers">
          <Button variant="ghost" size="icon" data-testid="button-back-to-brokers"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-broker-detail-name">{broker.name}</h1>
            <p className="text-sm text-muted-foreground">{broker.companyName || broker.slug}</p>
          </div>
        </div>
        <Badge variant={broker.status === "active" ? "default" : "destructive"} className="ml-auto" data-testid="badge-broker-detail-status">
          {broker.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium" data-testid="text-broker-email">{broker.email}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium">{broker.phone || "N/A"}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div><p className="text-xs text-muted-foreground">Country</p><p className="text-sm font-medium">{broker.country || "N/A"}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div><p className="text-xs text-muted-foreground">Limits</p><p className="text-sm font-medium">{broker.maxClients} clients / {broker.maxAccounts} accounts</p></div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="admins">
        <TabsList>
          <TabsTrigger value="admins" data-testid="tab-broker-admins">Admin Users ({admins.length})</TabsTrigger>
          <TabsTrigger value="subscriptions" data-testid="tab-broker-subs">Subscriptions ({subscriptions.length})</TabsTrigger>
          <TabsTrigger value="branding" data-testid="tab-broker-branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="space-y-3 mt-4">
          {admins.map((admin) => (
            <Card key={admin.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium" data-testid={`text-admin-name-${admin.id}`}>{admin.fullName}</p>
                  <p className="text-sm text-muted-foreground">{admin.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{admin.role}</Badge>
                  <Badge variant={admin.status === "active" ? "default" : "secondary"}>{admin.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {admins.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No admin users assigned</p>}
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-3 mt-4">
          {subscriptions.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium">Plan: {sub.planId}</p>
                  <p className="text-sm text-muted-foreground">Started: {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : "N/A"}</p>
                </div>
                <Badge variant={sub.status === "active" ? "default" : sub.status === "cancelled" ? "destructive" : "secondary"}>{sub.status}</Badge>
              </CardContent>
            </Card>
          ))}
          {subscriptions.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No subscriptions</p>}
        </TabsContent>

        <TabsContent value="branding" className="mt-4">
          {branding ? (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Primary Color</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: branding.primaryColor || "#3b82f6" }} />
                      <span className="text-sm font-medium">{branding.primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Secondary Color</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: branding.secondaryColor || "#10b981" }} />
                      <span className="text-sm font-medium">{branding.secondaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Accent Color</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md border" style={{ backgroundColor: branding.accentColor || "#f59e0b" }} />
                      <span className="text-sm font-medium">{branding.accentColor}</span>
                    </div>
                  </div>
                </div>
                {branding.companyTagline && (
                  <div><p className="text-sm text-muted-foreground">Tagline</p><p className="font-medium">{branding.companyTagline}</p></div>
                )}
                {branding.customDomain && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{branding.customDomain}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No branding configured</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
