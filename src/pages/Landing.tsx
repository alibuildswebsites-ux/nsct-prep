import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, Code, Shield, Database, Globe, Cpu, Monitor, Network, GitBranch, Settings, ArrowRight, Zap, Target, Award, ExternalLink } from 'lucide-react';
import PixelButton from '../components/ui/PixelButton';
import ParticleBackground from '../components/ui/ParticleBackground';
import { PixelCloud, PixelSun, PixelMoon, PixelStars } from '../components/ui/PixelDecorations';
import { useTheme } from '../context/ThemeContext';
import { SUBJECTS } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain size={20} />,
  Code: <Code size={20} />,
  GitBranch: <GitBranch size={20} />,
  Settings: <Settings size={20} />,
  Globe: <Globe size={20} />,
  Cpu: <Cpu size={20} />,
  Database: <Database size={20} />,
  Network: <Network size={20} />,
  Monitor: <Monitor size={20} />,
  Shield: <Shield size={20} />,
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="min-h-[100dvh]">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-28 lg:pt-40 lg:pb-32 px-3 sm:px-4 md:px-6 overflow-hidden bg-pastel-blue/10 border-b-4 border-pastel-charcoal">
        <ParticleBackground />
        
        {/* Sky decorations — responsive positioning & sizing */}
        {theme === 'day' ? (
          <>
            <div className="absolute top-24 right-3 sm:top-20 sm:right-6 md:top-16 md:right-12 lg:top-12 lg:right-20 z-0">
              <PixelSun />
            </div>
            <PixelCloud size="w-16 sm:w-20 md:w-28 lg:w-32" duration={35} delay={0} top="20%" />
            <PixelCloud size="w-12 sm:w-16 md:w-20 lg:w-24" duration={45} delay={8} top="35%" />
            <PixelCloud size="w-10 sm:w-12 md:w-16 lg:w-20" duration={30} delay={15} top="12%" />
          </>
        ) : (
          <>
            <div className="absolute top-24 right-3 sm:top-20 sm:right-6 md:top-16 md:right-12 lg:top-12 lg:right-20 z-0">
              <PixelMoon />
            </div>
            <PixelStars />
          </>
        )}

        {/* Glow orb — responsive sizing */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] md:w-[450px] lg:w-[600px] h-[200px] sm:h-[300px] md:h-[450px] lg:h-[600px] bg-white opacity-30 sm:opacity-40 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite] pointer-events-none z-0" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-pastel-surface border-2 border-pastel-charcoal px-3 py-1.5 sm:px-4 sm:py-2 shadow-pixel-sm mb-6 sm:mb-8">
            <BookOpen size={16} className="text-pastel-charcoal sm:w-[18px] sm:h-[18px]" />
            <span className="font-pixel text-xs sm:text-sm text-pastel-charcoal tracking-wider uppercase">
              Free Practice Platform
            </span>
          </div>

          <h1 className="font-pixel text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-pastel-charcoal leading-tight mb-4 sm:mb-6 drop-shadow-sm">
            NSCT<br />
            <span className="text-pastel-blue">PREP</span>
          </h1>
          
          <div className="border-l-4 border-pastel-peach pl-3 sm:pl-4 py-2 max-w-[90%] sm:max-w-2xl mx-auto mb-6 sm:mb-8 rounded-r-lg bg-pastel-surface/60 backdrop-blur-sm">
            <p className="font-mono text-sm sm:text-base md:text-lg text-pastel-charcoal leading-relaxed sm:leading-snug text-left">
              Practice for the HEC National Skills Competency Test with 14,000+ MCQs across 10 subjects.
              Choose your difficulty. Track your progress. Ace the exam.
            </p>
            <p className="text-left mt-2">
              <a 
                href="https://alibuildswebsites.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-pixel text-xs sm:text-sm text-pastel-blue hover:text-pastel-lavender transition-colors group"
              >
                Built by
                <span className="border-b-2 border-pastel-blue/40 group-hover:border-pastel-lavender/60 transition-colors">alibuildswebsites.me</span>
                <ExternalLink size={12} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 max-w-3xl mx-auto mb-8 sm:mb-10">
            {[
              { label: 'MCQs', value: '14,000+', icon: <Target size={16} className="sm:w-[18px] sm:h-[18px]" /> },
              { label: 'Subjects', value: '10', icon: <BookOpen size={16} className="sm:w-[18px] sm:h-[18px]" /> },
              { label: 'Levels', value: '3', icon: <Zap size={16} className="sm:w-[18px] sm:h-[18px]" /> },
              { label: 'Price', value: 'Free', icon: <Award size={16} className="sm:w-[18px] sm:h-[18px]" /> },
            ].map((stat) => (
              <div key={stat.label} className="bg-pastel-surface border-2 border-pastel-charcoal p-2.5 xs:p-3 sm:p-4 shadow-pixel-sm hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-center gap-1 mb-1 text-pastel-charcoal/60">
                  {stat.icon}
                </div>
                <div className="font-pixel text-xl xs:text-2xl sm:text-3xl text-pastel-charcoal">{stat.value}</div>
                <div className="font-pixel text-[10px] xs:text-xs text-pastel-charcoal/60 tracking-widest uppercase">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center">
            <PixelButton 
              size="lg" 
              onClick={() => navigate('/setup')}
              className="gap-2 w-full xs:w-auto"
            >
              Start Practice <ArrowRight size={20} />
            </PixelButton>
            <PixelButton 
              variant="secondary" 
              size="lg" 
              onClick={() => {
                document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full xs:w-auto"
            >
              View Subjects
            </PixelButton>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="py-16 md:py-24 px-4 bg-pastel-surface border-b-4 border-pastel-charcoal">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-pixel text-3xl sm:text-4xl text-pastel-charcoal text-center mb-4 flex items-center justify-center gap-3">
            <span className="w-3 h-8 sm:h-10 bg-pastel-peach border-2 border-pastel-charcoal inline-block" />
            Exam Subjects & Weightage
          </h2>
          <p className="text-center text-pastel-charcoal/70 mb-10 max-w-2xl mx-auto">
            Questions are distributed according to the official HEC NSCT exam weightage.
          </p>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {SUBJECTS.map((subject) => (
              <div 
                key={subject.slug}
                className="bg-pastel-cream border-2 border-pastel-charcoal p-4 sm:p-5 shadow-pixel hover:-translate-y-1 transition-transform group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-pastel-blue border-2 border-pastel-charcoal flex items-center justify-center text-black shadow-pixel-sm group-hover:bg-pastel-lavender transition-colors">
                    {iconMap[subject.icon]}
                  </div>
                  <div className="bg-pastel-peach border-2 border-pastel-charcoal px-3 py-1 shadow-pixel-sm">
                    <span className="font-pixel text-lg text-black">{subject.weight}%</span>
                  </div>
                </div>
                <h3 className="font-pixel text-lg text-pastel-charcoal leading-tight">{subject.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-4 bg-pastel-lavender/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-pixel text-3xl sm:text-4xl text-pastel-charcoal text-center mb-12 flex items-center justify-center gap-3">
            <span className="w-3 h-8 sm:h-10 bg-pastel-mint border-2 border-pastel-charcoal inline-block" />
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Choose Your Mode', desc: 'Full exam mix with official weightage, or focus on specific subjects.', color: 'bg-pastel-blue' },
              { step: '2', title: 'Set Difficulty', desc: 'Basic (recall), Intermediate (conceptual), or Expert (deep analysis).', color: 'bg-pastel-lavender' },
              { step: '3', title: 'Take the Quiz', desc: 'Answer MCQs one at a time, review explanations, and track your score.', color: 'bg-pastel-mint' },
            ].map((item) => (
              <div key={item.step} className="bg-pastel-surface border-2 border-pastel-charcoal p-6 shadow-pixel relative">
                <div className={`absolute -top-4 -left-4 w-10 h-10 ${item.color} border-2 border-pastel-charcoal flex items-center justify-center shadow-pixel-sm z-10`}>
                  <span className="font-pixel text-xl text-black">{item.step}</span>
                </div>
                <h3 className="font-pixel text-xl text-pastel-charcoal mb-2 mt-2">{item.title}</h3>
                <p className="text-pastel-charcoal/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <PixelButton size="lg" onClick={() => navigate('/setup')} className="gap-2">
              Start Now <ArrowRight size={20} />
            </PixelButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
