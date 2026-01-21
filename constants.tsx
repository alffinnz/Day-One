
import { ShotData, ShotStatus } from './types';

export const PRODUCTION_TITLE = "DAY ONE — SHOT-BY-SHOT PRODUCTION SHEET";
export const PRODUCTION_SUBTITLE = "Total runtime target: 6–8 seconds (App Intro)";
export const STYLE_GUIDE = "Hyper-Realistic Gamified EdTech Cinematic";

export const INITIAL_SHOTS: ShotData[] = [
  {
    id: "shot-1",
    title: "Skill Pathway Spawn",
    timestamp: "0.0s – 0.7s",
    camera: "forward glide, low angle, shallow depth of field, cinematic sweep",
    visualPrompt: "hyper-realistic glowing digital skill pathway line activating in a dark purple environment, cyan nodes lighting up sequentially, soft particles floating, volumetric light, premium Unreal Engine cinematic look, subtle film grain, depth of field bokeh, no characters, no text yet, high detail",
    motion: ["nodes activate in sequence", "particles drift", "pathway emits soft glow"],
    audio: "soft chime + light tick UI fx",
    status: ShotStatus.IDLE
  },
  {
    id: "shot-2",
    title: "XP & Level UI HUD",
    timestamp: "0.7s – 2.0s",
    camera: "forward motion continues, slight parallax",
    visualPrompt: "cinematic HUD overlays appearing over the glowing pathway, transparent futuristic UI, cyan accents, white typography, XP bars, level badges, soft motion blur, particles, DOF bokeh, purple background lighting, premium 3D",
    overlay: ["Level 1 Unlocked", "XP +50", "Achievement: Basics Completed"],
    audio: "Micro VO: 'Level up!', 'Unlocked!'",
    status: ShotStatus.IDLE
  },
  {
    id: "shot-3",
    title: "Achievement Burst",
    timestamp: "2.0s – 3.0s",
    camera: "slight push-in + upward tilt",
    visualPrompt: "gold star achievement badge materializing in 3D with micro particle burst, ribbon trails, soft confetti, cinematic bloom, depth-of-field, purple ambient fog, high-end gamification aesthetic",
    overlay: ["Milestone Unlocked"],
    audio: "achievement chime + gold sparkle fx",
    status: ShotStatus.IDLE
  },
  {
    id: "shot-4",
    title: "Approach Transition",
    timestamp: "3.0s – 4.2s",
    camera: "sweep toward logo reveal zone, depth-of-field increases",
    visualPrompt: "pathway converges toward a bright reveal zone, ambient particles, shallow depth of field, cinematic lens flares, premium lighting, environment becomes more structured and clean",
    purpose: "creates breathing space before reveal, sets up brand moment",
    status: ShotStatus.IDLE
  },
  {
    id: "shot-5",
    title: "Logo Reveal",
    timestamp: "4.2s – 5.5s",
    camera: "settle + slight orbit",
    visualPrompt: "hyper-real 3D mortarboard graduation cap with satin semi-gloss material, soft reflections, tassel cloth simulation swinging and settling naturally, studio cinematic lighting, purple background, subtle volumetrics, bokeh particles, high fidelity, premium EdTech branding aesthetic",
    overlay: ["DAY ONE", "Your First Step Begins Here."],
    audio: "VO tagline + music swell",
    status: ShotStatus.IDLE
  },
  {
    id: "shot-6",
    title: "CTA Moment",
    timestamp: "5.5s – 6.8s",
    camera: "static settle + tiny parallax",
    visualPrompt: "clean UI CTA overlay with cyan accent button, minimalist HUD framing, purple ambient, cinematic residue particles, premium lighting",
    ctaVariants: ["Start Your Journey (Web)", "Begin (App)"],
    audio: "soft click / UI pulse",
    status: ShotStatus.IDLE
  }
];
