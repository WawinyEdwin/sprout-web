"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchWorkspaceRawData } from "@/lib/api/integrations";
import { fetchKpiRules, saveKpiRules } from "@/lib/api/kpi";
import { QUERY_KEYS } from "@/lib/query-keys";
import { KpiRule, RawData } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  BarChart3,
  DollarSign,
  Globe,
  Headphones,
  Mail,
  MousePointer,
  PieChart,
  ShoppingCart,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ProfessionalBarChart } from "./custom-recharts";
import { formatValue } from "./utils";

type Widget = {
  id: string;
  type: "card" | "chart";
  metric?: string;
  data?: any[];
  title?: string;
};

const SkeletonCard = () => (
  <Card className="shadow-lg">
    <CardHeader>
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-2/3" />
    </CardContent>
  </Card>
);

const getMetricIcon = (key: string) => {
  if (
    key.includes("profit") ||
    key.includes("income") ||
    key.includes("revenue")
  ) {
    return <TrendingUp className="h-4 w-4 text-emerald-600" />;
  }
  if (
    key.includes("expense") ||
    key.includes("cost") ||
    key.includes("overdue")
  ) {
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  }
  if (
    key.includes("users") ||
    key.includes("visitors") ||
    key.includes("contacts") ||
    key.includes("leads")
  ) {
    return <Users className="h-4 w-4 text-blue-600" />;
  }
  if (
    key.includes("clicks") ||
    key.includes("sessions") ||
    key.includes("visits")
  ) {
    return <MousePointer className="h-4 w-4 text-purple-600" />;
  }
  if (
    key.includes("impressions") ||
    key.includes("views") ||
    key.includes("pageviews")
  ) {
    return <Globe className="h-4 w-4 text-indigo-600" />;
  }
  if (
    key.includes("orders") ||
    key.includes("transactions") ||
    key.includes("sales")
  ) {
    return <ShoppingCart className="h-4 w-4 text-emerald-600" />;
  }
  if (
    key.includes("email") ||
    key.includes("campaign") ||
    key.includes("open") ||
    key.includes("ctr")
  ) {
    return <Mail className="h-4 w-4 text-orange-600" />;
  }
  if (
    key.includes("rate") ||
    key.includes("margin") ||
    key.includes("growth") ||
    key.includes("score")
  ) {
    return <BarChart3 className="h-4 w-4 text-blue-600" />;
  }
  if (
    key.includes("ticket") ||
    key.includes("response") ||
    key.includes("resolution") ||
    key.includes("satisfaction")
  ) {
    return <Headphones className="h-4 w-4 text-teal-600" />;
  }
  if (
    key.includes("roas") ||
    key.includes("cpc") ||
    key.includes("cpa") ||
    key.includes("quality")
  ) {
    return <Target className="h-4 w-4 text-pink-600" />;
  }

  return <DollarSign className="h-4 w-4 text-gray-600" />;
};

const getMetricColor = (key: string, value: number, rule?: KpiRule) => {
  if (rule) {
    // Apply custom rule colors if a rule is defined and the condition is met
    if (
      (rule.condition === "greater_than" && value > rule.threshold) ||
      (rule.condition === "less_than" && value < rule.threshold) ||
      (rule.condition === "equal_to" && value === rule.threshold)
    ) {
      return key.includes("profit") || key.includes("revenue")
        ? "text-emerald-600"
        : "text-red-600";
    }
  }

  if (
    key.includes("profit") ||
    key.includes("income") ||
    key.includes("revenue")
  ) {
    return value > 0 ? "text-emerald-600" : "text-red-600";
  }
  if (key.includes("expense")) {
    return "text-red-600";
  }
  if (key.includes("overdue") && value > 0) {
    return "text-red-600";
  }
  return "text-foreground";
};

