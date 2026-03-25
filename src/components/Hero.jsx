import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles as SparklesIcon } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

// ── Sparkles background ───────────────────────────────────────
// ── Sparkles background (CSS-based for performance) ────────────────
const Sparkles = () => {
    // Render a static set of sparkles once. CSS keyframes handle the pulse.
    // This avoids setInterval and state updates every 300ms.
    const staticSparkles = useRef([...Array(20)].map(() => ({
        id: Math.random(),
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        delay: Math.random() * 5 + 's',
        scale: 0.5 + Math.random() * 0.5,
    }))).current;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {staticSparkles.map(s => (
                <div
                    key={s.id}
                    className="absolute w-5 h-5 text-yellow-500 animate-pulse opacity-40 shrink-0"
                    style={{
                        top: s.top,
                        left: s.left,
                        animationDelay: s.delay,
                        transform: `scale(${s.scale})`
                    }}
                >
                    <SparklesIcon size={18} />
                </div>
            ))}
        </div>
    );
};

const ROLES = [
    { text: "Full Stack Developer", color: "text-blue-500" },
    { text: "ML Enthusiast", color: "text-purple-500" },
    { text: "UI/UX Designer", color: "text-pink-500" },
    { text: "Problem Solver", color: "text-green-500" }
];

// ── Role Cycler Component (Isolates state) ───────────────────────────
const RoleCycler = () => {
    const roleRef = useRef(null);
    const [roleIndex, setRoleIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            const el = roleRef.current;
            if (!el) return;

            gsap.to(el, {
                y: -30,
                opacity: 0,
                duration: 0.45,
                ease: 'power2.in',
                onComplete: () => {
                    setRoleIndex(prev => (prev + 1) % ROLES.length);
                    gsap.fromTo(el,
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }
                    );
                },
            });
        }, 2800);
        return () => clearInterval(timer);
    }, []);

    const currentRole = ROLES[roleIndex];

    return (
        <span
            className="inline-block overflow-hidden align-bottom"
            style={{ minWidth: '14rem' }}
        >
            <span
                ref={roleRef}
                className={`inline-block ${currentRole.color} transition-colors duration-300`}
                style={{ fontFamily: 'var(--font-accent)' }}
            >
                {currentRole.text}
            </span>
        </span>
    );
};

// ── Hero ──────────────────────────────────────────────────────
const Hero = ({ theme }) => {
    const headingRef = useRef(null);
    const descRef = useRef(null);
    const btnRef = useRef(null);
    const badgeRef = useRef(null);
    const sectionRef = useRef(null);

    const [showGlow, setShowGlow] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    // ── Page-load entrance animation ─────────────────────────
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.fromTo(badgeRef.current,
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 }
            )
                .fromTo(headingRef.current,
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8 },
                    '-=0.3'
                )
                .fromTo(descRef.current,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7 },
                    '-=0.4'
                )
                .fromTo(btnRef.current,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6 },
                    '-=0.3'
                );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const scrollToProjects = () => {
        gsap.to(window, { duration: 1, scrollTo: '#projects', ease: 'power2.out' });
    };

    const handleImageClick = () => {
        if (theme === 'light') {
            setShowGlow(true);
            setTimeout(() => setShowGlow(false), 800);
        }
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
    };

    return (
        <section
            id="hero"
            ref={sectionRef}
            className="relative bg-transparent"
        >
            <Sparkles />

            {/* Edge glow (light mode only) */}
            <div
                className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-700 ease-out ${showGlow ? 'opacity-100' : 'opacity-0'}`}
                style={{ boxShadow: 'inset 0 0 150px 40px rgba(59, 130, 246, 0.4)' }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                    {/* ── Left: text content ── */}
                    <div className="flex-1 flex flex-col text-center md:text-left relative z-10 max-w-2xl mt-0 md:mt-24 min-h-[70dvh] md:min-h-0 pt-10 md:pt-0">

                        <div className="space-y-6 md:space-y-8">
                            {/* Badge */}
                            <div
                                ref={badgeRef}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
                            >
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                Available for opportunities
                            </div>

                            {/* Heading — role word is isolated in its own span */}
                            <h1
                                ref={headingRef}
                                className="text-4xl md:text-6xl font-extrabold tracking-tight"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                CS Engineer.{' '}
                                {/*
                              overflow-hidden clips the slide animation so the
                              outgoing/incoming text doesn't bleed outside the line.
                              inline-block + min-w keeps the heading width stable.
                            */}
                                <RoleCycler />

                                <br />
                                <span className="text-primary">Problem solver.</span>
                            </h1>

                            {/* Description */}
                            <p
                                ref={descRef}
                                className="text-lg md:text-xl text-[var(--text-muted)] max-w-xl mx-auto md:mx-0"
                                style={{ fontFamily: 'var(--font-accent)' }}
                            >
                                Computer Science undergrad at Lovely Professional University —
                                crafting AI-powered web apps, data dashboards, and machine
                                learning pipelines that turn raw data into real decisions.
                            </p>
                        </div>

                        {/* Spacer for mobile to push buttons down */}
                        <div className="flex-grow min-h-[8vh] md:min-h-0"></div>

                        {/* CTA buttons */}
                        <div
                            ref={btnRef}
                            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pb-24 md:pb-0"
                        >
                            <button
                                onClick={scrollToProjects}
                                className="group inline-flex items-center px-8 py-3 bg-[var(--primary)] text-[var(--bg-surface)] hover:text-[var(--text)] text-lg font-medium rounded-full hover:bg-secondary transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                style={{ fontFamily: 'var(--font-ui)' }}
                            >
                                View My Work
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <a
                                href="/GeneralCV-Hridayesh.pdf"
                                download="GeneralCV-Hridayesh.pdf"
                                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[var(--border-glow)] text-[var(--primary)] rounded-full font-medium hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-[var(--bg-surface)] transition-all transform hover:-translate-y-1"
                                style={{ fontFamily: 'var(--font-ui)' }}
                            >
                                Download Resume
                            </a>
                        </div>
                    </div>

                    {/* ── Right: avatar image ── */}
                    <div className="flex-1 flex justify-center md:justify-end items-center relative z-10 w-full mt-4 md:mt-0">
                        <div className="relative group">
                            {/* The glowing themed border */}
                            <div className="absolute inset-[-4px] rounded-full bg-primary opacity-50 blur-lg group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* The static circular image constraint */}
                            <div
                                className={`relative w-64 h-64 md:w-80 md:h-80 xl:w-96 xl:h-96 rounded-full overflow-hidden border-4 border-primary transition-all duration-500 shadow-2xl group-hover:scale-[1.02] cursor-pointer ${isShaking ? 'animate-shake' : ''}`}
                                onClick={handleImageClick}
                                style={isShaking ? { animation: 'shake 0.6s ease-in-out' } : {}}
                            >
                                <img 
                                    src="/assets/hridayesh-formal.jpeg" 
                                    alt="Hridayesh Pandey" 
                                    className="w-full h-full object-cover object-top"
                                    draggable="false"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;