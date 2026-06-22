import React from 'react';
import { motion } from 'framer-motion';
import { 
  IconRobot, 
  IconMessage2, 
  IconTools, 
  IconBrain, 
  IconActivity, 
  IconClock, 
  IconArrowUpRight,
  IconArrowDownRight,
  IconCpu
} from '@tabler/icons-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
};

const BentoCard = ({ 
  className, 
  children, 
  gradient 
}: { 
  className?: string, 
  children: React.ReactNode,
  gradient?: string
}) => {
  return (
    <motion.div 
      variants={itemVariants}
      className={`relative group overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 shadow-2xl transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_40px_-15px_rgba(255,255,255,0.2)] ${className}`}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {gradient && (
        <div className={`absolute -inset-[100%] z-0 animate-[spin_10s_linear_infinite] opacity-0 transition-opacity duration-500 group-hover:opacity-20`} style={{ background: gradient, filter: 'blur(40px)' }} />
      )}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};

export function AnalyticsDashboard() {
  return (
    <div className="w-full min-h-screen bg-[#050505] p-4 md:p-8 text-white selection:bg-white/20">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/40 mb-2">
            System Overview
          </h1>
          <p className="text-white/50 text-lg">Real-time telemetry and agent performance</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[160px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Active Agents - Large Card */}
          <BentoCard className="md:col-span-2 md:row-span-2" gradient="conic-gradient(from 90deg at 50% 50%, #000000 0%, #3b82f6 50%, #000000 100%)">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                <IconRobot className="w-6 h-6 text-blue-400" />
              </div>
              <span className="flex items-center text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                <IconArrowUpRight className="w-4 h-4 mr-1" />
                +24%
              </span>
            </div>
            <div className="mt-auto">
              <h3 className="text-white/60 text-sm font-medium mb-1">Active Agents</h3>
              <div className="text-6xl font-bold tracking-tighter text-white">42</div>
              <div className="mt-4 h-16 w-full flex items-end gap-1">
                {[40, 25, 45, 30, 60, 45, 70, 55, 80, 65, 90, 85, 100].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                    className="flex-1 bg-gradient-to-t from-blue-600/40 to-blue-400 rounded-t-sm hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            </div>
          </BentoCard>

          {/* Messages Processed */}
          <BentoCard className="md:col-span-1 md:row-span-1" gradient="conic-gradient(from 180deg at 50% 50%, #000000 0%, #a855f7 50%, #000000 100%)">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <IconMessage2 className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="mt-auto">
              <h3 className="text-white/60 text-sm font-medium mb-1">Messages Processed</h3>
              <div className="text-3xl font-bold text-white">1.2M</div>
              <p className="text-xs text-white/40 mt-1 flex items-center">
                <IconArrowUpRight className="w-3 h-3 mr-1 text-emerald-400" />
                12k this hour
              </p>
            </div>
          </BentoCard>

          {/* System Load */}
          <BentoCard className="md:col-span-1 md:row-span-1" gradient="conic-gradient(from 0deg at 50% 50%, #000000 0%, #ef4444 50%, #000000 100%)">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
                <IconCpu className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <div className="mt-auto">
              <h3 className="text-white/60 text-sm font-medium mb-1">CPU Load</h3>
              <div className="text-3xl font-bold text-white">48%</div>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "48%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full"
                />
              </div>
            </div>
          </BentoCard>

          {/* Active Skills */}
          <BentoCard className="md:col-span-2 md:row-span-1" gradient="conic-gradient(from 270deg at 50% 50%, #000000 0%, #f59e0b 50%, #000000 100%)">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center gap-2">
                <IconBrain className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">Top Skills</span>
              </div>
            </div>
            <div className="mt-auto flex flex-wrap gap-2">
              {['Code Review', 'Data Analysis', 'Web Search', 'Refactoring', 'Debugging'].map((skill, i) => (
                <div key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 hover:border-white/20 transition-colors cursor-default">
                  {skill}
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Uptime */}
          <BentoCard className="md:col-span-1 md:row-span-1" gradient="conic-gradient(from 90deg at 50% 50%, #000000 0%, #10b981 50%, #000000 100%)">
             <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <IconActivity className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="mt-auto">
              <h3 className="text-white/60 text-sm font-medium mb-1">System Uptime</h3>
              <div className="text-3xl font-bold text-white">99.9%</div>
              <p className="text-xs text-white/40 mt-1">Operational</p>
            </div>
          </BentoCard>

          {/* Response Time */}
          <BentoCard className="md:col-span-1 md:row-span-1" gradient="conic-gradient(from 180deg at 50% 50%, #000000 0%, #06b6d4 50%, #000000 100%)">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <IconClock className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="flex items-center text-sm font-medium text-emerald-400">
                <IconArrowDownRight className="w-4 h-4 mr-1" />
                12ms
              </span>
            </div>
            <div className="mt-auto">
              <h3 className="text-white/60 text-sm font-medium mb-1">Avg Response</h3>
              <div className="text-3xl font-bold text-white">245ms</div>
            </div>
          </BentoCard>
          
           {/* Tools Used */}
           <BentoCard className="md:col-span-2 md:row-span-1" gradient="conic-gradient(from 0deg at 50% 50%, #000000 0%, #ec4899 50%, #000000 100%)">
            <div className="flex h-full items-center justify-between">
              <div>
                <div className="p-2 bg-pink-500/10 rounded-xl border border-pink-500/20 w-fit mb-4">
                  <IconTools className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="text-white/60 text-sm font-medium mb-1">Tools Executed</h3>
                <div className="text-4xl font-bold text-white">8,492</div>
              </div>
              
              <div className="w-32 h-32 relative">
                {/* SVG Donut Chart representation */}
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                  <motion.circle 
                    cx="50" cy="50" r="40" 
                    stroke="#ec4899" 
                    strokeWidth="12" 
                    fill="none" 
                    strokeDasharray="251.2" 
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 * 0.3 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <motion.circle 
                    cx="50" cy="50" r="40" 
                    stroke="#3b82f6" 
                    strokeWidth="12" 
                    fill="none" 
                    strokeDasharray="251.2" 
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 * 0.7 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  />
                </svg>
              </div>
            </div>
          </BentoCard>
        </motion.div>
      </div>
    </div>
  );
}
