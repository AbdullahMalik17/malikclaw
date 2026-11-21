export type Language = 'en' | 'ur' | 'fr' | 'ja' | 'pt' | 'vi';

export interface BenchmarkRowTranslation {
  criterion: string;
  category: string;
  malikclaw: string;
  malikclawSub?: string;
  openclaw: string;
  cloudGateways: string;
}

export interface Translation {
  nav: {
    era: string;
    features: string;
    benchmarks: string;
    download: string;
    docs: string;
    star: string;
    quickInstall: string;
    starOnGitHub: string;
    launchMalikClaw: string;
    exploreSource: string;
    setupGuide: string;
  };
  hero: {
    badgeVersion: string;
    badgeEveryday: string;
    tagline: string;
    title: string;
    titlePart1: string;
    titlePart2: string;
    subtitle: string;
    specs: string;
    stats: Array<{
      value: string;
      label: string;
      sublabel: string;
    }>;
  };
  quickInstall: {
    title: string;
    copy: string;
    copied: string;
    footerMeta: string;
    autoDetect: string;
    badges: {
      curl: string;
      irm: string;
      docker: string;
      termux: string;
      go: string;
    };
  };
  terminal: {
    comment: string;
    command1: string;
    command2: string;
    booting: string;
    ready: string;
    memory: string;
    slogan: string;
    liveBadge: string;
    executing: string;
    sandboxActive: string;
    tabAutonomous: string;
    tabAdb: string;
    tabUrdu: string;
  };
  features: {
    badge: string;
    title: string;
    subtitle: string;
    lessRamBadge: string;
    hwEfficiency: string;
    sbcLabel: string;
    urduFirst: string;
    urduFirstDesc: string;
    regionalBadge: string;
    urduEngineSub: string;
    memory: string;
    memoryDesc: string;
    boot: string;
    bootDesc: string;
    android: string;
    androidDesc: string;
    adbMeta: string;
    connected: string;
  };
  architectureFlow: {
    eyebrow: string;
    title: string;
    phase: string;
    stepPrefix: string;
    inspectorSuffix: string;
    footerLeft: string;
    footerRight: string;
    steps: {
      plan: { name: string; desc: string; meta: string };
      act: { name: string; desc: string; meta: string };
      observe: { name: string; desc: string; meta: string };
      reflect: { name: string; desc: string; meta: string };
    };
  };
  comparison: {
    badge: string;
    title: string;
    subtitle: string;
    criterionHeader: string;
    openclawHeader: string;
    cloudHeader: string;
    malikclawHeader: string;
    footerAudit: string;
    footerLicense: string;
    metric: string;
    language: string;
    ram: string;
    startup: string;
    cost: string;
    typescript: string;
    go: string;
    ram1GB: string;
    ram10MB: string;
    startup500s: string;
    startup1s: string;
    costMac: string;
    costSBC: string;
    rows: BenchmarkRowTranslation[];
  };
  enterpriseSafety: {
    badge: string;
    title: string;
    subtitle: string;
    hardwareEnforced: string;
    details: string;
    auditTitle: string;
    auditDesc: string;
    readArch: string;
    cards: Array<{
      title: string;
      description: string;
      tag: string;
    }>;
  };
  download: {
    badge: string;
    title: string;
    subtitle: string;
    githubStars: string;
    latestRelease: string;
    containerTag: string;
    windows: string;
    windowsDesc: string;
    downloadExe: string;
    linux: string;
    linuxDesc: string;
    downloadBinary: string;
    android: string;
    androidDesc: string;
    docker: string;
    dockerDesc: string;
  };
  showcase: {
    hardwareBadge: string;
    title: string;
    subtitle: string;
    verified: string;
    skillsetBadge: string;
    capabilitiesTitle: string;
    capabilitiesSubtitle: string;
    licheePi: string;
    licheePiDesc: string;
    raspberryPi: string;
    raspberryPiDesc: string;
    termux: string;
    termuxDesc: string;
    capabilities: Array<{
      title: string;
      desc: string;
    }>;
  };
  integrations: {
    badge: string;
    title: string;
    subtitle: string;
    customMcp: string;
    whatsapp: string;
    gmail: string;
    odoo: string;
    discord: string;
    slack: string;
    telegram: string;
    twitter: string;
    linkedin: string;
    tiktok: string;
    reddit: string;
    more: string;
  };
  socialProof: {
    heading: string;
    ctaTitle: string;
    ctaSubtitle: string;
  };
  footer: {
    ctaBadge: string;
    ctaTitle: string;
    ctaSubtitle: string;
    quickInstall: string;
    exploreDocs: string;
    brandBio: string;
    resourcesTitle: string;
    communityTitle: string;
    integrityTitle: string;
    integrityDesc: string;
    goEngine: string;
    docLink: string;
    quickStartLink: string;
    archLink: string;
    trustLink: string;
    downloadLink: string;
    githubRepo: string;
    discussions: string;
    mcpMarket: string;
    a2as: string;
    builtWith: string;
    copyright: string;
  };
  langSwitcher: {
    en: string;
    ur: string;
    fr: string;
    ja: string;
    pt: string;
    vi: string;
  };
}

