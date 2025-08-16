"use client";

import { useUser } from "@/app/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWorkspaceRawData } from "@/lib/api/raw_data";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { RawData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import { useMemo, useState } from "react";

const SkeletonCard = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-2/3" />
    </CardContent>
  </Card>
);

const formatValue = (key: string, value: number) => {
  // Currency formatting
  if (
    key.includes("revenue") ||
    key.includes("income") ||
    key.includes("profit") ||
    key.includes("expense") ||
    key.includes("cost") ||
    key.includes("value") ||
    key.includes("amount") ||
    key.includes("cac") ||
    key.includes("cltv") ||
    key.includes("aov") ||
    key.includes("mrr") ||
    key.includes("roas")
  ) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  }

  // Percentage formatting
  if (
    key.includes("rate") ||
    key.includes("margin") ||
    key.includes("growth") ||
    key.includes("ctr") ||
    key.includes("bounce") ||
    key.includes("conversion") ||
    key.includes("engagement") ||
    key.includes("retention") ||
    key.includes("churn") ||
    key.includes("roi") ||
    key.includes("share")
  ) {
    return `${value.toFixed(2)}%`;
  }

  // Time formatting (seconds to readable format)
  if (key.includes("duration") || key.includes("time")) {
    if (value < 60) return `${value.toFixed(1)}s`;
    if (value < 3600) return `${(value / 60).toFixed(1)}m`;
    return `${(value / 3600).toFixed(1)}h`;
  }

  // Large numbers with K/M formatting
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toLocaleString();
};

const getMetricIcon = (key: string, source?: string) => {
  // Financial metrics
  if (
    key.includes("profit") ||
    key.includes("income") ||
    key.includes("revenue")
  ) {
    return <TrendingUp className="h-4 w-4 text-green-600" />;
  }
  if (
    key.includes("expense") ||
    key.includes("cost") ||
    key.includes("overdue")
  ) {
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  }

  // Analytics metrics
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

  // E-commerce metrics
  if (
    key.includes("orders") ||
    key.includes("transactions") ||
    key.includes("sales")
  ) {
    return <ShoppingCart className="h-4 w-4 text-green-600" />;
  }

  // Marketing metrics
  if (
    key.includes("email") ||
    key.includes("campaign") ||
    key.includes("open") ||
    key.includes("ctr")
  ) {
    return <Mail className="h-4 w-4 text-orange-600" />;
  }

  // Performance metrics
  if (
    key.includes("rate") ||
    key.includes("margin") ||
    key.includes("growth") ||
    key.includes("score")
  ) {
    return <BarChart3 className="h-4 w-4 text-blue-600" />;
  }

  // Support metrics
  if (
    key.includes("ticket") ||
    key.includes("response") ||
    key.includes("resolution") ||
    key.includes("satisfaction")
  ) {
    return <Headphones className="h-4 w-4 text-teal-600" />;
  }

  // Advertising metrics
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

const getMetricColor = (key: string, value: number) => {
  if (
    key.includes("profit") ||
    key.includes("income") ||
    key.includes("revenue")
  ) {
    return value > 0 ? "text-green-600" : "text-red-600";
  }
  if (key.includes("expense")) {
    return "text-red-600";
  }
  if (key.includes("overdue") && value > 0) {
    return "text-red-600";
  }
  return "text-foreground";
};

const categorizeMetrics = (metrics: Record<string, any>, source: string) => {
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
  const { user } = useUser();
  const workspaceId = user?.workspace?.workspaceId!;

  const {
    data: raw_data,
    isLoading,
    isError,
  } = useQuery<RawData[]>({
    queryKey: [QUERY_KEYS.raw_data.all, workspaceId],
    queryFn: () => fetchWorkspaceRawData(workspaceId),
    enabled: !!workspaceId,
  });

  const [selectedSource, setSelectedSource] = useState<string>("");

  const { selectedMetrics, categorizedData, selectedSourceName } =
    useMemo(() => {
      if (!selectedSource || isLoading)
        return {
          selectedMetrics: null,
          categorizedData: null,
          selectedSourceName: "",
        };

      const sourceData = raw_data?.find(
        (item) => item.source === selectedSource
      );
      const metrics = sourceData?.processedData || null;
      const categorized = metrics
        ? categorizeMetrics(metrics, selectedSource)
        : null;

      return {
        selectedMetrics: metrics,
        categorizedData: categorized,
        selectedSourceName: sourceData?.source || "",
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KPI Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your key performance indicators
          </p>
        </div>
        <Select
          value={selectedSource}
          onValueChange={setSelectedSource}
          disabled={isLoading || isError}
        >
          <SelectTrigger className="w-[280px]">
            {isLoading ? (
              <Skeleton className="h-6 w-full" />
            ) : (
              <SelectValue placeholder="Select data source" />
            )}
          </SelectTrigger>
          <SelectContent>{sourceOptions}</SelectContent>
        </Select>
      </div>

      {isError ? (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-2 p-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span className="text-destructive">
              Failed to load dashboard data. Please try again.
            </span>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      ) : categorizedData ? (
        <div className="space-y-8">
          {categorizedData.primary.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categorizedData.primary.map(([key, value]) => (
                  <Card key={key} className="border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium capitalize">
                        {key.replace(/_/g, " ")}
                      </CardTitle>
                      {getMetricIcon(key, selectedSourceName)}
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-2xl font-bold ${getMetricColor(
                          key,
                          value
                        )}`}
                      >
                        {formatValue(key, value)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {categorizedData.performance.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance & Conversion
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorizedData.performance.map(([key, value]) => (
                  <Card key={key} className="border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium capitalize">
                        {key.replace(/_/g, " ")}
                      </CardTitle>
                      {getMetricIcon(key, selectedSourceName)}
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-2xl font-bold ${getMetricColor(
                          key,
                          value
                        )}`}
                      >
                        {formatValue(key, value)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {categorizedData.engagement.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Engagement & Traffic
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorizedData.engagement.map(([key, value]) => (
                  <Card key={key} className="border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium capitalize">
                        {key.replace(/_/g, " ")}
                      </CardTitle>
                      {getMetricIcon(key, selectedSourceName)}
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-2xl font-bold ${getMetricColor(
                          key,
                          value
                        )}`}
                      >
                        {formatValue(key, value)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {categorizedData.products.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Breakdown by Category
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categorizedData.products.map((product) => (
                  <Card key={product.product} className="border-0 shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle
                        className="text-sm font-medium truncate"
                        title={product.product}
                      >
                        {product.product}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-xl font-bold ${
                          product.amount >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatValue("amount", product.amount)}
                      </div>
                      <Badge
                        variant={
                          product.amount >= 0 ? "default" : "destructive"
                        }
                        className="text-xs mt-2"
                      >
                        {product.amount >= 0 ? "Positive" : "Negative"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {categorizedData.operational.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Operational Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorizedData.operational.map(([key, value]) => (
                  <Card key={key} className="border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium capitalize">
                        {key.replace(/_/g, " ")}
                      </CardTitle>
                      {getMetricIcon(key, selectedSourceName)}
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-2xl font-bold ${getMetricColor(
                          key,
                          value
                        )}`}
                      >
                        {formatValue(key, value)}
                      </div>
                      {value === 0 && key.includes("overdue") && (
                        <Badge variant="default" className="text-xs mt-2">
                          Good
                        </Badge>
                      )}
                      {value === 0 &&
                        (key.includes("paid") ||
                          key.includes("received") ||
                          key.includes("recieved")) && (
                          <Badge variant="secondary" className="text-xs mt-2">
                            No Activity
                          </Badge>
                        )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <Card className="border-0 shadow-lg">
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
