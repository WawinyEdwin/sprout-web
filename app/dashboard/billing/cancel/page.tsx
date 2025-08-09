"use client";
import BrandHeader from "@/app/auth/_components/BrandHeader";
import { useEffect } from "react";

export default function BillingSuccessPage() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 5000);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-4">
        <BrandHeader />
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">
            Looks like you changed you mind!
          </h1>
          <p>We are still here if you reconsider</p>
          <p>Redirecting you shortly...</p>
        </div>
      </div>
    </div>
  );
}
