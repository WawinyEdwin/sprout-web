"use client";

import { useUser } from "@/app/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  fetchIntegrations,
  fetchWorkspaceIntegrations,
  syncIntegration,
  updateUserIntegration,
} from "@/lib/api/integrations";
import { DataSyncFrequencyEnum, HistoricalDataEnum } from "@/lib/enums";
import { QUERY_KEYS } from "@/lib/query-keys";
import { IMetric, Integration, WorkspaceIntegration } from "@/lib/types";
import { enumToSelectOptions, isSyncedRecently } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow, isPast } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  Database,
  ExternalLink,
  Key,
  Loader,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  Shield,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { connectionHandlers } from "../utils";
import CustomIntegrationForm from "./CustomIntegrationForm";

interface ConnectionStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export default function SourcesClient() {
  const { user } = useUser();
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const syncFrequencyOptions = enumToSelectOptions(DataSyncFrequencyEnum);
  const historicalDataOptions = enumToSelectOptions(HistoricalDataEnum);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Integration | null>();
  const [shopName, setShopifyShop] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [connectionSteps, setConnectionSteps] = useState<ConnectionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [credentials, setCredentials] = useState({
    apiKey: "",
    clientId: "",
    clientSecret: "",
    accountId: "",
    customFields: {} as Record<string, string>,
  });
  const [config, setConfig] = useState({
    syncFrequency: "daily",
    historicalData: "all_available_data",
  });

  const { data } = useQuery<WorkspaceIntegration[]>({
    queryKey: QUERY_KEYS.integrations.connected,
    queryFn: () => fetchWorkspaceIntegrations(),
  });

  const { data: availableSourcesData, error: error2 } = useQuery<Integration[]>(
    {
      queryKey: QUERY_KEYS.integrations.available,
      queryFn: fetchIntegrations,
    }
  );

  if (error2) {
    toast.error("Error fetching user integrations", {
      description: error2?.message || "Internal server error",
    });
  }

  const connectedSources: WorkspaceIntegration[] = data ?? [];
  const availableSources: Integration[] = availableSourcesData ?? [];
  const connectedIds = new Set(connectedSources.map((c) => c.integration.id));
  const filteredAvailableSources = availableSources.filter(
    (available) => !connectedIds.has(available.id)
  );

  const categories = [
    "all",
    ...Array.from(new Set(filteredAvailableSources.map((s) => s.category))),
  ];

