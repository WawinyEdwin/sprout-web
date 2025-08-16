import { Providers } from "@/utils/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sprout AI",
  description: `The World's First AI-Native KPI Brain for SMBs`,
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <main className="bg-slate-60">{children}</main>
          <Toaster richColors />
        </body>
      </Providers>
    </html>
  );
}
