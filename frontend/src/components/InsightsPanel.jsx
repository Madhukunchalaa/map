import { TrendingUp, BarChart3, Map as MapIcon, ChevronRight, Globe, Zap, AlertCircle, Users, Star, MapPin, Target, Sparkles, TrendingDown } from 'lucide-react';
import DemandChart from './DemandChart';

export default function InsightsPanel({ city, businessType, stats, trends, opportunities, prediction, hotspots, activeView, setActiveView, analysis }) {
  const topZones = opportunities?.zones?.sort((a,b) => b.score - a.score).slice(0, 3) || [];
  const competitors = opportunities?.competitors_list || [];

  return (
    <aside className="w-full h-full bg-dark-card border-l border-dark-border p-6 overflow-y-auto hidden lg:block scrollbar-hide">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-brand mb-1">
            <BarChart3 className="w-4 h-4 text-brand" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Market Analysis</span>
          </div>
          <h2 className="text-2xl font-bold">{city?.name || 'Global'} Overview</h2>
          <p className="text-white/40 text-sm mt-1">Real-time demand vs supply insights for {businessType}.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-dark/60 rounded-xl border border-dark-border">
          <button 
            onClick={() => setActiveView('market')}
            className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all ${activeView === 'market' ? 'bg-brand text-dark shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            Insights
          </button>
          <button 
            onClick={() => setActiveView('competitors')}
            className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all ${activeView === 'competitors' ? 'bg-brand text-dark shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            Competitors
          </button>
          <button 
            onClick={() => setActiveView('opportunity')}
            className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all ${activeView === 'opportunity' ? 'bg-brand text-dark shadow-lg' : 'text-white/40 hover:text-white/60'}`}
          >
            AI Engine
          </button>
        </div>

        {activeView === 'market' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Global Stats Content */}
            {/* ... preserved ... */}
          </div>
        ) : activeView === 'opportunity' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             {/* AI Opportunity Card */}
             {analysis?.top_opportunities?.[0] && (
               <section className="bg-brand border border-brand/20 p-5 rounded-3xl relative overflow-hidden shadow-2xl shadow-brand/20">
                  <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12">
                     <Sparkles className="w-32 h-32 text-dark" />
                  </div>
                  <div className="flex items-center gap-2 mb-4 bg-dark/20 w-fit px-3 py-1 rounded-full border border-white/10">
                    <Sparkles className="w-3 h-3 text-white fill-white" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">Top AI Recommendation</span>
                  </div>
                  
                  <h3 className="text-3xl font-black text-dark mb-1">{analysis.top_opportunities[0].type}</h3>
                  <p className="text-dark/60 text-xs font-bold uppercase mb-6 tracking-wide">Optimal Business Choice</p>
                  
                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-dark/10 p-3 rounded-2xl border border-white/5">
                       <p className="text-[10px] text-dark/40 uppercase font-black">Opp. Score</p>
                       <p className="text-3xl font-black text-dark">{analysis.top_opportunities[0].opportunity_score}</p>
                    </div>
                    <div className="bg-dark/10 p-3 rounded-2xl border border-white/5">
                       <p className="text-[10px] text-dark/40 uppercase font-black">Demand</p>
                       <p className="text-sm font-bold text-dark flex items-center gap-1 mt-1">
                          {analysis.top_opportunities[0].demand_level}
                          <TrendingUp className="w-3 h-3" />
                       </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between bg-dark/20 p-3 rounded-2xl">
                     <div>
                        <p className="text-[10px] text-white/60 uppercase font-bold">Local Competition</p>
                        <p className="text-xs font-bold text-white">{analysis.top_opportunities[0].competitor_count} Businesses</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] text-white/60 uppercase font-bold">Avg Rating</p>
                        <p className="text-xs font-bold text-white flex items-center justify-end gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          {analysis.top_opportunities[0].avg_rating}
                        </p>
                     </div>
                  </div>
               </section>
             )}

             {/* Other Opportunities */}
             <section>
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
                     <Target className="w-4 h-4 text-brand" />
                     Market Opportunities
                   </h3>
                </div>
                <div className="space-y-3">
                   {analysis?.all_opportunities?.slice(1).map((opp, idx) => (
                     <div key={idx} className="bg-dark/40 border border-dark-border p-4 rounded-2xl hover:border-brand/30 transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${opp.opportunity_score > 60 ? 'bg-opportunity-high/20 text-opportunity-high' : 'bg-opportunity-medium/20 text-opportunity-medium'}`}>
                              {opp.opportunity_score}
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-white/90">{opp.type}</h4>
                              <p className="text-[10px] text-white/40 uppercase font-bold">{opp.competitor_count} Nearby • {opp.demand_level} Demand</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-white/40 uppercase">
                           Forecast: <span className={opp.forecast.status === 'Rising Star' ? 'text-brand' : 'text-white/60'}>{opp.forecast.growth_percent}%</span>
                        </div>
                     </div>
                   ))}
                </div>
             </section>

             {/* Drivers section */}
             <section className="bg-dark/40 border border-dark-border p-5 rounded-3xl relative overflow-hidden ring-1 ring-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/80">Location Drivers</h3>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-white/40 uppercase font-bold">Pop. Density</span>
                      <span className="text-white font-mono">{analysis?.population_density?.toLocaleString()} / km²</span>
                   </div>
                   <div className="h-1 bg-dark rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (analysis?.population_density / 25000) * 100)}%` }} />
                   </div>
                   <p className="text-[10px] text-white/30 leading-relaxed italic border-t border-dark-border pt-4">
                      AI Note: Higher density increases recurring demand for essential services like Pharmacies and Grocery stores.
                   </p>
                </div>
             </section>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Competitors Content */}
            {/* ... preserved ... */}
          </div>
        )}

        {/* Global Network */}
        <section className="pt-4 border-t border-dark-border">
          <div className="flex items-center gap-3 p-4 bg-brand/5 border border-brand/10 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-brand">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-brand">Global Coverage</p>
              <p className="text-[10px] text-brand/60 uppercase">8 Major Cities Connected</p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}

