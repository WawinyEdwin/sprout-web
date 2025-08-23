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
import { Skeleton } from "@/components/ui/skeleton";
import { fetchRecentQuestion } from "@/lib/api/chat";
import { fetchUrgentInsights } from "@/lib/api/insights";
import { fetchWorkspaceIntegrations } from "@/lib/api/integrations";
import { QUERY_KEYS } from "@/lib/query-keys";
import { Insight, WorkspaceIntegration } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  Brain,
  Database,
  MessageSquare,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import InsightsCard from "./_components/insight-card";

export default function DashboardPage() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [processedMetrics, setMetrics] = useState<Record<string, any>[]>([]);
  const { user } = useUser();

  const {
    data: sources,
    isLoading: loadingSources,
    refetch: refetchSources,
  } = useQuery<WorkspaceIntegration[]>({
    queryKey: QUERY_KEYS.integrations.connected,
    queryFn: () => fetchWorkspaceIntegrations(),
  });

  const {
    data: recentQuestion,
    isLoading: loadingQuestion,
    refetch: refetchRecentQuestion,
  } = useQuery({
    queryKey: QUERY_KEYS.dashboard.recentQuestion,
    queryFn: fetchRecentQuestion,
  });

  const {
    data: insights,
    isLoading: loadingInsights,
    refetch: refetchInsights,
  } = useQuery<Insight[]>({
    queryKey: QUERY_KEYS.dashboard.insights,
    queryFn: fetchUrgentInsights,
  });

  const isLoading = loadingSources || loadingQuestion || loadingInsights;

  const handleRefresh = async () => {
    await Promise.all([
      refetchSources(),
      refetchRecentQuestion(),
      refetchInsights(),
    ]);
    setLastUpdate(new Date());
  };

  const anomalies = (insights || []).filter((insight) => insight.isAnomaly);
  const otherInsights = (insights || []).filter(
    (insight) => !insight.isAnomaly
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
        <div>
          <p className=" text-lg font-bold">
            Your AI brain has {anomalies?.length || 0} urgent insights.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm text-slate-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="ml-2 h-6 w-6 p-0"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
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
        <InsightsCard anomalies={anomalies} otherInsights={otherInsights} />
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
                    className="flex items-center justify-between p-4 rounded-xl border border-emerald-200"
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
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
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
                {loadingQuestion ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 mb-2">
                        Recent Question
                      </p>
                      <p className="text-slate-700">
                        {recentQuestion?.question}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
