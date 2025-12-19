
import React, { useState } from 'react';
import { Spool, PrintLog } from '../types';

interface UsageSectionProps {
  spools: Spool[];
  logs: PrintLog[];
  onAddPrintLog: (log: PrintLog) => void;
}

const UsageSection: React.FC<UsageSectionProps> = ({ spools, logs, onAddPrintLog }) => {
  const [formData, setFormData] = useState({
    spoolId: '',
    printName: '',
    weightUsed: 0
  });

  const activeSpools = spools.filter(s => s.status === 'active' && s.currentWeight > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.spoolId || !formData.printName || formData.weightUsed <= 0) return;

    const newLog: PrintLog = {
      id: Math.random().toString(36).substr(2, 9),
      spoolId: formData.spoolId,
      printName: formData.printName,
      weightUsed: formData.weightUsed,
      timestamp: new Date().toISOString()
    };

    onAddPrintLog(newLog);
    setFormData({ spoolId: '', printName: '', weightUsed: 0 });
    alert('Print job logged successfully!');
  };

  const selectedSpool = spools.find(s => s.id === formData.spoolId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-white">Track Print</h1>
          <p className="text-slate-400 mt-1">Record your latest creation and deduct filament.</p>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Select Filament</label>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {activeSpools.map(spool => (
                  <button
                    key={spool.id}
                    type="button"
                    onClick={() => setFormData({...formData, spoolId: spool.id})}
                    className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-all text-left ${
                      formData.spoolId === spool.id 
                        ? 'border-indigo-600 bg-indigo-600/10' 
                        : 'border-slate-800 hover:border-slate-700 bg-slate-800/40'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full border border-white/10 shadow-inner" style={{ backgroundColor: spool.colorHex }}></div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">{spool.color} {spool.type}</div>
                      <div className="text-xs text-slate-500">{spool.brand} • {spool.currentWeight}g left</div>
                    </div>
                    {formData.spoolId === spool.id && (
                      <div className="text-indigo-500">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
                {activeSpools.length === 0 && (
                  <div className="text-center py-6 text-slate-500 bg-slate-800/20 rounded-xl border border-dashed border-slate-800">
                    No active spools found. Add one in the Inventory first!
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Print Name / Project</label>
              <input 
                type="text" required
                value={formData.printName}
                onChange={(e) => setFormData({...formData, printName: e.target.value})}
                placeholder="e.g. Benchy / Tool Holder"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Filament Used (grams)</label>
              <div className="relative">
                <input 
                  type="number" required min="1"
                  max={selectedSpool?.currentWeight || 9999}
                  value={formData.weightUsed || ''}
                  onChange={(e) => setFormData({...formData, weightUsed: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">g</span>
              </div>
              {selectedSpool && formData.weightUsed > selectedSpool.currentWeight && (
                <p className="text-red-400 text-xs mt-2">Error: Not enough filament on this spool!</p>
              )}
            </div>

            <button 
              type="submit"
              disabled={!formData.spoolId || formData.weightUsed <= 0 || (selectedSpool && formData.weightUsed > selectedSpool.currentWeight)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Complete & Deduct
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Full Print History</h3>
        <div className="space-y-4">
          {logs.map(log => {
            const spool = spools.find(s => s.id === log.spoolId);
            return (
              <div key={log.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-lg" style={{ backgroundColor: spool?.colorHex || '#1e293b' }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{log.printName}</h4>
                    <p className="text-sm text-slate-500">
                      {spool ? `${spool.brand} ${spool.color}` : 'Unknown'} • {new Date(log.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-indigo-400 font-bold">-{log.weightUsed}g</span>
                  <div className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mt-1">Deducted</div>
                </div>
              </div>
            );
          })}
          {logs.length === 0 && (
            <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 border-dashed">
              <p className="text-slate-500">Your print history will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsageSection;
