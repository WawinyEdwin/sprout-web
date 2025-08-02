import { Providers } from "@/utils/providers";
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
        <body>
          <main>{children}</main>
          <Toaster richColors />
        </body>
      </Providers>
    </html>
  );
}
