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
import { Eye, EyeOff, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import BrandHeader from "../_components/BrandHeader";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { handleSubmit, control, formState } = useForm<AuthPayload>({
    defaultValues: {
      email: "",
      password: "",
      userMetadata: {
        firstName: "",
        lastName: "",
        companyIndustry: "",
        companyName: "",
        agreedToTerms: true,
        completedOnboarding: false,
      },
    },
    mode: "onChange",
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
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <BrandHeader />

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle>Start Your 7-Day Free Trial</CardTitle>
            <CardDescription>
              Experience Sprout's AI brain with full access - no credit card
              required
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="  rounded-lg p-4 border border-emerald-200">
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
                    rules={{ required: true }}
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
                    rules={{ required: true }}
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
                  rules={{ required: true }}
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
                  rules={{ required: true }}
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
                  rules={{ required: true }}
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
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
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

              <div className="flex items-center space-x-2">
                <Controller
                  name="userMetadata.companyName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Checkbox
                      id="agreeToTerms"
                      {...field}
                      defaultValue={field.value}
                    />
                  )}
                />
                <Label htmlFor="agreeToTerms" className="text-sm">
                  I agree to the{" "}
                  <Link
                    href="/terms-of-service"
                    className="text-emerald-600 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-emerald-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                className="w-full  !bg-emerald-500"
                type="submit"
                disabled={!formState.isValid || formState.isSubmitting}
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
