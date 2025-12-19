
import React, { useMemo, useState, useEffect } from 'react';
import { Spool, PrintLog } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface DashboardSectionProps {
  spools: Spool[];
  logs: PrintLog[];
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ spools, logs }) => {
  const [showInstallTip, setShowInstallTip] = useState(false);
  const [isFramed, setIsFramed] = useState(false);

  useEffect(() => {
    // Check if we are inside an iframe (AI Studio frame)
    setIsFramed(window.self !== window.top);

    // Check if running in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    const hasDismissed = localStorage.getItem('hide_install_tip') === 'true';
    
    if (!isStandalone && !hasDismissed && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      setShowInstallTip(true);
    }
  }, []);

  const dismissTip = () => {
    setShowInstallTip(false);
    localStorage.setItem('hide_install_tip', 'true');
  };

  const stats = useMemo(() => {
    const totalInventory = spools.reduce((acc, s) => acc + s.currentWeight, 0);
    const totalUsed = logs.reduce((acc, l) => acc + l.weightUsed, 0);
    const lowStock = spools.filter(s => s.currentWeight < 200 && s.status === 'active').length;
    
    return {
      inventoryGrams: totalInventory,
      usedGrams: totalUsed,
      activeSpools: spools.filter(s => s.status === 'active').length,
      lowStockCount: lowStock
    };
  }, [spools, logs]);

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    spools.forEach(s => {
      counts[s.type] = (counts[s.type] || 0) + s.currentWeight;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [spools]);

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your workshop inventory and usage.</p>
      </header>

      {/* Installation Helper Card */}
      {isFramed && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500 rounded-lg text-slate-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-amber-500 text-sm">Deployment Note</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            You are currently viewing this app inside the <strong>AI Studio Preview</strong>. 
            To install it on your phone home screen:
          </p>
          <ol className="text-xs text-slate-400 mt-2 list-decimal list-inside space-y-1">
            <li>Click the <span className="text-white font-mono">"Open in new tab"</span> icon in the top-right of this window.</li>
            <li>In the new tab, use your browser menu to <span className="text-white">"Add to Home Screen"</span>.</li>
            <li>This ensures the shortcut points to your app, not the editor.</li>
          </ol>
        </div>
      )}

      {!isFramed && showInstallTip && (
        <div className="bg-indigo-600/20 border border-indigo-500/30 p-4 rounded-2xl flex items-start gap-4">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white">Ready to Install</h4>
            <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
              Tap your browser menu and select <strong>"Add to Home Screen"</strong> to use FilamentFlow as a standalone app.
            </p>
          </div>
          <button onClick={dismissTip} className="text-indigo-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Inventory Total', value: `${(stats.inventoryGrams / 1000).toFixed(2)} kg`, sub: `${spools.length} Spools`, icon: '📦', color: 'bg-indigo-600' },
          { label: 'Total Used', value: `${(stats.usedGrams / 1000).toFixed(2)} kg`, sub: `${logs.length} Prints`, icon: '📈', color: 'bg-emerald-600' },
          { label: 'Active Spools', value: stats.activeSpools, sub: 'Currently printing', icon: '🧵', color: 'bg-blue-600' },
          { label: 'Low Stock', value: stats.lowStockCount, sub: '< 200g remaining', icon: '⚠️', color: 'bg-amber-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-xl`}>
                {stat.icon}
              </span>
            </div>
            <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
            <div className="text-2xl font-bold text-white mt-1">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4">
        {/* Type Distribution */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Inventory by Material</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Prints */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Print Jobs</h3>
          </div>
          <div className="space-y-4">
            {logs.slice(0, 5).map(log => {
              const spool = spools.find(s => s.id === log.spoolId);
              return (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2" 
                      style={{ backgroundColor: spool?.colorHex + '33', borderColor: spool?.colorHex || '#6366f1' }}
                    >
                      {spool?.type || '??'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{log.printName}</div>
                      <div className="text-xs text-slate-400">
                        {spool ? `${spool.brand} ${spool.color}` : 'Unknown Filament'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-indigo-400">{log.weightUsed}g</div>
                    <div className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</div>
                  </div>
                </div>
              );
            })}
            {logs.length === 0 && (
              <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                No print logs yet. Start tracking your first print!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
