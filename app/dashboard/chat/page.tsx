"use client";

import { useUser } from "@/app/context/UserContext";
import { DashboardNav } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { askQuestion } from "@/lib/api/chat";
import {
  AlertTriangle,
  ArrowUp,
  BarChart3,
  Brain,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

    if (!user?.workspace?.workspaceId) {
      console.error("Workspace ID is missing");
      setIsLoading(false);
      return;
    }

    try {
      const { answer } = await askQuestion(user.workspace.workspaceId, input);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "ai",
          content: answer,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error asking question:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "ai",
          content:
            "⚠️ Sorry, I couldn’t process your question. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const { user } = useUser();

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen">
      <DashboardNav user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="w-full max-w-7xl mx-auto px-4">
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

          <Card className=" flex flex-col border-0 shadow-sm ">
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
                <div ref={bottomRef} />
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
                <div className="relative mt-4 flex items-center space-x-2 mb-3">
                  <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask anything about your data..."
                    disabled={isLoading}
                    className="flex-1 h-12 rounded-full px-4 border border-input shadow-sm focus-visible:ring-1 focus-visible:ring-ring transition"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="h-12 w-12 p-0 rounded-full !bg-emerald-600 shadow-lg hover:bg-emerald-700 transition"
                  >
                    <ArrowUp className="w-5 h-5" />
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
