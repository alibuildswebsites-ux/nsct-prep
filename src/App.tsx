import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';

const Setup = lazy(() => import('./pages/Setup'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Results = lazy(() => import('./pages/Results'));

const LoadingFallback = () => (
  <div className="min-h-[100dvh] flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 bg-pastel-blue border-2 border-pastel-charcoal flex items-center justify-center shadow-pixel mx-auto mb-4 animate-pulse">
        <span className="font-pixel text-xl text-black">?</span>
      </div>
      <p className="font-pixel text-lg text-pastel-charcoal">Loading...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <div className="min-h-[100dvh] flex flex-col bg-pastel-cream transition-colors duration-500">
          <Navbar />
          <main className="flex-grow pt-0">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/setup" element={<Setup />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/results" element={<Results />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
