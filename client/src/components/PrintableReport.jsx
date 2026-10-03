import React, { useEffect } from 'react';
import { Heart, Printer, X, FileCheck, Stethoscope, Calendar } from 'lucide-react';

export default function PrintableReport({ record, onClose }) {
  if (!record) return null;

  const { patientData, result, timestamp, id } = record;

  // Escape key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 flex justify-center items-start sm:items-center no-scrollbar"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl glass-panel bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-8 my-4 sm:my-8 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Floating Always-Visible Close Button (Top Right) */}
        <button
          onClick={onClose}
          aria-label="Close Modal"
          className="no-print absolute top-3 right-3 sm:top-5 sm:right-5 z-20 p-2.5 rounded-full bg-slate-800/90 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700/80 shadow-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Controls (Hidden during print) */}
        <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-slate-800 pr-10 flex-shrink-0">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs sm:text-sm">
            <FileCheck className="w-5 h-5 flex-shrink-0" />
            <span>Clinical Report Preview</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/30 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Scrollable Printable Card Area */}
        <div id="printable-area" className="overflow-y-auto space-y-5 text-slate-100 pr-1 sm:pr-2 no-scrollbar flex-1">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-800 pb-5 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-rose-500 flex-shrink-0" />
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">CardioPulse AI Diagnostic Report</h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Cardiovascular Machine Learning Risk Assessment Summary</p>
            </div>

            <div className="text-left sm:text-right text-xs font-mono">
              <div className="text-slate-300 font-bold">Report ID: #{id}</div>
              <div className="text-slate-400 text-3xs mt-0.5">{new Date(timestamp).toLocaleString()}</div>
            </div>
          </div>

          {/* Patient Profile Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-3xs font-semibold text-slate-400 uppercase">Age / Sex</span>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">{patientData.age} Yrs ({patientData.sex === 'M' ? 'Male' : 'Female'})</div>
            </div>

            <div>
              <span className="text-3xs font-semibold text-slate-400 uppercase">Blood Pressure</span>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">{patientData.restingBP} mm Hg</div>
            </div>

            <div>
              <span className="text-3xs font-semibold text-slate-400 uppercase">Serum Cholesterol</span>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">{patientData.cholesterol} mg/dL</div>
            </div>

            <div>
              <span className="text-3xs font-semibold text-slate-400 uppercase">Max Heart Rate</span>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">{patientData.maxHR} bpm</div>
            </div>
          </div>

          {/* Diagnostic Factors Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Diagnostic Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Chest Pain Type:</span>
                <span className="font-bold text-white">{patientData.chestPainType}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Fasting Blood Sugar:</span>
                <span className="font-bold text-white">{patientData.fastingBS === 1 ? '> 120 mg/dL' : '< 120 mg/dL'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Resting ECG:</span>
                <span className="font-bold text-white">{patientData.restingECG}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Exercise Angina:</span>
                <span className="font-bold text-white">{patientData.exerciseAngina === 'Y' ? 'Positive' : 'Negative'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex justify-between">
                <span className="text-slate-400">ST Depression (Oldpeak):</span>
                <span className="font-bold text-white">{patientData.oldpeak} mm</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 flex justify-between">
                <span className="text-slate-400">ST Slope Response:</span>
                <span className="font-bold text-white">{patientData.stSlope}</span>
              </div>
            </div>
          </div>

          {/* Model Outcome Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-3xs uppercase font-bold text-slate-400">Predicted Disease Probability</span>
              <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-0.5">{result.riskPercentage}%</div>
              <div className="text-xs text-slate-300 mt-0.5">Classification: <strong>{result.riskLevel} Risk</strong></div>
            </div>

            <div className="text-left sm:text-right max-w-sm">
              <span className="text-3xs uppercase font-bold text-slate-400">Clinical Recommendation</span>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{result.recommendation}</p>
            </div>
          </div>

          {/* Signature / Disclaimer Footer */}
          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-3xs text-slate-400 gap-3">
            <div>
              <p>Certified by CardioPulse AI Machine Learning Engine (`LogisticRegression` + `StandardScaler`).</p>
              <p className="mt-0.5">Disclaimer: This tool assists clinical decisions and does not substitute professional medical diagnosis.</p>
            </div>
            <div className="border-t border-slate-700 sm:border-t-0 pt-2 sm:pt-0 font-mono">
              Attending Physician: ____________________
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
