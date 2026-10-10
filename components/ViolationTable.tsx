import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  User,
  Radio,
  FileText
} from 'lucide-react';
import { Violation, Severity } from '../types';
import { SafetyBadge } from './SafetyBadge';

interface ViolationTableProps {
  violations: Violation[];
  onSelectViolation?: (violation: Violation) => void;
  selectedViolationId?: string;
  onResolve?: (id: string) => void;
  onAcknowledge?: (id: string) => void;
}

export const ViolationTable: React.FC<ViolationTableProps> = ({
  violations,
  onSelectViolation,
  selectedViolationId,
  onResolve,
  onAcknowledge,
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const tags = [
    { label: 'All', count: violations.length },
    { label: 'Helmet', count: violations.filter((v) => v.violationType.toLowerCase().includes('helmet')).length },
    { label: 'Eye Protection', count: violations.filter((v) => v.violationType.toLowerCase().includes('eye')).length },
    { label: 'Gloves', count: violations.filter((v) => v.violationType.toLowerCase().includes('glove')).length },
    { label: 'Mobile Phone', count: violations.filter((v) => v.violationType.toLowerCase().includes('phone') || v.violationType.toLowerCase().includes('mobile')).length },
    { label: 'Smoking', count: violations.filter((v) => v.violationType.toLowerCase().includes('smoking')).length },
    { label: 'Idle', count: violations.filter((v) => v.violationType.toLowerCase().includes('idle')).length },
    { label: 'Electrical Safety', count: violations.filter((v) => v.violationType.toLowerCase().includes('electrical') || v.violationType.toLowerCase().includes('arc')).length },
  ];

  // Filtering
  const filteredViolations = violations.filter((v) => {
    // Search
    const matchesSearch =
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      v.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      v.cameraCode.toLowerCase().includes(search.toLowerCase()) ||
      v.department.toLowerCase().includes(search.toLowerCase()) ||
      v.violationType.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Severity
    if (severityFilter !== 'All' && v.severity !== severityFilter) return false;

    // Dept
    if (deptFilter !== 'All' && !v.department.includes(deptFilter)) return false;

    // Tag
    if (selectedTag === 'All') return true;
    if (selectedTag === 'Helmet') return v.violationType.toLowerCase().includes('helmet');
    if (selectedTag === 'Eye Protection') return v.violationType.toLowerCase().includes('eye');
    if (selectedTag === 'Gloves') return v.violationType.toLowerCase().includes('glove');
    if (selectedTag === 'Mobile Phone') return v.violationType.toLowerCase().includes('phone') || v.violationType.toLowerCase().includes('mobile');
    if (selectedTag === 'Smoking') return v.violationType.toLowerCase().includes('smoking');
    if (selectedTag === 'Idle') return v.violationType.toLowerCase().includes('idle');
    if (selectedTag === 'Electrical Safety') return v.violationType.toLowerCase().includes('electrical') || v.violationType.toLowerCase().includes('arc');

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredViolations.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredViolations.map((v) => v.id));
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
      {/* Top Filter Bar */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Employee ID, name, camera..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Severity & Dept Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 outline-hidden"
            >
              <option value="All">Severity: All Severities</option>
              <option value="Critical">Critical</option>
              <option value="Warning">Warning</option>
              <option value="Minor">Minor</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 outline-hidden"
            >
              <option value="All">Dept: All Departments</option>
              <option value="Production">General Production</option>
              <option value="Welding">Robotic Welding</option>
              <option value="Maintenance">Heavy Maintenance</option>
              <option value="Electrical">Electrical</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Packaging">Packaging</option>
            </select>

            {selectedRowIds.length > 0 && onResolve && (
              <button
                onClick={() => {
                  selectedRowIds.forEach((id) => onResolve(id));
                  setSelectedRowIds([]);
                }}
                className="text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-2xs"
              >
                Mark Selected as Resolved ({selectedRowIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Tags:
          </span>
          {tags.map((t) => (
            <button
              key={t.label}
              onClick={() => setSelectedTag(t.label)}
              className={`px-2.5 py-1 rounded-md font-medium shrink-0 transition-colors ${
                selectedTag === t.label
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  checked={
                    filteredViolations.length > 0 &&
                    selectedRowIds.length === filteredViolations.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0"
                />
              </th>
              <th className="p-3">Violation ID</th>
              <th className="p-3">Employee</th>
              <th className="p-3">Dept & Activity</th>
              <th className="p-3">Detected Violation</th>
              <th className="p-3">Camera & Zone</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Severity</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredViolations.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-slate-400">
                  No safety violations match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredViolations.map((v) => {
                const isSelected = selectedViolationId === v.id;
                return (
                  <tr
                    key={v.id}
                    onClick={() => onSelectViolation && onSelectViolation(v)}
                    className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/70 font-medium' : ''
                    }`}
                  >
                    <td className="p-3" onClick={(e) => toggleSelectRow(v.id, e)}>
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(v.id)}
                        onChange={() => {}}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0"
                      />
                    </td>

                    <td className="p-3 font-mono font-bold text-blue-600">
                      {v.id}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {v.employeePhoto ? (
                          <img
                            src={v.employeePhoto}
                            alt={v.employeeName}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                            {v.employeeName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{v.employeeName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{v.employeeId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-slate-800 font-medium">{v.department}</div>
                      <div className="text-[11px] text-slate-500">{v.activity}</div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            v.severity === 'Critical' ? 'bg-rose-600' : 'bg-amber-500'
                          }`}
                        />
                        <span>{v.violationType}</span>
                      </div>
                    </td>

                    <td className="p-3 font-mono text-[11px]">
                      <div className="font-bold text-slate-800">{v.cameraCode}</div>
                      <div className="text-slate-400 truncate max-w-[120px]">{v.location}</div>
                    </td>

                    <td className="p-3 font-mono text-slate-500 whitespace-nowrap">
                      {v.timestamp.replace(' Today', '')}
                    </td>

                    <td className="p-3">
                      <SafetyBadge severity={v.severity} size="sm" />
                    </td>

                    <td className="p-3">
                      <SafetyBadge status={v.status} size="sm" />
                    </td>

                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      {v.status === 'Pending' || v.status === 'In Review' ? (
                        <button
                          onClick={() => onSelectViolation && onSelectViolation(v)}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                          Triage
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectViolation && onSelectViolation(v)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-700">{filteredViolations.length}</span> of{' '}
          <span className="font-bold text-slate-700">{violations.length}</span> recorded violations
        </div>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-400 disabled:opacity-50" disabled>
            &larr; Prev
          </button>
          <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold">1</button>
          <button className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-600">2</button>
          <button className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-600">3</button>
          <button className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100">
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
