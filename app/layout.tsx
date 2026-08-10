import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "./globals.css";
import "./polish.css";
import "./landing.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: { default: "GuideVexa — Free tools for clearer everyday decisions", template: "%s | GuideVexa" },
  description: siteConfig.description,
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#090b12",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Script id="guidevexa-data-layer" strategy="beforeInteractive">
          {"window.dataLayer=window.dataLayer||[];"}
        </Script>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
