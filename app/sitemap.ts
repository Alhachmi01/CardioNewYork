import type { MetadataRoute } from "next";
import { guides, siteConfig, tools } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/tools", "/guides", "/about", "/privacy", "/terms"];

  return [
    ...staticRoutes.map(route => ({ url: `${siteConfig.url}${route}`, lastModified: new Date() })),
    ...tools.map(tool => ({ url: `${siteConfig.url}/tools/${tool.slug}`, lastModified: new Date() })),
    ...guides.map(guide => ({ url: `${siteConfig.url}/guides/${guide.slug}`, lastModified: new Date() })),
  ];
}
