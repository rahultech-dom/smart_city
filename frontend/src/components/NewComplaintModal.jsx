import React, { useState } from 'react';
import { X, Send, Sparkles, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { submitComplaint } from '../services/api';

const QUICK_PRESETS = [
  {
    label: 'Waste: Market Dumpster Overflow',
    description: 'Community dumpsters are overflowing onto the footpath since 3 days. Stray cattle and dogs scattering garbage on the road.',
    category: 'waste',
    severity: 'medium',
    location_text: 'Market Road, Block B, Lajpat Nagar',
    lat: '28.5700',
    lon: '77.2435',
  },
  {
    label: 'Safety: Bent High-Voltage Pole (Critical)',
    description: 'A live electric transmission pole has bent and wires are touching the fence right next to Government Boys Senior Secondary School gate.',
    category: 'safety',
    severity: 'critical',
    location_text: 'Main Road, Sector 4, R.K. Puram (Near School)',
    lat: '28.5672',
    lon: '77.1789',
  },
  {
    label: 'Water: Underpass Inundation (High)',
    description: 'Severe waterlogging at Pul Prahladpur underpass. Water level is around 3 feet, multiple cars stalled causing complete arterial gridlock.',
    category: 'water',
    severity: 'high',
    location_text: 'Pul Prahladpur Underpass, Mehrauli-Badarpur Road',
    lat: '28.5135',
    lon: '77.2882',
  },
  {
    label: 'Traffic: Ring Road Collision (High)',
    description: 'Major collision between truck and bus blocking both lanes on Ring Road near Moti Bagh flyover. Traffic backed up 2km.',
    category: 'traffic',
    severity: 'high',
    location_text: 'Ring Road, Moti Bagh Flyover Eastbound',
    lat: '28.5828',
    lon: '77.1685',
  },
];

export default function NewComplaintModal({ isOpen, onClose, onSuccess, isDemoMode }) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [locationText, setLocationText] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [source, setSource] = useState('citizen_complaint');
  const [citizenName, setCitizenName] = useState('Demo Citizen');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleApplyPreset = (preset) => {
    setDescription(preset.description);
    setCategory(preset.category);
    setSeverity(preset.severity);
    setLocationText(preset.location_text);
    setLatitude(preset.lat);
    setLongitude(preset.lon);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('The complaint description is required and cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        description: description.trim(),
        category: category || null,
        severity: severity || 'medium',
        location_text: locationText || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        citizen_name: citizenName || 'Demo Citizen',
        source: source || 'citizen_complaint'
      };

      const result = await submitComplaint(payload, isDemoMode);
      if (result.success) {
        setSuccessMsg(`Incident ingested successfully! Assigned ID: ${result.data?.complaint_id?.slice(0, 8)}...`);
        setTimeout(() => {
          setIsSubmitting(false);
          onSuccess(result.data);
          onClose();
        }, 1200);
      } else {
        setErrorMsg(result.error || 'Failed to submit complaint. Check API service.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Submission error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#E5E0D4] bg-white shadow-xl p-6 sm:p-8 my-8 text-stone-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D4]">
          <div>
            <h3 className="text-lg font-bold font-mono tracking-wide text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-700" />
              Ingest Citizen Complaint / Sensor Event
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Direct ingestion into City Complaint Agent classification pipeline
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#E5E0D4] text-stone-500 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Fill Presets */}
        <div className="mt-4">
          <label className="text-[11px] font-mono text-stone-600 font-semibold uppercase tracking-wider block mb-2">
            Quick Fill Demo Scenarios:
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 text-xs font-mono rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#E5E0D4] text-stone-700 hover:text-stone-900 transition-colors shadow-2xs"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-mono text-stone-700 font-semibold mb-1.5">
              Complaint Description <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Garbage bins overflowing onto the road near the market entrance..."
              className="w-full rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-400 transition-all"
              required
            />
          </div>

          {/* Category & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-stone-700 font-semibold mb-1.5">
                Target Department / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-500"
              >
                <option value="">Auto-Detect via City Complaint NLP</option>
                <option value="traffic">Traffic Management</option>
                <option value="safety">Public Safety</option>
                <option value="waste">Waste Management</option>
                <option value="environment">Environmental Monitoring</option>
                <option value="water">Water Management</option>
                <option value="energy">Energy & Grid</option>
                <option value="general">General / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-stone-700 font-semibold mb-1.5">
                Initial Severity Assessment
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-500"
              >
                <option value="low">Low (Routine)</option>
                <option value="medium">Medium (Standard Attention)</option>
                <option value="high">High (Significant Disruption)</option>
                <option value="critical">Critical (Immediate Danger)</option>
              </select>
            </div>
          </div>

          {/* Location Text */}
          <div>
            <label className="block text-xs font-mono text-stone-700 font-semibold mb-1.5">
              Location Landmark / Address Text
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="E.g., Ring Road near Moti Bagh flyover"
                className="w-full rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] pl-9 pr-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500"
              />
            </div>
          </div>

          {/* Coordinates (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-stone-600 font-semibold mb-1">
                Latitude (Optional)
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="E.g., 28.5828"
                className="w-full rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-stone-600 font-semibold mb-1">
                Longitude (Optional)
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="E.g., 77.1685"
                className="w-full rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500 font-mono"
              />
            </div>
          </div>

          {/* Citizen Name & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-mono text-stone-600 font-semibold mb-1">
                Citizen Identifier (Demo)
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Demo Citizen"
                className="w-full rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-stone-600 font-semibold mb-1">
                Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full rounded-xl bg-[#FAF8F5] border border-[#E5E0D4] px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-500 font-mono"
              >
                <option value="citizen_complaint">citizen_complaint</option>
                <option value="simulated_sensor">simulated_sensor</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#E5E0D4] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-[#E5E0D4] bg-white text-stone-700 hover:bg-[#F2ECE1] text-xs font-mono transition-colors shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 font-bold text-xs font-mono shadow-sm transition-all"
            >
              <Send className={`w-3.5 h-3.5 text-amber-400 ${isSubmitting ? 'animate-spin' : ''}`} />
              <span>{isSubmitting ? 'Ingesting via Agent...' : 'Dispatch to System'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
