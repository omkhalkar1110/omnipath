import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, GraduationCap, LayoutGrid, MessageSquare, Send, Sparkles, X as CloseIcon, MapPin, ExternalLink, Award, Building2, BookOpen, ChevronRight, Heart, User as UserIcon, Phone, MessageCircle, LogOut, Info, HelpCircle, GitCompare, ArrowRightLeft, ListChecks, Download, CheckCircle2, Star, Compass, Search, Share2 } from 'lucide-react';
import { COLLEGE_DB, REGION_CLUSTERS, CATEGORIES, CAP_ROUND_GUIDE, ENGINEERING_BRANCHES, MEDICAL_BRANCHES, COMMERCE_BRANCHES, CAREER_ROADMAPS, CATEGORY_REQUIREMENTS, NATIONAL_COLLEGE_DB } from './constants';
import { College, ChatMessage, User, Review } from './types';
import { askGemini } from './services/gemini';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [stream, setStream] = useState('engineering');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [results, setResults] = useState<College[]>(COLLEGE_DB.slice(0, 4)); // Show 4 featured colleges by default
  const [nationalResults, setNationalResults] = useState<College[]>(NATIONAL_COLLEGE_DB.slice(0, 3));
  const [loading, setLoading] = useState(false);
  const [cetScore, setCetScore] = useState('');
  const [jeeScore, setJeeScore] = useState('');
  const [jeeAdvancedScore, setJeeAdvancedScore] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [shortlisted, setShortlisted] = useState<string[]>([]);
  const [showShortlistedOnly, setShowShortlistedOnly] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('omnipath_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCAPGuideOpen, setIsCAPGuideOpen] = useState(false);
  const [isCategoryGuideOpen, setIsCategoryGuideOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [comparisonList, setComparisonList] = useState<College[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);
  const [predictionResults, setPredictionResults] = useState<(College & { chance: 'Safe' | 'Good' | 'Ambitious' })[]>([]);
  const [commerceExam, setCommerceExam] = useState('12th Commerce %');

  const popularRegions = ["Mumbai", "Pune", "Nashik", "Nagpur", "Nanded", "Aurangabad", "Amravati", "Kolhapur"];
  
  const getBranches = () => {
    if (stream === 'medical') return MEDICAL_BRANCHES;
    if (stream === 'commerce') return COMMERCE_BRANCHES;
    return ENGINEERING_BRANCHES;
  };

  const currentBranches = getBranches();

  useEffect(() => {
    setSelectedBranches([]);
    setPredictionResults([]);
    setCommerceExam('12th Commerce %');
    setResults(COLLEGE_DB.filter(c => c.type.toLowerCase() === stream.toLowerCase()).slice(0, 4));
    setNationalResults(NATIONAL_COLLEGE_DB.filter(c => c.type.toLowerCase() === stream.toLowerCase()).slice(0, 3));
  }, [stream]);

  const getExamLabel = () => {
    switch (stream) {
      case 'medical': return 'NEET Score';
      case 'polytechnic': return 'SSC / CBSE %';
      case 'engineering': return 'CET %ile';
      case 'commerce': return commerceExam;
      default: return 'Entrance Score';
    }
  };

  const toggleShortlist = (collegeName: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setShortlisted(prev => 
      prev.includes(collegeName) 
        ? prev.filter(name => name !== collegeName) 
        : [...prev, collegeName]
    );
  };

  const toggleComparison = (college: College) => {
    setComparisonList(prev => {
      const isAlreadyAdded = prev.some(c => c.name === college.name);
      if (isAlreadyAdded) {
        return prev.filter(c => c.name !== college.name);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 colleges at a time.");
        return prev;
      }
      return [...prev, college];
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('omnipath_user');
    setShortlisted([]);
  };

  const toggleRegion = (r: string) => {
    setSelectedRegions(prev => 
      prev.includes(r) ? prev.filter(item => item !== r) : [...prev, r]
    );
  };

  const toggleBranch = (b: string) => {
    setSelectedBranches(prev => 
      prev.includes(b) ? prev.filter(item => item !== b) : [...prev, b]
    );
  };

  useEffect(() => {
    const filterResults = () => {
      const filterFn = (c: College) => {
        const matchesStream = c.type.toLowerCase() === stream.toLowerCase();
        const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = selectedRegions.length === 0 || c.regions.some(r => {
          const collegeRegion = r.toLowerCase();
          return selectedRegions.some(sr => {
            const searchRegion = sr.toLowerCase();
            const cluster = REGION_CLUSTERS[searchRegion];
            return cluster ? cluster.some(cr => collegeRegion.includes(cr)) : collegeRegion.includes(searchRegion);
          });
        });
        const matchesBranch = selectedBranches.length === 0 || (c.branches && c.branches.some(b => 
          selectedBranches.some(sb => b.toLowerCase().includes(sb.toLowerCase()))
        ));
        
        return matchesStream && matchesRegion && matchesBranch && matchesSearch;
      };

      const filteredState = COLLEGE_DB.filter(filterFn);
      const filteredNational = NATIONAL_COLLEGE_DB.filter(filterFn);

      // If no scores are entered, just show the filtered list
      if (!cetScore && !jeeScore) {
        setResults(filteredState.slice(0, 20));
        setNationalResults(filteredNational.slice(0, 10));
      }
    };

    filterResults();
  }, [searchQuery, stream, selectedRegions, selectedBranches]);

  const calculatePredictions = () => {
    setLoading(true);
    setTimeout(() => {
      const userCet = parseFloat(cetScore);
      const userJee = parseFloat(jeeScore);
      const userAdv = parseFloat(jeeAdvancedScore);
      const userScore = stream === 'engineering' ? Math.max(isNaN(userCet) ? 0 : userCet, isNaN(userJee) ? 0 : userJee, isNaN(userAdv) ? 0 : userAdv) : parseFloat(cetScore);

      const predictFn = (c: College) => {
        const matchesStream = c.type.toLowerCase() === stream.toLowerCase();
        const matchesExam = stream === 'commerce' ? c.exam === commerceExam : true;
        const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRegion = selectedRegions.length === 0 || c.regions.some(r => {
          const collegeRegion = r.toLowerCase();
          return selectedRegions.some(sr => {
            const searchRegion = sr.toLowerCase();
            const cluster = REGION_CLUSTERS[searchRegion];
            return cluster ? cluster.some(cr => collegeRegion.includes(cr)) : collegeRegion.includes(searchRegion);
          });
        });

        const matchesBranch = selectedBranches.length === 0 || (c.branches && c.branches.some(b => 
          selectedBranches.some(sb => b.toLowerCase().includes(sb.toLowerCase()))
        ));
        
        if (!(matchesStream && matchesRegion && matchesBranch && matchesExam && matchesSearch)) return null;

        let collegeCutoff = c.cutoff;
        if (stream === 'engineering') {
          if (c.exam === 'JEE Advanced' && !isNaN(userAdv)) collegeCutoff = c.jeeAdvancedCutoff || c.cutoff;
          else if (!isNaN(userCet) && c.cetCutoff) collegeCutoff = c.cetCutoff;
          else if (!isNaN(userJee) && c.jeeCutoff) collegeCutoff = c.jeeCutoff;
        }

        let chance: 'Safe' | 'Good' | 'Ambitious' = 'Ambitious';
        const currentScore = (c.exam === 'JEE Advanced' && !isNaN(userAdv)) ? userAdv : userScore;
        const diff = currentScore - collegeCutoff;

        if (diff >= 5) chance = 'Safe';
        else if (diff >= 0) chance = 'Good';
        else if (diff >= -10) chance = 'Ambitious';
        else return null;

        return { ...c, chance };
      };

      const filteredState = COLLEGE_DB.map(predictFn).filter((c): c is (College & { chance: 'Safe' | 'Good' | 'Ambitious' }) => c !== null);
      const filteredNational = NATIONAL_COLLEGE_DB.map(predictFn).filter((c): c is (College & { chance: 'Safe' | 'Good' | 'Ambitious' }) => c !== null);

      const sortFn = (a: any, b: any) => {
        const chanceOrder = { 'Safe': 0, 'Good': 1, 'Ambitious': 2 };
        if (chanceOrder[a.chance] !== chanceOrder[b.chance]) {
          return chanceOrder[a.chance] - chanceOrder[b.chance];
        }
        return Number(a.tier) - Number(b.tier);
      };

      const sortedState = filteredState.sort(sortFn);
      const sortedNational = filteredNational.sort(sortFn);

      setPredictionResults([...sortedState, ...sortedNational]);
      setResults(sortedState);
      setNationalResults(sortedNational);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className={`${darkMode ? 'bg-[#050505] text-white' : 'bg-[#F9FAFB] text-slate-900'} min-h-screen transition-all duration-700 font-sans`}>
      
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
            <GraduationCap className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase">Omni<span className="text-indigo-500">Path</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://wa.me/919999999999?text=Hello%20OmniPath%20Team,%20I%20have%20a%20query%20regarding%20admissions." 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${darkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <MessageCircle size={16} className="text-emerald-500" />
            <span className="hidden sm:inline">WhatsApp Support</span>
          </a>
          {user ? (
            <div className="flex items-center gap-3">
              <div className={`hidden sm:flex flex-col items-end`}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Welcome</span>
                <span className="text-xs font-bold">{user.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className={`p-3 rounded-full hover:bg-white/10 transition-all cursor-pointer text-rose-500`}
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${darkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${darkMode ? 'bg-white text-black border-white' : 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20'}`}
              >
                <UserIcon size={16} />
                <span>Register</span>
              </button>
            </div>
          )}
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-full hover:bg-white/10 transition-all cursor-pointer">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-extrabold tracking-tighter mb-4"
          >
            Excellence. <br/><span className="text-indigo-500">Simplified.</span>
          </motion.h2>
          <p className="text-slate-500 max-w-xl">A data-driven architect for Maharashtra students navigating Engineering, Medical, and Polytechnic diplomas.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Form Side */}
          <section className="lg:col-span-5 space-y-6">
            <div className={`p-8 rounded-[2rem] border border-white/5 ${darkMode ? 'bg-[#111]' : 'bg-white shadow-2xl'}`}>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2"> <Sparkles size={18} className="text-indigo-500"/> Personal Configuration</h3>
              
              <div className="space-y-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 size={14} className="text-indigo-500" />
                        <span className="text-[10px] font-bold uppercase text-slate-500">Colleges</span>
                      </div>
                      <div className="text-xl font-black">{COLLEGE_DB.length + NATIONAL_COLLEGE_DB.length}</div>
                    </div>
                    <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Award size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase text-slate-500">Tier 1</span>
                      </div>
                      <div className="text-xl font-black">{[...COLLEGE_DB, ...NATIONAL_COLLEGE_DB].filter(c => c.tier === 1 || c.tier === 'Elite').length}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Search Opportunities</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search by name, city..." 
                        className={`w-full border rounded-xl p-4 pl-12 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <StreamToggle active={stream} set={setStream} darkMode={darkMode} />
                  <div className="flex gap-2">
                    {stream === 'engineering' && (
                      <button 
                        onClick={() => setIsCAPGuideOpen(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all border ${darkMode ? 'border-white/10 text-indigo-400 hover:bg-white/5' : 'border-slate-200 text-indigo-600 hover:bg-slate-50'}`}
                      >
                        <Info size={14} />
                        Guide
                      </button>
                    )}
                    <button 
                      onClick={() => setIsCategoryGuideOpen(true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all border ${darkMode ? 'border-white/10 text-amber-400 hover:bg-white/5' : 'border-slate-200 text-amber-600 hover:bg-slate-50'}`}
                    >
                      <ListChecks size={14} />
                      Docs
                    </button>
                    <button 
                      onClick={() => setIsRoadmapOpen(true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all border ${darkMode ? 'border-white/10 text-emerald-400 hover:bg-white/5' : 'border-slate-200 text-emerald-600 hover:bg-slate-50'}`}
                    >
                      <Compass size={14} />
                      Roadmap
                    </button>
                  </div>
                </div>
                <div className={`grid ${stream === 'engineering' ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
                  <Input 
                    label={getExamLabel()} 
                    placeholder={stream === 'medical' ? 'e.g. 620' : 'e.g. 95.5'} 
                    value={cetScore} 
                    onChange={(e) => setCetScore(e.target.value)} 
                    darkMode={darkMode}
                  />
                  {stream === 'engineering' && (
                    <>
                      <Input 
                        label="JEE %ile" 
                        placeholder="e.g. 92.0" 
                        value={jeeScore} 
                        onChange={(e) => setJeeScore(e.target.value)} 
                        darkMode={darkMode}
                      />
                      <Input 
                        label="JEE Adv %" 
                        placeholder="e.g. 98.5" 
                        value={jeeAdvancedScore} 
                        onChange={(e) => setJeeAdvancedScore(e.target.value)} 
                        darkMode={darkMode}
                      />
                    </>
                  )}
                  {stream !== 'engineering' && (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Category</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`w-full rounded-xl p-4 text-sm outline-none border transition-all ${darkMode ? 'bg-white/5 text-white border-white/5 focus:ring-indigo-500' : 'bg-slate-50 text-slate-900 border-slate-200 focus:ring-indigo-500 shadow-sm'}`}
                      >
                        <option value="" className={darkMode ? 'bg-[#111] text-white' : 'bg-white text-slate-900'}>Select</option>
                        {CATEGORIES.map(c => (
                          <option key={c} value={c} className={darkMode ? 'bg-[#111] text-white' : 'bg-white text-slate-900'}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {stream === 'engineering' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Category</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`w-full rounded-xl p-4 text-sm outline-none border transition-all ${darkMode ? 'bg-white/5 text-white border-white/5 focus:ring-indigo-500' : 'bg-slate-50 text-slate-900 border-slate-200 focus:ring-indigo-500 shadow-sm'}`}
                      >
                        <option value="" className={darkMode ? 'bg-[#111] text-white' : 'bg-white text-slate-900'}>Select</option>
                        {CATEGORIES.map(c => (
                          <option key={c} value={c} className={darkMode ? 'bg-[#111] text-white' : 'bg-white text-slate-900'}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Branches</label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {currentBranches.map(b => (
                          <button 
                            key={b} 
                            onClick={() => toggleBranch(b)}
                            className={`text-[10px] px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${selectedBranches.includes(b) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' : (darkMode ? 'border-white/10 text-slate-500 hover:border-white/30 bg-white/5' : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white')}`}
                          >
                            {selectedBranches.includes(b) && <CheckCircle2 size={10} />}
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {stream === 'commerce' && (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Select Entrance Exam</label>
                    <select 
                      value={commerceExam}
                      onChange={(e) => setCommerceExam(e.target.value)}
                      className={`w-full rounded-xl p-4 text-sm outline-none border transition-all ${darkMode ? 'bg-white/5 text-white border-white/5 focus:ring-indigo-500' : 'bg-slate-50 text-slate-900 border-slate-200 focus:ring-indigo-500 shadow-sm'}`}
                    >
                      <option value="12th Commerce %" className={darkMode ? 'bg-[#111] text-white' : 'bg-white text-slate-900'}>12th Commerce % (Merit)</option>
                      <option value="MAH-BMS-CET" className={darkMode ? 'bg-[#111] text-white' : 'bg-white text-slate-900'}>MAH-BMS/BBA CET</option>
                      <option value="CUET" className={darkMode ? 'bg-[#111] text-white' : 'bg-white text-slate-900'}>CUET (Central Universities)</option>
                      <option value="SET" className={darkMode ? 'bg-[#111] text-white' : 'bg-white text-slate-900'}>SET (Symbiosis Entrance)</option>
                      <option value="NPAT" className={darkMode ? 'bg-[#111] text-white' : 'bg-white text-slate-900'}>NPAT (NMIMS Entrance)</option>
                      <option value="IPMAT" className={darkMode ? 'bg-[#111] text-white' : 'bg-white text-slate-900'}>IPMAT (IIM Indore/Rohtak)</option>
                    </select>
                    <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-tighter">
                      {commerceExam === '12th Commerce %' && "AI Tip: Best for local Mumbai/Pune colleges like Sydenham, HR, BMCC."}
                      {commerceExam === 'MAH-BMS-CET' && "AI Tip: Mandatory for BMS/BBA in Maharashtra from 2024-25."}
                      {commerceExam === 'CUET' && "AI Tip: Target SRCC, Hindu College, and Central Universities."}
                      {commerceExam === 'SET' && "AI Tip: Specifically for Symbiosis Institutes (Pune/Noida)."}
                      {commerceExam === 'NPAT' && "AI Tip: Target NMIMS (Mumbai/Bengaluru) for BBA/B.Com."}
                      {commerceExam === 'IPMAT' && "AI Tip: For the elite 5-year Integrated Management at IIMs."}
                    </p>
                  </div>
                )}

                {(stream === 'medical' || stream === 'commerce') && (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Target Courses (Branches)</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {currentBranches.map(b => (
                        <button 
                          key={b} 
                          onClick={() => toggleBranch(b)}
                          className={`text-[10px] px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${selectedBranches.includes(b) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' : (darkMode ? 'border-white/10 text-slate-500 hover:border-white/30 bg-white/5' : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white')}`}
                        >
                          {selectedBranches.includes(b) && <CheckCircle2 size={10} />}
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Preferred Regions</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {popularRegions.map(r => (
                      <button 
                        key={r} 
                        onClick={() => toggleRegion(r)}
                        className={`text-[10px] px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${selectedRegions.includes(r) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' : (darkMode ? 'border-white/10 text-slate-500 hover:border-white/30 bg-white/5' : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white')}`}
                      >
                        {selectedRegions.includes(r) && <CheckCircle2 size={10} />}
                        {r}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-500 italic px-1">Tip: You can select multiple regions. Searching "Mumbai" also includes Navi Mumbai & Thane.</p>
                </div>
                {category && CATEGORY_REQUIREMENTS[category] && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`p-4 rounded-2xl border ${darkMode ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-100'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ListChecks size={14} className="text-amber-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Admission Info: {category}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                      <span className="text-amber-600 font-bold">Benefit:</span> {CATEGORY_REQUIREMENTS[category].benefits}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button 
                        onClick={() => setIsCategoryGuideOpen(true)}
                        className="text-[10px] font-bold text-indigo-500 hover:underline"
                      >
                        View Required Documents →
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={calculatePredictions}
                    disabled={loading}
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Analyzing...' : 'Analyze'}
                  </button>
                  <button 
                    onClick={() => { setCetScore(''); setJeeScore(''); setJeeAdvancedScore(''); setSelectedBranches([]); setCategory(''); setSelectedRegions([]); setSearchQuery(''); setResults(COLLEGE_DB.slice(0, 4)); setPredictionResults([]); }}
                    className={`px-6 py-4 rounded-2xl font-bold transition-all cursor-pointer ${darkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Results Side */}
          <section className="lg:col-span-7 space-y-12">
            {/* National Level Section */}
            {!showShortlistedOnly && nationalResults.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 bg-amber-500 rounded-full" />
                  <h3 className="text-xl font-black uppercase tracking-tighter">
                    National Level <span className="text-amber-500">Opportunities</span>
                  </h3>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${darkMode ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>
                    IITs • NITs • IIITs
                  </span>
                </div>
                {loading ? <SkeletonLoader darkMode={darkMode} /> : (
                  <ResultsGrid 
                    data={nationalResults} 
                    darkMode={darkMode} 
                    onSelect={setSelectedCollege}
                    shortlisted={shortlisted}
                    onToggleShortlist={toggleShortlist}
                    comparisonList={comparisonList}
                    onToggleComparison={toggleComparison}
                  />
                )}
              </div>
            )}

            {/* State Level Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1 bg-indigo-500 rounded-full" />
                    <h3 className="text-xl font-black uppercase tracking-tighter">
                      {showShortlistedOnly ? 'Shortlisted' : 'State Level'} <span className="text-indigo-500">Opportunities</span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowShortlistedOnly(!showShortlistedOnly)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all border ${showShortlistedOnly ? 'bg-rose-500 border-rose-500 text-white' : (darkMode ? 'border-white/10 text-slate-500 hover:border-white/30' : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white')}`}
                    >
                      <Heart size={12} fill={showShortlistedOnly ? "currentColor" : "none"} />
                      Shortlisted ({shortlisted.length})
                    </button>
                    {predictionResults.length > 0 && !showShortlistedOnly && (
                      <>
                        <button 
                          onClick={() => setIsPreferenceModalOpen(true)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all border ${darkMode ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20'}`}
                        >
                          <ListChecks size={12} />
                          Generate CAP List
                        </button>
                        <button 
                          onClick={() => { alert('Prediction report generated! You can now share this with your parents or mentors.'); }}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all border ${darkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                          <Share2 size={12} />
                          Share Report
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {!cetScore && !jeeScore && selectedRegions.length === 0 && selectedBranches.length === 0 && !searchQuery && !showShortlistedOnly && (
                  <button 
                    onClick={() => { setResults(COLLEGE_DB); setNationalResults(NATIONAL_COLLEGE_DB); }}
                    className="text-xs font-bold text-indigo-500 hover:text-indigo-400 cursor-pointer"
                  >
                    View All
                  </button>
                )}
              </div>
              {loading ? <SkeletonLoader darkMode={darkMode} /> : (
                <ResultsGrid 
                  data={showShortlistedOnly ? results.filter(c => shortlisted.includes(c.name)) : results} 
                  darkMode={darkMode} 
                  onSelect={setSelectedCollege}
                  shortlisted={shortlisted}
                  onToggleShortlist={toggleShortlist}
                  comparisonList={comparisonList}
                  onToggleComparison={toggleComparison}
                />
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Comparison Floating Bar */}
      <AnimatePresence>
        {comparisonList.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] w-full max-w-2xl px-4`}
          >
            <div className={`p-4 rounded-3xl border shadow-3xl flex items-center justify-between gap-4 ${darkMode ? 'bg-[#111] border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                {comparisonList.map(c => (
                  <div key={c.name} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${darkMode ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                    {c.name.split(' ').slice(0, 2).join(' ')}...
                    <button onClick={() => toggleComparison(c)} className="hover:text-rose-500"><CloseIcon size={14} /></button>
                  </div>
                ))}
                {comparisonList.length < 3 && (
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold px-2">
                    Add {3 - comparisonList.length} more
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setComparisonList([])}
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-rose-500 px-2"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setIsComparisonModalOpen(true)}
                  disabled={comparisonList.length < 2}
                  className={`px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${comparisonList.length >= 2 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  <GitCompare size={16} />
                  Compare Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCollege && (
          <CollegeModal 
            college={selectedCollege} 
            onClose={() => setSelectedCollege(null)} 
            darkMode={darkMode} 
            isShortlisted={shortlisted.includes(selectedCollege.name)}
            onToggleShortlist={() => toggleShortlist(selectedCollege.name)}
            isComparing={comparisonList.some(c => c.name === selectedCollege.name)}
            onToggleComparison={() => toggleComparison(selectedCollege)}
            user={user}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPreferenceModalOpen && (
          <PreferenceListModal 
            colleges={predictionResults} 
            onClose={() => setIsPreferenceModalOpen(false)} 
            darkMode={darkMode} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isComparisonModalOpen && (
          <ComparisonModal 
            colleges={comparisonList} 
            onClose={() => setIsComparisonModalOpen(false)} 
            darkMode={darkMode} 
            userCet={parseFloat(cetScore)}
            userJee={parseFloat(jeeScore)}
            stream={stream}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRoadmapOpen && (
          <RoadmapModal 
            stream={stream} 
            onClose={() => setIsRoadmapOpen(false)} 
            darkMode={darkMode} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCAPGuideOpen && (
          <CAPGuideModal 
            onClose={() => setIsCAPGuideOpen(false)} 
            darkMode={darkMode} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCategoryGuideOpen && (
          <CategoryRequirementsModal 
            onClose={() => setIsCategoryGuideOpen(false)} 
            darkMode={darkMode} 
            selectedCategory={category}
            onSelectCategory={setCategory}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal 
            onClose={() => setIsAuthModalOpen(false)} 
            onSuccess={(u) => { setUser(u); setIsAuthModalOpen(false); }}
            darkMode={darkMode} 
          />
        )}
      </AnimatePresence>

      {/* Floating Chatbot & WhatsApp */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
        <a 
          href="https://wa.me/919999999999?text=Hello%20OmniPath%20Team,%20I%20need%20urgent%20help%20with%20my%20admission%20process." 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-16 h-16 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all cursor-pointer"
          title="Contact on WhatsApp"
        >
          <MessageCircle size={28} />
        </a>
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all cursor-pointer"
        >
          {isChatOpen ? <CloseIcon size={24}/> : <MessageSquare size={24} />}
        </button>
        <AnimatePresence>
          {isChatOpen && (
            <ChatWindow 
              darkMode={darkMode} 
              userContext={{
                stream,
                cetScore,
                jeeScore,
                jeeAdvancedScore,
                category,
                regions: selectedRegions,
                selectedBranches
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const CollegeModal = ({ college, onClose, darkMode, isShortlisted, onToggleShortlist, isComparing, onToggleComparison, user }: { college: College; onClose: () => void; darkMode: boolean; isShortlisted: boolean; onToggleShortlist: () => void; isComparing: boolean; onToggleComparison: () => void; user: User | null }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/${encodeURIComponent(college.name)}`);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [college.name]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeName: college.name,
          userName: user.name,
          rating: newReview.rating,
          comment: newReview.comment
        }),
      });
      if (response.ok) {
        const addedReview = await response.json();
        setReviews(prev => [addedReview, ...prev]);
        setNewReview({ rating: 5, comment: '' });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-white/10 shadow-3xl ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-slate-900'}`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 sm:p-8 flex justify-between items-start bg-inherit border-b border-white/5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-lg uppercase tracking-widest">
                {typeof college.tier === 'number' ? `Tier ${college.tier}` : college.tier}
              </span>
              <span className="px-3 py-1 bg-white/5 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-widest">
                {college.type}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">{college.name}</h2>
            <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
              <MapPin size={14} />
              <span>{college.regions.join(', ')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleComparison(); }}
              className={`p-3 rounded-full transition-all hover:scale-110 ${isComparing ? 'bg-indigo-500/10 text-indigo-500' : (darkMode ? 'bg-white/5 text-slate-500 hover:bg-white/10' : 'bg-slate-100 text-slate-400 hover:bg-slate-200')}`}
              title={isComparing ? "Remove from Comparison" : "Add to Comparison"}
            >
              <GitCompare size={20} />
            </button>
            <a 
              href={`https://wa.me/919999999999?text=Hello%20OmniPath%20Team,%20I%20am%20interested%20in%20${encodeURIComponent(college.name)}.`}
              target="_blank" 
              rel="noopener noreferrer"
              className={`p-3 rounded-full transition-all hover:scale-110 ${darkMode ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
              title="Contact on WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleShortlist(); }}
              className={`p-3 rounded-full transition-all hover:scale-110 ${isShortlisted ? 'bg-rose-500/10 text-rose-500' : (darkMode ? 'bg-white/5 text-slate-500 hover:bg-white/10' : 'bg-slate-100 text-slate-400 hover:bg-slate-200')}`}
            >
              <Heart size={20} fill={isShortlisted ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={onClose}
              className={`p-3 rounded-full transition-all hover:scale-110 ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-10">
          {/* Description & Map */}
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {college.description && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-4 flex items-center gap-2">
                    <BookOpen size={14} /> About the Institute
                  </h3>
                  <p className={`text-lg leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {college.description}
                  </p>
                </section>
              )}

              {/* Placements Section */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 mb-6 flex items-center gap-2">
                  <Award size={14} /> Placement Statistics
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest block mb-1">Average Package</span>
                    <span className="text-2xl font-black text-indigo-500">{college.placements?.avgPackage || "N/A"}</span>
                  </div>
                  <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest block mb-1">Highest Domestic</span>
                    <span className="text-2xl font-black text-emerald-500">{college.placements?.highestPackage || "N/A"}</span>
                  </div>
                  <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest block mb-1">Highest International</span>
                    <span className="text-2xl font-black text-rose-500">{college.placements?.intlPackage || "N/A"}</span>
                  </div>
                </div>
                
                <div className={`mt-4 p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-4">Major Recruiting Companies</h4>
                  <div className="flex flex-wrap gap-2">
                    {(college.placements?.recruiters || ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant"]).map(r => (
                      <span key={r} className={`px-3 py-1 rounded-lg text-xs font-bold border ${darkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-600 shadow-sm'}`}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </div>
            <section className="lg:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500 mb-4 flex items-center gap-2">
                <MapPin size={14} /> Location
              </h3>
              <div className={`aspect-square w-full rounded-3xl overflow-hidden border ${darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-100'}`}>
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: darkMode ? 'invert(90%) hue-rotate(180deg) contrast(90%)' : 'none' }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(college.name + ' ' + college.regions.join(' '))}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
              <p className="mt-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold text-center">
                {college.regions.join(', ')}
              </p>
            </section>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Branches & Cutoffs */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-6 flex items-center gap-2">
                <GraduationCap size={14} /> Available Branches
              </h3>
              <div className="space-y-3">
                {college.branches?.map(branch => (
                  <div 
                    key={branch} 
                    className={`p-4 rounded-2xl border flex justify-between items-center ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}
                  >
                    <span className="font-bold text-sm">{branch}</span>
                  </div>
                ))}
                {!college.branches && (
                  <div className={`p-4 rounded-2xl border text-center ${darkMode ? 'bg-white/5 border-white/5 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    Admission based on merit list
                  </div>
                )}
              </div>
            </section>

            {/* Facilities & Rankings */}
            <div className="space-y-10">
              <section>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-6 flex items-center gap-2">
                  <Building2 size={14} /> Campus Facilities
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {(college.facilities || ["Modern Labs", "Library", "Sports Ground", "Hostel", "Cafeteria"]).map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-6 flex items-center gap-2">
                  <Award size={14} /> Rankings & Recognition
                </h3>
                <div className="space-y-3">
                  {(college.rankings || ["UGC Approved", "NAAC Accredited"]).map(r => (
                    <div key={r} className={`px-4 py-3 rounded-xl border flex items-center gap-3 text-sm font-medium ${darkMode ? 'bg-indigo-500/5 border-indigo-500/10 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
                      <ChevronRight size={14} />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Community Reviews Section */}
          <section className={`pt-10 border-t ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
                <MessageSquare size={14} /> Community Reviews
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={14} fill={s <= (reviews.length ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-bold">
                  {reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'No ratings'}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Review Form */}
              <div className="md:col-span-1">
                {user ? (
                  <form onSubmit={handleReviewSubmit} className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <h4 className="text-sm font-bold mb-4">Share your experience</h4>
                    <div className="flex gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button 
                          key={s} 
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: s })}
                          className={`p-1 transition-all ${newReview.rating >= s ? 'text-amber-500' : 'text-slate-400'}`}
                        >
                          <Star size={20} fill={newReview.rating >= s ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                    <textarea 
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="What was your experience like?"
                      className={`w-full h-32 p-4 rounded-2xl text-sm outline-none border transition-all mb-4 ${darkMode ? 'bg-white/5 text-white border-white/5 focus:ring-indigo-500' : 'bg-white text-slate-900 border-slate-200 focus:ring-indigo-500 shadow-sm'}`}
                      required
                    />
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                    >
                      {submitting ? 'Posting...' : 'Post Review'}
                    </button>
                  </form>
                ) : (
                  <div className={`p-6 rounded-3xl border text-center ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <p className="text-sm text-slate-500 mb-4">Sign in to leave a review</p>
                    <button 
                      onClick={onClose} // Simplified, user should login from main screen
                      className="text-xs font-bold text-indigo-500"
                    >
                      Close and Login
                    </button>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="md:col-span-2 space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {loadingReviews ? (
                  <div className="text-center py-10 text-slate-500 text-sm">Loading reviews...</div>
                ) : reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.id} className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="font-bold text-sm">{review.userName}</h5>
                          <div className="flex text-amber-500 mt-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={12} fill={s <= review.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-500 text-sm italic">
                    No reviews yet. Be the first to share your experience!
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Footer Action */}
          <div className={`pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between`}>
            <div className="text-slate-500 text-xs">
              * Admission chances are based on previous year's CAP round trends.
            </div>
            <a 
              href={college.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20"
            >
              Official Website <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const PreferenceListModal = ({ colleges, onClose, darkMode }: { colleges: (College & { chance: string })[]; onClose: () => void; darkMode: boolean }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = colleges.map((c, i) => `${i + 1}. ${c.name} (${c.regions.join(', ')}) - ${c.chance} Chance`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-[2.5rem] border border-white/10 shadow-3xl ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-slate-900'}`}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase">
              CAP<span className="text-indigo-500"> Preference List</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 size={12} className="text-emerald-500" />
              Optimized for 100% Admission Success
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-all">
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {colleges.map((c, i) => (
            <div key={i} className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{c.name}</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{c.regions.join(', ')}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                c.chance === 'Safe' ? 'bg-emerald-500/10 text-emerald-500' : 
                c.chance === 'Good' ? 'bg-indigo-500/10 text-indigo-500' : 
                'bg-amber-500/10 text-amber-500'
              }`}>
                {c.chance}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-4">
          <button 
            onClick={handleCopy}
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {copied ? <CheckCircle2 size={18} /> : <Download size={18} />}
            {copied ? 'Copied to Clipboard' : 'Copy Preference List'}
          </button>
        </div>
        
        <p className="mt-6 text-[10px] text-slate-500 text-center leading-relaxed">
          * This list is generated based on historical admission trends and your current percentile. 
          We recommend placing "Ambitious" choices at the top, followed by "Good" and then "Safe" bets to ensure 100% admission.
        </p>
      </motion.div>
    </div>
  );
};

const ComparisonModal = ({ colleges, onClose, darkMode, userCet, userJee, stream }: { colleges: College[]; onClose: () => void; darkMode: boolean; userCet: number; userJee: number; stream: string }) => {
  const calculateProbability = (college: College) => {
    let collegeCutoff = college.cutoff;
    let userScore = userCet;

    if (stream === 'engineering') {
      if (!isNaN(userCet) && college.cetCutoff) {
        collegeCutoff = college.cetCutoff;
        userScore = userCet;
      } else if (!isNaN(userJee) && college.jeeCutoff) {
        collegeCutoff = college.jeeCutoff;
        userScore = userJee;
      } else {
        userScore = Math.max(isNaN(userCet) ? 0 : userCet, isNaN(userJee) ? 0 : userJee);
      }
    } else {
      userScore = userCet; // For medical/commerce/polytechnic, cetScore is used for the primary score
    }

    if (isNaN(userScore) || userScore === 0) return null;

    const diff = userScore - collegeCutoff;
    if (diff >= 5) return 98;
    if (diff >= 3) return 92;
    if (diff >= 1) return 85;
    if (diff >= 0) return 75;
    if (diff >= -1) return 60;
    if (diff >= -2) return 45;
    if (diff >= -3) return 30;
    if (diff >= -5) return 15;
    return 5;
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/80 backdrop-blur-md"
    />
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`relative w-full max-w-6xl max-h-[90vh] overflow-y-auto p-8 rounded-[2.5rem] border border-white/10 shadow-3xl ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-slate-900'}`}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black tracking-tighter uppercase">
          College<span className="text-indigo-500"> Comparison</span>
        </h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-all">
          <CloseIcon size={20} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={`p-6 text-left text-xs font-bold uppercase tracking-widest text-slate-500 border-b ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>Feature</th>
              {colleges.map(c => (
                <th key={c.name} className={`p-6 text-left border-b ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
                  <div className="text-lg font-black tracking-tighter leading-tight">{c.name}</div>
                  <div className="text-[10px] text-indigo-500 uppercase font-bold mt-1">Tier {c.tier}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {[
              { label: "Type", key: "type" },
              { label: "Exam", key: "exam" },
              { label: "Region", key: "regions", format: (v: string[]) => v.join(', ') },
              { label: "Branches", key: "branches", format: (v: string[]) => v?.slice(0, 4).join(', ') || 'N/A' },
              { label: "Facilities", key: "facilities", format: (v: string[]) => v?.slice(0, 3).join(', ') || 'Standard' },
              { label: "Avg Package", key: "placements", format: (v: any) => v?.avgPackage || 'N/A' },
              { label: "Highest Package", key: "placements", format: (v: any) => v?.highestPackage || 'N/A' },
              { label: "Top Recruiters", key: "placements", format: (v: any) => v?.recruiters?.slice(0, 3).join(', ') || 'N/A' },
              { 
                label: "Admission Probability", 
                key: "probability", 
                custom: (c: College) => {
                  const prob = calculateProbability(c);
                  if (prob === null) return <span className="text-slate-500 italic">Enter score to see</span>;
                  
                  let colorClass = "text-rose-500";
                  if (prob >= 80) colorClass = "text-emerald-500";
                  else if (prob >= 50) colorClass = "text-amber-500";

                  return (
                    <div className="flex flex-col gap-1">
                      <div className={`text-xl font-black ${colorClass}`}>{prob}%</div>
                      <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${prob >= 80 ? 'bg-emerald-500' : prob >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${prob}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              },
            ].map(row => (
              <tr key={row.label} className={`group ${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                <td className={`p-6 font-bold text-slate-500 border-b ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>{row.label}</td>
                {colleges.map(c => (
                  <td key={c.name} className={`p-6 border-b ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
                    {(row as any).custom ? (row as any).custom(c) : (row.format ? row.format((c as any)[row.key]) : (c as any)[row.key] || 'N/A')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex justify-center">
        <button 
          onClick={onClose}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20"
        >
          Close Comparison
        </button>
      </div>
    </motion.div>
  </div>
  );
};

const RoadmapModal = ({ stream, onClose, darkMode }: { stream: string; onClose: () => void; darkMode: boolean }) => {
  const roadmap = CAREER_ROADMAPS[stream];
  if (!roadmap) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 rounded-[2.5rem] border border-white/10 shadow-3xl ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-slate-900'}`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black tracking-tighter uppercase">
            {roadmap.title.split(' ')[0]}<span className="text-emerald-500"> {roadmap.title.split(' ').slice(1).join(' ')}</span>
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-all">
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {roadmap.options.map((opt, i) => (
            <div key={i} className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] ${darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-indigo-500">{opt.name}</h3>
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${darkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
                  {opt.path}
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className="font-bold text-emerald-500">AI Insight:</span> {opt.intelligence}
              </p>
            </div>
          ))}
        </div>

        <div className={`mt-10 p-6 rounded-3xl border ${darkMode ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-100'}`}>
          <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2">Expert Tip</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Choose a path that aligns with your natural strengths. If you're analytical, go for Finance or Engineering. If you're empathetic and resilient, Medical is your calling.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const CAPGuideModal = ({ onClose, darkMode }: { onClose: () => void; darkMode: boolean }) => (
  <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/80 backdrop-blur-md"
    />
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 rounded-[2.5rem] border border-white/10 shadow-3xl ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-slate-900'}`}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black tracking-tighter uppercase">
          CAP Round<span className="text-indigo-500"> Guide</span>
        </h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-all">
          <CloseIcon size={20} />
        </button>
      </div>

      <div className="space-y-8">
        {CAP_ROUND_GUIDE.map((step, i) => (
          <div key={i} className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/20">
              {step.step}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold">{step.title}</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-10 p-6 rounded-3xl border ${darkMode ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100'}`}>
        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Pro Tip</h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          Always fill as many options as possible in CAP Round 1. If you get your 1st preference, it's an "Auto-Freeze" and you MUST take it. For other preferences, you can choose to "Float" and wait for Round 2.
        </p>
      </div>
    </motion.div>
  </div>
);

const CategoryRequirementsModal = ({ onClose, darkMode, selectedCategory, onSelectCategory }: { onClose: () => void; darkMode: boolean; selectedCategory: string; onSelectCategory: (c: string) => void }) => (
  <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/80 backdrop-blur-md"
    />
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 rounded-[2.5rem] border border-white/10 shadow-3xl ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-slate-900'}`}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black tracking-tighter uppercase">
          Admission<span className="text-amber-500"> Requirements</span>
        </h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-all">
          <CloseIcon size={20} />
        </button>
      </div>

      <div className="space-y-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${selectedCategory === cat ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-500/20' : (darkMode ? 'border-white/10 text-slate-500 bg-white/5' : 'border-slate-200 text-slate-500 bg-white')}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {selectedCategory && CATEGORY_REQUIREMENTS[selectedCategory] ? (
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 mb-4 flex items-center gap-2">
                <ListChecks size={14} /> Mandatory Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORY_REQUIREMENTS[selectedCategory].documents.map((doc, i) => (
                  <div key={i} className={`p-4 rounded-2xl border flex items-center gap-3 ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm font-medium">{doc}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-4 flex items-center gap-2">
                <Award size={14} /> Reservation Benefits
              </h3>
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100'}`}>
                <p className="text-sm leading-relaxed font-medium">
                  {CATEGORY_REQUIREMENTS[selectedCategory].benefits}
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500 mb-4 flex items-center gap-2">
                <Sparkles size={14} /> Scholarship & Fee Waiver
              </h3>
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-100'}`}>
                <p className="text-sm leading-relaxed font-medium">
                  {CATEGORY_REQUIREMENTS[selectedCategory].scholarship}
                </p>
              </div>
            </section>
          </div>
        ) : (
          <div className="text-center py-12">
            <Info size={48} className="mx-auto text-slate-500 mb-4 opacity-20" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Select a category to view specific requirements</p>
          </div>
        )}
      </div>

      <div className={`mt-10 p-6 rounded-3xl border ${darkMode ? 'bg-amber-500/5 border-amber-500/10' : 'bg-amber-50 border-amber-100'}`}>
        <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2">Important Note</h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          Ensure all certificates (Caste, Validity, NCL) are valid for the current financial year. Non-Creamy Layer (NCL) is mandatory for OBC, VJ/DT, NT, and SBC categories to avail reservation.
        </p>
      </div>
    </motion.div>
  </div>
);

const AuthModal = ({ onClose, onSuccess, darkMode }: { onClose: () => void; onSuccess: (u: User) => void; darkMode: boolean }) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('omnipath_user', JSON.stringify(data.user));
      onSuccess(data.user);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative w-full max-w-md p-8 rounded-[2.5rem] border border-white/10 shadow-3xl ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-slate-900'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black tracking-tighter uppercase">
            Omni<span className="text-indigo-500">Path</span>
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-all">
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className={`flex p-1 rounded-2xl mb-8 ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
          <button 
            onClick={() => setMode('register')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${mode === 'register' ? (darkMode ? 'bg-white text-black' : 'bg-white text-indigo-600 shadow-sm') : 'text-slate-500'}`}
          >
            Create New Account
          </button>
          <button 
            onClick={() => setMode('login')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${mode === 'login' ? (darkMode ? 'bg-white text-black' : 'bg-white text-indigo-600 shadow-sm') : 'text-slate-500'}`}
          >
            Sign In
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <Input 
              label="Full Name" 
              placeholder="e.g. Rahul Sharma" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              darkMode={darkMode}
            />
          )}
          <Input 
            label="Email Address" 
            placeholder="rahul@example.com" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            darkMode={darkMode}
          />
          <Input 
            label="Phone Number" 
            placeholder="+91 98765 43210" 
            value={formData.phone} 
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
            darkMode={darkMode}
          />

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 mt-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (mode === 'register' ? 'Create New Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-[10px] text-slate-500 font-medium">
            {mode === 'register' 
              ? "By creating an account, you agree to our Terms of Service." 
              : "Welcome back! Sign in to access your shortlisted colleges."}
          </p>
          
          <div className={`pt-6 border-t ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3">Need Help?</p>
            <a 
              href="https://wa.me/919999999999?text=Hello%20OmniPath%20Team,%20I%20need%20help%20with%20my%20account." 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold transition-all border ${darkMode ? 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}
            >
              <MessageCircle size={16} />
              Contact Support via WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StreamToggle = ({ active, set, darkMode }: { active: string; set: (s: string) => void; darkMode: boolean }) => (
  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    {['Engineering', 'Medical', 'Commerce', 'Polytechnic'].map(s => (
      <button 
        key={s} onClick={() => set(s.toLowerCase())}
        className={`px-5 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${active === s.toLowerCase() ? (darkMode ? 'bg-white text-black border-white' : 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/20') : (darkMode ? 'border-white/10 text-slate-500 hover:border-white/30' : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white')}`}
      >
        {s}
      </button>
    ))}
  </div>
);

const Input = ({ label, placeholder, value, onChange, darkMode, type = "text" }: { label: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; darkMode: boolean; type?: string }) => (
  <div className="space-y-2 flex-1">
    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{label}</label>
    <input 
      type={type}
      className={`w-full border rounded-xl p-4 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`} 
      placeholder={placeholder} 
      value={value}
      onChange={onChange}
    />
  </div>
);

const ResultsGrid = ({ data, darkMode, onSelect, shortlisted, onToggleShortlist, comparisonList, onToggleComparison }: { data: (College & { chance?: string })[]; darkMode: boolean; onSelect: (c: College) => void; shortlisted: string[]; onToggleShortlist: (name: string) => void; comparisonList: College[]; onToggleComparison: (c: College) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {data.length > 0 ? data.map((col, i) => (
      <motion.div 
        key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1 }}
        onClick={() => onSelect(col)}
        className={`p-6 rounded-3xl border transition-all group flex flex-col justify-between cursor-pointer relative ${darkMode ? 'bg-white/5 border-white/5 hover:border-indigo-500/50' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-500/50'}`}
      >
        <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
          {col.chance && (
            <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
              col.chance === 'Safe' ? 'bg-emerald-500/10 text-emerald-500' : 
              col.chance === 'Good' ? 'bg-indigo-500/10 text-indigo-500' : 
              'bg-amber-500/10 text-amber-500'
            }`}>
              {col.chance}
            </div>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleComparison(col); }}
            className={`p-2 rounded-full transition-all ${comparisonList.some(c => c.name === col.name) ? 'bg-indigo-500/10 text-indigo-500' : (darkMode ? 'bg-white/5 text-slate-500 hover:bg-white/10' : 'bg-slate-100 text-slate-400 hover:bg-slate-200')}`}
            title="Compare"
          >
            <GitCompare size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleShortlist(col.name); }}
            className={`p-2 rounded-full transition-all ${shortlisted.includes(col.name) ? 'bg-rose-500/10 text-rose-500' : (darkMode ? 'bg-white/5 text-slate-500 hover:bg-white/10' : 'bg-slate-100 text-slate-400 hover:bg-slate-200')}`}
          >
            <Heart size={16} fill={shortlisted.includes(col.name) ? "currentColor" : "none"} />
          </button>
        </div>
        <div>
          <div className="flex justify-between mb-4 pr-32 gap-2">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-lg uppercase">
              {typeof col.tier === 'number' ? `Tier ${col.tier}` : col.tier}
            </span>
            {col.level === 'National' && (
              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-lg uppercase">
                National
              </span>
            )}
            {(col.tier === 1 || col.tier === 'Elite') && (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-lg uppercase flex items-center gap-1">
                <Sparkles size={10} />
                Featured
              </span>
            )}
          </div>
          <h4 className={`font-bold text-xl group-hover:text-indigo-400 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>{col.name}</h4>
          <p className="text-slate-500 text-sm mt-1">{col.regions.join(', ')}</p>
          
          <div className="mt-4 flex flex-col gap-2">
            <div className={`flex items-center justify-between p-4 rounded-2xl border ${darkMode ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-indigo-500 tracking-widest mb-1">Expected Cutoff</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{col.cutoff}</span>
                  <span className="text-[10px] font-bold text-indigo-500/60 uppercase">{col.exam.includes('%') || col.exam.includes('ile') ? '%' : 'Marks'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Exam Type</span>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-bold inline-block ${darkMode ? 'bg-white/10 text-white' : 'bg-white text-slate-700 shadow-sm'}`}>
                  {col.exam}
                </div>
              </div>
            </div>
          </div>

          {col.branches && (
            <div className="mt-4 flex flex-wrap gap-1">
              {col.branches.slice(0, 3).map(b => (
                <span key={b} className={`text-[9px] px-2 py-0.5 rounded-md border ${darkMode ? 'bg-white/5 text-slate-400 border-white/5' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>{b}</span>
              ))}
              {col.branches.length > 3 && <span className="text-[9px] text-slate-600">+{col.branches.length - 3} more</span>}
            </div>
          )}

          {col.placements && (
            <div className={`mt-4 p-3 rounded-xl flex items-center justify-between ${darkMode ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-emerald-50 border border-emerald-100'}`}>
              <div className="flex flex-col">
                <span className="text-[8px] uppercase font-black text-emerald-600 tracking-widest">Avg Package</span>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">{col.placements.avgPackage}</span>
              </div>
              <div className="h-6 w-[1px] bg-emerald-500/20" />
              <div className="flex flex-col text-right">
                <span className="text-[8px] uppercase font-black text-emerald-600 tracking-widest">Highest</span>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">{col.placements.highestPackage}</span>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <a 
            href={col.website} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            Visit Website <Sparkles size={12} />
          </a>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
            View Details →
          </span>
        </div>
      </motion.div>
    )) : (
      <div className={`col-span-full p-12 rounded-3xl border border-dashed flex flex-col items-center text-center ${darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
        <div className={`p-4 rounded-full mb-4 ${darkMode ? 'bg-white/5 text-slate-500' : 'bg-white text-slate-300 shadow-sm'}`}>
          <Search size={32} />
        </div>
        <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>No matches found</h4>
        <p className="text-slate-500 text-sm max-w-xs mt-2">Try adjusting your filters or search query to find more opportunities.</p>
        <button 
          onClick={() => { window.location.reload(); }}
          className="mt-6 text-indigo-500 font-bold text-sm hover:underline"
        >
          Reset all filters
        </button>
      </div>
    )}
  </div>
);

const ChatWindow = ({ darkMode, userContext }: { darkMode: boolean; userContext: any }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hello! I'm OmniPath Concierge AI. I see you're interested in ${userContext.stream}${userContext.category ? ` (${userContext.category} category)` : ''}. How can I assist you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "What are the top 5 engineering colleges in Pune?",
    "How does the CAP round process work?",
    "Tell me about VNIT Nagpur cutoffs.",
    "What is the difference between HU and OHU quota?",
    "Is a Polytechnic diploma better than 11th/12th?"
  ];

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await askGemini(messageText, history, userContext);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 50, opacity: 0, scale: 0.95 }}
      className={`absolute bottom-20 right-0 w-80 sm:w-96 h-[550px] rounded-[2rem] border border-white/10 shadow-3xl flex flex-col overflow-hidden ${darkMode ? 'bg-[#111]' : 'bg-white'}`}
    >
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-indigo-600 text-white">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span className="text-sm font-bold tracking-widest uppercase">Concierge AI</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[8px] uppercase font-bold tracking-tighter opacity-80">Personalized Mode Active</span>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'model', text: "Hello! I'm OmniPath Concierge AI. How can I assist you today?" }])}
          className="text-[10px] uppercase tracking-widest font-bold opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
        >
          Clear
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white' : (darkMode ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-700')}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`p-3 rounded-2xl text-sm flex items-center gap-2 ${darkMode ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        
        {messages.length === 1 && (
          <div className="pt-4 space-y-2">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Suggested Topics</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(q)}
                  className={`text-left px-3 py-2 rounded-xl text-[11px] border transition-all cursor-pointer ${darkMode ? 'border-white/5 bg-white/5 text-slate-400 hover:border-indigo-500/50 hover:text-indigo-400' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-500/50 hover:text-indigo-600'}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex gap-2 border-t border-white/5">
        <input 
          className={`flex-1 rounded-xl px-4 text-xs outline-none focus:ring-1 focus:ring-indigo-500 ${darkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'}`} 
          placeholder="Ask about CAP rounds, cutoffs, or career paths..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={() => handleSend()}
          disabled={isTyping}
          className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-50"
        >
          <Send size={14}/>
        </button>
      </div>
    </motion.div>
  );
};

const SkeletonLoader = ({ darkMode }: { darkMode: boolean }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
    {[1, 2, 3, 4].map(i => <div key={i} className={`h-40 rounded-3xl ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`} />)}
  </div>
);

export default App;
