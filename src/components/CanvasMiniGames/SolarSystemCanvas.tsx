import React, { useRef, useEffect, useState } from 'react';
import { soundFx } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Volume2, CheckCircle2 } from 'lucide-react';
import { speakToChild } from '../../utils/speech';

interface Planet {
  id: string;
  name: string;
  indonesianName: string;
  order: number; // 1 to 8 from sun
  radius: number;
  orbitRadius: number;
  color: string;
  ring?: boolean;
  speed: number;
  funFact: string;
}

const PLANETS_DATA: Planet[] = [
  { id: 'mercury', name: 'Mercury', indonesianName: 'Merkurius', order: 1, radius: 7, orbitRadius: 45, color: '#9ca3af', speed: 0.03, funFact: 'Planet terdekat dengan Matahari dan berukuran paling kecil!' },
  { id: 'venus', name: 'Venus', indonesianName: 'Venus', order: 2, radius: 10, orbitRadius: 75, color: '#fbbf24', speed: 0.022, funFact: 'Planet paling panas di tata surya karena efek rumah kaca tebal.' },
  { id: 'earth', name: 'Earth', indonesianName: 'Bumi', order: 3, radius: 12, orbitRadius: 110, color: '#38bdf8', speed: 0.016, funFact: 'Satu-satunya rumah kehidupan kita dengan air dan oksigen berlimpah.' },
  { id: 'mars', name: 'Mars', indonesianName: 'Mars', order: 4, radius: 9, orbitRadius: 145, color: '#ef4444', speed: 0.013, funFact: 'Dijuluki Si Planet Merah karena banyaknya pasir besi berkarat.' },
  { id: 'jupiter', name: 'Jupiter', indonesianName: 'Jupiter', order: 5, radius: 22, orbitRadius: 190, color: '#d97706', speed: 0.009, funFact: 'Planet terbesar raksasa gas dengan badai Bintik Merah Raksasa!' },
  { id: 'saturn', name: 'Saturn', indonesianName: 'Saturnus', order: 6, radius: 18, orbitRadius: 240, color: '#eab308', ring: true, speed: 0.007, funFact: 'Memiliki sistem cincin es dan batu paling memukau di angkasa!' },
  { id: 'uranus', name: 'Uranus', indonesianName: 'Uranus', order: 7, radius: 14, orbitRadius: 285, color: '#2dd4bf', speed: 0.005, funFact: 'Planet es berwarna toska yang berputar miring hampir rebahan!' },
  { id: 'neptune', name: 'Neptune', indonesianName: 'Neptunus', order: 8, radius: 14, orbitRadius: 330, color: '#3b82f6', speed: 0.004, funFact: 'Planet terjauh berangin badai supersonik yang sangat dingin.' },
];

