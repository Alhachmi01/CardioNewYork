import type { MetadataRoute } from "next";
import { guides, siteConfig, tools } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/tools", "/guides", "/about", "/contact", "/privacy", "/terms"];

  return [
    ...staticRoutes.map(route => ({ url: `${siteConfig.url}${route}` })),
    ...tools.map(tool => ({ url: `${siteConfig.url}/tools/${tool.slug}` })),
    ...guides.map(guide => ({ url: `${siteConfig.url}/guides/${guide.slug}` })),
  ];
}
