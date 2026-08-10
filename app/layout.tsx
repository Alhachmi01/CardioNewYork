import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";
import "./globals.css";
import "./polish.css";
import "./landing.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { siteConfig } from "@/lib/site";

const defaultTitle = "GuideVexa — Free tools for clearer everyday decisions";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: { default: defaultTitle, template: "%s | GuideVexa" },
  description: siteConfig.description,
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: defaultTitle,
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#090b12",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="p:domain_verify" content="eb99832d6143cd28bfe28ad82ad0d763" />
      </head>
      <body>
        <Script id="guidevexa-data-layer" strategy="beforeInteractive">
          {"window.dataLayer=window.dataLayer||[];"}
        </Script>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
