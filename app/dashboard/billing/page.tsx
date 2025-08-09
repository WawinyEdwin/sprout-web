"use client";

import { useUser } from "@/app/context/UserContext";
import { DashboardNav } from "@/components/dashboard-nav";
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
import { setUpPayment, upgradePlan } from "@/lib/api/billing";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Crown,
  Database,
  Download,
  FileText,
  MessageSquare,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const mockSubscription = {
  planName: "Growth Plan",
  price: 399,
  currency: "USD",
  interval: "month",
  status: "active",
  currentPeriodEnd: "2024-02-15",
  cancelAtPeriodEnd: false,
};

const mockUsage = {
  dataSources: { current: 5, limit: 10 },
  aiQueries: { current: 1250, limit: 2500 },
  dashboards: { current: 8, limit: 15 },
  teamMembers: { current: 3, limit: 5 },
};

const mockInvoices = [
  {
    id: "inv_001",
    number: "INV-2025-001",
    date: "2025-01-15",
    amount: 399,
    status: "paid",
    description: "Growth Plan - January 2025",
  },
  {
    id: "inv_002",
    number: "INV-2025-002",
    date: "2025-02-15",
    amount: 399,
    status: "paid",
    description: "Growth Plan - Feb 2025",
  },
  {
    id: "inv_003",
    number: "INV-2025-003",
    date: "2025-03-15",
    amount: 399,
    status: "overdue",
    description: "Growth Plan - Feb 2025",
  },
];

const plans = [
  {
    name: "Professional",
    price: 199,
    features: [
      "3 Data Sources",
      "AI KPI Monitoring",
      "Basic Predictions",
      "Email alerts",
      "Standard Support",
    ],
    current: false,
  },
  {
    name: "Growth",
    price: 399,
    features: [
      "7 Data Sources",
      "Advance AI predictions",
      "Automated Actions",
      "Custom Dashboards",
      "Priority Support",
    ],
    current: true,
  },
  {
    name: "Enterprise",
    price: 899,
    features: [
      "Unlimited Data Sources",
      "Full AI brain capabilities",
      "Custom AI Models",
      "Dedicated Customer support manager",
      "24/7 premium support",
    ],
    current: false,
  },
];

export default function BillingPage() {
  const { user } = useUser();
  const workspaceId = user?.workspace.workspaceId;
  const subscription = user?.workspace.subscription;
  const [showPlans, setShowPlans] = useState(false);

  const handleUpgrade = async (planName: string) => {
    await upgradePlan(workspaceId!, planName);
  };

  const handleManagePayment = async (planName: string = "Professional") => {
    const { url } = await setUpPayment(workspaceId!, planName);
    if (!url) {
      toast.error("Something went wrong", {
        description: "Could not initiate payment",
      });
    }
    window.location.href = url;
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // Call your backend to get Stripe invoice PDF
    console.log("Downloading invoice:", invoiceId);
    // window.open(`/api/billing/invoice/${invoiceId}/download`)
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-orange-600" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };
  return (
    <div className="min-h-screen">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Billing & Subscription
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
                    className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium"
                  >
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {subscription?.plan}
                    </h3>
                    <p className="text-4xl font-bold text-emerald-500 bg-clip-text mb-3">
                      $0.00
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
                          {mockUsage.dataSources.current} /{" "}
                          {mockUsage.dataSources.limit}
                        </span>
                      </div>
                      <Progress
                        value={
                          (mockUsage.dataSources.current /
                            mockUsage.dataSources.limit) *
                          100
                        }
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
                          {mockUsage.aiQueries.current.toLocaleString()} /{" "}
                          {mockUsage.aiQueries.limit.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (mockUsage.aiQueries.current /
                            mockUsage.aiQueries.limit) *
                          100
                        }
                        className="h-3"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            <BarChart3 className="w-4 h-4 text-slate-600" />
                          </div>
                          <span className="font-medium text-base">
                            Dashboards
                          </span>
                        </div>
                        <span className="text-sm text-slate-600 font-medium">
                          {mockUsage.dashboards.current} /{" "}
                          {mockUsage.dashboards.limit}
                        </span>
                      </div>
                      <Progress
                        value={
                          (mockUsage.dashboards.current /
                            mockUsage.dashboards.limit) *
                          100
                        }
                        className="h-3"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            <Users className="w-4 h-4 text-slate-600" />
                          </div>
                          <span className="font-medium text-base">
                            Team Members
                          </span>
                        </div>
                        <span className="text-sm text-slate-600 font-medium">
                          {mockUsage.teamMembers.current} /{" "}
                          {mockUsage.teamMembers.limit}
                        </span>
                      </div>
                      <Progress
                        value={
                          (mockUsage.teamMembers.current /
                            mockUsage.teamMembers.limit) *
                          100
                        }
                        className="h-3"
                      />
                    </div>
                  </div>
                </div>

                {Object.values(mockUsage).some(
                  (usage) => usage.current / usage.limit >= 0.8
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
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-4 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2  rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      Recent Invoices
                    </CardTitle>
                    <CardDescription>Your billing history</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockInvoices.slice(0, 3).map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(invoice.status)}
                        <div>
                          <div className="font-medium text-sm">
                            {invoice.date}
                          </div>
                          <div className="text-xs text-slate-600">
                            ${invoice.amount}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
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
              {plans.map((plan) => (
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
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
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
                      {plan.current
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
      </main>
    </div>
  );
}
