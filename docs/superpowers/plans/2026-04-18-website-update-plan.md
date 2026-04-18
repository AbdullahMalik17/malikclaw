# MalikClaw Website Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the MalikClaw website into a professional, global showcase for its autonomous agent infrastructure, featuring the "Neural Loop" animation and a sleek Gryphon aesthetic.

**Architecture:** A component-driven update using Next.js 15, Tailwind CSS, and Framer Motion for high-fidelity animations. The design is unified by a "Midnight Onyx" and "Gryphon Gold" theme.

**Tech Stack:** Next.js 15, Tailwind CSS, Framer Motion, Lucide React, Geist Sans/Mono.

---

### Task 1: Global Styles & Typography

**Files:**
- Modify: `website/src/app/globals.css`
- Modify: `website/src/app/layout.tsx`

- [ ] **Step 1: Update theme variables in CSS**

```css
/* website/src/app/globals.css */
@theme {
  --color-gryphon-gold: #EAB308;
  --color-electric-blue: #3B82F6;
  --color-dark-obsidian: #020202; 
  --color-card-bg: #0A0A0A; 
  
  --animate-shimmer: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

:root {
  --background: #020202;
  --foreground: #fafafa;
}
```

- [ ] **Step 2: Add Geist font to layout**

```tsx
/* website/src/app/layout.tsx */
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased selection:bg-gryphon-gold/30">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify style updates**

Run: `pnpm dev` (in website dir)
Expected: Background is darker (#020202) and font defaults to Geist.

- [ ] **Step 4: Commit changes**

```bash
git add website/src/app/globals.css website/src/app/layout.tsx
git commit -m "style: update global theme and typography to Geist"
```

---

### Task 2: Neural Loop Animation Component

**Files:**
- Create: `website/src/components/neural-loop.tsx`

- [ ] **Step 1: Implement the animated SVG component**

```tsx
/* website/src/components/neural-loop.tsx */
"use client";

import { motion } from "framer-motion";

const nodes = [
  { id: "plan", label: "PLAN", x: 50, y: 10 },
  { id: "act", label: "ACT", x: 90, y: 50 },
  { id: "observe", label: "OBSERVE", x: 50, y: 90 },
  { id: "reflect", label: "REFLECT", x: 10, y: 50 },
];

export default function NeuralLoop() {
  return (
    <div className="relative w-full max-w-md aspect-square mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* Paths connecting nodes */}
        <motion.path
          d="M 50 10 L 90 50 L 50 90 L 10 50 Z"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EAB308" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#EAB308" stopOpacity="1" />
            <stop offset="100%" stopColor="#EAB308" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Nodes */}
        {nodes.map((node) => (
          <motion.g key={node.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <circle cx={node.x} cy={node.y} r="4" className="fill-black stroke-gryphon-gold stroke-[0.5]" />
            <text x={node.x} y={node.y + 10} textAnchor="middle" className="fill-zinc-400 font-mono text-[3px] font-bold tracking-widest">
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Commit component**

```bash
git add website/src/components/neural-loop.tsx
git commit -m "feat: add NeuralLoop animation component"
```

---

### Task 3: Global-Focused Hero Section

**Files:**
- Modify: `website/src/components/hero.tsx`
- Modify: `website/src/i18n/translations.ts`

- [ ] **Step 1: Update translations for global focus**

```typescript
/* website/src/i18n/translations.ts (en section) */
hero: {
  tagline: "Autonomous Agent Infrastructure",
  title: "Empower Every Device with Intelligence.",
  subtitle: "MalikClaw is the ultra-lightweight engine for autonomous agents. Run production-grade AI from $10 hardware to cloud clusters.",
  specs: "< 10MB RAM · < 1s Cold Start · Privacy First.",
},
```

- [ ] **Step 2: Remove decorative Urdu heading and add NeuralLoop**

```tsx
/* website/src/components/hero.tsx */
import NeuralLoop from "./neural-loop";

// ... Inside Hero component ...
<h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
  <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
    {t.hero.title}
  </span>
</h1>

<div className="mt-16 w-full max-w-2xl relative">
  <div className="absolute inset-0 bg-gryphon-gold/5 blur-3xl rounded-full" />
  <NeuralLoop />
</div>
```

- [ ] **Step 3: Commit updates**

```bash
git add website/src/components/hero.tsx website/src/i18n/translations.ts
git commit -m "feat: globalize hero section and integrate NeuralLoop"
```

---

### Task 4: Modernized Feature Grid

**Files:**
- Modify: `website/src/components/features.tsx`

- [ ] **Step 1: Update features layout and add animated indicators**

- [ ] **Step 2: Commit feature grid**

```bash
git add website/src/components/features.tsx
git commit -m "feat: modernize feature grid with sleek aesthetics"
```

---

### Task 5: Performance Comparison Table

**Files:**
- Modify: `website/src/components/comparison.tsx`

- [ ] **Step 1: Implement Glassmorphism table**

- [ ] **Step 2: Commit comparison**

```bash
git add website/src/components/comparison.tsx
git commit -m "feat: add glassmorphism performance comparison table"
```

---

### Task 6: Refined Installation & Footer

**Files:**
- Modify: `website/src/components/download.tsx`
- Modify: `website/src/components/footer.tsx`

- [ ] **Step 1: Clean up installation section and remove decorative elements**

- [ ] **Step 2: Commit final components**

```bash
git add website/src/components/download.tsx website/src/components/footer.tsx
git commit -m "feat: refine installation and footer for global reach"
```

---

### Task 7: Final Localization Cleanup

**Files:**
- Modify: `website/src/i18n/translations.ts`

- [ ] **Step 1: Remove all "urduFirst" decorative logic and headings**

- [ ] **Step 2: Ensure Urdu translation is functional but visually consistent with global design**

- [ ] **Step 3: Run final build test**

Run: `pnpm run build` (in website dir)
Expected: No errors, optimized production build.

- [ ] **Step 4: Commit cleanup**

```bash
git add website/src/i18n/translations.ts
git commit -m "chore: final localization cleanup for global aesthetics"
```
