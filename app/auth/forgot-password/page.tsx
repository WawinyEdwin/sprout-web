"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/lib/api/auth";
import { useState } from "react";
import { toast } from "sonner";
import BrandHeader from "../_components/BrandHeader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/reset-password?u=${email}`;
      await forgotPassword(email, redirectTo);
      toast.success("Password reset email sent successfully!", {
        description: "Check your email now!",
      });
    } catch (error: any) {
      toast.error("Failed to send password reset link", {
        description: error?.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <BrandHeader />

        <div className=" space-y-2">
          <h2 className="text-xl font-semibold">Forgot your password?</h2>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            id="email"
            type="email"
            placeholder="tesla@nikola.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            onClick={handlePasswordReset}
            disabled={loading || !email}
            className="w-full !bg-emerald-500"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>
      </div>
    </div>
  );
}
