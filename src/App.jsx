import { useState, useLayoutEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechStack from './components/TechStack';
import Experience from './components/Experience';
import Achievements from './components/Achievements';
import Projects from './components/Projects';
import Contact from './components/Contact';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);
  // Default to dark mode or saved preference
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });
  const canvasRef = useRef(null);

  // Apply theme class to html element
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 🎇 Particle Effect (dark-mode only, twinkling)
  useLayoutEffect(() => {
    if (theme !== 'dark') return; // Only run in dark mode

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 0.5 + 0.1; // Slower movement
        this.opacity = Math.random() * 0.5 + 0.1;
        this.opacitySpeed = (Math.random() - 0.5) * 0.02; // Twinkle speed
      }

      update() {
        this.y -= this.speedY; // Move upwards
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
        }

        // Twinkle effect
        this.opacity += this.opacitySpeed;
        if (this.opacity <= 0.1 || this.opacity >= 0.6) {
          this.opacitySpeed = -this.opacitySpeed;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // White/Blueish sparkles
        ctx.fillStyle = `rgba(100, 108, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    particles = Array.from({ length: 50 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {!loading && (
        <div className="relative min-h-screen bg-black text-gray-900 dark:text-white transition-colors duration-300 overflow-hidden">
          {/* 🌌 Global Background */}
          <div className="absolute inset-0 bg-radial-soft opacity-[0.03] pointer-events-none"></div>

          {/* 🌌 Background particles */}
          <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10"
          />

          <Navbar theme={theme} toggleTheme={toggleTheme} />

          <main>
            <Hero />
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
            <Contact />
          </main>

          <footer className="py-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Hridayesh. All rights reserved.
          </footer>
        </div>
      )}
    </>
  );
}

export default App;
