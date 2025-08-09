import {
  connectFacebookAds,
  connectGA,
  connectGAds,
  connectHubspot,
  connectMailchimp,
  connectQuickbooks,
  connectSalesforce,
  connectShopify,
  connectStripe,
} from "@/lib/api/integrations";
import { IntegrationType } from "@/lib/types";

type ConnectArgs = { shop?: string; workspaceId: string };

type ConnectionHandler = (args: ConnectArgs) => Promise<string>;

export const connectionHandlers: Record<IntegrationType, ConnectionHandler> = {
  google_analytics: async ({ workspaceId }) => connectGA(workspaceId),
  google_ads: async ({ workspaceId }) => connectGAds(workspaceId),
  facebook_ads: async ({ workspaceId }) => connectFacebookAds(workspaceId),
  stripe: async ({ workspaceId }) => connectStripe(workspaceId),
  quick_books: async ({ workspaceId }) => connectQuickbooks(workspaceId),
  salesforce: async ({ workspaceId }) => connectSalesforce(workspaceId),
  mailchimp: async ({ workspaceId }) => connectMailchimp(workspaceId),
  hubspot: async ({ workspaceId }) => connectHubspot(workspaceId),
  shopify: async ({ shop, workspaceId }) => {
    if (!shop) throw new Error("Missing shop domain for Shopify connection");
    return connectShopify(shop, workspaceId);
  },
};
