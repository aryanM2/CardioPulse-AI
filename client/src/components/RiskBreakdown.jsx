import React from 'react';
import { BarChart2, Apple, Flame, Pill, Activity } from 'lucide-react';

export default function RiskBreakdown({ result, patientData }) {
  if (!result || !patientData) return null;

  const { riskPercentage, prediction } = result;

  // Calculate individual risk factor contributions based on clinical weights
  const isHighChol = patientData.cholesterol > 240;
  const isHighBP = patientData.restingBP > 135;
  const isFlatSlope = patientData.stSlope === 'Flat' || patientData.stSlope === 'Down';
  const isAsyPain = patientData.chestPainType === 'ASY';
  const hasExAngina = patientData.exerciseAngina === 'Y';
  const isElevatedOldpeak = patientData.oldpeak > 1.0;

  const factorContributions = [
    {
      name: 'Exercise ST Slope',
      value: isFlatSlope ? 'Flat / Downsloping (High Risk Factor)' : 'Upsloping (Normal Response)',
      riskImpact: isFlatSlope ? 'High' : 'Normal',
      weightScore: isFlatSlope ? 85 : 15,
      color: isFlatSlope ? 'rose' : 'emerald'
    },
    {
      name: 'Chest Pain Presentation',
      value: isAsyPain ? 'Asymptomatic (Silent Ischemia Factor)' : `${patientData.chestPainType} (Typical/Atypical)`,
      riskImpact: isAsyPain ? 'High' : 'Moderate',
      weightScore: isAsyPain ? 80 : 25,
      color: isAsyPain ? 'rose' : 'amber'
    },
    {
      name: 'ST Depression (Oldpeak)',
      value: `${patientData.oldpeak} mm ST depression`,
      riskImpact: isElevatedOldpeak ? 'High' : 'Normal',
      weightScore: isElevatedOldpeak ? 75 : 20,
      color: isElevatedOldpeak ? 'rose' : 'emerald'
    },
    {
      name: 'Exercise-Induced Angina',
      value: hasExAngina ? 'Positive (Induced by exertion)' : 'Negative (No exertion angina)',
      riskImpact: hasExAngina ? 'High' : 'Normal',
      weightScore: hasExAngina ? 70 : 10,
      color: hasExAngina ? 'rose' : 'emerald'
    },
    {
      name: 'Serum Cholesterol',
      value: `${patientData.cholesterol} mg/dL`,
      riskImpact: isHighChol ? 'Elevated' : 'Desirable',
      weightScore: isHighChol ? 65 : 30,
      color: isHighChol ? 'amber' : 'emerald'
    },
    {
      name: 'Resting Blood Pressure',
      value: `${patientData.restingBP} mm Hg`,
      riskImpact: isHighBP ? 'Stage 1/2 Hypertension' : 'Normotensive',
      weightScore: isHighBP ? 60 : 25,
      color: isHighBP ? 'amber' : 'emerald'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Risk Factors Matrix */}
      <div className="glass-panel p-5 sm:p-7 rounded-2xl border border-slate-800 shadow-xl">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2 mb-4">
          <BarChart2 className="w-4 h-4 shrink-0" />
          <span>Diagnostic Factor Weight Analysis</span>
        </h3>

        <div className="space-y-3">
          {factorContributions.map((item, idx) => (
            <div 
              key={idx} 
              className="p-3 sm:p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm font-semibold text-white">{item.name}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                    item.color === 'rose'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : item.color === 'amber'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {item.riskImpact}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{item.value}</p>
              </div>

              {/* Responsive Progress Bar */}
              <div className="w-full sm:w-44 flex items-center space-x-2.5">
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      item.color === 'rose'
                        ? 'bg-rose-500'
                        : item.color === 'amber'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${item.weightScore}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-400 w-8 text-right shrink-0">{item.weightScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Targeted Health Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Diet Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <Apple className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cardio Nutrition</h4>
                <p className="text-[11px] text-slate-400">Dietary Intervention</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Adopt low-sodium Mediterranean or DASH diet patterns. Focus on omega-3 fatty acids, soluble fiber to manage cholesterol ({patientData.cholesterol} mg/dL).
            </p>
          </div>
        </div>

        {/* Exercise Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Target Heart Rate</h4>
                <p className="text-[11px] text-slate-400">Physical Conditioning</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Aim for 150 min/week of moderate aerobic training. Keep within target aerobic threshold given max recorded HR of {patientData.maxHR} bpm.
            </p>
          </div>
        </div>

        {/* Clinical Monitoring */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2.5 rounded-xl shrink-0 ${
                prediction === 1
                  ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                  : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              }`}>
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Clinical Surveillance</h4>
                <p className="text-[11px] text-slate-400">Cardiology Follow-Up</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {prediction === 1
                ? 'Clinical consultation recommended to evaluate ST segment depression and exercise angina indications.'
                : 'Routine annual check-up with standard lipid panel and blood pressure tracking recommended.'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
