import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  ExternalLink, 
  MapPin, 
  Calendar, 
  Layers, 
  AlertCircle,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import DepartmentBadge from '../components/DepartmentBadge';

export default function ComplaintsPage({
  complaints,
  onSelectComplaint,
  onOpenNewComplaint,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, severity, id

  // Severity weight for sorting
  const severityWeight = { critical: 4, high: 3, medium: 2, low: 1 };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = c.complaint_id?.toLowerCase().includes(query);
        const matchesDesc = c.description?.toLowerCase().includes(query);
        const matchesLoc = c.location_text?.toLowerCase().includes(query);
        const matchesCat = c.category?.toLowerCase().includes(query);
        if (!matchesId && !matchesDesc && !matchesLoc && !matchesCat) {
          return false;
        }
      }

      // Department filter
      if (selectedDept !== 'all' && c.category !== selectedDept) {
        return false;
      }

      // Severity filter
      if (selectedSeverity !== 'all' && c.severity !== selectedSeverity) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && c.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
      if (sortBy === 'severity') {
        return (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0);
      }
      if (sortBy === 'id') {
        return (a.complaint_id || '').localeCompare(b.complaint_id || '');
      }
      return 0;
    });
  }, [complaints, searchQuery, selectedDept, selectedSeverity, selectedStatus, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('all');
    setSelectedSeverity('all');
    setSelectedStatus('all');
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || selectedDept !== 'all' || selectedSeverity !== 'all' || selectedStatus !== 'all';

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E0D4] gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-stone-900 font-mono tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            Complaint Management & Triage
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Searchable municipal incident log with automated multi-agent classification and routing
          </p>
        </div>

        <button
          onClick={onOpenNewComplaint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 font-bold text-xs font-mono shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4 text-amber-400 stroke-[2.5]" />
          <span>Submit Citizen Complaint</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#E5E0D4] bg-white p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Complaint ID, description keyword, landmark, or sector..."
            className="w-full rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-700 font-mono"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          
          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-stone-600 font-semibold mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-stone-500"
            >
              <option value="all">All Departments ({complaints.length})</option>
              <option value="traffic">Traffic Management</option>
              <option value="safety">Public Safety</option>
              <option value="waste">Waste Management</option>
              <option value="environment">Environmental Monitoring</option>
              <option value="water">Water Management</option>
              <option value="energy">Energy Management</option>
              <option value="general">General Triage</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-stone-600 font-semibold mb-1">
              Severity
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-stone-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-stone-600 font-semibold mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-stone-500"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-stone-600 font-semibold mb-1 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-stone-400" />
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-stone-500"
            >
              <option value="newest">Newest First</option>
              <option value="severity">Highest Severity First</option>
              <option value="id">Complaint ID</option>
            </select>
          </div>

        </div>

        {/* Filter Summary & Reset */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-[#E5E0D4] text-xs font-mono text-stone-600">
            <span>
              Showing <strong className="text-amber-800">{filteredComplaints.length}</strong> of {complaints.length} matching incidents
            </span>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-amber-800 hover:text-amber-900 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}

      </div>

      {/* Complaints Data Table / List */}
      <div className="rounded-2xl border border-[#E5E0D4] bg-white shadow-xs overflow-hidden">
        
        {filteredComplaints.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] mx-auto flex items-center justify-center text-stone-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-mono font-bold text-stone-800">
              No matching complaints found
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No incidents match the applied query or filters. Try adjusting your search or clearing active filters.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="mt-2 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E5E0D4] text-xs font-mono text-amber-800 hover:text-amber-900 font-semibold"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E0D4] bg-[#F4EFEB] text-[11px] font-mono uppercase tracking-wider text-stone-600">
                  <th className="py-3 px-4">Complaint ID</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Date Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5D9] text-xs">
                {filteredComplaints.map((c) => (
                  <tr
                    key={c.complaint_id}
                    onClick={() => onSelectComplaint(c)}
                    className="hover:bg-[#FAF7F2] cursor-pointer transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-bold text-stone-700 group-hover:text-amber-800 transition-colors whitespace-nowrap">
                      #{c.complaint_id?.slice(0, 8)}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 max-w-xs sm:max-w-md">
                      <p className="text-stone-800 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <DepartmentBadge department={c.category} />
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <SeverityBadge severity={c.severity} />
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={c.status} />
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-stone-600 font-mono text-[11px] max-w-[160px] truncate" title={c.location_text || 'Coordinates unprovided'}>
                      📍 {c.location_text || (c.latitude ? `${c.latitude}, ${c.longitude}` : 'Lacking coordinates')}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-800 font-semibold group-hover:text-amber-900 group-hover:underline">
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
