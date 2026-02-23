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
import { Loader2, TrendingUp, Clock, Lock, Zap, BarChart3, Globe, Shield } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
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
      if (user.role === "admin" || user.role === "super_admin") {
        await apiRequest("POST", "/api/auth/logout");
        setRoleError("Please use the admin portal to sign in");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/");
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
            <div className="w-10 h-10 rounded-md hero-gradient dark:hero-gradient-dark flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">ForexCRM</span>
              <p className="text-[11px] text-muted-foreground leading-tight">Client Portal</p>
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-100" style={{ opacity: 0 }}>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
            <p className="text-muted-foreground mb-8">Enter your credentials to access your trading account</p>
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
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          data-testid="input-email"
                          {...field}
                        />
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium">Password</FormLabel>
                        <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          data-testid="input-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {(loginMutation.isError || roleError) && (
                  <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3" data-testid="text-error">
                    <p className="text-sm text-destructive">
                      {roleError
                        ? roleError
                        : loginMutation.error?.message?.includes("401")
                          ? "Invalid email or password"
                          : "Login failed. Please try again."}
                    </p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                  data-testid="button-login"
                >
                  {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </Form>
          </div>

          <div className="mt-8 pt-6 border-t animate-fade-in-up animate-delay-300" style={{ opacity: 0 }}>
            <p className="text-xs text-muted-foreground text-center mb-3">Other portals</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-admin-login">
                Admin Portal
              </Link>
              <span className="text-muted-foreground/30">|</span>
              <Link href="/super-admin/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-super-admin-login">
                Platform Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-center justify-center p-12 hero-gradient dark:hero-gradient-dark text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[10%] right-[15%] w-72 h-72 rounded-full bg-white/5 blur-xl" />
          <div className="absolute bottom-[15%] left-[10%] w-56 h-56 rounded-full bg-white/5 blur-xl" />
          <div className="absolute top-[50%] left-[40%] w-40 h-40 rounded-full bg-white/3 blur-lg" />
        </div>

        <div className="relative z-10 max-w-lg text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight leading-tight">Trade Smarter,<br />Grow Faster</h2>
            <p className="text-white/70 text-base leading-relaxed max-w-md mx-auto">
              Access institutional-grade tools, manage multiple accounts, and track your performance in real-time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="glass-card rounded-md p-4 text-left">
              <BarChart3 className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-sm font-medium">Live Analytics</p>
              <p className="text-xs text-white/50 mt-0.5">Real-time portfolio insights</p>
            </div>
            <div className="glass-card rounded-md p-4 text-left">
              <Shield className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-sm font-medium">Bank-Grade Security</p>
              <p className="text-xs text-white/50 mt-0.5">256-bit SSL encryption</p>
            </div>
            <div className="glass-card rounded-md p-4 text-left">
              <Globe className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-sm font-medium">Multi-Platform</p>
              <p className="text-xs text-white/50 mt-0.5">MT4, MT5 & cTrader</p>
            </div>
            <div className="glass-card rounded-md p-4 text-left">
              <Zap className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-sm font-medium">Fast Execution</p>
              <p className="text-xs text-white/50 mt-0.5">Sub-millisecond trades</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">50K+</p>
              <p className="text-xs text-white/50">Active Traders</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">$2.5B</p>
              <p className="text-xs text-white/50">Daily Volume</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-xs text-white/50">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
