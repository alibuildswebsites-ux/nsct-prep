import { useState, useCallback, useRef } from 'react';
import { QuizQuestion, QuizAnswer, QuizConfig, QuizResult } from '../types';
import { selectFullMixQuestions, selectSubjectQuestions } from '../utils/questionSelector';
import { calculateResults } from '../utils/scoring';

export type QuizState = 'idle' | 'loading' | 'active' | 'finished';

export function useQuiz() {
  const [state, setState] = useState<QuizState>('idle');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);

  const startQuiz = useCallback(async (quizConfig: QuizConfig) => {
    setState('loading');
    setError(null);
    setConfig(quizConfig);

    try {
      let selected: QuizQuestion[];
      
      if (quizConfig.mode === 'full-mix') {
        selected = await selectFullMixQuestions(
          quizConfig.difficulty,
          quizConfig.questionCount
        );
      } else {
        selected = await selectSubjectQuestions(
          quizConfig.difficulty,
          quizConfig.subjects,
          quizConfig.questionCount
        );
      }

      if (selected.length === 0) {
        throw new Error('No questions available for the selected configuration.');
      }

      setQuestions(selected);
      setAnswers(selected.map((_, i) => ({
        questionIndex: i,
        selectedOption: null,
        isCorrect: false,
        isFlagged: false,
      })));
      setCurrentIndex(0);
      startTimeRef.current = Date.now();
      setState('active');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
      setState('idle');
    }
  }, []);

  const selectAnswer = useCallback((optionLetter: string) => {
    setAnswers(prev => {
      const updated = [...prev];
      const question = questions[currentIndex];
      updated[currentIndex] = {
        ...updated[currentIndex],
        selectedOption: optionLetter,
        isCorrect: optionLetter === question.answer,
      };
      return updated;
    });
  }, [currentIndex, questions]);

  const toggleFlag = useCallback(() => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        isFlagged: !updated[currentIndex].isFlagged,
      };
      return updated;
    });
  }, [currentIndex]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  }, [questions.length]);

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const prevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const finishQuiz = useCallback((elapsedOverride?: number) => {
    if (!config) return;
    const timeTaken = elapsedOverride ?? Math.floor((Date.now() - startTimeRef.current) / 1000);
    const quizResult = calculateResults(config, questions, answers, timeTaken);
    setResult(quizResult);
    setState('finished');
  }, [config, questions, answers]);

  const resetQuiz = useCallback(() => {
    setState('idle');
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setConfig(null);
    setResult(null);
    setError(null);
  }, []);

  const answeredCount = answers.filter(a => a.selectedOption !== null).length;
  const flaggedCount = answers.filter(a => a.isFlagged).length;

  return {
    state,
    questions,
    answers,
    currentIndex,
    config,
    result,
    error,
    answeredCount,
    flaggedCount,
    currentQuestion: questions[currentIndex] || null,
    currentAnswer: answers[currentIndex] || null,
    startQuiz,
    selectAnswer,
    toggleFlag,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    finishQuiz,
    resetQuiz,
  };
}
