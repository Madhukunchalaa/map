import { useState } from 'react';
import { MapPin, TrendingUp, HelpCircle, LogOut, User, LayoutDashboard, PlusCircle, Home, Zap, FileText, Users, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

export default function Navbar({ onDashboard, onNewAnalysis, view }) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
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

        <div className="flex items-center gap-4">
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

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="hidden lg:flex items-center gap-2 text-xs text-white/40 bg-dark/60 border border-dark-border px-3 py-1.5 rounded-full">
                  <User className="w-3 h-3" />
                  {user.username}
                </div>
                {/* Mobile Menu Toggle */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-white/60 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <button
                  onClick={logout}
                  className="hidden md:block p-2 text-white/40 hover:text-red-400 transition-colors"
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

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        <div className={`absolute right-0 top-0 bottom-0 w-64 bg-dark-card border-l border-dark-border p-6 shadow-2xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
             <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl mb-8 border border-white/5">
                <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand">
                   <User className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                   <p className="text-[10px] text-white/40 uppercase font-black">Active User</p>
                   <p className="text-sm font-bold text-white truncate">{user?.username || 'Authorized User'}</p>
                </div>
             </div>

             <div className="space-y-2 mb-auto">
                <p className="text-[10px] text-white/20 uppercase font-black mb-4 px-2">Navigation</p>
                <button onClick={() => { onNewAnalysis('map'); setIsMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'map' ? 'bg-brand/10 text-brand font-bold' : 'text-white/60 hover:bg-white/5'}`}>
                   <Home className="w-5 h-5" /> Home
                </button>
                <button onClick={() => { onNewAnalysis('form'); setIsMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'form' ? 'bg-brand/10 text-brand font-bold' : 'text-white/60 hover:bg-white/5'}`}>
                   <Zap className="w-5 h-5" /> AI Engine
                </button>
                <button onClick={() => { onDashboard(); setIsMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-brand/10 text-brand font-bold' : 'text-white/60 hover:bg-white/5'}`}>
                   <FileText className="w-5 h-5" /> Reports
                </button>
                <button onClick={() => { onNewAnalysis('competitors'); setIsMenuOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${view === 'competitors' ? 'bg-brand/10 text-brand font-bold' : 'text-white/60 hover:bg-white/5'}`}>
                   <Users className="w-5 h-5" /> Competitors
                </button>
             </div>

             <button 
               onClick={() => { logout(); setIsMenuOpen(false); }}
               className="mt-4 w-full flex items-center gap-3 p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 font-bold hover:bg-red-500/20 transition-all"
             >
                <LogOut className="w-5 h-5" /> Sign Out
             </button>
          </div>
        </div>
      </div>
    </>
  );
}
