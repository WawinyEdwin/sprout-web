"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api/auth";
import type { StoredUser } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Bell,
  Brain,
  CreditCard,
  Database,
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

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Brain", href: "/dashboard/chat", icon: Brain },
  { name: "KPIs & Metrics", href: "/dashboard/kpi", icon: Target },
  { name: "Data Sources", href: "/dashboard/sources", icon: Database },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
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
  children: React.ReactNode;
}

export function DashboardNav({ user, children }: DashboardNavProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const handleLogout = useLogout();

  return (
    <div className="flex h-screen">
      <aside
        className={cn(
          "transition-all duration-300 flex flex-col border-r",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center gap-2 px-4 py-4 border-b">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-sm font-semibold">Sprout AI</span>
          )}
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-emerald-500 text-white"
                        : " hover:bg-emerald-500 hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-2 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  sidebarCollapsed && "justify-center"
                )}
              >
                <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex flex-col text-left">
                    <span className=" text-sm">{user?.companyName}</span>
                    <span className="text-xs">Workspace</span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={"/dashboard/workspace"}>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Workspace
                </DropdownMenuItem>
              </Link>
              <Link href={"/dashboard/settings"}>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-4 px-4 ">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                <Brain className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-emerald-900">
                  AI Brain Status: <span className="font-semibold">Active</span>
                </h3>
                <p className="text-xs text-emerald-700">
                  Monitoring 47 KPIs • Last prediction: 2 min ago
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-emerald-700">Live</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
