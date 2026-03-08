import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Clock, MapPin, TrendingUp, TrendingDown, Minus, ChevronRight, Sparkles } from 'lucide-react';

function ScoreBadge({ score }) {
  const color = score > 60 ? 'text-brand bg-brand/10 border-brand/20' : score > 30 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-green-400 bg-green-400/10 border-green-400/20';
  const label = score > 60 ? 'High Opp.' : score > 30 ? 'Medium' : 'Saturated';
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${color}`}>
      {label}
    </span>
  );
}

export default function HistoryDashboard({ onNewAnalysis }) {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8000/api/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setHistory(Array.isArray(data) ? data.reverse() : []);
      })
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-brand/20 border-t-brand rounded-full animate-spin" />
    </div>
  );

  if (selected) {
    const analysis = selected.analysis;
    const top = analysis?.top_opportunities?.[0];
    const score = analysis?.score ?? top?.opportunity_score ?? 0;
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="text-xs text-white/40 hover:text-brand flex items-center gap-1 transition-colors">
          ← Back to history
        </button>

        <div className="bg-brand p-5 rounded-3xl relative overflow-hidden shadow-2xl shadow-brand/20">
          <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12">
            <Sparkles className="w-32 h-32 text-dark" />
          </div>
          <p className="text-[10px] font-bold uppercase text-dark/60 mb-1">{selected.category} • {selected.location}</p>
          <h2 className="text-2xl font-black text-dark mb-3">{selected.business_name}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-dark/10 p-3 rounded-2xl">
              <p className="text-[10px] text-dark/40 uppercase font-black">Opp. Score</p>
              <p className="text-3xl font-black text-dark">{score}</p>
            </div>
            <div className="bg-dark/10 p-3 rounded-2xl">
              <p className="text-[10px] text-dark/40 uppercase font-black">Classification</p>
              <p className="text-sm font-black text-dark mt-1">
                {score > 60 ? '🔴 High Opp.' : score > 30 ? '🟡 Medium' : '🟢 Saturated'}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        {analysis?.metrics && (
          <div className="bg-dark/40 border border-dark-border p-5 rounded-3xl">
            <h3 className="text-xs font-bold uppercase tracking-wide text-white/60 mb-4">Location Metrics</h3>
            <div className="space-y-3">
              {Object.entries(analysis.metrics).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center text-sm">
                  <span className="text-white/40 capitalize">{key.replace('_', ' ')}</span>
                  <span className="font-bold text-white">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Competitors */}
        {analysis?.nearby_competitors?.length > 0 && (
          <div className="bg-dark/40 border border-dark-border p-5 rounded-3xl">
            <h3 className="text-xs font-bold uppercase tracking-wide text-white/60 mb-4">Nearby Competitors ({analysis.nearby_competitors.length})</h3>
            <div className="space-y-2">
              {analysis.nearby_competitors.slice(0, 5).map((comp, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-dark-border">
                  <div>
                    <p className="text-sm font-bold">{comp.name}</p>
                    <p className="text-[10px] text-white/40">{comp.address}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                    ⭐ {comp.rating || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black">Analysis History</h2>
          <p className="text-[10px] text-white/40 uppercase">{history.length} reports saved</p>
        </div>
        <button
          onClick={onNewAnalysis}
          className="bg-brand text-dark text-xs font-black px-4 py-2 rounded-xl hover:bg-white transition-all flex items-center gap-1"
        >
          + New Analysis
        </button>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-white/60 text-sm font-bold">No analyses yet</p>
          <p className="text-white/30 text-xs mt-1">Generate your first business report</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, idx) => {
            const top = item.analysis?.top_opportunities?.[0];
            const score = item.analysis?.score ?? top?.opportunity_score ?? 0;
            return (
              <button
                key={idx}
                onClick={() => setSelected(item)}
                className="w-full bg-dark/40 border border-dark-border p-4 rounded-2xl hover:border-brand/30 transition-all flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${score > 60 ? 'bg-brand/20 text-brand' : score > 30 ? 'bg-yellow-400/20 text-yellow-400' : 'bg-green-400/20 text-green-400'}`}>
                    {score}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.business_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-white/40 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> {item.location}
                      </span>
                      <span className="text-[10px] text-white/20">•</span>
                      <span className="text-[10px] text-white/40">{item.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ScoreBadge score={score} />
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-brand transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
