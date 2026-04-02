import React from 'react';
import { BookOpen } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-footer-bg text-footer-text pt-12 pb-6 border-t-4 border-pastel-blue relative overflow-hidden transition-colors duration-500">
      <div className="w-full px-3 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
          
          {/* Branding */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-pastel-blue border-2 border-white flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-black" />
              </div>
              <h3 className="font-pixel text-3xl text-white tracking-widest">NSCT PREP</h3>
            </div>
            <p className="text-footer-muted max-w-sm text-base leading-relaxed opacity-90">
              Free MCQ practice platform for the HEC National Skills Competency Test.
              14,000+ questions across 10 subjects.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h4 className="font-pixel text-xl mb-4 text-pastel-peach border-b-2 border-pastel-peach inline-block pb-1">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://nsct.hec.gov.pk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-pixel text-lg text-footer-text hover:text-pastel-blue tracking-wide transition-colors"
                >
                  HEC NSCT Official
                </a>
              </li>
              <li>
                <a 
                  href="https://nsct.hec.gov.pk/AreasOfCompetencies" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-pixel text-lg text-footer-text hover:text-pastel-blue tracking-wide transition-colors"
                >
                  Exam Weightage Guide
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-pixel text-sm text-gray-400 opacity-60 tracking-wide">
            Built for students, by students. Not affiliated with HEC.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-black/20 px-4 py-2 rounded-full border border-white/5">
            <span>Made with</span>
            <svg width="16" height="14" viewBox="0 0 8 7" className="animate-pulse" shapeRendering="crispEdges">
              <path d="M1 0h2v1H1z M0 1h4v3H0z M1 4h3v1H1z M2 5h2v1H2z M3 6h1v1H3z" fill="#FF9EAA" />
              <path d="M5 0h2v1H5z M4 1h4v3H4z M4 4h3v1H4z M4 5h2v1H4z M4 6h1v1H4z" fill="#FF2A6D" />
            </svg>
            <span>using React & Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
