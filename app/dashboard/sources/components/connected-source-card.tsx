"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { syncIntegration } from "@/lib/api/integrations";
import { IntegrationType, WorkspaceIntegration } from "@/lib/types";
import { isSyncedRecently } from "@/lib/utils";
import { formatDistanceToNow, isPast } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  Loader,
  Plug,
  RefreshCcw,
  Settings,
  Unplug,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { connectionHandlers } from "../utils";

export default function ConnectedSourceCard({
  source,
}: {
  source: WorkspaceIntegration;
}) {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    apiKey: "",
    clientId: "",
    clientSecret: "",
    accountId: "",
    shopName: "",
    customFields: {} as Record<string, string>,
  });

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

  const handleDisconnect = async (sourceId: string) => {
    try {
      setDisconnectingId(sourceId);
      // await
      toast.success("Integration disconnected.");
    } catch (error) {
      toast.error("Failed to disconnect integration.");
    } finally {
      setDisconnectingId(null);
    }
  };

  const handleReconnect = async (sourceKey: IntegrationType) => {
    try {
      const connectFn = connectionHandlers[sourceKey];
      const url = await connectFn({
        shop: credentials.shopName,
        apiKey: credentials.apiKey,
      });

      window.location.href = url;
      toast.success("Reconnected successfully!");
    } catch (error) {
      toast.error("Failed to reconnect integration.");
    }
  };

  return (
    <Card key={source.id} className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{source.integration.name}</h3>
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
                    {source.connected ? "Connected" : "Connection Error"}
                  </span>
                </div>
                <span className="text-sm text-slate-500">
                  Last sync:{" "}
                  {source.lastSynced && isPast(new Date(source.lastSynced))
                    ? formatDistanceToNow(new Date(source.lastSynced), {
                        addSuffix: true,
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {source.integration.metrics.map((metric) => (
                  <Badge key={metric.id} variant="outline" className="!text-xs">
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
                    disabled={
                      !source.connected ||
                      syncingId === source.id ||
                      isSyncedRecently(source.lastSynced, source.syncFrequency)
                    }
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
                {isSyncedRecently(source.lastSynced, source.syncFrequency) && (
                  <TooltipContent>
                    <p>This data source has been synced recently.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {source.integration.authType === "OAuth" && (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleReconnect(source.integration.key)}
                      className="cursor-pointer"
                    >
                      <Plug /> Reconnect
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDisconnect(source.id)}
                      disabled={disconnectingId === source.id}
                      className="cursor-pointer text-red-600"
                    >
                      <Unplug />{" "}
                      {disconnectingId === source.id
                        ? "Disconnecting..."
                        : "Disconnect"}
                    </DropdownMenuItem>
                  </>
                )}
                {source.integration.authType !== "OAuth" && (
                  <DropdownMenuItem disabled>
                    Settings not available
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
