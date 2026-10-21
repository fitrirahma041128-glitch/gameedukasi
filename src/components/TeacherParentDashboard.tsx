import React, { useState } from 'react';
import { StudentProfile, SubjectMastery } from '../types/game';
import { INITIAL_MASTERY } from '../data/curriculumData';
import { soundFx } from '../utils/audio';
import {
  Shield,
  Lock,
  Unlock,
  BarChart3,
  TrendingUp,
  Brain,
  Database,
  Code2,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  FileText,
  Clock,
  Award,
} from 'lucide-react';

interface TeacherParentDashboardProps {
  student: StudentProfile;
  onBackToApp: () => void;
}

export const TeacherParentDashboard: React.FC<TeacherParentDashboardProps> = ({
  student,
  onBackToApp,
}) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true); // default open or quick PIN
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'report' | 'architecture'>('analytics');

  const [masteryData] = useState<SubjectMastery[]>(INITIAL_MASTERY);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === '') {
      soundFx.playCorrect();
      setIsUnlocked(true);
      setPinError('');
    } else {
      soundFx.playWrong();
      setPinError('PIN salah! Coba gunakan PIN default: 1234');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20 px-4 sm:px-6 pt-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playPop();
                onBackToApp();
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-indigo-600" />
                <h1 className="text-xl sm:text-2xl font-black font-fun text-slate-900">
                  Dashboard Guru & Orang Tua
                </h1>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[11px] font-bold rounded-full">
                  SD Pintar Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pantau grafik penguasaan materi anak, rekomendasi AI, dan cetak rapor belajar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-500" /> Cetak Rapor
            </button>

            <button
              onClick={() => setIsUnlocked(!isUnlocked)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              {isUnlocked ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-rose-500" />}
              {isUnlocked ? 'Terbuka' : 'Terkunci'}
            </button>
          </div>
        </div>

        {/* PIN Screen if Locked */}
        {!isUnlocked && (
          <div className="bg-white rounded-3xl max-w-md mx-auto p-8 border-2 border-indigo-200 shadow-xl text-center space-y-4 my-10 animate-fade-in">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto">
              🔒
            </div>
            <h2 className="text-2xl font-bold font-fun text-slate-900">
              Proteksi Khusus Orang Tua / Guru
            </h2>
            <p className="text-xs text-slate-500">
              Masukkan PIN pengaman untuk melihat detail capaian akademik anak.
              <br />
              (PIN Default: <strong>1234</strong>)
            </p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan 4 Angka PIN"
                className="w-full text-center text-2xl tracking-widest font-mono py-2.5 rounded-xl border-2 border-slate-300 focus:border-indigo-500 outline-none"
              />
              {pinError && <div className="text-xs text-rose-600 font-bold">{pinError}</div>}
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-fun font-bold text-sm rounded-xl shadow-md transition"
              >
                Buka Dashboard Analitik
              </button>
            </form>
          </div>
        )}

        {/* Main Dashboard Content when Unlocked */}
        {isUnlocked && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-2">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-5 py-3 font-fun font-bold text-sm border-b-2 flex items-center gap-2 transition ${
                  activeTab === 'analytics'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" /> Grafik Penguasaan Materi (Learning Analytics)
              </button>

              <button
                onClick={() => setActiveTab('report')}
                className={`px-5 py-3 font-fun font-bold text-sm border-b-2 flex items-center gap-2 transition ${
                  activeTab === 'report'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" /> Rapor Kemajuan Siswa
              </button>

              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-5 py-3 font-fun font-bold text-sm border-b-2 flex items-center gap-2 transition ${
                  activeTab === 'architecture'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Database className="w-4 h-4" /> Arsitektur Database & API
              </button>
            </div>

            {/* TAB 1: LEARNING ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Student Overview Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                    <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-500" /> Waktu Belajar Minggu Ini
                    </div>
                    <div className="text-2xl font-black font-fun text-slate-800 mt-1">4.5 Jam</div>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1">↑ +22% dari minggu lalu</div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                    <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-500" /> Rata-Rata Akurasi
                    </div>
                    <div className="text-2xl font-black font-fun text-slate-800 mt-1">82.4%</div>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1">Tingkat Mahir Fase B</div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                    <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" /> Total Soal Selesai
                    </div>
                    <div className="text-2xl font-black font-fun text-slate-800 mt-1">65 Soal</div>
                    <div className="text-[11px] text-slate-500 mt-1">5 Mata Pelajaran</div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                    <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-purple-500" /> Indeks AI Adaptive
                    </div>
                    <div className="text-2xl font-black font-fun text-purple-700 mt-1">Tier 3</div>
                    <div className="text-[11px] text-purple-600 font-semibold mt-1">Tantangan Emas Aktif</div>
                  </div>
                </div>

                {/* Subject Mastery Progress Bars */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-fun font-bold text-lg text-slate-900">
                        Penguasaan Mata Pelajaran (Kurikulum Merdeka SD)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tingkat keberhasilan pemecahan masalah berdasarkan kuis adaptif.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-400">Target Semester: 80%</span>
                  </div>

                  <div className="space-y-4">
                    {masteryData.map((item) => (
                      <div key={item.subject} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-800 font-fun text-sm">{item.name}</span>
                          <span className="text-slate-600">{item.masteryPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${item.masteryPercentage}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Selesai: {item.quizzesCompleted} tantangan</span>
                          <span>
                            Kekuatan: <strong className="text-emerald-700">{item.strengthAreas[0]}</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Predictive Learning Diagnostics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths card */}
                  <div className="bg-emerald-50/70 border-2 border-emerald-200 rounded-3xl p-6 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-900 font-fun font-bold text-base">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Topik yang Paling Dikuasai Anak (Kekuatan)
                    </div>
                    <p className="text-xs text-emerald-800">
                      Siswa {student.name} menunjukkan kecepatan dan akurasi tinggi pada topik berikut:
                    </p>
                    <ul className="space-y-2 text-xs font-semibold text-emerald-900">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <strong>Matematika:</strong> Penjumlahan cepat dan bangun datar (Akurasi 94%)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <strong>Sains / IPAS:</strong> Pengenalan planet tata surya (Akurasi 90%)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <strong>Bahasa Indonesia:</strong> Pemahaman antonim dan ejaan vokal (Akurasi 95%)
                      </li>
                    </ul>
                  </div>

                  {/* Areas needing practice */}
                  <div className="bg-amber-50/70 border-2 border-amber-200 rounded-3xl p-6 space-y-3">
                    <div className="flex items-center gap-2 text-amber-900 font-fun font-bold text-base">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      Topik yang Membutuhkan Bimbingan (Rekomendasi AI)
                    </div>
                    <p className="text-xs text-amber-800">
                      Sistem AI mendeteksi beberapa keraguan pada konsep berikut:
                    </p>
                    <ul className="space-y-2 text-xs font-semibold text-amber-900">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <strong>Matematika:</strong> Konsep pecahan senilai (Disarankan latihan pizza visual)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <strong>English:</strong> Pengucapan lisan kata berakhiran konsonan ganda
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <strong>Sains:</strong> Perbedaan metamorfosis sempurna vs tidak sempurna
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PRINTABLE REPORT */}
            {activeTab === 'report' && (
              <div className="bg-white rounded-3xl p-8 border border-slate-300 shadow-lg space-y-6 print:shadow-none print:border-none">
                <div className="text-center border-b-2 border-slate-200 pb-4">
                  <h2 className="text-2xl font-black font-fun text-slate-900">
                    LAPORAN HASIL BELAJAR & GAMIFIKASI SISWA SD
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Platform Pembelajaran Cerdas EduPet Island • Kurikulum Merdeka
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl text-xs">
                  <div>
                    <span className="text-slate-400">Nama Siswa:</span>
                    <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Tingkat Kelas:</span>
                    <div className="font-bold text-slate-900 text-sm">Kelas {student.grade} SD</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Maskot Peliharaan:</span>
                    <div className="font-bold text-slate-900 text-sm">Dino Ciko (Lv. 2)</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Bintang Prestasi:</span>
                    <div className="font-bold text-amber-600 text-sm">{student.stars} ⭐ Bintang Emas</div>
                  </div>
                </div>

                {/* Subject Summary Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-3">Mata Pelajaran</th>
                        <th className="p-3">Penguasaan</th>
                        <th className="p-3">Predikat</th>
                        <th className="p-3">Catatan Pembimbing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {masteryData.map((m) => (
                        <tr key={m.subject}>
                          <td className="p-3 font-bold text-slate-900">{m.name}</td>
                          <td className="p-3 font-semibold">{m.masteryPercentage}%</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              {m.masteryPercentage >= 85 ? 'Sangat Baik' : 'Baik'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600">
                            Menguasai {m.strengthAreas.join(', ')}.
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
                  <div>Dicetak secara otomatis oleh EduPet Learning Analytics Engine</div>
                  <div className="font-bold text-slate-800">Tanda Tangan Guru / Wali Kelas: ________________</div>
                </div>
              </div>
            )}

            {/* TAB 3: DATABASE ARCHITECTURE & API BLUEPRINT */}
            {activeTab === 'architecture' && (
              <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/50 shadow-2xl space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold mb-2">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    FULL-STACK ARCHITECTURAL SPECIFICATION
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-fun text-white">
                    Rancangan Database MySQL/PostgreSQL, MongoDB & REST/WebSocket API
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Spesifikasi backend lengkap yang siap dideploy untuk produksi skala sekolah.
                  </p>
                </div>

                {/* Relational Schema (SQL) */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4" /> 1. Skema Relasional (PostgreSQL / MySQL DDL):
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-2xl text-[11px] font-mono text-emerald-400 overflow-x-auto border border-slate-800 leading-relaxed">
{`-- 1. Table Siswa
CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade_level SMALLINT NOT NULL CHECK (grade_level BETWEEN 1 AND 6),
    avatar VARCHAR(50) DEFAULT '🚀',
    coins INT DEFAULT 50,
    stars INT DEFAULT 0,
    total_xp INT DEFAULT 0,
    streak_days INT DEFAULT 1,
    active_pet_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table Maskot Peliharaan Virtual (Virtual Pets)
CREATE TABLE virtual_pets (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES students(id) ON DELETE CASCADE,
    pet_type VARCHAR(20) NOT NULL, -- 'dino', 'cat', 'owl', 'bear'
    name VARCHAR(50) NOT NULL,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    hunger INT DEFAULT 80 CHECK (hunger BETWEEN 0 AND 100),
    happiness INT DEFAULT 80 CHECK (happiness BETWEEN 0 AND 100),
    equipped_hat VARCHAR(50),
    equipped_accessory VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table Log Kuis & Adaptivitas AI (Adaptive Quiz Logs)
CREATE TABLE quiz_logs (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES students(id),
    subject VARCHAR(30) NOT NULL, -- 'math', 'science', 'indonesian', etc.
    topic VARCHAR(80) NOT NULL,
    difficulty_tier VARCHAR(20) NOT NULL, -- 'easy', 'medium', 'hard'
    correct_count INT NOT NULL,
    wrong_count INT NOT NULL,
    ai_hints_triggered INT DEFAULT 0,
    voice_answers_used INT DEFAULT 0,
    score INT NOT NULL,
    duration_seconds INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table Sesi Multiplayer Real-Time (Classroom Duel Arena)
CREATE TABLE multiplayer_battles (
    room_id VARCHAR(36) PRIMARY KEY,
    player1_id VARCHAR(36) REFERENCES students(id),
    player2_id VARCHAR(36) REFERENCES students(id),
    winner_id VARCHAR(36),
    p1_score INT DEFAULT 0,
    p2_score INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'finished'
);`}
                  </pre>
                </div>

                {/* MongoDB Document Schema */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4" /> 2. Skema NoSQL (MongoDB Document Collection):
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-2xl text-[11px] font-mono text-sky-300 overflow-x-auto border border-slate-800 leading-relaxed">
{`// Collection: students
{
  "_id": ObjectId("64f1a2b3c4d5e6f7a8b9c0d1"),
  "name": "Bintang Cilik",
  "grade": 3,
  "stats": { "coins": 120, "stars": 15, "xp": 450, "streak": 5 },
  "pet": {
    "type": "dino",
    "name": "Ciko si Dino",
    "level": 2,
    "hunger": 75,
    "happiness": 90,
    "wardrobe": { "hat": "topi-penjelajah" }
  },
  "mastery": {
    "math": { "percentage": 88, "weakTopics": ["pecahan_senilai"] },
    "science": { "percentage": 78, "weakTopics": ["metamorfosis"] }
  }
}`}
                  </pre>
                </div>

                {/* REST & WebSocket API Specification */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4" /> 3. Endpoints REST & WebSocket API:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-mono text-emerald-400 font-bold">POST /api/ai-hint</div>
                      <div className="text-slate-400">
                        Triggered on 2 consecutive wrong answers. Generates friendly scaffolded hints via Gemini model.
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-mono text-sky-400 font-bold">POST /api/ai-generate-quiz</div>
                      <div className="text-slate-400">
                        Dynamically creates adaptive question based on student grade & difficulty level.
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-mono text-amber-400 font-bold">POST /api/pet/feed</div>
                      <div className="text-slate-400">
                        Consumes food item, verifies coins, updates hunger and triggers level-up check.
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="font-mono text-rose-400 font-bold">WS /ws/battle-arena</div>
                      <div className="text-slate-400">
                        Real-time WebSocket for live 1v1 classroom quiz battle with countdown and synchronized HP.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
