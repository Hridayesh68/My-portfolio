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
import CursorFollower from './components/CursorFollower';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    root.classList.remove('light', 'dark', 'neon', 'light-mode');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'neon';
      return 'light';
    });
  };

  const mainRef = useRef(null);

  useLayoutEffect(() => {
    if (loading) return; // wait for load

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.stacked-panel');

      panels.forEach((panel, i) => {
        // Pin the panel
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          pin: true,
          pinSpacing: false,
        });

        // Scale down and fade effect when the next panel comes over
        if (i < panels.length - 1) {
          gsap.to(panel, {
            scale: 0.92,
            opacity: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: panels[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
            }
          });
        }
      });
    }, mainRef);

    return () => ctx.revert();
  }, [loading]);

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

          <main ref={mainRef}>
            <div className="stacked-panel w-full min-h-screen bg-white/40 dark:bg-black/40 backdrop-blur-sm flex flex-col justify-center border-b border-black/5 dark:border-white/5 shadow-2xl origin-top">
              <Hero theme={theme} toggleTheme={toggleTheme} />
            </div>
            <div className="stacked-panel w-full min-h-screen bg-white/60 dark:bg-black/60 backdrop-blur-sm border-b border-black/5 dark:border-white/5 shadow-2xl origin-top flex flex-col justify-center pt-16">
              <TechStack />
            </div>
            <div id="experience" className="stacked-panel w-full min-h-screen bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-black/5 dark:border-white/5 shadow-2xl origin-top flex flex-col justify-center pt-16">
              <Experience />
            </div>
            <div id="achievements" className="stacked-panel w-full min-h-screen bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 shadow-2xl origin-top flex flex-col justify-center pt-16">
              <Achievements />
            </div>
            <div id="projects" className="stacked-panel w-full min-h-screen bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-black/5 dark:border-white/5 shadow-2xl origin-top flex flex-col justify-center pt-16">
              <Portfolio />
            </div>
            <div className="stacked-panel w-full min-h-screen bg-white dark:bg-neutral-900 shadow-2xl origin-top flex flex-col justify-center pt-16">
              <Contact />
            </div>
            <div className="stacked-panel w-full min-h-screen bg-white dark:bg-black shadow-2xl origin-top flex flex-col justify-center pt-16 z-10 pb-24">
              <About />
            </div>
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
