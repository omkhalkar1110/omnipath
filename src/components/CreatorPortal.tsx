import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Video, Sparkles, Trash2, Loader2, CheckCircle2, AlertCircle, Play, Plus, X, ShieldCheck } from 'lucide-react';
import { generateVibeVideo } from '../services/gemini';
import { User } from '../types';
import { VibeVideo, addVibeVideo, getCollegeVibeVideos, deleteVibeVideo } from '../firebase';

interface CreatorPortalProps {
  user: User;
  darkMode: boolean;
  hasApiKey: boolean;
  onOpenApiKey: () => void;
}

export const CreatorPortal = ({ user, darkMode, hasApiKey, onOpenApiKey }: CreatorPortalProps) => {
  const [videos, setVideos] = useState<VibeVideo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [uploadMode, setUploadMode] = useState<'ai' | 'direct'>('ai');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (user.collegeName) {
      fetchVideos();
    }
  }, [user.collegeName]);

  const fetchVideos = async () => {
    try {
      getCollegeVibeVideos(user.collegeName!, (data) => {
        // Map Firestore VibeVideo to the format expected by the UI
        setVideos(data.map(v => ({
          id: v.id,
          collegeName: v.collegeName,
          videoUrl: v.videoUrl,
          thumbnailUrl: v.thumbnailUrl || v.videoUrl,
          description: v.description,
          creatorName: v.creatorName || "Anonymous",
          creatorUid: v.creatorUid || "unknown",
          createdAt: (v.createdAt as any)?.toDate ? (v.createdAt as any).toDate().toISOString() : new Date().toISOString()
        } as any)));
      });
    } catch (error) {
      console.error("Error fetching vibe videos:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (uploadMode === 'ai') {
      if (!hasApiKey) {
        onOpenApiKey();
        return;
      }

      if (!prompt) {
        setStatus({ type: 'error', message: 'Please provide a description for the vibe video.' });
        return;
      }

      setIsGenerating(true);
      setStatus(null);

      try {
        // 1. Generate video using Veo
        const videoUrl = await generateVibeVideo(user.collegeName!, prompt, previewUrl || undefined);
        
        if (!videoUrl) {
          throw new Error("Failed to generate video");
        }

        // 2. Save to "database"
        await addVibeVideo({
          collegeName: user.collegeName!,
          videoUrl: videoUrl,
          description: prompt,
          creatorName: user.name,
          creatorUid: user.uid
        });

        setStatus({ type: 'success', message: 'Vibe video generated and published successfully!' });
        setPrompt('');
        setSelectedFile(null);
        setPreviewUrl(null);
      } catch (error) {
        console.error("Error generating vibe video:", error);
        setStatus({ type: 'error', message: 'Failed to generate video. Please try again.' });
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Direct Upload Mode
      if (!selectedFile || !prompt) {
        setStatus({ type: 'error', message: 'Please provide both a file and a title.' });
        return;
      }

      setIsGenerating(true);
      try {
        await addVibeVideo({
          collegeName: user.collegeName!,
          videoUrl: previewUrl!, // Using the base64 preview for demo
          description: prompt,
          creatorName: user.name,
          creatorUid: user.uid
        });

        setStatus({ type: 'success', message: 'Video uploaded successfully!' });
        setPrompt('');
        setSelectedFile(null);
        setPreviewUrl(null);
      } catch (error) {
        setStatus({ type: 'error', message: 'Failed to upload video.' });
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this vibe video?")) return;

    try {
      await deleteVibeVideo(videoId);
      setStatus({ type: 'success', message: 'Video deleted successfully.' });
    } catch (error) {
      console.error("Error deleting video:", error);
      setStatus({ type: 'error', message: 'Failed to delete video.' });
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase">
            Creator <span className="text-indigo-500">Portal</span>
          </h2>
          <p className="text-slate-500 font-medium">
            Managing content for <span className="text-indigo-500 font-bold">{user.collegeName}</span>
          </p>
        </div>
        <button 
          onClick={fetchVideos}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${darkMode ? 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
        >
          <Sparkles size={14} />
          Refresh Feed
        </button>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Generator Section */}
        <section className="lg:col-span-5 space-y-6">
          <div className={`p-6 sm:p-8 rounded-[2.5rem] border ${darkMode ? 'bg-[#111] border-white/5' : 'bg-white border-slate-200 shadow-2xl'}`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Content Manager</h3>
                <div className="flex gap-2 mt-1">
                  <button 
                    onClick={() => setUploadMode('ai')}
                    className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md transition-all ${uploadMode === 'ai' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                  >
                    AI Generator
                  </button>
                  <button 
                    onClick={() => setUploadMode('direct')}
                    className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md transition-all ${uploadMode === 'direct' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                  >
                    Direct Upload
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {uploadMode === 'ai' && !hasApiKey && (
                <div className={`p-4 rounded-2xl border flex items-center gap-4 ${darkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                  <ShieldCheck size={24} />
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">API Key Missing</p>
                    <p className="text-[10px] font-medium">You need to select a paid API key to use Veo AI Video Generation.</p>
                  </div>
                  <button 
                    onClick={onOpenApiKey}
                    className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest"
                  >
                    Fix Now
                  </button>
                </div>
              )}

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Raw Footage / Reference Image</label>
                <div 
                  className={`relative aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden ${
                    previewUrl 
                      ? 'border-indigo-500/50' 
                      : (darkMode ? 'border-white/5 hover:border-white/20 bg-white/5' : 'border-slate-200 hover:border-indigo-500/30 bg-slate-50')
                  }`}
                >
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                          className="p-3 bg-rose-500 text-white rounded-full"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload size={32} className="text-slate-400 mb-4" />
                      <p className="text-xs font-bold text-slate-500">Drag & drop or click to upload</p>
                      <p className="text-[10px] text-slate-400 mt-1">MP4, MOV or JPG (Max 50MB)</p>
                      <input 
                        type="file" 
                        accept="video/*,image/*" 
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                  {uploadMode === 'ai' ? 'Describe the Vibe' : 'Video Title'}
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={uploadMode === 'ai' 
                    ? "e.g. A cinematic tour of our new robotics lab with students working on drones..." 
                    : "e.g. Official Campus Tour 2026"}
                  className={`w-full h-32 rounded-2xl p-4 text-sm outline-none border transition-all resize-none ${
                    darkMode ? 'bg-white/5 border-white/5 text-white focus:ring-indigo-500' : 'bg-slate-50 text-slate-900 border-slate-200 focus:ring-indigo-500 shadow-sm'
                  }`}
                />
              </div>

              {status && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl flex items-center gap-3 ${
                    status.type === 'success' 
                      ? (darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                      : (darkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600')
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <p className="text-xs font-bold">{status.message}</p>
                </motion.div>
              )}

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt || (uploadMode === 'direct' && !selectedFile)}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {uploadMode === 'ai' ? 'Generating Vibe...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    {uploadMode === 'ai' ? <Sparkles size={20} /> : <Upload size={20} />}
                    {uploadMode === 'ai' ? 'Generate AI Video' : 'Publish Video'}
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Videos Section */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tighter">Published <span className="text-indigo-500">Vibes</span></h3>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{videos.length} Videos</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {videos.map((video) => (
                <motion.div 
                  key={video.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
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
                        className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform"
                      >
                        <Play size={24} fill="currentColor" />
                      </a>
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest">
                      AI Generated
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-sm line-clamp-1">{video.description}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                      <button 
                        onClick={() => handleDelete(video.id)}
                        className="text-rose-500 p-2 hover:bg-rose-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {videos.length === 0 && (
              <div className={`col-span-2 p-12 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center text-center space-y-4 ${
                darkMode ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'
              }`}>
                <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center">
                  <Video size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold">No Vibe Videos Yet</h4>
                  <p className="text-xs text-slate-500 max-w-[200px]">Upload your first raw footage to generate an AI vibe video.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
