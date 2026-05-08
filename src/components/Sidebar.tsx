import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  ChevronLeft, 
  Menu, 
  X as CloseIcon, 
  Home, 
  Heart, 
  ListChecks, 
  GitCompare, 
  Trophy, 
  Zap, 
  MessageSquare, 
  BookOpen, 
  Compass, 
  Play, 
  Video, 
  ShieldCheck, 
  Building2, 
  Plus, 
  Settings, 
  CheckCircle2, 
  User as UserIcon 
} from 'lucide-react';
import { User, College } from '../types';

interface SidebarProps {
  isSidebarVisible: boolean;
  setIsSidebarVisible: (v: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  darkMode: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showShortlistedOnly: boolean;
  setShowShortlistedOnly: (v: boolean) => void;
  shortlisted: string[];
  setIsPreferenceModalOpen: (v: boolean) => void;
  setIsComparisonModalOpen: (v: boolean) => void;
  comparisonList: College[];
  setIsRankPredictorOpen: (v: boolean) => void;
  setIsLifeSimOpen: (v: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (v: boolean) => void;
  setIsCAPGuideOpen: (v: boolean) => void;
  setIsRoadmapOpen: (v: boolean) => void;
  results: College[];
  setSelectedCollege: (c: College) => void;
  user: User | null;
  firebaseUser: any;
  setIsRequestModalOpen: (v: boolean) => void;
  handleFirebaseLogout: () => void;
  setIsAuthModalOpen: (v: { open: boolean; mode: 'login' | 'register' }) => void;
}

const SidebarItem = ({ 
  icon, 
  label, 
  active, 
  onClick, 
  isOpen, 
  darkMode,
  badge 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick?: () => void; 
  isOpen: boolean; 
  darkMode: boolean;
  badge?: string;
}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all relative group ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
        : (darkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600')
    }`}
  >
    <div className={`flex-shrink-0 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="flex-1 flex items-center justify-between overflow-hidden"
        >
          <span className="text-sm font-bold whitespace-nowrap truncate">
            {label}
          </span>
          {badge && (
            <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 text-[8px] font-black rounded-md uppercase tracking-tighter">
              {badge}
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
    {!isOpen && (
      <div className={`absolute left-full ml-4 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-50 pointer-events-none ${darkMode ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>
        {label}
        {badge && <span className="ml-2 opacity-50">({badge})</span>}
      </div>
    )}
  </button>
);

const SidebarHeader = ({ label, isOpen, darkMode }: { label: string; isOpen: boolean; darkMode: boolean }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`px-4 mb-2 mt-6 text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}
      >
        {label}
      </motion.div>
    )}
  </AnimatePresence>
);

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarVisible,
  setIsSidebarVisible,
  isSidebarOpen,
  setIsSidebarOpen,
  darkMode,
  activeTab,
  setActiveTab,
  showShortlistedOnly,
  setShowShortlistedOnly,
  shortlisted,
  setIsPreferenceModalOpen,
  setIsComparisonModalOpen,
  comparisonList,
  setIsRankPredictorOpen,
  setIsLifeSimOpen,
  isChatOpen,
  setIsChatOpen,
  setIsCAPGuideOpen,
  setIsRoadmapOpen,
  results,
  setSelectedCollege,
  user,
  firebaseUser,
  setIsRequestModalOpen,
  handleFirebaseLogout,
  setIsAuthModalOpen
}) => {
  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarVisible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarVisible(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[110] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ 
          width: !isSidebarVisible ? 0 : (isSidebarOpen || window.innerWidth < 1024 ? 280 : 80),
          x: !isSidebarVisible ? -280 : 0,
          opacity: !isSidebarVisible ? 0 : 1
        }}
        className={`fixed left-0 top-0 h-screen z-[120] border-r transition-colors duration-500 flex flex-col overflow-hidden ${darkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-slate-200 shadow-xl lg:shadow-none'}`}
      >
        <div className="p-6 flex items-center justify-between min-w-[280px]">
          <AnimatePresence mode="wait">
            {(isSidebarOpen || window.innerWidth < 1024) && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <GraduationCap className="text-white" size={24} />
                </div>
                <span className="font-black text-xl tracking-tighter">OMNIPATH</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-3 rounded-xl transition-all lg:flex hidden ${darkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
            <button 
              onClick={() => setIsSidebarVisible(false)}
              className={`p-3 rounded-xl transition-all text-rose-500 hover:bg-rose-500/10 lg:hidden`}
              title="Close Menu"
            >
              <CloseIcon size={24} />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          <SidebarHeader label="Main" isOpen={isSidebarOpen || window.innerWidth < 1024} darkMode={darkMode} />
          <SidebarItem 
            icon={<Home size={22} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard' && !showShortlistedOnly} 
            onClick={() => { setActiveTab('dashboard'); setShowShortlistedOnly(false); setIsSidebarVisible(false); }} 
            isOpen={isSidebarOpen || window.innerWidth < 1024} 
            darkMode={darkMode} 
          />
          <SidebarItem 
            icon={<Heart size={22} />} 
            label="My Shortlist" 
            active={showShortlistedOnly} 
            onClick={() => { setShowShortlistedOnly(true); setActiveTab('shortlist'); setIsSidebarVisible(false); }} 
            isOpen={isSidebarOpen || window.innerWidth < 1024} 
            darkMode={darkMode} 
            badge={shortlisted.length > 0 ? shortlisted.length.toString() : undefined}
          />

          <SidebarHeader label="Tools" isOpen={isSidebarOpen || window.innerWidth < 1024} darkMode={darkMode} />
          <SidebarItem 
            icon={<ListChecks size={22} />} 
            label="CAP Preference" 
            active={activeTab === 'preference'} 
            onClick={() => { setIsPreferenceModalOpen(true); setActiveTab('preference'); setIsSidebarVisible(false); }} 
            isOpen={isSidebarOpen || window.innerWidth < 1024} 
            darkMode={darkMode} 
          />
          <SidebarItem 
            icon={<GitCompare size={22} />} 
            label="Compare Tool" 
            active={activeTab === 'compare'} 
            onClick={() => { setIsComparisonModalOpen(true); setActiveTab('compare'); setIsSidebarVisible(false); }} 
            isOpen={isSidebarOpen || window.innerWidth < 1024} 
            darkMode={darkMode} 
            badge={comparisonList.length > 0 ? comparisonList.length.toString() : undefined}
          />
          <SidebarItem 
            icon={<Trophy size={22} />} 
            label="Predict My Rank" 
            active={activeTab === 'rank'} 
            onClick={() => { setIsRankPredictorOpen(true); setIsSidebarVisible(false); }} 
            isOpen={isSidebarOpen || window.innerWidth < 1024} 
            darkMode={darkMode} 
          />
          <SidebarItem 
            icon={<Zap size={22} />} 
            label="Life Simulator" 
            onClick={() => { setIsLifeSimOpen(true); setIsSidebarVisible(false); }} 
            isOpen={isSidebarOpen || window.innerWidth < 1024} 
            darkMode={darkMode} 
            badge="New"
          />

          <SidebarHeader label="Guidance" isOpen={isSidebarOpen || window.innerWidth < 1024} darkMode={darkMode} />
          <SidebarItem 
            icon={<MessageSquare size={22} />} 
            label="AI Counselor" 
            active={isChatOpen} 
            onClick={() => { setIsChatOpen(true); setIsSidebarVisible(false); }} 
            isOpen={isSidebarOpen || window.innerWidth < 1024} 
            darkMode={darkMode} 
          />
          <SidebarItem 
            icon={<BookOpen size={22} />} 
            label="CAP Guide" 
            onClick={() => { setIsCAPGuideOpen(true); setIsSidebarVisible(false); }} 
            isOpen={isSidebarOpen || window.innerWidth < 1024} 
            darkMode={darkMode} 
          />
          <SidebarItem 
            icon={<Compass size={22} />} 
            label="Career Roadmap" 
            onClick={() => { setIsRoadmapOpen(true); setIsSidebarVisible(false); }} 
            isOpen={isSidebarOpen || window.innerWidth < 1024} 
            darkMode={darkMode} 
          />
          <SidebarItem 
            icon={<Play size={20} />} 
            label="College Vibe" 
            onClick={() => {
              if (results.length > 0) {
                setSelectedCollege(results[0]);
              } else {
                alert("Select a college to see its vibe!");
              }
            }} 
            isOpen={isSidebarOpen} 
            darkMode={darkMode} 
          />

          <SidebarHeader label="Management" isOpen={isSidebarOpen || window.innerWidth < 1024} darkMode={darkMode} />
          
          {(user?.role === 'creator' || firebaseUser?.role === 'institute_admin') && (
            <SidebarItem 
              icon={<Video size={22} />} 
              label="Creator Portal" 
              active={activeTab === 'creator'}
              onClick={() => { setActiveTab('creator'); setIsSidebarVisible(false); }} 
              isOpen={isSidebarOpen || window.innerWidth < 1024} 
              darkMode={darkMode} 
            />
          )}

          {user?.role === 'admin' && (
            <SidebarItem 
              icon={<ShieldCheck size={22} />} 
              label="Admin Panel" 
              active={activeTab === 'admin'}
              onClick={() => { setActiveTab('admin'); setIsSidebarVisible(false); }} 
              isOpen={isSidebarOpen || window.innerWidth < 1024} 
              darkMode={darkMode} 
            />
          )}

          {firebaseUser?.role === 'super_admin' && (
            <SidebarItem 
              icon={<ShieldCheck size={22} />} 
              label="Super Admin" 
              active={activeTab === 'super_admin'}
              onClick={() => { setActiveTab('super_admin'); setIsSidebarVisible(false); }} 
              isOpen={isSidebarOpen || window.innerWidth < 1024} 
              darkMode={darkMode} 
            />
          )}

          {firebaseUser?.role === 'institute_admin' && (
            <SidebarItem 
              icon={<Building2 size={22} />} 
              label="My Institute" 
              active={activeTab === 'my_institute'}
              onClick={() => { setActiveTab('my_institute'); setIsSidebarVisible(false); }} 
              isOpen={isSidebarOpen || window.innerWidth < 1024} 
              darkMode={darkMode} 
            />
          )}

          {firebaseUser?.role === 'student' && !firebaseUser.instituteId && (
            <SidebarItem 
              icon={<Plus size={22} />} 
              label="Request Institute" 
              onClick={() => { setIsRequestModalOpen(true); setIsSidebarVisible(false); }} 
              isOpen={isSidebarOpen || window.innerWidth < 1024} 
              darkMode={darkMode} 
            />
          )}
        </nav>

        <div className="p-4 space-y-2">
          <SidebarItem 
            icon={<Settings size={22} />} 
            label="Settings" 
            isOpen={isSidebarOpen || window.innerWidth < 1024} 
            darkMode={darkMode} 
          />
          {user ? (
            <div className={`p-3 rounded-2xl flex items-center gap-3 ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                  {user.name && user.name[0]}
                </div>
                {user.isPremium && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0a0a0a] flex items-center justify-center">
                    <CheckCircle2 size={8} className="text-white" />
                  </div>
                )}
              </div>
              {(isSidebarOpen || window.innerWidth < 1024) && (
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold truncate">{user.name}</p>
                    {user.isPremium && (
                      <span className="px-1.5 py-0.5 bg-indigo-600 text-white text-[8px] font-black rounded-md uppercase tracking-tighter">Pro</span>
                    )}
                  </div>
                  <button onClick={() => { handleFirebaseLogout(); setIsSidebarVisible(false); }} className="text-[10px] text-rose-500 font-bold hover:underline">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <SidebarItem 
              icon={<UserIcon size={22} />} 
              label="Login / Sign Up" 
              onClick={() => { setIsAuthModalOpen({ open: true, mode: 'register' }); setIsSidebarVisible(false); }} 
              isOpen={isSidebarOpen || window.innerWidth < 1024} 
              darkMode={darkMode} 
            />
          )}
        </div>
      </motion.aside>
    </>
  );
};
