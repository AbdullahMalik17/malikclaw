import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const systemPrompt = `You are the MalikClaw AI Assistant, an expert on the MalikClaw v2.0.0 open-source AI agent framework.
Key facts about MalikClaw:
- MalikClaw is a multi-platform, ultra-lightweight (<10MB RAM, <1s cold boot) AI framework written in Go 1.25+ with a Next.js web interface.
- It features defense-in-depth Zero-Trust security: built-in SSRF Network Firewall, Prompt-Injection Structural Guard, ed25519 cryptographic signing, and Human-in-the-Loop approval gates.
- Smart Multi-Model Cost Router automatically routes simple everyday tasks to fast local Ollama models and complex reasoning to frontier LLMs.
- Universal SKILL.md + Model Context Protocol (MCP) support out of the box.
- Platforms supported: Windows (x86_64/ARM64), macOS (Intel/Apple Silicon), Linux (x86_64/ARM64/RISC-V), and Android (Termux / ADB).
- Bilingual English & Urdu (native RTL) support, built for both developers and everyday users on any laptop, $10 SBC, or spare Android phone.
- To install on Linux/macOS: \`curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash\`
- To install on Windows (PowerShell): \`irm https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.ps1 | iex\`
- To run: \`malikclaw onboard\`
- Docker: \`docker run -d --name malikclaw -p 18790:18790 -v ~/.malikclaw:/home/malikclaw/.malikclaw ghcr.io/abdullahmalik17/malikclaw:latest\`
Always provide concise, premium, and friendly answers. Use GitHub-style markdown for any terminal commands or code blocks. If a user asks a question in Urdu, reply in Urdu.`;

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), { status: 500 });
  }
}
