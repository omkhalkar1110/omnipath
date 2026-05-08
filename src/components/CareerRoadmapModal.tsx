import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Briefcase, TrendingUp, GraduationCap, Info, ChevronRight, Sparkles } from 'lucide-react';
import { CAREER_ROADMAPS } from '../constants';
import { CareerOption } from '../types';

interface CareerRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CareerRoadmapModal: React.FC<CareerRoadmapModalProps> = ({ isOpen, onClose }) => {
  const [activeStream, setActiveStream] = useState<string>('engineering');
  const [selectedOption, setSelectedOption] = useState<CareerOption | null>(null);

  if (!isOpen) return null;

  const roadmap = CAREER_ROADMAPS[activeStream];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-zinc-900 w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Career Roadmaps</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Explore your future paths and possibilities</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-zinc-500" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar Streams */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-900/30 overflow-x-auto md:overflow-y-auto">
              <div className="flex md:flex-col gap-2 min-w-max md:min-w-0">
                {Object.keys(CAREER_ROADMAPS).map((stream) => (
                  <button
                    key={stream}
                    onClick={() => {
                      setActiveStream(stream);
                      setSelectedOption(null);
                    }}
                    className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                      activeStream === stream
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                        : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <span className="font-medium capitalize">{stream}</span>
                    <ChevronRight className={`hidden md:block w-4 h-4 transition-transform ${activeStream === stream ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{roadmap.title}</h3>
                  <div className="h-1 w-20 bg-indigo-600 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {roadmap.options.map((option, index) => (
                    <motion.div
                      key={option.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedOption(option)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedOption?.name === option.name
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10'
                          : 'border-zinc-100 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-zinc-800/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
                          <GraduationCap className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
                          {option.salaryRange}
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{option.name}</h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{option.intelligence}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Detailed View */}
                <AnimatePresence mode="wait">
                  {selectedOption ? (
                    <motion.div
                      key={selectedOption.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-indigo-600 mb-4">
                            <Info className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">Path Details</span>
                          </div>
                          <h5 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">{selectedOption.path}</h5>
                          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                            {selectedOption.intelligence}
                          </p>

                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <p className="text-xs text-zinc-500 uppercase font-bold">Salary Expectation</p>
                                <p className="text-lg font-bold text-zinc-900 dark:text-white">{selectedOption.salaryRange}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-emerald-600 mb-4">
                            <Briefcase className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">Top Job Roles</span>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {selectedOption.jobRoles.map((role) => (
                              <div
                                key={role}
                                className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm"
                              >
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-zinc-700 dark:text-zinc-300 font-medium">{role}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-800/30 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                      <Sparkles className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                      <p className="text-zinc-500 dark:text-zinc-400">Select a career path to see more details</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CareerRoadmapModal;
