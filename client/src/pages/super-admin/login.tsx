import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation, Link } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Crown, Server, Globe, Palette, Shield } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SuperAdminLoginPage() {
  const [, setLocation] = useLocation();
  const [roleError, setRoleError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: async (user: any) => {
      if (user.role !== "super_admin") {
        await apiRequest("POST", "/api/auth/logout");
        setRoleError("Access denied. Super admin credentials required.");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/super-admin");
    },
  });

  function onSubmit(data: LoginFormValues) {
    setRoleError(null);
    loginMutation.mutate(data);
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center p-8 md:p-12 bg-background">
        <div className="max-w-[420px] mx-auto w-full">
          <div className="flex items-center gap-3 mb-10 animate-fade-in-up">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">BridgeX Suite</span>
              <p className="text-[11px] text-muted-foreground leading-tight">Platform Administration</p>
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-100" style={{ opacity: 0 }}>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Platform Admin</h1>
            <p className="text-muted-foreground mb-8">SaaS platform management console</p>
          </div>

          <div className="animate-fade-in-up animate-delay-200" style={{ opacity: 0 }}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="superadmin@example.com" data-testid="input-sa-email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" data-testid="input-sa-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {(loginMutation.isError || roleError) && (
                  <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3" data-testid="text-sa-error">
                    <p className="text-sm text-destructive">
                      {roleError ? roleError : loginMutation.error?.message?.includes("401") ? "Invalid email or password" : "Login failed. Please try again."}
                    </p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loginMutation.isPending} data-testid="button-sa-login">
                  {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </Form>
          </div>

          <div className="mt-8 pt-6 border-t animate-fade-in-up animate-delay-300" style={{ opacity: 0 }}>
            <p className="text-xs text-muted-foreground text-center mb-3">Other portals</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-client-login">
                Client Portal
              </Link>
              <span className="text-muted-foreground/30">|</span>
              <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-admin-login">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[10%] right-[15%] w-72 h-72 rounded-full bg-white/5 blur-xl" />
          <div className="absolute bottom-[15%] left-[10%] w-56 h-56 rounded-full bg-white/5 blur-xl" />
        </div>
        <div className="relative z-10 max-w-lg text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight leading-tight">Platform<br />Control Center</h2>
            <p className="text-white/70 text-base leading-relaxed max-w-md mx-auto">
              Manage brokers, subscriptions, white-label branding, and platform-wide operations
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="glass-card rounded-md p-4 text-left">
              <Server className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-sm font-medium">Multi-Broker</p>
              <p className="text-xs text-white/50 mt-0.5">Tenant management</p>
            </div>
            <div className="glass-card rounded-md p-4 text-left">
              <Globe className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-sm font-medium">Revenue Analytics</p>
              <p className="text-xs text-white/50 mt-0.5">MRR & ARR tracking</p>
            </div>
            <div className="glass-card rounded-md p-4 text-left">
              <Palette className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-sm font-medium">White Label</p>
              <p className="text-xs text-white/50 mt-0.5">Custom branding</p>
            </div>
            <div className="glass-card rounded-md p-4 text-left">
              <Shield className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-sm font-medium">Access Control</p>
              <p className="text-xs text-white/50 mt-0.5">Role management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
