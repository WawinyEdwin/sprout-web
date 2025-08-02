"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("sp-access-token");
    if (!token) {
      router.replace(`/auth/signin?redirect=${window.location.pathname}`);
    } else {
      setChecked(true);
    }
  }, []);

  if (!checked) return null; // Or a spinner/loading component

  return <>{children}</>;
}
