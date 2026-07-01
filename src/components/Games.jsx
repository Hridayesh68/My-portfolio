import { useState, useEffect, useRef, useLayoutEffect, memo } from 'react';
import { Github, ExternalLink, Download, Monitor, Smartphone, Gamepad2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 3D Tilt Card Wrapper Component using GSAP
const Card3D = ({ children, className = '', isBobbing = false }) => {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const rotateY = ((x - xc) / xc) * 8; // max 8 deg tilt
        const rotateX = -((y - yc) / yc) * 8; // max 8 deg tilt

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            ease: 'power3.out',
            duration: 0.5,
            transformPerspective: 1000
        });
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            ease: 'power3.out',
            duration: 0.5
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`${className} ${isBobbing ? 'animate-float' : ''}`}
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
            {children}
        </div>
    );
};

// Rising Bubble Particles Simulator for Flappy Fish
const BubbleParticles = ({ active }) => {
    const [bubbles, setBubbles] = useState([]);
    
    useEffect(() => {
        if (!active) {
            setBubbles([]);
            return;
        }

        let id = 0;
        const interval = setInterval(() => {
            setBubbles(prev => [
                ...prev,
                {
                    id: id++,
                    x: Math.random() * 100, // percentage horizontal position
                    y: 110, // starts off-screen at bottom
                    size: Math.random() * 10 + 4, // 4px to 14px size
                    speed: Math.random() * 1.2 + 0.6, // rise speed
                    sway: Math.random() * 1.5 - 0.75, // sway factor
                    swaySpeed: Math.random() * 2 + 2, // speed of sine wave sway
                    createdAt: Date.now()
                }
            ]);
        }, 250); // Spawn rate

        return () => clearInterval(interval);
    }, [active]);

    useEffect(() => {
        if (!active || bubbles.length === 0) return;

        let frameId;
        const update = () => {
            setBubbles(prev => 
                prev
                    .map(b => {
                        const elapsed = (Date.now() - b.createdAt) / 1000;
                        const currentX = b.x + Math.sin(elapsed * b.swaySpeed) * b.sway;
                        return {
                            ...b,
                            x: Math.max(0, Math.min(100, currentX)),
                            y: b.y - b.speed
                        };
                    })
                    .filter(b => b.y > -10) // keep within parent container
            );
            frameId = requestAnimationFrame(update);
        };
        frameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId);
    }, [active, bubbles.length]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {bubbles.map(b => (
                <div
                    key={b.id}
                    className="absolute rounded-full border border-cyan-400/30 bg-cyan-300/10 backdrop-blur-[0.5px]"
                    style={{
                        left: `${b.x}%`,
                        bottom: `${100 - b.y}%`,
                        width: `${b.size}px`,
                        height: `${b.size}px`,
                        boxShadow: 'inset 0 0 4px rgba(34, 211, 238, 0.3)',
                        transform: 'translate(-50%, 50%)',
                    }}
                />
            ))}
        </div>
    );
};

