import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { TRPCReactProvider } from "@/trpc/client";

const DmSans = DM_Sans({
  subsets: ["latin"],
});
// changing the font to DM Sans

export const metadata: Metadata = {
  title: "funroad",
  description: "Multi-Tenant Ecommerce App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${DmSans.className} antialiased`}
      >
        <NuqsAdapter>
          <TRPCReactProvider>
            {children}
            <Toaster />
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html >
  );
}
