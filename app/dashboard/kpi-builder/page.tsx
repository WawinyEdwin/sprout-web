"use client";

import React, { useMemo, useState } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { useUser } from "@/app/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DollarSign,
  Target,
  Database,
  Brain,
  Search,
  Plus,
  Save,
  Trash2,
  LineChart,
  BarChart3,
  PieChart,
  Eye,
  TrendingUp,
} from "lucide-react";

// --- Minimal types ---
type IntegrationMetric = {
  id: string;
  name: string;
  integration: string;
  description?: string;
  tags?: string[];
  bestChart?: "line" | "bar" | "pie";
};

type DashboardWidget = {
  id: string;
  metricId: string;
  title: string;
  chartType: "line" | "bar" | "pie";
  value?: string;
};

// --- Master metric list (trimmed and grouped from user's list) ---
const MASTER_METRICS: IntegrationMetric[] = [
  // QuickBooks
  {
    id: "qb_net_income",
    name: "Net Income (Cash)",
    integration: "QuickBooks",
    description: "Net cash income in period",
    tags: ["finance", "profit"],
    bestChart: "line",
  },
  {
    id: "qb_gross_profit",
    name: "Gross Profit",
    integration: "QuickBooks",
    description: "Revenue minus COGS",
    tags: ["finance"],
    bestChart: "bar",
  },
  {
    id: "qb_overdue_invoices",
    name: "Overdue Invoices",
    integration: "QuickBooks",
    description: "Outstanding overdue invoices",
    tags: ["receivables"],
    bestChart: "bar",
  },

  // GA4
  {
    id: "ga_users",
    name: "Users",
    integration: "Google Analytics 4",
    description: "Unique users in period",
    tags: ["traffic"],
    bestChart: "line",
  },
  {
    id: "ga_new_users",
    name: "New Users",
    integration: "Google Analytics 4",
    description: "New users",
    tags: ["traffic"],
    bestChart: "line",
  },
  {
    id: "ga_sessions",
    name: "Sessions",
    integration: "Google Analytics 4",
    description: "Sessions",
    tags: ["traffic"],
    bestChart: "line",
  },
  {
    id: "ga_conv_rate",
    name: "Conversion Rate",
    integration: "Google Analytics 4",
    description: "Conversions / sessions",
    tags: ["conversion"],
    bestChart: "bar",
  },

  // Salesforce
  {
    id: "sf_opps",
    name: "Total Opportunities",
    integration: "Salesforce",
    description: "Open opportunities",
    tags: ["sales"],
    bestChart: "bar",
  },
  {
    id: "sf_win_rate",
    name: "Opportunity Win Rate",
    integration: "Salesforce",
    description: "Win rate by opportunities",
    tags: ["sales"],
    bestChart: "line",
  },

  // HubSpot
  {
    id: "hs_contacts",
    name: "Contacts Created",
    integration: "HubSpot",
    description: "New contacts created",
    tags: ["crm"],
    bestChart: "line",
  },
  {
    id: "hs_mqls",
    name: "Marketing Qualified Leads",
    integration: "HubSpot",
    description: "MQLs",
    tags: ["leads"],
    bestChart: "bar",
  },

  // Shopify
  {
    id: "sh_total_sales",
    name: "Total Sales Revenue",
    integration: "Shopify",
    description: "Gross sales",
    tags: ["ecommerce"],
    bestChart: "line",
  },
  {
    id: "sh_aov",
    name: "Average Order Value (AOV)",
    integration: "Shopify",
    description: "Average value per order",
    tags: ["ecommerce"],
    bestChart: "bar",
  },

  // Google Ads
  {
    id: "ga_clicks",
    name: "Clicks",
    integration: "Google Ads",
    description: "Ad clicks",
    tags: ["ads"],
    bestChart: "bar",
  },
  {
    id: "ga_cpc",
    name: "Cost Per Click (CPC)",
    integration: "Google Ads",
    description: "Average CPC",
    tags: ["ads"],
    bestChart: "line",
  },

  // Stripe
  {
    id: "st_total_revenue",
    name: "Total Revenue",
    integration: "Stripe",
    description: "Total processed revenue",
    tags: ["payments"],
    bestChart: "line",
  },
  {
    id: "st_mrr",
    name: "Monthly Recurring Revenue (MRR)",
    integration: "Stripe",
    description: "MRR from subscriptions",
    tags: ["saas"],
    bestChart: "line",
  },

  // Zendesk
  {
    id: "zd_ticket_volume",
    name: "Ticket Volume",
    integration: "ZenDesk",
    description: "Number of support tickets",
    tags: ["support"],
    bestChart: "bar",
  },

  // Mailchimp
  {
    id: "mc_open_rate",
    name: "Email Open Rate",
    integration: "MailChimp",
    description: "Open rate for campaigns",
    tags: ["email"],
    bestChart: "bar",
  },
];

