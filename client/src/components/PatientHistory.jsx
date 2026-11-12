import React, { useState } from 'react';
import { History, Search, Download, Trash2, Calendar, FileText, ChevronRight, Activity } from 'lucide-react';

export default function PatientHistory({ history, onSelectRecord, onClearHistory }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');

  const filteredHistory = (history || []).filter((item) => {
    const matchesSearch =
      String(item.patientData?.age).includes(searchTerm) ||
      String(item.patientData?.sex).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'All' || item.result?.riskLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const exportToCSV = () => {
    if (!history || history.length === 0) return;
    
    const headers = ['ID', 'Date', 'Age', 'Sex', 'RestingBP', 'Cholesterol', 'MaxHR', 'Oldpeak', 'RiskPercentage', 'RiskLevel'];
    const rows = history.map((item) => [
      item.id,
      new Date(item.timestamp).toLocaleString(),
      item.patientData.age,
      item.patientData.sex,
      item.patientData.restingBP,
      item.patientData.cholesterol,
      item.patientData.maxHR,
      item.patientData.oldpeak,
      item.result.riskPercentage,
      item.result.riskLevel
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cardio_patient_records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel p-5 sm:p-7 rounded-2xl border border-slate-800 shadow-xl space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Patient Assessment Audit Log</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Logged diagnostic assessments and records</p>
        </div>

        <div className="flex items-center space-x-2">
          {history.length > 0 && (
            <>
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={onClearHistory}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium border border-rose-500/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Patient ID, Age, or Sex..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-3.5 py-2 sm:py-2.5 rounded-xl glass-input text-xs sm:w-44"
        >
          <option value="All" className="bg-slate-900">All Risk Levels</option>
          <option value="High" className="bg-slate-900">High Risk</option>
          <option value="Moderate" className="bg-slate-900">Moderate Risk</option>
          <option value="Low" className="bg-slate-900">Low Risk</option>
        </select>
      </div>

      {/* Empty State */}
      {filteredHistory.length === 0 ? (
        <div className="p-10 text-center text-slate-500 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <FileText className="w-10 h-10 mx-auto mb-2.5 text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">No Records Found</p>
          <p className="text-xs text-slate-400 mt-1">Execute a clinical assessment to populate the audit log.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card List (visible on screens < md) */}
          <div className="md:hidden space-y-3">
            {filteredHistory.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelectRecord(item)}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 active:scale-[0.99] transition-all cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-emerald-400 font-semibold">{item.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    item.result.riskLevel === 'High'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : item.result.riskLevel === 'Moderate'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {item.result.riskLevel} ({item.result.riskPercentage}%)
                  </span>
                </div>

                <div className="text-xs text-slate-300 flex items-center justify-between">
                  <span>{item.patientData.age} y/o ({item.patientData.sex === 'M' ? 'Male' : 'Female'})</span>
                  <span className="text-slate-400">BP: {item.patientData.restingBP} | Chol: {item.patientData.cholesterol}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  <span className="text-emerald-400 font-medium inline-flex items-center">
                    Report Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (visible on screens >= md) */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Scan ID & Date</th>
                  <th className="py-3 px-4">Patient Profile</th>
                  <th className="py-3 px-4">Key Diagnostics (BP / Chol / MaxHR)</th>
                  <th className="py-3 px-4 text-center">Risk Score</th>
                  <th className="py-3 px-4 text-center">Category</th>
                  <th className="py-3 px-4 text-right">Diagnostic Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/50">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-200 font-semibold">{item.id}</div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-200">{item.patientData.age} yrs</span>
                      <span className="text-slate-400 ml-1">({item.patientData.sex === 'M' ? 'Male' : 'Female'})</span>
                      <div className="text-[11px] text-slate-400">Chest Pain: {item.patientData.chestPainType}</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      <div>BP: {item.patientData.restingBP} | Chol: {item.patientData.cholesterol}</div>
                      <div className="text-[11px] text-slate-400">MaxHR: {item.patientData.maxHR} bpm</div>
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-sm">
                      <span className={
                        item.result.riskPercentage >= 70
                          ? 'text-rose-400'
                          : item.result.riskPercentage >= 35
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }>
                        {item.result.riskPercentage}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.result.riskLevel === 'High'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : item.result.riskLevel === 'Moderate'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {item.result.riskLevel}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectRecord(item)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        <span>View Report</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
}
