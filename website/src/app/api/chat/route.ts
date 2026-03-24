import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: any[] } = await req.json();

    const systemPrompt = `You are the MalikClaw AI Assistant, an expert on the MalikClaw open-source AI agent framework.
Key facts about MalikClaw:
- MalikClaw is a multi-platform, ultra-lightweight (<10MB RAM) AI framework written in Go and Next.js.
- It features a "Zero-Trust by Design" architecture, requiring explicit Cryptographic User Approval for sensitive tool uses (Human-in-the-Loop).
- Platforms supported: Windows (x86/ARM64), macOS (Intel/M-series), Linux (x86/ARM/RISC-V), and Android (via Termux proot).
- It is an Urdu-first framework, natively bilingual (English & Urdu), with deep integration supporting low-power edge devices and smartphones.
- To install on Linux/macOS: \`curl -sSfL https://malikclaw.io/install.sh | sh\`
- To install on Windows: download the ZIP release or use \`winget install malikclaw\`.
- To run: \`malikclaw onboard\`
- Docker: \`docker pull malikclaw/gateway\`
Always provide concise, premium, and friendly answers. Use GitHub-style markdown for any terminal commands or code blocks. If a user asks a question in Urdu, reply in Urdu.`;

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), { status: 500 });
  }
}
