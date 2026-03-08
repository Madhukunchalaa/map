import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Search, Building2, MapPin, Zap, Loader2, ChevronRight, Star, TrendingUp, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Restaurant', 'Hotel', 'Pharmacy', 'Grocery Store', 'EV Charging', 'Cafe', 'Gym', 'Clinic'];

export default function AnalysisForm({ onReportGenerated }) {
  const { token } = useAuth();
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const params = new URLSearchParams({ business_name: businessName, category, location });
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBaseUrl}/api/analyze-custom?${params}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const report = await response.json();

      if (report.error) {
        setError(report.error);
        return;
      }

      // Also save to history
      await fetch(`${apiBaseUrl}/api/history`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });

      onReportGenerated(report);
    } catch (err) {
      setError('Failed to connect to analysis engine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-brand/20 rounded-xl flex items-center justify-center">
          <Zap className="w-4 h-4 text-brand" />
        </div>
        <div>
          <h3 className="text-sm font-black">AI Analysis Engine</h3>
          <p className="text-[10px] text-white/40 uppercase">Generate a custom opportunity report</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] uppercase font-bold text-white/40 mb-1 ml-1 block">Business Name</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-dark/60 border border-dark-border rounded-xl pl-10 pr-4 py-3 text-sm focus:border-brand/50 transition-all outline-none"
              placeholder="e.g. Sunrise Cafe"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-white/40 mb-1 ml-1 block">Business Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-3 text-sm focus:border-brand/50 transition-all outline-none appearance-none"
            required
          >
            <option value="">Select category...</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-white/40 mb-1 ml-1 block">Location / Pincode / Area</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-dark/60 border border-dark-border rounded-xl pl-10 pr-4 py-3 text-sm focus:border-brand/50 transition-all outline-none"
              placeholder="e.g. Bandra, Mumbai or 400050"
              required
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand text-dark font-black py-3 rounded-xl hover:bg-white transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Location...</>
          ) : (
            <><Zap className="w-4 h-4" /> Generate Report <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </form>
    </div>
  );
}
