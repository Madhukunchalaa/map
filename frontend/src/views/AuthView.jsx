import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';

export default function AuthView() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = isLogin 
      ? await login(username, password) 
      : await register(username, password);
    
    if (!result.success) {
      setError(result.error);
    } else if (!isLogin) {
      setIsLogin(true);
      setError('Registration successful! Please login.');
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-card border border-dark-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-brand/20 rounded-2xl flex items-center justify-center border border-brand/30">
              <ShieldCheck className="w-8 h-8 text-brand" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-center mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-white/40 text-sm text-center mb-8">
            {isLogin ? 'Access your location intelligence dashboard' : 'Join the Opportunity Map network'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-white/40 mb-1 ml-1 block">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-3 text-sm focus:border-brand/50 transition-all outline-none"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-white/40 mb-1 ml-1 block">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark/60 border border-dark-border rounded-xl px-4 py-3 text-sm focus:border-brand/50 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className={`p-3 rounded-xl text-xs font-bold ${error.includes('successful') ? 'bg-brand/10 text-brand' : 'bg-red-500/10 text-red-400'}`}>
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-brand text-dark font-black py-3 rounded-xl hover:bg-white transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2"
            >
              {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center text-white/40 text-xs mt-6 hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