export const SolarSystemCanvas: React.FC<{
  onComplete?: (coins: number, xp: number) => void;
  onBack?: () => void;
}> = ({ onComplete, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [placedPlanets, setPlacedPlanets] = useState<string[]>(['mercury', 'venus']); // starter placed
  const [targetPlanetId, setTargetPlanetId] = useState<string>('earth');
  const [feedback, setFeedback] = useState<string>('Misi: Pasang Planet Bumi ke Orbit ke-3 dari Matahari!');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Orbit angle state
  const anglesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    // initialize angles
    PLANETS_DATA.forEach((p, idx) => {
      anglesRef.current[p.id] = idx * 0.8;
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw background space with twinkling stars
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 40; i++) {
        const sx = (Math.sin(i * 99) * 0.5 + 0.5) * canvas.width;
        const sy = (Math.cos(i * 47) * 0.5 + 0.5) * canvas.height;
        const sSize = (i % 3 === 0) ? 2 : 1;
        ctx.fillRect(sx, sy, sSize, sSize);
      }

      // Draw Sun
      const sunGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 32);
      sunGrad.addColorStop(0, '#fef08a');
      sunGrad.addColorStop(0.4, '#f59e0b');
      sunGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();

      // Sun label
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 11px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('☀️ Matahari', centerX, centerY + 4);

      // Draw Orbits and Planets
      PLANETS_DATA.forEach((planet) => {
        const isPlaced = placedPlanets.includes(planet.id);
        const isTarget = planet.id === targetPlanetId;

        // Orbit ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isTarget ? 'rgba(56, 189, 248, 0.7)' : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = isTarget ? 2 : 1;
        if (isTarget) {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbit number tag
        ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.font = '9px Fredoka, sans-serif';
        ctx.fillText(`Orbit ${planet.order}`, centerX, centerY - planet.orbitRadius - 3);

        if (isPlaced) {
          // Increment angle for rotation
          anglesRef.current[planet.id] = (anglesRef.current[planet.id] || 0) + planet.speed;
          const angle = anglesRef.current[planet.id];
          const px = centerX + Math.cos(angle) * planet.orbitRadius;
          const py = centerY + Math.sin(angle) * planet.orbitRadius;

          // Draw planet body
          ctx.beginPath();
          ctx.arc(px, py, planet.radius, 0, Math.PI * 2);
          ctx.fillStyle = planet.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = planet.color;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Draw Saturn's ring if applicable
          if (planet.ring) {
            ctx.beginPath();
            ctx.ellipse(px, py, planet.radius * 1.9, planet.radius * 0.6, Math.PI / 4, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(253, 224, 71, 0.8)';
            ctx.lineWidth = 2.5;
            ctx.stroke();
          }

          // Planet Name Tag
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px Fredoka, sans-serif';
          ctx.fillText(planet.indonesianName, px, py + planet.radius + 12);
        } else if (isTarget) {
          // Ghost slot for target planet
          ctx.beginPath();
          ctx.arc(centerX + planet.orbitRadius, centerY, planet.radius, 0, Math.PI * 2);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
          ctx.font = '10px Fredoka, sans-serif';
          ctx.fillText(`Slot ${planet.indonesianName}`, centerX + planet.orbitRadius, centerY + planet.radius + 12);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [placedPlanets, targetPlanetId]);

  const handlePlacePlanet = (planet: Planet) => {
    soundFx.playPop();
    setSelectedPlanet(planet);

    if (planet.id === targetPlanetId) {
      soundFx.playCorrect();
      setPlacedPlanets((prev) => [...prev, planet.id]);
      setFeedback(`Hebat! ${planet.indonesianName} berhasil ditaruh di orbit ke-${planet.order}! 🚀`);
      speakToChild(`Hebat! ${planet.indonesianName} berhasil ditempatkan.`);

      // Pick next target
      const remaining = PLANETS_DATA.filter((p) => !placedPlanets.includes(p.id) && p.id !== planet.id);
      if (remaining.length > 0) {
        const next = remaining[0];
        setTargetPlanetId(next.id);
      } else {
        // Complete all!
        setIsSuccess(true);
        soundFx.playVictory();
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        setFeedback('Luar Biasa! Seluruh Tata Surya kita sudah tersusun sempurna! 🌟');
        speakToChild('Luar biasa! Seluruh tata surya sudah tersusun sempurna!');
        if (onComplete) onComplete(40, 60);
      }
    } else {
      soundFx.playWrong();
      setFeedback(`Ups! ${planet.indonesianName} ada di orbit ke-${planet.order}. Cari planet untuk Orbit ke-${PLANETS_DATA.find((p) => p.id === targetPlanetId)?.order}!`);
      speakToChild(`Belum tepat, coba lagi ya.`);
    }
  };

  const handleReset = () => {
    soundFx.playPop();
    setPlacedPlanets(['mercury', 'venus']);
    setTargetPlanetId('earth');
    setSelectedPlanet(null);
    setIsSuccess(false);
    setFeedback('Misi: Pasang Planet Bumi ke Orbit ke-3 dari Matahari!');
  };

  return (
    <div className="bg-slate-900 border-4 border-amber-400 rounded-3xl p-5 text-white shadow-2xl relative max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500/20 border-2 border-amber-400 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
            🪐
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold font-fun text-amber-300 flex items-center gap-2">
              Lembah Kosmik: Rakit Tata Surya
              <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
            </h2>
            <p className="text-xs text-slate-300">Tarik dan susun planet-planet ke orbit lintasannya sesuai urutan dari Matahari!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-600 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Ulang
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow"
            >
              Kembali ke Peta
            </button>
          )}
        </div>
      </div>

      {/* Target Mission Alert */}
      <div className="bg-slate-800/90 border-2 border-sky-400/50 rounded-2xl p-3 mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-bounce">🎯</span>
          <div className="text-sm font-semibold text-sky-200">
            {feedback}
          </div>
        </div>
        <button
          onClick={() => speakToChild(feedback)}
          className="p-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded-xl transition"
          title="Dengarkan Suara"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Canvas Viewport */}
      <div className="relative flex justify-center bg-black/60 rounded-2xl overflow-hidden border border-slate-800 mb-4">
        <canvas
          ref={canvasRef}
          width={720}
          height={400}
          className="w-full max-h-[380px] object-contain"
        />

        {isSuccess && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="text-6xl mb-2 animate-bounce">🏆</div>
            <h3 className="text-2xl font-bold font-fun text-yellow-300 mb-1">Misi Selesai dengan Sempurna!</h3>
            <p className="text-sm text-slate-200 max-w-md mb-4">
              Kamu telah membuktikan bahwa kamu adalah Penjelajah Antariksa Cilik yang hebat! Kamu mendapatkan 40 Koin Emas & 60 XP!
            </p>
            <button
              onClick={onBack}
              className="px-6 py-2.5 bg-game-green text-white font-fun font-bold text-lg rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition"
            >
              Ambil Hadiah & Lanjut 🌟
            </button>
          </div>
        )}
      </div>

      {/* Planet Selection Deck */}
      <div className="mt-2">
        <div className="text-xs font-bold text-amber-200 mb-2 uppercase tracking-wider flex items-center gap-1.5">
          <span>Pilih Planet untuk Dimasukkan:</span>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {PLANETS_DATA.map((planet) => {
            const isPlaced = placedPlanets.includes(planet.id);
            const isTarget = planet.id === targetPlanetId;
            return (
              <button
                key={planet.id}
                onClick={() => handlePlacePlanet(planet)}
                disabled={isPlaced}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition relative ${
                  isPlaced
                    ? 'bg-slate-800/40 border-slate-700 opacity-40 cursor-not-allowed'
                    : isTarget
                    ? 'bg-sky-500/20 border-sky-400 ring-2 ring-sky-300 animate-pulse-glow shadow-md hover:bg-sky-500/30'
                    : 'bg-slate-800 border-slate-600 hover:border-amber-400 hover:bg-slate-700'
                }`}
              >
                {isPlaced && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-1 right-1" />
                )}
                <div
                  className="w-7 h-7 rounded-full mb-1 shadow"
                  style={{ backgroundColor: planet.color }}
                />
                <span className="text-[11px] font-bold text-slate-100 truncate w-full text-center">
                  {planet.indonesianName}
                </span>
                <span className="text-[9px] text-slate-400">Orbit {planet.order}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Planet Fun Fact */}
      {selectedPlanet && (
        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-400/30 rounded-2xl text-xs text-amber-200 flex items-center gap-2">
          <span className="text-xl">💡</span>
          <div>
            <strong>Fakta Seru {selectedPlanet.indonesianName}:</strong> {selectedPlanet.funFact}
          </div>
        </div>
      )}
    </div>
  );
};
