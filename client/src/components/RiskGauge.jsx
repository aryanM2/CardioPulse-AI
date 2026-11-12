import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function RiskGauge({ riskPercentage, riskLevel, prediction, recommendation, source }) {
  const percentage = Math.min(100, Math.max(0, riskPercentage || 0));
  
  // Total circumference of half-circle arc with radius R=80: PI * 80 = 251.327
  const arcLength = 251.327;
  const strokeDashoffset = arcLength * (1 - percentage / 100);

  let theme = {
    color: '#10b981', // emerald
    bgGradient: 'from-emerald-500/10 via-slate-900 to-[#090e17]',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle2,
    title: 'Low Cardiovascular Risk'
  };

  if (percentage >= 70) {
    theme = {
      color: '#e11d48', // rose-600
      bgGradient: 'from-rose-500/10 via-slate-900 to-[#090e17]',
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: AlertOctagon,
      title: 'High Cardiovascular Risk'
    };
  } else if (percentage >= 35) {
    theme = {
      color: '#f59e0b', // amber-500
      bgGradient: 'from-amber-500/10 via-slate-900 to-[#090e17]',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      title: 'Moderate Cardiovascular Risk'
    };
  }

  const IconComponent = theme.icon;

  return (
    <div className={`glass-panel p-5 sm:p-6 rounded-2xl border ${theme.border} bg-gradient-to-b ${theme.bgGradient} shadow-xl transition-all duration-300`}>
      <div className="flex flex-col items-center text-center">
        
        {/* Semi-Circle Clinical Arc Gauge */}
        <div className="relative w-full max-w-[220px] sm:max-w-[250px] aspect-[200/115] flex items-center justify-center my-1">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 115">
            {/* Background Track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#1a2636"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Dynamic Value Arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={theme.color}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />

            {/* Ticks */}
            <text x="14" y="114" fill="#64748b" fontSize="9" fontWeight="600" textAnchor="middle">0%</text>
            <text x="100" y="16" fill="#64748b" fontSize="9" fontWeight="600" textAnchor="middle">50%</text>
            <text x="186" y="114" fill="#64748b" fontSize="9" fontWeight="600" textAnchor="middle">100%</text>
          </svg>

          {/* Centered Percentage Display */}
          <div className="absolute top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <span className={`text-4xl sm:text-5xl font-black tracking-tight leading-none ${theme.text}`}>
              {percentage}%
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
              Risk Probability
            </span>
          </div>
        </div>

        {/* Severity Classification Badge */}
        <div className="mt-2">
          <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${theme.badge}`}>
            <IconComponent className="w-4 h-4 shrink-0" />
            <span>{theme.title}</span>
          </div>
        </div>

        {/* Clinical Prediction Status */}
        <div className="mt-3 text-xs sm:text-sm text-slate-300 font-medium max-w-xs leading-relaxed">
          {prediction === 1 ? (
            <p className="text-rose-300 font-medium">
              ML diagnostic indicates <strong className="text-white underline decoration-rose-500/80 underline-offset-2">Positive Risk Factors</strong> for Heart Disease.
            </p>
          ) : (
            <p className="text-emerald-300 font-medium">
              ML diagnostic indicates <strong className="text-white underline decoration-emerald-500/80 underline-offset-2">Low Risk Clinical Profile</strong>.
            </p>
          )}
        </div>

        {/* Clinical Recommendation Box */}
        <div className="mt-4 p-3 sm:p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-left w-full">
          <div className="flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clinical Recommendation</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{recommendation}</p>
            </div>
          </div>
        </div>

        {/* Diagnostic Metadata */}
        <div className="mt-3 flex flex-wrap items-center justify-between w-full text-[11px] text-slate-500 border-t border-slate-800/80 pt-2.5 gap-1">
          <span>Inference: <strong className="text-slate-400">{source || 'FastAPI Microservice'}</strong></span>
          <span>Scikit-Learn Standard Pipeline</span>
        </div>

      </div>
    </div>
  );
}
