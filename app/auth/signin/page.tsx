"use client";

import { useUser } from "@/app/context/UserContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { login } from "@/lib/api/auth";
import { AuthPayload } from "@/lib/types";
import { ArrowLeft, Brain } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const { handleSubmit, control } = useForm<AuthPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: AuthPayload) => {
    try {
      const data = await login(formData);
      toast.success("Successfully signed in!", {
        description: "Redirecting...",
      });

      localStorage.setItem("sp-access-token", data.session.access_token);
      localStorage.setItem("user", JSON.stringify(data.user.user_metadata));
      setUser(data.user);

      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get("redirect") ?? "/dashboard";
      router.push(redirect);
    } catch (error) {
      toast.error("Failed to sign in.", {
        description: "Check your credentials again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Sprout
              </span>
              <div className="text-xs text-emerald-600 font-medium -mt-1">
                Business Intelligence
              </div>
            </div>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-bold text-slate-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-slate-600">
              Continue your AI-powered business intelligence journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  )}
                />
              </div>
              <div>
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium"
                >
                  Password
                </Label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  )}
                />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-semibold shadow-lg"
                type="submit"
              >
                Sign In
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/auth/forgot-password"
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <Separator />

            <div className="text-center">
              <span className="text-slate-600">Don't have an account? </span>
              <Link
                href="/auth/signup"
                className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
              >
                Sign up for free
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
