import { QuizQuestion, QuizAnswer, QuizResult, QuizConfig } from '../types';

export function calculateResults(
  config: QuizConfig,
  questions: QuizQuestion[],
  answers: QuizAnswer[],
  timeTaken: number
): QuizResult {
  let totalCorrect = 0;
  let totalAnswered = 0;

  const subjectBreakdown: Record<string, { total: number; correct: number; attempted: number }> = {};

  questions.forEach((q, index) => {
    const answer = answers[index];
    
    // Init subject breakdown
    if (!subjectBreakdown[q.subjectSlug]) {
      subjectBreakdown[q.subjectSlug] = { total: 0, correct: 0, attempted: 0 };
    }
    subjectBreakdown[q.subjectSlug].total++;

    if (answer && answer.selectedOption !== null) {
      totalAnswered++;
      subjectBreakdown[q.subjectSlug].attempted++;
      
      if (answer.isCorrect) {
        totalCorrect++;
        subjectBreakdown[q.subjectSlug].correct++;
      }
    }
  });

  const percentage = questions.length > 0 
    ? Math.round((totalCorrect / questions.length) * 100) 
    : 0;

  return {
    config,
    questions,
    answers,
    totalCorrect,
    totalAnswered,
    totalQuestions: questions.length,
    percentage,
    timeTaken,
    completedAt: new Date().toISOString(),
    subjectBreakdown,
  };
}

export function getGrade(percentage: number): { label: string; color: string } {
  if (percentage >= 90) return { label: 'Excellent', color: 'text-green-500' };
  if (percentage >= 75) return { label: 'Good', color: 'text-pastel-blue' };
  if (percentage >= 60) return { label: 'Average', color: 'text-yellow-500' };
  if (percentage >= 40) return { label: 'Below Average', color: 'text-orange-500' };
  return { label: 'Needs Improvement', color: 'text-red-500' };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
