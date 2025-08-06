"use client";

import { useUser } from "@/app/context/UserContext";
import { DashboardNav } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Send,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  insights?: {
    type: "prediction" | "explanation" | "recommendation";
    title: string;
    description: string;
    confidence?: number;
    impact?: string;
    actions?: string[];
  }[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hi! I'm your AI Business Brain. I continuously monitor your KPIs, predict future performance, and recommend actions. I can explain why metrics change and suggest what to do next. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Why did our conversion rate drop yesterday?",
        "What's our revenue forecast for next month?",
        "Which campaigns should I pause to save money?",
        "How can we reduce customer churn?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: getAIResponse(input),
        timestamp: new Date(),
        insights: getAIInsights(input),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (
      lowerQuestion.includes("conversion") &&
      lowerQuestion.includes("drop")
    ) {
      return "I've analyzed your conversion rate drop and identified the root cause. Here's my detailed analysis with actionable recommendations:";
    }

    if (
      lowerQuestion.includes("revenue") &&
      lowerQuestion.includes("forecast")
    ) {
      return "Based on my predictive models analyzing 47 KPIs and external market data, here's your revenue forecast with confidence intervals:";
    }

    if (
      lowerQuestion.includes("campaigns") &&
      lowerQuestion.includes("pause")
    ) {
      return "I've identified underperforming campaigns that are draining your budget. Here are my recommendations based on ROI analysis:";
    }

    if (lowerQuestion.includes("churn")) {
      return "I've analyzed customer behavior patterns and identified key churn indicators. Here's my comprehensive churn reduction strategy:";
    }

    return "I've analyzed your business data across all connected sources and identified key opportunities for optimization. Here are my insights:";
  };

  const getAIInsights = (question: string): any[] => {
    const lowerQuestion = question.toLowerCase();

    if (
      lowerQuestion.includes("conversion") &&
      lowerQuestion.includes("drop")
    ) {
      return [
        {
          type: "explanation",
          title: "Root Cause Analysis",
          description:
            "Conversion dropped 0.8% due to mobile checkout issues affecting 23% of users. Payment gateway timeout increased by 3 seconds.",
          confidence: 96,
        },
        {
          type: "prediction",
          title: "Impact Forecast",
          description:
            "If unresolved, this will cost $12,400 in lost revenue over the next 7 days.",
          confidence: 89,
          impact: "High",
        },
        {
          type: "recommendation",
          title: "Immediate Actions",
          description:
            "Fix payment gateway timeout, A/B test simplified checkout, monitor mobile performance.",
          actions: [
            "Fix payment timeout",
            "Deploy simplified checkout",
            "Set up mobile monitoring",
          ],
        },
      ];
    }

    if (
      lowerQuestion.includes("revenue") &&
      lowerQuestion.includes("forecast")
    ) {
      return [
        {
          type: "prediction",
          title: "Revenue Forecast",
          description:
            "Next month: $52,400 (+16% vs current). Key drivers: holiday boost (+$8K), new product launch (+$12K).",
          confidence: 94,
          impact: "Positive",
        },
        {
          type: "explanation",
          title: "Forecast Factors",
          description:
            "Based on seasonality, current trends, and 3 external market indicators including economic data.",
          confidence: 91,
        },
        {
          type: "recommendation",
          title: "Optimization Opportunities",
          description:
            "Increase email marketing budget by 40% to capture additional $3,200 in revenue.",
          actions: [
            "Increase email budget",
            "Launch holiday campaign",
            "Optimize product pages",
          ],
        },
      ];
    }

    return [
      {
        type: "explanation",
        title: "Business Health Analysis",
        description:
          "Your business is performing well with 3 optimization opportunities identified.",
        confidence: 92,
      },
    ];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const { user } = useUser();

  return (
    <div className="min-h-screen">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="font-bold mb-3 flex items-center gap-3">
              <div className="w-12 h-12  from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7" />
              </div>
              <span className="  bg-clip-text ">AI Business Brain</span>
            </h1>
            <p className="text-slate-600">
              Ask questions, get predictions, understand root causes, and
              receive automated recommendations.
            </p>
          </div>

          <div className="mb-8 p-4  from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10  from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900">
                    AI Brain Status: Actively Learning
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Monitoring 47 KPIs • 3 predictions ready • 2 actions pending
                    approval
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">
                  Live
                </span>
              </div>
            </div>
          </div>

          <Card className=" flex flex-col border-0 shadow-xl ">
            <CardHeader className="border-b ">
              <CardTitle className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-emerald-600" />
                AI Business Brain Chat
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Predictive Mode
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-8">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] ${
                          message.type === "user" ? "order-2" : "order-1"
                        }`}
                      >
                        <div
                          className={`flex items-start gap-4 ${
                            message.type === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              message.type === "user"
                                ? " from-blue-600 to-indigo-600"
                                : " from-emerald-600 to-teal-600"
                            }`}
                          >
                            {message.type === "user" ? (
                              <Users className="w-5 h-5" />
                            ) : (
                              <Brain className="w-5 h-5" />
                            )}
                          </div>
                          <div
                            className={`rounded-lg p-6 ${
                              message.type === "user"
                                ? ""
                                : " border border-slate-200 text-slate-900"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">
                              {message.content}
                            </p>

                            {message.insights && (
                              <div className="mt-6 space-y-4">
                                {message.insights.map((insight, index) => (
                                  <div
                                    key={index}
                                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex items-center gap-2">
                                        {insight.type === "prediction" && (
                                          <TrendingUp className="w-5 h-5 text-blue-600" />
                                        )}
                                        {insight.type === "explanation" && (
                                          <Brain className="w-5 h-5 text-emerald-600" />
                                        )}
                                        {insight.type === "recommendation" && (
                                          <Target className="w-5 h-5 text-purple-600" />
                                        )}
                                        <span className="font-semibold text-slate-900">
                                          {insight.title}
                                        </span>
                                      </div>
                                      {insight.confidence && (
                                        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                                          {insight.confidence}% confidence
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-slate-700 mb-3">
                                      {insight.description}
                                    </p>
                                    {insight.actions && (
                                      <div className="flex flex-wrap gap-2">
                                        {insight.actions.map(
                                          (action, actionIndex) => (
                                            <Button
                                              key={actionIndex}
                                              size="sm"
                                              className="bg-emerald-600 hover:bg-emerald-700"
                                            >
                                              {action}
                                            </Button>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {message.suggestions && (
                              <div className="mt-6 space-y-3">
                                <p className="text-xs font-medium opacity-75">
                                  Try asking:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {message.suggestions.map(
                                    (suggestion, index) => (
                                      <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-8 bg-white/20 border-white/30 hover:bg-white/30"
                                        onClick={() =>
                                          handleSuggestionClick(suggestion)
                                        }
                                      >
                                        {suggestion}
                                      </Button>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <p
                          className={`text-xs text-slate-500 mt-2 ${
                            message.type === "user" ? "text-right" : "text-left"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10  from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div className=" border border-slate-200 rounded-2xl p-6">
                          <div className="flex items-center gap-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-600">
                              AI Brain analyzing your data...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="border-t  p-6">
                <div className="flex gap-3 mb-4">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your AI Brain anything about your business..."
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    disabled={isLoading}
                    className="flex-1 h-12 border-2 focus:border-emerald-500 transition-colors"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="h-12 px-6  from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs cursor-pointer text-emerald-700"
                    onClick={() =>
                      handleSuggestionClick("Predict next month's revenue")
                    }
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Revenue forecast
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs cursor-pointer text-blue-700"
                    onClick={() =>
                      handleSuggestionClick("Why are my costs increasing?")
                    }
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Cost analysis
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs cursor-pointer text-purple-700"
                    onClick={() =>
                      handleSuggestionClick(
                        "Which campaigns should I optimize?"
                      )
                    }
                  >
                    <Target className="w-3 h-3 mr-1" />
                    Campaign optimization
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs cursor-pointer text-orange-700"
                    onClick={() =>
                      handleSuggestionClick("Show me churn risk analysis")
                    }
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Churn analysis
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
