import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://malikclaw.vercel.app";
  const lastModified = new Date();

  const routes: Array<{ path: string; changeFrequency: "weekly" | "monthly"; priority: number }> = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/download", changeFrequency: "weekly", priority: 0.9 },
    { path: "/trust", changeFrequency: "monthly", priority: 0.8 },
    { path: "/docs", changeFrequency: "weekly", priority: 0.9 },
    { path: "/docs/quick-start", changeFrequency: "weekly", priority: 0.85 },
    { path: "/docs/installation", changeFrequency: "weekly", priority: 0.85 },
    { path: "/docs/installation/windows", changeFrequency: "monthly", priority: 0.7 },
    { path: "/docs/installation/macos", changeFrequency: "monthly", priority: 0.7 },
    { path: "/docs/installation/linux", changeFrequency: "monthly", priority: 0.7 },
    { path: "/docs/installation/android", changeFrequency: "monthly", priority: 0.7 },
    { path: "/docs/installation/source", changeFrequency: "monthly", priority: 0.65 },
    { path: "/docs/deployment/docker", changeFrequency: "monthly", priority: 0.7 },
    { path: "/docs/mobile-operation", changeFrequency: "monthly", priority: 0.65 },
    { path: "/docs/architecture", changeFrequency: "monthly", priority: 0.7 },
    { path: "/docs/configuration", changeFrequency: "monthly", priority: 0.7 },
    { path: "/docs/providers", changeFrequency: "monthly", priority: 0.7 },
    { path: "/docs/security", changeFrequency: "monthly", priority: 0.75 },
    { path: "/docs/troubleshooting", changeFrequency: "monthly", priority: 0.6 },
    { path: "/docs/debug", changeFrequency: "monthly", priority: 0.6 },
    { path: "/docs/antigravity/auth", changeFrequency: "monthly", priority: 0.6 },
    { path: "/docs/antigravity/usage", changeFrequency: "monthly", priority: 0.6 },
    { path: "/docs/channels/whatsapp", changeFrequency: "monthly", priority: 0.65 },
    { path: "/docs/channels/telegram", changeFrequency: "monthly", priority: 0.65 },
    { path: "/docs/channels/discord", changeFrequency: "monthly", priority: 0.65 },
    { path: "/docs/channels/slack", changeFrequency: "monthly", priority: 0.65 },
    { path: "/docs/channels/feishu", changeFrequency: "monthly", priority: 0.65 },
    { path: "/docs/channels/dingtalk", changeFrequency: "monthly", priority: 0.65 },
    { path: "/docs/channels/matrix", changeFrequency: "monthly", priority: 0.65 },
    { path: "/docs/channels/line", changeFrequency: "monthly", priority: 0.65 },
    { path: "/docs/channels/qq", changeFrequency: "monthly", priority: 0.65 },
    { path: "/docs/channels/wecom", changeFrequency: "monthly", priority: 0.65 },
    { path: "/docs/channels/onebot", changeFrequency: "monthly", priority: 0.65 },
    { path: "/docs/channels/maixcam", changeFrequency: "monthly", priority: 0.65 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
