import { useState, useLayoutEffect, useRef } from 'react';
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

// Eagerly load 3D background to prevent hydration white-flash
import ThreeBackground from './components/ThreeBackground';

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
      // ── Animate panels fading in on scroll ──
      const panels = gsap.utils.toArray('.stack-section');
      panels.forEach((panel) => {
        gsap.fromTo(panel, 
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 85%",
              toggleActions: "play reverse play reverse"
            }
          }
        );
      });

      ScrollTrigger.refresh();
    }, mainRef);

    // Give images a moment to load before refreshing scroll triggers
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timeout);
      ctx.revert();
    };
  }, [loading]);

  return (
    <>
      {/* Custom cursor — always rendered */}
      <SpaceshipAnimation />

      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {!loading && (
        <div className="relative z-10 min-h-screen text-[var(--text)] transition-colors duration-300 overflow-x-hidden bg-transparent">

          {/* 🌌 Three.js 3D Background */}
          <ThreeBackground />

          <Navbar theme={theme} setTheme={setTheme} />

          <main ref={mainRef} className="relative z-10 flex flex-col">
            <div className="stack-section w-full">
              <Hero theme={theme} />
            </div>
            <div className="stack-section w-full">
              <TechStack />
            </div>
            <div id="experience" className="stack-section w-full">
              <Experience />
            </div>
            <div id="achievements" className="stack-section w-full">
              <Achievements />
            </div>
            <div id="projects" className="stack-section w-full">
              <Portfolio />
            </div>
            <div className="stack-section w-full">
              <Contact />
            </div>
            <div className="stack-section w-full pb-24">
              <About />
            </div>
          </main>

          <footer className="py-12 text-center border-t border-[var(--border)]" style={{ fontFamily: 'var(--font-ui)' }}>
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
