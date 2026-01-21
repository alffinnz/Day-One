
export enum ShotStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface ShotData {
  id: string;
  title: string;
  timestamp: string;
  camera: string;
  visualPrompt: string;
  motion?: string[];
  overlay?: string[];
  audio?: string;
  purpose?: string;
  ctaVariants?: string[];
  thumbnailUrl?: string;
  videoUrl?: string;
  status: ShotStatus;
  progress?: number;
}

export interface GenerationState {
  isGenerating: boolean;
  activeShotId: string | null;
  message: string;
}
