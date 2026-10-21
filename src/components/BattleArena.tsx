import React, { useState, useEffect } from 'react';
import { StudentProfile, VirtualPet } from '../types/game';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Swords, Zap, Timer, Trophy, Shield, Heart, ArrowLeft, RefreshCw, Volume2 } from 'lucide-react';
import { speakToChild } from '../utils/speech';

interface BattleArenaProps {
  student: StudentProfile;
  activePet: VirtualPet;
  onFinishBattle: (coins: number, stars: number) => void;
  onBack: () => void;
}

interface BattleQuestion {
  question: string;
  options: string[];
  correct: number;
}

const BATTLE_QUESTIONS: BattleQuestion[] = [
  { question: '9 + 7 = ... ?', options: ['15', '16', '17', '18'], correct: 1 },
  { question: 'Berapakah 5 x 4?', options: ['20', '25', '15', '24'], correct: 0 },
  { question: 'Planet terdekat dari Matahari?', options: ['Bumi', 'Venus', 'Merkurius', 'Mars'], correct: 2 },
  { question: 'Lawan kata dari "BESAR"?', options: ['Tinggi', 'Kecil', 'Luas', 'Panjang'], correct: 1 },
  { question: '12 dibagi 3 = ... ?', options: ['3', '4', '5', '6'], correct: 1 },
];

