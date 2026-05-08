import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Mail, Lock, User, Phone, Building2, GraduationCap } from 'lucide-react';
import { loginWithGoogle, createUserProfile, auth } from '../firebase';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'institute_admin'>('student');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    instituteName: '',
  });

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      await createUserProfile(user, role, { 
        phone: formData.phone, 
        name: formData.name || user.displayName || '',
        requestedRole: role 
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Registration error:", error);
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
            THE FUTURE OF <br />
            <span className="text-indigo-500">ADMISSIONS</span> IS HERE.
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-md leading-relaxed">
            Join 50,000+ students and top institutes in Maharashtra navigating the complex world of higher education with AI.
          </p>
        </div>

        <div className="relative z-10 pt-12 border-t border-white/10">
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <img 
                  key={i}
                  src={`https://picsum.photos/seed/user${i}/100/100`} 
                  className="w-12 h-12 rounded-full border-4 border-[#050505]" 
                  alt="User"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
              Trusted by 500+ Institutes
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="lg:w-1/2 bg-zinc-900/50 backdrop-blur-xl border-l border-white/5 p-12 flex items-center justify-center relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-zinc-500">Choose your path and get started today.</p>
          </div>

          {/* Role Selection */}
          <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5">
            <button 
              onClick={() => setRole('student')}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                role === 'student' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <GraduationCap size={16} /> Student
            </button>
            <button 
              onClick={() => setRole('institute_admin')}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                role === 'institute_admin' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <Building2 size={16} /> Institute
            </button>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleGoogleRegister}
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
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all"
                />
              </div>
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
              Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="text-center text-zinc-500 text-sm">
            Already have an account? <Link to="/login" className="text-indigo-500 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
