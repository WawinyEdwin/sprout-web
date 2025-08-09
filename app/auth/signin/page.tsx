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
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import BrandHeader from "../_components/BrandHeader";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();
  const { handleSubmit, control, formState } = useForm<AuthPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: AuthPayload) => {
    try {
      const data = await login(formData);
      toast.success("Successfully signed in!", {
        description: "Redirecting...",
      });

      localStorage.setItem("sp-access-token", data.access_token);
      const spUser = {
        ...data.user_metadata,
        workspace: data.workspace,
        subscription: data.subscription,
      };
      localStorage.setItem("sp-user", JSON.stringify(spUser));
      setUser(spUser);

      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get("redirect") ?? "/dashboard";
      router.push(redirect);
    } catch (error: any) {
      toast.error("Failed to sign in.", {
        description: error?.response?.data?.message || error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <BrandHeader />

        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-xl">
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
                  rules={{ required: true }}
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
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2.5 text-gray-500"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  )}
                />
              </div>
              <Button
                className="w-full !bg-emerald-500 font-semibold shadow-lg"
                type="submit"
                disabled={!formState.isValid || formState.isSubmitting}
              >
                Sign In
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/auth/forgot-password"
                className="text-emerald-600 hover:underline  font-medium transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <Separator />

            <div className="text-center">
              <span className="text-slate-600">Don't have an account? </span>
              <Link
                href="/auth/signup"
                className="text-emerald-600 hover:underline  font-semibold transition-colors"
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
