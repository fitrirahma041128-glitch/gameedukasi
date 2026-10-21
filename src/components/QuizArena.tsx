import React, { useState, useEffect } from 'react';
import { Question, SubjectId, VirtualPet, StudentProfile } from '../types/game';
import { CURRICULUM_QUESTIONS } from '../data/curriculumData';
import { soundFx } from '../utils/audio';
import { speakToChild, voiceRecognizer, matchVoiceAnswer, isSpeechRecognitionSupported } from '../utils/speech';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Star,
  Coins,
  Zap,
  Bot,
} from 'lucide-react';

interface QuizArenaProps {
  subject: SubjectId;
  student: StudentProfile;
  activePet: VirtualPet;
  onFinishQuiz: (stats: {
    subject: SubjectId;
    correct: number;
    wrong: number;
    coins: number;
    stars: number;
    xp: number;
  }) => void;
  onBackToMap: () => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  subject,
  student,
  activePet,
  onFinishQuiz,
  onBackToMap,
}) => {
  // Filter questions by subject
  const subjectQuestions = CURRICULUM_QUESTIONS.filter((q) => q.subject === subject);
  const questionsList = subjectQuestions.length > 0 ? subjectQuestions : CURRICULUM_QUESTIONS.slice(0, 4);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questionsList[currentIndex];

  // Game state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Gamification tracking
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);

  // AI Adaptive Engine State
  const [adaptiveTier, setAdaptiveTier] = useState<'dasar' | 'menengah' | 'bintang_emas'>('menengah');
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [showAiHint, setShowAiHint] = useState(false);
  const [aiHintData, setAiHintData] = useState<{
    hint: string;
    explanation: string;
    scaffoldStep: string;
    loading: boolean;
  }>({
    hint: currentQuestion.hint,
    explanation: 'Ayo fokus dan perhatikan kata kuncinya ya!',
    scaffoldStep: currentQuestion.scaffoldStep,
    loading: false,
  });

  // Voice Recognition State
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string>('');
  const hasVoice = isSpeechRecognitionSupported();

  // Completion modal state
  const [isFinished, setIsFinished] = useState(false);

  // Read question on mount or change
  useEffect(() => {
    speakToChild(currentQuestion.question);
    setShowAiHint(false);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setVoiceFeedback('');
    setAiHintData({
      hint: currentQuestion.hint,
      explanation: 'Tetap tenang dan coba bayangkan solusinya!',
      scaffoldStep: currentQuestion.scaffoldStep,
      loading: false,
    });
  }, [currentIndex]);

  // Request real AI Hint from Express / Gemini backend
  const fetchAiHint = async () => {
    soundFx.playPop();
    setShowAiHint(true);
    setAiHintData((prev) => ({ ...prev, loading: true }));

    try {
      const res = await fetch('/api/ai-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          subject: currentQuestion.subject,
          studentGrade: student.grade,
          wrongAnswersCount: consecutiveWrong + 1,
          topic: currentQuestion.topic,
        }),
      });
      const data = await res.json();
      setAiHintData({
        hint: data.hint || currentQuestion.hint,
        explanation: data.explanation || 'Jangan takut salah, kita belajar bersama!',
        scaffoldStep: data.scaffoldStep || currentQuestion.scaffoldStep,
        loading: false,
      });
      speakToChild(data.hint || currentQuestion.hint);
    } catch (e) {
      setAiHintData({
        hint: currentQuestion.hint,
        explanation: 'Perhatikan kata kuncinya pelan-pelan ya!',
        scaffoldStep: currentQuestion.scaffoldStep,
        loading: false,
      });
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked) return;
    soundFx.playPop();
    setSelectedOption(idx);
    checkAnswer(idx);
  };

  const checkAnswer = (answerIdx: number) => {
    setIsAnswerChecked(true);
    const correct = answerIdx === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      soundFx.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrectCount((prev) => prev + 1);
      setConsecutiveWrong(0);

      // Coins & XP with streak bonus
      const coinGain = newStreak >= 3 ? 15 : 10;
      const xpGain = newStreak >= 3 ? 25 : 15;
      setEarnedCoins((prev) => prev + coinGain);
      setEarnedXp((prev) => prev + xpGain);
      setScore((prev) => prev + 100 * (newStreak >= 2 ? 1.5 : 1));

      // AI Adaptive: Elevate difficulty tier if 2 correct in row
      if (newStreak >= 2 && adaptiveTier !== 'bintang_emas') {
        setAdaptiveTier('bintang_emas');
      }

      speakToChild('Jawabanmu tepat sekali! Pintar!');
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    } else {
      soundFx.playWrong();
      setStreak(0);
      setWrongCount((prev) => prev + 1);
      const newConsecutiveWrong = consecutiveWrong + 1;
      setConsecutiveWrong(newConsecutiveWrong);

      // AI Adaptive: If 2 wrong, lower tier and trigger AI Hint automatically
      if (newConsecutiveWrong >= 2) {
        setAdaptiveTier('dasar');
        fetchAiHint();
      }

      speakToChild('Belum tepat. Lihat petunjuk Kak Boty di bawah ya!');
    }
  };

  // Voice speech answer trigger
  const handleVoiceAnswer = () => {
    if (!hasVoice) {
      setVoiceFeedback('Mikrofon belum tersedia di browser ini.');
      return;
    }

    if (isListening) {
      voiceRecognizer.stopListening();
      setIsListening(false);
      return;
    }

    soundFx.playVoiceListening();
    setIsListening(true);
    setVoiceFeedback('Mendengarkan... Katakan jawabanmu sekarang!');

    voiceRecognizer.startListening({
      lang: subject === 'english' ? 'en-US' : 'id-ID',
      onResult: (transcript) => {
        setIsListening(false);
        setVoiceFeedback(`Kamu mengucapkan: "${transcript}"`);

        // Check if spoken words match the question's voice keywords
        const isMatched = matchVoiceAnswer(transcript, currentQuestion.voiceKeywords);

        // Also check if transcript matches option texts
        let matchedOptionIdx = -1;
        currentQuestion.options.forEach((opt, idx) => {
          if (matchVoiceAnswer(transcript, [opt])) {
            matchedOptionIdx = idx;
          }
        });

        if (isMatched || matchedOptionIdx === currentQuestion.correctAnswer) {
          handleSelectOption(currentQuestion.correctAnswer);
        } else if (matchedOptionIdx !== -1) {
          handleSelectOption(matchedOptionIdx);
        } else {
          soundFx.playWrong();
          setVoiceFeedback(`Terdengar: "${transcript}". Belum cocok dengan jawaban.`);
        }
      },
      onError: (err) => {
        setIsListening(false);
        setVoiceFeedback('Suara belum jelas terdengar. Coba lagi atau tekan pilihan jawaban.');
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
  };

  const handleNextQuestion = () => {
    soundFx.playPop();
    if (currentIndex < questionsList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Quiz completed!
      soundFx.playVictory();
      setIsFinished(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-emerald-50 to-teal-50 px-4 sm:px-6 py-6 pb-20">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Top Progress & HUD */}
        <div className="bg-white/95 rounded-2xl p-4 border-2 border-emerald-200 shadow-sm flex items-center justify-between gap-3">
          <button
            onClick={() => {
              soundFx.playPop();
              onBackToMap();
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition"
          >
            ← Peta
          </button>

          {/* Question progress */}
          <div className="flex-1 max-w-xs mx-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
              <span>Soal {currentIndex + 1} dari {questionsList.length}</span>
              <span className="text-emerald-700">{Math.round(((currentIndex + 1) / questionsList.length) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questionsList.length) * 100}%` }}
              />
            </div>
          </div>

          {/* AI Adaptive Tier Badge */}
          <div className="flex items-center gap-1.5">
            {adaptiveTier === 'bintang_emas' && (
              <span className="px-2.5 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-black flex items-center gap-1 animate-pulse">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Tantangan Emas (Bonus XP!)
              </span>
            )}
            {adaptiveTier === 'menengah' && (
              <span className="px-2.5 py-1 bg-sky-100 border border-sky-300 text-sky-900 rounded-xl text-xs font-bold">
                Tingkat Standar
              </span>
            )}
            {adaptiveTier === 'dasar' && (
              <span className="px-2.5 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold">
                Tingkat Bimbingan
              </span>
            )}
          </div>
        </div>

        {/* Mascot & Streak Alert */}
        <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3 sm:p-4 rounded-2xl shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl animate-bounceSlight">
              {activePet.type === 'dino' ? '🦖' : activePet.type === 'cat' ? '🐱' : activePet.type === 'owl' ? '🦉' : '🐻'}
            </div>
            <div>
              <div className="font-fun font-bold text-sm">
                {activePet.name} Menemanimu!
              </div>
              <div className="text-[11px] text-emerald-100">
                Topik: <span className="font-semibold">{currentQuestion.topic}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {streak >= 2 && (
              <div className="flex items-center gap-1 bg-amber-400 text-slate-900 px-2.5 py-1 rounded-xl text-xs font-black shadow-xs animate-bounce">
                <Zap className="w-4 h-4 fill-slate-900" /> {streak}x Kombo!
              </div>
            )}
            <div className="flex items-center gap-1 text-xs font-bold bg-white/10 px-2.5 py-1 rounded-xl">
              <Coins className="w-4 h-4 text-amber-300" /> +{earnedCoins}
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-emerald-200 shadow-xl relative">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-center text-3xl shadow-xs">
              {currentQuestion.visualIcon || '💡'}
            </div>

            <button
              onClick={() => speakToChild(currentQuestion.question)}
              className="p-2.5 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-2xl transition shadow-xs flex items-center gap-1.5 text-xs font-bold"
              title="Dengarkan Soal (TTS)"
            >
              <Volume2 className="w-4 h-4" /> Baca Soal
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-fun text-slate-800 leading-snug mb-6">
            {currentQuestion.question}
          </h2>

          {/* Voice Recognition Answering Bar */}
          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border-2 border-sky-200 rounded-2xl p-3.5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-9 h-9 bg-sky-500 text-white rounded-xl flex items-center justify-center shadow-xs">
                🎙️
              </div>
              <div>
                <div className="text-xs font-bold text-sky-900">
                  Fitur Canggih: Jawab Lewat Suara (Voice Speech)
                </div>
                <div className="text-[11px] text-slate-500">
                  {voiceFeedback || 'Tekan mikrofon & ucapkan kata atau angka jawabanmu!'}
                </div>
              </div>
            </div>

            <button
              onClick={handleVoiceAnswer}
              disabled={isAnswerChecked}
              className={`px-4 py-2.5 rounded-xl font-fun font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition active:scale-95 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-sky-600 hover:bg-sky-500 text-white'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" /> Mendengarkan...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" /> Ucapkan Jawaban
                </>
              )}
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isThisCorrect = idx === currentQuestion.correctAnswer;

              let btnStyle = 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-slate-800';

              if (isAnswerChecked) {
                if (isThisCorrect) {
                  btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-101 ring-2 ring-emerald-300';
                } else if (isSelected && !isThisCorrect) {
                  btnStyle = 'bg-rose-500 border-rose-600 text-white shadow-md';
                } else {
                  btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerChecked}
                  className={`p-4 rounded-2xl border-2 text-left font-fun font-bold text-base transition-all flex items-center justify-between shadow-xs active:scale-98 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black border ${
                        isSelected || (isAnswerChecked && isThisCorrect)
                          ? 'bg-white/20 border-white/40 text-current'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswerChecked && isThisCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  )}
                  {isAnswerChecked && isSelected && !isThisCorrect && (
                    <XCircle className="w-5 h-5 text-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* AI Tutor Hint Panel ("Bantuan Ajaib Kak Boty") */}
          {(!isAnswerChecked || !isCorrect) && (
            <div className="mb-4">
              {!showAiHint ? (
                <button
                  onClick={fetchAiHint}
                  className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 border-2 border-dashed border-amber-300 text-amber-800 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Bot className="w-4 h-4 text-amber-600" />
                  Butuh Bantuan? Tanya "Kak Boty" si AI Cilik! 💡
                </button>
              ) : (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-sm animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-fun font-bold text-amber-900 text-sm">
                      <span className="text-xl">🤖</span> Bantuan Ajaib Kak Boty (AI Tutor)
                    </div>
                    <button
                      onClick={() => speakToChild(`${aiHintData.hint}. ${aiHintData.scaffoldStep}`)}
                      className="p-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg text-xs"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-amber-900 font-medium mb-2 leading-relaxed">
                    "{aiHintData.hint}"
                  </p>

                  <div className="bg-white/80 rounded-xl p-2.5 text-[11px] text-amber-950 border border-amber-200">
                    <strong>Langkah Pikir:</strong> {aiHintData.scaffoldStep}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Feedback & Next Button */}
          {isAnswerChecked && (
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm font-semibold text-slate-700">
                {isCorrect ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
                    Hebat! {currentQuestion.funFact || 'Jawabanmu benar dan tepat!'}
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold flex items-center gap-1.5">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Jangan menyerah, kamu pasti bisa di soal berikutnya!
                  </span>
                )}
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-8 py-3.5 btn-game-green text-white font-fun font-bold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition"
              >
                {currentIndex < questionsList.length - 1 ? (
                  <>
                    Lanjut ke Soal Berikutnya <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Lihat Hasil & Rawat Pet! 🏆
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Completion Modal */}
      {isFinished && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border-4 border-amber-300 shadow-2xl p-6 sm:p-8 text-center animate-scale-up">
            <div className="text-6xl mb-2 animate-bounce">🏆</div>
            <h2 className="text-2xl sm:text-3xl font-black font-fun text-slate-900">
              Misi Kuis Selesai!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-4">
              Kamu telah menyelesaikan tantangan materi dengan cemerlang!
            </p>

            {/* Stars rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-10 h-10 ${
                    starIdx <= (correctCount >= 3 ? 3 : correctCount >= 2 ? 2 : 1)
                      ? 'text-yellow-400 fill-yellow-400 animate-bounce'
                      : 'text-slate-200 fill-slate-200'
                  }`}
                />
              ))}
            </div>

            {/* Rewards Card */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6 grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-xs text-slate-500 font-bold">Benar</div>
                <div className="text-xl font-black font-fun text-emerald-600">
                  {correctCount}/{questionsList.length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 font-bold">Koin Dapat</div>
                <div className="text-xl font-black font-fun text-amber-600 flex items-center justify-center gap-1">
                  <span>🪙</span> +{earnedCoins}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 font-bold">XP Pet</div>
                <div className="text-xl font-black font-fun text-indigo-600">
                  +{earnedXp}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onFinishQuiz({
                    subject,
                    correct: correctCount,
                    wrong: wrongCount,
                    coins: earnedCoins,
                    stars: correctCount >= 3 ? 3 : 2,
                    xp: earnedXp,
                  });
                }}
                className="w-full py-3.5 btn-game-green text-white font-fun font-bold text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:scale-102 active:scale-98 transition"
              >
                Klaim Hadiah & Beri Makan Maskot! 🐾
              </button>

              <button
                onClick={onBackToMap}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-fun font-bold text-xs rounded-xl transition"
              >
                Kembali ke Peta Petualangan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
