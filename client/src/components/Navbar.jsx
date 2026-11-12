import React from 'react';
import { Activity, Sliders, History, Cpu, Stethoscope } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, apiStatus }) {
  const isOnline = apiStatus?.status === 'online';

  const navItems = [
    { id: 'assessment', label: 'Clinical Assessment', shortLabel: 'Assessment', icon: Activity },
    { id: 'simulator', label: 'What-If Simulator', shortLabel: 'Simulator', icon: Sliders },
    { id: 'history', label: 'Patient History', shortLabel: 'History', icon: History },
    { id: 'model', label: 'Model Architecture', shortLabel: 'Model Spec', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0d1420]/95 border-b border-slate-800/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Clinical Brand Logo */}
          <div 
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer select-none group" 
            onClick={() => setActiveTab('assessment')}
          >
            <div className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-950/50 border border-emerald-400/30 shrink-0">
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  CardioPulse
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  Clinical ML
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-400">Cardiovascular Risk Intelligence Platform</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800/90 space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-950/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Engine Status Badge */}
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              <span className="relative flex h-2 w-2">
                {isOnline && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
              </span>
              <span className="text-[11px] sm:text-xs font-semibold">
                {isOnline ? 'FastAPI Online' : 'Node Bridge'}
              </span>
            </div>
          </div>

        </div>
      </div>
      
      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex overflow-x-auto px-2.5 py-2 space-x-1.5 border-t border-slate-800/80 bg-[#090e17] no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 bg-slate-900/90 border border-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
