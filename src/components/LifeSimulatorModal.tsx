import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Gamepad2, Camera, Mountain, Music, Palette, Code, Coffee, Rocket, Loader2 } from 'lucide-react';
import { generateLifeSimulation } from '../services/gemini';

const HOBBY_OPTIONS = [
  { id: 'gaming', label: 'Gaming', icon: <Gamepad2 size={16} /> },
  { id: 'photography', label: 'Photography', icon: <Camera size={16} /> },
  { id: 'trekking', label: 'Trekking', icon: <Mountain size={16} /> },
  { id: 'music', label: 'Music', icon: <Music size={16} /> },
  { id: 'art', label: 'Art & Design', icon: <Palette size={16} /> },
  { id: 'coding', label: 'Coding', icon: <Code size={16} /> },
  { id: 'reading', label: 'Reading', icon: <Coffee size={16} /> },
  { id: 'robotics', label: 'Robotics', icon: <Rocket size={16} /> },
];

export const LifeSimulatorModal = ({ 
  collegeName, 
  userName, 
  onClose, 
  darkMode 
}: { 
  collegeName: string; 
  userName: string; 
  onClose: () => void; 
  darkMode: boolean;
}) => {
  const [step, setStep] = useState<'hobbies' | 'generating' | 'result'>('hobbies');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [story, setStory] = useState('');

  const toggleHobby = (id: string) => {
    setSelectedHobbies(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedHobbies.length === 0) return;
    setStep('generating');
    try {
      const result = await generateLifeSimulation(collegeName, userName, selectedHobbies);
      setStory(result);
      setStep('result');
    } catch (error) {
      console.error("Simulation error:", error);
      setStep('hobbies');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[2.5rem] glass-card ${darkMode ? 'bg-[#0a0a0a]/90' : 'bg-white/90 shadow-2xl'}`}
      >
        {/* Header */}
        <div className={`p-6 sm:p-8 border-b ${darkMode ? 'border-white/10' : 'border-slate-100'} flex items-center justify-between bg-brand-600 text-white relative overflow-hidden shrink-0`}>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <div className="flex items-center gap-4 sm:gap-6 relative z-10">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white text-brand-600 flex items-center justify-center shadow-xl shadow-brand-900/20">
              <Sparkles size={24} className="sm:w-8 sm:h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-display tracking-tight leading-none">Life <span className="opacity-80">Simulator</span></h2>
              <p className="text-[8px] sm:text-[10px] opacity-70 font-bold uppercase tracking-widest mt-1 sm:mt-2">Preview your future at {collegeName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 sm:p-3 hover:bg-white/10 rounded-xl transition-all relative z-10">
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-hide">
          {step === 'hobbies' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="text-left">
                <h3 className={`text-2xl sm:text-3xl font-display tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>What do you <span className="text-gradient">love</span> doing?</h3>
                <p className="text-slate-500 text-xs font-medium">Select your hobbies to personalize your simulation</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {HOBBY_OPTIONS.map(hobby => (
                  <button
                    key={hobby.id}
                    onClick={() => toggleHobby(hobby.id)}
                    className={`p-3 sm:p-5 rounded-2xl transition-all flex flex-col items-center gap-2 sm:gap-3 group border ${
                      selectedHobbies.includes(hobby.id)
                        ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/20 scale-[1.02]'
                        : (darkMode ? 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100')
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      selectedHobbies.includes(hobby.id) ? 'bg-white/20 text-white' : (darkMode ? 'bg-white/10' : 'bg-white shadow-sm')
                    }`}>
                      {hobby.icon}
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-center">{hobby.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={selectedHobbies.length === 0}
                className="w-full py-4 sm:py-5 bg-brand-600 text-white rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:bg-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed premium-button"
              >
                Generate My Story
              </button>
            </div>
          )}

          {step === 'generating' && (
            <div className="py-12 sm:py-20 flex flex-col items-center justify-center space-y-6 sm:space-y-8 text-center">
              <div className="relative">
                <Loader2 className="w-16 h-16 sm:w-24 sm:h-24 text-brand-500 animate-spin opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles size={24} className="sm:w-10 sm:h-10 text-brand-500 animate-pulse" />
                </div>
              </div>
              <div className="max-w-xs sm:max-w-sm mx-auto">
                <h3 className={`text-xl sm:text-2xl font-display tracking-tight mb-2 sm:mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Synthesizing Your Future...</h3>
                <p className="text-slate-500 text-[10px] sm:text-xs font-medium leading-relaxed">
                  Scraping student vlogs, Reddit threads, and campus landmarks to create your personalized preview.
                </p>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="space-y-6 sm:space-y-8">
              <div className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] leading-relaxed text-sm sm:text-lg font-medium italic relative overflow-hidden ${darkMode ? 'bg-white/5 text-slate-200' : 'bg-brand-50 text-slate-800'}`}>
                <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-10 text-brand-500">
                  <Sparkles size={48} className="sm:w-16 sm:h-16" />
                </div>
                <div className="space-y-4 sm:space-y-6 relative z-10">
                  {story.split('\n').map((line, i) => (
                    <p key={i} className="last:mb-0">{line}</p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setStep('hobbies')}
                  className={`flex-1 py-3 sm:py-4 rounded-2xl text-[8px] sm:text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    darkMode ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' : 'bg-slate-100 text-slate-900 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  Try Different Hobbies
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 sm:py-4 bg-brand-600 text-white rounded-2xl text-[8px] sm:text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all premium-button"
                >
                  Close Simulator
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
