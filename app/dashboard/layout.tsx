"use client";
import ProtectedRoute from "@/components/auth/protected-route";
import { DashboardNav } from "@/components/dashboard-nav";
import { SubscriptionBanner } from "@/components/subscription-banner";
import { useUser } from "../context/UserContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  return (
    <ProtectedRoute>
      <SubscriptionBanner />
      <DashboardNav user={user}>
        <>{children}</>
      </DashboardNav>
    </ProtectedRoute>
  );
}
