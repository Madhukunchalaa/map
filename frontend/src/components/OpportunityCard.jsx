import { TrendingUp, Users, Target, ArrowRight } from 'lucide-react';

export default function OpportunityCard({ zone }) {
  return (
    <div className="w-64 bg-dark-card p-4 rounded-xl border-none shadow-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] text-brand font-bold uppercase tracking-wider">Zone ID: #{zone.id + 101}</span>
          <h3 className="text-lg font-bold">Opportunity: {zone.tier}</h3>
        </div>
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
          style={{ backgroundColor: `${zone.color}20`, border: `1px solid ${zone.color}40` }}
        >
          <Target className="w-5 h-5" style={{ color: zone.color }} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/60">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs">Demand Score</span>
          </div>
          <span className="text-xs font-bold text-white">{zone.demand}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/60">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs">Competitors</span>
          </div>
          <span className="text-xs font-bold text-white">{zone.competitors}</span>
        </div>

        <div className="pt-3 border-t border-white/5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/40">Market Potential</span>
            <span className="text-xs font-bold" style={{ color: zone.color }}>{zone.score}/1000</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${zone.score/10}%`, backgroundColor: zone.color }}
            />
          </div>
        </div>
      </div>

      <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-lg transition-colors group">
        Full Analysis
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
