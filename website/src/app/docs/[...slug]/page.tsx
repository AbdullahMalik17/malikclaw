import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import type { ComponentPropsWithoutRef } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Edit3 } from "lucide-react";

interface DocPageProps {
  params: Promise<{ slug: string[] }>;
}

const STATIC_MAPPING: Record<string, { file: string; title: string }> = {
  "quick-start": { file: "getting-started/hello-world.md", title: "Quick Start" },
  "configuration": { file: "tools_configuration.md", title: "Configuration" },
  "architecture": { file: "ARCHITECTURE.md", title: "Architecture" },
  "providers": { file: "PROVIDERS.md", title: "Providers & Models" },
  "security": { file: "SECURITY.md", title: "Security" },
  "troubleshooting": { file: "troubleshooting.md", title: "Troubleshooting" },
  "debug": { file: "debug.md", title: "Debug Guide" },
  "deployment/docker": { file: "deployment/docker.md", title: "Docker Deployment" },
  "installation/source": { file: "getting-started/installation.md", title: "Build from Source" },
  "mobile-operation": { file: "deployment/android-termux.md", title: "Android & Mobile Operation" },
  "antigravity/auth": { file: "ANTIGRAVITY_AUTH.md", title: "AntiGravity Auth" },
  "antigravity/usage": { file: "ANTIGRAVITY_USAGE.md", title: "AntiGravity Usage" },
};

export async function generateStaticParams() {
  return Object.keys(STATIC_MAPPING).map((slugPath) => ({
    slug: slugPath.split("/"),
  }));
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  const mapping: Record<string, { file: string; title: string }> = { ...STATIC_MAPPING };

  const docsDir = fs.existsSync(path.join(process.cwd(), "docs"))
    ? path.join(process.cwd(), "docs")
    : path.join(process.cwd(), "..", "docs");

  // Add channels to mapping dynamically with README.md -> README.ur.md fallback
  if (slug[0] === "channels" && slug.length === 2) {
    const channelId = slug[1];
    const candidates = [
      `channels/${channelId}/README.md`,
      `channels/${channelId}/README.ur.md`,
      `channels/${channelId}/${channelId}_app/README.ur.md`,
    ];
    const matched = candidates.find((rel) => fs.existsSync(path.join(docsDir, rel))) ?? candidates[0];
    mapping[slugPath] = {
      file: matched,
      title: channelId.charAt(0).toUpperCase() + channelId.slice(1) + " Channel",
    };
  }

  const doc = mapping[slugPath];
  if (!doc) {
    notFound();
  }

  const filePath = path.join(docsDir, doc.file);
  if (!fs.existsSync(filePath)) notFound();

  const content = fs.readFileSync(filePath, "utf-8");
  const githubUrl = `https://github.com/AbdullahMalik17/malikclaw/edit/main/docs/${doc.file}`;

  // Simple navigation logic over canonical static pages
  const allSlugs = Object.keys(STATIC_MAPPING);
  const currentIndex = allSlugs.indexOf(slugPath);
  const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex >= 0 && currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-text-muted mb-8 uppercase tracking-wider">
        <Link href="/docs" className="hover:text-teal-700 dark:hover:text-[#0df2c9] transition-colors">Docs</Link>
        <span>/</span>
        <span className="text-foreground">{doc.title}</span>
      </nav>

      <div className="prose prose-slate dark:prose-invert max-w-none
        prose-p:text-text-muted prose-p:leading-relaxed prose-p:text-[1.05rem]
        prose-ul:text-text-muted prose-li:marker:text-teal-700 dark:prose-li:marker:text-[#0df2c9]
        prose-hr:border-card-border
        prose-img:rounded-2xl prose-img:border prose-img:border-card-border prose-img:shadow-lg">

        <MDXRemote
          source={content}
          components={{
            h1: (props: ComponentPropsWithoutRef<"h1">) => (
              <h1 className="text-4xl md:text-5xl font-black mb-8 text-foreground tracking-tight" {...props} />
            ),
            h2: (props: ComponentPropsWithoutRef<"h2">) => (
              <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-6 flex items-center gap-3 text-foreground before:content-[''] before:block before:w-1.5 before:h-8 before:bg-gradient-to-b before:from-amber-500 before:to-cyan-500 before:rounded-full" {...props} />
            ),
            h3: (props: ComponentPropsWithoutRef<"h3">) => (
              <h3 className="text-xl font-bold mt-10 mb-4 text-foreground" {...props} />
            ),
            a: (props: ComponentPropsWithoutRef<"a">) => (
              <a className="text-teal-700 dark:text-[#0df2c9] hover:text-teal-900 dark:hover:text-white transition-colors underline decoration-current/30 underline-offset-4" {...props} />
            ),
            blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
              <blockquote className="border-s-4 border-purple-600 dark:border-[#8e2de2] bg-purple-500/10 p-6 rounded-e-2xl my-8 text-foreground/85 italic" {...props} />
            ),
            pre: (props: ComponentPropsWithoutRef<"pre">) => (
              <div className="relative group my-8">
                <pre className="relative bg-[#0B0C10] text-zinc-100 border border-zinc-800 rounded-xl p-6 overflow-x-auto shadow-xl" {...props} />
              </div>
            ),
            code: (props: ComponentPropsWithoutRef<"code">) => {
              if (props.className) {
                return <code className="font-mono text-sm text-zinc-100" {...props} />;
              }
              return (
                <code className="font-mono text-[0.9em] text-teal-800 dark:text-[#0df2c9] bg-teal-500/10 dark:bg-[#0df2c9]/10 px-1.5 py-0.5 rounded-md border border-teal-600/20 dark:border-[#0df2c9]/20" {...props} />
              );
            },
            table: (props: ComponentPropsWithoutRef<"table">) => (
              <div className="w-full overflow-x-auto my-10 rounded-2xl border border-card-border shadow-md">
                <table className="w-full text-start border-collapse bg-surface-1" {...props} />
              </div>
            ),
            th: (props: ComponentPropsWithoutRef<"th">) => (
              <th className="bg-surface-2 p-4 border-b border-card-border font-bold text-foreground whitespace-nowrap" {...props} />
            ),
            td: (props: ComponentPropsWithoutRef<"td">) => (
              <td className="p-4 border-b border-card-border text-text-muted" {...props} />
            ),
          }}
        />
      </div>

      {/* Suggest Edits */}
      <div className="mt-16 pt-8 border-t border-card-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-foreground transition-colors group"
        >
          <Edit3 className="w-4 h-4" aria-hidden="true" />
          Suggest edits for this page
        </a>
        <div className="text-sm text-text-muted">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
        {prevSlug ? (
          <Link href={`/docs/${prevSlug}`} className="p-6 rounded-2xl bg-card-bg border border-card-border hover:border-amber-500/40 transition-colors group text-start">
            <div className="text-xs text-text-muted mb-2 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3 rtl:rotate-180" aria-hidden="true" /> Previous
            </div>
            <div className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
              {mapping[prevSlug].title}
            </div>
          </Link>
        ) : <div />}

        {nextSlug && (
          <Link href={`/docs/${nextSlug}`} className="p-6 rounded-2xl bg-card-bg border border-card-border hover:border-amber-500/40 transition-colors group text-end">
            <div className="text-xs text-text-muted mb-2 flex items-center gap-1 justify-end">
              Next <ArrowRight className="w-3 h-3 rtl:rotate-180" aria-hidden="true" />
            </div>
            <div className="font-semibold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
              {mapping[nextSlug].title}
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
