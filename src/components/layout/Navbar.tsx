import React, { useState } from 'react';
import { Menu, X, Sun, Moon, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Practice', path: '/setup' },
  ];

  const goHome = () => {
    if (location.pathname !== '/') navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-pastel-cream border-b-4 transition-colors duration-500 border-pastel-charcoal">
      <div className="w-full px-3 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-pastel-charcoal focus-visible:ring-offset-2 rounded" 
            onClick={goHome}
            role="button"
            tabIndex={0}
            aria-label="Go to Homepage"
            onKeyDown={(e) => { if(e.key === 'Enter') goHome(); }}
          >
             <div className="w-10 h-10 bg-pastel-blue border-2 border-pastel-charcoal flex items-center justify-center shadow-pixel-sm group-hover:bg-pastel-lavender transition-colors">
                <BookOpen className="w-6 h-6 text-black" />
             </div>
             <span className="font-pixel text-2xl font-bold text-pastel-charcoal tracking-tighter">NSCT PREP</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-baseline space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => { navigate(item.path); setIsOpen(false); }}
                  className={`
                    font-pixel text-lg transition-all duration-200 bg-transparent cursor-pointer relative px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-pastel-charcoal focus-visible:ring-offset-2
                    ${location.pathname === item.path 
                      ? 'text-pastel-charcoal bg-pastel-blue/30 border-2 border-pastel-charcoal shadow-pixel-sm -translate-y-1' 
                      : 'text-pastel-charcoal hover:text-pastel-blue border-2 border-transparent'}
                  `}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 border-l-2 border-pastel-charcoal/20 pl-6">
              <button
                onClick={toggleTheme}
                className="touch-target p-2 bg-pastel-gray border-2 border-pastel-charcoal hover:bg-pastel-blue transition-colors shadow-pixel-sm active:translate-y-[2px] active:shadow-none outline-none focus-visible:ring-2 focus-visible:ring-pastel-charcoal"
                title="Toggle Theme"
                aria-label="Toggle Theme"
              >
                {theme === 'day' ? <Moon size={20} className="text-pastel-charcoal" /> : <Sun size={20} className="text-pastel-charcoal" />}
              </button>
            </div>
          </div>
          
          {/* Mobile */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="touch-target p-2 bg-pastel-gray border-2 border-pastel-charcoal active:translate-y-[2px] outline-none focus-visible:ring-2 focus-visible:ring-pastel-charcoal"
              aria-label="Toggle Theme"
            >
              {theme === 'day' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="touch-target inline-flex items-center justify-center p-2 text-pastel-charcoal hover:bg-pastel-blue border-2 border-transparent hover:border-pastel-charcoal transition-all outline-none focus-visible:ring-2 focus-visible:ring-pastel-charcoal"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-pastel-cream border-b-4 overflow-hidden border-pastel-charcoal transition-all duration-300 ease-in-out grid ${
          isOpen ? 'grid-rows-[1fr] opacity-100 border-b-4' : 'grid-rows-[0fr] opacity-0 border-b-0'
        }`}
      >
        <div className="min-h-0">
          <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3 shadow-lg">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => { navigate(item.path); setIsOpen(false); }}
                className={`
                  block w-full text-left px-3 py-3 font-pixel text-xl transition-colors border-2 hover:border-pastel-charcoal mb-2 outline-none focus-visible:ring-2 focus-visible:ring-pastel-charcoal
                  ${location.pathname === item.path 
                    ? 'bg-pastel-blue text-black border-pastel-charcoal' 
                    : 'text-pastel-charcoal border-transparent hover:bg-pastel-blue hover:text-black'}
                `}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
