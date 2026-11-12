import React, { useEffect } from 'react';
import { Stethoscope, Printer, X, FileCheck } from 'lucide-react';

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

  const isHigh = result.riskPercentage >= 70;
  const isModerate = result.riskPercentage >= 35 && result.riskPercentage < 70;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 flex justify-center items-start sm:items-center no-scrollbar"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl glass-panel bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 sm:p-7 my-4 sm:my-8 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Modal"
          className="no-print absolute top-3 right-3 sm:top-5 sm:right-5 z-20 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Modal Header Controls (Hidden during print) */}
        <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-slate-800 pr-10 shrink-0">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs sm:text-sm">
            <FileCheck className="w-5 h-5 shrink-0" />
            <span>Clinical Diagnostic Report Preview</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950/50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Scrollable Printable Card Area */}
        <div id="printable-area" className="overflow-y-auto space-y-5 text-slate-100 pr-1 sm:pr-2 no-scrollbar flex-1">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-800 pb-4 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-6 h-6 text-emerald-400 shrink-0" />
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">CardioPulse Diagnostic Summary</h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Automated Cardiovascular Risk Stratification Report</p>
            </div>

            <div className="text-left sm:text-right text-xs font-mono">
              <div className="text-slate-300 font-semibold">Assessment ID: #{id}</div>
              <div className="text-slate-400 text-[11px] mt-0.5">{new Date(timestamp).toLocaleString()}</div>
            </div>
          </div>

          {/* Patient Profile Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Age / Sex</span>
              <div className="text-xs sm:text-sm font-semibold text-white mt-0.5">{patientData.age} Yrs ({patientData.sex === 'M' ? 'Male' : 'Female'})</div>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Blood Pressure</span>
              <div className="text-xs sm:text-sm font-semibold text-white mt-0.5">{patientData.restingBP} mm Hg</div>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Serum Cholesterol</span>
              <div className="text-xs sm:text-sm font-semibold text-white mt-0.5">{patientData.cholesterol} mg/dL</div>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Max Heart Rate</span>
              <div className="text-xs sm:text-sm font-semibold text-white mt-0.5">{patientData.maxHR} bpm</div>
            </div>
          </div>

          {/* Diagnostic Factors Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Diagnostic Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex justify-between">
                <span className="text-slate-400">Chest Pain Type:</span>
                <span className="font-semibold text-white">{patientData.chestPainType}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex justify-between">
                <span className="text-slate-400">Fasting Blood Sugar:</span>
                <span className="font-semibold text-white">{patientData.fastingBS === 1 ? '> 120 mg/dL' : '< 120 mg/dL'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex justify-between">
                <span className="text-slate-400">Resting ECG:</span>
                <span className="font-semibold text-white">{patientData.restingECG}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex justify-between">
                <span className="text-slate-400">Exercise Angina:</span>
                <span className="font-semibold text-white">{patientData.exerciseAngina === 'Y' ? 'Positive' : 'Negative'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex justify-between">
                <span className="text-slate-400">ST Depression (Oldpeak):</span>
                <span className="font-semibold text-white">{patientData.oldpeak} mm</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex justify-between">
                <span className="text-slate-400">ST Slope Response:</span>
                <span className="font-semibold text-white">{patientData.stSlope}</span>
              </div>
            </div>
          </div>

          {/* Model Outcome Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Predicted Disease Probability</span>
              <div className={`text-2xl sm:text-3xl font-black mt-0.5 ${
                isHigh ? 'text-rose-400' : isModerate ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {result.riskPercentage}%
              </div>
              <div className="text-xs text-slate-300 mt-0.5">Classification: <strong>{result.riskLevel} Risk</strong></div>
            </div>

            <div className="text-left sm:text-right max-w-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Clinical Recommendation</span>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{result.recommendation}</p>
            </div>
          </div>

          {/* Signature / Disclaimer Footer */}
          <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-slate-400 gap-3">
            <div>
              <p>Generated by CardioPulse Machine Learning Microservice Pipeline.</p>
              <p className="mt-0.5">Notice: This system serves as a decision support aid and is not a replacement for clinical physician evaluation.</p>
            </div>
            <div className="border-t border-slate-800 sm:border-t-0 pt-2 sm:pt-0 font-mono text-slate-400">
              Attending Clinician: ____________________
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
