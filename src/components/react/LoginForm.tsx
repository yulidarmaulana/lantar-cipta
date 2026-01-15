import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/admin/dashboard`;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Redirect to dashboard
      window.location.href = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/admin/dashboard`;
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-lg w-full border border-white/20 backdrop-blur-sm">
      <div className="text-center mb-10">
        <img
          src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/favicon-lcm.png`}
          alt="Lantar Cipta Media Logo"
          className="mx-auto h-16 w-16 mb-6"
        />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Sign in to your account
        </h2>
        <p className="text-slate-500 text-sm">
          Enter your email & password to login
        </p>
      </div>

      <form className="space-y-8" onSubmit={handleLogin}>
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="truncate">{error}</span>
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 ml-1">
            Email or Username
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8CC64C] focus:bg-white transition-all shadow-sm"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 ml-1">
            Password
          </label>
          <div className="relative group">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8CC64C] focus:bg-white transition-all shadow-sm"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-[#8CC64C] transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-10 py-3 text-sm font-bold rounded-lg text-white bg-[#8CC64C] hover:bg-[#7db144] focus:outline-none focus:ring-4 focus:ring-[#8CC64C]/30 shadow-lg shadow-[#8CC64C]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
}
