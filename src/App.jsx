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
    root.classList.remove('light', 'dark', 'neon', 'neon-pink', 'matrix', 'light-mode');
    root.classList.add(theme);

    // Ensure tailwind sees them all as dark mode
    root.classList.add('dark');

    localStorage.setItem('theme', theme);
  }, [theme]);

  const mainRef = useRef(null);

  useLayoutEffect(() => {
    if (loading) return; // wait for load

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.stacked-panel');

      panels.forEach((panel, i) => {
        const isTall = () => panel.offsetHeight > window.innerHeight + 50;

        // Pin the panel
        ScrollTrigger.create({
          trigger: panel,
          start: () => (isTall() ? "bottom bottom" : "top top"),
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });

        // Scale down and fade effect when the next panel comes over
        if (i < panels.length - 1) {
          gsap.to(panel, {
            scale: 0.95,
            opacity: 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: panels[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
              onEnter: () => gsap.set(panel, { transformOrigin: isTall() ? "center bottom" : "center top" }),
              onEnterBack: () => gsap.set(panel, { transformOrigin: isTall() ? "center bottom" : "center top" }),
            }
          });
        }
      });
      ScrollTrigger.refresh();
    }, mainRef);

    // Give images a moment to load before refreshing scroll triggers
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => ctx.revert();
  }, [loading]);

  return (
    <>
      {/* Custom cursor — always rendered */}
      <SpaceshipAnimation />

      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {!loading && (
        <div className="relative z-10 min-h-screen text-[var(--text)] transition-colors duration-300 overflow-hidden bg-transparent">

          {/* 🌌 Three.js 3D Background — lazy loaded */}
          <Suspense fallback={null}>
            <ThreeBackground />
          </Suspense>

          <Navbar theme={theme} setTheme={setTheme} />

          <main ref={mainRef}>
            <div className="stacked-panel w-full min-h-screen bg-transparent flex flex-col justify-center border-b border-[var(--border)] shadow-2xl origin-top">
              <Hero theme={theme} />
            </div>
            <div className="stacked-panel w-full min-h-screen bg-transparent border-b border-[var(--border)] shadow-2xl origin-top flex flex-col justify-center pt-16">
              <TechStack />
            </div>
            <div id="experience" className="stacked-panel w-full min-h-screen bg-transparent border-b border-[var(--border)] shadow-2xl origin-top flex flex-col justify-center pt-16">
              <Experience />
            </div>
            <div id="achievements" className="stacked-panel w-full min-h-screen bg-transparent border-b border-[var(--border)] shadow-2xl origin-top flex flex-col justify-center pt-16">
              <Achievements />
            </div>
            <div id="projects" className="stacked-panel w-full min-h-screen bg-transparent border-b border-[var(--border)] shadow-2xl origin-top flex flex-col justify-center pt-16">
              <Portfolio />
            </div>
            <div className="stacked-panel w-full min-h-screen bg-transparent shadow-2xl origin-top flex flex-col justify-center pt-16">
              <Contact />
            </div>
            <div className="stacked-panel w-full min-h-screen bg-transparent shadow-2xl origin-top flex flex-col justify-center pt-16 z-10 pb-24">
              <About />
            </div>
          </main>

          <footer className="py-12 text-center border-t border-[var(--border)]">
            <p className="text-[var(--text-muted)] text-sm tracking-widest uppercase mb-2">
              Designed and developed by
            </p>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-hi mb-6">
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
