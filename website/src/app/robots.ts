import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ["/", "/docs/", "/assets/"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/docs/", "/assets/"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "Twitterbot",
        allow: ["/", "/assets/"],
      },
      {
        userAgent: "facebookexternalhit",
        allow: ["/", "/assets/"],
      },
      {
        userAgent: "*",
        allow: ["/", "/docs/", "/assets/"],
        disallow: ["/api/", "/_next/", "/*.json$"],
      },
    ],
    sitemap: "https://malikclaw.vercel.app/sitemap.xml",
    host: "https://malikclaw.vercel.app",
  };
}
