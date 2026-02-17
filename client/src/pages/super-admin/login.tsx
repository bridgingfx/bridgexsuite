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
import { Loader2, Crown, Server, Globe, Palette } from "lucide-react";

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
      <div className="flex flex-col justify-center p-8 md:p-12">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="rounded-md bg-purple-500/10 p-2">
              <Crown className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-lg font-semibold">Platform Administration</span>
          </div>

          <h1 className="text-2xl font-bold mb-1">Platform Administration</h1>
          <p className="text-sm text-muted-foreground mb-8">SaaS platform management</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        data-testid="input-sa-email"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        data-testid="input-sa-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(loginMutation.isError || roleError) && (
                <p className="text-sm text-destructive" data-testid="text-sa-error">
                  {roleError
                    ? roleError
                    : loginMutation.error?.message?.includes("401")
                      ? "Invalid email or password"
                      : "Login failed. Please try again."}
                </p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                data-testid="button-sa-login"
              >
                {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center">
            <Link href="/admin/login" className="text-sm text-muted-foreground hover:underline" data-testid="link-admin-login">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="relative z-10 text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">Platform Control Center</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            Manage brokers, subscriptions, and platform-wide operations
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="rounded-md bg-white/10 p-3 text-center">
              <Server className="w-5 h-5 mx-auto mb-1 text-white/80" />
              <p className="text-xs text-white/70">Multi-Broker</p>
            </div>
            <div className="rounded-md bg-white/10 p-3 text-center">
              <Globe className="w-5 h-5 mx-auto mb-1 text-white/80" />
              <p className="text-xs text-white/70">Revenue Analytics</p>
            </div>
            <div className="rounded-md bg-white/10 p-3 text-center">
              <Palette className="w-5 h-5 mx-auto mb-1 text-white/80" />
              <p className="text-xs text-white/70">White Label</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
