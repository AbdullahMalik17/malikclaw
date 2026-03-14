import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function DocsPage() {
  // Use README.md as the introduction
  const readmePath = path.join(process.cwd(), "..", "README.md");
  const source = fs.readFileSync(readmePath, "utf8");
  
  // Basic content cleaning (remove badges and logo for the docs view)
  const cleanedSource = source
    .replace(/<div align="center">[\s\S]*?<\/div>/, "")
    .replace(/---/, "");

  return (
    <div className="prose prose-invert max-w-none prose-pre:bg-[#121214] prose-pre:border prose-pre:border-white/5 prose-a:text-[#0df2c9] prose-headings:text-white">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Introduction</h1>
      <MDXRemote source={cleanedSource} />
    </div>
  );
}
