import React, { useState, useEffect } from 'react';
import { soundFx } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Rocket, Mic, MicOff, Volume2, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { voiceRecognizer, speakToChild, isSpeechRecognitionSupported } from '../../utils/speech';

interface SpellingWord {
  word: string;
  hint: string;
  category: string;
  icon: string;
  english?: string;
}

const SPELLING_WORDS: SpellingWord[] = [
  { word: 'BUKU', hint: 'Jendela ilmu pengetahuan yang kita baca setiap hari', category: 'Sekolah', icon: '📖' },
  { word: 'BINTANG', hint: 'Benda langit yang berkelap-kelip indah di malam hari', category: 'Antariksa', icon: '⭐' },
  { word: 'PLANET', hint: 'Benda langit besar yang mengelilingi matahari', category: 'Sains', icon: '🪐' },
  { word: 'ROBOT', hint: 'Mesin pintar yang diprogram untuk membantu manusia', category: 'Teknologi', icon: '🤖' },
  { word: 'KUCING', hint: 'Hewan peliharaan lucu berbulu yang suka mengeong', category: 'Hewan', icon: '🐱' },
];

export const VoiceSpellingRocket: React.FC<{
  onComplete?: (coins: number, xp: number) => void;
  onBack?: () => void;
}> = ({ onComplete, onBack }) => {
  const [wordIdx, setWordIdx] = useState(0);
  const current = SPELLING_WORDS[wordIdx];
  const targetWord = current.word;

  const [inputWord, setInputWord] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [isLaunched, setIsLaunched] = useState(false);
  const [feedback, setFeedback] = useState<string>('Ucapkan atau eja hurufnya lewat mikrofon!');

  const hasVoiceSupport = isSpeechRecognitionSupported();

  useEffect(() => {
    // pronounce word on load
    speakToChild(`Misi roket: eja kata ${targetWord}`);
  }, [wordIdx]);

  const handleLetterTap = (letter: string) => {
    soundFx.playPop();
    const nextInput = (inputWord + letter).toUpperCase();
    if (nextInput.length <= targetWord.length) {
      setInputWord(nextInput);
      checkSpelling(nextInput);
    }
  };

  const handleBackspace = () => {
    soundFx.playPop();
    setInputWord((prev) => prev.slice(0, -1));
  };

  const handleVoiceListen = () => {
    if (!hasVoiceSupport) {
      setFeedback('Fitur suara tidak didukung browser ini. Gunakan tombol huruf di bawah ya!');
      return;
    }

    if (isListening) {
      voiceRecognizer.stopListening();
      setIsListening(false);
      return;
    }

    soundFx.playVoiceListening();
    setIsListening(true);
    setFeedback('Mendengarkan suaramu... Katakan kata atau eja hurufnya sekarang!');

    voiceRecognizer.startListening({
      lang: 'id-ID',
      onResult: (transcript) => {
        setIsListening(false);
        setVoiceTranscript(transcript);

        // Normalize
        const clean = transcript.toUpperCase().replace(/[^A-Z]/g, '');
        if (clean === targetWord || clean.includes(targetWord) || targetWord.includes(clean)) {
          setInputWord(targetWord);
          triggerRocketLaunch();
        } else {
          setInputWord(clean.slice(0, targetWord.length));
          soundFx.playWrong();
          setFeedback(`Terdengar: "${transcript}". Belum tepat, coba lagi atau gunakan tombol huruf.`);
        }
      },
      onError: (err) => {
        setIsListening(false);
        setFeedback(`Mikrofon belum menangkap suara. Silakan coba lagi.`);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
  };

  const checkSpelling = (currentVal: string) => {
    if (currentVal === targetWord) {
      triggerRocketLaunch();
    } else if (!targetWord.startsWith(currentVal)) {
      soundFx.playWrong();
      setFeedback('Ups, hurufnya belum cocok. Coba hapus dan perbaiki!');
    } else {
      soundFx.playPop();
      setFeedback(`Bagus! Lanjutkan huruf berikutnya (${currentVal.length}/${targetWord.length}).`);
    }
  };

  const triggerRocketLaunch = () => {
    soundFx.playVictory();
    setIsLaunched(true);
    setFeedback(`Hebat Sekali! Kata "${targetWord}" berhasil dieja sempurna! Roket meluncur ke angkasa! 🚀✨`);
    speakToChild(`Luar biasa! Kata ${targetWord} berhasil dieja sempurna! Roket meluncur!`);
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.5 } });
  };

  const handleNextWord = () => {
    soundFx.playCoin();
    if (wordIdx < SPELLING_WORDS.length - 1) {
      setWordIdx(wordIdx + 1);
      setInputWord('');
      setIsLaunched(false);
      setVoiceTranscript('');
      setFeedback('Ucapkan atau eja kata baru ini!');
    } else {
      if (onComplete) onComplete(40, 60);
    }
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="bg-slate-900 border-4 border-indigo-400 rounded-3xl p-5 text-white shadow-2xl max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow">
            🚀
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-fun text-indigo-300 flex items-center gap-2">
              Roket Ejaan Suara & Kata
              <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '8s' }} />
            </h2>
            <p className="text-xs text-slate-300">Gunakan Mikrofon atau tombol huruf untuk menerbangkan roket kata!</p>
          </div>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold shadow"
          >
            Kembali
          </button>
        )}
      </div>

      {/* Word prompt banner */}
      <div className="bg-indigo-950/80 border-2 border-indigo-500/50 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="text-4xl p-2 bg-indigo-800/60 rounded-2xl border border-indigo-400/40">
            {current.icon}
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Kategori: {current.category} ({wordIdx + 1}/{SPELLING_WORDS.length})
            </div>
            <div className="text-lg font-bold text-white font-fun">"{current.hint}"</div>
          </div>
        </div>

        <button
          onClick={() => speakToChild(`Kata kuncinya adalah: ${targetWord}. ${current.hint}`)}
          className="px-3 py-2 bg-indigo-700 hover:bg-indigo-600 text-indigo-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
        >
          <Volume2 className="w-4 h-4 text-yellow-300" /> Dengarkan Kata
        </button>
      </div>

      {/* Rocket Launchpad View */}
      <div className="relative h-44 bg-gradient-to-b from-slate-950 to-indigo-950 rounded-2xl overflow-hidden border border-indigo-800/80 flex items-center justify-center mb-4">
        {/* Sky stars */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-4 left-10 w-1 h-1 bg-white rounded-full animate-ping" />
          <div className="absolute top-10 right-20 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse" />
          <div className="absolute bottom-6 left-1/3 w-1 h-1 bg-cyan-200 rounded-full" />
        </div>

        {/* Animated Rocket */}
        <div
          className={`flex flex-col items-center transition-all duration-1000 ${
            isLaunched ? '-translate-y-40 scale-75 opacity-90' : 'translate-y-2'
          }`}
        >
          <div className="text-6xl filter drop-shadow-[0_10px_10px_rgba(59,130,246,0.5)]">
            🚀
          </div>
          {/* Flame effect */}
          <div className={`mt-1 flex gap-1 ${isLaunched ? 'scale-150' : ''}`}>
            <span className="text-2xl animate-bounce">🔥</span>
            <span className="text-2xl animate-pulse text-amber-400">✨</span>
          </div>
        </div>

        {/* Status text */}
        <div className="absolute bottom-2 text-center text-xs text-indigo-300 bg-slate-900/80 px-3 py-1 rounded-full border border-indigo-700">
          {feedback}
        </div>
      </div>

      {/* Target letter slots */}
      <div className="flex justify-center gap-2 mb-4">
        {targetWord.split('').map((letter, idx) => {
          const filledLetter = inputWord[idx] || '';
          const isCorrect = filledLetter === letter;
          return (
            <div
              key={idx}
              className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold font-fun shadow-md transition-all ${
                filledLetter
                  ? isCorrect
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-400 text-rose-300 animate-wiggle'
                  : 'bg-slate-800 border-slate-600 text-slate-500'
              }`}
            >
              {filledLetter || '_'}
            </div>
          );
        })}
      </div>

      {/* Voice Recognition Control */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
        <button
          onClick={handleVoiceListen}
          disabled={isLaunched}
          className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-fun font-bold text-base flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:brightness-110'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 animate-spin" /> Sedang Mendengarkan... (Katakan Sekarang!)
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 text-amber-300" /> Jawab Lisan (Tekan & Ucapkan)
            </>
          )}
        </button>

        <button
          onClick={handleBackspace}
          disabled={inputWord.length === 0 || isLaunched}
          className="px-4 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-2xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-4 h-4" /> Hapus Huruf
        </button>
      </div>

      {voiceTranscript && (
        <div className="text-center text-xs text-sky-300 mb-3 bg-sky-950/40 py-1 px-3 rounded-lg border border-sky-800">
          Suara Terdeteksi: <strong className="text-sky-200">"{voiceTranscript}"</strong>
        </div>
      )}

      {/* On-screen keyboard for younger kids */}
      <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
        <div className="text-[10px] text-slate-400 font-bold mb-2 uppercase text-center">
          Atau Tekan Papan Huruf:
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 max-w-lg mx-auto">
          {alphabet.map((char) => (
            <button
              key={char}
              onClick={() => handleLetterTap(char)}
              disabled={isLaunched}
              className="w-8 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 active:scale-90 text-white text-sm font-bold font-fun border border-slate-700 shadow transition flex items-center justify-center"
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* Success Next Step */}
      {isLaunched && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleNextWord}
            className="px-6 py-3 bg-game-green text-white font-fun font-bold text-base rounded-2xl shadow-xl flex items-center gap-2 hover:brightness-110 active:scale-95 transition animate-bounce"
          >
            {wordIdx < SPELLING_WORDS.length - 1 ? (
              <>
                Lanjut ke Kata Berikutnya <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Selesaikan Misi & Ambil Hadiah 🏆
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