const categorizeMetrics = (metrics: Record<string, any>) => {
  const categories = {
    primary: [] as Array<[string, number]>,
    performance: [] as Array<[string, number]>,
    engagement: [] as Array<[string, number]>,
    operational: [] as Array<[string, number]>,
    products: [] as Array<{ product: string; amount: number }>,
  };

  Object.entries(metrics).forEach(([key, value]) => {
    if (typeof value === "number") {
      // Primary business metrics (revenue, users, sales, etc.)
      if (
        key.includes("revenue") ||
        key.includes("income") ||
        key.includes("profit") ||
        key.includes("sales") ||
        key.includes("users") ||
        key.includes("leads") ||
        key.includes("contacts") ||
        key.includes("orders") ||
        key.includes("mrr") ||
        key.includes("opportunities") ||
        key.includes("deals")
      ) {
        categories.primary.push([key, value]);
      }
      // Performance & conversion metrics
      else if (
        key.includes("rate") ||
        key.includes("margin") ||
        key.includes("growth") ||
        key.includes("ctr") ||
        key.includes("conversion") ||
        key.includes("roas") ||
        key.includes("roi") ||
        key.includes("score") ||
        key.includes("attainment")
      ) {
        categories.performance.push([key, value]);
      }
      // Engagement metrics
      else if (
        key.includes("engagement") ||
        key.includes("bounce") ||
        key.includes("duration") ||
        key.includes("sessions") ||
        key.includes("pageviews") ||
        key.includes("clicks") ||
        key.includes("impressions") ||
        key.includes("open") ||
        key.includes("views")
      ) {
        categories.engagement.push([key, value]);
      } else if (
        // QuickBooks operational metrics
        key.includes("expense") ||
        key.includes("overdue") ||
        key.includes("invoice") ||
        key.includes("paid") ||
        key.includes("received") ||
        key.includes("recieved") || // Handle typo in API
        key.includes("balance") ||
        key.includes("assets") ||
        key.includes("liabilities") ||
        key.includes("cash") ||
        key.includes("accounts") ||
        // General operational metrics
        key.includes("cost") ||
        key.includes("budget") ||
        key.includes("forecast") ||
        key.includes("inventory") ||
        key.includes("stock") ||
        key.includes("capacity") ||
        key.includes("utilization") ||
        key.includes("efficiency") ||
        key.includes("productivity") ||
        key.includes("tickets") ||
        key.includes("response") ||
        key.includes("resolution") ||
        key.includes("satisfaction") ||
        key.includes("churn") ||
        key.includes("retention") ||
        key.includes("acquisition")
      ) {
        categories.operational.push([key, value]);
      }
      // Catch-all for remaining numeric metrics
      else {
        categories.operational.push([key, value]);
      }
    }
    // Handle product/category breakdowns from various sources
    else if (
      (key === "cash_by_product" ||
        key.includes("by_") ||
        key.includes("_by_")) &&
      Array.isArray(value)
    ) {
      categories.products = value
        .filter((item: any) => item.product !== "TOTAL" && item.amount !== 0)
        .sort((a: any, b: any) => Math.abs(b.amount) - Math.abs(a.amount))
        .slice(0, 8);
    } else if (Array.isArray(value) && value.length === 0) {
      // Show empty arrays as operational metrics with 0 count
      categories.operational.push([key, 0]);
    }
  });

  return categories;
};

