import {
  fetchIntegrations,
  fetchUserIntegrations,
} from "@/lib/api/integrations";
import { QUERY_KEYS } from "@/lib/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import SourcesClient from "./components/SourcesClient";

export default async function SourcesPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.integrations.connected,
      queryFn: fetchUserIntegrations,
    }),
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.integrations.available,
      queryFn: fetchIntegrations,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SourcesClient />
    </HydrationBoundary>
  );
}
