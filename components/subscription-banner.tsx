"use client";

import { useUser } from "@/app/context/UserContext";
import { Button } from "@/components/ui/button";
import { getWorkspaceSubscription } from "@/lib/api/billing";
import { Subscription } from "@/lib/types";
import { AlertTriangle, Clock, X, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BannerConfig {
  type: string;
  title: string;
  message: string;
  action: string;
  color: string;
  icon: React.ElementType;
  dismissible: boolean;
}

export function SubscriptionBanner() {
  const router = useRouter();
  const { user } = useUser();
  const workspaceId = user?.workspace?.workspaceId;
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [bannerData, setBannerData] = useState<BannerConfig | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissedKey = `dismissed_banner_${workspaceId}`;
    const dismissedState = localStorage.getItem(dismissedKey);
    if (dismissedState === "true") {
      setIsDismissed(true);
    }
  }, [workspaceId]);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const fetchedSubscription = await getWorkspaceSubscription();
        setSubscription(fetchedSubscription);
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      }
    };

    fetchSubscription();
  }, []);


  useEffect(() => {
    if (!subscription || isDismissed) {
      setBannerData(null);
      return;
    }

    const now = new Date();
    const currentPeriodEnd = new Date(subscription.currentPeriodEnd);
    const daysRemaining = Math.ceil(
      (currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    let calculatedBannerData: BannerConfig | null = null;

    if (subscription.plan === "Free") {
      if (daysRemaining <= 0) {
        calculatedBannerData = {
          type: "trial_expired",
          title: "Free Trial Expired",
          message:
            "Your free trial has ended. Upgrade now to continue accessing your dashboards and data.",
          action: "Upgrade Now",
          color: "bg-gradient-to-r from-red-500 to-red-600",
          icon: AlertTriangle,
          dismissible: false,
        };
      } else if (daysRemaining <= 7) {
        const urgencyColor =
          daysRemaining <= 3
            ? "from-red-500 to-red-600"
            : "from-orange-500 to-yellow-500";
        calculatedBannerData = {
          type: "trial_ending",
          title: `Free Trial Ends in ${daysRemaining} Day${
            daysRemaining === 1 ? "" : "s"
          }`,
          message:
            "Don't lose access to your dashboards and insights. Upgrade to continue using Sprout AI.",
          action: "Choose Plan",
          color: `bg-gradient-to-r ${urgencyColor}`,
          icon: Clock,
          dismissible: daysRemaining > 3,
        };
      }
    } else if (
      (subscription.plan === "Growth" ||
        subscription.plan === "Enterprise" ||
        subscription.plan === "Professional") &&
      daysRemaining <= 7
    ) {
      calculatedBannerData = {
        type: "renewal_soon",
        title: `Subscription Renews in ${daysRemaining} Days`,
        message:
          "Your subscription will automatically renew. Manage your billing settings anytime.",
        action: "Manage Billing",
        color: "bg-gradient-to-r from-blue-500 to-blue-600",
        icon: Zap,
        dismissible: true,
      };
    }

    setBannerData(calculatedBannerData);
  }, [subscription, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    // Persist dismissal to local storage for non-critical banners
    if (bannerData?.dismissible && workspaceId) {
      localStorage.setItem(`dismissed_banner_${workspaceId}`, "true");
    }
  };

  if (!bannerData || isDismissed) {
    return null;
  }

  const IconComponent = bannerData.icon;

  return (
    <div className={`${bannerData.color} text-white shadow-lg relative z-50`}>
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconComponent className="w-5 h-5 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-semibold text-sm md:text-base">
                {bannerData.title}
              </h3>
              <p className="text-xs md:text-sm opacity-90 hidden sm:block">
                {bannerData.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push("/dashboard/billing")}
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs md:text-sm font-medium"
            >
              {bannerData.action}
            </Button>
            {bannerData.dismissible && (
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-1 h-auto"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
