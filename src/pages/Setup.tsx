import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Clock, Zap, BookOpen, Target, Brain, Code, GitBranch, Settings, Globe, Cpu, Database, Network, Monitor, Shield, Check } from 'lucide-react';
import PixelButton from '../components/ui/PixelButton';
import { useTheme } from '../context/ThemeContext';
import { QuizConfig, Difficulty, QuizMode, SUBJECTS, QUESTION_PRESETS } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain size={24} />,
  Code: <Code size={24} />,
  GitBranch: <GitBranch size={24} />,
  Settings: <Settings size={24} />,
  Globe: <Globe size={24} />,
  Cpu: <Cpu size={24} />,
  Database: <Database size={24} />,
  Network: <Network size={24} />,
  Monitor: <Monitor size={24} />,
  Shield: <Shield size={24} />,
};

type Step = 'mode' | 'difficulty' | 'subjects' | 'count';

const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [step, setStep] = useState<Step>('mode');
  const [mode, setMode] = useState<QuizMode>('full-mix');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(25);
  const [customCount, setCustomCount] = useState('');
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(0);

  // Auto-calculate timer based on question count (1.5 min per question)
  useEffect(() => {
    if (timerEnabled) {
      setTimerMinutes(Math.ceil(questionCount * 1.5));
    }
  }, [questionCount, timerEnabled]);

  const steps: Step[] = mode === 'full-mix' 
    ? ['mode', 'difficulty', 'count'] 
    : ['mode', 'difficulty', 'subjects', 'count'];

  const currentStepIndex = steps.indexOf(step);
  const isLastStep = currentStepIndex === steps.length - 1;

  const goNext = () => {
    if (isLastStep) {
      // Start quiz
      const config: QuizConfig = {
        mode,
        difficulty,
        subjects: mode === 'full-mix' ? SUBJECTS.map(s => s.slug) : selectedSubjects,
        questionCount,
        timerEnabled,
        timerMinutes,
      };
      // Store config in sessionStorage and navigate to quiz
      sessionStorage.setItem('quizConfig', JSON.stringify(config));
      navigate('/quiz');
    } else {
      setStep(steps[currentStepIndex + 1]);
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
    } else {
      navigate('/');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'mode': return true;
      case 'difficulty': return true;
      case 'subjects': return selectedSubjects.length > 0;
      case 'count': return questionCount > 0 && questionCount <= 500;
      default: return false;
    }
  };

  const toggleSubject = (slug: string) => {
    setSelectedSubjects(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  };

  const handleCustomCount = (val: string) => {
    setCustomCount(val);
    const num = parseInt(val);
    if (!isNaN(num) && num > 0 && num <= 500) {
      setQuestionCount(num);
    }
  };

  return (
    <div className="min-h-[100dvh] py-24 md:py-32 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-pixel text-sm text-pastel-charcoal/60 tracking-wider uppercase">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="font-pixel text-sm text-pastel-charcoal/60 tracking-wider uppercase">
              {step === 'mode' && 'Quiz Mode'}
              {step === 'difficulty' && 'Difficulty'}
              {step === 'subjects' && 'Subjects'}
              {step === 'count' && 'Settings'}
            </span>
          </div>
          <div className="w-full h-3 bg-pastel-gray border-2 border-pastel-charcoal">
            <div 
              className="h-full bg-pastel-blue transition-all duration-500"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step: Mode Selection */}
        {step === 'mode' && (
          <div className="animate-[fade-in-up_0.4s_ease-out_forwards]">
            <h2 className="font-pixel text-3xl sm:text-4xl text-pastel-charcoal mb-2 flex items-center gap-3">
              <span className="w-3 h-8 bg-pastel-peach border-2 border-pastel-charcoal inline-block" />
              Choose Quiz Mode
            </h2>
            <p className="text-pastel-charcoal/70 mb-8 ml-6">How do you want to practice?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Mix */}
              <button
                onClick={() => setMode('full-mix')}
                className={`text-left bg-pastel-surface border-2 p-6 sm:p-8 transition-all hover:-translate-y-1 ${
                  mode === 'full-mix' 
                    ? 'border-pastel-blue shadow-pixel-lg ring-2 ring-pastel-blue/30' 
                    : 'border-pastel-charcoal shadow-pixel hover:shadow-pixel-lg'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 border-2 border-pastel-charcoal flex items-center justify-center shadow-pixel-sm ${
                    mode === 'full-mix' ? 'bg-pastel-blue' : 'bg-pastel-gray'
                  }`}>
                    <Target size={24} className="text-black" />
                  </div>
                  {mode === 'full-mix' && (
                    <div className="w-8 h-8 bg-pastel-mint border-2 border-pastel-charcoal flex items-center justify-center">
                      <Check size={16} className="text-black" />
                    </div>
                  )}
                </div>
                <h3 className="font-pixel text-2xl text-pastel-charcoal mb-2">Full Exam Mix</h3>
                <p className="text-pastel-charcoal/70 text-sm leading-relaxed">
                  Questions distributed across all 10 subjects following the official NSCT exam weightage.
                  Best for simulating the real exam.
                </p>
                <div className="mt-4 flex flex-wrap gap-1">
                  {SUBJECTS.map(s => (
                    <span key={s.slug} className="font-pixel text-[10px] bg-pastel-gray/50 border border-pastel-charcoal/20 px-2 py-0.5 text-pastel-charcoal/60">
                      {s.weight}%
                    </span>
                  ))}
                </div>
              </button>

              {/* Subject Focus */}
              <button
                onClick={() => setMode('subject-focus')}
                className={`text-left bg-pastel-surface border-2 p-6 sm:p-8 transition-all hover:-translate-y-1 ${
                  mode === 'subject-focus' 
                    ? 'border-pastel-lavender shadow-pixel-lg ring-2 ring-pastel-lavender/30' 
                    : 'border-pastel-charcoal shadow-pixel hover:shadow-pixel-lg'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 border-2 border-pastel-charcoal flex items-center justify-center shadow-pixel-sm ${
                    mode === 'subject-focus' ? 'bg-pastel-lavender' : 'bg-pastel-gray'
                  }`}>
                    <BookOpen size={24} className="text-black" />
                  </div>
                  {mode === 'subject-focus' && (
                    <div className="w-8 h-8 bg-pastel-mint border-2 border-pastel-charcoal flex items-center justify-center">
                      <Check size={16} className="text-black" />
                    </div>
                  )}
                </div>
                <h3 className="font-pixel text-2xl text-pastel-charcoal mb-2">Subject Focus</h3>
                <p className="text-pastel-charcoal/70 text-sm leading-relaxed">
                  Pick one or more subjects to focus on. Great for targeted revision 
                  of specific areas you want to improve.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step: Difficulty */}
        {step === 'difficulty' && (
          <div className="animate-[fade-in-up_0.4s_ease-out_forwards]">
            <h2 className="font-pixel text-3xl sm:text-4xl text-pastel-charcoal mb-2 flex items-center gap-3">
              <span className="w-3 h-8 bg-pastel-mint border-2 border-pastel-charcoal inline-block" />
              Select Difficulty
            </h2>
            <p className="text-pastel-charcoal/70 mb-8 ml-6">Choose your challenge level.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {([
                { 
                  key: 'basic' as Difficulty, 
                  title: 'Basic', 
                  desc: 'Definitions, recall & fundamental concepts. Good for beginners.',
                  color: 'bg-pastel-mint',
                  borderColor: 'border-pastel-mint',
                  icon: <BookOpen size={28} className="text-black" />,
                  mcqs: '~4,500'
                },
                { 
                  key: 'intermediate' as Difficulty, 
                  title: 'Intermediate', 
                  desc: 'Conceptual understanding & application. Matches exam difficulty.',
                  color: 'bg-pastel-blue',
                  borderColor: 'border-pastel-blue',
                  icon: <Zap size={28} className="text-black" />,
                  mcqs: '~5,000'
                },
                { 
                  key: 'expert' as Difficulty, 
                  title: 'Expert', 
                  desc: 'Deep analysis, problem-solving & advanced scenarios.',
                  color: 'bg-pastel-peach',
                  borderColor: 'border-pastel-peach',
                  icon: <Brain size={28} className="text-black" />,
                  mcqs: '~4,500'
                },
              ]).map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDifficulty(d.key)}
                  className={`text-left bg-pastel-surface border-2 p-6 transition-all hover:-translate-y-1 relative ${
                    difficulty === d.key 
                      ? `${d.borderColor} shadow-pixel-lg ring-2 ring-pastel-blue/20` 
                      : 'border-pastel-charcoal shadow-pixel hover:shadow-pixel-lg'
                  }`}
                >
                  {difficulty === d.key && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-pastel-mint border-2 border-pastel-charcoal flex items-center justify-center shadow-pixel-sm z-10">
                      <Check size={16} className="text-black" />
                    </div>
                  )}
                  <div className={`w-14 h-14 ${d.color} border-2 border-pastel-charcoal flex items-center justify-center shadow-pixel-sm mb-4`}>
                    {d.icon}
                  </div>
                  <h3 className="font-pixel text-2xl text-pastel-charcoal mb-2">{d.title}</h3>
                  <p className="text-pastel-charcoal/70 text-sm leading-relaxed mb-3">{d.desc}</p>
                  <span className="font-pixel text-xs text-pastel-charcoal/50 tracking-wider">{d.mcqs} MCQs</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Subject Selection */}
        {step === 'subjects' && (
          <div className="animate-[fade-in-up_0.4s_ease-out_forwards]">
            <h2 className="font-pixel text-3xl sm:text-4xl text-pastel-charcoal mb-2 flex items-center gap-3">
              <span className="w-3 h-8 bg-pastel-blue border-2 border-pastel-charcoal inline-block" />
              Select Subjects
            </h2>
            <p className="text-pastel-charcoal/70 mb-2 ml-6">Pick one or more subjects to practice.</p>
            <div className="flex items-center gap-4 mb-8 ml-6">
              <span className="font-pixel text-sm text-pastel-charcoal/50">
                {selectedSubjects.length} selected
              </span>
              <button
                onClick={() => setSelectedSubjects(selectedSubjects.length === SUBJECTS.length ? [] : SUBJECTS.map(s => s.slug))}
                className="font-pixel text-sm text-pastel-blue hover:text-pastel-lavender transition-colors"
              >
                {selectedSubjects.length === SUBJECTS.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4">
              {SUBJECTS.map((subject) => {
                const isSelected = selectedSubjects.includes(subject.slug);
                return (
                  <button
                    key={subject.slug}
                    onClick={() => toggleSubject(subject.slug)}
                    className={`text-left p-4 border-2 transition-all hover:-translate-y-1 relative ${
                      isSelected 
                        ? 'bg-pastel-blue/20 border-pastel-blue shadow-pixel-sm' 
                        : 'bg-pastel-surface border-pastel-charcoal shadow-pixel hover:shadow-pixel-sm'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-pastel-mint border-2 border-pastel-charcoal flex items-center justify-center z-10">
                        <Check size={12} className="text-black" />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 border-2 border-pastel-charcoal flex items-center justify-center text-black ${
                        isSelected ? 'bg-pastel-blue' : 'bg-pastel-gray'
                      }`}>
                        {iconMap[subject.icon]}
                      </div>
                      <div>
                        <h3 className="font-pixel text-base text-pastel-charcoal leading-tight">{subject.name}</h3>
                        <span className="font-pixel text-xs text-pastel-charcoal/50">{subject.weight}% weight</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step: Count & Timer */}
        {step === 'count' && (
          <div className="animate-[fade-in-up_0.4s_ease-out_forwards]">
            <h2 className="font-pixel text-3xl sm:text-4xl text-pastel-charcoal mb-2 flex items-center gap-3">
              <span className="w-3 h-8 bg-pastel-lavender border-2 border-pastel-charcoal inline-block" />
              Quiz Settings
            </h2>
            <p className="text-pastel-charcoal/70 mb-8 ml-6">How many questions and do you want a timer?</p>

            {/* Question Count */}
            <div className="bg-pastel-surface border-2 border-pastel-charcoal p-6 shadow-pixel mb-6">
              <h3 className="font-pixel text-xl text-pastel-charcoal mb-4">Number of Questions</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {QUESTION_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => { setQuestionCount(preset); setCustomCount(''); }}
                    className={`font-pixel text-lg px-6 py-3 border-2 transition-all ${
                      questionCount === preset && !customCount
                        ? 'bg-pastel-blue border-pastel-charcoal shadow-pixel-sm text-black'
                        : 'bg-pastel-surface border-pastel-charcoal hover:bg-pastel-gray text-pastel-charcoal shadow-pixel active:shadow-pixel-press active:translate-y-[2px]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-pixel text-base text-pastel-charcoal/70">Custom:</span>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={customCount}
                  onChange={(e) => handleCustomCount(e.target.value)}
                  placeholder="1-500"
                  className="w-28 bg-pastel-cream border-2 border-pastel-charcoal text-pastel-charcoal p-2 font-pixel text-lg focus:outline-none focus:border-pastel-blue"
                />
              </div>
            </div>

            {/* Timer */}
            <div className="bg-pastel-surface border-2 border-pastel-charcoal p-6 shadow-pixel mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-pixel text-xl text-pastel-charcoal flex items-center gap-2">
                  <Clock size={20} /> Timer
                </h3>
                <button
                  onClick={() => setTimerEnabled(!timerEnabled)}
                  className={`w-14 h-8 border-2 border-pastel-charcoal relative transition-colors ${
                    timerEnabled ? 'bg-pastel-mint' : 'bg-pastel-gray'
                  }`}
                >
                  <div className={`w-6 h-6 bg-pastel-surface border-2 border-pastel-charcoal absolute top-0 transition-transform ${
                    timerEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              {timerEnabled && (
                <div className="flex items-center gap-3">
                  <span className="font-pixel text-base text-pastel-charcoal/70">Duration:</span>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 1)}
                    className="w-24 bg-pastel-cream border-2 border-pastel-charcoal text-pastel-charcoal p-2 font-pixel text-lg focus:outline-none focus:border-pastel-blue"
                  />
                  <span className="font-pixel text-base text-pastel-charcoal/70">minutes</span>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-pastel-blue/10 border-2 border-pastel-charcoal p-6 shadow-pixel-sm">
              <h3 className="font-pixel text-lg text-pastel-charcoal mb-3">Summary</h3>
              <div className="grid grid-cols-2 gap-2 font-pixel text-sm">
                <span className="text-pastel-charcoal/60">Mode:</span>
                <span className="text-pastel-charcoal">{mode === 'full-mix' ? 'Full Exam Mix' : 'Subject Focus'}</span>
                <span className="text-pastel-charcoal/60">Difficulty:</span>
                <span className="text-pastel-charcoal capitalize">{difficulty}</span>
                {mode === 'subject-focus' && (
                  <>
                    <span className="text-pastel-charcoal/60">Subjects:</span>
                    <span className="text-pastel-charcoal">{selectedSubjects.length} selected</span>
                  </>
                )}
                <span className="text-pastel-charcoal/60">Questions:</span>
                <span className="text-pastel-charcoal">{questionCount}</span>
                <span className="text-pastel-charcoal/60">Timer:</span>
                <span className="text-pastel-charcoal">{timerEnabled ? `${timerMinutes} min` : 'Off'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-10">
          <PixelButton variant="secondary" onClick={goBack} className="gap-2">
            <ArrowLeft size={18} /> Back
          </PixelButton>
          <PixelButton 
            onClick={goNext} 
            disabled={!canProceed()}
            className="gap-2"
          >
            {isLastStep ? 'Start Quiz' : 'Next'} <ArrowRight size={18} />
          </PixelButton>
        </div>
      </div>
    </div>
  );
};

export default Setup;
