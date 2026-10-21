import React, { useState } from 'react';
import { StudentProfile, VirtualPet, SubjectId } from './types/game';
import { INITIAL_STUDENT, AVAILABLE_PETS } from './data/curriculumData';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PetOnboardingModal } from './components/PetOnboardingModal';
import { WorldMapDashboard } from './components/WorldMapDashboard';
import { QuizArena } from './components/QuizArena';
import { BattleArena } from './components/BattleArena';
import { PetCareSanctuary } from './components/PetCareSanctuary';
import { TeacherParentDashboard } from './components/TeacherParentDashboard';
import { SolarSystemCanvas } from './components/CanvasMiniGames/SolarSystemCanvas';
import { PizzaFractionCanvas } from './components/CanvasMiniGames/PizzaFractionCanvas';
import { VoiceSpellingRocket } from './components/CanvasMiniGames/VoiceSpellingRocket';
import { soundFx } from './utils/audio';

type AppView =
  | 'landing'
  | 'world-map'
  | 'quiz'
  | 'battle'
  | 'pet-care'
  | 'analytics'
  | 'canvas-solar'
  | 'canvas-pizza'
  | 'canvas-rocket';

export default function App() {
  // Navigation & Current View state
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('math');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Persistent-like student & pet state
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [pets, setPets] = useState<VirtualPet[]>(AVAILABLE_PETS);

  const activePet =
    pets.find((p) => p.id === student.activePetId) || pets[0] || AVAILABLE_PETS[0];

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundFx.enabled = nextState;
    if (nextState) {
      soundFx.playPop();
    }
  };

  const handleUpdateStudent = (updated: Partial<StudentProfile>, selectedPetId?: string) => {
    setStudent((prev) => ({
      ...prev,
      ...updated,
      activePetId: selectedPetId || prev.activePetId,
    }));
    setShowOnboarding(false);
    setCurrentView('world-map');
  };

  const handleUpdatePet = (updated: Partial<VirtualPet>) => {
    setPets((prev) =>
      prev.map((p) => (p.id === activePet.id ? { ...p, ...updated } : p))
    );
  };

  const handleUpdateCoins = (delta: number) => {
    setStudent((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins + delta),
    }));
  };

  const handleFinishQuiz = (stats: {
    subject: SubjectId;
    correct: number;
    wrong: number;
    coins: number;
    stars: number;
    xp: number;
  }) => {
    // Add rewards to student
    setStudent((prev) => ({
      ...prev,
      coins: prev.coins + stats.coins,
      stars: prev.stars + stats.stars,
      totalXp: prev.totalXp + stats.xp,
    }));

    // Add XP to active pet
    let newPetXp = activePet.xp + stats.xp;
    let newLevel = activePet.level;
    if (newPetXp >= activePet.maxXp) {
      newPetXp -= activePet.maxXp;
      newLevel += 1;
    }

    handleUpdatePet({
      xp: newPetXp,
      level: newLevel,
      happiness: Math.min(100, activePet.happiness + 15),
    });

    // Go straight to Stage 5: Pet Care Screen as requested in user prompt!
    setCurrentView('pet-care');
  };

  const handleFinishBattle = (coins: number, stars: number) => {
    setStudent((prev) => ({
      ...prev,
      coins: prev.coins + coins,
      stars: prev.stars + stars,
      totalXp: prev.totalXp + 50,
    }));
    setCurrentView('world-map');
  };

  const handleFinishCanvasGame = (coins: number, xp: number) => {
    setStudent((prev) => ({
      ...prev,
      coins: prev.coins + coins,
      totalXp: prev.totalXp + xp,
      stars: prev.stars + 1,
    }));
    handleUpdatePet({
      xp: activePet.xp + xp,
      happiness: Math.min(100, activePet.happiness + 20),
    });
    setCurrentView('pet-care');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col selection:bg-amber-300 selection:text-amber-950">
      {/* Top Navbar HUD (shown across all views except initial pure landing if desired, but helpful to always show for quick switching) */}
      <Navbar
        student={student}
        activePet={activePet}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as AppView)}
        onOpenPetModal={() => setShowOnboarding(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartAdventure={() => {
              // If student not customized yet, show onboarding or go to map
              setCurrentView('world-map');
            }}
            onOpenTeacherDashboard={() => setCurrentView('analytics')}
            onSelectPet={() => setShowOnboarding(true)}
            onTryCanvasGame={(gameType) => {
              if (gameType === 'solar') setCurrentView('canvas-solar');
              else if (gameType === 'pizza') setCurrentView('canvas-pizza');
              else setCurrentView('canvas-rocket');
            }}
          />
        )}

        {currentView === 'world-map' && (
          <WorldMapDashboard
            student={student}
            activePet={activePet}
            onSelectSubject={(subject) => {
              setSelectedSubject(subject);
              setCurrentView('quiz');
            }}
            onOpenBattle={() => setCurrentView('battle')}
            onOpenPetCare={() => setCurrentView('pet-care')}
            onLaunchCanvasGame={(type) => {
              if (type === 'solar') setCurrentView('canvas-solar');
              else if (type === 'pizza') setCurrentView('canvas-pizza');
              else setCurrentView('canvas-rocket');
            }}
            onOpenOnboarding={() => setShowOnboarding(true)}
          />
        )}

        {currentView === 'quiz' && (
          <QuizArena
            subject={selectedSubject}
            student={student}
            activePet={activePet}
            onFinishQuiz={handleFinishQuiz}
            onBackToMap={() => setCurrentView('world-map')}
          />
        )}

        {currentView === 'battle' && (
          <BattleArena
            student={student}
            activePet={activePet}
            onFinishBattle={handleFinishBattle}
            onBack={() => setCurrentView('world-map')}
          />
        )}

        {currentView === 'pet-care' && (
          <PetCareSanctuary
            student={student}
            pet={activePet}
            onUpdatePet={handleUpdatePet}
            onUpdateCoins={handleUpdateCoins}
            onBackToMap={() => setCurrentView('world-map')}
          />
        )}

        {currentView === 'analytics' && (
          <TeacherParentDashboard
            student={student}
            onBackToApp={() => setCurrentView('world-map')}
          />
        )}

        {/* Canvas Mini-Games */}
        {currentView === 'canvas-solar' && (
          <div className="py-6 px-4 bg-slate-950 min-h-screen">
            <SolarSystemCanvas
              onComplete={handleFinishCanvasGame}
              onBack={() => setCurrentView('world-map')}
            />
          </div>
        )}

        {currentView === 'canvas-pizza' && (
          <div className="py-6 px-4 bg-amber-100 min-h-screen">
            <PizzaFractionCanvas
              onComplete={handleFinishCanvasGame}
              onBack={() => setCurrentView('world-map')}
            />
          </div>
        )}

        {currentView === 'canvas-rocket' && (
          <div className="py-6 px-4 bg-slate-950 min-h-screen">
            <VoiceSpellingRocket
              onComplete={handleFinishCanvasGame}
              onBack={() => setCurrentView('world-map')}
            />
          </div>
        )}
      </main>

      {/* Onboarding & Mascot Selection Modal */}
      {showOnboarding && (
        <PetOnboardingModal
          currentStudent={student}
          currentPet={activePet}
          onSave={handleUpdateStudent}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}
