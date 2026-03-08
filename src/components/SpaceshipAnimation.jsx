import { useEffect, useRef, useState } from 'react';

const SpaceshipAnimation = () => {
    const containerRef = useRef(null);
    const shipRef = useRef(null);

    // State for positions
    const pos = useRef({ x: -200, y: -200 });
    const prevPos = useRef({ x: -200, y: -200 });
    const cursor = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 500 });
    const target = useRef({ x: 0, y: 0 });
    const phase = useRef('idle'); // 'flying-in' | 'drifting'
    const lastSection = useRef(-1);

    const entryDirections = [
        { x: -0.1, y: 0.5 },   // from LEFT
        { x: 1.1, y: 0.5 },    // from RIGHT
        { x: 0.5, y: -0.1 },   // from TOP
        { x: 0.8, y: 1.1 },    // from BOTTOM-RIGHT
        { x: 0.2, y: 1.1 },    // from BOTTOM-LEFT
        { x: 1.1, y: 0.2 },    // from TOP-RIGHT
    ];

    const lerp = (a, b, t) => a + (b - a) * t;
    const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const shipContainer = containerRef.current;
        const shipSVG = shipRef.current;
        if (!shipContainer || !shipSVG) return;

        // Movement Loop
        let animationFrameId;

        const rotateShip = () => {
            const dx = pos.current.x - prevPos.current.x;
            const dy = pos.current.y - prevPos.current.y;

            const speed = Math.hypot(dx, dy);
            if (speed < 0.1) return;

            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const flyingLeft = Math.abs(angle) > 90;

            // Ship doesn't flip on Y like a bird, it just rotates towards target
            // But we might want it to stay upright-ish or roll
            const scaleY = flyingLeft ? -1 : 1;
            const dispAngle = flyingLeft ? angle + 180 : angle;

            // Banking effect
            const bank = Math.max(-15, Math.min(15, dx * 1.5));

            shipSVG.style.transform = `rotate(${dispAngle}deg) scaleY(${scaleY}) rotate(${bank}deg)`;

            // Fast-engine class when speed > threshold
            shipContainer.classList.toggle('fast', speed > 5);
        };

        const animate = () => {
            prevPos.current = { ...pos.current };

            if (phase.current === 'flying-in') {
                pos.current.x = lerp(pos.current.x, target.current.x, 0.05);
                pos.current.y = lerp(pos.current.y, target.current.y, 0.05);

                if (dist(pos.current, target.current) < 20) {
                    phase.current = 'drifting';
                }
            }

            if (phase.current === 'drifting') {
                const DRIFT_SPEED = 0.02;
                const HOVER_DIST = 60;

                const dx = cursor.current.x - pos.current.x;
                const dy = cursor.current.y - pos.current.y;
                const d = Math.sqrt(dx * dx + dy * dy);

                if (d > HOVER_DIST) {
                    const tx = cursor.current.x - (dx / d) * HOVER_DIST;
                    const ty = cursor.current.y - (dy / d) * HOVER_DIST;
                    pos.current.x = lerp(pos.current.x, tx, DRIFT_SPEED);
                    pos.current.y = lerp(pos.current.y, ty, DRIFT_SPEED);
                }
            }

            // Apply position
            shipContainer.style.transform = `translate(${pos.current.x - 30}px, ${pos.current.y - 20}px)`;

            rotateShip();
            animationFrameId = requestAnimationFrame(animate);
        };

        const flyIntoSection = (index) => {
            const dir = entryDirections[index % entryDirections.length];
            pos.current.x = dir.x * window.innerWidth;
            pos.current.y = dir.y * window.innerHeight;

            target.current.x = window.innerWidth * 0.5;
            target.current.y = window.innerHeight * 0.5;

            phase.current = 'flying-in';
            shipContainer.style.opacity = '1';
        };

        const getCurrentSection = () => {
            const sections = document.querySelectorAll('.stacked-panel, section');
            let maxVisibleHeight = 0;
            let mostVisibleIndex = -1;

            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

                if (visibleHeight > maxVisibleHeight) {
                    maxVisibleHeight = visibleHeight;
                    mostVisibleIndex = index;
                }
            });
            return mostVisibleIndex;
        };

        const handleScroll = () => {
            const current = getCurrentSection();
            if (current !== -1 && current !== lastSection.current) {
                lastSection.current = current;
                flyIntoSection(current);
            }
        };

        const handleMouseMove = (e) => {
            cursor.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        handleScroll();
        animate();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            id="ship-container"
            className="pointer-events-none fixed top-0 left-0 z-[10000] opacity-0 transition-opacity duration-500"
            style={{ willChange: 'transform' }}
        >
            <svg
                ref={shipRef}
                id="spaceship"
                viewBox="0 0 80 40"
                className="w-[60px] h-[30px]"
            >
                {/* Thruster Flame/Glow */}
                <path id="thruster-flame" d="M15,20 L0,15 L5,20 L0,25 Z" fill="#00f2ff" />

                {/* Main Body */}
                <path d="M15,10 L60,10 L75,20 L60,30 L15,30 Z" fill="#2d2d2d" stroke="#646cff" strokeWidth="1.5" />

                {/* Cockpit */}
                <path d="M45,15 L55,15 L60,20 L55,25 L45,25 Z" fill="#00f2ff" opacity="0.6" />

                {/* Fins */}
                <path d="M30,10 L45,0 L55,10 Z" fill="#3d3d3d" stroke="#646cff" strokeWidth="1" />
                <path d="M30,30 L45,40 L55,30 Z" fill="#3d3d3d" stroke="#646cff" strokeWidth="1" />

                {/* Detail Lines */}
                <line x1="20" y1="15" x2="40" y2="15" stroke="#646cff" strokeWidth="0.5" opacity="0.5" />
                <line x1="20" y1="25" x2="40" y2="25" stroke="#646cff" strokeWidth="0.5" opacity="0.5" />
            </svg>

            {/* Engine Glow */}
            <div id="ship-glow" className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-8 bg-cyan-400/40 rounded-full blur-xl -z-10"></div>

            <style>{`
        @keyframes thrustGlow {
          0%, 100% { transform: scale(1) translateX(0); opacity: 0.8; }
          50% { transform: scale(1.4) translateX(-5px); opacity: 1; filter: brightness(1.5); }
        }

        #thruster-flame {
          animation: thrustGlow 0.15s ease-in-out infinite;
          transform-origin: 15px 20px;
        }

        #ship-container.fast #thruster-flame {
          animation-duration: 0.08s;
          fill: #ff00ff;
        }

        #ship-container.fast #ship-glow {
          background-color: rgba(255, 0, 255, 0.4);
        }

        .dark #spaceship path, .dark #spaceship line {
          stroke: #8a2be2;
        }
        
        .dark #thruster-flame {
          fill: #00f2ff;
        }
        
        .dark #spaceship path[fill="#2d2d2d"] {
          fill: #1a1a1a;
        }
      `}</style>
        </div>
    );
};

export default SpaceshipAnimation;