const CHART_ICONS: Record<string, any> = {
  line: LineChart,
  bar: BarChart3,
  pie: PieChart,
};

// --- Utility helpers ---
const uid = (prefix = "w") =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

// Persist/load local dashboard
const DASHBOARD_KEY = "sprout_mvp_dashboard_v1";

// --- Main component ---
export default function SproutMvpPage() {
  const { user } = useUser();

  // Dashboard state
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>(
    () => {
      try {
        const raw =
          typeof window !== "undefined"
            ? localStorage.getItem(DASHBOARD_KEY)
            : null;
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }
  );

  // Left pane state
  const [query, setQuery] = useState("");
  const [selectedIntegration, setSelectedIntegration] = useState<string>("all");
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedChart, setSelectedChart] = useState<"line" | "bar" | "pie">(
    "line"
  );

  const integrations = useMemo(
    () => [
      "all",
      ...Array.from(new Set(MASTER_METRICS.map((m) => m.integration))),
    ],
    []
  );

  const filtered = useMemo(() => {
    return MASTER_METRICS.filter((m) => {
      if (
        selectedIntegration !== "all" &&
        m.integration !== selectedIntegration
      )
        return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        (m.description || "").toLowerCase().includes(q) ||
        (m.tags || []).some((t) => t.includes(q))
      );
    });
  }, [query, selectedIntegration]);

  // --- Actions ---
  const addMetricToDashboard = (
    metricId: string,
    opts?: { chart?: DashboardWidget["chartType"] }
  ) => {
    const metric = MASTER_METRICS.find((m) => m.id === metricId);
    if (!metric) return;
    const widget: DashboardWidget = {
      id: uid("widget"),
      metricId: metric.id,
      title: metric.name,
      chartType: opts?.chart || metric.bestChart || "line",
      value: undefined,
    };
    setDashboardWidgets((s) => {
      const next = [...s, widget];
      try {
        localStorage.setItem(DASHBOARD_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const removeWidget = (id: string) => {
    setDashboardWidgets((s) => {
      const next = s.filter((w) => w.id !== id);
      try {
        localStorage.setItem(DASHBOARD_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const maximizeWidget = (id: string) => {
    setDashboardWidgets((s) => {
      // Move widget to front for a lightweight "maximize" effect
      const idx = s.findIndex((w) => w.id === id);
      if (idx <= 0) return s;
      const copy = [...s];
      const [w] = copy.splice(idx, 1);
      copy.unshift(w);
      try {
        localStorage.setItem(DASHBOARD_KEY, JSON.stringify(copy));
      } catch (e) {}
      return copy;
    });
  };

  const saveDashboard = () => {
    try {
      localStorage.setItem(DASHBOARD_KEY, JSON.stringify(dashboardWidgets));
    } catch (e) {}
  };

  // AI -> very small simulated behavior for MVP
  const handleAiSuggest = () => {
    if (!aiPrompt) return;
    // rudimentary mapping: if prompt contains "revenue" suggest revenue metrics
    const p = aiPrompt.toLowerCase();
    const suggestions: string[] = [];
    if (p.includes("revenue") || p.includes("sales")) {
      suggestions.push("sh_total_sales", "st_total_revenue");
    }
    if (p.includes("users") || p.includes("traffic")) {
      suggestions.push("ga_users", "ga_sessions");
    }
    if (p.includes("support") || p.includes("tickets")) {
      suggestions.push("zd_ticket_volume");
    }

    // Show first suggestion in selected metric and preselect good chart
    const first = suggestions.find((s) =>
      MASTER_METRICS.some((m) => m.id === s)
    );
    if (first) {
      setSelectedMetricId(first);
      const metric = MASTER_METRICS.find((m) => m.id === first);
      setSelectedChart(metric?.bestChart || "line");
    }
  };

  // --- Presentational helpers ---
  const renderChartIcon = (type: string) => {
    const C = CHART_ICONS[type] || LineChart;
    return <C className="w-5 h-5 text-slate-600" />;
  };

  // small function to simulate a numeric value for preview
  const simulatedValue = (metricId: string) => {
    const n =
      Math.abs(metricId.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
      100000;
    if (
      metricId.includes("revenue") ||
      metricId.includes("sales") ||
      metricId.includes("revenue")
    )
      return `$${(n + 40000).toLocaleString()}`;
    if (metricId.includes("users") || metricId.includes("sessions"))
      return `${n % 20000}`;
    return `${n % 1000}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Target className="w-6 h-6 text-emerald-600" />
              Metric Library & Dashboard — MVP
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Quickly discover KPIs, configure, and add them to a live
              dashboard. AI assistant helps suggest metrics.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDashboardWidgets([]);
                try {
                  localStorage.removeItem(DASHBOARD_KEY);
                } catch (e) {}
              }}
            >
              Reset
            </Button>
            <Button onClick={saveDashboard} className="!bg-emerald-600">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left pane */}
          <div className="lg:col-span-5 space-y-4">
            {/* AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-emerald-600" /> AI KPI
                  Assistant
                </CardTitle>
                <CardDescription>
                  Ask in natural language for KPI suggestions or explain
                  business goals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g. 'I want to increase gross margin for product X'"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="min-h-[90px]"
                />
                <div className="flex gap-2 mt-3">
                  <Button onClick={handleAiSuggest} className="!bg-emerald-600">
                    Suggest KPIs
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAiPrompt("");
                      setSelectedMetricId(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>
                {selectedMetricId && (
                  <div className="mt-4 p-3 bg-slate-50 rounded border">
                    <div className="text-xs text-slate-600 font-medium mb-2">
                      Suggested
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="font-semibold">
                          {
                            MASTER_METRICS.find(
                              (m) => m.id === selectedMetricId
                            )?.name
                          }
                        </div>
                        <div className="text-xs text-slate-500">
                          {
                            MASTER_METRICS.find(
                              (m) => m.id === selectedMetricId
                            )?.integration
                          }
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addMetricToDashboard(selectedMetricId!)}
                      >
                        <Plus className="w-3 h-3 mr-2" /> Add
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metric library + search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" /> Metric
                  Library
                </CardTitle>
                <CardDescription>
                  Browse metrics by integration. Click to preview or add.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      className="pl-10"
                      placeholder="Search metrics..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <Select
                    value={selectedIntegration}
                    onValueChange={(v) => setSelectedIntegration(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {integrations.map((i) => (
                        <SelectItem key={i} value={i}>
                          {i === "all" ? "All Integrations" : i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ScrollArea className="h-[420px]">
                  <div className="space-y-2">
                    {filtered.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3 rounded border ${
                          selectedMetricId === m.id
                            ? "ring-2 ring-emerald-400 bg-emerald-50"
                            : "bg-white"
                        } flex items-start gap-3 cursor-pointer`}
                        onClick={() => {
                          setSelectedMetricId(m.id);
                          setSelectedChart(m.bestChart || "line");
                        }}
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 text-slate-700">
                          <Target className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-semibold text-sm truncate">
                              {m.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {m.integration}
                            </div>
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-2">
                            {m.description}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            {(m.tags || []).slice(0, 3).map((t) => (
                              <Badge
                                key={t}
                                variant="outline"
                                className="text-xs"
                              >
                                {t}
                              </Badge>
                            ))}
                            <div className="ml-auto flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addMetricToDashboard(m.id);
                                }}
                              >
                                Add
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMetricId(m.id);
                                }}
                              >
                                Preview
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filtered.length === 0 && (
                      <div className="text-sm text-slate-500 p-4">
                        No metrics found.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Metric configurator (template & custom minimal) */}
            <Card>
              <CardHeader>
                <CardTitle>Configure Metric</CardTitle>
                <CardDescription>
                  Choose chart type and quick options before adding to
                  dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label>Chart Type</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant={
                          selectedChart === "line" ? undefined : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedChart("line")}
                      >
                        Line
                      </Button>
                      <Button
                        variant={
                          selectedChart === "bar" ? undefined : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedChart("bar")}
                      >
                        Bar
                      </Button>
                      <Button
                        variant={
                          selectedChart === "pie" ? undefined : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedChart("pie")}
                      >
                        Pie
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Quick Actions</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        onClick={() => {
                          if (selectedMetricId)
                            addMetricToDashboard(selectedMetricId, {
                              chart: selectedChart,
                            });
                        }}
                        disabled={!selectedMetricId}
                      >
                        Add to Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedMetricId(null);
                          setQuery("");
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    Tip: Use the AI Assistant to get recommended KPIs for your
                    goals.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right pane: Dashboard canvas */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Live Dashboard</CardTitle>
                    <CardDescription>
                      Drag to reorder (simple), maximize, or remove widgets.
                      Saved to browser for MVP.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard?.writeText(
                          JSON.stringify(dashboardWidgets)
                        );
                      }}
                    >
                      Export
                    </Button>
                    <Button
                      onClick={() => {
                        setDashboardWidgets((s) => {
                          const next = [...s];
                          try {
                            localStorage.setItem(
                              DASHBOARD_KEY,
                              JSON.stringify(next)
                            );
                          } catch (e) {}
                          return next;
                        });
                      }}
                      variant="outline"
                    >
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {dashboardWidgets.length === 0 ? (
                  <div className="text-center py-24">
                    <Eye className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <div className="text-lg font-semibold text-slate-700 mb-2">
                      No widgets yet
                    </div>
                    <div className="text-sm text-slate-500 mb-4">
                      Add KPIs from the left to start building your dashboard.
                    </div>
                    <Button
                      onClick={() => addMetricToDashboard(MASTER_METRICS[0].id)}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Example KPI
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardWidgets.map((w, idx) => {
                      const metric = MASTER_METRICS.find(
                        (m) => m.id === w.metricId
                      )!;
                      const ChartIcon = CHART_ICONS[w.chartType] || LineChart;
                      const value = w.value || simulatedValue(w.metricId);
                      return (
                        <div key={w.id} className="relative">
                          <Card className="h-full">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <ChartIcon className="w-5 h-5 text-slate-600" />
                                  </div>
                                  <div>
                                    <div className="font-semibold">
                                      {w.title}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      {metric.integration}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => maximizeWidget(w.id)}
                                  >
                                    Max
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeWidget(w.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-2xl font-bold">
                                    {value}
                                  </div>
                                  <div className="text-xs text-green-600 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> +
                                    {Math.abs(idx * 3) + 5}%
                                  </div>
                                </div>
                                <div className="w-32 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded flex items-center justify-center text-slate-400 text-sm">
                                  {w.chartType === "line"
                                    ? "📈 Line"
                                    : w.chartType === "bar"
                                    ? "📊 Bar"
                                    : "🥧 Pie"}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Templates + quick actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: "E-commerce Overview",
                  kpis: ["sh_total_sales", "sh_aov", "sh_total_sales"],
                },
                {
                  name: "Marketing Performance",
                  kpis: ["ga_clicks", "ga_conv_rate", "ga_sessions"],
                },
                {
                  name: "SaaS Metrics",
                  kpis: ["st_mrr", "qb_net_income", "st_total_revenue"],
                },
              ].map((t) => (
                <Card
                  key={t.name}
                  className="cursor-pointer"
                  onClick={() => {
                    t.kpis.forEach((k) => addMetricToDashboard(k));
                  }}
                >
                  <CardContent>
                    <div className="font-semibold mb-2">{t.name}</div>
                    <div className="text-sm text-slate-500 mb-3">
                      Add a prebuilt set of KPIs to your dashboard.
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Add Template</Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
