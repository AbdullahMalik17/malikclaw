import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ["/", "/docs/", "/assets/", "/llms.txt"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/docs/", "/assets/", "/llms.txt"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/docs/", "/llms.txt"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: ["/", "/docs/", "/llms.txt"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/docs/", "/llms.txt"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/docs/", "/llms.txt"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/", "/docs/", "/llms.txt"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: ["/", "/docs/", "/llms.txt"],
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
        allow: ["/", "/docs/", "/assets/", "/llms.txt"],
        disallow: ["/api/", "/_next/", "/*.json$"],
      },
    ],
    sitemap: "https://malikclaw.vercel.app/sitemap.xml",
    host: "https://malikclaw.vercel.app",
  };
}