const enBase: Translation = {
  nav: {
    era: "v2.0 Era",
    features: "Features",
    benchmarks: "Benchmarks",
    download: "Download",
    docs: "Docs",
    star: "Star",
    quickInstall: "Quick Install",
    starOnGitHub: "Star on GitHub",
    launchMalikClaw: "Launch MalikClaw",
    exploreSource: "Explore Source",
    setupGuide: "Setup Guide",
  },
  hero: {
    badgeVersion: "v2.0.0 • Agentic Era 2026",
    badgeEveryday: "Everyday Edge AI • EN & اردو",
    tagline: "Autonomous Agent Infrastructure",
    title: "Empower Every Device with Intelligence.",
    titlePart1: "Empower Every Device",
    titlePart2: "with Intelligence.",
    subtitle:
      "Run autonomous AI for everyday life on any laptop, $10 SBC, or Android phone in English or Urdu. Pure Go (<10MB RAM), Smart Cost Router, SSRF + Prompt Guard, and universal SKILL.md + MCP.",
    specs: "< 10MB RAM · < 1s Cold Start · SSRF + Prompt Guard.",
    stats: [
      {
        value: "< 10MB",
        label: "RAM Footprint",
        sublabel: "8.4 MB idle RSS • Pure Go",
      },
      {
        value: "< 1s",
        label: "Cold Start Boot",
        sublabel: "SSRF + Prompt Guard active",
      },
      {
        value: "Ollama → AI",
        label: "Smart Cost Router",
        sublabel: "Local-first to frontier LLMs",
      },
      {
        value: "MCP + SKILL.md",
        label: "Universal Edge",
        sublabel: "Laptop, $10 SBC & Android",
      },
    ],
  },
  quickInstall: {
    title: "Quick Install",
    copy: "Copy",
    copied: "Copied!",
    footerMeta: "Zero dependencies • <10MB RAM • ~12MB Go binary • ed25519 signed",
    autoDetect: "Auto-detects architecture",
    badges: {
      curl: "Recommended",
      irm: "PowerShell",
      docker: "Containerized",
      termux: "Edge / ARM",
      go: "Source Native",
    },
  },
  terminal: {
    comment: "# Initialize the Gryphon engine",
    command1: "curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash",
    command2: "malikclaw agent",
    booting: "[SYSTEM] Booting MalikClaw v2.0.0...",
    ready: "✓ Gryphon Engine Ready in 0.82s",
    memory: "✓ Memory Footprint: 8.4MB",
    slogan: '"آگے بڑھو، ملک کلاؤ!"',
    liveBadge: "LIVE AGENT SIMULATOR",
    executing: "Agent executing next node...",
    sandboxActive: "Zero-Trust Sandbox Active",
    tabAutonomous: "Autonomous",
    tabAdb: "Android ADB",
    tabUrdu: "Urdu Loop",
  },
  features: {
    badge: "FEATURES BENTO 2.0",
    title: "Built for Extreme Performance",
    subtitle: "From <10MB edge devices to enterprise AI clusters. Zero compromises with pure Go efficiency.",
    lessRamBadge: "99% LESS RAM",
    hwEfficiency: "Hardware Efficiency",
    sbcLabel: "Runs on $10 RISC-V SBC",
    urduFirst: "Urdu-First Strategy",
    urduFirstDesc: "Native RTL interface parsing, Urdu prompt understanding, and bilingual onboarding for everyday and developer workflows.",
    regionalBadge: "REGIONAL AI • اردو",
    urduEngineSub: "Bilingual Edge Intelligence Engine",
    memory: "8.4MB Memory Footprint",
    memoryDesc: "Unlike Python and Node.js AI frameworks that demand >1.2GB RAM, MalikClaw is compiled to a lean, standalone Go binary.",
    boot: "1s Cold Start",
    bootDesc: "Instant-on architecture. No waiting for heavy runtimes or virtual machines.",
    android: "Android Remote & ADB Automation",
    androidDesc: "Automate taps, inspect UI elements with real-time OCR matrices, and orchestrate headless tasks across mobile devices and Termux.",
    adbMeta: "Native ADB Daemon • Minicap Streaming • OCR Matrix Diffing",
    connected: "CONNECTED",
  },
  architectureFlow: {
    eyebrow: "Autonomous Loop Visualizer",
    title: "Deterministic 4-Step Agent Pipeline",
    phase: "Phase:",
    stepPrefix: "STEP",
    inspectorSuffix: "Payload Inspector",
    footerLeft: "Zero Runtime Latency Overhead • Pure Go Concurrency",
    footerRight: "100% Deterministic Execution",
    steps: {
      plan: {
        name: "PLAN",
        desc: "Deconstruct goal into executable tool DAGs",
        meta: "Complexity: O(V+E) • DAG Verified • Latency: 12ms",
      },
      act: {
        name: "ACT",
        desc: "Dispatch Go routines & execute OS shell commands",
        meta: "Engine: Go 1.25+ Native • Heap Alloc: 8.4MB • Zero VM Overhead",
      },
      observe: {
        name: "OBSERVE",
        desc: "Stream stdout, inspect state & evaluate exit code",
        meta: "Telemetry: Real-time Stream • Checksum Match: Valid",
      },
      reflect: {
        name: "REFLECT",
        desc: "Evaluate objective completion & update episodic memory",
        meta: "Vector Store: Local SQLite • Memory Retention: Permanent",
      },
    },
  },
  comparison: {
    badge: "COMPETITIVE BENCHMARKS",
    title: "The Edge Hardware Champion",
    subtitle: "See how MalikClaw's pure Go engine outperforms traditional heavy AI gateways across cost, latency, security, and footprint.",
    criterionHeader: "Criterion",
    openclawHeader: "OpenClaw",
    cloudHeader: "Cloud Gateways",
    malikclawHeader: "MalikClaw",
    footerAudit: "Audited on ARM64 Linux, Raspberry Pi Zero 2W, and RISC-V LicheePi.",
    footerLicense: "100% Open Source (MIT)",
    metric: "Metric",
    language: "Language",
    ram: "RAM Usage",
    startup: "Startup Time",
    cost: "Hardware Cost",
    typescript: "TypeScript",
    go: "Go (Native)",
    ram1GB: "> 1GB",
    ram10MB: "< 10MB",
    startup500s: "> 500s",
    startup1s: "< 1s",
    costMac: "Mac Mini (~$599)",
    costSBC: "Any SBC (~$10)",
    rows: [
      {
        criterion: "Runtime & Compilation",
        category: "Architecture",
        malikclaw: "Go 1.25+ Native Binary",
        malikclawSub: "Single zero-dependency binary",
        openclaw: "Node.js / TypeScript Runtime",
        cloudGateways: "Python / Hosted Cloud Container",
      },
      {
        criterion: "RAM Footprint",
        category: "Efficiency",
        malikclaw: "<10MB (8.4 MB idle RSS)",
        malikclawSub: "99% memory savings",
        openclaw: "> 1.2 GB",
        cloudGateways: "2.0 GB - 4.0 GB",
      },
      {
        criterion: "Startup Latency",
        category: "Speed",
        malikclaw: "< 1s Cold Boot",
        malikclawSub: "Instant execution",
        openclaw: "> 500s (Node/Python boot)",
        cloudGateways: "5s - 30s (Cold lambda/VM)",
      },
      {
        criterion: "Smart Cost Router",
        category: "Routing",
        malikclaw: "Local Ollama → Frontier Auto-Routing",
        malikclawSub: "TierFast / Balanced / Reasoning + 429 fallback",
        openclaw: "Single static model",
        cloudGateways: "Manual config / cloud lock-in",
      },
      {
        criterion: "Minimum Hardware Cost",
        category: "Economics",
        malikclaw: "Laptop / $10 SBC / Old Phone",
        malikclawSub: "RISC-V, ARM64 & Termux ready",
        openclaw: "$599 (Mac Mini recommended)",
        cloudGateways: "$50+ / month SaaS bill",
      },
      {
        criterion: "Native Edge & Android Support",
        category: "Portability",
        malikclaw: "Native (ARM, RISC-V, Termux, ADB)",
        malikclawSub: "Built-in hardware hooks",
        openclaw: "Limited (x86_64 Linux)",
        cloudGateways: "None (Webhook proxy only)",
      },
      {
        criterion: "Security & Privacy Model",
        category: "Trust",
        malikclaw: "SSRF Firewall + Prompt Guard + ed25519 Sandbox",
        malikclawSub: "Defense-in-depth local sovereignty",
        openclaw: "Basic in-memory execution",
        cloudGateways: "Multi-tenant cloud logs",
      },
    ],
  },
  enterpriseSafety: {
    badge: "ZERO-TRUST GUARDRAILS",
    title: "Zero-Trust Security & Enterprise Guardrails",
    subtitle: "Designed from the ground up for strict enterprise isolation, deterministic control, and verified cryptographic auditability.",
    hardwareEnforced: "Hardware Enforced",
    details: "Details",
    auditTitle: "Immutable Audit Logging Engine",
    auditDesc: "Every tool parameter, timestamp, and signature hash recorded to local SQLite ledger.",
    readArch: "Read Security Architecture",
    cards: [
      {
        title: "Cryptographic Action Signing",
        description: "Every tool invocation and privileged OS call is cryptographically signed using local ed25519 keypairs. Untrusted payloads are rejected at runtime.",
        tag: "ED25519 VERIFIED",
      },
      {
        title: "Human-in-the-Loop Approval Gates",
        description: "Unlike reckless autonomous agents, MalikClaw pauses and dispatches approval webhooks (Telegram, CLI, or Slack) before executing financial, ERP, or destructive shell operations.",
        tag: "APPROVAL GATES",
      },
      {
        title: "SSRF Firewall & Prompt-Injection Guard",
        description: "Defense-in-depth v2.0.0 isolation blocks private-IP SSRF probes, structurally fences untrusted inputs against prompt injection, and keeps all embeddings and memories local.",
        tag: "DEFENSE-IN-DEPTH",
      },
    ],
  },
  download: {
    badge: "BINARY DISTRIBUTIONS",
    title: "Deploy the Gryphon",
    subtitle: "Lightweight binaries for every architecture.",
    githubStars: "GitHub Stars:",
    latestRelease: "Latest Release:",
    containerTag: "Container Image",
    windows: "Windows",
    windowsDesc: "Windows 10/11 (x64 / ARM64)",
    downloadExe: "Download .ZIP",
    linux: "Linux (SBC)",
    linuxDesc: "ARM64, x64, RISC-V",
    downloadBinary: "Download Binary",
    android: "Android",
    androidDesc: "Termux (ARM64)",
    docker: "Docker",
    dockerDesc: "Official GHCR Image",
  },
  showcase: {
    hardwareBadge: "PROVEN HARDWARE DEPLOYMENTS",
    title: "Powered by MalikClaw",
    subtitle: "Real-world deployments on edge hardware.",
    verified: "Verified in production",
    skillsetBadge: "AUTONOMOUS SKILLSET",
    capabilitiesTitle: "Agent Core Capabilities",
    capabilitiesSubtitle: "Automated execution, localized code synthesis, deep research, and long-term memory.",
    licheePi: "LicheePi Nano RISC-V",
    licheePiDesc: "$10 RISC-V edge board running MalikClaw with 32MB RAM effortlessly.",
    raspberryPi: "Raspberry Pi Zero 2 W",
    raspberryPiDesc: "Autonomous local smart-home agent running 24/7 on $15 low-power ARM64 board.",
    termux: "Android Phone & Termux",
    termuxDesc: "Transform discarded Android phones into high-performance autonomous edge assistants.",
    capabilities: [
      {
        title: "Autonomous Code Synthesis",
        desc: "Write, compile, and debug scripts with sub-second feedback loops.",
      },
      {
        title: "Deterministic Task Scheduling",
        desc: "Automate crons, event-triggered routines, and multi-step background workflows.",
      },
      {
        title: "Deep Web & System Research",
        desc: "Extract clean markdown, filter noise, and generate structured summaries.",
      },
      {
        title: "Contextual Episodic Memory",
        desc: "Retain contextual state across reboots in an encrypted local vector database.",
      },
    ],
  },
  integrations: {
    badge: "EXTENSIBLE MCP & APIS",
    title: "Seamless Integrations",
    subtitle: "Connect MalikClaw with your favorite tools and platforms.",
    customMcp: "Custom MCP Skills",
    whatsapp: "WhatsApp",
    gmail: "Gmail",
    odoo: "Odoo",
    discord: "Discord",
    slack: "Slack",
    telegram: "Telegram",
    twitter: "Twitter / X",
    linkedin: "LinkedIn",
    tiktok: "TikTok",
    reddit: "Reddit",
    more: "& more",
  },
  socialProof: {
    heading: "Trusted by Developers Worldwide",
    ctaTitle: "Be the first to share your edge AI deployment!",
    ctaSubtitle: "Join the discussion and share your MalikClaw setup on GitHub Discussions",
  },
  footer: {
    ctaBadge: "START BUILDING IN SECONDS",
    ctaTitle: "Deploy MalikClaw on your Laptop, Raspberry Pi, or Server in 60 seconds.",
    ctaSubtitle: "Experience the power of a Go-native autonomous agent running with <10MB RAM on local hardware.",
    quickInstall: "Quick Install",
    exploreDocs: "Explore Documentation",
    brandBio: "The ultra-lightweight autonomous AI agent engine built in pure Go for high-performance servers down to $10 edge SBCs.",
    resourcesTitle: "Resources",
    communityTitle: "Community",
    integrityTitle: "Integrity",
    integrityDesc: "Zero-Trust local sandboxing, ed25519 signing, and MIT open source licensing.",
    goEngine: "Go 1.25+ Native Engine",
    docLink: "Documentation",
    quickStartLink: "Quick Start",
    archLink: "Architecture Flow",
    trustLink: "Security & Trust",
    downloadLink: "Binary Downloads",
    githubRepo: "GitHub Repository",
    discussions: "Discussions",
    mcpMarket: "MCP Market Listing",
    a2as: "A2AS Certified",
    builtWith: "Crafted with Go, Next.js &",
    copyright: "© 2026 Muhammad Abdullah Athar. All rights reserved. 🦅 Swift. Strong. Secure.",
  },
  langSwitcher: {
    en: "English",
    ur: "اردو",
    fr: "Français",
    ja: "日本語",
    pt: "Português",
    vi: "Tiếng Việt",
  },
};

