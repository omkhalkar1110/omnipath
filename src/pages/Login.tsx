import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Mail, Lock } from 'lucide-react';
import { loginWithGoogle, getUserProfile } from '../firebase';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      const profile = await getUserProfile(user.uid);
      if (profile) {
        navigate('/dashboard');
      } else {
        // If profile doesn't exist, redirect to register
        navigate('/register');
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Branding & Info */}
      <div className="lg:w-1/2 p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/20 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-12 group">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter">OMNIPATH</span>
          </Link>

          <h1 className="text-6xl font-black leading-[0.9] tracking-tighter mb-8">
            WELCOME <br />
            <span className="text-indigo-500">BACK.</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-md leading-relaxed">
            Your personalized admission journey continues here. Log in to access your dashboard and saved colleges.
          </p>
        </div>

        <div className="relative z-10 pt-12 border-t border-white/10">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
            OmniPath Admission Concierge • v2.5.0
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="lg:w-1/2 bg-zinc-900/50 backdrop-blur-xl border-l border-white/5 p-12 flex items-center justify-center relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Sign In</h2>
            <p className="text-zinc-500">Access your personalized admission portal.</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-zinc-600"><span className="bg-zinc-900 px-4">Or use email</span></div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="Password"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 group">
              Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="text-center text-zinc-500 text-sm">
            Don't have an account? <Link to="/register" className="text-indigo-500 font-bold hover:underline">Create One</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
