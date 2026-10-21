import React, { useState } from 'react';
import { VirtualPet, StudentProfile, GradeLevel, PetType } from '../types/game';
import { AVAILABLE_PETS } from '../data/curriculumData';
import { soundFx } from '../utils/audio';
import { speakToChild } from '../utils/speech';
import { Sparkles, Check, Heart, Zap, Utensils, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PetOnboardingModalProps {
  currentStudent: StudentProfile;
  currentPet: VirtualPet;
  onSave: (updatedStudent: Partial<StudentProfile>, selectedPetId: string) => void;
  onClose: () => void;
}

export const PetOnboardingModal: React.FC<PetOnboardingModalProps> = ({
  currentStudent,
  currentPet,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(currentStudent.name);
  const [grade, setGrade] = useState<GradeLevel>(currentStudent.grade);
  const [avatar, setAvatar] = useState(currentStudent.avatar);
  const [selectedPetId, setSelectedPetId] = useState(currentPet.id);

  const studentAvatars = ['🚀', '🌟', '🦁', '🐬', '🦄', '⚡', '🎨', '⚽'];

  const selectedPet = AVAILABLE_PETS.find((p) => p.id === selectedPetId) || AVAILABLE_PETS[0];

  const handleSelectPet = (pet: VirtualPet) => {
    soundFx.playPetHappy();
    setSelectedPetId(pet.id);
    speakToChild(`Halo, aku ${pet.name}! Ayo berpetualang dan belajar bersama!`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playVictory();
    confetti({ particleCount: 70, spread: 60 });
    onSave(
      {
        name: name.trim() || 'Sahabat Cilik',
        grade,
        avatar,
        activePetId: selectedPetId,
      },
      selectedPetId
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-amber-300 shadow-2xl p-6 sm:p-8 relative my-8 animate-fade-in">
        {/* Close button */}
        <button
          onClick={() => {
            soundFx.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-bounce" />
            ONBOARDING & PROFIL SISWA
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-fun text-slate-900">
            Pilih Sahabat Maskot Peliharaanmu! 🐾
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Peliharaan ini akan menemanimu belajar, memberimu semangat, dan tumbuh besar seiring prestasimu!
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Step 1: Pet Mascot Selection Carousel */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              1. Pilih Maskot Peliharaan Pertamamu:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AVAILABLE_PETS.map((pet) => {
                const isSelected = pet.id === selectedPetId;
                const petEmoji =
                  pet.type === 'dino' ? '🦖' : pet.type === 'cat' ? '🐱' : pet.type === 'owl' ? '🦉' : '🐻';
                return (
                  <div
                    key={pet.id}
                    onClick={() => handleSelectPet(pet)}
                    className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex flex-col items-center text-center relative ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-400 scale-102'
                        : 'bg-slate-50 border-slate-200 hover:bg-amber-50/50 hover:border-amber-300'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <div className="text-4xl sm:text-5xl my-1 animate-wiggle">
                      {petEmoji}
                    </div>
                    <div className="font-fun font-bold text-sm text-slate-900 truncate w-full">
                      {pet.name}
                    </div>
                    <div className="text-[10px] text-amber-700 font-semibold line-clamp-1">
                      {pet.title}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Pet Details Card */}
            <div className="mt-3 bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {selectedPet.type === 'dino' ? '🦖' : selectedPet.type === 'cat' ? '🐱' : selectedPet.type === 'owl' ? '🦉' : '🐻'}
                </span>
                <div>
                  <div className="font-fun font-bold text-slate-900 text-sm">
                    {selectedPet.name} - Lv. {selectedPet.level}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Spesialisasi: {selectedPet.title}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1 text-orange-600">
                  <Utensils className="w-3.5 h-3.5" /> {selectedPet.hunger}% Kenyang
                </span>
                <span className="flex items-center gap-1 text-rose-500">
                  <Heart className="w-3.5 h-3.5" /> {selectedPet.happiness}% Ceria
                </span>
              </div>
            </div>
          </div>

          {/* Step 2: Student Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                2. Nama Petualang Cilik:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Bintang, Alif, Nisa..."
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-slate-800 font-semibold text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                3. Tingkat Kelas SD (Kurikulum):
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(parseInt(e.target.value, 10) as GradeLevel)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-slate-800 font-semibold text-sm bg-white transition"
              >
                <option value={1}>Kelas 1 SD (Fase A - Dasar)</option>
                <option value={2}>Kelas 2 SD (Fase A - Berhitung & Membaca)</option>
                <option value={3}>Kelas 3 SD (Fase B - Perkalian & Cerita)</option>
                <option value={4}>Kelas 4 SD (Fase B - Pecahan & IPAS)</option>
                <option value={5}>Kelas 5 SD (Fase C - Sains Lanjutan)</option>
                <option value={6}>Kelas 6 SD (Fase C - Persiapan Ujian)</option>
              </select>
            </div>
          </div>

          {/* Step 3: Avatar Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              4. Pilih Lencana Avatar Kamu:
            </label>
            <div className="flex flex-wrap gap-2.5">
              {studentAvatars.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => {
                    soundFx.playPop();
                    setAvatar(emoji);
                  }}
                  className={`w-11 h-11 rounded-2xl text-xl flex items-center justify-center border-2 transition active:scale-90 ${
                    avatar === emoji
                      ? 'bg-amber-400 border-amber-600 scale-110 shadow-md'
                      : 'bg-slate-100 border-slate-200 hover:bg-amber-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full btn-game-green text-white font-fun font-bold text-lg py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 transition"
            >
              Simpan & Masuk ke Peta Petualangan! 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