const urBase: Translation = {
  nav: {
    era: "v2.0 دور",
    features: "خصوصیات",
    benchmarks: "موازنہ",
    download: "ڈاؤن لوڈ",
    docs: "دستاویزات",
    star: "ستارہ",
    quickInstall: "فوری انسٹال",
    starOnGitHub: "GitHub پر ستارہ",
    launchMalikClaw: "شروع کریں",
    exploreSource: "سورس کوڈ",
    setupGuide: "سیٹ اپ گائیڈ",
  },
  hero: {
    badgeVersion: "v2.0.0 • ایجنٹک ایرا 2026",
    badgeEveryday: "روزمرہ ایج اے آئی • اردو اور English",
    tagline: "عقاب جیسی تیزی، شیر جیسی طاقت۔",
    title: "ہر ڈیوائس کو دیں ذہانت کی طاقت۔",
    titlePart1: "ہر ڈیوائس کو دیں",
    titlePart2: "ذہانت کی طاقت۔",
    subtitle:
      "کسی بھی لیپ ٹاپ، $10 کے بورڈ یا اینڈرائیڈ فون پر انگریزی یا اردو میں روزمرہ کے کام خودکار بنائیں۔ خالص Go (<10MB RAM)، اسمارٹ کاسٹ روٹر، SSRF + پرامپٹ گارڈ، اور یونیورسل SKILL.md + MCP۔",
    specs: "<10MB RAM · 1s Boot · SSRF + Prompt Guard",
    stats: [
      {
        value: "< 10MB",
        label: "میموری کا استعمال",
        sublabel: "8.4 MB آئیڈل • خالص Go",
      },
      {
        value: "< 1s",
        label: "فوری اسٹارٹ اپ",
        sublabel: "SSRF + پرامپٹ گارڈ فعال",
      },
      {
        value: "Ollama → AI",
        label: "اسمارٹ کاسٹ روٹر",
        sublabel: "لوکل اولاما سے فرنٹیئر ماڈلز",
      },
      {
        value: "MCP + SKILL.md",
        label: "یونیورسل ایج",
        sublabel: "لیپ ٹاپ، $10 بورڈ اور اینڈرائیڈ",
      },
    ],
  },
  quickInstall: {
    title: "فوری انسٹال",
    copy: "کاپی",
    copied: "کاپی ہو گیا!",
    footerMeta: "زیرو ڈیپینڈنسیز • <10MB RAM • ~12MB Go بائنری • ed25519 دستخط شدہ",
    autoDetect: "خودکار آرکیٹیکچر کی شناخت",
    badges: {
      curl: "تجویز کردہ",
      irm: "پاور شیل",
      docker: "کنٹینر",
      termux: "ایج / ARM",
      go: "سورس نیٹو",
    },
  },
  terminal: {
    comment: "# Gryphon انجن کو شروع کریں",
    command1: "curl -fsSL https://raw.githubusercontent.com/AbdullahMalik17/malikclaw/main/install.sh | bash",
    command2: "malikclaw agent",
    booting: "[SYSTEM] MalikClaw v2.0.0 شروع ہو رہا ہے...",
    ready: "✓ Gryphon انجن 0.82s میں تیار",
    memory: "✓ میموری فٹ پرنٹ: 8.4MB",
    slogan: '"آگے بڑھو، ملک کلاؤ!"',
    liveBadge: "لائیو ایجنٹ سمیلیٹر",
    executing: "ایجنٹ اگلا مرحلہ چلا رہا ہے...",
    sandboxActive: "زیرو ٹرسٹ سینڈ باکس فعال",
    tabAutonomous: "خودکار",
    tabAdb: "اینڈرائیڈ ADB",
    tabUrdu: "اردو لوپ",
  },
  features: {
    badge: "فیچرز بینٹو 2.0",
    title: "بہترین کارکردگی کے لیے تیار",
    subtitle: "<10MB ایج ڈیوائسز سے لے کر انٹرپرائز کلسٹرز تک۔ خالص Go کی طاقت کے ساتھ کوئی سمجھوتہ نہیں۔",
    lessRamBadge: "99% کم ریم",
    hwEfficiency: "ہارڈ ویئر کی بچت",
    sbcLabel: "$10 RISC-V بورڈ پر چلتا ہے",
    urduFirst: "اردو فرسٹ حکمت عملی",
    urduFirstDesc: "مقامی RTL سپورٹ، اردو فہم اور دو لسانی آن بورڈنگ، روزمرہ صارفین اور ڈویلپرز دونوں کے لیے۔",
    regionalBadge: "علاقائی AI • اردو",
    urduEngineSub: "دو لسانی ایج انٹیلی جنس انجن",
    memory: "8.4MB میموری فٹ پرنٹ",
    memoryDesc: "پائیتھون اور Node.js فریم ورکس کے برعکس جو >1.2GB RAM مانگتے ہیں، ملک کلاؤ ایک ہلکی پھلکی Go بائنری ہے۔",
    boot: "1 سیکنڈ اسٹارٹ",
    bootDesc: "فوری اسٹارٹ اپ آرکیٹیکچر۔ بھاری رن ٹائمز کا کوئی انتظار نہیں۔",
    android: "اینڈرائیڈ ریموٹ اور ADB آٹومیشن",
    androidDesc: "لائیو OCR اور ADB کے ذریعے اینڈرائیڈ فونز اور Termux پر خودکار کام انجام دیں۔",
    adbMeta: "نیٹو ADB ڈیمن • منی کیپ اسٹریمنگ • OCR میٹرکس",
    connected: "منسلک",
  },
  architectureFlow: {
    eyebrow: "خودکار لوپ ویژولائزر",
    title: "4 مرحلوں پر مشتمل ایجنٹ پائپ لائن",
    phase: "مرحلہ:",
    stepPrefix: "مرحلہ",
    inspectorSuffix: "پے لوڈ انسپیکٹر",
    footerLeft: "زیرو لیٹنسی اوورہیڈ • خالص Go کنکرنسی",
    footerRight: "100% یقینی ایگزیکیوشن",
    steps: {
      plan: {
        name: "منصوبہ (PLAN)",
        desc: "ہدف کو قابلِ عمل ٹول DAG میں تقسیم کریں",
        meta: "پیچیدگی: O(V+E) • DAG تصدیق شدہ • لیٹنسی: 12ms",
      },
      act: {
        name: "عمل (ACT)",
        desc: "Go روٹینز اور OS کمانڈز چلائیں",
        meta: "انجن: Go 1.25+ نیٹو • ہیپ: 8.4MB • زیرو VM بوجھ",
      },
      observe: {
        name: "مشاہدہ (OBSERVE)",
        desc: "آؤٹ پٹ، اسٹیٹ اور ایگزٹ کوڈ کا جائزہ لیں",
        meta: "ٹیلی میٹری: لائیو اسٹریم • چیک سم: درست",
      },
      reflect: {
        name: "غور (REFLECT)",
        desc: "تکمیل کا جائزہ لیں اور مقامی میموری اپڈیٹ کریں",
        meta: "ویکٹر اسٹور: مقامی SQLite • مستقل میموری",
      },
    },
  },
  comparison: {
    badge: "تقابلی کارکردگی",
    title: "ایمرجنگ ہارڈ ویئر کا چیمپئن",
    subtitle: "دیکھیں کیسے ملک کلاؤ کا خالص Go انجن لاگت، رفتار، سیکیورٹی اور میموری میں روایتی گیٹ ویز سے آگے ہے۔",
    criterionHeader: "معیار",
    openclawHeader: "OpenClaw",
    cloudHeader: "کلاؤڈ گیٹ ویز",
    malikclawHeader: "MalikClaw",
    footerAudit: "ARM64 لینکس، Raspberry Pi Zero 2W اور RISC-V LicheePi پر آڈٹ شدہ۔",
    footerLicense: "100% اوپن سورس (MIT)",
    metric: "پیمائش",
    language: "زبان",
    ram: "میموری کا استعمال",
    startup: "اسٹارٹ اپ ٹائم",
    cost: "ہارڈ ویئر لاگت",
    typescript: "TypeScript",
    go: "Go (Native)",
    ram1GB: "> 1GB",
    ram10MB: "< 10MB",
    startup500s: "> 500s",
    startup1s: "< 1s",
    costMac: "Mac Mini (~$599)",
    costSBC: "کوئی بھی بورڈ (~$10)",
    rows: [
      {
        criterion: "رن ٹائم اور کمپائلیشن",
        category: "آرکیٹیکچر",
        malikclaw: "Go 1.25+ نیٹو بائنری",
        malikclawSub: "واحد زیرو ڈیپینڈنسی بائنری",
        openclaw: "Node.js / TypeScript رن ٹائم",
        cloudGateways: "Python / کلاؤڈ کنٹینر",
      },
      {
        criterion: "میموری فٹ پرنٹ (RAM)",
        category: "کارکردگی",
        malikclaw: "<10MB (8.4 MB آئیڈل RSS)",
        malikclawSub: "99% میموری کی بچت",
        openclaw: "> 1.2 GB",
        cloudGateways: "2.0 GB - 4.0 GB",
      },
      {
        criterion: "اسٹارٹ اپ لیٹنسی",
        category: "رفتار",
        malikclaw: "< 1s کولڈ بوٹ",
        malikclawSub: "فوری ایگزیکیوشن",
        openclaw: "> 500s (Node/Python بوٹ)",
        cloudGateways: "5s - 30s (کلاؤڈ VM)",
      },
      {
        criterion: "اسمارٹ کاسٹ روٹر",
        category: "روٹنگ",
        malikclaw: "لوکل Ollama → فرنٹیئر آٹو روٹنگ",
        malikclawSub: "TierFast / Balanced / Reasoning",
        openclaw: "واحد جامد ماڈل",
        cloudGateways: "دستی سیٹ اپ / کلاؤڈ لاک ان",
      },
      {
        criterion: "کم از کم ہارڈ ویئر لاگت",
        category: "معاشیات",
        malikclaw: "لیپ ٹاپ / $10 SBC / پرانا فون",
        malikclawSub: "RISC-V، ARM64 اور Termux تیار",
        openclaw: "$599 (Mac Mini تجویز کردہ)",
        cloudGateways: "$50+ ماہانہ SaaS بل",
      },
      {
        criterion: "نیٹو ایج اور اینڈرائیڈ سپورٹ",
        category: "پورٹ ایبلٹی",
        malikclaw: "نیٹو (ARM, RISC-V, Termux, ADB)",
        malikclawSub: "بلٹ ان ہارڈ ویئر ہکس",
        openclaw: "محدود (x86_64 لینکس)",
        cloudGateways: "کوئی نہیں (صرف ویب ہک)",
      },
      {
        criterion: "سیکیورٹی اور پرائیویسی ماڈل",
        category: "اعتماد",
        malikclaw: "SSRF فائر وال + پرامپٹ گارڈ + ed25519 سینڈ باکس",
        malikclawSub: "تہہ در تہہ مقامی تحفظ",
        openclaw: "بنیادی ان میموری ایگزیکیوشن",
        cloudGateways: "ملٹی ٹیننٹ کلاؤڈ لاگز",
      },
    ],
  },
  enterpriseSafety: {
    badge: "زیرو ٹرسٹ حفاظتی حصار",
    title: "زیرو ٹرسٹ سیکیورٹی اور انٹرپرائز گارڈ ریلز",
    subtitle: "سخت انٹرپرائز آئسولیشن، یقینی کنٹرول، اور کرپٹوگرافک آڈٹ کے لیے بنیاد سے تیار کردہ۔",
    hardwareEnforced: "ہارڈ ویئر سے نافذ",
    details: "تفصیلات",
    auditTitle: "ناقابلِ تبدیلی آڈٹ لاگنگ انجن",
    auditDesc: "ہر ٹول پیرامیٹر، ٹائم اسٹیمپ اور دستخط ہیش مقامی SQLite لیجر میں محفوظ ہوتا ہے۔",
    readArch: "سیکیورٹی آرکیٹیکچر پڑھیں",
    cards: [
      {
        title: "کرپٹوگرافک ایکشن سائننگ",
        description: "ہر ٹول کال اور حساس سسٹم کمانڈ مقامی ed25519 کیز سے سائن ہوتی ہے۔ غیر مصدقہ پے لوڈ فوری رد کر دیے جاتے ہیں۔",
        tag: "ED25519 تصدیق شدہ",
      },
      {
        title: "انسانی منظوری کے دروازے (HITL)",
        description: "مالی، ERP یا حساس کمانڈز چلانے سے پہلے ملک کلاؤ رک جاتا ہے اور ٹیلی گرام یا CLI کے ذریعے منظوری طلب کرتا ہے۔",
        tag: "منظوری گیٹس",
      },
      {
        title: "SSRF فائر وال اور پرامپٹ انجیکشن گارڈ",
        description: "v2.0.0 تہہ در تہہ تحفظ نجی نیٹ ورک SSRF حملوں اور پرامپٹ انجیکشن کو روکتا ہے اور تمام ڈیٹا مقامی رکھتا ہے۔",
        tag: "تہہ در تہہ تحفظ",
      },
    ],
  },
  download: {
    badge: "بائنری ڈاؤن لوڈز",
    title: "ملک کلاؤ کو انسٹال کریں",
    subtitle: "ہر فن تعمیر کے لیے ہلکی پھلکی بائنریز۔",
    githubStars: "GitHub ستارے:",
    latestRelease: "تازہ ترین ریلیز:",
    containerTag: "کنٹینر امیج",
    windows: "Windows",
    windowsDesc: "Windows 10/11 (x64 / ARM64)",
    downloadExe: "ڈاؤن لوڈ .ZIP",
    linux: "Linux (SBC)",
    linuxDesc: "ARM64, x64, RISC-V",
    downloadBinary: "بائنری حاصل کریں",
    android: "Android",
    androidDesc: "Termux (ARM64)",
    docker: "Docker",
    dockerDesc: "سرکاری GHCR امیج",
  },
  showcase: {
    hardwareBadge: "مصدقہ ہارڈ ویئر ڈپلائمنٹس",
    title: "MalikClaw کی طاقت سے",
    subtitle: "ایج ہارڈ ویئر پر حقیقی دنیا کی تعیناتی۔",
    verified: "پروڈکشن میں تصدیق شدہ",
    skillsetBadge: "خودکار مہارتیں",
    capabilitiesTitle: "ایجنٹ کی صلاحیتیں",
    capabilitiesSubtitle: "خودکار کام، کوڈ جنریشن، گہری تحقیق، اور میموری کا انتظام۔",
    licheePi: "LicheePi Nano RISC-V",
    licheePiDesc: "$10 RISC-V بورڈ جس پر 32MB RAM کے ساتھ MalikClaw آسانی سے چل رہا ہے",
    raspberryPi: "Raspberry Pi Zero 2 W",
    raspberryPiDesc: "$15 کے کم طاقت ARM64 بورڈ پر 24/7 مقامی اسمارٹ ہوم ایجنٹ",
    termux: "Android فون اور Termux",
    termuxDesc: "پرانے اینڈرائیڈ فونز کو طاقتور خودکار ایج اسسٹنٹ میں بدلیں",
    capabilities: [
      {
        title: "انٹیلیجنٹ کوڈنگ",
        desc: "کسی بھی زبان میں اعلیٰ معیار کا کوڈ لکھیں اور سیکنڈوں میں ڈیبگ کریں۔",
      },
      {
        title: "ٹاسک شیڈولنگ",
        desc: "اپنے روزمرہ کے کاموں، یاددہانیوں اور بیک گراؤنڈ روٹینز کو خودکار بنائیں۔",
      },
      {
        title: "ویب سرچ اور ریسرچ",
        desc: "انٹرنیٹ سے صاف معلومات تلاش کریں اور منظم خلاصہ تیار کریں۔",
      },
      {
        title: "طویل مدتی میموری",
        desc: "انکرپٹڈ مقامی ویکٹر ڈیٹا بیس میں آپ کی ترجیحات اور گفتگو محفوظ رہتی ہے۔",
      },
    ],
  },
  integrations: {
    badge: "MCP اور API انٹیگریشنز",
    title: "بہترین انٹیگریشنز",
    subtitle: "ملک کلاؤ کو اپنے پسندیدہ ٹولز اور پلیٹ فارمز سے جوڑیں۔",
    customMcp: "کسٹم MCP اسکلز",
    whatsapp: "واٹس ایپ",
    gmail: "جی میل",
    odoo: "اوڈو ERP",
    discord: "ڈسکارڈ",
    slack: "سلیک",
    telegram: "ٹیلی گرام",
    twitter: "ٹویٹر / X",
    linkedin: "لنکڈ ان",
    tiktok: "ٹک ٹاک",
    reddit: "ریڈٹ",
    more: "اور مزید",
  },
  socialProof: {
    heading: "دنیا بھر کے ڈویلپرز کا اعتماد",
    ctaTitle: "اپنا ایج AI سیٹ اپ شیئر کرنے والے پہلے فرد بنیں!",
    ctaSubtitle: "GitHub Discussions پر شامل ہوں اور اپنا ملک کلاؤ تجربہ شیئر کریں",
  },
  footer: {
    ctaBadge: "سیکنڈوں میں آغاز کریں",
    ctaTitle: "اپنے لیپ ٹاپ، Raspberry Pi یا سرور پر 60 سیکنڈ میں ملک کلاؤ چلائیں۔",
    ctaSubtitle: "مقامی ہارڈ ویئر پر <10MB RAM میں چلنے والے Go نیٹو خودکار ایجنٹ کی طاقت دیکھیں۔",
    quickInstall: "فوری انسٹال",
    exploreDocs: "دستاویزات دیکھیں",
    brandBio: "تیز سرورز سے لے کر $10 کے ایج بورڈز تک کے لیے خالص Go میں تیار کردہ الٹرا لائٹ ویٹ خودکار AI ایجنٹ۔",
    resourcesTitle: "وسائل",
    communityTitle: "کمیونٹی",
    integrityTitle: "اعتماد و معیار",
    integrityDesc: "زیرو ٹرسٹ لوکل سینڈ باکس، ed25519 سائننگ، اور MIT اوپن سورس لائسنس۔",
    goEngine: "Go 1.25+ نیٹو انجن",
    docLink: "دستاویزات",
    quickStartLink: "فوری شروعات",
    archLink: "آرکیٹیکچر فلو",
    trustLink: "سیکیورٹی اور ٹرسٹ",
    downloadLink: "بائنری ڈاؤن لوڈز",
    githubRepo: "GitHub ریپوزٹری",
    discussions: "مباحثے",
    mcpMarket: "MCP مارکیٹ لسٹنگ",
    a2as: "A2AS تصدیق شدہ",
    builtWith: "Go، Next.js اور",
    copyright: "© 2026 Muhammad Abdullah Athar. جملہ حقوق محفوظ ہیں۔ 🦅 تیز، مضبوط، محفوظ۔",
  },
  langSwitcher: {
    en: "English",
    ur: "اردو",
    fr: "Français",
    ja: "日本語",
    pt: "Português",
    vi: "Tiếng Việt",
  },
};

