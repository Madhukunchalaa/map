import { MapPin, TrendingUp, HelpCircle, LogOut, User, LayoutDashboard, PlusCircle, Home, Zap, FileText, Users } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

export default function Navbar({ onDashboard, onNewAnalysis, view }) {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 border-b border-dark-border bg-dark/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-brand rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
          <TrendingUp className="text-dark w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent leading-none">
            Opportunity Map
          </h1>
          <p className="text-[8px] md:text-[10px] text-brand uppercase tracking-[0.2em] font-semibold mt-0.5">
            Insight Hub
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {user && (
          <div className="hidden md:flex items-center gap-1 text-sm text-white/60">
            <button
              onClick={() => onNewAnalysis && onNewAnalysis('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${view === 'map' ? 'bg-brand/10 text-brand' : 'hover:text-white'}`}
            >
              <Home className="w-4 h-4" /> Home
            </button>
            <button
              onClick={() => onNewAnalysis && onNewAnalysis('form')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${view === 'form' ? 'bg-brand/10 text-brand' : 'hover:text-white'}`}
            >
              <Zap className="w-4 h-4" /> AI Engine
            </button>
            <button
              onClick={() => onDashboard && onDashboard()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${view === 'dashboard' ? 'bg-brand/10 text-brand' : 'hover:text-white'}`}
            >
              <FileText className="w-4 h-4" /> Reports
            </button>
            <button
              onClick={() => onNewAnalysis && onNewAnalysis('competitors')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${view === 'competitors' ? 'bg-brand/10 text-brand' : 'hover:text-white'}`}
            >
              <Users className="w-4 h-4" /> Competitors
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden lg:flex items-center gap-2 text-xs text-white/40 bg-dark/60 border border-dark-border px-3 py-1.5 rounded-full">
                <User className="w-3 h-3" />
                {user.username}
              </div>
              <button
                onClick={logout}
                className="p-2 text-white/40 hover:text-red-400 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-purple-500 border border-white/20" />
          )}
        </div>
      </div>
    </nav>
  );
}
