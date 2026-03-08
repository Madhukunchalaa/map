import { MapPin, TrendingUp, HelpCircle, LogOut, User, LayoutDashboard, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

export default function Navbar({ onDashboard, onNewAnalysis, view }) {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 border-b border-dark-border bg-dark/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
          <TrendingUp className="text-dark w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Opportunity Map
          </h1>
          <p className="text-[10px] text-brand uppercase tracking-widest font-semibold">
            Entrepreneur Insight Hub
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {user && (
          <div className="hidden md:flex items-center gap-2 text-sm text-white/60">
            <button
              onClick={onDashboard}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${view === 'dashboard' ? 'bg-brand/10 text-brand' : 'hover:text-white'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            <button
              onClick={onNewAnalysis}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${view === 'form' ? 'bg-brand/10 text-brand' : 'hover:text-white'}`}
            >
              <PlusCircle className="w-4 h-4" /> New Analysis
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2 text-xs text-white/40 bg-dark/60 border border-dark-border px-3 py-1.5 rounded-full">
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
