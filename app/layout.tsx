import { Providers } from "@/utils/providers";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sprout AI",
  description: `The World's First AI-Native KPI Brain for SMBs`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={GeistSans.className}>
          <main className="bg-slate-60">{children}</main>
          <Toaster richColors />
        </body>
      </Providers>
    </html>
  );
}
