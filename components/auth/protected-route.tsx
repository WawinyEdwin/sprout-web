"use client";

import { useUser } from "@/app/context/UserContext";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProctectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/auth/signin?redirect=${window.location.pathname}`);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader /> Loading...
      </div>
    );
  }

  return <>{children}</>;
}
