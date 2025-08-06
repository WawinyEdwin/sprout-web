"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/api/auth";
import { StoredUser } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Brain,
  Database,
  LayoutDashboard,
  LogOut,
  Settings,
  Target,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Brain", href: "/dashboard/chat", icon: Brain },
  { name: "KPI Builder", href: "/dashboard/kpi-builder", icon: Target },
  { name: "Data Sources", href: "/dashboard/sources", icon: Database },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
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
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10   rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6" />
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

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{user?.companyName} Workspace</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-8 h-8 rounded-full  hover:to-teal-600"
                >
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Button variant="ghost" size="sm" onClick={useLogout()}>
                    <LogOut /> Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
