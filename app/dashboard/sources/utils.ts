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

type ConnectArgs = { shop?: string; apiKey?: string };

type ConnectionHandler = (args: ConnectArgs) => Promise<string>;

export const connectionHandlers: Record<IntegrationType, ConnectionHandler> = {
  google_analytics: async () => connectGA(),
  google_ads: async ({}) => connectGAds(),
  facebook_ads: async ({}) => connectFacebookAds(),
  quick_books: async ({}) => connectQuickbooks(),
  salesforce: async ({}) => connectSalesforce(),
  mailchimp: async ({}) => connectMailchimp(),
  hubspot: async ({}) => connectHubspot(),
  shopify: async ({ shop }) => {
    if (!shop) throw new Error("Missing shop domain for Shopify connection");
    return connectShopify(shop);
  },
  stripe: async ({ apiKey }) => {
    if (!apiKey) throw new Error("Missing API key for Stripe connection");
    return connectStripe(apiKey);
  },
};
