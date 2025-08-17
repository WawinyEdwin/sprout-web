"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  Building2,
  CheckCircle,
  Database,
  Lightbulb,
  Loader,
  MessageSquare,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "./context/UserContext";

export default function HomePage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader /> Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen  ">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10   rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4  from-emerald-400 to-teal-400 rounded-full animate-pulse-slow"></div>
            </div>
            <div>
              <span className="text-2xl font-bold   bg-clip-text ">Sprout</span>
              <div className="text-xs text-emerald-600 font-medium -mt-1">
                AI-Native KPI Brain
              </div>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#differentiators"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Why Sprout
            </Link>
            {user ? (
              <>
                <Button
                  size="sm"
                  className="font-medium !bg-emerald-500"
                  asChild
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-medium"
                  asChild
                >
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  className=" !bg-emerald-500 shadow-lg font-medium"
                  asChild
                >
                  <Link href="/auth/signup">Start Free Trial</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center max-w-5xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 text-emerald-700 border-emerald-200 font-medium"
            >
              <Brain className="w-4 h-4 mr-2" />
              The World's First AI-Native KPI Brain for SMBs
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="  bg-clip-text">Stop reacting to data.</span>
              <br />
              <span className=" text-emerald-600 bg-clip-text ">
                Start predicting it.
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Sprout isn't another dashboard. It's an AI strategist that
              understands your business, predicts KPI changes, explains root
              causes, and automatically recommends actions—turning your business
              data into proactive intelligence.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-10 h-10  from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">
                    Understands Your Business
                  </div>
                  <div className="text-sm text-slate-600">
                    Context-aware AI chat
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-10 h-10  from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">
                    Real-Time Red Flags
                  </div>
                  <div className="text-sm text-slate-600">
                    Instant anomaly detection
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-10 h-10  from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">
                    Decision Support
                  </div>
                  <div className="text-sm text-slate-600">
                    Beyond visualization
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="text-lg px-8 py-4  !bg-emerald-500 shadow-lg font-semibold"
                asChild
              >
                <Link href="/dashboard/chat">
                  Experience the AI Brain
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-2 font-semibold hover:bg-slate-50 bg-transparent"
              >
                Watch AI in Action
              </Button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8  from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-slate-900">
                  AI Business Context in Action
                </span>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Live Example
                </Badge>
              </div>
              <div className="text-left space-y-4">
                <div className="rounded-lg p-4 border border-blue-200">
                  <p className="text-slate-800 font-medium mb-2">
                    💬 "How can I increase my profit margin by 5%?"
                  </p>
                  <p className="text-sm text-slate-600">
                    Natural language question based on your actual business data
                  </p>
                </div>
                <div className="rounded-lg p-4 border border-emerald-200">
                  <p className="text-slate-800 font-medium mb-2">
                    🧠 AI analyzes your Shopify, QuickBooks & Google Analytics
                    data...
                  </p>
                  <p className="text-sm text-slate-600 mb-3">
                    "Based on your $45K monthly revenue and current 18% margin,
                    here are 3 personalized strategies:"
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>
                        Optimize your top 3 products (potential +2.1% margin)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>
                        Reduce Facebook ad spend on low-converting campaigns
                        (+1.8%)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>
                        Negotiate better rates with your top 2 suppliers (+1.4%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="differentiators" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge
              variant="outline"
              className="mb-4 px-4 py-2 border-emerald-200 text-emerald-700"
            >
              What Makes Sprout Different
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6   bg-clip-text ">
              6 Unique Advantages Over Traditional BI
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              See why SMBs choose Sprout over generic dashboards and
              enterprise-focused platforms
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <Card className="border-0 shadow-lg  from-white to-blue-50 hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="pb-6">
                <div className="w-16 h-16  rounded-2xl flex items-center justify-center mb-2">
                  <MessageSquare className="w-8 h-8 text-emerald-500" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">
                  AI Chat with Business Context
                </CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Unlike generic BI tools, Sprout's AI understands your specific
                  business KPIs and data context.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className=" from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">
                      Personalized Insights
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    Ask "How can I increase profit margin by 5%?" and get
                    actionable answers based on YOUR actual imported data, not
                    generic advice.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Natural language queries about your business</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Context-aware responses using your data</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Specific, actionable recommendations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg  from-white to-red-50 hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="pb-6">
                <div className="w-16 h-16  rounded-2xl flex items-center justify-center mb-2">
                  <AlertTriangle className="w-8 h-8 text-emerald-500" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">
                  Real-Time AI Red Flags
                </CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Continuous KPI monitoring with instant anomaly detection and
                  proactive recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className=" from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-900">
                      Proactive Intervention
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    Get real-time alerts with specific, data-backed advice to
                    address issues before they escalate.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>24/7 automated KPI monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Instant anomaly and underperformance detection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Timely intervention recommendations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg  from-white to-purple-50 hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2">
                  <Target className="w-8 h-8 text-emerald-500" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">
                  AI Decision Support, Not Just Visualization
                </CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Beyond dashboards, Sprout delivers contextual insights and
                  strategic guidance for informed decisions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className=" from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">
                      Strategic Guidance
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    Closes the gap between data reporting and decision-making—a
                    major pain point in traditional BI tools.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Contextual insights with strategic guidance</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Quick, informed decision-making support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Actionable recommendations, not just charts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg  from-white to-emerald-50 hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="pb-6">
                <div className="w-16 h-16  rounded-2xl flex items-center justify-center mb-2">
                  <Building2 className="w-8 h-8 text-emerald-500" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">
                  Designed for SMBs with Advanced AI
                </CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Unlike enterprise platforms requiring technical expertise,
                  Sprout combines ease of use with powerful AI.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-emerald-900">
                      No Data Science Team Needed
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    Tailored to SMB needs without sacrificing
                    sophistication—unlock AI insights without technical
                    expertise.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Enterprise-grade AI, SMB-friendly interface</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>No technical expertise required</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Sophisticated insights made simple</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg  from-white to-cyan-50 hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2">
                  <Database className="w-8 h-8 text-emerald-500" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">
                  100+ SMB Tool Integrations
                </CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Out-of-the-box support for popular SMB data sources ensuring
                  comprehensive business coverage.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className=" from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-cyan-600" />
                    <span className="font-semibold text-cyan-900">
                      Holistic Business View
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    Stripe, Shopify, QuickBooks, Google Analytics, HubSpot, and
                    95+ more—track KPIs across all operations.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Sales, marketing, finance & operations coverage</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Pre-built connectors for popular SMB tools</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Unified view across all business functions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg  from-white to-yellow-50 hover:shadow-lg transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="pb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2">
                  <TrendingUp className="w-8 h-8 text-emerald-500" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">
                  Personalized Growth Roadmaps
                </CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  AI suggests concrete optimization strategies customized to
                  your unique business data and goals.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className=" from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-900">
                      Growth Roadmap
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    Empowers users with a personalized roadmap for growth, not
                    just numbers—concrete optimization paths.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>
                      Custom optimization strategies for your business
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Concrete action plans, not generic advice</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Goal-oriented recommendations</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-2xl p-8 border border-slate-200">
            <h3 className="text-2xl font-bold text-center mb-8">
              Sprout vs Traditional BI Tools
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-6 font-semibold text-slate-900">
                      Feature
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-emerald-700">
                      Sprout AI Brain
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-slate-600">
                      Traditional BI
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-4 px-6 font-medium">
                      Business Context Understanding
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-red-600 font-bold">×</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">
                      Real-Time Anomaly Detection
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-red-600 font-bold">×</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">
                      Personalized Recommendations
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-red-600 font-bold">×</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">
                      SMB-Focused Design
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-red-600 font-bold">×</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">
                      Natural Language Queries
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-red-600 font-bold">×</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">
                      100+ SMB Integrations
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-yellow-600 font-bold">Limited</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24  from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge
              variant="outline"
              className="mb-4 px-4 py-2 border-emerald-200 text-emerald-700"
            >
              AI-Native Intelligence
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6   bg-clip-text ">
              How Sprout's AI Brain Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Unlike passive dashboards, Sprout actively monitors, predicts, and
              acts on your business data 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="group border-0 shadow-lg hover:shadow-lg transition-all duration-500 hover:-translate-y-2  from-white to-slate-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1"></div>
              <CardHeader className="pb-4">
                <div className="w-16 h-16  rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-8 h-8 text-emerald-500" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">
                  1. Continuous Monitoring
                </CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  AI agents automatically monitor all your KPIs 24/7, detecting
                  anomalies and patterns humans miss.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className=" from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-700">
                      Monitoring 47 KPIs
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Last anomaly detected: 2 minutes ago
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-lg hover:shadow-lg transition-all duration-500 hover:-translate-y-2  from-white to-slate-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1  from-emerald-500 to-teal-500"></div>
              <CardHeader className="pb-4">
                <div className="w-16 h-16  from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-emerald-500" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">
                  2. Predictive Analysis
                </CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  Advanced ML models predict future performance and identify
                  root causes with contextual explanations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl p-4 border border-emerald-100">
                  <div className="text-sm font-medium text-emerald-700 mb-1">
                    Forecast Accuracy: 94%
                  </div>
                  <p className="text-xs text-slate-600">
                    Next prediction: Revenue +12% by Friday
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-lg hover:shadow-lg transition-all duration-500 hover:-translate-y-2  from-white to-slate-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1  from-purple-500 to-pink-500"></div>
              <CardHeader className="pb-4">
                <div className="w-16 h-16  from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-emerald-500" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">
                  3. Automated Actions
                </CardTitle>
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  AI recommends and can automatically execute actions to
                  optimize performance and prevent issues.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className=" from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <div className="text-sm font-medium text-purple-700 mb-1">
                    Actions Taken Today: 12
                  </div>
                  <p className="text-xs text-slate-600">
                    Saved: $2,400 in ad spend
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6   bg-clip-text ">
              Beyond Traditional Dashboards
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              See how Sprout's AI-native approach transforms reactive reporting
              into proactive business intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageSquare,
                title: "Natural Language Queries",
                desc: "Ask 'Why did conversion drop?' and get detailed explanations",
                color: "from-blue-500 to-indigo-500",
              },
              {
                icon: AlertTriangle,
                title: "Predictive Alerts",
                desc: "Get warned about issues before they impact your business",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: Target,
                title: "Automated Actions",
                desc: "AI can pause ads, reallocate budgets, and optimize campaigns",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Brain,
                title: "Root Cause Analysis",
                desc: "Understand exactly why metrics change with AI explanations",
                color: "from-emerald-500 to-teal-500",
              },
              {
                icon: TrendingUp,
                title: "Performance Forecasting",
                desc: "See where your business is heading with 94% accuracy",
                color: "from-cyan-500 to-blue-500",
              },
              {
                icon: Zap,
                title: "Real-time Intelligence",
                desc: "Continuous monitoring and instant insights 24/7",
                color: "from-yellow-500 to-orange-500",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="border-0  from-white to-slate-50 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12  ${feature.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24  from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge
              variant="outline"
              className="mb-4 px-4 py-2 border-emerald-200 text-emerald-700"
            >
              Simple, Transparent Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6   bg-clip-text ">
              Choose Your AI Intelligence Level
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Start with a free trial and scale your AI-powered business
              intelligence as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <Card className="border-2 border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg  from-white to-slate-50">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16  rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 " />
                </div>
                <CardTitle className="text-2xl font-bold mb-2">
                  Professional
                </CardTitle>
                <CardDescription className="text-slate-600 mb-6">
                  Perfect for small businesses getting started with AI
                </CardDescription>
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900 mb-2">
                    $199.99
                  </div>
                  <div className="text-slate-600">/month</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">Up to 3 data sources</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">AI KPI monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">Basic predictions</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">Email alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">Standard support</span>
                </div>
                <div className="mt-3 pb-5"></div>
                <div className="pt-6">
                  <Button className="w-full  !bg-emerald-500" asChild>
                    <Link href="/auth/signup">Start Free Trial</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-500 hover:border-emerald-600 transition-all duration-300 hover:shadow-lg  from-white to-emerald-50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-emerald-600  hover:bg-emerald-600 px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <div className="w-16 h-16  from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 " />
                </div>
                <CardTitle className="text-2xl font-bold mb-2">
                  Growth
                </CardTitle>
                <CardDescription className="text-slate-600 mb-6">
                  Advanced AI for growing businesses
                </CardDescription>
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900 mb-2">
                    $399.99
                  </div>
                  <div className="text-slate-600">/month</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">Up to 7 data sources</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">
                    Advanced AI predictions
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">Root cause analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">Automated actions</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">Custom dashboards</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">Priority support</span>
                </div>
                <div className="pt-6">
                  <Button className="w-full !bg-emerald-500 shadow-lg" asChild>
                    <Link href="/auth/signup">Start Free Trial</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2border-slate-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg  from-white to-slate-50">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16  rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold mb-2">
                  Enterprise
                </CardTitle>
                <CardDescription className="text-slate-600 mb-6">
                  Full AI power for large organizations
                </CardDescription>
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900 mb-2">
                    $899.99
                  </div>
                  <div className="text-slate-600">/month</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">Unlimited data sources</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">
                    Full AI brain capabilities
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">Custom AI models</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">White-label options</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">
                    Dedicated success manager
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-slate-700">24/7 premium support</span>
                </div>
                <div className="pt-6">
                  <Button className="w-full !bg-emerald-500" asChild>
                    <Link href="/auth/signup">Contact Sales</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-2xl p-8 border border-emerald-200 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16   rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 " />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Start Your 7-Day Free Trial
              </h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Experience the full power of Sprout's AI brain with no
                commitment. Connect your data sources and see predictions in
                minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="w-5 h-5" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="w-5 h-5" />
                  <span>Full AI features included</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="w-5 h-5" />
                  <span>Cancel anytime</span>
                </div>
              </div>
              <Button
                size="lg"
                className=" !bg-emerald-600 shadow-lg font-semibold"
                asChild
              >
                <Link href="/auth/signup">
                  Start Free Trial Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 "></div>
        <div className="absolute inset-0"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 ">
              Ready to stop reacting and start predicting?
            </h2>
            <p className="text-xl mb-10 text-emerald-500 leading-relaxed">
              Join forward-thinking SMBs using Sprout's AI brain to predict
              problems, explain causes, and automate solutions with business
              context that understands YOUR data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="text-lg px-8 py-4  !bg-emerald-500 shadow-lg font-semibold"
                asChild
              >
                <Link href="/dashboard/chat">
                  Experience AI-Native Intelligence
                  <Brain className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant={"outline"}
                className="text-lg px-8 py-4 border-2 font-semibold"
              >
                Schedule AI Demo
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 ">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>AI setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-emerald-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10   rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-white">Sprout</span>
                  <div className="text-xs text-emerald-400 -mt-1">
                    AI-Native KPI Brain
                  </div>
                </div>
              </div>
              <p className="leading-relaxed">
                The world's first AI-native business intelligence platform
                designed specifically for SMBs that predicts, explains, and
                acts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">AI Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Business Context Chat
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Real-Time Red Flags
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Decision Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Growth Roadmaps
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    100+ SMB Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Enterprise
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="">© 2025 Sprout. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms-of-service" className="transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy-policy" className="transition-colors">
                Privacy Policy
              </Link>
              <Link
                href="mailto:support@sproutai.co"
                className="transition-colors"
              >
                Contact Support via support@sproutai.co
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
