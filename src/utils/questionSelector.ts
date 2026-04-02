import { SubjectData, Difficulty, QuizQuestion, SUBJECTS } from '../types';

// Runtime cache for loaded subject data
const subjectDataCache: Record<string, SubjectData> = {};

export async function loadSubjectData(slug: string): Promise<SubjectData> {
  if (subjectDataCache[slug]) {
    return subjectDataCache[slug];
  }
  
  // Fetch from public/data/ at runtime (not bundled)
  const response = await fetch(`${import.meta.env.BASE_URL}data/${slug}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load data for ${slug}`);
  }
  
  const data: SubjectData = await response.json();
  subjectDataCache[slug] = data;
  return data;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Select questions for a full-mix quiz respecting NSCT weightage.
 */
export async function selectFullMixQuestions(
  difficulty: Difficulty,
  totalCount: number
): Promise<QuizQuestion[]> {
  const allQuestions: QuizQuestion[] = [];

  for (const subject of SUBJECTS) {
    const data = await loadSubjectData(subject.slug);
    const pool = data[difficulty];
    
    // Calculate how many questions from this subject based on weight
    const count = Math.round((subject.weight / 100) * totalCount);
    
    const shuffled = shuffleArray(pool);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    
    allQuestions.push(...selected.map(q => ({
      ...q,
      subjectSlug: subject.slug,
      subjectName: subject.name,
    })));
  }

  // If rounding caused us to have too few/many, adjust
  const diff = totalCount - allQuestions.length;
  if (diff > 0) {
    // Add more from the highest-weighted subject
    const topSubject = SUBJECTS[0]; // problem-solving (20%)
    const data = await loadSubjectData(topSubject.slug);
    const pool = data[difficulty];
    const existingIds = new Set(allQuestions.filter(q => q.subjectSlug === topSubject.slug).map(q => q.id));
    const extra = shuffleArray(pool.filter(q => !existingIds.has(q.id))).slice(0, diff);
    allQuestions.push(...extra.map(q => ({
      ...q,
      subjectSlug: topSubject.slug,
      subjectName: topSubject.name,
    })));
  } else if (diff < 0) {
    // Remove excess from the end
    allQuestions.splice(totalCount);
  }

  return shuffleArray(allQuestions);
}

/**
 * Select questions for subject-focus mode.
 */
export async function selectSubjectQuestions(
  difficulty: Difficulty,
  subjects: string[],
  totalCount: number
): Promise<QuizQuestion[]> {
  const allQuestions: QuizQuestion[] = [];
  const perSubject = Math.ceil(totalCount / subjects.length);

  for (const slug of subjects) {
    const data = await loadSubjectData(slug);
    const pool = data[difficulty];
    const subjectInfo = SUBJECTS.find(s => s.slug === slug);
    
    const shuffled = shuffleArray(pool);
    const selected = shuffled.slice(0, Math.min(perSubject, shuffled.length));
    
    allQuestions.push(...selected.map(q => ({
      ...q,
      subjectSlug: slug,
      subjectName: subjectInfo?.name || slug,
    })));
  }

  // Trim to exact count and shuffle
  return shuffleArray(allQuestions).slice(0, totalCount);
}

/**
 * Get the count of available questions per subject per difficulty.
 */
export async function getAvailableCounts(
  slugs: string[],
  difficulty: Difficulty
): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const slug of slugs) {
    const data = await loadSubjectData(slug);
    counts[slug] = data[difficulty].length;
  }
  return counts;
}
