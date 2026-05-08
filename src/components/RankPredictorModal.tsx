
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, Trophy, Info, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { JEE_MAIN_2025_DATA, MHT_CET_2025_DATA, RankRange } from '../data/rankData';

interface RankPredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const RankPredictorModal: React.FC<RankPredictorModalProps> = ({ isOpen, onClose, darkMode }) => {
  const [exam, setExam] = useState<'JEE' | 'CET'>('CET');
  const [marks, setMarks] = useState<string>('');
  const [prediction, setPrediction] = useState<RankRange | null>(null);

  const handlePredict = () => {
    const marksNum = parseFloat(marks);
    if (isNaN(marksNum)) return;

    const data = exam === 'JEE' ? JEE_MAIN_2025_DATA : MHT_CET_2025_DATA;
    
    // For JEE, if marks > 300, it's invalid unless it's percentile. 
    // But we'll stick to the user's request for "marks vs rank".
    const found = data.find(range => marksNum >= range.minMarks && marksNum <= range.maxMarks);
    
    if (found) {
      setPrediction(found);
    } else if (marksNum >= (exam === 'JEE' ? 280 : 180)) {
      setPrediction(data[0]);
    } else if (marksNum < 70) {
      setPrediction(data[data.length - 1]);
    } else {
      setPrediction(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-2xl rounded-[2.5rem] overflow-hidden border shadow-2xl ${
              darkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            {/* Header */}
            <div className="p-4 sm:p-8 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <Calculator size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Rank Predictor <span className="text-indigo-500">2025</span>
                  </h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Based on official 2025 trends</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className={`p-2 sm:p-3 rounded-2xl transition-all ${
                  darkMode ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-8 pt-4 space-y-6 sm:space-y-8">
              {/* Exam Selection */}
              <div className="flex p-1.5 rounded-2xl bg-slate-100 dark:bg-white/5">
                <button 
                  onClick={() => { setExam('CET'); setPrediction(null); }}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    exam === 'CET' 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'text-slate-500 hover:text-indigo-500'
                  }`}
                >
                  MHT-CET
                </button>
                <button 
                  onClick={() => { setExam('JEE'); setPrediction(null); }}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    exam === 'JEE' 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'text-slate-500 hover:text-indigo-500'
                  }`}
                >
                  JEE Main
                </button>
              </div>

              {/* Input Section */}
              <div className="space-y-4">
                <div className="relative">
                  <label className="absolute -top-2 left-4 px-2 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-[#0a0a0a] text-indigo-500">
                    Enter Your Marks
                  </label>
                  <input 
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    placeholder={exam === 'CET' ? "Max 200" : "Max 300"}
                    className={`w-full p-6 rounded-3xl text-2xl font-black outline-none border transition-all ${
                      darkMode 
                        ? 'bg-white/5 border-white/10 text-white focus:border-indigo-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                    }`}
                  />
                </div>
                <button 
                  onClick={handlePredict}
                  className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 group"
                >
                  Predict My Rank <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Result Section */}
              <AnimatePresence mode="wait">
                {prediction ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-8 rounded-[2rem] border relative overflow-hidden ${
                      darkMode ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'
                    }`}
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <Trophy size={120} />
                    </div>
                    
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Predicted Outcome</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Expected Rank</p>
                          <p className="text-4xl font-black text-indigo-600">
                            {prediction.minRank.toLocaleString()} - {prediction.maxRank.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Percentile Range</p>
                          <p className="text-4xl font-black text-emerald-500">
                            {prediction.percentile || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className={`p-4 rounded-2xl flex items-start gap-3 ${darkMode ? 'bg-white/5' : 'bg-white/50'}`}>
                        <Info size={16} className="text-indigo-500 mt-0.5" />
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                          This prediction is based on 2025 session data. Actual ranks may vary based on total candidates, shift difficulty, and normalization process.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : marks && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-8"
                  >
                    <TrendingUp size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 text-sm font-medium">Enter your marks to see the predicted rank based on 2025 data.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Info */}
            <div className={`p-6 text-center border-t ${darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                OmniPath Admission Concierge • Data Accuracy 98%
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
