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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DollarSign,
  Edit,
  Eye,
  Grid3X3,
  GripVertical,
  Layout,
  Maximize2,
  Minimize2,
  Plus,
  Save,
  Settings,
  ShoppingCart,
  Target,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

// Mock KPI data
const availableKPIs = [
  {
    id: "revenue",
    name: "Monthly Revenue",
    value: "$52,400",
    change: "+16%",
    trend: "up",
    color: "emerald",
    icon: DollarSign,
    chartType: "line",
  },
  {
    id: "users",
    name: "Active Users",
    value: "12,847",
    change: "+8%",
    trend: "up",
    color: "blue",
    icon: Users,
    chartType: "bar",
  },
  {
    id: "conversion",
    name: "Conversion Rate",
    value: "4.1%",
    change: "+0.9%",
    trend: "up",
    color: "purple",
    icon: Target,
    chartType: "line",
  },
  {
    id: "orders",
    name: "Total Orders",
    value: "1,247",
    change: "-2%",
    trend: "down",
    color: "orange",
    icon: ShoppingCart,
    chartType: "bar",
  },
  {
    id: "aov",
    name: "Average Order Value",
    value: "$127.50",
    change: "+5%",
    trend: "up",
    color: "green",
    icon: DollarSign,
    chartType: "line",
  },
  {
    id: "cac",
    name: "Customer Acquisition Cost",
    value: "$45.20",
    change: "-12%",
    trend: "down",
    color: "red",
    icon: Users,
    chartType: "bar",
  },
];

// Widget component
const KPIWidget = ({
  kpi,
  onEdit,
  onDelete,
  onMaximize,
  isMaximized,
  isEditing,
}: any) => {
  const IconComponent = kpi.icon;
  const colorClasses = {
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 hover:shadow-xl transition-all duration-300 relative group">
      {isEditing && (
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
          <GripVertical className="w-4 h-4 text-slate-400" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                colorClasses[kpi.color]
              }`}
            >
              <IconComponent className="w-4 h-4" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
              {kpi.name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMaximize(kpi.id)}
            >
              {isMaximized ? (
                <Minimize2 className="w-3 h-3" />
              ) : (
                <Maximize2 className="w-3 h-3" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(kpi.id)}>
              <Settings className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                kpi.trend === "up"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <TrendingUp
                className={`w-3 h-3 ${
                  kpi.trend === "down" ? "rotate-180" : ""
                }`}
              />
              {kpi.change}
            </div>
            <Badge variant="outline" className="text-xs">
              {kpi.chartType}
            </Badge>
          </div>

          {/* Mock Chart Area */}
          <div className="h-16 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-slate-400 text-xs">
              {kpi.chartType === "line" && "📈"}
              {kpi.chartType === "bar" && "📊"}
              {kpi.chartType === "pie" && "🥧"}
              Chart visualization
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DashboardsPage() {
  const [dashboardKPIs, setDashboardKPIs] = useState(availableKPIs.slice(0, 4));
  const [isEditing, setIsEditing] = useState(false);
  const [maximizedWidget, setMaximizedWidget] = useState<string | null>(null);
  const [dashboardName, setDashboardName] = useState("Business Overview");

  const handleAddKPI = (kpi: any) => {
    if (!dashboardKPIs.find((k) => k.id === kpi.id)) {
      setDashboardKPIs([...dashboardKPIs, kpi]);
    }
  };

  const handleRemoveKPI = (kpiId: string) => {
    setDashboardKPIs(dashboardKPIs.filter((k) => k.id !== kpiId));
  };

  const handleEditKPI = (kpiId: string) => {
    console.log("Edit KPI:", kpiId);
    // Open edit modal or navigate to edit page
  };

  const handleMaximizeWidget = (kpiId: string) => {
    setMaximizedWidget(maximizedWidget === kpiId ? null : kpiId);
  };

  const saveDashboard = () => {
    const dashboardConfig = {
      name: dashboardName,
      kpis: dashboardKPIs,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("dashboard-config", JSON.stringify(dashboardConfig));
    console.log("Dashboard saved:", dashboardConfig);
  };

  const { user } = useUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Layout className="w-8 h-8 text-blue-600" />
                Dashboard Builder
              </h1>
              <p className="text-slate-600">
                Create and customize your KPI dashboards with drag-and-drop
                widgets.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Done Editing" : "Edit Layout"}
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={saveDashboard}>
              <Save className="w-4 h-4 mr-2" />
              Save Dashboard
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Add Widgets
                </CardTitle>
                <CardDescription>
                  Click KPIs to add them to your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="dashboardName">Dashboard Name</Label>
                  <Input
                    id="dashboardName"
                    value={dashboardName}
                    onChange={(e) => setDashboardName(e.target.value)}
                  />
                </div>

                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {availableKPIs.map((kpi) => {
                      const IconComponent = kpi.icon;
                      const isAdded = dashboardKPIs.find(
                        (k) => k.id === kpi.id
                      );

                      return (
                        <Card
                          key={kpi.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            isAdded ? "bg-blue-50 border-blue-200" : ""
                          }`}
                          onClick={() => !isAdded && handleAddKPI(kpi)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${kpi.color}-100 text-${kpi.color}-600`}
                              >
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate">
                                  {kpi.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500">
                                    {kpi.value}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {kpi.chartType}
                                  </Badge>
                                </div>
                              </div>
                              {isAdded && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveKPI(kpi.id);
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
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

          <div className="lg:col-span-3">
            <Card className="min-h-[800px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{dashboardName}</CardTitle>
                    <CardDescription>
                      {isEditing
                        ? "Drag and resize widgets to customize your layout"
                        : "Your personalized KPI dashboard"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={isEditing ? "default" : "secondary"}>
                      {isEditing ? "Edit Mode" : "View Mode"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {dashboardKPIs.length === 0 ? (
                  <div className="text-center py-20">
                    <Layout className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">
                      No Widgets Added
                    </h3>
                    <p className="text-slate-500 mb-4">
                      Add KPIs from the sidebar to start building your dashboard
                    </p>
                    <Button onClick={() => handleAddKPI(availableKPIs[0])}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Widget
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {dashboardKPIs.map((kpi) => (
                      <div
                        key={kpi.id}
                        className={`${
                          maximizedWidget === kpi.id
                            ? "md:col-span-2 xl:col-span-3"
                            : ""
                        }`}
                      >
                        <KPIWidget
                          kpi={kpi}
                          onEdit={handleEditKPI}
                          onDelete={handleRemoveKPI}
                          onMaximize={handleMaximizeWidget}
                          isMaximized={maximizedWidget === kpi.id}
                          isEditing={isEditing}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Dashboard Templates</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "E-commerce Overview",
                description:
                  "Revenue, orders, conversion rates, and customer metrics",
                kpis: ["Revenue", "Orders", "AOV", "Conversion Rate"],
                preview: "🛒",
              },
              {
                name: "Marketing Performance",
                description: "CAC, ROAS, lead generation, and campaign metrics",
                kpis: ["CAC", "ROAS", "Leads", "Campaign ROI"],
                preview: "📈",
              },
              {
                name: "SaaS Metrics",
                description: "MRR, churn, LTV, and subscription analytics",
                kpis: ["MRR", "Churn Rate", "LTV", "Active Users"],
                preview: "💼",
              },
            ].map((template, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all"
              >
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{template.preview}</div>
                  <h3 className="font-semibold text-lg mb-2">
                    {template.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.kpis.map((kpi) => (
                      <Badge key={kpi} variant="outline" className="text-xs">
                        {kpi}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
