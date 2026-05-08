import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, GraduationCap, LayoutGrid, MessageSquare, Send, Sparkles, X as CloseIcon, MapPin, ExternalLink, Award, Building2, BookOpen, ChevronRight, Heart, User as UserIcon, Phone, MessageCircle, LogOut, Info, HelpCircle, GitCompare, ArrowRightLeft, ListChecks, Download, CheckCircle2, Star, Compass, Search, Share2, Menu, ChevronLeft, Home, Settings, FileText, Layers, ShieldCheck, Users, CreditCard, Plus, Ban, Unlock, Languages, Video, Play, Loader2, TrendingUp, Zap, Trophy, FlaskConical, Users2, Microscope } from 'lucide-react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
import { askGemini, discoverVibeVideos, fetchCollegeFees, fetchCollegeDetails } from './services/gemini';
import { COLLEGE_DB, REGION_CLUSTERS, CATEGORIES, CAP_ROUND_GUIDE, ENGINEERING_BRANCHES, MEDICAL_BRANCHES, COMMERCE_BRANCHES, CAREER_ROADMAPS, CATEGORY_REQUIREMENTS, NATIONAL_COLLEGE_DB } from './constants';
import { User, College, ChatMessage } from './types';
import { LifeSimulatorModal } from './components/LifeSimulatorModal';
import { CreatorPortal } from './components/CreatorPortal';
import { RankPredictorModal } from './components/RankPredictorModal';
import CareerRoadmapModal from './components/CareerRoadmapModal';
import { Sidebar } from './components/Sidebar';
import { auth, db, loginWithGoogle, logout as firebaseLogout, createUserProfile, getUserProfile, requestInstitute, approveInstitute, rejectInstitute, addStudent, getAllUsers, getAllInstituteRequests, getAllApprovedInstitutes, getInstituteStudents, getAllColleges, addCollege, deleteCollege, addReview, getCollegeReviews, getCollegeVibeVideos, UserProfile, Institute, Student, Review, VibeVideo } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

