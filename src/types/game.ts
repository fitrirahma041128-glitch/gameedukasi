export type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type PetType = 'dino' | 'cat' | 'owl' | 'bear';

export type SubjectId = 'math' | 'science' | 'indonesian' | 'english' | 'logic';

export interface PetAccessory {
  id: string;
  name: string;
  type: 'hat' | 'glasses' | 'outfit' | 'cape';
  icon: string;
  cost: number;
  owned: boolean;
  equipped: boolean;
  bonusEffect: string;
}

export interface PetFood {
  id: string;
  name: string;
  icon: string;
  cost: number;
  hungerBoost: number;
  happyBoost: number;
  count: number;
  description: string;
}

export interface VirtualPet {
  id: string;
  type: PetType;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  hunger: number; // 0 - 100 (100 = full)
  happiness: number; // 0 - 100 (100 = very happy)
  energy: number; // 0 - 100
  title: string;
  equippedHat?: string;
  equippedAccessory?: string;
  equippedOutfit?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  grade: GradeLevel;
  avatar: string;
  coins: number;
  stars: number;
  totalXp: number;
  streakDays: number;
  lastActiveDate: string;
  activePetId: string;
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  subject: SubjectId;
  topic: string;
  gradeLevel: GradeLevel;
  difficulty: QuestionDifficulty;
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  visualIcon?: string;
  hint: string;
  scaffoldStep: string;
  voiceKeywords: string[]; // words accepted via speech recognition
  funFact?: string;
}

export interface QuizSessionStats {
  subject: SubjectId;
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  coinsEarned: number;
  starsEarned: number;
  xpEarned: number;
  durationSeconds: number;
  adaptiveTierReached: string;
  timestamp: string;
}

export interface SubjectMastery {
  subject: SubjectId;
  name: string;
  color: string;
  masteryPercentage: number;
  quizzesCompleted: number;
  strengthAreas: string[];
  needsImprovement: string[];
}
