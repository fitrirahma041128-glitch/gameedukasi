import React, { useState } from 'react';
import { soundFx } from '../utils/audio';
import { Sparkles, Play, Award, Mic, Brain, Heart, Swords, BarChart3, ChevronRight, CheckCircle2, Shield, Users, Volume2 } from 'lucide-react';
import { speakToChild } from '../utils/speech';

interface LandingPageProps {
  onStartAdventure: () => void;
  onOpenTeacherDashboard: () => void;
  onSelectPet: () => void;
  onTryCanvasGame: (gameType: 'solar' | 'pizza' | 'rocket') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAdventure,
  onOpenTeacherDashboard,
  onSelectPet,
  onTryCanvasGame,
}) => {
  // Quick interactive preview mini-challenge on the landing page!
  const [quickAnswer, setQuickAnswer] = useState<number | null>(null);
  const [quickStatus, setQuickStatus] = useState<string>('Pilih jawaban yang benar di bawah ini!');

  const handleQuickQuestion = (ans: number) => {
    setQuickAnswer(ans);
    if (ans === 16) {
      soundFx.playCorrect();
      setQuickStatus('Luar Biasa! Jawabanmu 100% Benar! 🎉 8 + 8 = 16!');
      speakToChild('Luar biasa! Jawabanmu benar!');
    } else {
      soundFx.playWrong();
      setQuickStatus('Hampir benar! Coba hitung lagi: 8 ditambah 8.');
      speakToChild('Coba lagi ya!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50/40 to-sky-50 pb-20 text-slate-800">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white text-xs font-bold py-2 px-4 text-center shadow-xs flex items-center justify-center gap-2">
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] animate-pulse">BARU</span>
        <span>🌟 Platform Game Edukasi SD Berbasis AI, Voice Recognition & Kurikulum Merdeka!</span>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-10 sm:pt-16 pb-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/80 border border-emerald-300 rounded-full text-emerald-800 text-xs sm:text-sm font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              Petualangan Belajar Masa Depan untuk Siswa SD
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-fun tracking-tight text-slate-900 leading-[1.15]">
              Belajar Jadi Seru Seperti Main Game di{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                EduPet Island!
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Gabungan canggih antara <strong>Kuis Adaptif AI</strong> yang menyesuaikan kemampuan anak,{' '}
              <strong>Voice Recognition</strong> untuk menjawab lisan lewat suara mic, tantangan{' '}
              <strong>Mini-Game Canvas Interaktif</strong>, serta <strong>Maskot Peliharaan Virtual</strong> yang tumbuh saat kamu belajar!
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => {
                  soundFx.playPop();
                  onStartAdventure();
                }}
                className="btn-game-green text-white px-8 py-4 rounded-2xl font-fun font-bold text-lg sm:text-xl shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition"
              >
                <Play className="w-6 h-6 fill-white" />
                Mulai Berpetualang Sekarang! 🚀
              </button>

              <button
                onClick={() => {
                  soundFx.playPop();
                  onOpenTeacherDashboard();
                }}
                className="px-6 py-4 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 rounded-2xl font-fun font-bold text-base shadow-md flex items-center gap-2 transition hover:border-indigo-400"
              >
                <Shield className="w-5 h-5 text-indigo-600" />
                Mode Guru & Orang Tua
              </button>
            </div>

            {/* Highlights pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bebas Iklan & Ramah Anak SD
              </span>
              <span className="flex items-center gap-1 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dukung Kelas 1 - 6 SD
              </span>
              <span className="flex items-center gap-1 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Berbasis Web Tanpa Instalasi
              </span>
            </div>
          </div>

          {/* Right Visual: Interactive Live Game Preview Widget */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md bg-white border-4 border-amber-300 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                COBA LANGSUNG!
              </div>

              {/* Mini Mascot Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-amber-100 border-2 border-amber-400 rounded-2xl flex items-center justify-center text-3xl shadow-sm animate-wiggle">
                  🦖
                </div>
                <div>
                  <div className="font-fun font-bold text-slate-900 text-base">Ciko si Dino Cilik</div>
                  <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Sahabat Belajar Siap Membantu
                  </div>
                </div>
              </div>

              {/* Sample Question Box */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 mb-4 text-center">
                <div className="text-xs text-slate-500 font-bold mb-1">Tantangan Cepat Kelas 2-3 SD</div>
                <div className="text-xl font-black font-fun text-slate-800 mb-2">
                  Berapakah hasil dari 8 + 8?
                </div>
                <div className="text-xs font-semibold text-emerald-700 min-h-6">
                  {quickStatus}
                </div>
              </div>

              {/* Quick Choice Buttons */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {[14, 16, 18].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleQuickQuestion(num)}
                    className={`py-3 rounded-2xl font-fun font-bold text-lg border-2 transition active:scale-95 shadow-sm ${
                      quickAnswer === num
                        ? num === 16
                          ? 'bg-emerald-500 text-white border-emerald-600 scale-105'
                          : 'bg-rose-500 text-white border-rose-600'
                        : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {/* Quick Canvas Launchers */}
              <div className="border-t border-slate-200 pt-3">
                <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider text-center">
                  Coba Mini-Game Interaktif:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onTryCanvasGame('solar')}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold font-fun border border-slate-700 flex flex-col items-center gap-1 transition"
                  >
                    <span>🪐</span>
                    <span className="text-[10px]">Tata Surya</span>
                  </button>
                  <button
                    onClick={() => onTryCanvasGame('pizza')}
                    className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold font-fun shadow-sm flex flex-col items-center gap-1 transition"
                  >
                    <span>🍕</span>
                    <span className="text-[10px]">Pizza Pecahan</span>
                  </button>
                  <button
                    onClick={() => onTryCanvasGame('rocket')}
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold font-fun shadow-sm flex flex-col items-center gap-1 transition"
                  >
                    <span>🚀</span>
                    <span className="text-[10px]">Ejaan Suara</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Cutting-Edge Features Grid */}
      <section className="px-4 sm:px-6 py-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold mb-2">
            TEKNOLOGI MUTAKHIR & RAMAH ANAK
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-fun text-slate-900">
            6 Fitur Unggulan yang Membuat Belajar Menyenangkan
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Dirancang khusus untuk memicu rasa ingin tahu alami siswa SD dengan mekanisme permainan terkini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: AI Adaptive */}
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-md hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
              🧠
            </div>
            <h3 className="text-xl font-bold font-fun text-slate-900 mb-2">
              1. AI Adaptive Difficulty
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Soal tidak statis. Sistem otomatis mendeteksi performa anak. Jika salah 2x, sistem menurunkan tingkat kesulitan dan memberikan panduan visual langkah demi langkah ("Bantuan Kak Boty").
            </p>
          </div>

          {/* Card 2: Voice Recognition */}
          <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-md hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
              🎙️
            </div>
            <h3 className="text-xl font-bold font-fun text-slate-900 mb-2">
              2. Voice Recognition (Ucapkan & Jawab)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Siswa dapat menjawab soal matematika, mengeja kosa kata, dan melatih pelafalan bahasa Inggris dengan berbicara langsung ke mikrofon peramban menggunakan Web Speech API.
            </p>
          </div>

          {/* Card 3: Virtual Pet Companion */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-100 shadow-md hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
              🐾
            </div>
            <h3 className="text-xl font-bold font-fun text-slate-900 mb-2">
              3. Maskot Peliharaan Virtual (Pet)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Setiap siswa memiliki peliharaan digital (Dino, Kucing, Burung, Beruang) yang bisa diberi makan, dirawat, dan didandani kostum keren dari koin hasil menjawab soal dengan benar!
            </p>
          </div>

          {/* Card 4: Canvas Mini Games */}
          <div className="bg-white rounded-3xl p-6 border-2 border-purple-100 shadow-md hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
              🪐
            </div>
            <h3 className="text-xl font-bold font-fun text-slate-900 mb-2">
              4. Interactive Canvas Games
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mini-game sains dan matematika berbasis HTML5 Canvas yang imersif: drag & drop planet ke orbit tata surya, memotong loyang pizza pecahan, hingga roket peluncur kata.
            </p>
          </div>

          {/* Card 5: Live Battle Arena */}
          <div className="bg-white rounded-3xl p-6 border-2 border-rose-100 shadow-md hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
              ⚔️
            </div>
            <h3 className="text-xl font-bold font-fun text-slate-900 mb-2">
              5. Live Battle / Duel Kuis Kelas
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Adu cepat menjawab kuis seru melawan teman sekelas dengan sinkronisasi waktu nyata, bar nyawa duel, dan efek combo streak yang menegangkan namun mendidik.
            </p>
          </div>

          {/* Card 6: Parent/Teacher Analytics */}
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-md hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
              📊
            </div>
            <h3 className="text-xl font-bold font-fun text-slate-900 mb-2">
              6. Analitik Pintar Guru & Orang Tua
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dilengkapi grafik radar penguasaan materi (Learning Analytics), diagnosis topik yang perlu bimbingan khusus, rapor belajar siap cetak, serta arsitektur database lengkap.
            </p>
          </div>
        </div>
      </section>

      {/* Role Selection Showcase */}
      <section className="px-4 sm:px-6 py-10 max-w-5xl mx-auto">
        <div className="bg-gradient-to-tr from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="px-3 py-1 bg-emerald-500/40 border border-emerald-300/40 rounded-full text-xs font-bold uppercase tracking-wider">
              Siap Belajar & Bermain?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-fun">
              Pilih Akses Masuk Kamu Sekarang
            </h3>
            <p className="text-emerald-100 text-sm max-w-lg">
              Masuk sebagai Siswa Petualang Cilik untuk mulai menjelajah pulau materi, atau masuk sebagai Guru & Orang Tua untuk memantau kemajuan belajar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                soundFx.playPop();
                onSelectPet();
              }}
              className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-fun font-bold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition"
            >
              <span>🎒</span> Masuk Sebagai Siswa
            </button>
            <button
              onClick={() => {
                soundFx.playPop();
                onOpenTeacherDashboard();
              }}
              className="px-6 py-3.5 bg-white/20 hover:bg-white/30 text-white font-fun font-bold text-base rounded-2xl border border-white/40 shadow-sm flex items-center justify-center gap-2 transition"
            >
              <Shield className="w-5 h-5 text-yellow-300" /> Masuk Guru / Ortu
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