export const translations: Record<Language, Translation> = {
  en: enBase,
  ur: urBase,
  fr: {
    ...enBase,
    nav: {
      ...enBase.nav,
      features: "Fonctionnalités",
      download: "Télécharger",
      docs: "Documentation",
      starOnGitHub: "Star sur GitHub",
      launchMalikClaw: "Lancer MalikClaw",
      exploreSource: "Explorer le code",
      setupGuide: "Guide d'installation",
    },
    hero: {
      ...enBase.hero,
      tagline: "Rapide comme un aigle, fort comme un lion.",
      title: "Le Champion de l'Edge AI.",
      subtitle: "Infrastructure IA personnelle ultra-légère pour ordinateur portable, carte à 10$ ou téléphone Android.",
      specs: "<10MB RAM · 1s Démarrage · SSRF + Prompt Guard.",
    },
    terminal: {
      ...enBase.terminal,
      comment: "# Initialiser le moteur Gryphon",
      booting: "[SYSTÈME] Démarrage de MalikClaw v2.0.0...",
      ready: "✓ Moteur Gryphon prêt en 0.82s",
      memory: "✓ Empreinte mémoire: 8.4MB",
    },
    footer: {
      ...enBase.footer,
      builtWith: "Construit avec Go, Next.js et",
    },
  },
  ja: {
    ...enBase,
    nav: {
      ...enBase.nav,
      features: "機能",
      download: "ダウンロード",
      docs: "ドキュメント",
      starOnGitHub: "GitHub でスター",
      launchMalikClaw: "MalikClaw を開始",
      exploreSource: "ソースコード",
      setupGuide: "セットアップガイド",
    },
    hero: {
      ...enBase.hero,
      tagline: "鷲のように速く、獅子のように強い。",
      title: "エッジ AI チャンピオン。",
      subtitle: "ノートPC、$10 SBC、Androidスマホ向けの超軽量パーソナルAIインフラ。",
      specs: "<10MB RAM · 1秒起動 · SSRF + Prompt Guard",
    },
    terminal: {
      ...enBase.terminal,
      comment: "# Gryphon エンジンを初期化",
      booting: "[システム] MalikClaw v2.0.0 を起動中...",
      ready: "✓ Gryphon エンジン 0.82 秒で準備完了",
      memory: "✓ メモリフットプリント：8.4MB",
    },
  },
  pt: {
    ...enBase,
    nav: {
      ...enBase.nav,
      features: "Recursos",
      download: "Baixar",
      docs: "Documentação",
      starOnGitHub: "Estrela no GitHub",
      launchMalikClaw: "Iniciar MalikClaw",
      exploreSource: "Explorar código",
      setupGuide: "Guia de instalação",
    },
    hero: {
      ...enBase.hero,
      tagline: "Rápido como uma águia, forte como um leão.",
      title: "O Campeão de Edge AI.",
      subtitle: "Infraestrutura de IA pessoal ultra-leve para laptop, SBC de $10 ou celular Android.",
      specs: "<10MB RAM · 1s Inicialização · SSRF + Prompt Guard.",
    },
    terminal: {
      ...enBase.terminal,
      comment: "# Inicializar o motor Gryphon",
      booting: "[SISTEMA] Iniciando MalikClaw v2.0.0...",
      ready: "✓ Motor Gryphon pronto em 0.82s",
      memory: "✓ Pegada de memória: 8.4MB",
    },
  },
  vi: {
    ...enBase,
    nav: {
      ...enBase.nav,
      features: "Tính năng",
      download: "Tải xuống",
      docs: "Tài liệu",
      starOnGitHub: "Star trên GitHub",
      launchMalikClaw: "Khởi chạy MalikClaw",
      exploreSource: "Khám phá nguồn",
      setupGuide: "Hướng dẫn cài đặt",
    },
    hero: {
      ...enBase.hero,
      tagline: "Nhanh như đại bàng, mạnh như sư tử.",
      title: "Nhà vô địch Edge AI.",
      subtitle: "Cơ sở hạ tầng AI cá nhân siêu nhẹ cho laptop, SBC $10 hoặc điện thoại Android.",
      specs: "<10MB RAM · 1s Khởi động · SSRF + Prompt Guard.",
    },
    terminal: {
      ...enBase.terminal,
      comment: "# Khởi tạo động cơ Gryphon",
      booting: "[HỆ THỐNG] Đang khởi động MalikClaw v2.0.0...",
      ready: "✓ Động cơ Gryphon sẵn sàng trong 0.82s",
      memory: "✓ Dấu chân bộ nhớ: 8.4MB",
    },
  },
};
