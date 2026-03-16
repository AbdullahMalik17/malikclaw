import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Simple content generator for docs pages
function getDocContent(slug: string[]): { title: string; content: React.ReactNode } | null {
  if (slug.length === 2 && slug[0] === "installation") {
    // These are handled by dedicated pages
    return null;
  }

  return {
    title: slug.join(" ").replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    content: (
      <div className="text-center py-12">
        <p className="text-zinc-400 mb-4">This documentation page is under construction.</p>
        <Link 
          href="/docs"
          className="inline-flex items-center gap-2 text-[#0df2c9] hover:text-white transition-colors font-medium"
        >
          Back to Documentation <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    ),
  };
}

export default async function DocPage({ params }: { params: { slug: string[] } }) {
  const { slug } = await params;
  const docContent = getDocContent(slug);

  if (!docContent) {
    notFound();
  }

  return (
    <div className="prose prose-invert max-w-none prose-pre:bg-[#121214] prose-pre:border prose-pre:border-white/5 prose-a:text-[#0df2c9] prose-headings:text-white prose-code:text-[#0df2c9] prose-code:bg-[#0df2c9]/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">{docContent.title}</h1>
      {docContent.content}
    </div>
  );
}
