import { useState, useLayoutEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechStack from './components/TechStack';
import Experience from './components/Experience';
import Achievements from './components/Achievements';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Models from './components/Models';
import Contact from './components/Contact';
import LoadingScreen from './components/LoadingScreen';
import CursorFollower from './components/CursorFollower';

// Lazy load heavy 3D background
const ThreeBackground = lazy(() => import('./components/ThreeBackground'));

function App() {
  const [loading, setLoading] = useState(true);

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
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light-mode');
    } else {
      root.classList.remove('dark');
      root.classList.add('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {/* Custom cursor — always rendered */}
      <CursorFollower />

      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {!loading && (
        <div className="relative z-10 min-h-screen text-gray-900 dark:text-white transition-colors duration-300 overflow-hidden bg-transparent">

          {/* 🌌 Three.js 3D Background — lazy loaded */}
          <Suspense fallback={null}>
            <ThreeBackground />
          </Suspense>

          <Navbar theme={theme} toggleTheme={toggleTheme} />

          <main>
            <Hero theme={theme} toggleTheme={toggleTheme} />
            <TechStack />
            <div id="experience">
              <Experience />
            </div>
            <div id="achievements">
              <Achievements />
            </div>
            <div id="projects">
              <Projects />
            </div>
            <div id="certificates">
              <Certificates />
            </div>
            <div id="models">
              <Models />
            </div>
            <Contact />
          </main>

          <footer className="py-8 text-center text-gray-500 dark:text-gray-600 text-sm border-t border-gray-100 dark:border-gray-800">
            © {new Date().getFullYear()} Hridayesh. All rights reserved.
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
