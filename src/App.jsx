import { useState, useLayoutEffect, lazy, Suspense, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechStack from './components/TechStack';
import Experience from './components/Experience';
import Achievements from './components/Achievements';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import About from './components/About';
import LoadingScreen from './components/LoadingScreen';
import SpaceshipAnimation from './components/SpaceshipAnimation';
import { useStackAnimation } from './hooks/useStackAnimation';

// Lazy load heavy 3D background
const ThreeBackground = lazy(() => import('./components/ThreeBackground'));

// Core sections ordered exactly as they should stack
const SECTIONS = [
  { id: 'hero', Component: Hero },
  { id: 'tech-stack', Component: TechStack },
  { id: 'experience', Component: Experience },
  { id: 'achievements', Component: Achievements },
  { id: 'projects', Component: Portfolio }, // maps to id="projects" inside
  { id: 'contact', Component: Contact },
  { id: 'about', Component: About }
];

function App() {
  const [loading, setLoading] = useState(true);
  const sectionRefs = useRef([]);

  // Default to dark mode or saved preference
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  // Apply theme class to html element
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'neon', 'neon-pink', 'matrix', 'light-mode');
    root.classList.add(theme);
    root.classList.add('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Initialise stacking animation with refs to all sections
  useStackAnimation(sectionRefs);

  return (
    <>
      {/* Custom cursor — always rendered */}
      <SpaceshipAnimation />

      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {!loading && (
        <div className="relative min-h-screen text-[var(--text)] transition-colors duration-300 bg-transparent">

          {/* 🌌 Three.js 3D Background — lazy loaded */}
          <Suspense fallback={null}>
            <ThreeBackground />
          </Suspense>

          <Navbar theme={theme} setTheme={setTheme} />

          <main className="stack-container w-full">
            {SECTIONS.map(({ Component, id }, i) => (
              <div
                key={id}
                ref={el => (sectionRefs.current[i] = el)}
                className="stack-section bg-[var(--bg)]/90 backdrop-blur-2xl flex flex-col justify-center border-b border-[var(--border)] shadow-2xl"
              >
                <Component theme={id === 'hero' ? theme : undefined} />
              </div>
            ))}
          </main>

          <footer className="py-12 text-center border-t border-[var(--border)] relative z-[100] bg-[var(--bg)]" style={{ fontFamily: 'var(--font-ui)' }}>
            <p className="text-[var(--text-muted)] text-sm tracking-widest uppercase mb-2">
              Designed and developed by
            </p>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hi mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Hridayesh
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-600 mb-4">
              Built with React · Three.js · GSAP · Vite · Tailwind CSS
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-gray-600 mb-4">
              <span>🎨 UI &amp; Motion — GSAP ScrollTrigger</span>
              <span>🌌 3D Background — Three.js</span>
              <span>⚡ Bundler — Vite</span>
              <span>🎯 Icons — Lucide React</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              © {new Date().getFullYear()} Hridayesh Debsarma · All rights reserved.
            </p>
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
