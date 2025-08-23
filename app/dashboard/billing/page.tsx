"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  getWorkspaceSubscription,
  getWorkspaceUsage,
  manageBilling,
  setUpPayment,
} from "@/lib/api/billing";
import { QUERY_KEYS } from "@/lib/query-keys";
import { Subscription, Usage } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle,
  CreditCard,
  Crown,
  Database,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { plans } from "./data";

export default function BillingPage() {
  const [showPlans, setShowPlans] = useState(false);

  const handleUpgrade = async (planName: string) => {
    const { url } = await setUpPayment(planName);
    if (!url) {
      toast.error("Something went wrong", {
        description: "Could not initiate payment",
      });
    }
    window.location.href = url;
  };

  const handleManagePayment = async () => {
    const { url } = await manageBilling();
    if (!url) {
      toast.error("Something went wrong", {
        description: "Could not redirect to billing management",
      });
    }
    window.location.href = url;
  };

  const { data: subscription } = useQuery<Subscription>({
    queryKey: QUERY_KEYS.subscription.workspace,
    queryFn: () => getWorkspaceSubscription(),
  });

  const plansWithStatus = plans.map((plan) => ({
    ...plan,
    current: subscription?.plan?.toUpperCase() === plan.name.toUpperCase(),
  }));

  const { data: usage } = useQuery<Usage>({
    queryKey: QUERY_KEYS.subscription.usage,
    queryFn: () => getWorkspaceUsage(),
  });

  const dataSourceLimit = usage?.currentUsage.dataSources?.limit || 0;
  const dataSourcesCurrent = usage?.currentUsage.dataSources?.used || 0;

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold  mb-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Billing
        </h1>
        <p className="text-slate-600 text-lg">
          Manage your subscription, usage, and billing information.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-lg">
                      <Crown className="w-5 h-5 " />
                    </div>
                    Current Plan
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    Your active subscription details
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-800 px-3 py-1 text-sm font-medium"
                >
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {subscription?.plan || "Free"}
                  </h3>
                  <p className="text-4xl font-bold text-emerald-500 bg-clip-text mb-3">
                    ${subscription?.amount || 0.0}
                    <span className="text-xl font-normal text-slate-600">
                      / Month
                    </span>
                  </p>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Next billing:{" "}
                      <span className="font-semibold">
                        {new Date(
                          subscription?.currentPeriodEnd!
                        ).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZoneName: "short",
                        })}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => setShowPlans(!showPlans)}
                    className="w-full h-12 text-base font-medium !bg-emerald-500"
                  >
                    <ArrowUpRight className="w-5 h-5 mr-2" />
                    Change Plan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => await handleManagePayment()}
                    className="w-full h-12 text-base font-medium"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Manage Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5" />
                </div>
                Current Usage
              </CardTitle>
              <CardDescription className="text-base">
                Your usage for this billing period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <Database className="w-4 h-4 text-slate-600" />
                        </div>
                        <span className="font-medium text-base">
                          Data Sources
                        </span>
                      </div>
                      <span className="text-sm text-slate-600 font-medium">
                        {dataSourcesCurrent} / {dataSourceLimit}
                      </span>
                    </div>
                    <Progress
                      value={(dataSourcesCurrent / dataSourceLimit) * 100}
                      className="h-3"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <MessageSquare className="w-4 h-4 text-slate-600" />
                        </div>
                        <span className="font-medium text-base">
                          AI Queries
                        </span>
                      </div>
                      <span className="text-sm text-slate-600 font-medium">
                        Basic AI Predictions
                      </span>
                    </div>
                    <Progress value={50} className="h-3" />
                  </div>
                </div>
              </div>

              {usage && (
                <>
                  {Object.values(usage).some(
                    (resource) => resource?.used / resource?.limit >= 0.8
                  ) && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                        <h4 className="font-semibold text-orange-800 text-lg">
                          Approaching Usage Limits
                        </h4>
                      </div>
                      <p className="text-orange-700 mb-4">
                        You're using most of your plan's resources. Consider
                        upgrading to avoid service interruption.
                      </p>
                      <Button
                        onClick={() => setShowPlans(true)}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        View Plans
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showPlans} onOpenChange={setShowPlans}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Choose Your Plan</DialogTitle>
            <DialogDescription className="text-base">
              Select the plan that best fits your needs
            </DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {plansWithStatus.map((plan) => (
              <Card
                key={plan.name}
                className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                  plan.current
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 hover:border-emerald-300"
                }`}
              >
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    {plan.current && (
                      <Badge className="mb-3 bg-emerald-600">
                        Current Plan
                      </Badge>
                    )}
                    <p className="text-4xl font-bold text-emerald-600 mb-1">
                      ${plan.price}
                    </p>
                    <p className="text-slate-600">per month</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full h-12 text-base font-medium !bg-emerald-500"
                    variant={plan.current ? "outline" : "default"}
                    disabled={plan.current}
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    {subscription?.plan === plan.name
                      ? "Current Plan"
                      : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end pt-6">
            <Button
              variant="outline"
              onClick={() => setShowPlans(false)}
              className="px-8"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
