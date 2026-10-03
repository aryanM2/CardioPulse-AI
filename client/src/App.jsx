import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PredictionForm from './components/PredictionForm';
import RiskGauge from './components/RiskGauge';
import RiskBreakdown from './components/RiskBreakdown';
import WhatIfSimulator from './components/WhatIfSimulator';
import PatientHistory from './components/PatientHistory';
import ModelSpecModal from './components/ModelSpecModal';
import PrintableReport from './components/PrintableReport';
import { predictHeartDisease, checkHealth } from './services/api';
import { Heart, Activity, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [apiStatus, setApiStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedRecordForReport, setSelectedRecordForReport] = useState(null);

  // Check backend health on mount
  useEffect(() => {
    async function verifyHealth() {
      const status = await checkHealth();
      setApiStatus(status);
    }
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // Load history from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cardio_pulse_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed loading patient history:', e);
    }
  }, []);

  // Save history to LocalStorage
  const saveToHistory = (newRecord) => {
    const updated = [newRecord, ...history].slice(0, 50); // keep last 50
    setHistory(updated);
    try {
      localStorage.setItem('cardio_pulse_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed saving patient history:', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cardio_pulse_history');
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await predictHeartDisease(formData);
      setPatientData(formData);
      setResult(res);

      // Create history record
      const record = {
        id: `CARDIO-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString(),
        patientData: formData,
        result: res
      };
      saveToHistory(record);
    } catch (err) {
      console.error('Prediction failed:', err);
      setError(err.message || 'ML Prediction Failed');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

      {/* Header Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} apiStatus={apiStatus} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {activeTab === 'assessment' && (
          <div className="space-y-8">
            {/* Error Alert Box */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start space-x-3 shadow-lg">
                <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <h4 className="font-bold text-sm text-rose-200">ML Microservice Error Alert</h4>
                  <p className="mt-1 leading-relaxed">{error}</p>
                  <p className="mt-1 text-2xs text-rose-400">Please ensure python microservice <code className="bg-rose-950 px-1 py-0.5 rounded border border-rose-800 text-rose-200">ml_service/main.py</code> is running on port 8000 and pickle artifacts (<code className="bg-rose-950 px-1 py-0.5 rounded border border-rose-800 text-rose-200">model.pkl</code> and <code className="bg-rose-950 px-1 py-0.5 rounded border border-rose-800 text-rose-200">scaler.pkl</code>) are loaded.</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-xs font-bold text-rose-400 hover:text-rose-200 px-2 py-1 rounded bg-rose-950/60 border border-rose-800/80"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Top Grid: Form + Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Form Input (7 cols) */}
              <div className="lg:col-span-7">
                <PredictionForm onSubmit={handleFormSubmit} loading={loading} />
              </div>

              {/* Risk Gauge Output (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-start">
                {result ? (
                  <div className="space-y-4 sticky top-28">
                    <RiskGauge
                      riskPercentage={result.riskPercentage}
                      riskLevel={result.riskLevel}
                      prediction={result.prediction}
                      recommendation={result.recommendation}
                      source={result.source}
                    />

                    {/* Report Export Button */}
                    <button
                      onClick={() => setSelectedRecordForReport({
                        id: `CARDIO-LATEST`,
                        timestamp: new Date().toISOString(),
                        patientData,
                        result
                      })}
                      className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg"
                    >
                      <Sparkles className="w-4 h-4 text-rose-400" />
                      <span>View Printable Diagnostic Report</span>
                    </button>
                  </div>
                ) : (
                  <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center h-full min-h-[380px] bg-gradient-to-b from-slate-900 to-slate-950">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4 animate-pulse">
                      <Heart className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-white">Ready for Risk Evaluation</h3>
                    <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                      Fill in the clinical diagnostic form or pick a preset profile to execute ML model inference.
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Grid: Feature Breakdown (if result exists) */}
            {result && patientData && (
              <RiskBreakdown result={result} patientData={patientData} />
            )}
          </div>
        )}

        {/* Tab 2: What-If Simulator */}
        {activeTab === 'simulator' && (
          <WhatIfSimulator initialPatientData={patientData} />
        )}

        {/* Tab 3: Patient History */}
        {activeTab === 'history' && (
          <PatientHistory
            history={history}
            onSelectRecord={(rec) => setSelectedRecordForReport(rec)}
            onClearHistory={handleClearHistory}
          />
        )}

        {/* Tab 4: Model Specifications */}
        {activeTab === 'model' && (
          <ModelSpecModal />
        )}

      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-2xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-rose-500" />
            <span className="font-semibold text-slate-300">CardioPulse AI Engine</span>
            <span>- Heart Disease Risk Prediction</span>
          </div>
          <div>
            Powered by React + Vite + Tailwind CSS + Axios & Scikit-Learn Pickle Artifacts
          </div>
        </div>
      </footer>

      {/* Modal for Printable Clinical Report */}
      {selectedRecordForReport && (
        <PrintableReport
          record={selectedRecordForReport}
          onClose={() => setSelectedRecordForReport(null)}
        />
      )}

    </div>
  );
}
