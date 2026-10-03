import React from 'react';
import { Activity, Heart, History, Sliders, Cpu } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, apiStatus }) {
  const isOnline = apiStatus?.status === 'online';

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer" onClick={() => setActiveTab('assessment')}>
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/25 border border-rose-400/30 flex-shrink-0">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-heartbeat" />
              <div className="absolute inset-0 rounded-xl bg-rose-500/20 animate-ping opacity-75 pointer-events-none" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-rose-200 bg-clip-text text-transparent">
                  CardioPulse
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 text-3xs sm:text-xs font-semibold rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-widest">
                  AI Risk
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-400 font-medium">Heart Disease Diagnostic Intelligence</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 space-x-1">
            <button
              onClick={() => setActiveTab('assessment')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'assessment'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Assessment</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'simulator'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>What-If Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Patient History</span>
            </button>

            <button
              onClick={() => setActiveTab('model')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'model'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Model Spec</span>
            </button>
          </nav>

          {/* API Status Badge */}
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-3xs sm:text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOnline ? 'bg-emerald-400' : 'bg-amber-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
              </span>
              <span className="truncate max-w-[120px] sm:max-w-none">
                {isOnline ? 'FastAPI Service' : 'Node ML Engine'}
              </span>
            </div>
          </div>

        </div>
      </div>
      
      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex overflow-x-auto px-3 py-2 space-x-2 border-t border-slate-800/60 bg-slate-950/90 no-scrollbar">
        <button
          onClick={() => setActiveTab('assessment')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'assessment' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 bg-slate-900 border border-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Assessment</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'simulator' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 bg-slate-900 border border-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'history' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 bg-slate-900 border border-slate-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>

        <button
          onClick={() => setActiveTab('model')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'model' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 bg-slate-900 border border-slate-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Model Spec</span>
        </button>
      </div>
    </header>
  );
}
