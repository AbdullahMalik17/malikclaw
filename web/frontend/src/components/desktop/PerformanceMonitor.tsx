import React, { useEffect, useState } from 'react';

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<{ tps: number; vram: number }>({ tps: 0, vram: 0 });

  useEffect(() => {
    if (window.runtime) {
      window.runtime.EventsOn('metrics-update', (data: any) => {
        setMetrics(data);
      });
    }
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-gray-900/90 backdrop-blur border border-gray-700 p-4 rounded-xl shadow-xl w-64 text-white">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Live Performance</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300">Tokens/Sec</span>
        <span className="text-xl font-mono font-bold text-green-400">{metrics.tps.toFixed(1)}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
        <div 
          className="bg-green-500 h-1.5 rounded-full transition-all duration-500" 
          style={{ width: `${Math.min((metrics.tps / 50) * 100, 100)}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300">VRAM Usage</span>
        <span className="text-sm font-mono text-blue-400">{metrics.vram} MB</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5">
        <div 
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
          style={{ width: `${Math.min((metrics.vram / 12000) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};
