import React from 'react';
import { StudentProfile, VirtualPet } from '../types/game';
import { soundFx } from '../utils/audio';
import { Sparkles, Coins, Star, Flame, Volume2, VolumeX, Shield, Heart, Utensils, Swords, Home } from 'lucide-react';

interface NavbarProps {
  student: StudentProfile;
  activePet: VirtualPet;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenPetModal: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  student,
  activePet,
  currentView,
  onNavigate,
  onOpenPetModal,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-emerald-100 shadow-sm px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          onClick={() => {
            soundFx.playPop();
            onNavigate('world-map');
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition">
            🏝️
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-fun text-xl sm:text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                EduPet Island
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full border border-amber-300">
                SD SD Cerdas
              </span>
            </div>
            <div className="text-[10px] text-slate-500 hidden sm:block">
              Petualangan Belajar & Game AI Siswa SD
            </div>
          </div>
        </div>

        {/* Center Navigation Shortcuts */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              soundFx.playPop();
              onNavigate('world-map');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold font-fun flex items-center gap-1.5 transition ${
              currentView === 'world-map'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-emerald-50'
            }`}
          >
            <span>🗺️</span>
            <span className="hidden md:inline">Peta Petualangan</span>
          </button>

          <button
            onClick={() => {
              soundFx.playPop();
              onNavigate('battle');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold font-fun flex items-center gap-1.5 transition ${
              currentView === 'battle'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-rose-50'
            }`}
          >
            <Swords className="w-4 h-4 text-rose-500" />
            <span className="hidden md:inline">Duel Kuis</span>
          </button>

          <button
            onClick={() => {
              soundFx.playPop();
              onNavigate('pet-care');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold font-fun flex items-center gap-1.5 transition relative ${
              currentView === 'pet-care'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-amber-50'
            }`}
          >
            <span className="text-base">🐾</span>
            <span className="hidden md:inline">Rawat Pet</span>
            {activePet.hunger < 50 && (
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-1 right-1 animate-ping" />
            )}
          </button>

          <button
            onClick={() => {
              soundFx.playPop();
              onNavigate('analytics');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold font-fun flex items-center gap-1.5 transition ${
              currentView === 'analytics'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-indigo-50'
            }`}
          >
            <Shield className="w-4 h-4 text-indigo-500" />
            <span className="hidden md:inline">Guru & Ortu</span>
          </button>
        </nav>

        {/* Right HUD: Stats, Pet mini status, Sound */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Virtual Pet Quick Status Chip */}
          <div
            onClick={() => {
              soundFx.playPop();
              onNavigate('pet-care');
            }}
            className="flex items-center gap-2 bg-amber-50 border border-amber-200 hover:border-amber-400 px-2.5 py-1 rounded-2xl cursor-pointer shadow-xs transition group"
            title="Klik untuk merawat peliharaanmu!"
          >
            <div className="w-7 h-7 bg-amber-200/80 rounded-full flex items-center justify-center text-base group-hover:scale-110 transition">
              {activePet.type === 'dino' ? '🦖' : activePet.type === 'cat' ? '🐱' : activePet.type === 'owl' ? '🦉' : '🐻'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-[11px] font-bold text-amber-900 leading-tight">
                {activePet.name}
              </div>
              <div className="flex items-center gap-1 text-[9px] text-amber-700">
                <span>Lv.{activePet.level}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Utensils className="w-2.5 h-2.5 text-orange-500" /> {activePet.hunger}%
                </span>
                <span className="flex items-center gap-0.5">
                  <Heart className="w-2.5 h-2.5 text-rose-500" /> {activePet.happiness}%
                </span>
              </div>
            </div>
          </div>

          {/* Student Coins */}
          <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-2xl text-xs font-bold text-yellow-800 shadow-xs">
            <Coins className="w-3.5 h-3.5 text-amber-500 animate-bounceSlight" />
            <span>{student.coins}</span>
          </div>

          {/* Student Stars */}
          <div className="flex items-center gap-1 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-2xl text-xs font-bold text-purple-800 shadow-xs">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>{student.stars}</span>
          </div>

          {/* Streak */}
          <div className="hidden sm:flex items-center gap-1 bg-rose-50 border border-rose-200 px-2 py-1 rounded-2xl text-xs font-bold text-rose-700 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{student.streakDays}d</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Student Profile Avatar */}
          <button
            onClick={onOpenPetModal}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow hover:scale-105 transition border-2 border-white"
            title="Ganti Profil & Maskot"
          >
            {student.avatar || '⭐'}
          </button>
        </div>
      </div>
    </header>
  );
};
