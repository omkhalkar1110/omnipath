import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Sparkles, GraduationCap, Building2, Globe, Zap, Users, BarChart3 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter">OMNIPATH</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">Features</a>
            <a href="#institutes" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">For Institutes</a>
            <a href="#pricing" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest px-4 py-2">Login</Link>
            <Link to="/register" className="bg-white text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 uppercase tracking-widest">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8"
            >
              <Sparkles size={16} className="text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Next-Gen Admission Platform</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter mb-8"
            >
              THE ARCHITECT <br />
              OF YOUR <span className="text-indigo-500">FUTURE.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed mb-12"
            >
              Navigate the complex world of higher education with AI-driven predictions, personalized roadmaps, and immersive campus simulations.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Link to="/register" className="group bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/40 flex items-center gap-3 uppercase tracking-widest">
                Start Your Journey <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-10 py-5 rounded-2xl border border-white/10 font-black text-lg hover:bg-white/5 transition-all uppercase tracking-widest">
                Watch Demo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Students Guided", value: "50K+" },
              { label: "Institutes", value: "500+" },
              { label: "Accuracy Rate", value: "98%" },
              { label: "Career Paths", value: "140+" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl md:text-6xl font-black text-white mb-2">{stat.value}</p>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-6">
                BUILT FOR THE <br />
                <span className="text-indigo-500">NEXT GENERATION.</span>
              </h2>
              <p className="text-xl text-zinc-400 leading-relaxed">
                We've combined deep data analysis with advanced AI to create the most powerful admission tool ever built.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-yellow-500" />,
                title: "Instant Predictions",
                desc: "Get real-time admission chances based on your CET/JEE scores and category."
              },
              {
                icon: <Globe className="text-indigo-500" />,
                title: "Career Roadmaps",
                desc: "Explore 140+ career paths with detailed job roles and salary expectations."
              },
              {
                icon: <Sparkles className="text-emerald-500" />,
                title: "Life Simulation",
                desc: "Experience a day in the life at your dream college with AI-generated stories."
              }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 hover:border-indigo-500/30 transition-all group">
                <div className="w-16 h-16 bg-black/40 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Institutes Section */}
      <section id="institutes" className="py-32 px-6 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-8">
                <Building2 size={16} className="text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Enterprise Solution</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter text-white mb-8">
                EMPOWER YOUR <br />
                INSTITUTE.
              </h2>
              <p className="text-xl text-indigo-100 leading-relaxed mb-12">
                Manage your student pipeline, showcase your campus with AI video, and provide world-class guidance to your applicants.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <Users />, text: "Student Management Dashboard" },
                  { icon: <BarChart3 />, text: "Advanced Analytics & Reporting" },
                  { icon: <Zap />, text: "Automated Admission Workflows" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-white">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-lg font-bold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl p-8 shadow-3xl">
                <div className="w-full h-full bg-black/40 rounded-[2rem] border border-white/5 p-8 flex flex-col justify-center items-center text-center">
                  <Building2 size={80} className="text-white mb-8 opacity-20" />
                  <h3 className="text-3xl font-black mb-4">Ready to upgrade?</h3>
                  <p className="text-indigo-200 mb-8">Join the elite circle of institutes using OmniPath.</p>
                  <Link to="/register" className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-black/20">
                    Register Your Institute
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter">OMNIPATH</span>
          </div>

          <div className="flex gap-8">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Instagram</a>
          </div>

          <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest">
            © 2026 OmniPath Admission Concierge
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
