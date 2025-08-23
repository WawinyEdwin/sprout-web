"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Insight } from "@/lib/types";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useState } from "react";

export default function InsightsCard({
  anomalies,
  otherInsights,
}: {
  anomalies: Insight[];
  otherInsights: Insight[];
}) {
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  return (
    <Card className="lg:col-span-2 border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            Urgent AI Insights
          </CardTitle>
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            {anomalies.length} Alerts
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {anomalies.length > 0 ? (
          anomalies.map((insight) => (
            <div
              key={insight.id}
              className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200"
            >
              <div className="flex items-start justify-between mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-900">
                    {insight.metricName.replace(/_/g, " ")}
                  </span>
                </div>
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                  High Priority
                </Badge>
              </div>
              <p className="text-slate-700 mb-3 text-sm">{insight.insight}</p>

              {insight.recommendation && (
                <Sheet
                  open={selectedInsight?.id === insight.id}
                  onOpenChange={(open) =>
                    setSelectedInsight(open ? insight : null)
                  }
                >
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      View Recommendation
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[400px] sm:w-[500px]">
                    <SheetHeader>
                      <SheetTitle>{insight.recommendation.title}</SheetTitle>
                      <SheetDescription>
                        {insight.recommendation.impact}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 text-slate-700 text-sm leading-relaxed">
                      {insight.recommendation.description}
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No high-priority anomalies identified.
          </p>
        )}

        <Separator />

        <div className="flex items-center gap-3 text-xl font-semibold">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          Other Insights
        </div>

        {otherInsights.length > 0 ? (
          otherInsights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 rounded-xl border border-emerald-200 text-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-900">
                    {insight.metricName.replace(/_/g, " ")}
                  </span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  General
                </Badge>
              </div>
              <p className="text-slate-700 mb-3 text-sm">{insight.insight}</p>

              {insight.recommendation && (
                <Sheet
                  open={selectedInsight?.id === insight.id}
                  onOpenChange={(open) =>
                    setSelectedInsight(open ? insight : null)
                  }
                >
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      View Recommendation
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-[400px] sm:w-[500px]"
                  >
                    <SheetHeader>
                      <SheetTitle>{insight.recommendation.title}</SheetTitle>
                      <SheetDescription>
                        {insight.recommendation.impact}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 text-slate-700 text-sm leading-relaxed">
                      {insight.recommendation.description}
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No additional insights or recommendations available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
