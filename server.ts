import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client if key exists
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

// API endpoint for AI Tutor hint & explanation for elementary school kids
app.post('/api/ai-hint', async (req, res) => {
  try {
    const { question, subject, studentGrade, wrongAnswersCount, topic } = req.body;

    if (!aiClient) {
      // Fallback mock child-friendly hint if no API key is set
      return res.json({
        hint: `Jangan berkecil hati ya! Ingat konsep dasar ${topic || subject}: coba bayangkan atau hitung pelan-pelan langkah demi langkah. Kamu pasti bisa! 🌟`,
        explanation: `Yuk pelajari polanya. Untuk materi ${subject}, kuncinya adalah teliti dan tenang.`,
        scaffoldStep: `Coba eliminasi jawaban yang paling tidak mungkin dulu ya!`,
        source: 'smart-fallback',
      });
    }

    const prompt = `Anda adalah "Kak Boty", robot maskot AI sahabat belajar siswa Sekolah Dasar (SD kelas ${studentGrade || 3}).
Siswa sedang kesulitan menjawab pertanyaan ini:
Mata Pelajaran: ${subject}
Topik: ${topic || 'Umum'}
Pertanyaan: "${question}"
Siswa sudah mencoba dan salah ${wrongAnswersCount || 1} kali.

Berikan:
1. Kalimat penyemangat ceria yang ramah anak (1 kalimat pendek dengan emoji ceria).
2. Petunjuk (hint) logis yang mudah dipahami anak SD tanpa langsung membocorkan jawaban akhir.
3. Langkah sederhana (scaffold step) untuk memandu anak berpikir.

Format respons dalam JSON murni:
{
  "cheer": "...",
  "hint": "...",
  "scaffoldStep": "..."
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({
      hint: parsed.hint || 'Perhatikan polanya pelan-pelan ya!',
      explanation: parsed.cheer || 'Tetap semangat, sedikit lagi kamu bisa!',
      scaffoldStep: parsed.scaffoldStep || 'Coba bayangkan dengan benda sehari-hari.',
      source: 'gemini',
    });
  } catch (error) {
    console.error('AI Hint Error:', error);
    return res.json({
      hint: 'Ayo coba lagi pelan-pelan, perhatikan angka atau kata kuncinya ya! 💡',
      explanation: 'Setiap kesalahan adalah langkah untuk jadi lebih pintar!',
      scaffoldStep: 'Pikirkan apa yang sudah kamu pelajari di sekolah.',
      source: 'error-fallback',
    });
  }
});

// API endpoint for generating adaptive custom questions
app.post('/api/ai-generate-quiz', async (req, res) => {
  try {
    const { subject, grade, difficulty, topic } = req.body;

    if (!aiClient) {
      return res.json({
        success: false,
        message: 'No API key, using curated curriculum questions',
      });
    }

    const prompt = `Buatkan 1 soal pilihan ganda interaktif untuk siswa SD kelas ${grade || 3} mata pelajaran ${subject} topik "${topic || 'Umum'}".
Tingkat kesulitan: ${difficulty || 'sedang'}.
Format dalam JSON murni:
{
  "question": "teks pertanyaan yang jelas dan seru",
  "options": ["pilihan A", "pilihan B", "pilihan C", "pilihan D"],
  "correctAnswer": 0, // indeks jawaban yang benar (0-3)
  "explanation": "penjelasan singkat dan menyenangkan jika anak menjawab benar",
  "hint": "petunjuk jika anak kesulitan",
  "voiceAnswer": "kata kunci untuk jawaban lisan suara"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, quiz: parsed });
  } catch (err) {
    console.error('AI Quiz Gen Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to generate quiz' });
  }
});

// API endpoint for Learning Analytics summary
app.post('/api/ai-analytics-insights', async (req, res) => {
  try {
    const { studentName, grade, stats } = req.body;

    if (!aiClient) {
      return res.json({
        summary: `Siswa ${studentName} menunjukkan antusiasme yang hebat dalam belajar! Terus dampingi untuk mempertahankan kebiasaan belajar harian.`,
        recommendations: [
          'Berikan apresiasi untuk capaian kuis matematika.',
          'Ajak membaca cerita pendek 10 menit setiap hari untuk memperkaya kosa kata.',
          'Gunakan mini-game sains interaktif untuk memperkuat daya visual anak.',
        ],
      });
    }

    const prompt = `Analisis data belajar siswa SD berikut untuk orang tua & guru:
Nama: ${studentName}
Kelas: ${grade}
Statistik: ${JSON.stringify(stats)}

Buat analisis ringkas, hangat, dan konstruktif:
1. Ringkasan kekuatan anak (2-3 kalimat)
2. 3 rekomendasi praktis untuk guru/orang tua dalam mendampingi anak

Format respons JSON:
{
  "summary": "...",
  "recommendations": ["...", "...", "..."]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err) {
    return res.json({
      summary: 'Progres belajar anak berjalan sangat positif dengan peningkatan pemahaman bertahap.',
      recommendations: [
        'Terus beri semangat dan apresiasi setiap selesai 1 misi belajar.',
        'Latih ketepatan menjawab dengan kuis berbatas waktu santai.',
      ],
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduPet Island Server running on http://localhost:${PORT}`);
  });
}

startServer();
