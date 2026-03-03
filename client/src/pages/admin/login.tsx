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
import { Loader2, Shield, Users, BarChart3, Activity, Settings } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
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
      if (user.role !== "admin" && user.role !== "super_admin") {
        await apiRequest("POST", "/api/auth/logout");
        setRoleError("Access denied. This portal is for administrators only.");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/admin");
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
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">BridgeX Suite</span>
              <p className="text-[11px] text-muted-foreground leading-tight">Admin Portal</p>
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-100" style={{ opacity: 0 }}>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Portal</h1>
            <p className="text-muted-foreground mb-8">Manage your brokerage operations</p>
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
                        <Input type="email" placeholder="admin@example.com" data-testid="input-admin-email" {...field} />
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
                        <Input type="password" placeholder="Enter your password" data-testid="input-admin-password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {(loginMutation.isError || roleError) && (
                  <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3" data-testid="text-admin-error">
                    <p className="text-sm text-destructive">
                      {roleError ? roleError : loginMutation.error?.message?.includes("401") ? "Invalid email or password" : "Login failed. Please try again."}
                    </p>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loginMutation.isPending} data-testid="button-admin-login">
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
              <Link href="/super-admin/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-super-admin-login">
                Platform Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[10%] right-[15%] w-72 h-72 rounded-full bg-white/5 blur-xl" />
          <div className="absolute bottom-[15%] left-[10%] w-56 h-56 rounded-full bg-white/5 blur-xl" />
        </div>
        <div className="relative z-10 max-w-lg text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight leading-tight">Manage Your<br />Brokerage</h2>
            <p className="text-white/70 text-base leading-relaxed max-w-md mx-auto">
              Complete control over clients, finances, KYC, and trading operations
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="glass-card rounded-md p-4 text-left">
              <Users className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-sm font-medium">Client Management</p>
              <p className="text-xs text-white/50 mt-0.5">Full CRUD operations</p>
            </div>
            <div className="glass-card rounded-md p-4 text-left">
              <BarChart3 className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-sm font-medium">Financial Ops</p>
              <p className="text-xs text-white/50 mt-0.5">Approve & manage</p>
            </div>
            <div className="glass-card rounded-md p-4 text-left">
              <Activity className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-sm font-medium">Live Reports</p>
              <p className="text-xs text-white/50 mt-0.5">Real-time analytics</p>
            </div>
            <div className="glass-card rounded-md p-4 text-left">
              <Settings className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-sm font-medium">System Config</p>
              <p className="text-xs text-white/50 mt-0.5">MT5 & broker settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
