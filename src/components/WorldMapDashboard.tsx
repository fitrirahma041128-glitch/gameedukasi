import React from 'react';
import { StudentProfile, VirtualPet, SubjectId } from '../types/game';
import { soundFx } from '../utils/audio';
import { Sparkles, Play, Star, Lock, Trophy, Swords, Heart, Rocket, Compass, Flame, ArrowRight } from 'lucide-react';

interface WorldMapDashboardProps {
  student: StudentProfile;
  activePet: VirtualPet;
  onSelectSubject: (subject: SubjectId) => void;
  onOpenBattle: () => void;
  onOpenPetCare: () => void;
  onLaunchCanvasGame: (type: 'solar' | 'pizza' | 'rocket') => void;
  onOpenOnboarding: () => void;
}

interface Island {
  id: SubjectId;
  name: string;
  subtitle: string;
  icon: string;
  gradient: string;
  borderColor: string;
  starsRequired: number;
  unlocked: boolean;
  levels: { number: number; label: string; completed: boolean; stars: number }[];
  tags: string[];
}

export const WorldMapDashboard: React.FC<WorldMapDashboardProps> = ({
  student,
  activePet,
  onSelectSubject,
  onOpenBattle,
  onOpenPetCare,
  onLaunchCanvasGame,
  onOpenOnboarding,
}) => {
  const islands: Island[] = [
    {
      id: 'math',
      name: 'Pulau Matematika Ajaib',
      subtitle: 'Hitung Cepat, Perkalian & Pecahan Pizza',
      icon: '➕',
      gradient: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-400',
      starsRequired: 0,
      unlocked: true,
      levels: [
        { number: 1, label: 'Penjumlahan Cepat', completed: true, stars: 3 },
        { number: 2, label: 'Perkalian 4 Kotak Donat', completed: true, stars: 2 },
        { number: 3, label: 'Tantangan Pecahan Pizza', completed: false, stars: 0 },
        { number: 4, label: 'Keliling Persegi Ajaib', completed: false, stars: 0 },
      ],
      tags: ['Berhitung', 'Pecahan', 'Geometri'],
    },
    {
      id: 'science',
      name: 'Lembah Sains & IPAS',
      subtitle: 'Tata Surya, Metamorfosis & Klorofil',
      icon: '🪐',
      gradient: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-400',
      starsRequired: 0,
      unlocked: true,
      levels: [
        { number: 1, label: 'Misteri Cincin Saturnus', completed: true, stars: 3 },
        { number: 2, label: 'Metamorfosis Kupu-Kupu', completed: true, stars: 3 },
        { number: 3, label: 'Zat Hijau Daun (Fotosintesis)', completed: false, stars: 0 },
        { number: 4, label: 'Rangka & Sendi Manusia', completed: false, stars: 0 },
      ],
      tags: ['Tata Surya', 'Tumbuhan', 'Hewan'],
    },
    {
      id: 'indonesian',
      name: 'Rimba Bahasa Indonesia',
      subtitle: 'Lawan Kata, Ejaan Suara & Kosakata',
      icon: '📖',
      gradient: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-400',
      starsRequired: 0,
      unlocked: true,
      levels: [
        { number: 1, label: 'Lawan Kata (Antonim)', completed: true, stars: 3 },
        { number: 2, label: 'Tantangan Mengeja B-U-K-U', completed: false, stars: 0 },
        { number: 3, label: 'Pantun Nasihat Cilik', completed: false, stars: 0 },
      ],
      tags: ['Antonim', 'Ejaan Suara', 'Membaca'],
    },
    {
      id: 'english',
      name: 'English Fun Land',
      subtitle: 'Animals, Colors & Voice Pronunciation',
      icon: '🦁',
      gradient: 'from-pink-500 to-rose-600',
      borderColor: 'border-pink-400',
      starsRequired: 3,
      unlocked: student.stars >= 3,
      levels: [
        { number: 1, label: 'Wild Animal Names', completed: true, stars: 2 },
        { number: 2, label: 'Colors & Fruits', completed: false, stars: 0 },
        { number: 3, label: 'Spelling Bee Challenge', completed: false, stars: 0 },
      ],
      tags: ['Pronunciation', 'Animals', 'Spelling'],
    },
    {
      id: 'logic',
      name: 'Benteng Logika & Coding',
      subtitle: 'Arah Robot, Pola Gambar & Algoritma',
      icon: '🤖',
      gradient: 'from-violet-600 to-purple-700',
      borderColor: 'border-purple-400',
      starsRequired: 6,
      unlocked: student.stars >= 6,
      levels: [
        { number: 1, label: 'Arah Jalur Robot Robo', completed: true, stars: 3 },
        { number: 2, label: 'Pola Buah Tersembunyi', completed: false, stars: 0 },
        { number: 3, label: 'Algoritma Labirin', completed: false, stars: 0 },
      ],
      tags: ['Pola', 'Arah Robot', 'Logika'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-emerald-50 to-teal-100/60 pb-20 px-4 sm:px-6 pt-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Player Greeting & Companion Banner */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border-2 border-emerald-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-3xl flex items-center justify-center shadow-md animate-bounceSlight">
                {activePet.type === 'dino' ? '🦖' : activePet.type === 'cat' ? '🐱' : activePet.type === 'owl' ? '🦉' : '🐻'}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white">
                Lv.{activePet.level}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-xl sm:text-2xl font-black font-fun text-slate-800">
                  Selamat Datang, {student.name}!
                </h1>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-lg">
                  Kelas {student.grade} SD
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Sahabatmu <strong className="text-amber-800">{activePet.name}</strong> siap menemanimu menaklukkan pulau pengetahuan hari ini! 🌟
              </p>
            </div>
          </div>

          {/* Quick Pet Companion Interaction Callout */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playPop();
                onOpenPetCare();
              }}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-2xl text-xs sm:text-sm font-bold font-fun shadow-sm flex items-center gap-2 transition hover:scale-105 active:scale-95"
            >
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
              Beri Makan & Dandani Pet 🐾
            </button>
            <button
              onClick={() => {
                soundFx.playPop();
                onOpenOnboarding();
              }}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition"
              title="Ubah Profil atau Ganti Pet"
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Special Activity Arenas Row: Battle Arena & Canvas Mini Games */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Duel Kuis Arena Banner */}
          <div
            onClick={() => {
              soundFx.playPop();
              onOpenBattle();
            }}
            className="md:col-span-2 bg-gradient-to-r from-rose-500 to-red-600 rounded-3xl p-5 text-white shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.99] transition relative overflow-hidden group border-2 border-rose-300"
          >
            <div className="absolute right-3 -bottom-2 text-7xl opacity-20 group-hover:scale-110 transition">
              ⚔️
            </div>
            <div className="relative z-10">
              <span className="px-2.5 py-0.5 bg-white/20 rounded-full text-[11px] font-black uppercase tracking-wider">
                REAL-TIME MULTIPLAYER
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-fun mt-1 flex items-center gap-2">
                Arena Duel Kuis Kelas <Swords className="w-5 h-5 text-yellow-300" />
              </h2>
              <p className="text-xs text-rose-100 mt-1 max-w-sm">
                Tantang teman sekelas atau bot pintar adu cepat jawab soal berhadiah koin ganda!
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-yellow-300 font-fun">
                Masuk Arena Pertarungan ➔
              </div>
            </div>
          </div>

          {/* Quick Canvas Solar System */}
          <div
            onClick={() => {
              soundFx.playPop();
              onLaunchCanvasGame('solar');
            }}
            className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-4 text-white shadow-md cursor-pointer hover:scale-105 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">🪐</span>
              <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                Canvas 2D
              </span>
            </div>
            <div>
              <h3 className="font-fun font-bold text-sm text-amber-300">Rakit Tata Surya</h3>
              <p className="text-[11px] text-slate-300 mt-0.5">Susun planet ke orbit dari Matahari</p>
            </div>
          </div>

          {/* Quick Canvas Pizza Fraction */}
          <div
            onClick={() => {
              soundFx.playPop();
              onLaunchCanvasGame('pizza');
            }}
            className="bg-amber-500 border-2 border-amber-300 rounded-3xl p-4 text-white shadow-md cursor-pointer hover:scale-105 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">🍕</span>
              <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                Visual Math
              </span>
            </div>
            <div>
              <h3 className="font-fun font-bold text-sm text-yellow-100">Dapur Pecahan Pizza</h3>
              <p className="text-[11px] text-amber-100 mt-0.5">Pahami pecahan dengan irisan lezat</p>
            </div>
          </div>
        </div>

        {/* Island Map Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h2 className="text-2xl font-black font-fun text-slate-900 flex items-center gap-2">
              <span>🗺️</span> Peta Pulau Petualangan Belajar
            </h2>
            <p className="text-xs text-slate-600">Pilih pulau mata pelajaran untuk memulai misi kuis adaptifmu!</p>
          </div>
        </div>

        {/* Islands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {islands.map((island) => {
            return (
              <div
                key={island.id}
                className={`bg-white rounded-3xl border-3 ${
                  island.unlocked ? island.borderColor : 'border-slate-200'
                } p-5 shadow-lg relative flex flex-col justify-between transition-all hover:shadow-xl group`}
              >
                {/* Island Header Banner */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${island.gradient} text-white text-3xl flex items-center justify-center shadow-md group-hover:scale-110 transition`}
                    >
                      {island.icon}
                    </div>

                    {!island.unlocked && (
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-200">
                        <Lock className="w-3.5 h-3.5" /> Butuh {island.starsRequired} ⭐
                      </span>
                    )}

                    {island.unlocked && (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold">
                        Terbuka ✅
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black font-fun text-slate-900 leading-tight">
                    {island.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 mb-3">
                    {island.subtitle}
                  </p>

                  {/* Level Progress Nodes */}
                  <div className="space-y-2 mb-4 bg-slate-50 rounded-2xl p-3 border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Misi & Tingkat Tantangan:
                    </div>
                    {island.levels.map((lvl) => (
                      <div
                        key={lvl.number}
                        className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-none"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                              lvl.completed
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {lvl.number}
                          </span>
                          <span className={`font-semibold ${lvl.completed ? 'text-slate-800' : 'text-slate-500'}`}>
                            {lvl.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {lvl.completed ? (
                            Array.from({ length: 3 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < lvl.stars
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-slate-200 fill-slate-200'
                                }`}
                              />
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400">Belum</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Island Tags & Play Action */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {island.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (island.unlocked) {
                        soundFx.playPop();
                        onSelectSubject(island.id);
                      } else {
                        soundFx.playWrong();
                      }
                    }}
                    disabled={!island.unlocked}
                    className={`w-full py-3 rounded-2xl font-fun font-bold text-sm shadow-md flex items-center justify-center gap-2 transition active:scale-95 ${
                      island.unlocked
                        ? 'btn-game-green text-white hover:brightness-105'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {island.unlocked ? (
                      <>
                        <Play className="w-4 h-4 fill-white" /> Mulai Misi Sekarang!
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" /> Kumpulkan Bintang untuk Buka
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
