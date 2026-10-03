import React from 'react';
import { AlertTriangle, CheckCircle2, AlertOctagon, Info, ShieldCheck } from 'lucide-react';

export default function RiskGauge({ riskPercentage, riskLevel, prediction, recommendation, source }) {
  const percentage = Math.min(100, Math.max(0, riskPercentage || 0));
  
  // Total circumference of half-circle arc with radius R=80: PI * 80 = 251.327
  const arcLength = 251.327;
  const strokeDashoffset = arcLength * (1 - percentage / 100);

  let theme = {
    color: '#10b981', // emerald
    glowColor: 'rgba(16, 185, 129, 0.4)',
    bgGradient: 'from-emerald-500/10 via-slate-900/90 to-slate-950',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle2,
    title: 'Low Cardiovascular Risk'
  };

  if (percentage >= 70) {
    theme = {
      color: '#f43f5e', // rose
      glowColor: 'rgba(244, 63, 94, 0.4)',
      bgGradient: 'from-rose-500/15 via-slate-900/90 to-slate-950',
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse',
      icon: AlertOctagon,
      title: 'High Cardiovascular Risk'
    };
  } else if (percentage >= 35) {
    theme = {
      color: '#f59e0b', // amber
      glowColor: 'rgba(245, 158, 11, 0.4)',
      bgGradient: 'from-amber-500/15 via-slate-900/90 to-slate-950',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      title: 'Moderate Cardiovascular Risk'
    };
  }

  const IconComponent = theme.icon;

  return (
    <div className={`glass-panel p-5 sm:p-7 rounded-2xl border ${theme.border} bg-gradient-to-b ${theme.bgGradient} relative overflow-hidden shadow-2xl transition-all duration-300`}>
      
      {/* Background Radial Glow */}
      <div 
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-25 pointer-events-none" 
        style={{ backgroundColor: theme.color }} 
      />

      <div className="flex flex-col items-center text-center">
        
        {/* Perfectly Aligned Semi-Circle Arc SVG */}
        <div className="relative w-full max-w-[240px] aspect-[200/115] flex items-center justify-center my-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 115">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>

            {/* Background Arc Path */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#1e293b"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Dynamic Progress Arc Path */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={theme.color}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${theme.glowColor})`
              }}
            />

            {/* Tick Marks (0%, 50%, 100%) */}
            <text x="12" y="112" fill="#64748b" fontSize="9" fontWeight="700" textAnchor="middle">0%</text>
            <text x="100" y="15" fill="#64748b" fontSize="9" fontWeight="700" textAnchor="middle">50%</text>
            <text x="188" y="112" fill="#64748b" fontSize="9" fontWeight="700" textAnchor="middle">100%</text>
          </svg>

          {/* Centered Percentage Display */}
          <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <span className={`text-4xl sm:text-5xl font-black tracking-tight leading-none ${theme.text}`}>
              {percentage}%
            </span>
            <span className="text-3xs uppercase font-extrabold tracking-widest text-slate-400 mt-1">
              Risk Score
            </span>
          </div>
        </div>

        {/* Status Tier Badge */}
        <div className="mt-2 flex items-center justify-center">
          <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${theme.badge}`}>
            <IconComponent className="w-4 h-4 flex-shrink-0" />
            <span>{theme.title}</span>
          </div>
        </div>

        {/* Clinical Prediction Status */}
        <div className="mt-3 text-xs sm:text-sm text-slate-300 font-medium max-w-xs leading-snug">
          {prediction === 1 ? (
            <p className="text-rose-300 font-semibold">
              ML Model indicates <span className="text-white underline decoration-rose-500 underline-offset-2">Positive for Heart Disease</span>.
            </p>
          ) : (
            <p className="text-emerald-300 font-semibold">
              ML Model indicates <span className="text-white underline decoration-emerald-500 underline-offset-2">Low Heart Disease Profile</span>.
            </p>
          )}
        </div>

        {/* Clinical Recommendation Box */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 text-left w-full">
          <div className="flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-3xs font-bold uppercase tracking-wider text-slate-400">Clinical Recommendation</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{recommendation}</p>
            </div>
          </div>
        </div>

        {/* Diagnostic Source Footnote */}
        <div className="mt-3 flex flex-wrap items-center justify-between w-full text-3xs text-slate-500 border-t border-slate-800/80 pt-2.5 gap-1">
          <span>Engine: <strong className="text-slate-400">{source || 'FastAPI Microservice'}</strong></span>
          <span>LogisticRegression + Scaler</span>
        </div>

      </div>
    </div>
  );
}
