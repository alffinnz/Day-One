import React, { useState, useCallback, useEffect } from 'react';
import { PRODUCTION_TITLE, PRODUCTION_SUBTITLE, STYLE_GUIDE, INITIAL_SHOTS } from './constants';
import { ShotData, ShotStatus, GenerationState } from './types';
import { GeminiService } from './services/geminiService';
import ShotCard from './components/ShotCard';
import { Layers, Zap, Film, Sparkles, AlertCircle, Info, Key, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [shots, setShots] = useState<ShotData[]>(INITIAL_SHOTS);
  const [activeShotId, setActiveShotId] = useState<string | null>(null);
  const [genState, setGenState] = useState<GenerationState>({
    isGenerating: false,
    activeShotId: null,
    message: ''
  });
  const [showKeyWarning, setShowKeyWarning] = useState(false);

  const gemini = GeminiService.getInstance();

  const handleUpdateShot = useCallback((id: string, updates: Partial<ShotData>) => {
    setShots(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const handleGenerateImage = async (id: string) => {
    const shot = shots.find(s => s.id === id);
    if (!shot) return;

    try {
      handleUpdateShot(id, { status: ShotStatus.GENERATING });
      setGenState({ isGenerating: true, activeShotId: id, message: 'Painting high-fidelity keyframe...' });
      
      const imageUrl = await gemini.generateImage(shot.visualPrompt);
      
      handleUpdateShot(id, { 
        status: ShotStatus.COMPLETED, 
        thumbnailUrl: imageUrl,
        videoUrl: undefined
      });
    } catch (error) {
      console.error(error);
      handleUpdateShot(id, { status: ShotStatus.ERROR });
    } finally {
      setGenState({ isGenerating: false, activeShotId: null, message: '' });
    }
  };

  const handleGenerateVideo = async (id: string) => {
    const shot = shots.find(s => s.id === id);
    if (!shot) return;

    // Check for API key first for Veo
    const hasKey = await gemini.checkApiKey();
    if (!hasKey) {
      setShowKeyWarning(true);
      return;
    }

    try {
      handleUpdateShot(id, { status: ShotStatus.GENERATING });
      setGenState({ isGenerating: true, activeShotId: id, message: 'Booting Veo Cinematic Engine...' });
      
      const videoUrl = await gemini.generateVideo(
        `Style: ${STYLE_GUIDE}. Camera: ${shot.camera}. Prompt: ${shot.visualPrompt}`,
        (msg) => setGenState(prev => ({ ...prev, message: msg }))
      );
      
      handleUpdateShot(id, { 
        status: ShotStatus.COMPLETED, 
        videoUrl: videoUrl 
      });
    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes('Requested entity was not found')) {
        setShowKeyWarning(true);
      }
      handleUpdateShot(id, { status: ShotStatus.ERROR });
    } finally {
      setGenState({ isGenerating: false, activeShotId: null, message: '' });
    }
  };

  const handleSelectKey = async () => {
    await gemini.openKeySelector();
    setShowKeyWarning(false);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-[#00f2ff]/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4f46e5]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#06b6d4]/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f2ff] to-[#4f46e5] flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.3)]">
            <Film className="w-6 h-6 text-[#05010d]" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white font-heading uppercase leading-none">
              {PRODUCTION_TITLE.split('—')[0]}
              <span className="text-[#00f2ff] ml-2">— INTRO PRODUCTION</span>
            </h1>
            <p className="text-[10px] tracking-[0.2em] font-bold text-slate-500 uppercase mt-1">
              {PRODUCTION_SUBTITLE} • STYLE: {STYLE_GUIDE}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="hidden lg:flex flex-col items-end mr-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Production Status</span>
            <span className="text-xs font-mono text-green-400">ACTIVE SESSION • 2.5 FPS TARGET</span>
          </div>
          <button 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xs font-bold transition-all text-white/80"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          >
            <Layers className="w-4 h-4" />
            STORYBOARD
          </button>
          <button 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#00f2ff] hover:bg-[#00d8e6] text-[#05010d] rounded-xl text-xs font-black transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)]"
            onClick={handleSelectKey}
          >
            <Key className="w-4 h-4" />
            VEO KEY
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-[1600px] mx-auto px-6 pt-12">
        {/* Project Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total Duration', value: '6.8s', icon: Zap },
            { label: 'Shots Count', value: '06', icon: Film },
            { label: 'Render Target', value: '1080p Cinematic', icon: Sparkles },
            { label: 'Style Profile', value: 'UE5 Gamified', icon: Info },
          ].map((stat, i) => (
            <div key={i} className="glass p-5 rounded-2xl border-white/5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <stat.icon className="w-5 h-5 text-[#00f2ff]" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{stat.label}</p>
                <p className="text-lg font-bold text-white font-heading">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Shot Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {shots.map((shot) => (
            <ShotCard 
              key={shot.id} 
              shot={shot} 
              onGenerateImage={handleGenerateImage}
              onGenerateVideo={handleGenerateVideo}
              isActive={activeShotId === shot.id}
            />
          ))}
        </div>
      </main>

      {/* API Key Selection Modal (Overlay) */}
      {showKeyWarning && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="glass max-w-md w-full p-8 rounded-3xl border-[#00f2ff]/30 text-center space-y-6 shadow-[0_0_100px_rgba(0,242,255,0.1)]">
            <div className="w-20 h-20 bg-[#00f2ff]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00f2ff]/50">
              <Key className="w-10 h-10 text-[#00f2ff]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white font-heading tracking-tight mb-2">AUTH REQUIRED</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                To generate hyper-realistic cinematic video previews via Veo, you must select a valid Gemini API key from a paid Google Cloud Project.
              </p>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer"
                className="text-[#00f2ff] hover:underline text-xs mt-2 block"
              >
                Learn about Gemini API billing
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleSelectKey}
                className="w-full py-4 bg-[#00f2ff] text-[#05010d] font-black rounded-xl hover:bg-[#00d8e6] transition-all"
              >
                SELECT API KEY
              </button>
              <button 
                onClick={() => setShowKeyWarning(false)}
                className="w-full py-4 bg-white/5 text-slate-400 font-bold rounded-xl hover:bg-white/10 transition-all border border-white/5"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Status HUD */}
      {genState.isGenerating && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-6 px-8 py-5 glass rounded-2xl border-[#00f2ff]/30 neon-border animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg border-2 border-[#00f2ff]/20 flex items-center justify-center">
                {/* Fixed: Added Loader2 to lucide-react imports */}
                <Loader2 className="w-6 h-6 animate-spin text-[#00f2ff]" />
              </div>
              <div className="absolute inset-0 blur-md bg-[#00f2ff]/20 animate-pulse"></div>
            </div>
            <div className="min-w-[200px]">
              <p className="text-[10px] font-black tracking-widest text-[#00f2ff] uppercase mb-0.5">Engine Status: Generating</p>
              <p className="text-sm font-bold text-white whitespace-nowrap">{genState.message}</p>
            </div>
          </div>
          <div className="h-10 w-px bg-white/10"></div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Render Queue</p>
            <p className="text-xs font-mono text-slate-300">GPU_ID: 80-TI-VEO</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;