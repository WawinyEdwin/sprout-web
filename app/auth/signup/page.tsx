"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { signupUser } from "@/lib/api/auth";
import { AuthPayload, INDUSTRY_OPTIONS } from "@/lib/types";
import { Brain, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const { handleSubmit, control } = useForm<AuthPayload>({
    defaultValues: {
      email: "",
      password: "",
      userMetadata: {
        firstName: "",
        lastName: "",
        companyIndustry: "",
        companyName: "",
        agreedToTerms: false,
        completedOnboarding: false,
      },
    },
  });

  const onSubmit = async (formData: AuthPayload) => {
    try {
      await signupUser(formData);
      toast.success("Successfully signed up!", {
        description: "Check your email",
      });
      router.push(`/auth/verify-email?email=${formData.email}`);
    } catch (error) {
      toast.error("Failed to sign up", {
        description: "Internal server error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Start Your 7-Day Free Trial</CardTitle>
            <CardDescription>
              Experience Sprout's AI brain with full access - no credit card
              required
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-emerald-900">
                  7-Day Free Trial Includes:
                </span>
              </div>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Connect up to 3 data sources</li>
                <li>• Full AI predictions and insights</li>
                <li>• Automated action recommendations</li>
                <li>• Custom dashboard creation</li>
              </ul>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <Controller
                    name="userMetadata.firstName"
                    control={control}
                    render={({ field }) => (
                      <Input id="firstName" placeholder="John" {...field} />
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Controller
                    name="userMetadata.lastName"
                    control={control}
                    render={({ field }) => (
                      <Input id="lastName" placeholder="Doe" {...field} />
                    )}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      placeholder="john@company.com"
                      {...field}
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Controller
                  name="userMetadata.companyName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="company"
                      placeholder="Your company name"
                      {...field}
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Controller
                  name="userMetadata.companyIndustry"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full" id="industry">
                        <SelectValue placeholder="Choose an industry..." />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map((group) => (
                          <SelectGroup key={group.label}>
                            <SelectLabel>{group.label}</SelectLabel>
                            {group.options.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="userMetadata.companyName"
                  control={control}
                  render={({ field }) => (
                    <Checkbox id="agreeToTerms" {...field} />
                  )}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-emerald-600 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-emerald-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                type="submit"
              >
                Create Account
              </Button>
            </form>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-emerald-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