export const BattleArena: React.FC<BattleArenaProps> = ({
  student,
  activePet,
  onFinishBattle,
  onBack,
}) => {
  const [matchState, setMatchState] = useState<'matchmaking' | 'fighting' | 'finished'>('matchmaking');
  const [rivalName, setRivalName] = useState<string>('Riko si Kilat (Kelas 3B)');
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [rivalHp, setRivalHp] = useState<number>(100);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(8);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState<boolean>(false);
  const [battleLog, setBattleLog] = useState<string>('Bersiap, pertandingan kuis dimulai!');

  const currentQ = BATTLE_QUESTIONS[currentRound] || BATTLE_QUESTIONS[0];

  // Matchmaking simulation
  useEffect(() => {
    if (matchState === 'matchmaking') {
      const rivals = [
        'Riko si Kilat (Kelas 3A)',
        'Siti si Teliti (Kelas 3B)',
        'Fajar si Master Sains (Kelas 3C)',
        'Nadia si Kancil (Kelas 3A)',
      ];
      setRivalName(rivals[Math.floor(Math.random() * rivals.length)]);

      const t = setTimeout(() => {
        soundFx.playVictory();
        setMatchState('fighting');
        setTimeLeft(8);
        setBattleLog('Lawan ditemukan! Siapa cepat dia menang!');
        speakToChild('Lawan ditemukan! Bersiap bertarung!');
      }, 1500);

      return () => clearTimeout(t);
    }
  }, [matchState]);

  // Round Timer countdown
  useEffect(() => {
    if (matchState !== 'fighting') return;

    if (timeLeft <= 0) {
      // Time up! Player missed
      soundFx.playWrong();
      handleTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, matchState]);

  const handleTimeExpired = () => {
    setIsAnswerLocked(true);
    setBattleLog('Waktu habis! Lawan berhasil menyerang lebih dulu!');
    setPlayerHp((prev) => Math.max(0, prev - 25));

    proceedToNextRound();
  };

  const handleAnswer = (optionIdx: number) => {
    if (isAnswerLocked) return;
    setIsAnswerLocked(true);
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === currentQ.correct;

    if (isCorrect) {
      soundFx.playCorrect();
      setBattleLog(`Serangan berhasil! ${student.name} menjawab benar dengan cepat! 💥`);
      setRivalHp((prev) => {
        const next = Math.max(0, prev - 35);
        if (next <= 0) {
          triggerVictory();
        }
        return next;
      });
    } else {
      soundFx.playWrong();
      setBattleLog(`Aduh, jawabanmu keliru! Lawan memanfaatkan peluang!`);
      setPlayerHp((prev) => {
        const next = Math.max(0, prev - 25);
        if (next <= 0) {
          triggerDefeat();
        }
        return next;
      });
    }

    proceedToNextRound();
  };

  const proceedToNextRound = () => {
    setTimeout(() => {
      if (playerHp <= 25 && rivalHp > 0) {
        triggerDefeat();
      } else if (rivalHp <= 35) {
        triggerVictory();
      } else if (currentRound < BATTLE_QUESTIONS.length - 1) {
        setCurrentRound((prev) => prev + 1);
        setTimeLeft(8);
        setIsAnswerLocked(false);
        setSelectedOption(null);
      } else {
        // End of questions
        if (playerHp >= rivalHp) {
          triggerVictory();
        } else {
          triggerDefeat();
        }
      }
    }, 1400);
  };

  const triggerVictory = () => {
    soundFx.playVictory();
    setMatchState('finished');
    confetti({ particleCount: 100, spread: 80 });
    setBattleLog('KAMU MENANG! Hebat sekali, kamu juara kelas!');
    speakToChild('Selamat! Kamu memenangkan duel kuis kelas!');
  };

  const triggerDefeat = () => {
    soundFx.playWrong();
    setMatchState('finished');
    setBattleLog('Pertandingan selesai! Lawanmu unggul kali ini, coba lagi!');
  };

  const handleRestart = () => {
    soundFx.playPop();
    setPlayerHp(100);
    setRivalHp(100);
    setCurrentRound(0);
    setTimeLeft(8);
    setIsAnswerLocked(false);
    setSelectedOption(null);
    setMatchState('matchmaking');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 py-6 pb-20">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <button
            onClick={() => {
              soundFx.playPop();
              onBack();
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Keluar
          </button>

          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-rose-500 animate-wiggle" />
            <h1 className="text-lg font-black font-fun text-rose-400">
              Live Battle Quiz Arena (WebSocket Mode)
            </h1>
          </div>

          <div className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-700 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-Time Live
          </div>
        </div>

        {/* Matchmaking Screen */}
        {matchState === 'matchmaking' && (
          <div className="bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-8 text-center space-y-4 my-8 shadow-2xl animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-4xl animate-spin" style={{ animationDuration: '4s' }}>
              ⚔️
            </div>
            <h2 className="text-2xl font-bold font-fun text-yellow-300">
              Mencari Teman Sekelas untuk Duel...
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Sistem WebSocket sedang menyambungkanmu ke duel kuis berkecepatan tinggi!
            </p>
          </div>
        )}

        {/* Active Combat Screen */}
        {matchState === 'fighting' && (
          <div className="space-y-4 animate-fade-in">
            {/* Duel Health Bars Row */}
            <div className="grid grid-cols-2 gap-4 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
              {/* Player Side */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">{student.avatar}</div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">{student.name} (Kamu)</div>
                    <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-emerald-400" /> {playerHp} HP
                    </div>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${playerHp}%` }}
                  />
                </div>
              </div>

              {/* Rival Side */}
              <div className="space-y-2 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <div>
                    <div className="text-xs font-bold text-slate-200">{rivalName}</div>
                    <div className="text-[10px] text-rose-400 font-semibold flex items-center justify-end gap-1">
                      <Heart className="w-3 h-3 fill-rose-400" /> {rivalHp} HP
                    </div>
                  </div>
                  <div className="text-2xl">🤖</div>
                </div>
                <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden border border-slate-700 flex justify-end">
                  <div
                    className="bg-gradient-to-l from-rose-500 to-red-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${rivalHp}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Timer & Battle Announcer */}
            <div className="flex items-center justify-between bg-rose-950/40 border border-rose-700/50 rounded-2xl px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-300">
                <Timer className="w-4 h-4 animate-spin text-yellow-400" style={{ animationDuration: '6s' }} />
                <span>Waktu Sisa: {timeLeft}s</span>
              </div>
              <div className="text-xs text-rose-200 font-semibold truncate max-w-xs">
                {battleLog}
              </div>
            </div>

            {/* Combat Question Card */}
            <div className="bg-slate-900 border-3 border-indigo-500/60 rounded-3xl p-6 shadow-2xl relative">
              <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2">
                Ronde {currentRound + 1} dari {BATTLE_QUESTIONS.length}
              </div>
              <h2 className="text-2xl font-black font-fun text-white mb-6">
                {currentQ.question}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correct;

                  let style = 'bg-slate-800 hover:bg-indigo-600/60 border-slate-700 text-slate-100';
                  if (isAnswerLocked) {
                    if (isCorrect) style = 'bg-emerald-600 border-emerald-400 text-white';
                    else if (isSelected && !isCorrect) style = 'bg-rose-600 border-rose-400 text-white';
                    else style = 'bg-slate-800/40 border-slate-800 text-slate-600 opacity-50';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={isAnswerLocked}
                      className={`p-4 rounded-2xl border-2 font-fun font-bold text-lg transition active:scale-95 shadow-md flex items-center justify-center ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Finished Screen */}
        {matchState === 'finished' && (
          <div className="bg-slate-900 border-4 border-amber-400 rounded-3xl p-8 text-center space-y-4 shadow-2xl animate-scale-up">
            <div className="text-7xl mb-1 animate-bounce">
              {playerHp >= rivalHp ? '🏆' : '🥈'}
            </div>
            <h2 className="text-3xl font-black font-fun text-yellow-300">
              {playerHp >= rivalHp ? 'Kemenangan Gemilang!' : 'Pertarungan Sengit!'}
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              {playerHp >= rivalHp
                ? `Hebat! Kamu berhasil mengalahkan ${rivalName} dan meraih 50 Koin Emas & 2 Bintang!`
                : `Kamu telah berjuang keras melawan ${rivalName}. Tetap semangat dan dapatkan 20 Koin partisipasi!`}
            </p>

            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={handleRestart}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-fun font-bold text-sm rounded-2xl border border-slate-700 flex items-center gap-2 transition"
              >
                <RefreshCw className="w-4 h-4" /> Cari Lawan Baru
              </button>
              <button
                onClick={() => {
                  const coinsEarned = playerHp >= rivalHp ? 50 : 20;
                  const starsEarned = playerHp >= rivalHp ? 2 : 1;
                  onFinishBattle(coinsEarned, starsEarned);
                }}
                className="px-6 py-3 bg-game-green text-white font-fun font-bold text-base rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition"
              >
                Klaim Hadiah 🪙
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
