import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles as SparklesIcon } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

// ── Sparkles background ───────────────────────────────────────
const Sparkles = () => {
    const [sparkles, setSparkles] = useState([]);

    useEffect(() => {
        const generateSparkle = () => {
            const id = Math.random();
            const style = {
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 2 + 's',
                transform: `scale(${Math.random()})`,
            };
            setSparkles(prev => [...prev.slice(-15), { id, style }]);
        };

        const interval = setInterval(generateSparkle, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {sparkles.map(s => (
                <div
                    key={s.id}
                    className="absolute w-5 h-5 text-yellow-500 animate-pulse opacity-70"
                    style={s.style}
                >
                    <SparklesIcon size={18} />
                </div>
            ))}
        </div>
    );
};

// ── Cycling roles config ──────────────────────────────────────
const ROLES = [
    { text: 'Data thinker.', color: 'text-primary' },
    { text: '3D Developer.', color: 'text-purple-500' },
    { text: 'Web Developer.', color: 'text-emerald-500' },
    { text: 'ML Engineer.', color: 'text-rose-500' },
];

const CYCLE_INTERVAL = 2800;   // ms between each role change
const ANIM_DURATION = 0.45;   // seconds for gsap transitions

// ── Hero ──────────────────────────────────────────────────────
const Hero = ({ theme }) => {
    const headingRef = useRef(null);
    const descRef = useRef(null);
    const btnRef = useRef(null);
    const badgeRef = useRef(null);
    const sectionRef = useRef(null);

    // The animated role word sits in its own span so we can
    // tween it independently without reflowing the whole heading
    const roleRef = useRef(null);

    const [roleIndex, setRoleIndex] = useState(0);
    const [displayRole, setDisplayRole] = useState(ROLES[0]);
    const [showGlow, setShowGlow] = useState(false);

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

    // ── Role cycling with GSAP clip + slide animation ─────────
    useEffect(() => {
        const timer = setInterval(() => {
            const el = roleRef.current;
            if (!el) return;

            // Slide current text UP and out
            gsap.to(el, {
                y: -30,
                opacity: 0,
                duration: ANIM_DURATION,
                ease: 'power2.in',
                onComplete: () => {
                    // Swap text while invisible
                    setRoleIndex(prev => {
                        const next = (prev + 1) % ROLES.length;
                        setDisplayRole(ROLES[next]);
                        return next;
                    });

                    // Slide new text in FROM below
                    gsap.fromTo(el,
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: ANIM_DURATION, ease: 'power2.out' }
                    );
                },
            });
        }, CYCLE_INTERVAL);

        return () => clearInterval(timer);
    }, []);

    const scrollToProjects = () => {
        gsap.to(window, { duration: 1, scrollTo: '#projects', ease: 'power2.out' });
    };

    const handleImageClick = () => {
        if (theme === 'light') {
            setShowGlow(true);
            setTimeout(() => setShowGlow(false), 800);
        }
    };

    return (
        <section
            id="hero"
            ref={sectionRef}
            className="min-h-[100dvh] flex items-start md:items-center justify-center pt-28 md:pt-20 relative overflow-hidden"
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
                    <div className="flex-1 flex flex-col text-center md:text-left relative z-10 max-w-2xl mt-4 md:mt-24 min-h-[70dvh] md:min-h-0">

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
                            >
                                CS Engineer.{' '}
                                {/*
                              overflow-hidden clips the slide animation so the
                              outgoing/incoming text doesn't bleed outside the line.
                              inline-block + min-w keeps the heading width stable.
                            */}
                                <span
                                    className="inline-block overflow-hidden align-bottom"
                                    style={{ minWidth: '14rem' }}
                                >
                                    <span
                                        ref={roleRef}
                                        className={`inline-block ${displayRole.color} transition-colors duration-300`}
                                    >
                                        {displayRole.text}
                                    </span>
                                </span>

                                <br />
                                <span className="text-primary">Problem solver.</span>
                            </h1>

                            {/* Description */}
                            <p
                                ref={descRef}
                                className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto md:mx-0"
                            >
                                Computer Science undergrad at Lovely Professional University —
                                crafting AI-powered web apps, data dashboards, and machine
                                learning pipelines that turn raw data into real decisions.
                            </p>
                        </div>

                        {/* Spacer for mobile to push buttons down */}
                        <div className="flex-grow min-h-[35vh] md:min-h-0"></div>

                        {/* CTA buttons */}
                        <div
                            ref={btnRef}
                            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pb-12 md:pb-0"
                        >
                            <button
                                onClick={scrollToProjects}
                                className="group inline-flex items-center px-8 py-3 bg-primary text-white text-lg font-medium rounded-full hover:bg-secondary transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                View My Work
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <a
                                href="/GeneralCV-Hridayesh.pdf"
                                download="GeneralCV-Hridayesh.pdf"
                                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1"
                            >
                                Download Resume
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;