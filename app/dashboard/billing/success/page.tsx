"use client";
import { useEffect } from "react";

export default function BillingSuccessPage() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 5000);
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-2">🎉 Subscription Activated!</h1>
      <p>Thanks for upgrading. You now have full access.</p>
      <p>Redirecting you shortly...</p>
    </div>
  );
}
