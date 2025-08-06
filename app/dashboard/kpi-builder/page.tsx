"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  Brain,
  Database,
  DollarSign,
  Eye,
  Filter,
  LineChart,
  PieChart,
  Plus,
  Save,
  Search,
  ShoppingCart,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useUser } from "../../context/UserContext";

// Metric Library Templates
const metricLibrary = [
  {
    id: 1,
    name: "Monthly Recurring Revenue (MRR)",
    category: "Revenue",
    description: "Predictable monthly revenue from subscriptions",
    formula: "SUM(subscription_revenue) WHERE billing_cycle = 'monthly'",
    dataSources: ["Stripe", "QuickBooks"],
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
    difficulty: "Easy",
    popularity: 95,
    tags: ["subscription", "revenue", "recurring"],
  },
  {
    id: 2,
    name: "Customer Acquisition Cost (CAC)",
    category: "Marketing",
    description: "Total cost to acquire each new customer",
    formula: "total_marketing_spend / new_customers_acquired",
    dataSources: ["Google Ads", "Facebook Ads", "HubSpot"],
    icon: Users,
    color: "bg-blue-100 text-blue-600",
    difficulty: "Medium",
    popularity: 88,
    tags: ["marketing", "acquisition", "cost"],
  },
  {
    id: 3,
    name: "Customer Lifetime Value (CLV)",
    category: "Revenue",
    description: "Total revenue expected from a customer",
    formula: "average_order_value * purchase_frequency * customer_lifespan",
    dataSources: ["Shopify", "Stripe", "CRM"],
    icon: TrendingUp,
    color: "bg-purple-100 text-purple-600",
    difficulty: "Hard",
    popularity: 82,
    tags: ["revenue", "lifetime", "value"],
  },
  {
    id: 4,
    name: "Conversion Rate",
    category: "Sales",
    description: "Percentage of visitors who convert to customers",
    formula: "conversions / total_visitors * 100",
    dataSources: ["Google Analytics", "Shopify"],
    icon: Target,
    color: "bg-orange-100 text-orange-600",
    difficulty: "Easy",
    popularity: 91,
    tags: ["conversion", "sales", "rate"],
  },
  {
    id: 5,
    name: "Average Order Value (AOV)",
    category: "E-commerce",
    description: "Average value per order",
    formula: "total_revenue / number_of_orders",
    dataSources: ["Shopify", "WooCommerce", "Stripe"],
    icon: ShoppingCart,
    color: "bg-emerald-100 text-emerald-600",
    difficulty: "Easy",
    popularity: 87,
    tags: ["ecommerce", "order", "value"],
  },
  {
    id: 6,
    name: "Churn Rate",
    category: "Retention",
    description: "Percentage of customers who stop using your service",
    formula: "customers_lost / total_customers_start_period * 100",
    dataSources: ["CRM", "Subscription Platform"],
    icon: Users,
    color: "bg-red-100 text-red-600",
    difficulty: "Medium",
    popularity: 79,
    tags: ["churn", "retention", "customers"],
  },
  {
    id: 7,
    name: "Net Promoter Score (NPS)",
    category: "Customer Satisfaction",
    description: "Customer loyalty and satisfaction metric",
    formula: "% promoters - % detractors",
    dataSources: ["Survey Tools", "CRM"],
    icon: Target,
    color: "bg-yellow-100 text-yellow-600",
    difficulty: "Medium",
    popularity: 73,
    tags: ["satisfaction", "loyalty", "nps"],
  },
  {
    id: 8,
    name: "Gross Margin",
    category: "Profitability",
    description: "Percentage of revenue after cost of goods sold",
    formula: "(revenue - cost_of_goods_sold) / revenue * 100",
    dataSources: ["QuickBooks", "Accounting Software"],
    icon: DollarSign,
    color: "bg-indigo-100 text-indigo-600",
    difficulty: "Medium",
    popularity: 85,
    tags: ["margin", "profitability", "gross"],
  },
];

const chartTypes = [
  {
    id: "line",
    name: "Line Chart",
    icon: LineChart,
    description: "Show trends over time",
    bestFor: "Time series data, trends",
  },
  {
    id: "bar",
    name: "Bar Chart",
    icon: BarChart3,
    description: "Compare different categories",
    bestFor: "Comparisons, categorical data",
  },
  {
    id: "pie",
    name: "Pie Chart",
    icon: PieChart,
    description: "Show proportions of a whole",
    bestFor: "Parts of a whole, percentages",
  },
];

