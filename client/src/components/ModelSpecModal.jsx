import React from 'react';
import { Cpu, Layers, Database, Binary, ShieldCheck } from 'lucide-react';

export default function ModelSpecModal() {
  const columnsList = [
    'Age', 'isMale', 'RestingBP', 'Cholesterol', 'FastingBS', 'MaxHR',
    'isExerciseAngina', 'Oldpeak', 'ChestPainType_ATA', 'ChestPainType_NAP',
    'ChestPainType_TA', 'RestingECG_Normal', 'RestingECG_ST', 'ST_Slope_Flat', 'ST_Slope_Up'
  ];

  return (
    <div className="glass-panel p-5 sm:p-7 rounded-2xl border border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center space-x-3 pb-5 border-b border-slate-800/80">
        <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
          <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Machine Learning Model Architecture</h2>
          <p className="text-xs text-slate-400 mt-0.5">Underlying Scikit-Learn serialized artifacts specification</p>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
            <Layers className="w-4 h-4 shrink-0" />
            <span>Classifier Model</span>
          </div>
          <div className="font-mono text-sm text-white font-bold">model.pkl</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Scikit-Learn <strong className="text-slate-200">LogisticRegression / Ensemble</strong> calibrated with L2 Regularization &amp; Sigmoid probability distribution.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs">
            <Database className="w-4 h-4 shrink-0" />
            <span>Feature Scaler</span>
          </div>
          <div className="font-mono text-sm text-white font-bold">scaler.pkl</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Scikit-Learn <strong className="text-slate-200">StandardScaler</strong> z-score transformation matrix fitted strictly across training splits.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
            <Binary className="w-4 h-4 shrink-0" />
            <span>Feature Schema</span>
          </div>
          <div className="font-mono text-sm text-white font-bold">columns.pkl</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            15 dummy-encoded categorical &amp; continuous features conforming to the UCI/Kaggle Heart Disease benchmark dataset.
          </p>
        </div>

      </div>

      {/* Columns Grid */}
      <div className="pt-4 border-t border-slate-800/80">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">15 Encoded Diagnostic Features</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {columnsList.map((col, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800/80 text-[11px] font-mono text-slate-300 flex items-center space-x-2">
              <span className="text-emerald-400 font-bold shrink-0">#{i + 1}</span>
              <span className="truncate">{col}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
