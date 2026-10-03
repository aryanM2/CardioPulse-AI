import React, { useState } from 'react';
import { History, Search, Download, Trash2, Calendar, FileText, ChevronRight } from 'lucide-react';

export default function PatientHistory({ history, onSelectRecord, onClearHistory }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');

  const filteredHistory = (history || []).filter((item) => {
    const matchesSearch =
      String(item.patientData?.age).includes(searchTerm) ||
      String(item.patientData?.sex).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.id).includes(searchTerm);
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
    link.setAttribute('download', `heart_disease_patient_records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-rose-500" />
            <span>Patient Assessment Audit Log</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Saved patient diagnostic records & history logs</p>
        </div>

        <div className="flex items-center space-x-2">
          {history.length > 0 && (
            <>
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={onClearHistory}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Patient ID, Age, or Sex..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-3.5 py-2 rounded-xl glass-input text-xs"
        >
          <option value="All" className="bg-slate-900">All Risk Levels</option>
          <option value="High" className="bg-slate-900">High Risk</option>
          <option value="Moderate" className="bg-slate-900">Moderate Risk</option>
          <option value="Low" className="bg-slate-900">Low Risk</option>
        </select>
      </div>

      {/* History Table */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center text-slate-500 rounded-2xl bg-slate-900/50 border border-slate-800/80">
          <FileText className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">No Patient Records Found</p>
          <p className="text-xs text-slate-400 mt-1">Run an assessment form to populate diagnostic audit history.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-3xs border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Scan ID & Date</th>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Key Vitals (BP / Chol / MaxHR)</th>
                <th className="py-3 px-4 text-center">Risk Score</th>
                <th className="py-3 px-4 text-center">Tier</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono text-slate-200 font-semibold">{item.id}</div>
                    <div className="text-3xs text-slate-400 flex items-center space-x-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-200">{item.patientData.age} y/o</span>
                    <span className="text-slate-400 ml-1">({item.patientData.sex === 'M' ? 'Male' : 'Female'})</span>
                    <div className="text-3xs text-slate-400">Chest Pain: {item.patientData.chestPainType}</div>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-300">
                    <div>BP: {item.patientData.restingBP} | Chol: {item.patientData.cholesterol}</div>
                    <div className="text-3xs text-slate-400">MaxHR: {item.patientData.maxHR} bpm</div>
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
                    <span className={`px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider border ${
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
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
