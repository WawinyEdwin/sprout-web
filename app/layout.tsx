import { Providers } from "@/utils/providers";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sprout AI",
  description: `The World's First AI-Native KPI Brain for SMBs`,
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={outfit.className}>
          <main>{children}</main>
          <Toaster richColors />
        </body>
      </Providers>
    </html>
  );
}
