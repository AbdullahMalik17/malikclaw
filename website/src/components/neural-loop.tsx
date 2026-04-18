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
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
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
            <motion.circle 
              cx={node.x} 
              cy={node.y} 
              r="4" 
              className="fill-[#020202] stroke-gryphon-gold stroke-[0.5]"
              animate={{
                r: [4, 5, 4],
                strokeWidth: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <text 
              x={node.x} 
              y={node.y + 12} 
              textAnchor="middle" 
              className="fill-zinc-400 font-mono text-[3px] font-bold tracking-[0.2em]"
            >
              {node.label}
            </text>
          </motion.g>
        ))}

        {/* Floating Pulse */}
        <motion.circle
          r="2"
          fill="#EAB308"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            offsetPath: "path('M 50 10 L 90 50 L 50 90 L 10 50 Z')",
            filter: "blur(4px)",
          }}
        />
      </svg>
    </div>
  );
}
