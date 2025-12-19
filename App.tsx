
import React, { useState, useEffect } from 'react';
import { AppView, Spool, PrintLog } from './types';
import Sidebar from './components/Sidebar';
import DashboardSection from './components/DashboardSection';
import InventorySection from './components/InventorySection';
import UsageSection from './components/UsageSection';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [spools, setSpools] = useState<Spool[]>(() => {
    const saved = localStorage.getItem('filament_spools');
    return saved ? JSON.parse(saved) : [];
  });
  const [logs, setLogs] = useState<PrintLog[]>(() => {
    const saved = localStorage.getItem('filament_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('filament_spools', JSON.stringify(spools));
  }, [spools]);

  useEffect(() => {
    localStorage.setItem('filament_logs', JSON.stringify(logs));
  }, [logs]);

  const addSpool = (spool: Spool) => {
    setSpools([...spools, spool]);
  };

  const addPrintLog = (log: PrintLog) => {
    setLogs([log, ...logs]);
    // Deduct weight from the spool
    setSpools(prev => prev.map(s => {
      if (s.id === log.spoolId) {
        const newWeight = Math.max(0, s.currentWeight - log.weightUsed);
        return { 
          ...s, 
          currentWeight: newWeight,
          status: newWeight <= 0 ? 'empty' : s.status
        };
      }
      return s;
    }));
  };

  const deleteSpool = (id: string) => {
    if (confirm('Are you sure you want to delete this spool? This will not delete its history.')) {
      setSpools(spools.filter(s => s.id !== id));
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-200 overflow-hidden">
      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8">
        <div className="max-w-6xl mx-auto">
          {view === 'dashboard' && (
            <DashboardSection spools={spools} logs={logs} />
          )}
          {view === 'inventory' && (
            <InventorySection spools={spools} onAddSpool={addSpool} onDeleteSpool={deleteSpool} />
          )}
          {view === 'usage' && (
            <UsageSection spools={spools} logs={logs} onAddPrintLog={addPrintLog} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
