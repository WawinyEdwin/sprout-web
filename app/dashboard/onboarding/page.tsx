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
import { Progress } from "@/components/ui/progress";
import { updateUser } from "@/lib/api/auth";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle,
  Database,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const onboardingSteps = [
  {
    id: 1,
    title: "Connect Your Data Sources",
    description: "Link your business tools to start tracking KPIs",
    icon: Database,
    completed: false,
  },
  {
    id: 2,
    title: "Set Up Your First Dashboard",
    description: "Create custom visualizations for your key metrics",
    icon: BarChart3,
    completed: false,
  },
  {
    id: 3,
    title: "Define Your Goals",
    description: "Set targets and get alerts when you hit milestones",
    icon: Target,
    completed: false,
  },
  {
    id: 4,
    title: "Meet Your AI Assistant",
    description: "Learn how to ask questions and get insights",
    icon: Zap,
    completed: false,
  },
];

const suggestedIntegrations = [
  {
    name: "Google Analytics",
    description: "Website traffic & user behavior",
    popular: true,
  },
  {
    name: "QuickBooks",
    description: "Financial data & accounting",
    popular: true,
  },
  { name: "HubSpot", description: "CRM & marketing automation", popular: true },
  { name: "Shopify", description: "E-commerce sales data", popular: false },
  { name: "Stripe", description: "Payment processing", popular: false },
  {
    name: "Salesforce",
    description: "Customer relationship management",
    popular: false,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>(
    []
  );

  const handleIntegrationToggle = (integration: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(integration)
        ? prev.filter((i) => i !== integration)
        : [...prev, integration]
    );
  };

  const progress = (currentStep / onboardingSteps.length) * 100;

  const completeOnboarding = async () => {
    await updateUser({
      completedOnboarding: true,
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen  from-slate-50 to-slate-100">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8  from-emerald-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 " />
              </div>
              <span className="text-xl font-bold  from-emerald-600 to-emerald-600 bg-clip-text ">
                Sprout
              </span>
            </div>
            <div className="text-center">
              <span className="text-emerald-600 font-medium">
                14-Day Free Trial Active
              </span>
              <div className="text-sm text-slate-500 mt-1">
                Full access to all AI features • No credit card required
              </div>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Skip Setup</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Welcome to Sprout!</h1>
              <span className="text-sm text-slate-600">
                Step {currentStep} of {onboardingSteps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <Database className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
                <h2 className="text-2xl font-bold mb-2">
                  Connect Your Data Sources
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Choose the platforms you use to run your business. We'll help
                  you track the KPIs that matter most.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestedIntegrations.map((integration) => (
                  <Card
                    key={integration.name}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedIntegrations.includes(integration.name)
                        ? "ring-2 ring-emerald-500 bg-emerald-50"
                        : ""
                    }`}
                    onClick={() => handleIntegrationToggle(integration.name)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Database className="w-5 h-5 text-slate-600" />
                        </div>
                        {integration.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1">{integration.name}</h3>
                      <p className="text-sm text-slate-600">
                        {integration.description}
                      </p>
                      {selectedIntegrations.includes(integration.name) && (
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-3" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  className="!bg-emerald-500"
                  onClick={() => setCurrentStep(2)}
                  disabled={selectedIntegrations.length === 0}
                >
                  Continue with {selectedIntegrations.length} integration
                  {selectedIntegrations.length !== 1 ? "s" : ""}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
                <h2 className="text-2xl font-bold mb-2">
                  Create Your First Dashboard
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  We'll create a starter dashboard based on your connected data
                  sources. You can customize it later.
                </p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Suggested Dashboard: Business Overview</CardTitle>
                  <CardDescription>
                    Based on your selected integrations, here's what we
                    recommend tracking:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium">Revenue Trends</span>
                      <Badge variant="secondary">QuickBooks</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium">Website Traffic</span>
                      <Badge variant="secondary">Google Analytics</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium">Lead Generation</span>
                      <Badge variant="secondary">HubSpot</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium">Conversion Rates</span>
                      <Badge variant="secondary">Multiple Sources</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button
                  className="!bg-emerald-500"
                  onClick={() => setCurrentStep(3)}
                >
                  Create Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
                <h2 className="text-2xl font-bold mb-2">Set Your Goals</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Define targets for your key metrics. We'll track progress and
                  alert you when you hit milestones.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Revenue Goal</CardTitle>
                    <CardDescription>
                      Set your target monthly revenue
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold text-green-600">
                        $50,000
                      </div>
                      <div className="text-sm text-slate-600">
                        Current: $42,500 (85%)
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Website Visitors</CardTitle>
                    <CardDescription>
                      Monthly unique visitors target
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-3xl font-bold text-emerald-600">
                        10,000
                      </div>
                      <div className="text-sm text-slate-600">
                        Current: 8,750 (88%)
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button
                  className="!bg-emerald-500"
                  onClick={() => setCurrentStep(4)}
                >
                  Set Goals
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <Zap className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
                <h2 className="text-2xl font-bold mb-2">
                  Meet Your AI Assistant
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Ask questions about your business data in plain English and
                  get instant insights.
                </p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Try asking questions like:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                      <p className="text-sm">
                        "What's our best way to increase Gross Margin?"
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <p className="text-sm">
                        "Which campaigns are driving the highest ROI?"
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                      <p className="text-sm">
                        "How can we reduce customer churn this quarter?"
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                      <p className="text-sm">
                        "What's the forecast for next month's revenue?"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  Back
                </Button>
                <Button
                  className="!bg-emerald-500"
                  onClick={() => completeOnboarding()}
                >
                  Complete Setup
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
