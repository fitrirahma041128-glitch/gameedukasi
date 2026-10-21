import React, { useState } from 'react';
import { VirtualPet, StudentProfile, PetFood, PetAccessory } from '../types/game';
import { PET_FOODS, PET_ACCESSORIES } from '../data/curriculumData';
import { soundFx } from '../utils/audio';
import { speakToChild } from '../utils/speech';
import confetti from 'canvas-confetti';
import { Heart, Utensils, Zap, Sparkles, ShoppingBag, ArrowLeft, Check, Smile, Star } from 'lucide-react';

interface PetCareSanctuaryProps {
  student: StudentProfile;
  pet: VirtualPet;
  onUpdatePet: (updated: Partial<VirtualPet>) => void;
  onUpdateCoins: (delta: number) => void;
  onBackToMap: () => void;
}

export const PetCareSanctuary: React.FC<PetCareSanctuaryProps> = ({
  student,
  pet,
  onUpdatePet,
  onUpdateCoins,
  onBackToMap,
}) => {
  const [activeTab, setActiveTab] = useState<'care' | 'shop'>('care');
  const [foods, setFoods] = useState<PetFood[]>(PET_FOODS);
  const [accessories, setAccessories] = useState<PetAccessory[]>(PET_ACCESSORIES);
  const [petMoodMessage, setPetMoodMessage] = useState<string>('Pet sedang riang dan bersemangat!');
  const [isPetBouncing, setIsPetBouncing] = useState<boolean>(false);

  // Tap pet to pet/interact
  const handlePetInteract = () => {
    soundFx.playPetHappy();
    setIsPetBouncing(true);
    setTimeout(() => setIsPetBouncing(false), 800);

    const newHappy = Math.min(100, pet.happiness + 5);
    onUpdatePet({ happiness: newHappy });
    setPetMoodMessage(`*Purr!* ${pet.name} sangat senang kamu mengelus kepalanya! ❤️`);
    speakToChild(`Aku sayang kamu, ${student.name}!`);
    confetti({ particleCount: 25, spread: 45, origin: { y: 0.6 } });
  };

  // Feed pet
  const handleFeedPet = (food: PetFood) => {
    if (food.count <= 0) {
      // Need to buy more
      if (student.coins < food.cost) {
        soundFx.playWrong();
        setPetMoodMessage(`Koin tidak cukup untuk membeli ${food.name}! Kumpulkan koin dari kuis ya!`);
        return;
      }
      // Buy & feed
      soundFx.playMunch();
      onUpdateCoins(-food.cost);
    } else {
      soundFx.playMunch();
      // Decrease inventory count
      setFoods((prev) =>
        prev.map((f) => (f.id === food.id ? { ...f, count: f.count - 1 } : f))
      );
    }

    const newHunger = Math.min(100, pet.hunger + food.hungerBoost);
    const newHappy = Math.min(100, pet.happiness + food.happyBoost);
    let newXp = pet.xp + 20;
    let newLevel = pet.level;

    if (newXp >= pet.maxXp) {
      newXp = newXp - pet.maxXp;
      newLevel += 1;
      soundFx.playVictory();
      confetti({ particleCount: 80, spread: 70 });
      setPetMoodMessage(`HORAS! ${pet.name} NAIK KE LEVEL ${newLevel}! 🎉⭐`);
      speakToChild(`Hore! ${pet.name} naik ke level ${newLevel}!`);
    } else {
      setPetMoodMessage(`Nyam-nyam! ${pet.name} menikmati ${food.name}! Kenyang +${food.hungerBoost}%`);
    }

    onUpdatePet({
      hunger: newHunger,
      happiness: newHappy,
      xp: newXp,
      level: newLevel,
    });
  };

  // Buy or Equip Accessory
  const handleAccessoryAction = (acc: PetAccessory) => {
    if (acc.owned) {
      soundFx.playPop();
      const willEquip = !acc.equipped;
      setAccessories((prev) =>
        prev.map((a) => (a.id === acc.id ? { ...a, equipped: willEquip } : a))
      );

      if (acc.type === 'hat') {
        onUpdatePet({ equippedHat: willEquip ? acc.id : undefined });
      } else {
        onUpdatePet({ equippedAccessory: willEquip ? acc.id : undefined });
      }

      setPetMoodMessage(`${pet.name} sekarang memakai ${acc.name}! Gayanya keren! 😎`);
    } else {
      // Buy
      if (student.coins < acc.cost) {
        soundFx.playWrong();
        setPetMoodMessage(`Koinmu kurang (${student.coins}/${acc.cost}). Rajin belajar untuk dapat koin lagi ya!`);
        return;
      }

      soundFx.playCoin();
      onUpdateCoins(-acc.cost);
      setAccessories((prev) =>
        prev.map((a) => (a.id === acc.id ? { ...a, owned: true, equipped: true } : a))
      );
      if (acc.type === 'hat') {
        onUpdatePet({ equippedHat: acc.id });
      }
      confetti({ particleCount: 50, spread: 60 });
      setPetMoodMessage(`Selamat! Berhasil membeli ${acc.name} dan langsung dipasang! ✨`);
    }
  };

  const equippedHatObj = accessories.find((a) => a.id === pet.equippedHat && a.equipped);
  const petEmoji =
    pet.type === 'dino' ? '🦖' : pet.type === 'cat' ? '🐱' : pet.type === 'owl' ? '🦉' : '🐻';

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-100/60 pb-20 px-4 sm:px-6 pt-6 text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-amber-200">
          <button
            onClick={() => {
              soundFx.playPop();
              onBackToMap();
            }}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-amber-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Peta
          </button>

          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-black font-fun text-amber-900 flex items-center justify-center gap-2">
              <span>🏡</span> Rumah & Perawatan Maskot
            </h1>
            <p className="text-xs text-amber-700">Rawat, beri makan, dan dandani sahabat belajarmu!</p>
          </div>

          <div className="flex items-center gap-1 bg-yellow-100 border border-yellow-300 px-3 py-1.5 rounded-2xl text-xs font-bold text-yellow-900 shadow-xs">
            <span>🪙</span> {student.coins} Koin
          </div>
        </div>

        {/* Pet Stage / Habitat Viewport */}
        <div className="bg-gradient-to-b from-amber-100 to-orange-100 border-4 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-center flex flex-col items-center justify-center min-h-[300px]">
          {/* Decorative sky clouds */}
          <div className="absolute top-4 left-6 text-2xl opacity-60">☁️</div>
          <div className="absolute top-8 right-10 text-3xl opacity-60">☁️</div>
          <div className="absolute bottom-4 left-10 text-xl opacity-70">🌱</div>
          <div className="absolute bottom-4 right-12 text-xl opacity-70">🌼</div>

          {/* Equipped Hat Floating above Pet */}
          {equippedHatObj && (
            <div className="text-4xl mb-[-12px] z-20 animate-bounceSlight">
              {equippedHatObj.icon}
            </div>
          )}

          {/* Interactive Pet Character */}
          <div
            onClick={handlePetInteract}
            className={`cursor-pointer text-8xl sm:text-9xl my-2 select-none filter drop-shadow-xl transition-transform duration-300 active:scale-90 ${
              isPetBouncing ? 'animate-bounce scale-110' : 'hover:scale-105 animate-float'
            }`}
            title="Klik untuk mengelus maskot!"
          >
            {petEmoji}
          </div>

          <div className="text-xs text-amber-800 font-bold bg-white/80 px-3 py-1 rounded-full border border-amber-200 shadow-xs flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Klik {pet.name} untuk membelainya!
          </div>

          {/* Pet Dialogue / Reaction bubble */}
          <div className="bg-white border-2 border-amber-300 rounded-2xl px-4 py-2 text-xs font-bold text-amber-950 shadow-md max-w-sm animate-fade-in">
            {petMoodMessage}
          </div>

          {/* Pet Status HUD */}
          <div className="mt-4 grid grid-cols-3 gap-3 w-full max-w-md">
            {/* Level & XP */}
            <div className="bg-white/90 rounded-2xl p-2.5 border border-amber-200 shadow-xs text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Level Pet</div>
              <div className="text-lg font-black font-fun text-amber-900">Lv. {pet.level}</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(pet.xp / pet.maxXp) * 100}%` }}
                />
              </div>
            </div>

            {/* Hunger Bar */}
            <div className="bg-white/90 rounded-2xl p-2.5 border border-amber-200 shadow-xs text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center justify-center gap-1">
                <Utensils className="w-3 h-3 text-orange-500" /> Kenyang
              </div>
              <div className="text-lg font-black font-fun text-orange-600">{pet.hunger}%</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-orange-500 h-full rounded-full"
                  style={{ width: `${pet.hunger}%` }}
                />
              </div>
            </div>

            {/* Happiness Bar */}
            <div className="bg-white/90 rounded-2xl p-2.5 border border-amber-200 shadow-xs text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 text-rose-500" /> Ceria
              </div>
              <div className="text-lg font-black font-fun text-rose-600">{pet.happiness}%</div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${pet.happiness}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Makanan vs Toko Aksesoris */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              soundFx.playPop();
              setActiveTab('care');
            }}
            className={`px-6 py-2.5 rounded-2xl font-fun font-bold text-sm flex items-center gap-2 transition ${
              activeTab === 'care'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-orange-50 border border-slate-200'
            }`}
          >
            <Utensils className="w-4 h-4" /> Dapur Makanan Pet
          </button>

          <button
            onClick={() => {
              soundFx.playPop();
              setActiveTab('shop');
            }}
            className={`px-6 py-2.5 rounded-2xl font-fun font-bold text-sm flex items-center gap-2 transition ${
              activeTab === 'shop'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-purple-50 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Toko Aksesoris & Kostum
          </button>
        </div>

        {/* Tab 1: Food Kitchen */}
        {activeTab === 'care' && (
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-fun font-bold text-base text-slate-900">
                Pilih Makanan untuk {pet.name}:
              </h3>
              <span className="text-xs text-slate-500">Makan meningkatkan rasa kenyang, kebahagiaan, dan XP!</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {foods.map((food) => (
                <div
                  key={food.id}
                  className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4 flex flex-col justify-between text-center hover:border-amber-400 transition"
                >
                  <div>
                    <div className="text-4xl mb-2">{food.icon}</div>
                    <div className="font-fun font-bold text-sm text-slate-800">{food.name}</div>
                    <p className="text-[11px] text-slate-500 my-1">{food.description}</p>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-emerald-700 my-2">
                      <span>+{food.hungerBoost}% Kenyang</span>
                      <span>•</span>
                      <span>+{food.happyBoost}% Ceria</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFeedPet(food)}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-fun font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <span>Suapi ({food.count > 0 ? `Sisa ${food.count}` : `${food.cost} 🪙`})</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Accessory Shop & Wardrobe */}
        {activeTab === 'shop' && (
          <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-fun font-bold text-base text-slate-900">
                Lemari & Toko Kostum Maskot:
              </h3>
              <span className="text-xs text-purple-700 font-semibold">
                Koinmu: <strong>{student.coins} 🪙</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {accessories.map((acc) => (
                <div
                  key={acc.id}
                  className={`border-2 rounded-2xl p-4 flex flex-col justify-between transition ${
                    acc.equipped
                      ? 'bg-purple-50 border-purple-500 shadow-sm'
                      : acc.owned
                      ? 'bg-slate-50 border-slate-300'
                      : 'bg-white border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl shadow-xs">
                      {acc.icon}
                    </div>
                    <div>
                      <div className="font-fun font-bold text-sm text-slate-800">{acc.name}</div>
                      <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
                        {acc.bonusEffect}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAccessoryAction(acc)}
                    className={`w-full py-2 rounded-xl font-fun font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95 ${
                      acc.equipped
                        ? 'bg-purple-700 text-white hover:bg-purple-800'
                        : acc.owned
                        ? 'bg-slate-700 text-white hover:bg-slate-800'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                  >
                    {acc.equipped ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Sedang Dipakai
                      </>
                    ) : acc.owned ? (
                      'Pakai Kostum'
                    ) : (
                      `Beli (${acc.cost} 🪙)`
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
