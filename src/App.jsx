import { useState, useLayoutEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechStack from './components/TechStack';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);
  // Default to dark mode
  const [theme, setTheme] = useState('dark');
  const canvasRef = useRef(null);

  // Apply theme class to html element
  useLayoutEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // 🎇 Particle Effect (dark-mode optimized)
  useLayoutEffect(() => {
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
        this.speedY = Math.random() * 1 + 0.2;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.y += this.speedY;
        if (this.y > canvas.height) {
          this.y = -this.size;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = theme === 'dark' ? `rgba(100, 108, 255, ${this.opacity})` : `rgba(83, 91, 242, ${this.opacity})`;
        ctx.fill();
      }
    }

    particles = Array.from({ length: 60 }, () => new Particle());

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
  }, [theme]); // Re-run when theme changes to update particle color

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {!loading && (
        <div className="relative min-h-screen bg-gray-50 dark:bg-[#242424] text-gray-900 dark:text-white transition-colors duration-300">

          {/* 🌌 Background particles */}
          <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10"
          />

          <Navbar theme={theme} toggleTheme={toggleTheme} />

          <main>
            <Hero />
            <TechStack />
            <Experience />
            <Projects />
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