export default function KPIDashboard() {
  const queryClient = useQueryClient();
  const {
    data: raw_data,
    isLoading,
    isError,
  } = useQuery<RawData[]>({
    queryKey: QUERY_KEYS.raw_data.all,
    queryFn: () => fetchWorkspaceRawData(),
  });

  const { data: kpiRules, isLoading: isLoadingRules } = useQuery<KpiRule[]>({
    queryKey: QUERY_KEYS.kpi_rules.all,
    queryFn: fetchKpiRules,
  });

  const saveRulesMutation = useMutation({
    mutationFn: (rules: KpiRule[]) => saveKpiRules(rules),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.kpi_rules.all });
    },
  });

  const [selectedSource, setSelectedSource] = useState<string>("");
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [newWidgetMetric, setNewWidgetMetric] = useState<string>("");

  const { selectedMetrics, availableMetrics, categorizedData } = useMemo(() => {
    if (!selectedSource || isLoading) {
      return {
        selectedMetrics: null,
        availableMetrics: [],
        categorizedData: {
          primary: [],
          performance: [],
          engagement: [],
          operational: [],
          products: [],
        },
      };
    }

    const sourceData = raw_data?.find((item) => item.source === selectedSource);
    const metrics = sourceData?.processedData || null;
    const categorized = metrics ? categorizeMetrics(metrics) : null;

    const allMetrics = metrics
      ? Object.keys(metrics).filter((key) => typeof metrics[key] === "number")
      : [];
    const chartMetrics = metrics
      ? Object.keys(metrics).filter(
          (key) => Array.isArray(metrics[key]) && key.includes("by_")
        )
      : [];

    return {
      selectedMetrics: metrics,
      availableMetrics: [...allMetrics, ...chartMetrics],
      categorizedData: categorized,
    };
  }, [selectedSource, raw_data, isLoading]);

  const sourceOptions = useMemo(() => {
    if (isLoading || isError || !raw_data) {
      return [];
    }
    return raw_data.map((item) => (
      <SelectItem key={item.id} value={item.source}>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {item.source.replace(/_/g, " ").toUpperCase()}
          </Badge>
        </div>
      </SelectItem>
    ));
  }, [raw_data, isLoading, isError]);

  const numericMetrics = useMemo(() => {
    if (!selectedMetrics) return [];
    return Object.keys(selectedMetrics).filter(
      (key) => typeof selectedMetrics[key] === "number"
    );
  }, [selectedMetrics]);

  useEffect(() => {
    if (categorizedData && widgets.length === 0) {
      const initialWidgets: Widget[] = [];
      categorizedData.primary.forEach(([key]) => {
        initialWidgets.push({ id: uuidv4(), type: "card", metric: key });
      });
      categorizedData.operational.forEach(([key]) => {
        initialWidgets.push({ id: uuidv4(), type: "card", metric: key });
      });
      if (categorizedData.products.length > 0) {
        initialWidgets.push({
          id: uuidv4(),
          type: "chart",
          data: categorizedData.products,
          title: "Product Revenue Breakdown",
        });
      }
      setWidgets(initialWidgets);
    }
  }, [selectedSource, categorizedData]);

  const addWidget = () => {
    if (!newWidgetMetric || !selectedMetrics) return;

    const value = selectedMetrics[newWidgetMetric];
    let newWidget: Widget;

    if (Array.isArray(value) && newWidgetMetric.includes("by_")) {
      newWidget = {
        id: uuidv4(),
        type: "chart",
        data: value,
        title: newWidgetMetric.replace(/_/g, " ").toUpperCase(),
      };
    } else {
      newWidget = {
        id: uuidv4(),
        type: "card",
        metric: newWidgetMetric,
      };
    }

    setWidgets([...widgets, newWidget]);
    setNewWidgetMetric("");
    setIsAddWidgetModalOpen(false);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== id));
  };

  // State for the temporary rule being edited in the dialog
  const [tempRules, setTempRules] = useState<{ [key: string]: KpiRule | null }>(
    {}
  );

  // Effect to sync fetched rules to temp state when dialog opens or rules load
  useEffect(() => {
    if (kpiRules && isRulesModalOpen) {
      const initialTempRules: { [key: string]: KpiRule | null } = {};
      kpiRules.forEach((rule) => {
        initialTempRules[rule.metric_key] = rule;
      });
      setTempRules(initialTempRules);
    }
  }, [kpiRules, isRulesModalOpen]);

  const handleRuleChange = (
    metricKey: string,
    field: keyof KpiRule,
    value: string | number
  ) => {
    setTempRules((prev) => {
      const existingRule = prev[metricKey];
      const newRule: KpiRule = existingRule
        ? { ...existingRule, [field]: value }
        : {
            id: uuidv4(),
            metric_key: metricKey,
            workspace_id: "",
            name: field === "name" ? (value as string) : "",
            time_period: "",
            condition:
              field === "condition" ? (value as string) : "greater_than",
            threshold: field === "threshold" ? (value as number) : 0,
            isEnabled: true,
            lastCheckedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
      return { ...prev, [metricKey]: newRule };
    });
  };

  const removeRule = (metricKey: string) => {
    const updatedRules =
      kpiRules?.filter((r) => r.metric_key !== metricKey) || [];
    saveRulesMutation.mutate(updatedRules);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">KPI Dashboard</h1>
          <p className="text-muted-foreground text-md">
            Monitor your key performance indicators and define custom rules to
            track your goals.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={selectedSource}
            onValueChange={(value) => {
              setSelectedSource(value);
              setWidgets([]);
            }}
            disabled={isLoading || isError}
          >
            <SelectTrigger className="w-[280px] bg-white shadow-sm">
              {isLoading ? (
                <Skeleton className="h-6 w-full" />
              ) : (
                <SelectValue placeholder="Select data source" />
              )}
            </SelectTrigger>
            <SelectContent>{sourceOptions}</SelectContent>
          </Select>
          {selectedSource && (
            <>
              <Dialog
                open={isAddWidgetModalOpen}
                onOpenChange={setIsAddWidgetModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all">
                    Add New Widget
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Widget</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Select
                      value={newWidgetMetric}
                      onValueChange={setNewWidgetMetric}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMetrics.map((metric) => (
                          <SelectItem key={metric} value={metric}>
                            {metric.replace(/_/g, " ").toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={addWidget}
                    disabled={!newWidgetMetric}
                    className="bg-emerald-600 hover:bg-emerald-700 transition-all"
                  >
                    Add Widget
                  </Button>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isRulesModalOpen}
                onOpenChange={setIsRulesModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto shadow-sm transition-all"
                  >
                    Define KPI Rules
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>Define KPI Rules</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    <p className="text-sm text-muted-foreground">
                      Define custom rules to change the color and display a
                      message for a metric when a certain condition is met. AI
                      Brain will monitor these KPIs and send you actionable
                      recommendations.
                    </p>
                    {saveRulesMutation.isSuccess && (
                      <Badge className="bg-emerald-500 text-white shadow-md p-2">
                        Rules saved successfully!
                      </Badge>
                    )}
                    {saveRulesMutation.isError && (
                      <Badge className="bg-red-500 text-white shadow-md p-2">
                        Failed to save rules. Please try again.
                      </Badge>
                    )}
                    {isLoadingRules || !selectedMetrics ? (
                      <p>Loading rules and metrics...</p>
                    ) : (
                      <Table className="bg-white rounded-md shadow-sm">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-1/6">Metric</TableHead>
                            <TableHead className="w-1/4">Rule Name</TableHead>
                            <TableHead className="w-1/4">Condition</TableHead>
                            <TableHead className="w-1/6">Threshold</TableHead>
                            <TableHead className="w-1/6">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {numericMetrics.map((metricKey) => {
                            const rule = tempRules[metricKey];
                            return (
                              <TableRow key={metricKey}>
                                <TableCell className="font-medium capitalize">
                                  {metricKey.replace(/_/g, " ")}
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="text"
                                    value={rule?.name || ""}
                                    onChange={(e) =>
                                      handleRuleChange(
                                        metricKey,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g., Target Hit"
                                    className="p-2 border rounded-md w-full focus:ring-2 focus:ring-emerald-500"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Select
                                    value={rule?.condition || "greater_than"}
                                    onValueChange={(val) =>
                                      handleRuleChange(
                                        metricKey,
                                        "condition",
                                        val
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="greater_than">
                                        Greater than (&gt;)
                                      </SelectItem>
                                      <SelectItem value="less_than">
                                        Less than (&lt;)
                                      </SelectItem>
                                      <SelectItem value="equal_to">
                                        Equal to (=)
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="number"
                                    value={rule?.threshold || 0}
                                    onChange={(e) =>
                                      handleRuleChange(
                                        metricKey,
                                        "threshold",
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-20 p-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
                                  />
                                </TableCell>
                                <TableCell>
                                  {rule ? (
                                    <div className="flex gap-2 items-center">
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          saveRulesMutation.mutate([rule])
                                        }
                                        disabled={saveRulesMutation.isPending}
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                      >
                                        Update
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeRule(metricKey)}
                                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        saveRulesMutation.mutate([
                                          tempRules[metricKey]!,
                                        ])
                                      }
                                      disabled={
                                        !tempRules[metricKey]?.name ||
                                        saveRulesMutation.isPending
                                      }
                                      className="bg-emerald-600 hover:bg-emerald-700"
                                    >
                                      Add Rule
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {isError ? (
        <Card className="border-destructive shadow-md rounded-lg">
          <CardContent className="flex items-center gap-2 p-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span className="text-destructive">
              Failed to load dashboard data. Please try again.
            </span>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      ) : widgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {widgets.map((widget) => {
            if (widget.type === "card" && selectedMetrics && widget.metric) {
              const key = widget.metric;
              const value = selectedMetrics[key];
              if (typeof value === "number") {
                const rule = kpiRules?.find((r) => r.metric_key === key);
                const isRuleMet = rule
                  ? (rule.condition === "greater_than" &&
                      value > rule.threshold) ||
                    (rule.condition === "less_than" &&
                      value < rule.threshold) ||
                    (rule.condition === "equal_to" && value === rule.threshold)
                  : false;

                return (
                  <Card
                    key={widget.id}
                    className="border-0 shadow-lg relative bg-white transition-transform transform hover:scale-[1.02]"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 transition-colors"
                      onClick={() => removeWidget(widget.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pr-10">
                      <CardTitle className="text-sm font-medium capitalize text-gray-500">
                        {key.replace(/_/g, " ")}
                      </CardTitle>
                      {getMetricIcon(key)}
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-3xl font-bold ${getMetricColor(
                          key,
                          value,
                          rule
                        )}`}
                      >
                        {formatValue(key, value)}
                      </div>
                      {isRuleMet && rule?.name && (
                        <Badge className="!bg-emerald-600 text-white text-xs mt-2 font-semibold">
                          {rule.name}
                        </Badge>
                      )}
                      {!isRuleMet && value === 0 && key.includes("overdue") && (
                        <Badge
                          variant="default"
                          className="text-xs mt-2 bg-emerald-500 text-white font-semibold"
                        >
                          Good
                        </Badge>
                      )}
                      {!isRuleMet &&
                        value === 0 &&
                        (key.includes("paid") ||
                          key.includes("received") ||
                          key.includes("recieved")) && (
                          <Badge variant="secondary" className="text-xs mt-2">
                            No Activity
                          </Badge>
                        )}
                    </CardContent>
                  </Card>
                );
              }
            } else if (widget.type === "chart" && widget.data) {
              return (
                <div
                  key={widget.id}
                  className="relative col-span-1 md:col-span-2 lg:col-span-3 transition-transform transform hover:scale-[1.005]"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-red-500"
                    onClick={() => removeWidget(widget.id)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                  <ProfessionalBarChart
                    data={widget.data}
                    title={widget.title || ""}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      ) : (
        <Card className="border-0 shadow-lg bg-white rounded-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No Data Source Selected
            </h3>
            <p className="text-muted-foreground text-center">
              Please select a data source from the dropdown above to view your
              metrics.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
