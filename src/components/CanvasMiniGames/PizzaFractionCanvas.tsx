import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Pizza, Sparkles, Check, RotateCcw, Volume2 } from 'lucide-react';
import { speakToChild } from '../../utils/speech';

interface FractionTarget {
  targetNumerator: number;
  targetDenominator: number;
  label: string;
  topping: string;
  toppingIcon: string;
}

const FRACTION_MISSIONS: FractionTarget[] = [
  { targetNumerator: 1, targetDenominator: 2, label: '1/2 (Setengah)', topping: 'Keju Leleh', toppingIcon: '🧀' },
  { targetNumerator: 3, targetDenominator: 4, label: '3/4 (Tiga Perempat)', topping: 'Pepperoni Sapi', toppingIcon: '🍕' },
  { targetNumerator: 2, targetDenominator: 4, label: '2/4 (Dua Perempat / Setengah)', topping: 'Jamur Gurih', toppingIcon: '🍄' },
  { targetNumerator: 5, targetDenominator: 8, label: '5/8 (Lima Perdelapan)', topping: 'Paprika Renyah', toppingIcon: '🫑' },
];

export const PizzaFractionCanvas: React.FC<{
  onComplete?: (coins: number, xp: number) => void;
  onBack?: () => void;
}> = ({ onComplete, onBack }) => {
  const [missionIndex, setMissionIndex] = useState(0);
  const currentMission = FRACTION_MISSIONS[missionIndex];

  const totalSlices = currentMission.targetDenominator;
  const [selectedSlices, setSelectedSlices] = useState<number[]>([]);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState(false);
  const [message, setMessage] = useState<string>(
    `Klik pada ${currentMission.targetNumerator} dari ${currentMission.targetDenominator} irisan untuk membuat pecahan ${currentMission.label}!`
  );

  const toggleSlice = (idx: number) => {
    soundFx.playPop();
    let updated: number[];
    if (selectedSlices.includes(idx)) {
      updated = selectedSlices.filter((i) => i !== idx);
    } else {
      updated = [...selectedSlices, idx];
    }
    setSelectedSlices(updated);

    const count = updated.length;
    if (count === currentMission.targetNumerator) {
      soundFx.playCorrect();
      setIsAnsweredCorrectly(true);
      setMessage(`Sempurna! Kamu telah memilih ${count}/${totalSlices} irisan! 🍕🎉`);
      speakToChild(`Hebat! Pecahan ${currentMission.label} berhasil dibuat.`);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else if (count > currentMission.targetNumerator) {
      setMessage(`Kelebihan irisan! Targetmu adalah ${currentMission.targetNumerator}/${totalSlices}. Klik irisan untuk membatalkan.`);
    } else {
      setIsAnsweredCorrectly(false);
      setMessage(`Baru ${count}/${totalSlices} irisan. Tambah ${currentMission.targetNumerator - count} lagi ya!`);
    }
  };

  const handleNextMission = () => {
    soundFx.playCoin();
    if (missionIndex < FRACTION_MISSIONS.length - 1) {
      setMissionIndex(missionIndex + 1);
      setSelectedSlices([]);
      setIsAnsweredCorrectly(false);
      const next = FRACTION_MISSIONS[missionIndex + 1];
      setMessage(`Misi Baru: Buat pecahan ${next.label} dengan memilih ${next.targetNumerator} irisan!`);
    } else {
      soundFx.playVictory();
      confetti({ particleCount: 100, spread: 80 });
      if (onComplete) onComplete(35, 50);
    }
  };

  const handleReset = () => {
    soundFx.playPop();
    setSelectedSlices([]);
    setIsAnsweredCorrectly(false);
    setMessage(`Klik ${currentMission.targetNumerator} dari ${currentMission.targetDenominator} irisan!`);
  };

  // Generate SVG slice path for pizza
  const radius = 120;
  const cx = 150;
  const cy = 150;

  const renderSlices = () => {
    const angleStep = (2 * Math.PI) / totalSlices;

    return Array.from({ length: totalSlices }).map((_, idx) => {
      const startAngle = idx * angleStep - Math.PI / 2;
      const endAngle = (idx + 1) * angleStep - Math.PI / 2;

      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);

      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
      const isSelected = selectedSlices.includes(idx);

      // Center of the slice for topping icon
      const midAngle = startAngle + angleStep / 2;
      const iconX = cx + (radius * 0.6) * Math.cos(midAngle);
      const iconY = cy + (radius * 0.6) * Math.sin(midAngle);

      return (
        <g key={idx} onClick={() => toggleSlice(idx)} className="cursor-pointer transition-transform duration-200 hover:opacity-90">
          <path
            d={pathData}
            fill={isSelected ? '#f97316' : '#fef08a'}
            stroke="#b45309"
            strokeWidth="3"
            className="transition-colors duration-200"
          />
          {/* Crust edge */}
          <path
            d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
            stroke="#9a3412"
            strokeWidth="8"
            fill="none"
          />
          {/* Slice number or topping icon */}
          <text
            x={iconX}
            y={iconY + 5}
            textAnchor="middle"
            fill={isSelected ? '#ffffff' : '#78350f'}
            fontSize={isSelected ? '18' : '14'}
            fontWeight="bold"
            fontFamily="Fredoka, sans-serif"
          >
            {isSelected ? currentMission.toppingIcon : `${idx + 1}`}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="bg-amber-50 border-4 border-amber-400 rounded-3xl p-5 text-slate-800 shadow-2xl max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow">
            🍕
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-fun text-orange-600 flex items-center gap-2">
              Dapur Pecahan Pizza Lezat
              <Sparkles className="w-5 h-5 text-amber-500 animate-bounce" />
            </h2>
            <p className="text-xs text-slate-600">Pelajari konsep pecahan matematika secara visual dan interaktif!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-300 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Ulang
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow"
            >
              Kembali
            </button>
          )}
        </div>
      </div>

      {/* Target Mission Alert */}
      <div className="bg-white border-2 border-orange-300 rounded-2xl p-3 mb-4 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl font-bold text-orange-600">
            {currentMission.targetNumerator}/{currentMission.targetDenominator}
          </div>
          <div>
            <div className="text-xs text-orange-500 font-bold uppercase tracking-wider">
              Tantangan Level {missionIndex + 1} dari {FRACTION_MISSIONS.length}
            </div>
            <div className="text-sm font-semibold text-slate-800">{message}</div>
          </div>
        </div>
        <button
          onClick={() => speakToChild(message)}
          className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Visual Pizza Display */}
      <div className="flex flex-col items-center justify-center bg-orange-100/60 rounded-3xl p-6 border-2 border-dashed border-orange-300 mb-4">
        <svg width="300" height="300" viewBox="0 0 300 300" className="drop-shadow-xl select-none">
          {/* Pizza plate */}
          <circle cx={cx} cy={cy} r={radius + 14} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="4" />
          {/* Render individual slices */}
          {renderSlices()}
          {/* Center decorative cut */}
          <circle cx={cx} cy={cy} r="10" fill="#b45309" />
        </svg>

        {/* Live fraction indicator */}
        <div className="mt-4 flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-orange-200">
          <div className="text-xs font-bold text-slate-500">Pecahan Kamu:</div>
          <div className="flex items-center gap-1 font-fun text-xl font-bold">
            <span className={`px-2 py-0.5 rounded-lg ${selectedSlices.length === currentMission.targetNumerator ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
              {selectedSlices.length}
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-700">{totalSlices}</span>
          </div>
          {isAnsweredCorrectly && (
            <span className="text-xs font-bold bg-emerald-500 text-white px-2 py-1 rounded-full flex items-center gap-1 animate-bounce">
              <Check className="w-3 h-3" /> Tepat!
            </span>
          )}
        </div>
      </div>

      {/* Next Step / Complete */}
      {isAnsweredCorrectly && (
        <div className="flex justify-center">
          <button
            onClick={handleNextMission}
            className="px-6 py-3 bg-game-green text-white font-fun font-bold text-base rounded-2xl shadow-lg flex items-center gap-2 hover:brightness-110 active:scale-95 transition"
          >
            {missionIndex < FRACTION_MISSIONS.length - 1 ? 'Lanjut ke Tantangan Berikutnya ➔' : 'Selesai & Kumpulkan Bintang ⭐'}
          </button>
        </div>
      )}
    </div>
  );
};
