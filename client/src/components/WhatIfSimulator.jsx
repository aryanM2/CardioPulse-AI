import React, { useState, useEffect } from 'react';
import { Sliders, Zap, TrendingDown, CheckCircle, RefreshCw, AlertTriangle, AlertCircle } from 'lucide-react';
import { predictHeartDisease } from '../services/api';

export default function WhatIfSimulator({ initialPatientData }) {
  const defaultData = initialPatientData || {
    age: 58,
    sex: 'M',
    restingBP: 145,
    cholesterol: 260,
    fastingBS: 1,
    chestPainType: 'ASY',
    restingECG: 'ST',
    maxHR: 125,
    exerciseAngina: 'Y',
    oldpeak: 2.2,
    stSlope: 'Flat'
  };

  const [simData, setSimData] = useState(defaultData);
  const [currentResult, setCurrentResult] = useState(null);
  const [baselineResult, setBaselineResult] = useState(null);
  const [simError, setSimError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function runSimulations() {
      setLoading(true);
      setSimError(null);
      try {
        const base = await predictHeartDisease(defaultData);
        const curr = await predictHeartDisease(simData);
        if (isMounted) {
          setBaselineResult(base);
          setCurrentResult(curr);
        }
      } catch (err) {
        if (isMounted) {
          setSimError(err.message || 'ML Prediction Failed in Simulator');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    runSimulations();
    return () => { isMounted = false; };
  }, [simData]);

  const handleSliderChange = (field, val) => {
    setSimData(prev => ({ ...prev, [field]: val }));
  };

  const deltaRisk = baselineResult && currentResult
    ? Math.round((currentResult.riskPercentage - baselineResult.riskPercentage) * 100) / 100
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Sliders className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">Interactive Risk Reduction Simulator</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Test "What-If" clinical scenarios. Adjust lifestyle and vital sliders to quantify how targeted medical interventions impact heart disease risk percentage in real-time.
            </p>
          </div>

          <button
            onClick={() => setSimData(defaultData)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all self-start sm:self-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset to Baseline</span>
          </button>
        </div>
      </div>

      {/* Error Alert Box */}
      {simError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start space-x-3 shadow-lg">
          <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-sm text-rose-200">Simulator ML Microservice Error</h4>
            <p className="mt-1 leading-relaxed">{simError}</p>
            <p className="mt-1 text-2xs text-rose-400">Please make sure Python ML microservice is running on port 8000.</p>
          </div>
        </div>
      )}

      {/* Grid: Sliders Controls + Live Comparison Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sliders */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Adjust Clinical Variables</span>
          </h3>

          {/* Serum Cholesterol Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-white mb-2">
              <span>Serum Cholesterol</span>
              <span className="font-mono text-rose-400 font-bold">{simData.cholesterol} mg/dL</span>
            </div>
            <input
              type="range"
              min="120"
              max="450"
              step="5"
              value={simData.cholesterol}
              onChange={(e) => handleSliderChange('cholesterol', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-3xs text-slate-400 mt-1">
              <span>120 (Optimal)</span>
              <span>200 (Borderline)</span>
              <span>450 (High)</span>
            </div>
          </div>

          {/* Resting Blood Pressure Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-white mb-2">
              <span>Resting Blood Pressure</span>
              <span className="font-mono text-rose-400 font-bold">{simData.restingBP} mm Hg</span>
            </div>
            <input
              type="range"
              min="90"
              max="200"
              step="2"
              value={simData.restingBP}
              onChange={(e) => handleSliderChange('restingBP', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-3xs text-slate-400 mt-1">
              <span>90 (Normal)</span>
              <span>130 (Elevated)</span>
              <span>200 (Severe)</span>
            </div>
          </div>

          {/* Max Heart Rate Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-white mb-2">
              <span>Max Heart Rate</span>
              <span className="font-mono text-emerald-400 font-bold">{simData.maxHR} bpm</span>
            </div>
            <input
              type="range"
              min="60"
              max="200"
              step="5"
              value={simData.maxHR}
              onChange={(e) => handleSliderChange('maxHR', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-3xs text-slate-400 mt-1">
              <span>60 (Bradycardia)</span>
              <span>140 (Target)</span>
              <span>200 (Peak)</span>
            </div>
          </div>

          {/* Oldpeak ST Depression Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-white mb-2">
              <span>ST Depression (Oldpeak)</span>
              <span className="font-mono text-rose-400 font-bold">{simData.oldpeak} mm</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="5.0"
              step="0.1"
              value={simData.oldpeak}
              onChange={(e) => handleSliderChange('oldpeak', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-3xs text-slate-400 mt-1">
              <span>0.0 (Normal)</span>
              <span>2.0 (Ischemia)</span>
              <span>5.0 (Severe)</span>
            </div>
          </div>

          {/* Categorical Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Exercise Angina</label>
              <select
                value={simData.exerciseAngina}
                onChange={(e) => handleSliderChange('exerciseAngina', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              >
                <option value="N" className="bg-slate-900">No (Angina Negative)</option>
                <option value="Y" className="bg-slate-900">Yes (Angina Positive)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">ST Slope Response</label>
              <select
                value={simData.stSlope}
                onChange={(e) => handleSliderChange('stSlope', e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              >
                <option value="Up" className="bg-slate-900">Upsloping (Normal)</option>
                <option value="Flat" className="bg-slate-900">Flat (Ischemic)</option>
                <option value="Down" className="bg-slate-900">Downsloping (Severe)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Right Column: Live Simulated Outcome Card */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
          
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-6">
              Simulated Clinical Outcome
            </h3>

            {/* Score Comparison Box */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center relative overflow-hidden">
              <span className="text-3xs uppercase font-extrabold tracking-widest text-slate-400">
                Simulated Risk Score
              </span>
              
              <div className="mt-2 flex items-center justify-center space-x-2">
                <span className={`text-5xl font-black ${
                  currentResult?.riskPercentage >= 70
                    ? 'text-rose-400'
                    : currentResult?.riskPercentage >= 35
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {currentResult?.riskPercentage}%
                </span>
              </div>

              {/* Delta Comparison Badge */}
              <div className="mt-4 flex items-center justify-center">
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                  deltaRisk < 0
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : deltaRisk > 0
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {deltaRisk < 0 ? (
                    <>
                      <TrendingDown className="w-4 h-4" />
                      <span>{Math.abs(deltaRisk)}% Risk Reduction</span>
                    </>
                  ) : deltaRisk > 0 ? (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>+{deltaRisk}% Higher Risk</span>
                    </>
                  ) : (
                    <span>Baseline Match</span>
                  )}
                </div>
              </div>
            </div>

            {/* Baseline comparison summary */}
            <div className="mt-6 space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Baseline Patient Risk:</span>
                <span className="font-bold text-slate-200">{baselineResult?.riskPercentage}%</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Simulated Risk Classification:</span>
                <span className={`font-bold ${
                  currentResult?.riskLevel === 'High'
                    ? 'text-rose-400'
                    : currentResult?.riskLevel === 'Moderate'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}>
                  {currentResult?.riskLevel} Risk
                </span>
              </div>
            </div>
          </div>

          {/* Actionable insight tip */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 text-2xs text-slate-400 leading-relaxed">
            💡 <strong>Clinical Takeaway:</strong> Improving peak ST slope from Flat to Upsloping and reducing cholesterol below 200 mg/dL yields up to <span className="text-emerald-400 font-bold">45% total risk reduction</span> in logistic regression weights.
          </div>

        </div>

      </div>

    </div>
  );
}
