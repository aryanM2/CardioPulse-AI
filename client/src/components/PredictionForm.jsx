import React, { useState } from 'react';
import { User, HeartPulse, Activity, Stethoscope, RefreshCw, ArrowRight, Bookmark } from 'lucide-react';

const PRESETS = {
  healthy: {
    age: 38,
    sex: 'M',
    restingBP: 118,
    cholesterol: 185,
    fastingBS: 0,
    chestPainType: 'ATA',
    restingECG: 'Normal',
    maxHR: 172,
    exerciseAngina: 'N',
    oldpeak: 0.0,
    stSlope: 'Up'
  },
  moderate: {
    age: 54,
    sex: 'M',
    restingBP: 138,
    cholesterol: 235,
    fastingBS: 0,
    chestPainType: 'NAP',
    restingECG: 'ST',
    maxHR: 142,
    exerciseAngina: 'N',
    oldpeak: 1.2,
    stSlope: 'Flat'
  },
  highRisk: {
    age: 63,
    sex: 'M',
    restingBP: 160,
    cholesterol: 288,
    fastingBS: 1,
    chestPainType: 'ASY',
    restingECG: 'LVH',
    maxHR: 108,
    exerciseAngina: 'Y',
    oldpeak: 2.8,
    stSlope: 'Flat'
  }
};

export default function PredictionForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState(PRESETS.healthy);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = value;
    if (type === 'number') {
      val = value === '' ? '' : Number(value);
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleApplyPreset = (presetKey) => {
    setFormData(PRESETS[presetKey]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-panel p-5 sm:p-7 rounded-2xl border border-slate-800 shadow-xl">
      
      {/* Header & Clinical Preset Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Clinical Patient Assessment</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Input clinical diagnostics or load a standardized baseline profile
          </p>
        </div>

        {/* Presets Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider flex items-center space-x-1 mr-1">
            <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
            <span>Presets:</span>
          </span>
          <button
            type="button"
            onClick={() => handleApplyPreset('healthy')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
          >
            Healthy
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('moderate')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
          >
            Moderate
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('highRisk')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
          >
            High Risk
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        
        {/* SECTION 1: Patient Demographics & Baseline Vitals */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2 mb-3.5">
            <User className="w-4 h-4" />
            <span>1. Patient Demographics & Baseline Vitals</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            
            {/* Age */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Age <span className="text-slate-400 font-normal">(years)</span>
              </label>
              <input
                type="number"
                name="age"
                min="18"
                max="110"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            {/* Sex */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Biological Sex</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:py-2.5 rounded-xl glass-input text-sm"
              >
                <option value="M" className="bg-slate-900">Male</option>
                <option value="F" className="bg-slate-900">Female</option>
              </select>
            </div>

            {/* Resting Blood Pressure */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Resting BP <span className="text-slate-400 font-normal">(mm Hg)</span>
              </label>
              <input
                type="number"
                name="restingBP"
                min="60"
                max="240"
                value={formData.restingBP}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            {/* Serum Cholesterol */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Cholesterol <span className="text-slate-400 font-normal">(mg/dL)</span>
              </label>
              <input
                type="number"
                name="cholesterol"
                min="0"
                max="700"
                value={formData.cholesterol}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

          </div>
        </div>

        {/* SECTION 2: Cardiac Symptoms & Metabolism */}
        <div className="pt-4 border-t border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center space-x-2 mb-3.5">
            <HeartPulse className="w-4 h-4" />
            <span>2. Symptoms & Metabolic Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            
            {/* Chest Pain Type */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Chest Pain Type</label>
              <select
                name="chestPainType"
                value={formData.chestPainType}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:py-2.5 rounded-xl glass-input text-sm"
              >
                <option value="ASY" className="bg-slate-900">Asymptomatic (ASY)</option>
                <option value="NAP" className="bg-slate-900">Non-Anginal Pain (NAP)</option>
                <option value="ATA" className="bg-slate-900">Atypical Angina (ATA)</option>
                <option value="TA" className="bg-slate-900">Typical Angina (TA)</option>
              </select>
            </div>

            {/* Fasting Blood Sugar */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Fasting Sugar <span className="text-slate-400 font-normal">(&gt; 120 mg/dL)</span>
              </label>
              <select
                name="fastingBS"
                value={formData.fastingBS}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:py-2.5 rounded-xl glass-input text-sm"
              >
                <option value={0} className="bg-slate-900">No (&le; 120 mg/dL)</option>
                <option value={1} className="bg-slate-900">Yes (&gt; 120 mg/dL)</option>
              </select>
            </div>

            {/* Exercise Angina */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Exercise-Induced Angina</label>
              <select
                name="exerciseAngina"
                value={formData.exerciseAngina}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:py-2.5 rounded-xl glass-input text-sm"
              >
                <option value="N" className="bg-slate-900">No (Angina Negative)</option>
                <option value="Y" className="bg-slate-900">Yes (Angina Positive)</option>
              </select>
            </div>

          </div>
        </div>

        {/* SECTION 3: Electrocardiogram & Stress Testing */}
        <div className="pt-4 border-t border-slate-800/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2 mb-3.5">
            <Activity className="w-4 h-4" />
            <span>3. Electrocardiogram & Stress Test Diagnostics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            
            {/* Resting ECG */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Resting ECG Results</label>
              <select
                name="restingECG"
                value={formData.restingECG}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:py-2.5 rounded-xl glass-input text-sm"
              >
                <option value="Normal" className="bg-slate-900">Normal</option>
                <option value="ST" className="bg-slate-900">ST-T Wave Abnormality</option>
                <option value="LVH" className="bg-slate-900">Left Ventricular Hypertrophy (LVH)</option>
              </select>
            </div>

            {/* Max Heart Rate */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Max Heart Rate <span className="text-slate-400 font-normal">(bpm)</span>
              </label>
              <input
                type="number"
                name="maxHR"
                min="50"
                max="220"
                value={formData.maxHR}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            {/* Oldpeak ST Depression */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                ST Depression (Oldpeak)
              </label>
              <input
                type="number"
                step="0.1"
                name="oldpeak"
                min="-2.5"
                max="6.5"
                value={formData.oldpeak}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 sm:py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            {/* ST Slope */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Exercise ST Slope</label>
              <select
                name="stSlope"
                value={formData.stSlope}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:py-2.5 rounded-xl glass-input text-sm"
              >
                <option value="Up" className="bg-slate-900">Upsloping (Normal)</option>
                <option value="Flat" className="bg-slate-900">Flat (Ischemia Suspect)</option>
                <option value="Down" className="bg-slate-900">Downsloping (Severe Ischemia)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Submit & Reset Controls */}
        <div className="pt-5 border-t border-slate-800/80 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setFormData(PRESETS.healthy)}
            className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-md shadow-emerald-950/50 hover:shadow-emerald-900/40 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating Diagnostics...</span>
              </>
            ) : (
              <>
                <span>Run Diagnostic Risk Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
