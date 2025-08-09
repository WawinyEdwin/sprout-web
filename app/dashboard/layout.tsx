import ProtectedRoute from "@/components/auth/protected-route";
import { SubscriptionBanner } from "@/components/subscription-banner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SubscriptionBanner />
      <>{children}</>
    </ProtectedRoute>
  );
}
