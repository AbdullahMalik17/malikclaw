import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function DocPage({ params }: { params: { slug: string[] } }) {
  const { slug } = await params;
  
  // Try to find the file in docs/ directory
  // Example: /docs/architecture -> docs/ARCHITECTURE.md
  // Example: /docs/channels/whatsapp -> docs/channels/whatsapp/README.md
  
  let filePath = "";
  
  if (slug.length === 1) {
    // Top-level docs
    const possibleFiles = [
      path.join(process.cwd(), "..", "docs", `${slug[0].toUpperCase()}.md`),
      path.join(process.cwd(), "..", "docs", `${slug[0]}.md`),
      path.join(process.cwd(), "..", "docs", `${slug[0].replace(/-/g, "_").toUpperCase()}.md`),
    ];
    
    for (const p of possibleFiles) {
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    }
  } else if (slug[0] === "channels" && slug.length === 2) {
    // Channel-specific docs
    const channelName = slug[1];
    const p = path.join(process.cwd(), "..", "docs", "channels", channelName, "README.md");
    if (fs.existsSync(p)) {
      filePath = p;
    }
  }

  if (!filePath || !fs.existsSync(filePath)) {
    notFound();
  }

  const source = fs.readFileSync(filePath, "utf8");

  return (
    <div className="prose prose-invert max-w-none prose-pre:bg-[#121214] prose-pre:border prose-pre:border-white/5 prose-a:text-[#0df2c9] prose-headings:text-white prose-code:text-[#0df2c9] prose-code:bg-[#0df2c9]/10 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
      <MDXRemote source={source} />
    </div>
  );
}
