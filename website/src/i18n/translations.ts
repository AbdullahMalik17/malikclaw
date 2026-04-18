export type Language = 'en' | 'ur' | 'fr' | 'ja' | 'pt' | 'vi';

export interface Translation {
  nav: {
    features: string;
    download: string;
    docs: string;
    starOnGitHub: string;
    launchMalikClaw: string;
    exploreSource: string;
    setupGuide: string;
  };
  hero: {
    tagline: string;
    title: string;
    subtitle: string;
    specs: string;
  };
  terminal: {
    comment: string;
    command1: string;
    command2: string;
    booting: string;
    ready: string;
    memory: string;
    slogan: string;
  };
  features: {
    title: string;
    subtitle: string;
    urduFirst: string;
    urduFirstDesc: string;
    memory: string;
    memoryDesc: string;
    boot: string;
    bootDesc: string;
    android: string;
    androidDesc: string;
  };
  comparison: {
    title: string;
    subtitle: string;
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
  };
  download: {
    title: string;
    subtitle: string;
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
    title: string;
    subtitle: string;
    licheePi: string;
    licheePiDesc: string;
    raspberryPi: string;
    raspberryPiDesc: string;
    termux: string;
    termuxDesc: string;
  };
  integrations: {
    title: string;
    subtitle: string;
    whatsapp: string;
    gmail: string;
    odoo: string;
    discord: string;
    slack: string;
    telegram: string;
    more: string;
  };
  footer: {
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

export const translations: Record<Language, Translation> = {
  en: {
    nav: {
      features: "Features",
      download: "Download",
      docs: "Docs",
      starOnGitHub: "Star on GitHub",
      launchMalikClaw: "Launch MalikClaw",
      exploreSource: "Explore Source",
      setupGuide: "Setup Guide",
    },
    hero: {
      tagline: "Autonomous Agent Infrastructure",
      title: "Empower Every Device with Intelligence.",
      subtitle: "MalikClaw is the ultra-lightweight engine for autonomous agents. Run production-grade AI from $10 hardware to cloud clusters.",
      specs: "< 10MB RAM · < 1s Cold Start · Privacy First.",
    },
    terminal: {
      comment: "# Initialize the Gryphon engine",
      command1: "curl -sSfL https://malikclaw.io/install.sh | sh",
      command2: "malikclaw agent",
      booting: "[SYSTEM] Booting MalikClaw v0.2.1...",
      ready: "✓ Gryphon Engine Ready in 0.82s",
      memory: "✓ Memory Footprint: 8.7MB",
      slogan: '"آگے بڑھو، ملک کلاؤ!"',
    },
    features: {
      title: "Built for Performance",
      subtitle: "Zero compromises. Pure Go-powered efficiency.",
      urduFirst: "Urdu-First Strategy 🇵🇰",
      urduFirstDesc: "Native RTL support and bilingual onboarding, specifically optimized for South Asian developers and edge hardware enthusiasts.",
      memory: "8.4MB Footprint",
      memoryDesc: "99% smaller than typical AI gateways. Performance and efficiency over unnecessary bloat.",
      boot: "1s Cold Start",
      bootDesc: "Instant-on architecture. No waiting for heavy runtimes or virtual machines.",
      android: "Android Remote",
      androidDesc: "Natively control Android devices via ADB. Screenshots, taps, and automation on old hardware.",
    },
    comparison: {
      title: "The Edge Hardware Champion",
      subtitle: "MalikClaw vs the competition.",
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
    },
    download: {
      title: "Deploy the Gryphon",
      subtitle: "Lightweight binaries for every architecture.",
      windows: "Windows",
      windowsDesc: "Windows 10/11 (x64)",
      downloadExe: "Download .EXE",
      linux: "Linux (SBC)",
      linuxDesc: "ARM64, x64, RISC-V",
      downloadBinary: "Download Binary",
      android: "Android",
      androidDesc: "Termux (ARM64)",
      docker: "Docker",
      dockerDesc: "Official Image",
    },
    showcase: {
      title: "Powered by MalikClaw",
      subtitle: "Real-world deployments on edge hardware.",
      licheePi: "LicheePi Nano",
      licheePiDesc: "$10 RISC-V board running MalikClaw with 32MB RAM",
      raspberryPi: "Raspberry Pi Zero 2 W",
      raspberryPiDesc: "Home AI assistant on $15 hardware",
      termux: "Android Termux",
      termuxDesc: "Old phones get a second life as AI assistants",
    },
    integrations: {
      title: "Seamless Integrations",
      subtitle: "Connect MalikClaw with your favorite tools and platforms.",
      whatsapp: "WhatsApp",
      gmail: "Gmail",
      odoo: "Odoo",
      discord: "Discord",
      slack: "Slack",
      telegram: "Telegram",
      more: "& more",
    },
    footer: {
      builtWith: "Built with Next.js, Go and ❤️ by the MalikClaw Community.",
      copyright: "© 2026 Muhammad Abdullah Athar · 🦅 Swift. Strong. Secure.",
    },
    langSwitcher: {
      en: "English",
      ur: "اردو",
      fr: "Français",
      ja: "日本語",
      pt: "Português",
      vi: "Tiếng Việt",
    },
  },
  ur: {
    nav: {
      features: "خصوصیات",
      download: "ڈاؤن لوڈ",
      docs: "دستاویزات",
      starOnGitHub: "GitHub پر ستارہ",
      launchMalikClaw: "شروع کریں",
      exploreSource: "سورس کوڈ",
      setupGuide: "سیٹ اپ گائیڈ",
    },
    hero: {
      tagline: "عقاب جیسی تیزی، شیر جیسی طاقت۔",
      title: "ایمرجنگ ہارڈ ویئر کا چیمپئن۔",
      subtitle: "$10 ہارڈ ویئر کے لیے الٹرا لائٹ ویٹ پرسنل AI انفراسٹرکچر۔",
      specs: "10MB RAM · 1s Boot · 100% Privacy.",
    },
    terminal: {
      comment: "# Gryphon انجن کو شروع کریں",
      command1: "curl -sSfL https://malikclaw.io/install.sh | sh",
      command2: "malikclaw agent",
      booting: "[SYSTEM] MalikClaw v0.2.1 شروع ہو رہا ہے...",
      ready: "✓ Gryphon انجن 0.82s میں تیار",
      memory: "✓ میموری فٹ پرنٹ: 8.7MB",
      slogan: '"آگے بڑھو، ملک کلاؤ!"',
    },
    features: {
      title: "کارکردگی کے لیے تیار",
      subtitle: "کوئی سمجھوتہ نہیں۔ خالص Go کی طاقت۔",
      urduFirst: "اردو فرسٹ حکمت عملی 🇵🇰",
      urduFirstDesc: "مقامی RTL سپورٹ اور دو لسانی آن بورڈنگ، خاص طور پر جنوبی ایشیائی ڈویلپرز کے لیے تیار کردہ۔",
      memory: "8.4MB میموری",
      memoryDesc: "عام AI گیٹ ویز سے 99% چھوٹا۔ غیر ضروری بوجھ پر کارکردگی کو ترجیح۔",
      boot: "1 سیکنڈ اسٹارٹ",
      bootDesc: "فوری اسٹارٹ اپ آرکیٹیکچر۔ بھاری رن ٹائمز کا کوئی انتظار نہیں۔",
      android: "اینڈرائیڈ ریموٹ",
      androidDesc: "ADB کے ذریعے اینڈرائیڈ ڈیوائسز کو کنٹرول کریں۔ پرانے ہارڈ ویئر پر آٹومیشن۔",
    },
    comparison: {
      title: "ایمرجنگ ہارڈ ویئر کا چیمپئن",
      subtitle: "ملک کلاؤ کا مقابلہ دوسروں سے۔",
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
    },
    download: {
      title: "ملک کلاؤ کو انسٹال کریں",
      subtitle: "ہر فن تعمیر کے لیے ہلکی پھلکی بائنریز۔",
      windows: "Windows",
      windowsDesc: "Windows 10/11 (x64)",
      downloadExe: "ڈاؤن لوڈ .EXE",
      linux: "Linux (SBC)",
      linuxDesc: "ARM64, x64, RISC-V",
      downloadBinary: "بائنری حاصل کریں",
      android: "Android",
      androidDesc: "Termux (ARM64)",
      docker: "Docker",
      dockerDesc: "سرکاری امیج",
    },
    showcase: {
      title: "MalikClaw کی طاقت سے",
      subtitle: "ایج ہارڈ ویئر پر حقیقی دنیا کی تعیناتی۔",
      licheePi: "LicheePi Nano",
      licheePiDesc: "$10 RISC-V بورڈ جس پر 32MB RAM کے ساتھ MalikClaw چل رہا ہے",
      raspberryPi: "Raspberry Pi Zero 2 W",
      raspberryPiDesc: "$15 ہارڈ ویئر پر گھر AI اسسٹنٹ",
      termux: "Android Termux",
      termuxDesc: "پرانے فونز کو AI اسسٹنٹ کے طور پر دوسری زندگی ملیں",
    },
    integrations: {
      title: "بہترین انٹیگریشنز",
      subtitle: "ملک کلاؤ کو اپنے پسندیدہ ٹولز اور پلیٹ فارمز سے جوڑیں۔",
      whatsapp: "واٹس ایپ",
      gmail: "جی میل",
      odoo: "اوڈو",
      discord: "ڈسکارڈ",
      slack: "سلیک",
      telegram: "ٹیلی گرام",
      more: "اور مزید",
    },
    footer: {
      builtWith: "Next.js، Go اور ❤️ کے ساتھ MalikClaw کمیونٹی کی طرف سے تیار کردہ۔",
      copyright: "© 2026 Muhammad Abdullah Athar · 🦅 Swift. Strong. Secure.",
    },
    langSwitcher: {
      en: "English",
      ur: "اردو",
      fr: "Français",
      ja: "日本語",
      pt: "Português",
      vi: "Tiếng Việt",
    },
  },
  fr: {
    nav: {
      features: "Fonctionnalités",
      download: "Télécharger",
      docs: "Documentation",
      starOnGitHub: "Star sur GitHub",
      launchMalikClaw: "Lancer MalikClaw",
      exploreSource: "Explorer le code",
      setupGuide: "Guide d'installation",
    },
    hero: {
      tagline: "Rapide comme un aigle, fort comme un lion.",
      title: "Le Champion de l'Edge AI.",
      subtitle: "Infrastructure IA personnelle ultra-légère pour matériel à 10$.",
      specs: "10MB RAM · 1s Démarrage · 100% Vie privée.",
    },
    terminal: {
      comment: "# Initialiser le moteur Gryphon",
      command1: "curl -sSfL https://malikclaw.io/install.sh | sh",
      command2: "malikclaw agent",
      booting: "[SYSTÈME] Démarrage de MalikClaw v0.2.1...",
      ready: "✓ Moteur Gryphon prêt en 0.82s",
      memory: "✓ Empreinte mémoire: 8.7MB",
      slogan: '"آگے بڑھو، ملک کلاؤ!"',
    },
    features: {
      title: "Conçu pour la performance",
      subtitle: "Zéro compromis. Efficacité propulsée par Go.",
      urduFirst: "Stratégie Urdu-First 🇵🇰",
      urduFirstDesc: "Support natif RTL et onboarding bilingue, spécifiquement optimisé pour les développeurs sud-asiatiques.",
      memory: "8.4MB Mémoire",
      memoryDesc: "99% plus petit que les passerelles IA typiques. Performance avant tout.",
      boot: "1s Démarrage",
      bootDesc: "Architecture à démarrage instantané. Pas d'attente pour les runtimes lourds.",
      android: "Android Remote",
      androidDesc: "Contrôlez les appareils Android via ADB. Automatisation sur ancien matériel.",
    },
    comparison: {
      title: "Le Champion du Matériel Edge",
      subtitle: "MalikClaw vs la concurrence.",
      metric: "Métrique",
      language: "Langage",
      ram: "Utilisation RAM",
      startup: "Temps de démarrage",
      cost: "Coût matériel",
      typescript: "TypeScript",
      go: "Go (Natif)",
      ram1GB: "> 1GB",
      ram10MB: "< 10MB",
      startup500s: "> 500s",
      startup1s: "< 1s",
      costMac: "Mac Mini (~599$)",
      costSBC: "Tout SBC (~10$)",
    },
    download: {
      title: "Déployer le Gryphon",
      subtitle: "Binaires légers pour chaque architecture.",
      windows: "Windows",
      windowsDesc: "Windows 10/11 (x64)",
      downloadExe: "Télécharger .EXE",
      linux: "Linux (SBC)",
      linuxDesc: "ARM64, x64, RISC-V",
      downloadBinary: "Télécharger binaire",
      android: "Android",
      androidDesc: "Termux (ARM64)",
      docker: "Docker",
      dockerDesc: "Image officielle",
    },
    showcase: {
      title: "Propulsé par MalikClaw",
      subtitle: "Déploiements réels sur matériel edge.",
      licheePi: "LicheePi Nano",
      licheePiDesc: "Carte RISC-V à 10$ exécutant MalikClaw avec 32MB RAM",
      raspberryPi: "Raspberry Pi Zero 2 W",
      raspberryPiDesc: "Assistant IA domestique sur matériel à 15$",
      termux: "Android Termux",
      termuxDesc: "Les vieux phones ont une seconde vie comme assistants IA",
    },
    integrations: {
      title: "Intégrations Fluides",
      subtitle: "Connectez MalikClaw avec vos outils et plateformes préférés.",
      whatsapp: "WhatsApp",
      gmail: "Gmail",
      odoo: "Odoo",
      discord: "Discord",
      slack: "Slack",
      telegram: "Telegram",
      more: "& plus",
    },
    footer: {
      builtWith: "Construit avec Next.js, Go et ❤️ par la communauté MalikClaw.",
      copyright: "© 2026 Muhammad Abdullah Athar · 🦅 Swift. Strong. Secure.",
    },
    langSwitcher: {
      en: "English",
      ur: "اردو",
      fr: "Français",
      ja: "日本語",
      pt: "Português",
      vi: "Tiếng Việt",
    },
  },
  ja: {
    nav: {
      features: "機能",
      download: "ダウンロード",
      docs: "ドキュメント",
      starOnGitHub: "GitHub でスター",
      launchMalikClaw: "MalikClaw を開始",
      exploreSource: "ソースコード",
      setupGuide: "セットアップガイド",
    },
    hero: {
      tagline: "鷲のように速く、獅子のように強い。",
      title: "エッジ AI チャンピオン。",
      subtitle: "$10 ハードウェアのための超軽量パーソナル AI インフラ。",
      specs: "10MB RAM · 1 秒起動 · 100% プライバシー。",
    },
    terminal: {
      comment: "# Gryphon エンジンを初期化",
      command1: "curl -sSfL https://malikclaw.io/install.sh | sh",
      command2: "malikclaw agent",
      booting: "[システム] MalikClaw v0.2.1 を起動中...",
      ready: "✓ Gryphon エンジン 0.82 秒で準備完了",
      memory: "✓ メモリフットプリント：8.7MB",
      slogan: '"آگے بڑھو، ملک کلاؤ!"',
    },
    features: {
      title: "パフォーマンスのために構築",
      subtitle: "妥協なし。Go による純粋な効率性。",
      urduFirst: "ウルドゥー語ファースト戦略 🇵🇰",
      urduFirstDesc: "ネイティブ RTL サポートと二言語オンボーディング。南アジアの開発者に最適化。",
      memory: "8.4MB フットプリント",
      memoryDesc: "通常の AI ゲートウェイより 99% 小さい。不要な膨張よりパフォーマンス。",
      boot: "1 秒コールドスタート",
      bootDesc: "インスタントオンアーキテクチャ。重いランタイムを待つ必要なし。",
      android: "Android リモート",
      androidDesc: "ADB を介して Android デバイスをネイティブ制御。古いハードウェアで自動化。",
    },
    comparison: {
      title: "エッジハードウェアチャンピオン",
      subtitle: "MalikClaw vs 競合。",
      metric: "指標",
      language: "言語",
      ram: "RAM 使用量",
      startup: "起動時間",
      cost: "ハードウェアコスト",
      typescript: "TypeScript",
      go: "Go (ネイティブ)",
      ram1GB: "> 1GB",
      ram10MB: "< 10MB",
      startup500s: "> 500 秒",
      startup1s: "< 1 秒",
      costMac: "Mac Mini (~$599)",
      costSBC: "任意の SBC (~$10)",
    },
    download: {
      title: "Gryphon を展開",
      subtitle: "すべてのアーキテクチャ向けの軽量バイナリ。",
      windows: "Windows",
      windowsDesc: "Windows 10/11 (x64)",
      downloadExe: ".EXE をダウンロード",
      linux: "Linux (SBC)",
      linuxDesc: "ARM64, x64, RISC-V",
      downloadBinary: "バイナリをダウンロード",
      android: "Android",
      androidDesc: "Termux (ARM64)",
      docker: "Docker",
      dockerDesc: "公式イメージ",
    },
    showcase: {
      title: "MalikClaw で動作",
      subtitle: "エッジハードウェアでの実際の導入事例。",
      licheePi: "LicheePi Nano",
      licheePiDesc: "32MB RAM で MalikClaw を実行する$10 RISC-V ボード",
      raspberryPi: "Raspberry Pi Zero 2 W",
      raspberryPiDesc: "$15 ハードウェアでホーム AI アシスタント",
      termux: "Android Termux",
      termuxDesc: "古いスマートフォンが AI アシスタントとして第二の人生を",
    },
    integrations: {
      title: "シームレスな統合",
      subtitle: "MalikClaw をお気に入りのツールやプラットフォームと接続します。",
      whatsapp: "WhatsApp",
      gmail: "Gmail",
      odoo: "Odoo",
      discord: "Discord",
      slack: "Slack",
      telegram: "Telegram",
      more: "など",
    },
    footer: {
      builtWith: "Next.js、Go、❤️ で MalikClaw コミュニティによって構築。",
      copyright: "© 2026 Muhammad Abdullah Athar · 🦅 Swift. Strong. Secure.",
    },
    langSwitcher: {
      en: "English",
      ur: "اردو",
      fr: "Français",
      ja: "日本語",
      pt: "Português",
      vi: "Tiếng Việt",
    },
  },
  pt: {
    nav: {
      features: "Recursos",
      download: "Baixar",
      docs: "Documentação",
      starOnGitHub: "Estrela no GitHub",
      launchMalikClaw: "Iniciar MalikClaw",
      exploreSource: "Explorar código",
      setupGuide: "Guia de instalação",
    },
    hero: {
      tagline: "Rápido como uma águia, forte como um leão.",
      title: "O Campeão de Edge AI.",
      subtitle: "Infraestrutura de IA pessoal ultra-leve para hardware de $10.",
      specs: "10MB RAM · 1s Inicialização · 100% Privacidade.",
    },
    terminal: {
      comment: "# Inicializar o motor Gryphon",
      command1: "curl -sSfL https://malikclaw.io/install.sh | sh",
      command2: "malikclaw agent",
      booting: "[SISTEMA] Iniciando MalikClaw v0.2.1...",
      ready: "✓ Motor Gryphon pronto em 0.82s",
      memory: "✓ Pegada de memória: 8.7MB",
      slogan: '"آگے بڑھو، ملک کلاؤ!"',
    },
    features: {
      title: "Construído para desempenho",
      subtitle: "Zero compromissos. Eficiência pura em Go.",
      urduFirst: "Estratégia Urdu-First 🇵🇰",
      urduFirstDesc: "Suporte nativo RTL e onboarding bilíngue, otimizado para desenvolvedores do sul da Ásia.",
      memory: "8.4MB Memória",
      memoryDesc: "99% menor que gateways de IA típicos. Desempenho sobre inchamento.",
      boot: "1s Inicialização",
      bootDesc: "Arquitetura de inicialização instantânea. Sem espera por runtimes pesados.",
      android: "Android Remoto",
      androidDesc: "Controle dispositivos Android via ADB. Automação em hardware antigo.",
    },
    comparison: {
      title: "O Campeão de Hardware Edge",
      subtitle: "MalikClaw vs a concorrência.",
      metric: "Métrica",
      language: "Linguagem",
      ram: "Uso de RAM",
      startup: "Tempo de inicialização",
      cost: "Custo de hardware",
      typescript: "TypeScript",
      go: "Go (Nativo)",
      ram1GB: "> 1GB",
      ram10MB: "< 10MB",
      startup500s: "> 500s",
      startup1s: "< 1s",
      costMac: "Mac Mini (~$599)",
      costSBC: "Qualquer SBC (~$10)",
    },
    download: {
      title: "Implantar o Gryphon",
      subtitle: "Binários leves para cada arquitetura.",
      windows: "Windows",
      windowsDesc: "Windows 10/11 (x64)",
      downloadExe: "Baixar .EXE",
      linux: "Linux (SBC)",
      linuxDesc: "ARM64, x64, RISC-V",
      downloadBinary: "Baixar binário",
      android: "Android",
      androidDesc: "Termux (ARM64)",
      docker: "Docker",
      dockerDesc: "Imagem oficial",
    },
    showcase: {
      title: "Powered by MalikClaw",
      subtitle: "Implantações reais em hardware edge.",
      licheePi: "LicheePi Nano",
      licheePiDesc: "Placa RISC-V de $10 executando MalikClaw com 32MB RAM",
      raspberryPi: "Raspberry Pi Zero 2 W",
      raspberryPiDesc: "Assistente de IA doméstico em hardware de $15",
      termux: "Android Termux",
      termuxDesc: "Telefones antigos ganham segunda vida como assistentes de IA",
    },
    integrations: {
      title: "Integrações Fluídas",
      subtitle: "Conecte o MalikClaw com suas ferramentas e plataformas favoritas.",
      whatsapp: "WhatsApp",
      gmail: "Gmail",
      odoo: "Odoo",
      discord: "Discord",
      slack: "Slack",
      telegram: "Telegram",
      more: "& mais",
    },
    footer: {
      builtWith: "Construído com Next.js, Go e ❤️ pela comunidade MalikClaw.",
      copyright: "© 2026 Muhammad Abdullah Athar · 🦅 Swift. Strong. Secure.",
    },
    langSwitcher: {
      en: "English",
      ur: "اردو",
      fr: "Français",
      ja: "日本語",
      pt: "Português",
      vi: "Tiếng Việt",
    },
  },
  vi: {
    nav: {
      features: "Tính năng",
      download: "Tải xuống",
      docs: "Tài liệu",
      starOnGitHub: "Star trên GitHub",
      launchMalikClaw: "Khởi chạy MalikClaw",
      exploreSource: "Khám phá nguồn",
      setupGuide: "Hướng dẫn cài đặt",
    },
    hero: {
      tagline: "Nhanh như đại bàng, mạnh như sư tử.",
      title: "Nhà vô địch Edge AI.",
      subtitle: "Cơ sở hạ tầng AI cá nhân siêu nhẹ cho phần cứng $10.",
      specs: "10MB RAM · 1s Khởi động · 100% Riêng tư.",
    },
    terminal: {
      comment: "# Khởi tạo động cơ Gryphon",
      command1: "curl -sSfL https://malikclaw.io/install.sh | sh",
      command2: "malikclaw agent",
      booting: "[HỆ THỐNG] Đang khởi động MalikClaw v0.2.1...",
      ready: "✓ Động cơ Gryphon sẵn sàng trong 0.82s",
      memory: "✓ Dấu chân bộ nhớ: 8.7MB",
      slogan: '"آگے بڑھو، ملک کلاؤ!"',
    },
    features: {
      title: "Được xây dựng để hiệu suất",
      subtitle: "Không thỏa hiệp. Hiệu quả thuần Go.",
      urduFirst: "Chiến lược Urdu-First 🇵🇰",
      urduFirstDesc: "Hỗ trợ RTL gốc và onboarding song ngữ, tối ưu cho nhà phát triển Nam Á.",
      memory: "8.4MB Bộ nhớ",
      memoryDesc: "Nhỏ hơn 99% so với cổng AI thông thường. Hiệu suất trên sự cồng kềnh.",
      boot: "1s Khởi động lạnh",
      bootDesc: "Kiến trúc khởi động tức thì. Không chờ đợi runtime nặng.",
      android: "Android Từ xa",
      androidDesc: "Điều khiển thiết bị Android qua ADB. Tự động hóa trên phần cứng cũ.",
    },
    comparison: {
      title: "Nhà vô địch Phần cứng Edge",
      subtitle: "MalikClaw vs đối thủ.",
      metric: "Chỉ số",
      language: "Ngôn ngữ",
      ram: "Sử dụng RAM",
      startup: "Thời gian khởi động",
      cost: "Chi phí phần cứng",
      typescript: "TypeScript",
      go: "Go (Bản địa)",
      ram1GB: "> 1GB",
      ram10MB: "< 10MB",
      startup500s: "> 500s",
      startup1s: "< 1s",
      costMac: "Mac Mini (~$599)",
      costSBC: "Bất kỳ SBC (~$10)",
    },
    download: {
      title: "Triển khai Gryphon",
      subtitle: "Binary nhẹ cho mọi kiến trúc.",
      windows: "Windows",
      windowsDesc: "Windows 10/11 (x64)",
      downloadExe: "Tải xuống .EXE",
      linux: "Linux (SBC)",
      linuxDesc: "ARM64, x64, RISC-V",
      downloadBinary: "Tải xuống binary",
      android: "Android",
      androidDesc: "Termux (ARM64)",
      docker: "Docker",
      dockerDesc: "Ảnh chính thức",
    },
    showcase: {
      title: "Chạy bởi MalikClaw",
      subtitle: "Triển khai thực tế trên phần cứng edge.",
      licheePi: "LicheePi Nano",
      licheePiDesc: "Bo mạch RISC-V $10 chạy MalikClaw với 32MB RAM",
      raspberryPi: "Raspberry Pi Zero 2 W",
      raspberryPiDesc: "Trợ lý AI gia đình trên phần cứng $15",
      termux: "Android Termux",
      termuxDesc: "Điện thoại cũ có cuộc sống thứ hai làm trợ lý AI",
    },
    integrations: {
      title: "Tích hợp mượt mà",
      subtitle: "Kết nối MalikClaw với các công cụ và nền tảng yêu thích của bạn.",
      whatsapp: "WhatsApp",
      gmail: "Gmail",
      odoo: "Odoo",
      discord: "Discord",
      slack: "Slack",
      telegram: "Telegram",
      more: "& thêm",
    },
    footer: {
      builtWith: "Xây dựng với Next.js, Go và ❤️ bởi cộng đồng MalikClaw.",
      copyright: "© 2026 Muhammad Abdullah Athar · 🦅 Swift. Strong. Secure.",
    },
    langSwitcher: {
      en: "English",
      ur: "اردو",
      fr: "Français",
      ja: "日本語",
      pt: "Português",
      vi: "Tiếng Việt",
    },
  },
};
