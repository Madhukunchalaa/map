import { Home, Zap, FileText, Users } from 'lucide-react';

export default function BottomNav({ onDashboard, onNewAnalysis, view }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-dark/80 backdrop-blur-xl border-t border-dark-border flex items-center justify-around px-2 z-[100]">
      <button
        onClick={() => onNewAnalysis && onNewAnalysis('map')}
        className={`flex flex-col items-center gap-1 transition-all ${view === 'map' ? 'text-brand' : 'text-white/40'}`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
      </button>
      
      <button
        onClick={() => onNewAnalysis && onNewAnalysis('form')}
        className={`flex flex-col items-center gap-1 transition-all ${view === 'form' ? 'text-brand' : 'text-white/40'}`}
      >
        <Zap className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-tighter">AI Engine</span>
      </button>

      <button
        onClick={() => onDashboard && onDashboard()}
        className={`flex flex-col items-center gap-1 transition-all ${view === 'dashboard' ? 'text-brand' : 'text-white/40'}`}
      >
        <FileText className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Reports</span>
      </button>

      <button
        onClick={() => onNewAnalysis && onNewAnalysis('competitors')}
        className={`flex flex-col items-center gap-1 transition-all ${view === 'competitors' ? 'text-brand' : 'text-white/40'}`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Competitors</span>
      </button>
    </nav>
  );
}
