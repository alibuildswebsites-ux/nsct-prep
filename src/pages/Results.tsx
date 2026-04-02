import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, RotateCcw, CheckCircle, XCircle, Flag, Clock, Target, Award, ChevronDown, ChevronUp, Info, BookOpen, Filter } from 'lucide-react';
import PixelButton from '../components/ui/PixelButton';
import { QuizResult, SUBJECTS } from '../types';
import { getGrade, formatTime } from '../utils/scoring';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'flagged' | 'unanswered'>('all');

  useEffect(() => {
    const stored = sessionStorage.getItem('quizResult');
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      navigate('/setup');
    }
  }, [navigate]);

  if (!result) return null;

  const grade = getGrade(result.percentage);
  
  const filteredQuestions = result.questions.map((q, i) => ({ question: q, answer: result.answers[i], index: i }))
    .filter(({ answer }) => {
      switch (reviewFilter) {
        case 'incorrect': return answer.selectedOption !== null && !answer.isCorrect;
        case 'flagged': return answer.isFlagged;
        case 'unanswered': return answer.selectedOption === null;
        default: return true;
      }
    });

  const incorrectCount = result.answers.filter(a => a.selectedOption !== null && !a.isCorrect).length;
  const unansweredCount = result.answers.filter(a => a.selectedOption === null).length;
  const flaggedCount = result.answers.filter(a => a.isFlagged).length;

  return (
    <div className="min-h-[100dvh] py-24 md:py-28 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Score Hero */}
        <div className="bg-pastel-surface border-2 border-pastel-charcoal p-8 sm:p-10 shadow-pixel-lg text-center mb-8 relative overflow-hidden">
          {/* Decorative corner badge */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-pastel-blue border-2 border-pastel-charcoal flex items-center justify-center shadow-pixel z-10 rotate-12">
            <Award size={28} className="text-black" />
          </div>

          <p className="font-pixel text-sm text-pastel-charcoal/50 tracking-widest uppercase mb-2">Your Score</p>
          <div className="font-pixel text-6xl sm:text-7xl md:text-8xl text-pastel-charcoal mb-2">
            {result.percentage}%
          </div>
          <p className={`font-pixel text-2xl ${grade.color} mb-4`}>{grade.label}</p>
          
          <div className="font-pixel text-lg text-pastel-charcoal/70">
            {result.totalCorrect} / {result.totalQuestions} correct
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <div className="bg-pastel-cream border-2 border-pastel-charcoal p-3">
              <div className="flex items-center justify-center gap-1 text-pastel-charcoal/50 mb-1">
                <CheckCircle size={14} />
              </div>
              <div className="font-pixel text-xl text-green-600">{result.totalCorrect}</div>
              <div className="font-pixel text-xs text-pastel-charcoal/50 tracking-wider uppercase">Correct</div>
            </div>
            <div className="bg-pastel-cream border-2 border-pastel-charcoal p-3">
              <div className="flex items-center justify-center gap-1 text-pastel-charcoal/50 mb-1">
                <XCircle size={14} />
              </div>
              <div className="font-pixel text-xl text-red-500">{incorrectCount}</div>
              <div className="font-pixel text-xs text-pastel-charcoal/50 tracking-wider uppercase">Wrong</div>
            </div>
            <div className="bg-pastel-cream border-2 border-pastel-charcoal p-3">
              <div className="flex items-center justify-center gap-1 text-pastel-charcoal/50 mb-1">
                <Target size={14} />
              </div>
              <div className="font-pixel text-xl text-pastel-charcoal">{result.totalAnswered}</div>
              <div className="font-pixel text-xs text-pastel-charcoal/50 tracking-wider uppercase">Attempted</div>
            </div>
            <div className="bg-pastel-cream border-2 border-pastel-charcoal p-3">
              <div className="flex items-center justify-center gap-1 text-pastel-charcoal/50 mb-1">
                <Clock size={14} />
              </div>
              <div className="font-pixel text-xl text-pastel-charcoal">{formatTime(result.timeTaken)}</div>
              <div className="font-pixel text-xs text-pastel-charcoal/50 tracking-wider uppercase">Time</div>
            </div>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="bg-pastel-surface border-2 border-pastel-charcoal p-6 shadow-pixel mb-8">
          <h3 className="font-pixel text-xl text-pastel-charcoal mb-4 flex items-center gap-2">
            <span className="w-3 h-6 bg-pastel-peach border-2 border-pastel-charcoal inline-block" />
            Subject Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(result.subjectBreakdown).map(([slug, data]) => {
              const subjectInfo = SUBJECTS.find(s => s.slug === slug);
              const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              return (
                <div key={slug} className="border-2 border-pastel-charcoal/20 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-pixel text-sm text-pastel-charcoal truncate max-w-[200px] sm:max-w-none">
                      {subjectInfo?.name || slug}
                    </span>
                    <span className="font-pixel text-sm text-pastel-charcoal ml-2 flex-shrink-0">
                      {data.correct}/{data.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-pastel-gray border border-pastel-charcoal/20">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        pct >= 75 ? 'bg-green-400' : pct >= 50 ? 'bg-yellow-400' : pct >= 25 ? 'bg-orange-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-pastel-surface border-2 border-pastel-charcoal p-6 shadow-pixel mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="font-pixel text-xl text-pastel-charcoal flex items-center gap-2">
              <span className="w-3 h-6 bg-pastel-blue border-2 border-pastel-charcoal inline-block" />
              Question Review
            </h3>
            <div className="flex flex-wrap gap-2">
              {([
                { key: 'all' as const, label: 'All', count: result.questions.length },
                { key: 'incorrect' as const, label: 'Wrong', count: incorrectCount },
                { key: 'flagged' as const, label: 'Flagged', count: flaggedCount },
                { key: 'unanswered' as const, label: 'Skipped', count: unansweredCount },
              ]).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setReviewFilter(f.key)}
                  className={`font-pixel text-xs px-3 py-1 border-2 transition-all ${
                    reviewFilter === f.key 
                      ? 'bg-pastel-blue border-pastel-charcoal text-black shadow-pixel-sm' 
                      : 'bg-pastel-surface border-pastel-charcoal/30 text-pastel-charcoal/60 hover:border-pastel-charcoal'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-8 text-pastel-charcoal/50">
              <Filter size={32} className="mx-auto mb-2 opacity-40" />
              <p className="font-pixel text-base">No questions match this filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map(({ question, answer, index }) => {
                const isExpanded = expandedQuestion === index;
                const isCorrect = answer.isCorrect;
                const isUnanswered = answer.selectedOption === null;
                const subjectInfo = SUBJECTS.find(s => s.slug === question.subjectSlug);

                return (
                  <div key={index} className={`border-2 transition-all ${
                    isUnanswered ? 'border-pastel-charcoal/30 bg-pastel-cream/50' :
                    isCorrect ? 'border-green-400/60 bg-green-50/50' : 'border-red-300/60 bg-red-50/50'
                  }`}>
                    <button
                      onClick={() => setExpandedQuestion(isExpanded ? null : index)}
                      className="w-full text-left p-4 flex items-start gap-3"
                    >
                      {/* Status Icon */}
                      <div className={`flex-shrink-0 w-8 h-8 border-2 flex items-center justify-center ${
                        isUnanswered ? 'bg-pastel-gray border-pastel-charcoal/30' :
                        isCorrect ? 'bg-green-400 border-green-600' : 'bg-red-300 border-red-500'
                      }`}>
                        {isUnanswered ? (
                          <span className="font-pixel text-sm text-pastel-charcoal/40">{index + 1}</span>
                        ) : isCorrect ? (
                          <CheckCircle size={16} className="text-white" />
                        ) : (
                          <XCircle size={16} className="text-white" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-pixel text-xs text-pastel-charcoal/50">Q{index + 1}</span>
                          <span className="font-pixel text-[10px] bg-pastel-gray/50 border border-pastel-charcoal/20 px-2 py-0.5 text-pastel-charcoal/50 truncate max-w-[120px] sm:max-w-none">
                            {subjectInfo?.name || question.subjectSlug}
                          </span>
                          {answer.isFlagged && <Flag size={12} className="text-orange-500 flex-shrink-0" />}
                        </div>
                        <p className="text-pastel-charcoal text-sm leading-relaxed line-clamp-2">
                          {question.question}
                        </p>
                      </div>

                      <div className="flex-shrink-0 text-pastel-charcoal/40">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t-2 border-pastel-charcoal/10 pt-3 animate-[fade-in-up_0.2s_ease-out_forwards]">
                        <div className="space-y-2 mb-4">
                          {question.options.map((opt, idx) => {
                            const letter = ['A', 'B', 'C', 'D'][idx];
                            const isCorrectOpt = letter === question.answer;
                            const isSelectedOpt = letter === answer.selectedOption;
                            
                            return (
                              <div key={letter} className={`flex items-start gap-2 p-2 text-sm ${
                                isCorrectOpt ? 'bg-green-100 border border-green-300' :
                                isSelectedOpt ? 'bg-red-100 border border-red-300' :
                                'opacity-60'
                              }`}>
                                <span className={`font-pixel text-sm w-6 text-center flex-shrink-0 ${
                                  isCorrectOpt ? 'text-green-700' : isSelectedOpt ? 'text-red-600' : 'text-pastel-charcoal/50'
                                }`}>{letter}.</span>
                                <span className="text-pastel-charcoal">{opt}</span>
                                {isCorrectOpt && <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" />}
                                {isSelectedOpt && !isCorrectOpt && <XCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />}
                              </div>
                            );
                          })}
                        </div>

                        {isUnanswered && (
                          <p className="text-sm text-pastel-charcoal/60 italic mb-2">
                            You skipped this question. Correct answer: <strong>{question.answer}</strong>
                          </p>
                        )}

                        {question.explanation && (
                          <div className="bg-pastel-blue/10 border-2 border-pastel-blue p-3 mt-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Info size={14} className="text-pastel-blue" />
                              <span className="font-pixel text-sm text-pastel-charcoal">Explanation</span>
                            </div>
                            <p className="text-pastel-charcoal/70 text-sm leading-relaxed">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <PixelButton 
            variant="secondary" 
            size="lg" 
            onClick={() => {
              sessionStorage.removeItem('quizResult');
              sessionStorage.removeItem('quizConfig');
              navigate('/setup');
            }}
            className="gap-2"
          >
            <RotateCcw size={20} /> New Quiz
          </PixelButton>
          <PixelButton 
            size="lg" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            Home <ArrowRight size={20} />
          </PixelButton>
        </div>
      </div>
    </div>
  );
};

export default Results;
