import React, { useState } from 'react';
import {
  FileText,
  Eye,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { INITIAL_REPORTS } from '../data/reports';
import { SafetyReport } from '../types';
import { Modal } from '../components/Modal';

export const Reports: React.FC = () => {
  const [reports] = useState<SafetyReport[]>(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState<SafetyReport | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const filtered = reports.filter((r) => {
    if (filterType === 'All') return true;
    return r.type === filterType;
  });

  const handleDownload = (report: SafetyReport) => {
    const reportText = `SAFEFACTORY INDUSTRIAL SAFETY DOSSIER
==================================================
Report ID: ${report.id}
Title: ${report.title}
Period: ${report.period}
Date: ${report.date}
Author: ${report.author}
Compliance Score: ${report.complianceScore}%
Total Violations: ${report.totalViolations} (Critical: ${report.criticalCount}, Warnings: ${report.warningsCount})

EXECUTIVE SUMMARY:
${report.summary}

KEY AUDIT FINDINGS:
${report.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}

==================================================
Logged via SafeFactory Vision Telemetry OS`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.id}_Safety_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Downloaded ${report.id}`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Safety Dossiers & Compliance Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Formal audit documentation, daily shift dossiers, and regulatory PPE compliance records.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs text-xs">
          {['All', 'Daily', 'Weekly', 'Monthly', 'PPE', 'Department', 'Camera'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === t
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                  {report.id}
                </span>
                <span className="font-display font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {report.complianceScore}% Score
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-slate-900 tracking-tight">
                {report.title}
              </h3>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">{report.period}</div>

              <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">
                {report.summary}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs font-mono">
              <div className="p-2 bg-slate-50 rounded border border-slate-200/60">
                <span className="text-[10px] text-slate-400 uppercase block">Violations</span>
                <span className="font-bold text-slate-800">{report.totalViolations} Logged</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200/60">
                <span className="text-[10px] text-slate-400 uppercase block">Criticals</span>
                <span className="font-bold text-rose-600">{report.criticalCount} Breaches</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedReport(report)}
                className="flex-1 py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>

              <button
                onClick={() => {
                  setSelectedReport(report);
                  setTimeout(() => window.print(), 100);
                }}
                className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
                title="Print Report"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDownload(report)}
                className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors"
                title="Download Report File"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Dossier Viewer Modal */}
      {selectedReport && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReport(null)}
          title={selectedReport.title}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs text-slate-700">
            {/* Header Block */}
            <div className="p-4 bg-slate-900 text-white rounded-xl flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">
                  OFFICIAL SAFETY DOSSIER
                </span>
                <h3 className="font-display font-bold text-lg text-white mt-0.5">
                  {selectedReport.title}
                </h3>
                <div className="text-xs text-slate-400 mt-1">
                  {selectedReport.period} · Author: {selectedReport.author}
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-display font-bold text-emerald-400">
                  {selectedReport.complianceScore}%
                </span>
                <div className="text-[10px] text-slate-400 uppercase">Compliance Index</div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center font-mono">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-base font-bold text-slate-900">{selectedReport.totalViolations}</div>
                <div className="text-[10px] text-slate-400 uppercase">Total Violations</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-base font-bold text-rose-600">{selectedReport.criticalCount}</div>
                <div className="text-[10px] text-slate-400 uppercase">Critical Infractions</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-base font-bold text-amber-700">{selectedReport.warningsCount}</div>
                <div className="text-[10px] text-slate-400 uppercase">Warnings Issued</div>
              </div>
            </div>

            {/* Executive Summary */}
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                Executive Audit Summary
              </h4>
              <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 leading-relaxed text-slate-700">
                {selectedReport.summary}
              </p>
            </div>

            {/* Key Findings */}
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                Key Findings & Supervisory Interventions
              </h4>
              <ul className="space-y-2">
                {selectedReport.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-lg border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
              >
                <Printer className="w-4 h-4" />
                <span>Print Dossier</span>
              </button>

              <button
                onClick={() => handleDownload(selectedReport)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Report Text</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