const Games = memo(() => {
    const sectionRef = useRef(null);
    const [isReclaimerHovered, setIsReclaimerHovered] = useState(false);
    const [isFlappyHovered, setIsFlappyHovered] = useState(false);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.games-header', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%'
                }
            });
            gsap.from('.game-card-wrapper', {
                y: 60,
                opacity: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%'
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="games" ref={sectionRef} className="py-24 relative overflow-hidden">
            {/* Inline stylesheet for laser HUD sweep animation */}
            <style>{`
                @keyframes laserSweep {
                    0% {
                        top: 0%;
                        opacity: 0.2;
                    }
                    15% {
                        opacity: 1;
                    }
                    85% {
                        opacity: 1;
                    }
                    100% {
                        top: 100%;
                        opacity: 0.2;
                    }
                }
                .laser-line {
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, var(--secondary, #22d3ee), var(--primary, #d97706), var(--secondary, #22d3ee), transparent);
                    box-shadow: 0 0 10px var(--secondary, #22d3ee), 0 0 5px var(--primary, #d97706);
                    animation: laserSweep 2.5s linear infinite;
                }
            `}</style>

            <div className="max-w-6xl mx-auto px-4 z-10 relative">
                {/* Header */}
                <div className="games-header text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>
                        Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Games</span>
                    </h2>
                    <div className="w-16 h-1.5 bg-secondary mx-auto rounded-full"></div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    
                    {/* Game 1: Steel Reclaimer */}
                    <div className="game-card-wrapper">
                        <Card3D className="w-full h-full">
                            <div 
                                className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-[var(--bg-surface)]/60 backdrop-blur-md border border-[var(--border)] shadow-xl flex flex-col group/card hover:border-[var(--border-glow)] transition-colors duration-300"
                                onMouseEnter={() => setIsReclaimerHovered(true)}
                                onMouseLeave={() => setIsReclaimerHovered(false)}
                            >
                                {/* Cover / Gameplay Image Container */}
                                <div className="relative h-[240px] w-full overflow-hidden bg-black/40 border-b border-[var(--border)]">
                                    {/* Image 1: Cover */}
                                    <img 
                                        src="/assets/Games/Steel_reclaimer1.png" 
                                        alt="Steel Reclaimer Cover" 
                                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isReclaimerHovered ? 'opacity-0' : 'opacity-100'}`}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Steel+Reclaimer'; }}
                                    />
                                    {/* Image 2: Gameplay */}
                                    <img 
                                        src="/assets/Games/Steel_reclaimer2.png" 
                                        alt="Steel Reclaimer Gameplay" 
                                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isReclaimerHovered ? 'opacity-100' : 'opacity-0'}`}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Steel+Reclaimer+Gameplay'; }}
                                    />
                                    
                                    {/* Laser Sweep HUD overlay on hover */}
                                    {isReclaimerHovered && <div className="laser-line pointer-events-none z-10" />}

                                    {/* Scanline Grid overlay */}
                                    <div className="absolute inset-0 bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-10" />
                                </div>

                                {/* Content Details */}
                                <div className="p-6 md:p-8 flex flex-col justify-between flex-grow bg-[var(--bg-elevated)]/30 z-20">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-2xl font-bold tracking-wider text-[var(--text)] group-hover/card:text-primary transition-colors duration-300" style={{ fontFamily: 'var(--font-display)' }}>
                                                Steel Reclaimer
                                            </h3>
                                            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-secondary/15 text-secondary border border-secondary/30" style={{ fontFamily: 'var(--font-ui)' }}>
                                                Unity WebGL
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
                                            Navigate hazardous post-apocalyptic metal corridors in this sci-fi retro survival platformer. Run, gun, dodge, and reclaim critical core components.
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {['Unity', 'C#', 'Retro', 'Sci-Fi', 'WebGL'].map(tag => (
                                                <span 
                                                    key={tag} 
                                                    className="px-2.5 py-0.5 bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)] text-xs font-bold rounded-full uppercase"
                                                    style={{ fontFamily: 'var(--font-ui)' }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-4">
                                        <a 
                                            href="https://hridayesh68.itch.io/steel-reclaimer" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-hi text-[var(--bg-surface)] rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-lg shadow-primary/20 hover:scale-[1.02]"
                                            style={{ fontFamily: 'var(--font-ui)' }}
                                        >
                                            <Gamepad2 size={16} /> Play Live
                                        </a>
                                        <a 
                                            href="https://github.com/Hridayesh68/STEEL-RECLAIMER" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center p-3 bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] text-[var(--text)] rounded-xl transition-all duration-300 border border-[var(--border)] hover:border-primary/50"
                                            title="View Code on GitHub"
                                        >
                                            <Github size={18} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Card3D>
                    </div>

                    {/* Game 2: Flappy Fish */}
                    <div className="game-card-wrapper">
                        {/* Bobbing animation is enabled on this card to simulate aquatic floating */}
                        <Card3D className="w-full h-full" isBobbing={true}>
                            <div 
                                className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-[var(--bg-surface)]/60 backdrop-blur-md border border-[var(--border)] shadow-xl flex flex-col group/card hover:border-[var(--border-glow)] transition-colors duration-300"
                                onMouseEnter={() => setIsFlappyHovered(true)}
                                onMouseLeave={() => setIsFlappyHovered(false)}
                            >
                                {/* Image Container */}
                                <div className="relative h-[240px] w-full overflow-hidden bg-black/40 border-b border-[var(--border)]">
                                    <img 
                                        src="/assets/Games/Flappy_fish.jpg" 
                                        alt="Flappy Fish Cover" 
                                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${isFlappyHovered ? 'scale-105' : 'scale-100'}`}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Flappy+Fish'; }}
                                    />
                                    
                                    {/* Floating Bubbles Overlay */}
                                    <BubbleParticles active={isFlappyHovered} />

                                    {/* Underwater gradient shimmer on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-cyan-950/40 to-transparent pointer-events-none transition-opacity duration-500 z-0 ${isFlappyHovered ? 'opacity-100' : 'opacity-0'}`} />
                                </div>

                                {/* Content Details */}
                                <div className="p-6 md:p-8 flex flex-col justify-between flex-grow bg-[var(--bg-elevated)]/30 z-20">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-2xl font-bold tracking-wider text-[var(--text)] group-hover/card:text-primary transition-colors duration-300" style={{ fontFamily: 'var(--font-display)' }}>
                                                Flappy Fish
                                            </h3>
                                            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-secondary/15 text-secondary border border-secondary/30" style={{ fontFamily: 'var(--font-ui)' }}>
                                                PC &amp; Android
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
                                            An aquatic, physics-based casual game where you guide Flappy Fish through marine currents. Dodge obstacles and navigate dangerous ocean caverns.
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {['Unity', 'C#', 'Arcade', 'Physics', 'Cross-Platform'].map(tag => (
                                                <span 
                                                    key={tag} 
                                                    className="px-2.5 py-0.5 bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)] text-xs font-bold rounded-full uppercase"
                                                    style={{ fontFamily: 'var(--font-ui)' }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-3">
                                            <a 
                                                href="https://github.com/Hridayesh68/Flappy-bird-game-unity/blob/main/build%20windows/Flappy%20bird.exe" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-hi text-[var(--bg-surface)] rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-[1.02]"
                                                style={{ fontFamily: 'var(--font-ui)' }}
                                            >
                                                <Monitor size={15} /> PC Build
                                            </a>
                                            <a 
                                                href="https://github.com/Hridayesh68/Flappy-bird-game-unity/blob/9dcf09a2b61b5c525fdc6cc57a9c189ae80d17ae/android%20build/Flappyfish.apk" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] text-[var(--text)] border border-[var(--border-glow)] rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-[1.02]"
                                                style={{ fontFamily: 'var(--font-ui)' }}
                                            >
                                                <Smartphone size={15} /> Android APK
                                            </a>
                                        </div>
                                        <a 
                                            href="https://github.com/Hridayesh68/Flappy-bird-game-unity" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 py-2 px-4 bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-primary rounded-xl transition-all duration-300 border border-[var(--border)] text-xs font-bold uppercase"
                                            style={{ fontFamily: 'var(--font-ui)' }}
                                        >
                                            <Github size={14} /> View Source Repository
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Card3D>
                    </div>

                </div>
            </div>

            {/* Background glowing blobs */}
            <div className="absolute inset-0 bg-transparent pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-1/2 -right-48 w-80 h-80 bg-primary/5 rounded-full blur-[90px]" />
                <div className="absolute bottom-1/4 -left-48 w-80 h-80 bg-secondary/5 rounded-full blur-[90px]" />
            </div>
        </section>
    );
});

export default Games;
