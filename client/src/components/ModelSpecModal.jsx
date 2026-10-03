import React from 'react';
import { Cpu, CheckCircle, Database, Layers, Binary, ShieldCheck } from 'lucide-react';

export default function ModelSpecModal() {
  const columnsList = [
    'Age', 'isMale', 'RestingBP', 'Cholesterol', 'FastingBS', 'MaxHR',
    'isExerciseAngina', 'Oldpeak', 'ChestPainType_ATA', 'ChestPainType_NAP',
    'ChestPainType_TA', 'RestingECG_Normal', 'RestingECG_ST', 'ST_Slope_Flat', 'ST_Slope_Up'
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
        <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Pickle Model & Scaler Architecture</h2>
          <p className="text-xs text-slate-400 mt-0.5">Specifications of `model.pkl`, `scaler.pkl`, and `columns.pkl`</p>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
            <Layers className="w-4 h-4" />
            <span>Classifier Artifact</span>
          </div>
          <div className="font-mono text-sm text-white font-bold">model.pkl</div>
          <p className="text-2xs text-slate-400">
            Scikit-Learn <strong className="text-slate-300">LogisticRegression</strong> with L2 Penalty and L-BFGS Optimization. Intercept: <code className="text-rose-300">0.2705</code>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
            <Database className="w-4 h-4" />
            <span>Scaler Artifact</span>
          </div>
          <div className="font-mono text-sm text-white font-bold">scaler.pkl</div>
          <p className="text-2xs text-slate-400">
            Scikit-Learn <strong className="text-slate-300">StandardScaler</strong> z-score transformation matrix with 15 standard deviation vectors.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
            <Binary className="w-4 h-4" />
            <span>Columns Schema</span>
          </div>
          <div className="font-mono text-sm text-white font-bold">columns.pkl</div>
          <p className="text-2xs text-slate-400">
            15 dummy-encoded categorical & numeric clinical features matching the Kaggle UCI Heart Failure Dataset.
          </p>
        </div>

      </div>

      {/* Columns Grid */}
      <div className="pt-4 border-t border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">15 Encoded Feature Columns</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {columnsList.map((col, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-3xs font-mono text-slate-300 flex items-center space-x-1.5">
              <span className="text-rose-400 font-bold">#{i + 1}</span>
              <span className="truncate">{col}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
