
import React from 'react';
import { ShotData, ShotStatus } from '../types';
import { Play, Image as ImageIcon, Video, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';

interface ShotCardProps {
  shot: ShotData;
  onGenerateImage: (id: string) => void;
  onGenerateVideo: (id: string) => void;
  isActive: boolean;
}

const ShotCard: React.FC<ShotCardProps> = ({ shot, onGenerateImage, onGenerateVideo, isActive }) => {
  const getStatusIcon = () => {
    switch (shot.status) {
      case ShotStatus.GENERATING: return <Loader2 className="w-5 h-5 animate-spin text-[#00f2ff]" />;
      case ShotStatus.COMPLETED: return <CheckCircle className="w-5 h-5 text-green-400" />;
      case ShotStatus.ERROR: return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div 
      className={`glass rounded-xl overflow-hidden transition-all duration-500 transform ${
        isActive ? 'ring-2 ring-[#00f2ff] scale-[1.02] neon-border' : 'hover:bg-opacity-80'
      } border border-white/5`}
    >
      <div className="relative aspect-video bg-black/40 group overflow-hidden">
        {shot.videoUrl ? (
          <video 
            src={shot.videoUrl} 
            className="w-full h-full object-cover" 
            controls 
            autoPlay 
            muted 
            loop 
          />
        ) : shot.thumbnailUrl ? (
          <img 
            src={shot.thumbnailUrl} 
            alt={shot.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="p-6 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-12 h-12 opacity-30" />
            </div>
            <p className="text-xs font-medium tracking-widest uppercase">No Visual Rendered</p>
          </div>
        )}

        {shot.status === ShotStatus.GENERATING && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
            <Loader2 className="w-10 h-10 animate-spin text-[#00f2ff] mb-4" />
            <p className="text-sm font-medium text-[#00f2ff] animate-pulse-cyan">GENERATING ASSETS...</p>
          </div>
        )}

        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
            {shot.timestamp}
          </span>
          <span className="px-2 py-1 rounded bg-[#00f2ff]/20 backdrop-blur-md text-[10px] font-bold text-[#00f2ff] border border-[#00f2ff]/30">
            {shot.id.toUpperCase()}
          </span>
        </div>

        <div className="absolute top-4 right-4">
          {getStatusIcon()}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-white font-heading">{shot.title}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-tighter text-[#00f2ff]/60 font-bold">Camera Motion</span>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed italic">"{shot.camera}"</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-tighter text-[#00f2ff]/60 font-bold">Audio Layer</span>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{shot.audio || 'Atmospheric Ambience'}</p>
          </div>
        </div>

        <div className="pt-2">
          <span className="text-[10px] uppercase tracking-tighter text-[#00f2ff]/60 font-bold block mb-1">Visual Context</span>
          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
            {shot.visualPrompt}
          </p>
        </div>

        {shot.overlay && (
          <div className="flex flex-wrap gap-2 pt-2">
            {shot.overlay.map((text, idx) => (
              <span key={idx} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                Overlay: "{text}"
              </span>
            ))}
          </div>
        )}

        <div className="pt-4 flex gap-2">
          <button 
            disabled={shot.status === ShotStatus.GENERATING}
            onClick={() => onGenerateImage(shot.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-xs font-bold transition-all disabled:opacity-50"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            STILL IMAGE
          </button>
          <button 
            disabled={shot.status === ShotStatus.GENERATING}
            onClick={() => onGenerateVideo(shot.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00f2ff] hover:bg-[#00d8e6] text-[#05010d] rounded-lg text-xs font-black transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
          >
            <Video className="w-3.5 h-3.5" />
            VEO CINEMATIC
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShotCard;
