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
import { Loader2, TrendingUp, Clock, Lock, Zap } from "lucide-react";

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
      <div className="flex flex-col justify-center p-8 md:p-12">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="rounded-md bg-primary/10 p-2">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-semibold">ForexCRM</span>
          </div>

          <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mb-8">Sign in to your trading portal</p>

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
                    <FormLabel>Password</FormLabel>
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
                <p className="text-sm text-destructive" data-testid="text-error">
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
                data-testid="button-login"
              >
                {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center">
            <Link href="/admin/login" className="text-sm text-muted-foreground hover:underline" data-testid="link-admin-login">
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="relative z-10 text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">Trade with Confidence</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            Access your accounts, manage funds, and track performance all in one place
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="rounded-md bg-white/10 p-3 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-white/80" />
              <p className="text-xs text-white/70">24/7 Trading</p>
            </div>
            <div className="rounded-md bg-white/10 p-3 text-center">
              <Lock className="w-5 h-5 mx-auto mb-1 text-white/80" />
              <p className="text-xs text-white/70">Secure Funds</p>
            </div>
            <div className="rounded-md bg-white/10 p-3 text-center">
              <Zap className="w-5 h-5 mx-auto mb-1 text-white/80" />
              <p className="text-xs text-white/70">Fast Execution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
