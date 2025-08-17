"use client";

import { UserProvider } from "@/app/context/UserContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./get-query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>{children}</UserProvider>
    </QueryClientProvider>
  );
}
