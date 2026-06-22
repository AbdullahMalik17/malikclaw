import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Github, Edit3 } from "lucide-react";

interface DocPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  
  const mapping: Record<string, { file: string, title: string }> = {
    "quick-start": { file: "QUICK_START.md", title: "Quick Start" },
    "configuration": { file: "tools_configuration.md", title: "Configuration" },
    "architecture": { file: "ARCHITECTURE.md", title: "Architecture" },
    "providers": { file: "PROVIDERS.md", title: "Providers & Models" },
    "security": { file: "SECURITY.md", title: "Security" },
    "troubleshooting": { file: "troubleshooting.md", title: "Troubleshooting" },
    "debug": { file: "debug.md", title: "Debug Guide" },
    "antigravity/auth": { file: "ANTIGRAVITY_AUTH.md", title: "AntiGravity Auth" },
    "antigravity/usage": { file: "ANTIGRAVITY_USAGE.md", title: "AntiGravity Usage" },
  };

  // Add channels to mapping dynamically
  if (slug[0] === "channels" && slug.length === 2) {
    mapping[slugPath] = { 
        file: `channels/${slug[1]}/README.md`, 
        title: slug[1].charAt(0).toUpperCase() + slug[1].slice(1) + " Channel" 
    };
  }

  const doc = mapping[slugPath];
  if (!doc) {
    if (slug[0] === "installation") return null;
    notFound();
  }

  const filePath = path.join(process.cwd(), "..", "docs", doc.file);
  if (!fs.existsSync(filePath)) notFound();

  const content = fs.readFileSync(filePath, "utf-8");
  const githubUrl = `https://github.com/AbdullahMalik17/malikclaw/edit/main/docs/${doc.file}`;

  // Simple navigation logic
  const allSlugs = Object.keys(mapping);
  const currentIndex = allSlugs.indexOf(slugPath);
  const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-8 uppercase tracking-wider">
        <Link href="/docs" className="hover:text-[#0df2c9] transition-colors">Docs</Link>
        <span>/</span>
        <span className="text-zinc-300">{doc.title}</span>
      </nav>

      <div className="prose prose-invert max-w-none 
        prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-[1.05rem]
        prose-ul:text-zinc-400 prose-li:marker:text-[#0df2c9]
        prose-hr:border-white/5
        prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl">
        
        <MDXRemote 
          source={content} 
          components={{
            h1: (props: any) => <h1 className="text-4xl md:text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight" {...props} />,
            h2: (props: any) => <h2 className="text-2xl md:text-3xl font-bold mt-16 mb-6 flex items-center gap-3 text-white before:content-[''] before:block before:w-1.5 before:h-8 before:bg-gradient-to-b before:from-[#0df2c9] before:to-[#8e2de2] before:rounded-full" {...props} />,
            h3: (props: any) => <h3 className="text-xl font-bold mt-10 mb-4 text-zinc-200" {...props} />,
            a: (props: any) => <a className="text-[#0df2c9] hover:text-white hover:shadow-[0_2px_10px_rgba(13,242,201,0.5)] transition-all underline decoration-white/20 underline-offset-4" {...props} />,
            blockquote: (props: any) => <blockquote className="border-l-4 border-[#8e2de2] bg-gradient-to-r from-[#8e2de2]/10 to-transparent p-6 rounded-r-2xl my-8 text-zinc-300 italic" {...props} />,
            pre: (props: any) => <div className="relative group my-8"><div className="absolute -inset-1 bg-gradient-to-r from-[#0df2c9]/20 to-[#8e2de2]/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div><pre className="relative bg-[#050505] border border-white/10 rounded-xl p-6 overflow-x-auto shadow-2xl" {...props} /></div>,
            code: (props: any) => {
              if (props.className) {
                 return <code className="font-mono text-sm" {...props} />
              }
              return <code className="font-mono text-[0.9em] text-[#0df2c9] bg-[#0df2c9]/10 px-1.5 py-0.5 rounded-md border border-[#0df2c9]/20" {...props} />
            },
            table: (props: any) => <div className="w-full overflow-x-auto my-10 rounded-2xl border border-white/10 shadow-xl"><table className="w-full text-left border-collapse bg-[#0a0a0c]" {...props} /></div>,
            th: (props: any) => <th className="bg-white/5 p-4 border-b border-white/10 font-bold text-white whitespace-nowrap" {...props} />,
            td: (props: any) => <td className="p-4 border-b border-white/5 text-zinc-400" {...props} />,
          }}
        />
      </div>

      {/* Suggest Edits */}
      <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <a 
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors group"
        >
          <Edit3 className="w-4 h-4" />
          Suggest edits for this page
        </a>
        <div className="text-sm text-zinc-600">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
        {prevSlug ? (
          <Link href={`/docs/${prevSlug}`} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#0df2c9]/20 hover:bg-white/[0.04] transition-all group">
            <div className="text-xs text-zinc-500 mb-2 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Previous
            </div>
            <div className="font-semibold text-white group-hover:text-[#0df2c9] transition-colors">
              {mapping[prevSlug].title}
            </div>
          </Link>
        ) : <div />}

        {nextSlug && (
          <Link href={`/docs/${nextSlug}`} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#0df2c9]/20 hover:bg-white/[0.04] transition-all group text-right">
            <div className="text-xs text-zinc-500 mb-2 flex items-center gap-1 justify-end">
              Next <ArrowRight className="w-3 h-3" />
            </div>
            <div className="font-semibold text-white group-hover:text-[#0df2c9] transition-colors">
              {mapping[nextSlug].title}
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
