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
import { fetchWorkspaceIntegrations } from "@/lib/api/integrations";
import { QUERY_KEYS } from "@/lib/query-keys";
import { WorkspaceIntegration } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  Database,
  DollarSign,
  MessageSquare,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "../context/UserContext";

export default function DashboardPage() {
  const { user } = useUser();
  const workspaceId = user?.workspace.workspaceId!;

  const { data: sources } = useQuery<WorkspaceIntegration[]>({
    queryKey: [QUERY_KEYS.integrations.connected, workspaceId],
    queryFn: () => fetchWorkspaceIntegrations(workspaceId),
    enabled: !!workspaceId, // don't run until we have an ID
  });

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-3   bg-clip-text ">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-slate-600 text-lg">
            Your AI brain has 3 urgent insights and 2 automated actions ready.
          </p>
        </div>
        <div className="flex gap-3 mt-6 lg:mt-0">
          <Button
            variant="outline"
            className="border-2 font-medium bg-transparent"
            asChild
          >
            <Link href="/dashboard/sources">
              <Database className="w-4 h-4 mr-2" />
              Connect Data
            </Link>
          </Button>
          <Button className="!bg-emerald-500 shadow-lg font-medium" asChild>
            <Link href="/dashboard/chat">
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask AI Brain
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <Card className="lg:col-span-2  border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10  from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                Urgent AI Insights
              </CardTitle>
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                3 Alerts
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4  from-red-50 to-orange-50 rounded-xl border border-red-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-900">
                    Revenue Drop Predicted
                  </span>
                </div>
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                  High Priority
                </Badge>
              </div>
              <p className="text-slate-700 mb-3">
                AI predicts 15% revenue drop next week due to declining Facebook
                ad performance in Canada. Root cause: 30% decrease in ad spend
                correlating with 40% drop in returning users.
              </p>
            </div>

            <div className="p-4  from-yellow-50 to-orange-50  border-yellow-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-900">
                    Opportunity Detected
                  </span>
                </div>
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                  Medium Priority
                </Badge>
              </div>
              <p className="text-slate-700 mb-3">
                Email campaign performance up 45% this week. AI recommends
                increasing budget by $2,000 for potential 23% revenue boost.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                AI Data Sources
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                className="border-2 font-medium bg-transparent"
                asChild
              >
                <Link href="/dashboard/sources">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sources?.length ? (
                sources.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {s.integration.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          AI monitoring: Active
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Live
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                  <div className="mb-4 p-3 rounded-full bg-emerald-100 text-emerald-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-800 font-medium mb-1">
                    No integrations yet
                  </p>
                  <p className="text-slate-500 text-sm mb-4 text-center max-w-xs">
                    Connect a data source to start AI monitoring and see live
                    updates here.
                  </p>
                  <Button
                    size="sm"
                    className="font-medium  !bg-emerald-500"
                    asChild
                  >
                    <Link href="/dashboard/sources">
                      <Plus className="w-4 h-4 mr-1" />
                      Connect source
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex justify-between text-sm mb-3">
                <span className="font-medium text-slate-700">AI Coverage</span>
                <span className="font-semibold text-emerald-600">94%</span>
              </div>
              <Progress value={94} className="h-3 bg-slate-200" />
              <p className="text-xs text-slate-500 mt-2">
                AI monitoring all critical KPIs
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
              Revenue (Predicted)
            </CardTitle>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              $52,400
            </div>
            <div className="flex items-center text-sm mb-2">
              <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span className="font-semibold">+16%</span>
              </div>
              <span className="text-slate-500 ml-2">next month</span>
            </div>
            <div className="text-xs text-slate-500">AI Confidence: 94%</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
              Churn Risk
            </CardTitle>
            <div className="w-10 h-10  from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">127</div>
            <div className="flex items-center text-sm mb-2">
              <div className="flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                <AlertTriangle className="w-3 h-3 mr-1" />
                <span className="font-semibold">High Risk</span>
              </div>
              <span className="text-slate-500 ml-2">customers</span>
            </div>
            <div className="text-xs text-slate-500">
              Action: Retention campaign ready
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
              Conversion Forecast
            </CardTitle>
            <div className="w-10 h-10  from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">4.1%</div>
            <div className="flex items-center text-sm mb-2">
              <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span className="font-semibold">+0.9%</span>
              </div>
              <span className="text-slate-500 ml-2">by Friday</span>
            </div>
            <div className="text-xs text-slate-500">Trend: Improving</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
              AI Monitoring
            </CardTitle>
            <div className="w-10 h-10  from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-2">47</div>
            <div className="flex items-center text-sm mb-2">
              <div className="flex items-center text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                <Activity className="w-3 h-3 mr-1" />
                <span className="font-semibold">Active</span>
              </div>
              <span className="text-slate-500 ml-2">KPIs tracked</span>
            </div>
            <div className="text-xs text-slate-500">
              Last anomaly: 2 min ago
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid lg:grid-cols-1 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                      <Brain className="w-5 h-5" />
                    </div>
                    AI Business Brain
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Ask anything about your business and get predictive insights
                  </CardDescription>
                </div>
                <Button
                  className=" !bg-emerald-500 shadow-lg font-medium"
                  asChild
                >
                  <Link href="/dashboard/chat">
                    Open AI Brain
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-xl p-6 border border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 mb-2">
                      Recent Question
                    </p>
                    <p className="text-slate-700">
                      "Why did our conversion rate drop yesterday and what
                      should we do about it?"
                    </p>
                  </div>
                </div>
              </div>

              <div className=" rounded-xl p-6 border border-emerald-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 mb-3">
                      AI Analysis & Recommendations
                    </p>
                    <p className="text-slate-700 mb-4">
                      Conversion dropped 0.8% due to mobile checkout issues
                      affecting 23% of users. Root cause: Payment gateway
                      timeout increased by 3 seconds.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-lg">
                        <span className="font-medium text-slate-900">
                          Fix payment gateway timeout
                        </span>
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                          Critical
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-lg">
                        <span className="font-medium text-slate-900">
                          A/B test simplified checkout
                        </span>
                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                          Recommended
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-lg">
                        <span className="font-medium text-slate-900">
                          Monitor mobile performance
                        </span>
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                          Ongoing
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
