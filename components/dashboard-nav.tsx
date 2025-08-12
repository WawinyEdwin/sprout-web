"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api/auth";
import { StoredUser } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Bell,
  Brain,
  CreditCard,
  Database,
  Layout,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Target,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Brain", href: "/dashboard/chat", icon: Brain },
  { name: "KPIs & Metrics", href: "/dashboard/kpi-builder", icon: Target },
  { name: "Data Sources", href: "/dashboard/sources", icon: Database },
];

export function useLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();

      localStorage.removeItem("sp-user");
      localStorage.removeItem("sp-access-token");

      router.push("/auth/signin");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return handleLogout;
}

interface DashboardNavProps {
  user: StoredUser | null;
}
export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10   rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4  from-emerald-400 to-teal-400 rounded-full animate-pulse-slow"></div>
            </div>
            <div>
              <span className="text-xl font-bold   bg-clip-text ">Sprout</span>
              <div className="text-xs text-emerald-600 font-medium -mt-1">
                AI-Native KPI Brain
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 font-medium transition-all duration-200",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "hover:bg-slate-100"
                    )}
                  >
                    <IconComponent className="w-4 h-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-6 h-6  rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4" />
                  </div>
                  Sprout AI
                </SheetTitle>
                <SheetDescription>Navigate your dashboard</SheetDescription>
              </SheetHeader>
              <div className="mt-8 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start gap-2 ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        {item.name}
                        {item.name === "KPI Builder" && (
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-green-100 text-green-700 text-xs"
                          >
                            New
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden md:block font-medium">
                    {user?.companyName} Workspace
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={"/dashboard/workspace"}>
                  <DropdownMenuItem className=" cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Workspace
                  </DropdownMenuItem>
                </Link>
                <Link href={"/dashboard/billing"}>
                  <DropdownMenuItem className=" cursor-pointer">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing
                  </DropdownMenuItem>
                </Link>
                <Link href={"/dashboard/settings"}>
                  <DropdownMenuItem className=" cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={useLogout()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