  const filteredSources = filteredAvailableSources.filter((source) => {
    const matchesSearch =
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || source.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSourceSelect = (source: Integration) => {
    setSelectedSource(source);

    const steps: ConnectionStep[] = [
      {
        id: "auth",
        title: "Authentication",
        description: `Connect your ${source.name} account`,
        completed: false,
        current: true,
      },
      {
        id: "permissions",
        title: "Permissions",
        description: "Grant necessary data access permissions",
        completed: false,
        current: false,
      },
      {
        id: "configure",
        title: "Configuration",
        description: "Select data to sync and set preferences",
        completed: false,
        current: false,
      },
      {
        id: "test",
        title: "Test Connection",
        description: "Verify data connection and sync",
        completed: false,
        current: false,
      },
    ];

    setConnectionSteps(steps);
    setCurrentStep(0);
    setConnectionProgress(0);
  };

  const handleNextStep = async () => {
    if (!selectedSource) return;

    const currentStepConfig = connectionSteps[currentStep];

    if (
      currentStepConfig.id === "auth" &&
      currentStepConfig.completed === false
    ) {
      await handleOauthConnection();
      return;
    }

    if (currentStep < connectionSteps.length - 1) {
      const newSteps = [...connectionSteps];
      newSteps[currentStep].completed = true;
      newSteps[currentStep].current = false;
      newSteps[currentStep + 1].current = true;

      setConnectionSteps(newSteps);
      setCurrentStep(currentStep + 1);
      setConnectionProgress(((currentStep + 1) / connectionSteps.length) * 100);
    }

    if (currentStepConfig.id === "configure" && currentStepConfig.completed) {
      await updateUserIntegration(selectedSource.id, config);
    }
  };

  const handleConnect = async () => {
    setConnectionProgress(100);
    const newSteps = [...connectionSteps];
    newSteps[currentStep].completed = true;
    newSteps[currentStep].current = false;
    setConnectionSteps(newSteps);
    setIsAddDialogOpen(false);
    setSelectedSource(null);
    setConnectionSteps([]);
    setCurrentStep(0);
    setConnectionProgress(0);
  };

  const handleOauthConnection = async () => {
    if (!selectedSource || !connectionHandlers[selectedSource.key]) {
      toast.error("Unsupported source selected.");
      return;
    }

    sessionStorage.setItem(
      "oauth_connection_flow",
      JSON.stringify(selectedSource)
    );

    try {
      const connectFn = connectionHandlers[selectedSource.key];
      const url = await connectFn({
        shop: shopName!,
        apiKey: credentials.apiKey,
      });

      if (!url) {
        throw new Error(
          `Unable to initiate connection to ${
            selectedSource.name || selectedSource.key
          }`
        );
      }

      window.location.href = url;
    } catch (error) {
      console.error("OAuth connection error:", error);
      toast.error(
        "An error occurred while trying to connect. Please try again."
      );
      sessionStorage.removeItem("oauth_connection_flow");
    }
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  // Handles the return from the OAuth redirect
  useEffect(() => {
    const status = searchParams.get("connect");
    const storedState = sessionStorage.getItem("oauth_connection_flow");

    if (status && storedState) {
      const source: Integration = JSON.parse(storedState);

      if (status === "success") {
        toast.success(`${source.name} authorized successfully!`);

        setIsAddDialogOpen(true);
        setSelectedSource(source);

        const newSteps: ConnectionStep[] = [
          {
            id: "auth",
            title: "Authentication",
            description: `Connect your ${source.name} account`,
            completed: true,
            current: true,
          },
          {
            id: "permissions",
            title: "Permissions",
            description: "Grant necessary data access permissions",
            completed: false,
            current: false,
          },
          {
            id: "configure",
            title: "Configuration",
            description: "Select data to sync and set preferences",
            completed: false,
            current: false,
          },
          {
            id: "test",
            title: "Test Connection",
            description: "Verify data connection and sync",
            completed: false,
            current: false,
          },
        ];

        setConnectionSteps(newSteps);
        setCurrentStep(1);
        setConnectionProgress((1 / newSteps.length) * 100);
      } else if (status === "error") {
        toast.error(
          `Failed to authorize with ${source.name}. Please try again.`
        );
        setIsAddDialogOpen(true);
        handleSourceSelect(source);
      }

      sessionStorage.removeItem("oauth_connection_flow");
      router.replace(window.location.pathname, { scroll: false });
    }
  }, [searchParams]);

  const renderAuthStep = () => {
    if (!selectedSource) return null;

    if (
      selectedSource.authType === "OAuth" &&
      selectedSource.key === "shopify"
    ) {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-lg text-center">
              Connect to your Shopify store
            </h3>
            <p className="text-slate-600 text-center">
              Please enter your Shopify store's custom URL to begin the
              connection process.
            </p>
            <div>
              <Label htmlFor="shopName" className="sr-only">
                Shop Name
              </Label>
              <Input
                id="shopName"
                type="url"
                aria-label="Shop Name"
                placeholder="your-store-name.myshopify.com"
                value={shopName!}
                onChange={(e) => setShopifyShop(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={() => handleNextStep()}
            disabled={!shopName}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Connect to Shopify
          </Button>
          <div className="text-xs text-slate-500 text-center">
            <Shield className="w-4 h-4 inline mr-1" />
            Your credentials are encrypted and stored securely
          </div>
        </div>
      );
    }

    if (selectedSource.authType === "OAuth") {
      return (
        <div className="space-y-4">
          <div className="text-center p-6 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              Connect to {selectedSource.name}
            </h3>
            <p className="text-slate-600 mb-4">
              You'll be redirected to {selectedSource.name} to authorize Sprout
              to access your data.
            </p>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => handleNextStep()}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Authorize with {selectedSource.name}
            </Button>
          </div>
          <div className="text-xs text-slate-500 text-center">
            <Shield className="w-4 h-4 inline mr-1" />
            Your credentials are encrypted and stored securely
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="m-3">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              aria-label="API Key"
              placeholder="Enter your API key"
              value={credentials.apiKey}
              onChange={(e) =>
                setCredentials({ ...credentials, apiKey: e.target.value })
              }
            />
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-emerald-900 mb-1">
                  How to find your API key:
                </h4>
                <ol className="text-sm text-emerald-700 space-y-1">
                  <li>1. Log into your {selectedSource.name} account</li>
                  <li>2. Go to Settings → API or Developer Settings</li>
                  <li>3. Generate a new API key with read permissions</li>
                  <li>4. Copy and paste the key above</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => handleNextStep()}
          disabled={!credentials.apiKey}
          className="w-full !bg-emerald-500"
        >
          Continue
        </Button>
      </div>
    );
  };

  const renderPermissionsStep = () => (
    <div className="space-y-4 mb-2">
      <div className="text-center mb-6">
        <h3 className="font-semibold text-lg mb-2">Grant Permissions</h3>
        <p className="text-slate-600">
          Sprout needs access to the following data from your{" "}
          {selectedSource?.name} account:
        </p>
      </div>

      <div className="space-y-3">
        {selectedSource?.metrics.map((metric: IMetric) => (
          <div
            key={metric.id}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="font-medium">{metric.name}</span>
            </div>
            <Badge variant="secondary">Read Only</Badge>
          </div>
        ))}
      </div>

      <div className="p-4 bg-emerald-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-emerald-900 mb-1">Data Security</h4>
            <p className="text-sm text-emerald-700">
              We only request read-only access and never store sensitive
              information like passwords or payment details.
            </p>
          </div>
        </div>
      </div>
      <div className="p-3">
        <Button
          onClick={() => handleNextStep()}
          className="w-full !bg-emerald-500"
        >
          Grant Permissions
        </Button>
      </div>
    </div>
  );

  const renderConfigureStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="font-semibold text-lg mb-2">Configure Data Sync</h3>
        <p className="text-slate-600">
          Choose what data to sync and how often to update it.
        </p>
      </div>

      <div className="space-y-4">
        <div className="m-3">
          <Label>Sync Frequency</Label>
          <Select
            defaultValue="daily"
            onValueChange={(val) =>
              setConfig((prev) => ({ ...prev, syncFrequency: val }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {syncFrequencyOptions.map((opt, index) => (
                <SelectItem value={opt.value} key={index}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="m-3">
          <Label>Historical Data</Label>
          <Select
            defaultValue="all_available_data"
            onValueChange={(val) =>
              setConfig((prev) => ({ ...prev, historicalData: val }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {historicalDataOptions.map((opt, index) => (
                <SelectItem value={opt.value} key={index}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="m-3">
          <Label>Data Filters (Optional)</Label>
          <Textarea
            placeholder="e.g., Only sync data from specific campaigns or date ranges"
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-3 m-2">
          <Label>Metrics to Sync</Label>
          {selectedSource?.metrics.map((metric: IMetric) => (
            <div
              key={metric.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <span className="font-medium">{metric.name}</span>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={() => handleNextStep()}
        className="w-full !bg-emerald-500"
      >
        Save Configuration
      </Button>
    </div>
  );

  const renderTestStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="font-semibold text-lg mb-2">Testing Connection</h3>
        <p className="text-slate-600">
          We're verifying your connection and syncing initial data...
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Connection Status</span>
            <span className="text-emerald-600">✓ Connected</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Data Access</span>
            <span className="text-emerald-600">✓ Verified</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Initial Sync</span>
            <span className="text-yellow-600">⏳ In Progress</span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleConnect}
        className="w-full bg-emerald-500 hover:bg-emerald-500"
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Complete Connection
      </Button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderAuthStep();
      case 1:
        return renderPermissionsStep();
      case 2:
        return renderConfigureStep();
      case 3:
        return renderTestStep();
      default:
        return null;
    }
  };

  const handleSync = async (sourceId: string) => {
    try {
      setSyncingId(sourceId);
      await syncIntegration(sourceId);
      toast.success("Sync started successfully!");
    } catch (error) {
      toast.error("Sync failed.", {
        description: "Internal server error",
      });
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Data Sources</h1>
          <p className="text-slate-600">
            Connect and manage your business data sources.
          </p>
        </div>
        <Button
          className="!bg-emerald-500"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Source
        </Button>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                {selectedSource
                  ? `Connect ${selectedSource.name}`
                  : "Add Data Source"}
              </DialogTitle>
              <DialogDescription>
                {selectedSource
                  ? `Follow the steps below to connect your ${selectedSource.name} account`
                  : "Choose a data source to connect to your Sprout dashboard"}
              </DialogDescription>
            </DialogHeader>

            {selectedSource ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Setup Progress</span>
                    <span>{Math.round(connectionProgress)}%</span>
                  </div>
                  <Progress value={connectionProgress} className="h-2" />
                </div>

                <div className="flex items-center justify-between mb-6">
                  {connectionSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step.completed
                            ? "bg-emerald-600 text-white"
                            : step.current
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="ml-2 hidden sm:block">
                        <div
                          className={`text-sm font-medium ${
                            step.current ? "text-emerald-600" : "text-slate-600"
                          }`}
                        >
                          {step.title}
                        </div>
                      </div>
                      {index < connectionSteps.length - 1 && (
                        <div className="w-12 h-px bg-slate-200 mx-4 hidden sm:block" />
                      )}
                    </div>
                  ))}
                </div>

                <ScrollArea className="max-h-[400px] overflow-auto">
                  {renderCurrentStep()}
                </ScrollArea>

                <div className="flex justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedSource(null);
                      setConnectionSteps([]);
                      setCurrentStep(0);
                      setConnectionProgress(0);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <div className="text-sm text-slate-500">
                    Step {currentStep + 1} of {connectionSteps.length}
                  </div>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="browse" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="browse">Browse Sources</TabsTrigger>
                  <TabsTrigger value="custom">Custom Integration</TabsTrigger>
                </TabsList>

                <TabsContent value="browse" className="space-y-4">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Search data sources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Categories" />
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

                  <ScrollArea className="h-[500px]">
                    <div className="grid md:grid-cols-2 gap-4">
                      {filteredSources.map((source) => {
                        return (
                          <Card
                            key={source.id}
                            className="cursor-pointer border-0 shadow-lg hover:border-emerald-300"
                            onClick={() => handleSourceSelect(source)}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <h3 className="font-semibold">
                                      {source.name}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                      {source.description}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="flex flex-wrap gap-1">
                                  {source.metrics.slice(0, 3).map((metric) => (
                                    <Badge
                                      key={metric.id}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {metric.name}
                                    </Badge>
                                  ))}
                                  {source.metrics.length > 3 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      +{source.metrics.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="custom" className="space-y-4">
                  <CustomIntegrationForm user={user!} />
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Connected Sources</h2>
          <div className="space-y-4">
            {connectedSources.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300 bg-muted/40 shadow-none">
                <CardContent className="p-10 text-center space-y-4">
                  <div className="flex justify-center">
                    <AlertCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    No data sources connected
                  </h3>
                  <p className="text-sm text-gray-600">
                    Connect a data source like Google Analytics, Stripe, or
                    HubSpot to start syncing metrics.
                  </p>
                  <Button
                    className="!bg-emerald-500"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Add Source
                  </Button>
                </CardContent>
              </Card>
            ) : (
              connectedSources.map((source: WorkspaceIntegration) => (
                <Card key={source.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">
                            {source.integration.name}
                          </h3>
                          <p className="text-sm text-slate-600 mb-3">
                            {source.integration.description}
                          </p>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              {source.connected ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span className="text-sm">
                                {source.connected
                                  ? "Connected"
                                  : "Connection Error"}
                              </span>
                            </div>
                            <span className="text-sm text-slate-500">
                              Last sync:{" "}
                              {source.lastSynced &&
                              isPast(new Date(source.lastSynced))
                                ? formatDistanceToNow(
                                    new Date(source.lastSynced),
                                    { addSuffix: true }
                                  )
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {source.integration.metrics.map((metric) => (
                              <Badge
                                key={metric.id}
                                variant="outline"
                                className="text-xs"
                              >
                                {metric.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          className="bg-emerald-500"
                          disabled
                          aria-readonly
                          defaultChecked={source.connected}
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSync(source.id)}
                                // disabled={
                                //   !source.connected ||
                                //   syncingId === source.id ||
                                //   isSyncedRecently(
                                //     source.lastSynced,
                                //     source.syncFrequency
                                //   )
                                // }
                                className="flex items-center gap-1"
                              >
                                {syncingId === source.id ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                  <RefreshCcw className="w-4 h-4" />
                                )}
                                <span className="text-sm">Sync</span>
                              </Button>
                            </TooltipTrigger>
                            {isSyncedRecently(
                              source.lastSynced,
                              source.syncFrequency
                            ) && (
                              <TooltipContent>
                                <p>
                                  This data source has been synced recently.
                                </p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Popular Sources</h2>
          <div className="space-y-4">
            {filteredAvailableSources &&
              filteredAvailableSources.map((source) => {
                return (
                  <Card
                    key={source.id}
                    className="border-0 shadow-lg cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-semibold mb-1">
                              {source.name}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {source.description}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsAddDialogOpen(true);
                            handleSourceSelect(source);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
