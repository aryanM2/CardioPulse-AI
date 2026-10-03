import React from 'react';
import { BarChart2, CheckCircle, ShieldAlert, Heart, Activity, Apple, Flame, Pill } from 'lucide-react';

export default function RiskBreakdown({ result, patientData }) {
  if (!result || !patientData) return null;

  const { riskPercentage, prediction } = result;

  // Calculate individual risk factor contributions based on logistic regression weights
  const isHighChol = patientData.cholesterol > 240;
  const isHighBP = patientData.restingBP > 135;
  const isFlatSlope = patientData.stSlope === 'Flat' || patientData.stSlope === 'Down';
  const isAsyPain = patientData.chestPainType === 'ASY';
  const hasExAngina = patientData.exerciseAngina === 'Y';
  const isElevatedOldpeak = patientData.oldpeak > 1.0;

  const factorContributions = [
    {
      name: 'ST Slope Response',
      value: isFlatSlope ? 'Flat / Downsloping (High Impact)' : 'Normal Upsloping',
      riskImpact: isFlatSlope ? 'High' : 'Low',
      weightScore: isFlatSlope ? 85 : 15,
      color: isFlatSlope ? 'rose' : 'emerald'
    },
    {
      name: 'Chest Pain Type',
      value: isAsyPain ? 'Asymptomatic (Silent Ischemia)' : patientData.chestPainType,
      riskImpact: isAsyPain ? 'High' : 'Moderate',
      weightScore: isAsyPain ? 80 : 25,
      color: isAsyPain ? 'rose' : 'amber'
    },
    {
      name: 'ST Depression (Oldpeak)',
      value: `${patientData.oldpeak} mm`,
      riskImpact: isElevatedOldpeak ? 'High' : 'Normal',
      weightScore: isElevatedOldpeak ? 75 : 20,
      color: isElevatedOldpeak ? 'rose' : 'emerald'
    },
    {
      name: 'Exercise Induced Angina',
      value: hasExAngina ? 'Positive (Ischemia Triggered)' : 'Negative',
      riskImpact: hasExAngina ? 'High' : 'Low',
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
      riskImpact: isHighBP ? 'Stage 1/2 Hypertension' : 'Optimal',
      weightScore: isHighBP ? 60 : 25,
      color: isHighBP ? 'amber' : 'emerald'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Risk Factors Matrix */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2 mb-4">
          <BarChart2 className="w-4 h-4 text-rose-500" />
          <span>Key Diagnostic Factor Breakdown</span>
        </h3>

        <div className="space-y-3">
          {factorContributions.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white">{item.name}</span>
                  <span className={`px-2 py-0.5 text-3xs font-bold uppercase rounded-md border ${
                    item.color === 'rose'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : item.color === 'amber'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {item.riskImpact}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{item.value}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full sm:w-36 flex items-center space-x-2">
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
                <span className="text-2xs font-mono text-slate-400 w-8 text-right">{item.weightScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Targeted Health Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Diet Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cardio-DASH Nutrition</h4>
              <p className="text-3xs text-slate-400">Dietary Intervention</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Adopt low-sodium Mediterranean or DASH diet patterns. Focus on omega-3 fatty acids, soluble fiber to manage cholesterol ({patientData.cholesterol} mg/dL).
          </p>
        </div>

        {/* Exercise Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Physical Conditioning</h4>
              <p className="text-3xs text-slate-400">Target Heart Rate</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Aim for 150 min/week of moderate aerobic training. Maintain heart rate within zone 2 (110-140 bpm) given max recorded HR of {patientData.maxHR} bpm.
          </p>
        </div>

        {/* Clinical Monitoring */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Clinical Surveillance</h4>
              <p className="text-3xs text-slate-400">Cardiology Monitoring</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {prediction === 1
              ? 'Schedule stress echocardiogram or coronary CTA to evaluate ST segment changes and exercise angina signals.'
              : 'Annual check-up with lipids profile and BP tracking recommended to keep risk parameters low.'}
          </p>
        </div>

      </div>

    </div>
  );
}
