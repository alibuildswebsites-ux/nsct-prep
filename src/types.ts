export interface MCQ {
  id: number;
  question: string;
  options: string[];
  answer: string; // "A" | "B" | "C" | "D"
  explanation: string | null;
}

export interface SubjectData {
  subject: string;
  slug: string;
  basic: MCQ[];
  intermediate: MCQ[];
  expert: MCQ[];
}

export type Difficulty = 'basic' | 'intermediate' | 'expert';

export type QuizMode = 'full-mix' | 'subject-focus';

export interface SubjectInfo {
  slug: string;
  name: string;
  weight: number; // percentage weight in NSCT exam
  icon: string;   // lucide icon name
}

export interface QuizConfig {
  mode: QuizMode;
  difficulty: Difficulty;
  subjects: string[]; // slugs
  questionCount: number;
  timerEnabled: boolean;
  timerMinutes: number;
}

export interface QuizQuestion extends MCQ {
  subjectSlug: string;
  subjectName: string;
}

export interface QuizAnswer {
  questionIndex: number;
  selectedOption: string | null; // "A" | "B" | "C" | "D" | null
  isCorrect: boolean;
  isFlagged: boolean;
  timeSpent?: number;
}

export interface QuizResult {
  config: QuizConfig;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  totalCorrect: number;
  totalAnswered: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number; // seconds
  completedAt: string;
  subjectBreakdown: Record<string, {
    total: number;
    correct: number;
    attempted: number;
  }>;
}

export const SUBJECTS: SubjectInfo[] = [
  { slug: 'problem-solving', name: 'Problem Solving & Analytical Skills', weight: 20, icon: 'Brain' },
  { slug: 'programming', name: 'Programming (C++, Java, Python)', weight: 10, icon: 'Code' },
  { slug: 'dsa', name: 'Data Structures & Algorithms', weight: 10, icon: 'GitBranch' },
  { slug: 'software-engineering', name: 'Software Engineering', weight: 10, icon: 'Settings' },
  { slug: 'web-development', name: 'Web Development', weight: 10, icon: 'Globe' },
  { slug: 'ai-ml', name: 'AI / Machine Learning & Data Analytics', weight: 10, icon: 'Cpu' },
  { slug: 'databases', name: 'Databases', weight: 10, icon: 'Database' },
  { slug: 'computer-networks', name: 'Computer Networks & Cloud Computing', weight: 10, icon: 'Network' },
  { slug: 'operating-systems', name: 'Operating Systems', weight: 5, icon: 'Monitor' },
  { slug: 'cyber-security', name: 'Cyber Security', weight: 5, icon: 'Shield' },
];

export const QUESTION_PRESETS = [10, 25, 50, 100];
