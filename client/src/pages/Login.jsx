import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, Eye, EyeOff, Shield, User, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate(res.user?.role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  const handleFillDemo = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    const res = await login(demoEmail, demoPass);
    setLoading(false);
    if (res.success) {
      navigate(res.user?.role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/80 shadow-luxury space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-teal-400">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-2xl font-serif font-bold text-slate-900">Wanderly</span>
          </Link>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-500">
            Sign in to access your luxury itineraries and saved expeditions.
          </p>
        </div>

        {/* Quick Demo Credentials Autofill Banner (For College Evaluation) */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Quick Credentials for Evaluation & Grading</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleFillDemo('admin@wanderly.com', 'Admin@123')}
              className="px-3 py-2 rounded-xl bg-white border border-amber-200 text-left hover:border-amber-400 transition-colors shadow-sm"
            >
              <p className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Admin
              </p>
              <p className="text-[10px] text-slate-500 truncate">admin@wanderly.com</p>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('aarav@wanderly.com', 'User@123')}
              className="px-3 py-2 rounded-xl bg-white border border-amber-200 text-left hover:border-amber-400 transition-colors shadow-sm"
            >
              <p className="text-[11px] font-bold text-teal-700 flex items-center gap-1">
                <User className="w-3 h-3" /> Student
              </p>
              <p className="text-[10px] text-slate-500 truncate">aarav@wanderly.com</p>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@wanderly.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-all duration-300 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-bold text-teal-600 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
