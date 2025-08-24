import { Providers } from "@/utils/providers";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sprout AI",
  description: `The World's First AI-Native KPI Brain for SMBs`,
  keywords:
    "Sprout isn't another dashboard. It's an AI strategist that understands your business, predicts KPI changes, explains root causes, and automatically recommends actions—turning your business data into proactive intelligence.",
  robots: "index, follow",
  openGraph: {
    title: "Sprout AI",
    description: `The World's First AI-Native KPI Brain for SMBs`,
    url: "https://sproutai.co",
    siteName: "Sprout AI",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <Providers>
        <body className={GeistSans.className}>
          <main className="bg-emerald-60">{children}</main>
          <Toaster richColors />
        </body>
      </Providers>
    </html>
  );
}