const aggregationTypes = [
  { value: "sum", label: "Sum", description: "Add all values together" },
  { value: "average", label: "Average", description: "Calculate mean value" },
  { value: "count", label: "Count", description: "Count number of records" },
  { value: "min", label: "Minimum", description: "Find lowest value" },
  { value: "max", label: "Maximum", description: "Find highest value" },
  { value: "median", label: "Median", description: "Find middle value" },
];

const timeFrames = [
  { value: "daily", label: "Daily", description: "Group by day" },
  { value: "weekly", label: "Weekly", description: "Group by week" },
  { value: "monthly", label: "Monthly", description: "Group by month" },
  { value: "quarterly", label: "Quarterly", description: "Group by quarter" },
  { value: "yearly", label: "Yearly", description: "Group by year" },
];

export default function KPIBuilderPage() {
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const [selectedChart, setSelectedChart] = useState("line");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [aiPrompt, setAiPrompt] = useState("");
  const [customKPI, setCustomKPI] = useState({
    name: "",
    description: "",
    dataSource: "",
    field: "",
    aggregation: "",
    timeFrame: "",
    filters: "",
  });

  const categories = [
    "all",
    ...Array.from(new Set(metricLibrary.map((m) => m.category))),
  ];

  const filteredMetrics = metricLibrary.filter((metric) => {
    const matchesSearch =
      metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || metric.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAIPrompt = () => {
    // Simulate AI response
    console.log("AI analyzing prompt:", aiPrompt);
    // In real implementation, this would call an AI service
  };

  const { user } = useUser();
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Target className="w-8 h-8 text-blue-600" />
              KPI Builder & Metric Library
            </h1>
            <p className="text-slate-600">
              Browse templates, build custom KPIs, or ask AI to suggest metrics
              for your business.
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save KPI
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Metric Library & AI */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Ask AI for Metrics
                </CardTitle>
                <CardDescription>
                  Describe your business and get personalized KPI suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="e.g., 'I run an e-commerce store selling fitness equipment. What KPIs should I track to improve profitability?'"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button
                  onClick={handleAIPrompt}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get AI Suggestions
                </Button>

                {/* AI Response Preview */}
                {aiPrompt && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-purple-900">
                        AI Recommendations
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          High Priority
                        </Badge>
                        <span>Average Order Value (AOV)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          High Priority
                        </Badge>
                        <span>Customer Acquisition Cost</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Medium Priority
                        </Badge>
                        <span>Inventory Turnover Rate</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metric Library */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Metric Library
                </CardTitle>
                <CardDescription>Browse proven KPI templates</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search & Filter */}
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search metrics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Metrics List */}
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {filteredMetrics.map((metric) => {
                      const IconComponent = metric.icon;
                      return (
                        <Card
                          key={metric.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedMetric?.id === metric.id
                              ? "ring-2 ring-blue-500 bg-blue-50"
                              : ""
                          }`}
                          onClick={() => setSelectedMetric(metric)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric.color}`}
                              >
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-sm truncate">
                                    {metric.name}
                                  </h3>
                                  <Badge variant="outline" className="text-xs">
                                    {metric.difficulty}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                                  {metric.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-wrap gap-1">
                                    {metric.dataSources
                                      .slice(0, 2)
                                      .map((source) => (
                                        <Badge
                                          key={source}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {source}
                                        </Badge>
                                      ))}
                                    {metric.dataSources.length > 2 && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        +{metric.dataSources.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-green-600" />
                                    <span className="text-xs text-green-600">
                                      {metric.popularity}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - KPI Configuration */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="template" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="template">Use Template</TabsTrigger>
                <TabsTrigger value="custom">Build Custom</TabsTrigger>
                <TabsTrigger value="preview">Preview & Test</TabsTrigger>
              </TabsList>

              {/* Template Configuration */}
              <TabsContent value="template" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configure Template KPI</CardTitle>
                    <CardDescription>
                      {selectedMetric
                        ? `Customize "${selectedMetric.name}"`
                        : "Select a metric template from the library"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {selectedMetric ? (
                      <>
                        {/* Metric Details */}
                        <div className="p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedMetric.color}`}
                            >
                              <selectedMetric.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">
                                {selectedMetric.name}
                              </h3>
                              <p className="text-slate-600 mb-3">
                                {selectedMetric.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {selectedMetric.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="text-sm text-slate-500 font-mono bg-white p-2 rounded border">
                                {selectedMetric.formula}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Configuration Options */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="kpiName">KPI Name</Label>
                            <Input
                              id="kpiName"
                              defaultValue={selectedMetric.name}
                            />
                          </div>
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Select
                              defaultValue={selectedMetric.category.toLowerCase()}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.slice(1).map((category) => (
                                  <SelectItem
                                    key={category}
                                    value={category.toLowerCase()}
                                  >
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label>Data Sources</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedMetric.dataSources.map((source) => (
                              <Badge
                                key={source}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                <Database className="w-3 h-3" />
                                {source}
                              </Badge>
                            ))}
                            <Button variant="outline" size="sm">
                              <Plus className="w-3 h-3 mr-1" />
                              Add Source
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Time Frame</Label>
                            <Select defaultValue="monthly">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeFrames.map((frame) => (
                                  <SelectItem
                                    key={frame.value}
                                    value={frame.value}
                                  >
                                    {frame.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="target">Target Value</Label>
                            <Input id="target" placeholder="e.g., 10000" />
                          </div>
                          <div>
                            <Label htmlFor="unit">Unit</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="currency">
                                  Currency ($)
                                </SelectItem>
                                <SelectItem value="percentage">
                                  Percentage (%)
                                </SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="ratio">Ratio</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-600 mb-2">
                          No Template Selected
                        </h3>
                        <p className="text-slate-500">
                          Choose a metric from the library to configure it
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Custom KPI Builder */}
              <TabsContent value="custom" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Build Custom KPI</CardTitle>
                    <CardDescription>
                      Create a completely custom metric from your data sources
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customName">KPI Name</Label>
                        <Input
                          id="customName"
                          placeholder="e.g., Weekly Active Users"
                          value={customKPI.name}
                          onChange={(e) =>
                            setCustomKPI({ ...customKPI, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="customCategory">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.slice(1).map((category) => (
                              <SelectItem
                                key={category}
                                value={category.toLowerCase()}
                              >
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="customDescription">Description</Label>
                      <Textarea
                        id="customDescription"
                        placeholder="Describe what this KPI measures and why it's important"
                        value={customKPI.description}
                        onChange={(e) =>
                          setCustomKPI({
                            ...customKPI,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Data Source</Label>
                        <Select
                          value={customKPI.dataSource}
                          onValueChange={(value) =>
                            setCustomKPI({ ...customKPI, dataSource: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select data source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="google-analytics">
                              Google Analytics
                            </SelectItem>
                            <SelectItem value="shopify">Shopify</SelectItem>
                            <SelectItem value="stripe">Stripe</SelectItem>
                            <SelectItem value="hubspot">HubSpot</SelectItem>
                            <SelectItem value="quickbooks">
                              QuickBooks
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Field/Metric</Label>
                        <Select
                          value={customKPI.field}
                          onValueChange={(value) =>
                            setCustomKPI({ ...customKPI, field: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="revenue">Revenue</SelectItem>
                            <SelectItem value="users">Users</SelectItem>
                            <SelectItem value="sessions">Sessions</SelectItem>
                            <SelectItem value="orders">Orders</SelectItem>
                            <SelectItem value="conversions">
                              Conversions
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Aggregation</Label>
                        <Select
                          value={customKPI.aggregation}
                          onValueChange={(value) =>
                            setCustomKPI({ ...customKPI, aggregation: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="How to calculate" />
                          </SelectTrigger>
                          <SelectContent>
                            {aggregationTypes.map((agg) => (
                              <SelectItem key={agg.value} value={agg.value}>
                                <div>
                                  <div className="font-medium">{agg.label}</div>
                                  <div className="text-xs text-slate-500">
                                    {agg.description}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Time Frame</Label>
                        <Select
                          value={customKPI.timeFrame}
                          onValueChange={(value) =>
                            setCustomKPI({ ...customKPI, timeFrame: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Group by time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeFrames.map((frame) => (
                              <SelectItem key={frame.value} value={frame.value}>
                                <div>
                                  <div className="font-medium">
                                    {frame.label}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {frame.description}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="filters">Filters (Optional)</Label>
                      <Textarea
                        id="filters"
                        placeholder="e.g., WHERE country = 'US' AND product_category = 'electronics'"
                        value={customKPI.filters}
                        onChange={(e) =>
                          setCustomKPI({
                            ...customKPI,
                            filters: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Formula Preview */}
                    {customKPI.aggregation && customKPI.field && (
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <Label className="text-sm font-medium text-slate-700">
                          Generated Formula:
                        </Label>
                        <div className="mt-2 font-mono text-sm bg-white p-3 rounded border">
                          {customKPI.aggregation.toUpperCase()}(
                          {customKPI.field})
                          {customKPI.timeFrame &&
                            ` GROUP BY ${customKPI.timeFrame}`}
                          {customKPI.filters && ` WHERE ${customKPI.filters}`}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preview & Visualization */}
              <TabsContent value="preview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Chart Type Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Visualization</CardTitle>
                      <CardDescription>
                        Choose how to display your KPI
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label>Chart Type</Label>
                        <div className="grid grid-cols-1 gap-3 mt-2">
                          {chartTypes.map((chart) => {
                            const IconComponent = chart.icon;
                            return (
                              <Card
                                key={chart.id}
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                  selectedChart === chart.id
                                    ? "ring-2 ring-blue-500 bg-blue-50"
                                    : ""
                                }`}
                                onClick={() => setSelectedChart(chart.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    <IconComponent className="w-6 h-6 text-slate-600" />
                                    <div>
                                      <h3 className="font-medium">
                                        {chart.name}
                                      </h3>
                                      <p className="text-sm text-slate-500">
                                        {chart.description}
                                      </p>
                                      <p className="text-xs text-slate-400 mt-1">
                                        Best for: {chart.bestFor}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Time Range</Label>
                          <Select defaultValue="30d">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7d">Last 7 days</SelectItem>
                              <SelectItem value="30d">Last 30 days</SelectItem>
                              <SelectItem value="90d">Last 90 days</SelectItem>
                              <SelectItem value="1y">Last year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Refresh Rate</Label>
                          <Select defaultValue="1h">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="realtime">
                                Real-time
                              </SelectItem>
                              <SelectItem value="5m">
                                Every 5 minutes
                              </SelectItem>
                              <SelectItem value="1h">Every hour</SelectItem>
                              <SelectItem value="1d">Daily</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* KPI Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>KPI Preview</CardTitle>
                      <CardDescription>
                        See how your KPI will appear on the dashboard
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-slate-200 rounded-lg p-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            {selectedChart === "line" && (
                              <LineChart className="w-8 h-8 text-blue-600" />
                            )}
                            {selectedChart === "bar" && (
                              <BarChart3 className="w-8 h-8 text-blue-600" />
                            )}
                            {selectedChart === "pie" && (
                              <PieChart className="w-8 h-8 text-blue-600" />
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            {selectedMetric?.name ||
                              customKPI.name ||
                              "Your KPI Name"}
                          </h3>
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            $42,500
                          </div>
                          <div className="text-sm text-green-600 flex items-center justify-center gap-1 mb-4">
                            <TrendingUp className="w-4 h-4" />
                            +12.5% from last month
                          </div>

                          {/* Mock Chart Area */}
                          <div className="h-32  from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                            <div className="text-slate-400 text-sm">
                              {selectedChart === "line" &&
                                "📈 Line chart visualization"}
                              {selectedChart === "bar" &&
                                "📊 Bar chart visualization"}
                              {selectedChart === "pie" &&
                                "🥧 Pie chart visualization"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Data Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Data Preview</CardTitle>
                    <CardDescription>
                      Sample data that would be used for this KPI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Date</th>
                            <th className="text-left py-2">Value</th>
                            <th className="text-left py-2">Change</th>
                            <th className="text-left py-2">Source</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr>
                            <td className="py-2">2024-01-15</td>
                            <td className="py-2 font-medium">$42,500</td>
                            <td className="py-2 text-green-600">+12.5%</td>
                            <td className="py-2">
                              <Badge variant="outline" className="text-xs">
                                Stripe
                              </Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2">2024-01-14</td>
                            <td className="py-2 font-medium">$37,800</td>
                            <td className="py-2 text-red-600">-2.1%</td>
                            <td className="py-2">
                              <Badge variant="outline" className="text-xs">
                                Stripe
                              </Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2">2024-01-13</td>
                            <td className="py-2 font-medium">$38,600</td>
                            <td className="py-2 text-green-600">+8.3%</td>
                            <td className="py-2">
                              <Badge variant="outline" className="text-xs">
                                Stripe
                              </Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
