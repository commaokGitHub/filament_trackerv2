
import React, { useState } from 'react';
import { Spool } from '../types';

interface InventorySectionProps {
  spools: Spool[];
  onAddSpool: (spool: Spool) => void;
  onDeleteSpool: (id: string) => void;
}

const InventorySection: React.FC<InventorySectionProps> = ({ spools, onAddSpool, onDeleteSpool }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    type: 'PLA',
    color: '',
    colorHex: '#6366f1',
    brand: '',
    weight: 1000
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSpool: Spool = {
      id: Math.random().toString(36).substr(2, 9),
      type: formData.type,
      color: formData.color,
      colorHex: formData.colorHex,
      brand: formData.brand,
      initialWeight: formData.weight,
      currentWeight: formData.weight,
      purchaseDate: new Date().toISOString(),
      status: 'active'
    };
    onAddSpool(newSpool);
    setIsAdding(false);
    setFormData({ type: 'PLA', color: '', colorHex: '#6366f1', brand: '', weight: 1000 });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Inventory</h1>
          <p className="text-slate-400 mt-1">Manage your filament stock and track levels.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Spool
        </button>
      </header>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">New Filament Purchase</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Material Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {['PLA', 'PETG', 'ABS', 'TPU', 'ASA', 'Nylon', 'PC', 'Carbon Fiber'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Color Name</label>
                  <input 
                    type="text" required
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    placeholder="e.g. Galaxy Black"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Color Indicator</label>
                  <input 
                    type="color"
                    value={formData.colorHex}
                    onChange={(e) => setFormData({...formData, colorHex: e.target.value})}
                    className="w-full h-[50px] bg-slate-800 border border-slate-700 rounded-xl p-1 outline-none cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Brand</label>
                <input 
                  type="text" required
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  placeholder="e.g. Prusament"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Net Weight (grams)</label>
                <input 
                  type="number" required
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/20"
                >
                  Save Spool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spools.map(spool => (
          <div key={spool.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group">
            <div className="h-24 relative" style={{ backgroundColor: spool.colorHex }}>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/10"></div>
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-widest border border-white/10">
                {spool.type}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{spool.color}</h3>
                  <p className="text-sm text-slate-400">{spool.brand}</p>
                </div>
                <button 
                  onClick={() => onDeleteSpool(spool.id)}
                  className="text-slate-600 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Remaining</span>
                    <span className={`font-bold ${spool.currentWeight < 200 ? 'text-amber-500' : 'text-indigo-400'}`}>
                      {spool.currentWeight}g / {spool.initialWeight}g
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${spool.currentWeight < 200 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                      style={{ width: `${(spool.currentWeight / spool.initialWeight) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
                  <span>Purchased: {new Date(spool.purchaseDate).toLocaleDateString()}</span>
                  <span className="capitalize">{spool.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {spools.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-900 border-2 border-dashed border-slate-800 rounded-3xl">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Inventory is empty</h3>
            <p className="text-slate-500 mb-6">Start by adding your first filament spool to the system.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl transition-all"
            >
              Add Spool
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventorySection;