const CursorBubbles = () => {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; color: string; offsetX: number; offsetY: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newBubble = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 15 + 5,
        color: Math.random() > 0.5 ? '#6366f1' : '#10b981',
        offsetX: (Math.random() - 0.5) * 50,
        offsetY: (Math.random() - 0.5) * 50,
      };

      setBubbles((prev) => [...prev.slice(-15), newBubble]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            initial={{ opacity: 0.8, scale: 0, x: bubble.x - bubble.size / 2, y: bubble.y - bubble.size / 2 }}
            animate={{ 
              opacity: 0, 
              scale: 2, 
              x: bubble.x - bubble.size / 2 + bubble.offsetX, 
              y: bubble.y - bubble.size / 2 + bubble.offsetY 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: 'absolute',
              width: bubble.size,
              height: bubble.size,
              borderRadius: '50%',
              backgroundColor: bubble.color,
              filter: 'blur(2px)',
              boxShadow: `0 0 8px ${bubble.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<{ open: boolean; mode: 'login' | 'register' }>({ open: false, mode: 'register' });
  const [isCAPGuideOpen, setIsCAPGuideOpen] = useState(false);
  const [isCategoryGuideOpen, setIsCategoryGuideOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isRankPredictorOpen, setIsRankPredictorOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [comparisonList, setComparisonList] = useState<College[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);
  const [predictionResults, setPredictionResults] = useState<(College & { chance: 'Safe' | 'Good' | 'Ambitious' })[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth > 1024);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [commerceExam, setCommerceExam] = useState('12th Commerce %');
  const [customColleges, setCustomColleges] = useState<College[]>([]);
  const [isLifeSimOpen, setIsLifeSimOpen] = useState(false);
  const [simCollege, setSimCollege] = useState<string>('');
  const [feesCache, setFeesCache] = useState<Record<string, any>>({});
  const [firebaseUser, setFirebaseUser] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [pendingInstitutes, setPendingInstitutes] = useState<Institute[]>([]);
  const [approvedInstitutes, setApprovedInstitutes] = useState<Institute[]>([]);
  const [myInstitute, setMyInstitute] = useState<Institute | null>(null);
  const [myStudents, setMyStudents] = useState<Student[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestName, setRequestName] = useState('');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarVisible(false);
        setIsSidebarOpen(true);
      } else {
        setIsSidebarVisible(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allColleges = [...COLLEGE_DB, ...customColleges];

  const popularRegions = ["Mumbai", "Pune", "Nashik", "Nagpur", "Nanded", "Aurangabad", "Amravati", "Kolhapur"];
  
  const getBranches = () => {
    if (stream === 'medical') return MEDICAL_BRANCHES;
    if (stream === 'commerce') return COMMERCE_BRANCHES;
    return ENGINEERING_BRANCHES;
  };

  const currentBranches = getBranches();

  useEffect(() => {
    const unsubscribe = getAllColleges((data) => {
      setCustomColleges(data);
    });
    checkApiKey();
    return () => unsubscribe();
  }, []);

  const checkApiKey = async () => {
    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(selected);
    }
  };

  const handleOpenApiKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
      setIsApiKeyModalOpen(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await createUserProfile(user);
        setFirebaseUser(profile);
        const userData = {
          id: profile.uid,
          name: profile.name,
          email: profile.email,
          phone: profile.phone || '',
          isPremium: true,
          role: profile.role as any,
          isBlocked: profile.isBlocked || false
        };
        setUser(userData);
        localStorage.setItem('omnipath_user', JSON.stringify(userData));
      } else {
        setFirebaseUser(null);
        setUser(null);
        localStorage.removeItem('omnipath_user');
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Super Admin: Listen for pending institutes
  useEffect(() => {
    if (firebaseUser?.role === 'super_admin') {
      const q = query(collection(db, 'institutes'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        setPendingInstitutes(snapshot.docs.map(doc => doc.data() as Institute));
      });
    }
  }, [firebaseUser]);

  // Super Admin: Listen for all approved institutes
  useEffect(() => {
    if (firebaseUser?.role === 'super_admin') {
      const q = query(collection(db, 'institutes'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        setApprovedInstitutes(snapshot.docs.map(doc => doc.data() as Institute));
      });
    }
  }, [firebaseUser]);

  // Institute Admin: Listen for their institute
  useEffect(() => {
    if (firebaseUser?.role === 'institute_admin' && firebaseUser.instituteId) {
      const q = query(collection(db, 'institutes'), where('id', '==', firebaseUser.instituteId));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setMyInstitute(snapshot.docs[0].data() as Institute);
        }
      });
    }
  }, [firebaseUser]);

  // Institute Admin: Listen for their students
  useEffect(() => {
    if (firebaseUser?.role === 'institute_admin' && firebaseUser.instituteId) {
      const q = query(collection(db, 'institutes', firebaseUser.instituteId, 'students'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        setMyStudents(snapshot.docs.map(doc => doc.data() as Student));
      });
    }
  }, [firebaseUser]);

  const handleGoogleLogin = async (extraData?: { phone?: string; requestedRole?: string; name?: string }) => {
    try {
      const user = await loginWithGoogle();
      const profile = await createUserProfile(user, 'student', extraData);
      setFirebaseUser(profile);
      const userData = {
        id: profile.uid,
        name: profile.name,
        email: profile.email,
        phone: profile.phone || '',
        isPremium: true,
        role: profile.role as any,
        isBlocked: profile.isBlocked || false
      };
      setUser(userData);
      localStorage.setItem('omnipath_user', JSON.stringify(userData));
      setIsAuthModalOpen({ open: false, mode: 'login' });
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log("Login cancelled by user");
        return;
      }
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleFirebaseLogout = async () => {
    await firebaseLogout();
    setFirebaseUser(null);
    setUser(null);
    setActiveTab('dashboard');
  };

  const handleRequestInstitute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    setLoading(true);
    try {
      await requestInstitute(requestName, firebaseUser.uid, firebaseUser.email, firebaseUser.name);
      setIsRequestModalOpen(false);
      setRequestName('');
      alert("Request submitted! Please wait for approval from omkhalkar9995@gmail.com");
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (name: string, email: string) => {
    if (!firebaseUser?.instituteId) return;
    try {
      await addStudent(firebaseUser.instituteId, name, email, firebaseUser.uid);
    } catch (error) {
      console.error("Add student failed:", error);
    }
  };

  useEffect(() => {
    setSelectedBranches([]);
    setPredictionResults([]);
    setCommerceExam('12th Commerce %');
    setResults(allColleges.filter(c => c.type.toLowerCase() === stream.toLowerCase()).slice(0, 4));
    setNationalResults(NATIONAL_COLLEGE_DB.filter(c => c.type.toLowerCase() === stream.toLowerCase()).slice(0, 3));
  }, [stream, customColleges]);

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
      setIsAuthModalOpen({ open: true, mode: 'register' });
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

      const filteredState = allColleges.filter(filterFn);
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
    
    // Immediate execution for better performance
    const userCet = parseFloat(cetScore);
    const userJee = parseFloat(jeeScore);
    const userAdv = parseFloat(jeeAdvancedScore);
    const userScore = stream === 'engineering' 
      ? Math.max(isNaN(userCet) ? 0 : userCet, isNaN(userJee) ? 0 : userJee, isNaN(userAdv) ? 0 : userAdv) 
      : parseFloat(cetScore);

    const predictFn = (c: College) => {
      // Early exit for stream mismatch - most common filter
      if (c.type.toLowerCase() !== stream.toLowerCase()) return null;
      
      const matchesExam = stream === 'commerce' ? c.exam === commerceExam : true;
      if (!matchesExam) return null;

      const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return null;

      const matchesRegion = selectedRegions.length === 0 || c.regions.some(r => {
        const collegeRegion = r.toLowerCase();
        return selectedRegions.some(sr => {
          const searchRegion = sr.toLowerCase();
          const cluster = REGION_CLUSTERS[searchRegion];
          return cluster ? cluster.some(cr => collegeRegion.includes(cr)) : collegeRegion.includes(searchRegion);
        });
      });
      if (!matchesRegion) return null;

      const matchesBranch = selectedBranches.length === 0 || (c.branches && c.branches.some(b => 
        selectedBranches.some(sb => b.toLowerCase().includes(sb.toLowerCase()))
      ));
      if (!matchesBranch) return null;
      
      let baseCutoff = c.cutoff;
      let isCategoryAdjusted = false;
      
      // Determine base cutoff based on exam and scores
      if (stream === 'engineering') {
        if (c.exam === 'JEE Advanced' && !isNaN(userAdv)) baseCutoff = c.jeeAdvancedCutoff || c.cutoff;
        else if (!isNaN(userCet) && c.cetCutoff && c.exam === 'MHT-CET') baseCutoff = c.cetCutoff;
        else if (!isNaN(userJee) && c.jeeCutoff && c.exam === 'JEE Main') baseCutoff = c.jeeCutoff;
      }

      // Branch-specific logic
      if (selectedBranches.length > 0 && c.branchCutoffs) {
        const branchMatches = Object.entries(c.branchCutoffs).filter(([branch]) => 
          selectedBranches.some(sb => branch.toLowerCase().includes(sb.toLowerCase()))
        );
        if (branchMatches.length > 0) {
          baseCutoff = Math.min(...branchMatches.map(([_, cutoff]) => cutoff));
        }
      }

      // Category-based adjustments (heuristic trends for Maharashtra)
      let adjustedCutoff = baseCutoff;
      const cat = category.toLowerCase();
      if (cat !== 'open' && cat !== '') {
        isCategoryAdjusted = true;
        if (cat.includes('obc') || cat.includes('ews')) adjustedCutoff -= 2.0;
        else if (cat.includes('sc')) adjustedCutoff -= 8.0;
        else if (cat.includes('st')) adjustedCutoff -= 12.0;
        else if (cat.includes('vj') || cat.includes('nt') || cat.includes('sbc')) adjustedCutoff -= 4.5;
        else if (cat.includes('sebc')) adjustedCutoff -= 2.5;
        
        // Ensure cutoff doesn't go below reasonable minimums
        adjustedCutoff = Math.max(adjustedCutoff, 20);
      }

      let chance: 'Safe' | 'Good' | 'Ambitious' = 'Ambitious';
      const currentScore = (c.exam === 'JEE Advanced' && !isNaN(userAdv)) ? userAdv : userScore;
      const diff = currentScore - adjustedCutoff;

      if (diff >= 3) chance = 'Safe';
      else if (diff >= -1) chance = 'Good'; // Close margin
      else if (diff >= -8) chance = 'Ambitious';
      else return null;

      return { ...c, chance, displayCutoff: adjustedCutoff, isCategoryAdjusted };
    };

    // Use a single pass for filtering and mapping
    const filteredState: (College & { chance: 'Safe' | 'Good' | 'Ambitious'; displayCutoff: number; isCategoryAdjusted: boolean })[] = [];
    for (const c of allColleges) {
      const predicted = predictFn(c);
      if (predicted) filteredState.push(predicted as any);
    }

    const filteredNational: (College & { chance: 'Safe' | 'Good' | 'Ambitious'; displayCutoff: number; isCategoryAdjusted: boolean })[] = [];
    for (const c of NATIONAL_COLLEGE_DB) {
      const predicted = predictFn(c);
      if (predicted) filteredNational.push(predicted as any);
    }

    const chanceOrder = { 'Safe': 0, 'Good': 1, 'Ambitious': 2 };
    const sortFn = (a: any, b: any) => {
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
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 flex flex-col lg:flex-row overflow-x-hidden ${darkMode ? 'dark bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <CursorBubbles />
      <Sidebar
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        darkMode={darkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showShortlistedOnly={showShortlistedOnly}
        setShowShortlistedOnly={setShowShortlistedOnly}
        shortlisted={shortlisted}
        setIsPreferenceModalOpen={setIsPreferenceModalOpen}
        setIsComparisonModalOpen={setIsComparisonModalOpen}
        comparisonList={comparisonList}
        setIsRankPredictorOpen={setIsRankPredictorOpen}
        setIsLifeSimOpen={setIsLifeSimOpen}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        setIsCAPGuideOpen={setIsCAPGuideOpen}
        setIsRoadmapOpen={setIsRoadmapOpen}
        results={results}
        setSelectedCollege={setSelectedCollege}
        user={user}
        firebaseUser={firebaseUser}
        setIsRequestModalOpen={setIsRequestModalOpen}
        handleFirebaseLogout={handleFirebaseLogout}
        setIsAuthModalOpen={setIsAuthModalOpen}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 w-full min-w-0 ${!isSidebarVisible ? 'pl-0' : (isSidebarOpen ? 'lg:pl-[260px]' : 'lg:pl-[80px]')}`}>
        {/* Navbar */}
        <nav className="px-4 sm:px-[clamp(1rem,5vw,4rem)] py-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-50 border-b border-white/5 w-full">
          <div className="flex items-center gap-4">
            {!isSidebarVisible && (
              <button 
                onClick={() => setIsSidebarVisible(true)}
                className={`p-2 rounded-xl transition-all ${darkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                title="Show Sidebar"
              >
                <Menu size={20} />
              </button>
            )}
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
            <div className={`h-8 w-[1px] ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`} />
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-xs font-bold">{user.name}</span>
                  <span className="text-[10px] text-slate-500">{user.email}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                  {user.name[0]}
                </div>
                <button 
                  onClick={handleFirebaseLogout}
                  className={`p-3 rounded-full hover:bg-white/10 transition-all cursor-pointer text-rose-500`}
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAuthModalOpen({ open: true, mode: 'login' })}
                  className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${darkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setIsAuthModalOpen({ open: true, mode: 'register' })}
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

        <main className="max-w-[1440px] mx-auto px-4 sm:px-[clamp(1rem,5vw,4rem)] py-12 w-full">
          {/* Admin & Super Admin Dashboards */}
          {(activeTab === 'admin' || activeTab === 'super_admin') && (firebaseUser?.role === 'super_admin' || user?.role === 'admin') && (
            <AdminDashboard darkMode={darkMode} />
          )}

          {/* Institute Admin Dashboard */}
          {activeTab === 'my_institute' && firebaseUser?.role === 'institute_admin' && myInstitute && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black tracking-tighter">{myInstitute.name}</h2>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Institute ID: {myInstitute.id}</p>
                    </div>
                  </div>
                  <p className="text-slate-500">Manage your students and institutional records.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  <ShieldCheck size={14} />
                  Verified Institute
                </div>
              </div>

              <div className="grid md:grid-cols-12 gap-8">
                <div className="md:col-span-4 space-y-6">
                  <div className={`p-8 rounded-[2rem] border ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-slate-100 shadow-2xl'}`}>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-indigo-500">
                      <Plus size={16} />
                      Add New Student
                    </h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const name = (form.elements.namedItem('studentName') as HTMLInputElement).value;
                      const email = (form.elements.namedItem('studentEmail') as HTMLInputElement).value;
                      handleAddStudent(name, email);
                      form.reset();
                    }} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Full Name</label>
                        <input 
                          name="studentName"
                          placeholder="e.g. Rahul Kumar"
                          required
                          className={`w-full p-4 rounded-2xl text-sm font-bold outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/5 text-white focus:ring-indigo-500' : 'bg-slate-50 text-slate-900 border-slate-200 focus:ring-indigo-500'}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Email Address</label>
                        <input 
                          name="studentEmail"
                          type="email"
                          placeholder="e.g. rahul@example.com"
                          required
                          className={`w-full p-4 rounded-2xl text-sm font-bold outline-none border transition-all ${darkMode ? 'bg-white/5 border-white/5 text-white focus:ring-indigo-500' : 'bg-slate-50 text-slate-900 border-slate-200 focus:ring-indigo-500'}`}
                        />
                      </div>
                      <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 mt-4">
                        Register Student
                      </button>
                    </form>
                  </div>

                  <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                        <p className="text-[8px] uppercase font-bold text-indigo-500 tracking-widest mb-1">Total Students</p>
                        <p className="text-2xl font-black">{myStudents.length}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-[8px] uppercase font-bold text-emerald-500 tracking-widest mb-1">Status</p>
                        <p className="text-xs font-black uppercase">Active</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-8">
                  <div className={`p-8 rounded-[2rem] border ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-slate-100 shadow-2xl'}`}>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Users size={18} className="text-indigo-500" />
                      Enrolled Students
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5">
                            <th className="px-4 py-4">Student</th>
                            <th className="px-4 py-4">Contact</th>
                            <th className="px-4 py-4 text-right">Added On</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {myStudents.map(student => (
                            <tr key={student.id} className={`hover:bg-white/5 transition-colors`}>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center text-[10px] font-black">
                                    {student.name[0]}
                                  </div>
                                  <span className="text-sm font-bold">{student.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-xs text-slate-500 font-medium">{student.email}</span>
                              </td>
                              <td className="px-4 py-4 text-right">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                  {student.createdAt?.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {myStudents.length === 0 && (
                            <tr>
                              <td colSpan={3} className="px-4 py-12 text-center text-slate-500 text-sm italic">
                                No students enrolled yet. Start by adding one!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'creator' && user?.role === 'creator' && (
            <CreatorPortal 
              user={user} 
              darkMode={darkMode} 
              hasApiKey={hasApiKey}
              onOpenApiKey={() => setIsApiKeyModalOpen(true)}
            />
          )}
          {activeTab === 'dashboard' && (
            <>
              {/* Hero */}
        <div className="mb-8 sm:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-6xl font-extrabold tracking-tighter mb-4 leading-tight"
          >
            Excellence. <br/><span className="text-indigo-500 uppercase tracking-tighter">Simplified.</span>
          </motion.h2>
          <p className="text-slate-500 max-w-xl text-xs sm:text-base">A data-driven architect for Maharashtra students navigating Engineering, Medical, and Polytechnic diplomas.</p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 sm:gap-8">
          {/* Form Side */}
          <section className="md:col-span-5 space-y-6">
            <div className={`p-6 sm:p-8 rounded-[2rem] border border-white/5 ${darkMode ? 'bg-[#111]' : 'bg-white shadow-2xl'}`}>
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

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <StreamToggle active={stream} set={setStream} darkMode={darkMode} />
                  <div className="flex flex-wrap gap-2">
                    {stream === 'engineering' && (
                      <button 
                        onClick={() => setIsCAPGuideOpen(true)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-bold uppercase transition-all border ${darkMode ? 'border-white/10 text-indigo-400 hover:bg-white/5' : 'border-slate-200 text-indigo-600 hover:bg-slate-50'}`}
                      >
                        <Info size={14} />
                        Guide
                      </button>
                    )}
                    <button 
                      onClick={() => setIsCategoryGuideOpen(true)}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-bold uppercase transition-all border ${darkMode ? 'border-white/10 text-amber-400 hover:bg-white/5' : 'border-slate-200 text-amber-600 hover:bg-slate-50'}`}
                    >
                      <ListChecks size={14} />
                      Docs
                    </button>
                    <button 
                      onClick={() => setIsRoadmapOpen(true)}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-bold uppercase transition-all border ${darkMode ? 'border-white/10 text-emerald-400 hover:bg-white/5' : 'border-slate-200 text-emerald-600 hover:bg-slate-50'}`}
                    >
                      <Compass size={14} />
                      Roadmap
                    </button>
                  </div>
                </div>
                <div className={`grid ${stream === 'engineering' ? 'grid-cols-1' : 'grid-cols-1'} gap-4`}>
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label={getExamLabel()} 
                      placeholder={stream === 'medical' ? 'e.g. 620' : 'e.g. 95.5'} 
                      value={cetScore} 
                      onChange={(e) => setCetScore(e.target.value)} 
                      darkMode={darkMode}
                    />
                    <div className="flex flex-col justify-end pb-1">
                      <button 
                        onClick={() => setIsRankPredictorOpen(true)}
                        className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          darkMode ? 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10' : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        <Trophy size={14} />
                        Predict Rank
                      </button>
                    </div>
                  </div>
                </div>
                <div className={`grid ${stream === 'engineering' ? 'grid-cols-2' : 'grid-cols-2'} gap-4`}>
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
                    onClick={() => { setCetScore(''); setJeeScore(''); setJeeAdvancedScore(''); setSelectedBranches([]); setCategory(''); setSelectedRegions([]); setSearchQuery(''); setResults(allColleges.slice(0, 4)); setPredictionResults([]); }}
                    className={`px-6 py-4 rounded-2xl font-bold transition-all cursor-pointer ${darkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Results Side */}
          <section className="md:col-span-7 space-y-12">
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
                      onClick={() => {
                        const next = !showShortlistedOnly;
                        setShowShortlistedOnly(next);
                        setActiveTab(next ? 'shortlist' : 'dashboard');
                      }}
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
                    onClick={() => { setResults(allColleges); setNationalResults(NATIONAL_COLLEGE_DB); }}
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
                  userCategory={category}
                />
              )}
            </div>
          </section>
          </div>
            </>
          )}

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
            onOpenSimulator={(name) => { setSimCollege(name); setIsLifeSimOpen(true); }}
            user={user}
            userCategory={category}
            feesCache={feesCache}
            onUpdateFeesCache={(name, data) => setFeesCache(prev => ({ ...prev, [name]: data }))}
            userCet={parseFloat(cetScore)}
            userJee={parseFloat(jeeScore)}
            stream={stream}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLifeSimOpen && (
          <LifeSimulatorModal 
            collegeName={simCollege}
            userName={user?.name || 'Future Student'}
            onClose={() => setIsLifeSimOpen(false)}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPreferenceModalOpen && (
          <PreferenceListModal 
            colleges={predictionResults} 
            onClose={() => setIsPreferenceModalOpen(false)} 
            darkMode={darkMode} 
            userCategory={category}
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
            userCategory={category}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRoadmapOpen && (
          <CareerRoadmapModal 
            isOpen={isRoadmapOpen} 
            onClose={() => setIsRoadmapOpen(false)} 
          />
        )}
      </AnimatePresence>

      <RankPredictorModal 
        isOpen={isRankPredictorOpen}
        onClose={() => setIsRankPredictorOpen(false)}
        darkMode={darkMode}
      />

      <AnimatePresence>
        {isApiKeyModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setIsApiKeyModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className={`relative w-full max-w-md p-8 rounded-[2.5rem] border border-white/10 shadow-3xl ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-slate-900'}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">API Key Required</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">For AI Video Generation</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-8">
                To generate cinematic "Vibe" videos using Veo AI, you need to select a paid Google Cloud project API key. This ensures high-quality video generation.
              </p>
              <div className="space-y-4">
                <button 
                  onClick={handleOpenApiKey}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20"
                >
                  Select API Key
                </button>
                <a 
                  href="https://ai.google.dev/gemini-api/docs/billing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-center text-[10px] text-indigo-500 font-bold uppercase tracking-widest hover:underline"
                >
                  Learn about Billing & Keys
                </a>
              </div>
            </motion.div>
          </div>
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
        {isAuthModalOpen.open && (
          <AuthModal 
            darkMode={darkMode} 
            onClose={() => setIsAuthModalOpen({ open: false, mode: 'register' })} 
            onLogin={handleGoogleLogin}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRequestModalOpen && (
          <InstituteRequestModal 
            darkMode={darkMode} 
            onClose={() => setIsRequestModalOpen(false)} 
            onSubmit={async (name) => {
              if (firebaseUser) {
                await requestInstitute(name, firebaseUser.uid, firebaseUser.email, firebaseUser.name);
                setIsRequestModalOpen(false);
                // Refresh user data to show pending status
                const updatedUser = await getUserProfile(firebaseUser.uid);
                if (updatedUser) setFirebaseUser(updatedUser);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating Chatbot & WhatsApp */}
      <div className="fixed bottom-24 sm:bottom-8 right-6 sm:right-8 z-[100] flex flex-col gap-4">
        <a 
          href="https://wa.me/919999999999?text=Hello%20OmniPath%20Team,%20I%20need%20urgent%20help%20with%20my%20admission%20process." 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all cursor-pointer"
          title="Contact on WhatsApp"
        >
          <MessageCircle size={20} className="sm:hidden" />
          <MessageCircle size={28} className="hidden sm:block" />
        </a>
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-12 h-12 sm:w-16 sm:h-16 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all cursor-pointer"
        >
          {isChatOpen ? <CloseIcon size={20} className="sm:hidden"/> : <MessageSquare size={20} className="sm:hidden" />}
          {isChatOpen ? <CloseIcon size={24} className="hidden sm:block"/> : <MessageSquare size={24} className="hidden sm:block" />}
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

      {/* Mobile Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t ${darkMode ? 'bg-[#0a0a0a]/90 border-white/5' : 'bg-white/90 border-slate-200'} backdrop-blur-xl pb-safe`}>
        <div className="flex items-center justify-around h-16 px-4">
          <button 
            onClick={() => { setActiveTab('dashboard'); setShowShortlistedOnly(false); }}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' && !showShortlistedOnly ? 'text-indigo-500' : 'text-slate-500'}`}
          >
            <Home size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
          </button>
          <button 
            onClick={() => { setShowShortlistedOnly(true); setActiveTab('shortlist'); }}
            className={`flex flex-col items-center gap-1 transition-all ${showShortlistedOnly ? 'text-indigo-500' : 'text-slate-500'}`}
          >
            <div className="relative">
              <Heart size={20} />
              {shortlisted.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0a0a0a]">
                  {shortlisted.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Shortlist</span>
          </button>
          <button 
            onClick={() => setIsChatOpen(true)}
            className={`flex flex-col items-center gap-1 transition-all ${isChatOpen ? 'text-indigo-500' : 'text-slate-500'}`}
          >
            <MessageSquare size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">AI Help</span>
          </button>
          <button 
            onClick={() => setIsSidebarVisible(true)}
            className={`flex flex-col items-center gap-1 transition-all ${isSidebarVisible ? 'text-indigo-500' : 'text-slate-500'}`}
          >
            <Menu size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Menu</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

// --- Sub-Components ---

const CollegeModal = ({ college, onClose, darkMode, isShortlisted, onToggleShortlist, isComparing, onToggleComparison, onOpenSimulator, user, userCategory, feesCache, onUpdateFeesCache, userCet, userJee, stream }: { college: College; onClose: () => void; darkMode: boolean; isShortlisted: boolean; onToggleShortlist: () => void; isComparing: boolean; onToggleComparison: () => void; onOpenSimulator: (name: string) => void; user: User | null; userCategory?: string; feesCache: Record<string, any>; onUpdateFeesCache: (name: string, data: any) => void; userCet: number; userJee: number; stream: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [vibeVideos, setVibeVideos] = useState<VibeVideo[]>([]);
  const [feesData, setFeesData] = useState<any>(null);
  const [loadingFees, setLoadingFees] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [extraDetails, setExtraDetails] = useState<{ faculty?: any[], researchAreas?: string[], notableAlumni?: any[] } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        getCollegeReviews(college.name, (data) => {
          setReviews(data);
          setLoadingReviews(false);
        });
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoadingReviews(false);
      }
    };

    const fetchVideos = async () => {
      try {
        getCollegeVibeVideos(college.name, async (data) => {
          if (data.length === 0) {
            // Auto-discover if no institutional videos exist
            const discovered = await discoverVibeVideos(college.name);
            setVibeVideos(discovered.map((v: any) => {
              let url = v.videoUrl;
              if (url && !url.startsWith('http')) {
                url = `https://${url}`;
              }
              return {
                ...v,
                videoUrl: url,
                id: `discovered-${Math.random()}`,
                createdAt: new Date().toISOString(),
                isExternal: true
              };
            }));
          } else {
            setVibeVideos(data.map(v => ({
              id: v.id,
              title: v.description || "Campus Vibe",
              videoUrl: v.videoUrl,
              description: v.description,
              thumbnailUrl: v.videoUrl // Best effort
            })));
          }
          setLoadingVideos(false);
        });
      } catch (error) {
        console.error("Error fetching vibe videos:", error);
        setLoadingVideos(false);
      }
    };

    const loadFees = async () => {
      if (college.fees) {
        setFeesData({ fees: college.fees, hostelFees: college.hostelFees });
        return;
      }
      
      if (feesCache[college.name]) {
        setFeesData(feesCache[college.name]);
        return;
      }

      setLoadingFees(true);
      try {
        const data = await fetchCollegeFees(college.name);
        setFeesData(data);
        if (data) {
          onUpdateFeesCache(college.name, data);
        }
      } catch (error) {
        console.error("Error fetching fees:", error);
      } finally {
        setLoadingFees(false);
      }
    };
    
    const loadExtraDetails = async () => {
      if (college.faculty || college.researchAreas || college.notableAlumni) {
        setExtraDetails({
          faculty: college.faculty,
          researchAreas: college.researchAreas,
          notableAlumni: college.notableAlumni
        });
        return;
      }
      
      setLoadingDetails(true);
      try {
        const details = await fetchCollegeDetails(college.name);
        setExtraDetails(details);
      } catch (error) {
        console.error("Error fetching extra details:", error);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchReviews();
    fetchVideos();
    loadFees();
    loadExtraDetails();
  }, [college.name]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await addReview({
        collegeName: college.name,
        userName: user.name,
        rating: newReview.rating,
        comment: newReview.comment
      });
      // the onSnapshot in fetchReviews will update the UI
      setNewReview({ rating: 5, comment: '' });
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
        <div className="sticky top-0 z-10 p-4 sm:p-8 flex flex-col sm:flex-row justify-between items-start gap-4 bg-inherit border-b border-white/5">
          <div className="flex-1 pr-0 sm:pr-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-lg uppercase tracking-widest">
                {typeof college.tier === 'number' ? `Tier ${college.tier}` : college.tier}
              </span>
              <span className="px-3 py-1 bg-white/5 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-widest">
                {college.type}
              </span>
            </div>
            <h2 className="text-xl sm:text-4xl font-black tracking-tighter leading-tight">{college.name}</h2>
            <div className="flex items-center gap-2 mt-2 text-slate-500 text-xs sm:text-sm">
              <MapPin size={14} />
              <span>{college.regions.join(', ')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end w-full sm:w-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); onOpenSimulator(college.name); }}
              className={`p-2.5 sm:p-3 rounded-full transition-all hover:scale-110 ${darkMode ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
              title="Day-in-the-Life AI Simulator"
            >
              <Sparkles size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleComparison(); }}
              className={`p-2.5 sm:p-3 rounded-full transition-all hover:scale-110 ${isComparing ? 'bg-indigo-500/10 text-indigo-500' : (darkMode ? 'bg-white/5 text-slate-500 hover:bg-white/10' : 'bg-slate-100 text-slate-400 hover:bg-slate-200')}`}
              title={isComparing ? "Remove from Comparison" : "Add to Comparison"}
            >
              <GitCompare size={18} className="sm:w-5 sm:h-5" />
            </button>
            <a 
              href={`https://wa.me/919999999999?text=Hello%20OmniPath%20Team,%20I%20am%20interested%20in%20${encodeURIComponent(college.name)}.`}
              target="_blank" 
              rel="noopener noreferrer"
              className={`p-2.5 sm:p-3 rounded-full transition-all hover:scale-110 ${darkMode ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
              title="Contact on WhatsApp"
            >
              <MessageCircle size={18} className="sm:w-5 sm:h-5" />
            </a>
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleShortlist(); }}
              className={`p-2.5 sm:p-3 rounded-full transition-all hover:scale-110 ${isShortlisted ? 'bg-rose-500/10 text-rose-500' : (darkMode ? 'bg-white/5 text-slate-500 hover:bg-white/10' : 'bg-slate-100 text-slate-400 hover:bg-slate-200')}`}
            >
              <Heart size={18} className="sm:w-5 sm:h-5" fill={isShortlisted ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={onClose}
              className={`p-2.5 sm:p-3 rounded-full transition-all hover:scale-110 ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              <CloseIcon size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-10">
          {/* Description & Map */}
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-10">
              {/* Admission Feasibility Analysis */}
              {(userCet > 0 || userJee > 0) && (
                <section className={`p-6 rounded-[2.5rem] border ${darkMode ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50/30 border-indigo-100/50'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
                       <Zap size={14} /> Admission Probability Analysis
                    </h3>
                    <span className="text-[10px] font-black text-white bg-indigo-600 px-2 py-0.5 rounded-md uppercase tracking-widest">
                       AI Powered
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    {(() => {
                      let baseCutoff = college.cutoff;
                      let userScore = userCet;
                      let examLabel = "MHT-CET";

                      if (stream === 'engineering') {
                        if (college.exam === 'JEE Main' && userJee > 0) {
                          baseCutoff = college.jeeCutoff || college.cutoff;
                          userScore = userJee;
                          examLabel = "JEE Main";
                        } else if (college.exam === 'MHT-CET' && userCet > 0) {
                          baseCutoff = college.cetCutoff || college.cutoff;
                          userScore = userCet;
                          examLabel = "MHT-CET";
                        } else {
                           userScore = Math.max(userCet, userJee);
                           examLabel = userCet > userJee ? "MHT-CET" : "JEE Main";
                        }
                      }

                      // Adjust for category
                      let adjustedCutoff = baseCutoff;
                      const cat = (userCategory || '').toLowerCase();
                      if (cat !== 'open' && cat !== '') {
                        if (cat.includes('obc') || cat.includes('ews')) adjustedCutoff -= 2.0;
                        else if (cat.includes('sc')) adjustedCutoff -= 8.0;
                        else if (cat.includes('st')) adjustedCutoff -= 12.0;
                        else if (cat.includes('vj') || cat.includes('nt') || cat.includes('sbc')) adjustedCutoff -= 4.5;
                        else if (cat.includes('sebc')) adjustedCutoff -= 2.5;
                      }

                      const diff = userScore - adjustedCutoff;
                      let chanceColor = "text-rose-500";
                      let bgColor = "bg-rose-500";
                      let label = "Ambitious";

                      if (diff >= 3) { chanceColor = "text-emerald-500"; bgColor = "bg-emerald-500"; label = "Safe"; }
                      else if (diff >= -1) { chanceColor = "text-indigo-500"; bgColor = "bg-indigo-500"; label = "Good"; }

                      return (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            <div className={`text-center p-4 rounded-2xl ${darkMode ? 'bg-white/5 border border-white/5' : 'bg-white border border-slate-100 shadow-sm'}`}>
                              <span className="text-[8px] uppercase font-bold text-slate-500 block mb-1 tracking-widest">Your Score</span>
                              <span className="text-xl font-black text-indigo-400">{userScore}</span>
                            </div>
                            <div className={`text-center p-4 rounded-2xl ${darkMode ? 'bg-white/5 border border-white/5' : 'bg-white border border-slate-100 shadow-sm'}`}>
                              <span className="text-[8px] uppercase font-bold text-slate-500 block mb-1 tracking-widest">Target Cutoff</span>
                              <span className={`text-xl font-black ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{adjustedCutoff.toFixed(1)}</span>
                            </div>
                            <div className={`text-center p-4 rounded-2xl ${darkMode ? 'bg-white/5 border border-white/5' : 'bg-white border border-slate-100 shadow-sm'}`}>
                              <span className="text-[8px] uppercase font-bold text-slate-500 block mb-1 tracking-widest">AI Prediction</span>
                              <span className={`text-xl font-black ${chanceColor}`}>{label}</span>
                            </div>
                          </div>

                          <div className="relative pt-4">
                            <div className="flex mb-2 items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                              <span>Cutoff Range</span>
                              <span className={chanceColor}>{label} Match</span>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white/10 relative">
                              <div style={{ width: `${Math.min(Math.max((userScore / 100) * 100, 0), 100)}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${bgColor}`}></div>
                              {/* Cutoff marker */}
                              <div style={{ left: `${adjustedCutoff}%` }} className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-rose-500 whitespace-nowrap">MIN REQ</div>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500 italic mt-2">
                              * Analysis based on {examLabel} {userCategory || 'Open'} category historical data.
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </section>
              )}

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

              {/* Why Choose Us Section */}
              <section className={`p-6 rounded-[2.5rem] border ${darkMode ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50/30 border-indigo-100/50'}`}>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-6 flex items-center gap-2">
                  <Star size={14} /> Why Choose {college.name.split(' ')[0]}?
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(() => {
                    const points = [];
                    if (college.tier === 'Tier 1') {
                      points.push("Top-tier academic excellence and global recognition.");
                      points.push("Elite faculty and research opportunities.");
                    } else if (college.tier === 'Tier 2') {
                      points.push("Strong balance of academics and industry exposure.");
                      points.push("Excellent placement record in top companies.");
                    } else {
                      points.push("Focus on practical skills and career readiness.");
                      points.push("Affordable quality education with modern facilities.");
                    }

                    if (college.description?.toLowerCase().includes('campus')) {
                      points.push("Vibrant campus life with diverse student communities.");
                    }
                    if (college.description?.toLowerCase().includes('placement') || college.description?.toLowerCase().includes('job')) {
                      points.push("Dedicated placement cell with strong industry ties.");
                    }
                    if (college.description?.toLowerCase().includes('research') || college.description?.toLowerCase().includes('innovation')) {
                      points.push("Cutting-edge research facilities and innovation hubs.");
                    }
                    
                    return points.slice(0, 4).map((point, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`mt-1 p-1 rounded-full ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                          <CheckCircle2 size={12} />
                        </div>
                        <span className={`text-sm font-medium leading-tight ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{point}</span>
                      </div>
                    ));
                  })()}
                </div>
              </section>

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

              {/* Fees & Expenses Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500 flex items-center gap-2">
                    <CreditCard size={14} /> Fees & Expenses
                  </h3>
                  {feesData?.lastUpdated && (
                    <span className="text-[8px] font-black text-white bg-emerald-600 px-2 py-0.5 rounded-md uppercase tracking-widest">
                      Updated: {feesData.lastUpdated}
                    </span>
                  )}
                </div>

                {loadingFees ? (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 size={24} className="animate-spin text-emerald-500" />
                  </div>
                ) : feesData ? (
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Tuition Fees</span>
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 text-[8px] font-black rounded uppercase">
                            {userCategory || 'Open'} Category
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-indigo-500">
                            ₹{((feesData.fees?.[userCategory || 'Open'] || feesData.fees?.['Open'] || 0) / 100000).toFixed(2)}L
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">/ Year</span>
                        </div>
                        <p className="text-[9px] text-slate-500 mt-2 italic">
                          *Estimated based on {userCategory || 'Open'} category norms.
                        </p>
                      </div>

                      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Hostel & Mess</span>
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-black rounded uppercase">
                            Optional
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-amber-500">
                            ₹{((feesData.hostelFees || 0) / 1000).toFixed(0)}K
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">/ Year</span>
                        </div>
                        <p className="text-[9px] text-slate-500 mt-2 italic">
                          *Includes accommodation and 3 meals/day.
                        </p>
                      </div>
                    </div>

                    <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50 border-emerald-100'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] uppercase font-black text-emerald-600 tracking-widest">Total Annual Investment</h4>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            <span className="text-[8px] font-bold text-slate-500 uppercase">Tuition</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-[8px] font-bold text-slate-500 uppercase">Hostel</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">Without Hostel</span>
                          <span className="text-xl font-black text-emerald-600">
                            ₹{(feesData.fees?.[userCategory || 'Open'] || feesData.fees?.['Open'] || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600">With Hostel & Mess</span>
                          <span className="text-xl font-black text-emerald-600">
                            ₹{((feesData.fees?.[userCategory || 'Open'] || feesData.fees?.['Open'] || 0) + (feesData.hostelFees || 0)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {feesData.sourceUrl && (
                      <div className="flex items-center justify-center">
                        <a 
                          href={feesData.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest hover:underline flex items-center gap-1"
                        >
                          View Official Fee Structure <ExternalLink size={10} />
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center space-y-3 ${
                    darkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'
                  }`}>
                    <CreditCard size={24} className="text-slate-400" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fee Data Unavailable</p>
                      <p className="text-[8px] text-slate-400 max-w-[150px]">We couldn't retrieve the official fee structure for this institution.</p>
                    </div>
                  </div>
                )}
              </section>

              {loadingDetails ? (
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                  <Loader2 size={32} className="animate-spin text-indigo-500" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Deep-diving into institutional records...</p>
                </div>
              ) : (
                <>
                  {/* Faculty Section */}
                  {extraDetails?.faculty && extraDetails.faculty.length > 0 && (
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 mb-6 flex items-center gap-2">
                        <Users2 size={14} /> Distinguished Faculty
                      </h3>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {extraDetails.faculty.map((f, idx) => (
                          <div key={idx} className={`p-5 rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                {f.name.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold leading-tight">{f.name}</h4>
                                <p className="text-[10px] text-slate-500 font-medium">{f.designation}</p>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-400 italic leading-snug">Expertise: {f.specialization}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Notable Alumni Section */}
                  {extraDetails?.notableAlumni && extraDetails.notableAlumni.length > 0 && (
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 mb-6 flex items-center gap-2">
                        <Trophy size={14} /> Notable Alumni
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {extraDetails.notableAlumni.map((alumnus, idx) => (
                          <div key={idx} className={`flex items-start gap-4 p-5 rounded-3xl border transition-all hover:scale-[1.02] ${darkMode ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-100 hover:shadow-md'}`}>
                            <div className={`p-3 rounded-2xl ${darkMode ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>
                              <Award size={18} />
                            </div>
                            <div>
                              <h4 className="text-xs font-black">{alumnus.name}</h4>
                              <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-tight">{alumnus.achievement}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Research Areas Section */}
                  {extraDetails?.researchAreas && extraDetails.researchAreas.length > 0 && (
                    <section className={`p-6 rounded-[2.5rem] border ${darkMode ? 'bg-rose-500/5 border-rose-500/10' : 'bg-rose-50/30 border-rose-100/50'}`}>
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500 mb-6 flex items-center gap-2">
                        <Microscope size={14} /> Research Focus Areas
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {extraDetails.researchAreas.map((area, idx) => (
                          <div key={idx} className={`flex items-center gap-3 px-4 py-2 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                            <FlaskConical size={14} className="text-rose-500" />
                            <span className={`text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{area}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}

              {/* Institutional Vibe Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500 flex items-center gap-2">
                    <Video size={14} /> Institutional "Vibe"
                  </h3>
                  <span className="text-[8px] font-black text-white bg-indigo-600 px-2 py-0.5 rounded-md uppercase tracking-widest">
                    {vibeVideos.some((v: any) => v.isExternal) ? "AI Discovered" : "AI Generated"}
                  </span>
                </div>
                
                {loadingVideos ? (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 size={24} className="animate-spin text-indigo-500" />
                  </div>
                ) : vibeVideos.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {vibeVideos.map((video) => (
                      <div 
                        key={video.id}
                        className={`group rounded-3xl border overflow-hidden transition-all ${
                          darkMode ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-white border-slate-200 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        <div className="relative aspect-video">
                          <img 
                            src={video.thumbnailUrl || 'https://picsum.photos/seed/vibe/400/225'} 
                            alt={video.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <a 
                              href={video.videoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform"
                            >
                              <Play size={20} fill="currentColor" />
                            </a>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-xs line-clamp-1">{video.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center space-y-3 ${
                    darkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'
                  }`}>
                    <Video size={24} className="text-slate-400" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No Vibe Videos Yet</p>
                      <p className="text-[8px] text-slate-400 max-w-[150px]">Institutions can upload footage via the Creator Portal to generate AI vibes.</p>
                    </div>
                  </div>
                )}
              </section>
            </div>
            <section className="md:col-span-1">
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
                {college.branches?.map(branch => {
                  // Find the most relevant cutoff if exact match isn't present
                  const branchCutoff = college.branchCutoffs?.[branch] || 
                    (college.branchCutoffs ? Object.entries(college.branchCutoffs).find(([key]) => branch.toLowerCase().includes(key.toLowerCase()))?.[1] : undefined);
                  
                  return (
                    <div 
                      key={branch} 
                      className={`p-4 rounded-2xl border flex justify-between items-center transition-all hover:border-indigo-500/30 ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-xs sm:text-sm">{branch}</span>
                        {branchCutoff && <span className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Historical Cutoff</span>}
                      </div>

                      {branchCutoff ? (
                        <div className="flex flex-col items-end">
                          <div className={`px-2 py-1 rounded-lg ${darkMode ? 'bg-indigo-500/10' : 'bg-white shadow-sm'}`}>
                            <span className="text-xs sm:text-sm font-black text-indigo-500">{branchCutoff}</span>
                            <span className="ml-1 text-[8px] font-bold text-indigo-500/60 uppercase">
                              {college.exam.includes('%') || college.exam.includes('ile') ? '%' : 'M'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className={`px-2 py-1 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Base: {college.cutoff}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
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

const PreferenceListModal = ({ colleges, onClose, darkMode, userCategory }: { colleges: (College & { chance: string; displayCutoff?: number; isCategoryAdjusted?: boolean })[]; onClose: () => void; darkMode: boolean; userCategory?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = colleges.map((c, i) => `${i + 1}. ${c.name} (${c.regions.join(', ')}) - Cutoff: ${c.displayCutoff?.toFixed(1) || c.cutoff} - ${c.chance} Chance`).join('\n');
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
            <div className="flex flex-col gap-1 mt-1">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-500" />
                Optimized for 100% Admission Success
              </p>
              {userCategory && userCategory !== 'Open' && (
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={10} />
                  Adjusted for {userCategory} Category trends
                </p>
              )}
            </div>
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
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{c.regions.join(', ')}</p>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <p className="text-[10px] text-indigo-500/70 font-bold uppercase tracking-widest">Target: {c.displayCutoff?.toFixed(1) || c.cutoff}</p>
                  </div>
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

const ComparisonModal = ({ colleges, onClose, darkMode, userCet, userJee, stream, userCategory }: { colleges: College[]; onClose: () => void; darkMode: boolean; userCet: number; userJee: number; stream: string; userCategory?: string }) => {
  const calculateProbability = (college: College) => {
    let baseCutoff = college.cutoff;
    let userScore = userCet;

    if (stream === 'engineering') {
      if (!isNaN(userCet) && college.cetCutoff) {
        baseCutoff = college.cetCutoff;
        userScore = userCet;
      } else if (!isNaN(userJee) && college.jeeCutoff) {
        baseCutoff = college.jeeCutoff;
        userScore = userJee;
      } else {
        userScore = Math.max(isNaN(userCet) ? 0 : userCet, isNaN(userJee) ? 0 : userJee);
      }
    } else {
      userScore = userCet; // For medical/commerce/polytechnic, cetScore is used for the primary score
    }

    if (isNaN(userScore) || userScore === 0) return null;

    // Apply category adjustment for probability calculation
    let adjustedCutoff = baseCutoff;
    const cat = (userCategory || '').toLowerCase();
    if (cat !== 'open' && cat !== '') {
      if (cat.includes('obc') || cat.includes('ews')) adjustedCutoff -= 2.0;
      else if (cat.includes('sc')) adjustedCutoff -= 8.0;
      else if (cat.includes('st')) adjustedCutoff -= 12.0;
      else if (cat.includes('nt') || cat.includes('vj') || cat.includes('sbc')) adjustedCutoff -= 4.5;
      else if (cat.includes('sebc')) adjustedCutoff -= 2.5;
    }

    const diff = userScore - adjustedCutoff;
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

const AdminDashboard = ({ darkMode }: { darkMode: boolean }) => {
  const [adminTab, setAdminTab] = useState<'users' | 'institutes' | 'colleges'>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Institute[]>([]);
  const [approvedInstitutes, setApprovedInstitutes] = useState<Institute[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUsers: (() => void) | undefined;
    let unsubscribePending: (() => void) | undefined;
    let unsubscribeApproved: (() => void) | undefined;
    let unsubscribeColleges: (() => void) | undefined;

    if (adminTab === 'users') {
      setLoading(true);
      unsubscribeUsers = getAllUsers((data) => {
        setUsers(data);
        setLoading(false);
      });
    } else if (adminTab === 'institutes') {
      setLoading(true);
      unsubscribePending = getAllInstituteRequests((data) => {
        setPendingRequests(data);
        setLoading(false);
      });
      unsubscribeApproved = getAllApprovedInstitutes((data) => {
        setApprovedInstitutes(data);
      });
    } else if (adminTab === 'colleges') {
      setLoading(true);
      unsubscribeColleges = getAllColleges((data) => {
        setColleges(data);
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribePending) unsubscribePending();
      if (unsubscribeApproved) unsubscribeApproved();
      if (unsubscribeColleges) unsubscribeColleges();
    };
  }, [adminTab]);

  const handleApprove = async (instituteId: string, adminUid: string) => {
    try {
      await approveInstitute(instituteId, adminUid);
    } catch (error) {
      console.error("Error approving institute:", error);
    }
  };

  const handleReject = async (instituteId: string) => {
    try {
      await rejectInstitute(instituteId);
    } catch (error) {
      console.error("Error rejecting institute:", error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">Admin <span className="text-indigo-500">Control</span></h2>
          <p className="text-slate-500 text-sm">Manage users, payments, and institutions from one central hub.</p>
        </div>
        <div className={`flex p-1 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
          {(['users', 'institutes', 'colleges'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setAdminTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all capitalize ${adminTab === tab ? (darkMode ? 'bg-white text-black' : 'bg-white text-indigo-600 shadow-sm') : 'text-slate-500'}`}
            >
              {tab}
              {tab === 'institutes' && pendingRequests.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-rose-500 text-white text-[8px] rounded-full">{pendingRequests.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading && adminTab !== 'colleges' ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[2.5rem] border overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl'}`}
        >
          {adminTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-white/10' : 'border-slate-100'}`}>
                    <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">User</th>
                    <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Contact</th>
                    <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Role</th>
                    <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.uid} className={`border-b last:border-0 ${darkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-50 hover:bg-slate-50'} transition-colors`}>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                            {u.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{u.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-tighter font-bold">{u.uid.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <p className="text-xs font-medium">{u.email}</p>
                      </td>
                      <td className="p-6">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          u.role === 'super_admin' ? 'bg-indigo-500/10 text-indigo-500' : 
                          u.role === 'institute_admin' ? 'bg-amber-500/10 text-amber-500' : 
                          'bg-slate-500/10 text-slate-500'
                        }`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-6">
                        <button
                          className="p-2 rounded-xl transition-all text-slate-500 hover:bg-slate-500/10"
                          title="Manage User"
                        >
                          <Settings size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {adminTab === 'institutes' && (
            <div className="p-6 space-y-8">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Building2 size={16} className="text-indigo-500" />
                  Pending Requests ({pendingRequests.length})
                </h3>
                <div className="grid gap-4">
                  {pendingRequests.map(r => (
                    <div key={r.id} className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'} flex items-center justify-between`}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{r.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Requester: {r.adminName} ({r.adminEmail})</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(r.id, r.adminUid)}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          className="px-4 py-2 bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                        >
                          Deny
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingRequests.length === 0 && (
                    <p className="text-center py-8 text-slate-500 text-xs italic">No pending requests.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Approved Institutes ({approvedInstitutes.length})
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {approvedInstitutes.map(inst => (
                    <div key={inst.id} className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                      <p className="font-bold text-sm">{inst.name}</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Admin: {inst.adminName}</p>
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {inst.id.slice(0, 8)}...</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  ))}
                  {approvedInstitutes.length === 0 && (
                    <p className="col-span-full text-center py-8 text-slate-500 text-xs italic">No approved institutes yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'colleges' && (
            <div className="p-8 space-y-8">
              <div className={`p-8 rounded-[2.5rem] border ${darkMode ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-500 mb-6 flex items-center gap-2">
                  <Plus size={18} />
                  Add Custom College
                </h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const newCollege: College = {
                    name: formData.get('name') as string,
                    type: formData.get('type') as string,
                    tier: formData.get('tier') as string,
                    exam: formData.get('exam') as string,
                    cutoff: Number(formData.get('cutoff')),
                    regions: (formData.get('regions') as string).split(',').map(r => r.trim()),
                    website: formData.get('website') as string,
                  };
                  if (newCollege.name && newCollege.type) {
                    await addCollege(newCollege);
                    form.reset();
                  }
                }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">College Name</label>
                    <input name="name" required className={`w-full p-4 rounded-2xl border text-sm font-bold transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} placeholder="e.g. IIT Bombay" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Stream Type</label>
                    <select name="type" required className={`w-full p-4 rounded-2xl border text-sm font-bold transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                      <option value="engineering">Engineering</option>
                      <option value="medical">Medical</option>
                      <option value="commerce">Commerce</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Tier</label>
                    <input name="tier" required className={`w-full p-4 rounded-2xl border text-sm font-bold transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} placeholder="e.g. 1" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Primary Exam</label>
                    <input name="exam" required className={`w-full p-4 rounded-2xl border text-sm font-bold transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} placeholder="e.g. JEE Main" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Cutoff %</label>
                    <input name="cutoff" type="number" step="0.01" required className={`w-full p-4 rounded-2xl border text-sm font-bold transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} placeholder="e.g. 98.5" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Regions (comma separated)</label>
                    <input name="regions" required className={`w-full p-4 rounded-2xl border text-sm font-bold transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} placeholder="e.g. Mumbai, Pune" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Website URL</label>
                    <input name="website" required className={`w-full p-4 rounded-2xl border text-sm font-bold transition-all focus:ring-2 focus:ring-indigo-500 outline-none ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} placeholder="e.g. https://www.iitb.ac.in" />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full p-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                      Add College
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 ml-4">
                  <Layers size={18} />
                  Existing Custom Colleges ({colleges.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {colleges.map(college => (
                    <div key={college.id} className={`p-6 rounded-3xl border flex items-center justify-between group transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:shadow-lg'}`}>
                      <div>
                        <h4 className="font-bold text-sm mb-1">{college.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-500 text-[8px] font-bold uppercase tracking-widest">{college.type}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Tier {college.tier}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => college.id && deleteCollege(college.id)}
                        className="p-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Ban size={18} />
                      </button>
                    </div>
                  ))}
                  {colleges.length === 0 && (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-slate-500 text-xs italic">No custom colleges added yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

const InstituteAdminDashboard = ({ darkMode, userProfile, onClose }: { darkMode: boolean; userProfile: UserProfile; onClose: () => void }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userProfile.instituteId) return;
    const unsubscribe = getInstituteStudents(userProfile.instituteId, (data) => {
      setStudents(data);
    });
    return () => unsubscribe();
  }, [userProfile.instituteId]);

  const handleAddStudent = async () => {
    if (!newStudentName.trim() || !newStudentEmail.trim() || !userProfile.instituteId) return;
    setLoading(true);
    try {
      await addStudent(userProfile.instituteId, newStudentName, newStudentEmail, userProfile.uid);
      setNewStudentName('');
      setNewStudentEmail('');
    } catch (error) {
      console.error("Error adding student:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-3xl flex flex-col ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-slate-900'}`}>
        <div className="p-4 sm:p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tighter">Institute Dashboard</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Manage your students and records</p>
          </div>
          <button onClick={onClose} className={`p-2 sm:p-3 rounded-2xl transition-all ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}>
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
          <div className={`p-4 sm:p-6 rounded-3xl border ${darkMode ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-indigo-500 mb-4">Add New Student</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input label="Student Name" placeholder="e.g. Rahul Kumar" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} darkMode={darkMode} />
              <Input label="Student Email" placeholder="e.g. rahul@example.com" value={newStudentEmail} onChange={(e) => setNewStudentEmail(e.target.value)} darkMode={darkMode} />
              <div className="flex items-end">
                <button 
                  onClick={handleAddStudent}
                  disabled={loading || !newStudentName.trim() || !newStudentEmail.trim()}
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs sm:text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 h-[48px] sm:h-[52px]"
                >
                  {loading ? 'Adding...' : 'Add Student'}
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Users size={16} />
              Student List ({students.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-white/10' : 'border-slate-100'}`}>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Name</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Email</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Added Date</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} className={`border-b last:border-0 ${darkMode ? 'border-white/5 hover:bg-white/5' : 'border-slate-50 hover:bg-slate-50'} transition-colors`}>
                      <td className="p-4">
                        <p className="font-bold text-sm">{s.name}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-xs font-medium">{s.email}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">
                          {s.createdAt?.toDate().toLocaleDateString()}
                        </p>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-slate-500 text-sm italic">
                        No students added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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

const ResultsGrid = ({ data, darkMode, onSelect, shortlisted, onToggleShortlist, comparisonList, onToggleComparison, userCategory }: { data: (College & { chance?: string; displayCutoff?: number; isCategoryAdjusted?: boolean })[]; darkMode: boolean; onSelect: (c: College) => void; shortlisted: string[]; onToggleShortlist: (name: string) => void; comparisonList: College[]; onToggleComparison: (c: College) => void; userCategory?: string }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {data.length > 0 ? data.map((col, i) => (
      <motion.div 
        key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1 }}
        onClick={() => onSelect(col)}
        className={`p-4 sm:p-6 rounded-3xl border transition-all group flex flex-col justify-between cursor-pointer relative ${darkMode ? 'bg-white/5 border-white/5 hover:border-indigo-500/50' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-500/50'}`}
      >
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-1.5 sm:gap-2 z-10">
          {col.chance && (
            <div className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-[7px] sm:text-[8px] font-black uppercase tracking-widest ${
              col.chance === 'Safe' ? 'bg-emerald-500/10 text-emerald-500' : 
              col.chance === 'Good' ? 'bg-indigo-500/10 text-indigo-500' : 
              'bg-amber-500/10 text-amber-500'
            }`}>
              {col.chance}
            </div>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleComparison(col); }}
            className={`p-2 sm:p-2.5 rounded-full transition-all ${comparisonList.some(c => c.name === col.name) ? 'bg-indigo-500/10 text-indigo-500' : (darkMode ? 'bg-white/5 text-slate-500 hover:bg-white/10' : 'bg-slate-100 text-slate-400 hover:bg-slate-200')}`}
            title="Compare"
          >
            <GitCompare size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleShortlist(col.name); }}
            className={`p-2 sm:p-2.5 rounded-full transition-all ${shortlisted.includes(col.name) ? 'bg-rose-500/10 text-rose-500' : (darkMode ? 'bg-white/5 text-slate-500 hover:bg-white/10' : 'bg-slate-100 text-slate-400 hover:bg-slate-200')}`}
          >
            <Heart size={18} className="sm:w-5 sm:h-5" fill={shortlisted.includes(col.name) ? "currentColor" : "none"} />
          </button>
        </div>
        <div>
          <div className="flex flex-wrap gap-2 mb-4 pr-24 sm:pr-32">
            <span className={`px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold rounded-lg uppercase flex items-center gap-1 sm:gap-1.5 ${
              (col.tier === 1 || col.tier === 'Elite') ? 'bg-indigo-500/10 text-indigo-400' :
              (col.tier === 2 || col.tier === 'Premium') ? 'bg-amber-500/10 text-amber-500' :
              'bg-slate-500/10 text-slate-400'
            }`}>
              <Trophy size={10} />
              {typeof col.tier === 'number' ? `Tier ${col.tier}` : col.tier}
            </span>
            {col.level === 'National' && (
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-500/10 text-emerald-500 text-[9px] sm:text-[10px] font-bold rounded-lg uppercase flex items-center gap-1 sm:gap-1.5">
                <Compass size={10} />
                National
              </span>
            )}
          </div>
          <h4 className={`font-bold text-lg sm:text-xl group-hover:text-indigo-400 transition-colors leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{col.name}</h4>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">{col.regions.join(', ')}</p>
          
          <div className="mt-4 flex flex-col gap-2">
            <div className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border ${darkMode ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[10px] uppercase font-black text-indigo-500 tracking-widest mb-1 flex items-center gap-1.5">
                  {col.displayCutoff && col.displayCutoff !== col.cutoff ? (col.isCategoryAdjusted ? `${userCategory || 'Category'} Cutoff` : 'Branch Cutoff') : 'Expected Cutoff'}
                  {col.isCategoryAdjusted && <Sparkles size={8} className="text-indigo-400" />}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">{col.displayCutoff?.toFixed(1) || col.cutoff}</span>
                  <span className="text-[8px] sm:text-[10px] font-bold text-indigo-500/60 uppercase">{col.exam.includes('%') || col.exam.includes('ile') ? '%' : 'Marks'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[8px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Exam Type</span>
                <div className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-[8px] sm:text-[10px] font-bold inline-block ${darkMode ? 'bg-white/10 text-white' : 'bg-white text-slate-700 shadow-sm'}`}>
                  {col.exam}
                </div>
              </div>
            </div>
            {col.isCategoryAdjusted && (
               <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                 * Adjusted based on {userCategory} historical trends
               </p>
            )}
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
            <div className={`mt-4 p-4 rounded-2xl flex items-center justify-between border ${darkMode ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50/50 border-emerald-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                  <TrendingUp size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Avg Package</span>
                  <span className={`text-sm font-black ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{col.placements.avgPackage}</span>
                </div>
              </div>
              <div className="h-8 w-[1px] bg-emerald-500/20" />
              <div className="flex items-center gap-3 text-right">
                <div className="flex flex-col">
                  <span className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Highest</span>
                  <span className={`text-sm font-black ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>{col.placements.highestPackage}</span>
                </div>
                <div className={`p-2 rounded-xl ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                  <Zap size={14} />
                </div>
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
    { role: 'model', text: `Namaste! I'm OmniPath Concierge AI. I can help you understand reservation quotas (EWS, OBC, Female Quota, etc.) in 14+ languages. How can I assist you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "Explain EWS quota requirements.",
    "How does OBC-NCL reservation work?",
    "Tell me about Female Quota in IITs.",
    "What documents are needed for SC/ST?",
    "Explain Home University vs OHU quota."
  ];

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const firstUserIndex = messages.findIndex(m => m.role === 'user');
      const history = (firstUserIndex === -1 ? [] : messages.slice(firstUserIndex)).map(m => ({
        role: m.role as "user" | "model",
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
      className={`absolute bottom-20 right-0 w-[calc(100vw-3rem)] sm:w-96 h-[500px] sm:h-[550px] rounded-[2rem] border border-white/10 shadow-3xl flex flex-col overflow-hidden ${darkMode ? 'bg-[#111]' : 'bg-white'}`}
    >
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-indigo-600 text-white">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <span className="text-sm font-bold tracking-widest uppercase">Concierge AI</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[8px] uppercase font-bold tracking-tighter opacity-80">Online</span>
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/10 rounded-full">
              <Languages size={8} />
              <span className="text-[8px] uppercase font-bold tracking-tighter">14+ Languages</span>
            </div>
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

const InstituteRequestModal = ({ darkMode, onClose, onSubmit }: { darkMode: boolean; onClose: () => void; onSubmit: (name: string) => Promise<void> }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className={`relative w-full max-w-md p-8 rounded-[2.5rem] border border-white/10 shadow-3xl ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-slate-900'}`}>
        <h2 className="text-2xl font-black tracking-tighter mb-2">Request Institute Status</h2>
        <p className="text-sm text-slate-500 mb-6">Apply to become an institute admin and manage your student records.</p>
        <div className="space-y-4">
          <Input label="Institute Name" placeholder="e.g. VJTI Mumbai" value={name} onChange={(e) => setName(e.target.value)} darkMode={darkMode} />
          <button 
            onClick={async () => {
              if (!name.trim()) return;
              setLoading(true);
              await onSubmit(name);
              setLoading(false);
            }}
            disabled={loading || !name.trim()}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AuthModal = ({ darkMode, onClose, onLogin }: { darkMode: boolean; onClose: () => void; onLogin: (extraData?: { phone?: string; requestedRole?: string; name?: string }) => Promise<void> }) => {
  const [loading, setLoading] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'student' | 'institute_admin'>('student');
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.9, y: 20 }} 
        className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[2.5rem] border border-white/10 shadow-3xl scrollbar-hide ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-slate-900'}`}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20">
            <Sparkles size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-2">Welcome to OmniPath</h2>
          <p className="text-sm text-slate-500">Sign in to access college predictions and institutional features.</p>
        </div>

        <div className={`flex p-1 rounded-2xl mb-8 ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
          <button 
            onClick={() => setAuthTab('register')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${authTab === 'register' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            Register
          </button>
          <button 
            onClick={() => setAuthTab('login')}
            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${authTab === 'login' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            Login
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {authTab === 'register' && (
            <>
              <Input label="Full Name" placeholder="e.g. Rahul Kumar" value={name} onChange={(e) => setName(e.target.value)} darkMode={darkMode} />
              <Input label="Phone Number" placeholder="e.g. +91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} darkMode={darkMode} />
            </>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">
              {authTab === 'register' ? 'Register as...' : 'Login as...'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setRole('student')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${role === 'student' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500' : (darkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500')}`}
              >
                Student
              </button>
              <button 
                onClick={() => setRole('institute_admin')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${role === 'institute_admin' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500' : (darkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500')}`}
              >
                Institute Admin
              </button>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${isConfirmed ? 'bg-indigo-500/10 border-indigo-500/20' : (darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100')}`}>
            <input 
              type="checkbox" 
              id="confirm-role" 
              checked={isConfirmed} 
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="confirm-role" className={`text-[10px] font-black uppercase tracking-widest cursor-pointer ${isConfirmed ? 'text-indigo-500' : 'text-slate-500'}`}>
              I confirm I am {authTab === 'register' ? 'registering' : 'signing in'} as {role === 'student' ? 'a Student' : 'an Institute Admin'}
            </label>
          </div>
        </div>

        <button 
          onClick={async () => {
            setLoading(true);
            const extraData = authTab === 'register' ? { name, phone, requestedRole: role } : { requestedRole: role };
            await onLogin(extraData);
            setLoading(false);
          }}
          disabled={loading || !isConfirmed || (authTab === 'register' && (!name || !phone))}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 brightness-0 invert" />
          {loading ? 'Authenticating...' : `Continue with Google to ${authTab === 'register' ? 'Register' : 'Login'}`}
        </button>
        <p className="text-[10px] text-center text-slate-500 mt-6 uppercase tracking-widest font-bold">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
};

export default App;
