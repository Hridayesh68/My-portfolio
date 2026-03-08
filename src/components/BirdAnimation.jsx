import { useEffect, useRef, useState } from 'react';

const BirdAnimation = () => {
    const containerRef = useRef(null);
    const birdRef = useRef(null);

    // State for positions
    const pos = useRef({ x: -200, y: -200 });
    const prevPos = useRef({ x: -200, y: -200 });
    const cursor = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 500 });
    const target = useRef({ x: 0, y: 0 });
    const phase = useRef('idle'); // 'flying-in' | 'drifting'
    const lastSection = useRef(-1);

    const entryDirections = [
        { x: -0.2, y: 0.5 },   // from LEFT
        { x: 1.2, y: 0.5 },    // from RIGHT
        { x: 0.5, y: -0.2 },   // from TOP
        { x: 0.8, y: 1.2 },    // from BOTTOM-RIGHT
        { x: 0.2, y: 1.2 },    // from BOTTOM-LEFT
        { x: 1.2, y: 0.2 },    // from TOP-RIGHT
    ];

    const lerp = (a, b, t) => a + (b - a) * t;
    const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const birdContainer = containerRef.current;
        const birdSVG = birdRef.current;
        if (!birdContainer || !birdSVG) return;

        // Movement Loop
        let animationFrameId;

        const rotateBird = () => {
            const dx = pos.current.x - prevPos.current.x;
            const dy = pos.current.y - prevPos.current.y;

            const speed = Math.hypot(dx, dy);
            if (speed < 0.1) return; // avoid jitter when stationary

            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const flyingLeft = Math.abs(angle) > 90;

            // Flip bird on Y axis when flying leftward
            const scaleY = flyingLeft ? -1 : 1;
            const dispAngle = flyingLeft ? angle + 180 : angle;

            // Slight bank tilt proportional to horizontal speed
            const bank = Math.max(-18, Math.min(18, dx * 1.2));

            birdSVG.style.transform = `rotate(${dispAngle}deg) scaleY(${scaleY}) rotate(${bank}deg)`;

            // Fast-flap class when speed > threshold
            birdContainer.classList.toggle('fast', speed > 5);
        };

        const animate = () => {
            prevPos.current = { ...pos.current };

            if (phase.current === 'flying-in') {
                pos.current.x = lerp(pos.current.x, target.current.x, 0.045);
                pos.current.y = lerp(pos.current.y, target.current.y, 0.045);

                if (dist(pos.current, target.current) < 30) {
                    phase.current = 'drifting';
                }
            }

            if (phase.current === 'drifting') {
                const DRIFT_SPEED = 0.018;
                const HOVER_DIST = 80;

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
            birdContainer.style.transform = `translate(${pos.current.x - 45}px, ${pos.current.y - 30}px)`;

            rotateBird();
            animationFrameId = requestAnimationFrame(animate);
        };

        const flyIntoSection = (index) => {
            const dir = entryDirections[index % entryDirections.length];
            pos.current.x = dir.x * window.innerWidth;
            pos.current.y = dir.y * window.innerHeight;

            target.current.x = window.innerWidth * 0.5;
            target.current.y = window.innerHeight * 0.5;

            phase.current = 'flying-in';
            birdContainer.style.opacity = '1';
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

        // Initial entry
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
            id="bird-container"
            className="pointer-events-none fixed top-0 left-0 z-[10000] opacity-0 transition-opacity duration-500"
            style={{ willChange: 'transform' }}
        >
            <svg
                ref={birdRef}
                id="bird"
                viewBox="0 0 120 80"
                className="w-[90px] h-[60px]"
            >
                {/* Bird Body */}
                <ellipse cx="60" cy="40" rx="25" ry="15" fill="#646cff" />
                <circle cx="80" cy="35" r="10" fill="#646cff" />
                <polygon points="90,35 100,38 90,41" fill="#ffaa00" />
                <ellipse cx="85" cy="33" rx="2" ry="2" fill="white" />
                <circle cx="85" cy="33" r="1" fill="black" />

                {/* Wings */}
                <g id="wing-left" className="origin-[60px_40px]">
                    <path d="M60,40 Q40,10 20,40" fill="none" stroke="#646cff" strokeWidth="4" strokeLinecap="round" />
                    <path d="M60,40 Q40,5 15,35" fill="#646cff" opacity="0.8" />
                </g>
                <g id="wing-right" className="origin-[60px_40px]">
                    <path d="M60,40 Q40,70 20,40" fill="none" stroke="#646cff" strokeWidth="4" strokeLinecap="round" />
                    <path d="M60,40 Q40,75 15,45" fill="#646cff" opacity="0.6" />
                </g>
            </svg>
            <div id="glow" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10"></div>

            <style>{`
        @keyframes flapUp {
          0%, 100% { transform: rotateX(0deg); }
          50% { transform: rotateX(-55deg); }
        }

        @keyframes flapDown {
          0%, 100% { transform: rotateX(0deg); }
          50% { transform: rotateX(55deg); }
        }

        #wing-left { 
          animation: flapUp 0.48s ease-in-out infinite;
          transform-origin: 60px 40px;
        }
        
        #wing-right { 
          animation: flapDown 0.48s ease-in-out infinite;
          transform-origin: 60px 40px;
        }

        #bird-container.fast #wing-left,
        #bird-container.fast #wing-right {
          animation-duration: 0.22s;
        }
        
        .dark #bird ellipse, .dark #bird circle, .dark #bird path {
          fill: #8a2be2;
          stroke: #8a2be2;
        }
        
        .dark #glow {
          background-color: rgba(138, 43, 226, 0.3);
        }
      `}</style>
        </div>
    );
};

export default BirdAnimation;
