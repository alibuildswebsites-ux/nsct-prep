import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Flag, Clock, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, BookOpen, Info } from 'lucide-react';
import PixelButton from '../components/ui/PixelButton';
import { useQuiz } from '../hooks/useQuiz';
import { useTimer } from '../hooks/useTimer';
import { QuizConfig, SUBJECTS } from '../types';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const quiz = useQuiz();
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Load config from sessionStorage
  const configStr = sessionStorage.getItem('quizConfig');
  const config: QuizConfig | null = configStr ? JSON.parse(configStr) : null;

  const timer = useTimer(
    config?.timerEnabled ?? false,
    config?.timerMinutes ?? 0
  );

  // Start quiz on mount
  useEffect(() => {
    if (configLoaded) return;
    if (!config) {
      navigate('/setup');
      return;
    }
    setConfigLoaded(true);
    quiz.startQuiz(config).then(() => {
      timer.start();
    });
  }, [config, configLoaded]);

  // Handle timer expiry
  useEffect(() => {
    if (timer.isExpired && quiz.state === 'active') {
      quiz.finishQuiz(config?.timerMinutes ? config.timerMinutes * 60 : 0);
    }
  }, [timer.isExpired, quiz.state]);

  // Store result when quiz finishes
  useEffect(() => {
    if (quiz.state === 'finished' && quiz.result) {
      sessionStorage.setItem('quizResult', JSON.stringify(quiz.result));
      navigate('/results');
    }
  }, [quiz.state, quiz.result]);

  const handleSubmit = useCallback(() => {
    const elapsed = timer.getElapsed();
    quiz.finishQuiz(elapsed);
  }, [quiz, timer]);

  const handleSelectAnswer = useCallback((letter: string) => {
    if (quiz.currentAnswer?.selectedOption !== null) return; // Already answered
    quiz.selectAnswer(letter);
    setShowExplanation(true);
  }, [quiz]);

  const handleNext = useCallback(() => {
    setShowExplanation(false);
    quiz.nextQuestion();
  }, [quiz]);

  const handlePrev = useCallback(() => {
    setShowExplanation(false);
    quiz.prevQuestion();
  }, [quiz]);

  const handleGoTo = useCallback((index: number) => {
    setShowExplanation(false);
    quiz.goToQuestion(index);
    setShowNavigator(false);
  }, [quiz]);

  // Loading state
  if (quiz.state === 'loading') {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-16 h-16 bg-pastel-blue border-2 border-pastel-charcoal flex items-center justify-center shadow-pixel mx-auto mb-4 animate-pulse">
            <BookOpen size={32} className="text-black" />
          </div>
          <p className="font-pixel text-2xl text-pastel-charcoal">Loading Questions...</p>
          <p className="text-pastel-charcoal/60 text-sm mt-2">Preparing your quiz</p>
        </div>
      </div>
    );
  }

  // Error state
  if (quiz.error) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center py-24 px-4">
        <div className="bg-pastel-surface border-2 border-red-400 p-8 shadow-pixel max-w-md text-center">
          <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="font-pixel text-xl text-pastel-charcoal mb-4">{quiz.error}</p>
          <PixelButton onClick={() => navigate('/setup')}>Go Back</PixelButton>
        </div>
      </div>
    );
  }

  if (quiz.state !== 'active' || !quiz.currentQuestion) return null;

  const { currentQuestion, currentAnswer, currentIndex, questions, answers, answeredCount, flaggedCount } = quiz;
  const isAnswered = currentAnswer?.selectedOption !== null;
  const subjectInfo = SUBJECTS.find(s => s.slug === currentQuestion.subjectSlug);

  return (
    <div className="min-h-[100dvh] py-24 md:py-28 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Top Bar: Progress + Timer */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="font-pixel text-sm text-pastel-charcoal/60 tracking-wider">
              {currentIndex + 1} / {questions.length}
            </span>
            <span className="font-pixel text-xs text-pastel-charcoal/40">
              {answeredCount} answered
            </span>
            {flaggedCount > 0 && (
              <span className="font-pixel text-xs text-orange-500 flex items-center gap-1">
                <Flag size={12} /> {flaggedCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {config?.timerEnabled && (
              <div className={`font-pixel text-lg flex items-center gap-2 px-3 py-1 border-2 border-pastel-charcoal ${
                timer.timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' :
                timer.timeLeft < 300 ? 'bg-yellow-100 text-yellow-700' :
                'bg-pastel-surface text-pastel-charcoal'
              }`}>
                <Clock size={16} />
                {timer.formatted}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-pastel-gray border border-pastel-charcoal/30 mb-6">
          <div 
            className="h-full bg-pastel-blue transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Subject Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 bg-pastel-blue/20 border-2 border-pastel-charcoal px-3 py-1">
            <span className="font-pixel text-xs text-pastel-charcoal tracking-wider uppercase">
              {subjectInfo?.name || currentQuestion.subjectSlug}
            </span>
          </div>
          <button
            onClick={() => quiz.toggleFlag()}
            className={`flex items-center gap-1 px-3 py-1 border-2 transition-colors font-pixel text-sm ${
              currentAnswer?.isFlagged 
                ? 'bg-orange-100 border-orange-400 text-orange-600' 
                : 'bg-pastel-surface border-pastel-charcoal text-pastel-charcoal/60 hover:border-orange-400'
            }`}
            title="Flag for review"
          >
            <Flag size={14} />
            {currentAnswer?.isFlagged ? 'Flagged' : 'Flag'}
          </button>
        </div>

        {/* Question Card */}
        <div className="bg-pastel-surface border-2 border-pastel-charcoal p-6 sm:p-8 shadow-pixel mb-6">
          <p className="font-pixel text-sm text-pastel-charcoal/50 mb-3">Question {currentIndex + 1}</p>
          <h2 className="text-lg sm:text-xl text-pastel-charcoal leading-relaxed font-medium">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, idx) => {
            const letter = OPTION_LETTERS[idx];
            const isSelected = currentAnswer?.selectedOption === letter;
            const isCorrectOption = letter === currentQuestion.answer;
            
            let optionStyle = 'bg-pastel-surface border-pastel-charcoal hover:bg-pastel-blue/10 hover:-translate-y-0.5 shadow-pixel';
            
            if (isAnswered) {
              if (isCorrectOption) {
                optionStyle = 'bg-green-50 border-green-500 shadow-pixel-sm';
              } else if (isSelected && !currentAnswer?.isCorrect) {
                optionStyle = 'bg-red-50 border-red-400 shadow-pixel-sm';
              } else {
                optionStyle = 'bg-pastel-surface border-pastel-charcoal/30 opacity-60';
              }
            }

            return (
              <button
                key={letter}
                onClick={() => handleSelectAnswer(letter)}
                disabled={isAnswered}
                className={`w-full text-left p-4 border-2 transition-all flex items-start gap-4 ${optionStyle} ${
                  isAnswered ? 'cursor-default' : 'cursor-pointer active:translate-y-[2px] active:shadow-pixel-press'
                }`}
              >
                <div className={`flex-shrink-0 w-9 h-9 border-2 flex items-center justify-center font-pixel text-lg ${
                  isAnswered && isCorrectOption
                    ? 'bg-green-500 border-green-700 text-white'
                    : isAnswered && isSelected && !currentAnswer?.isCorrect
                    ? 'bg-red-400 border-red-600 text-white'
                    : isSelected
                    ? 'bg-pastel-blue border-pastel-charcoal text-black'
                    : 'bg-pastel-gray border-pastel-charcoal text-pastel-charcoal'
                }`}>
                  {isAnswered && isCorrectOption ? (
                    <CheckCircle size={18} />
                  ) : isAnswered && isSelected && !currentAnswer?.isCorrect ? (
                    <XCircle size={18} />
                  ) : (
                    letter
                  )}
                </div>
                <span className="text-pastel-charcoal text-base leading-relaxed pt-1">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && showExplanation && currentQuestion.explanation && (
          <div className="bg-pastel-blue/10 border-2 border-pastel-blue p-5 mb-6 animate-[fade-in-up_0.3s_ease-out_forwards]">
            <div className="flex items-center gap-2 mb-2">
              <Info size={18} className="text-pastel-blue" />
              <span className="font-pixel text-base text-pastel-charcoal">Explanation</span>
            </div>
            <p className="text-pastel-charcoal/80 text-sm leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Result feedback */}
        {isAnswered && (
          <div className={`text-center font-pixel text-lg mb-6 py-2 border-2 ${
            currentAnswer?.isCorrect 
              ? 'bg-green-50 border-green-400 text-green-700' 
              : 'bg-red-50 border-red-300 text-red-600'
          }`}>
            {currentAnswer?.isCorrect ? 'Correct!' : `Incorrect - Answer: ${currentQuestion.answer}`}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <PixelButton 
            variant="secondary" 
            size="sm"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="gap-1"
          >
            <ArrowLeft size={16} /> Prev
          </PixelButton>

          <div className="flex items-center gap-3">
            {/* Question Navigator Toggle */}
            <button
              onClick={() => setShowNavigator(!showNavigator)}
              className="font-pixel text-sm text-pastel-charcoal/60 hover:text-pastel-blue flex items-center gap-1 px-3 py-2 border-2 border-pastel-charcoal bg-pastel-surface"
            >
              Questions {showNavigator ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <PixelButton 
              variant="danger" 
              size="sm"
              onClick={() => setShowConfirmSubmit(true)}
            >
              Submit Quiz
            </PixelButton>
          </div>

          <PixelButton 
            size="sm"
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="gap-1"
          >
            Next <ArrowRight size={16} />
          </PixelButton>
        </div>

        {/* Question Navigator Grid */}
        {showNavigator && (
          <div className="mt-4 bg-pastel-surface border-2 border-pastel-charcoal p-4 shadow-pixel animate-[fade-in-up_0.2s_ease-out_forwards]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-pixel text-sm text-pastel-charcoal">Jump to Question</span>
              <div className="flex items-center gap-3 font-pixel text-xs text-pastel-charcoal/60">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 border border-green-600 inline-block" /> Correct</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-300 border border-red-500 inline-block" /> Wrong</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-300 border border-orange-500 inline-block" /> Flagged</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {answers.map((ans, idx) => {
                let bg = 'bg-pastel-gray';
                let border = 'border-pastel-charcoal/30';
                if (idx === currentIndex) {
                  border = 'border-pastel-blue ring-2 ring-pastel-blue/30';
                }
                if (ans.selectedOption !== null) {
                  bg = ans.isCorrect ? 'bg-green-400' : 'bg-red-300';
                  border = ans.isCorrect ? 'border-green-600' : 'border-red-500';
                }
                if (ans.isFlagged) {
                  border = 'border-orange-500';
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleGoTo(idx)}
                    className={`w-9 h-9 ${bg} border-2 ${border} font-pixel text-sm text-pastel-charcoal hover:bg-pastel-blue/30 transition-colors flex items-center justify-center`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowConfirmSubmit(false)}>
            <div className="bg-pastel-surface p-6 sm:p-8 border-2 border-pastel-charcoal shadow-pixel-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-pixel text-2xl text-pastel-charcoal mb-4">Submit Quiz?</h3>
              <p className="text-pastel-charcoal/70 mb-2">
                You have answered <strong className="text-pastel-charcoal">{answeredCount}</strong> of <strong className="text-pastel-charcoal">{questions.length}</strong> questions.
              </p>
              {answeredCount < questions.length && (
                <p className="text-orange-600 text-sm mb-4 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  {questions.length - answeredCount} question(s) unanswered.
                </p>
              )}
              <div className="flex gap-4 mt-6">
                <PixelButton variant="secondary" onClick={() => setShowConfirmSubmit(false)} className="flex-1">
                  Continue
                </PixelButton>
                <PixelButton variant="danger" onClick={handleSubmit} className="flex-1">
                  Submit
                </PixelButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
