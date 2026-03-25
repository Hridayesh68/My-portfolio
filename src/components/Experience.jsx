import { useRef, useLayoutEffect, useState, memo } from 'react';
import AnimatedCount from './ui/AnimatedCount';
import { Rocket, Terminal, Database, Layout, ExternalLink, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';

gsap.registerPlugin(ScrollTrigger);

// ── Inline SVG helpers ────────────────────────────────────────
const GamepadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" x2="10" y1="12" y2="12" /><line x1="8" x2="8" y1="10" y2="14" />
        <line x1="15" x2="17.5" y1="12" y2="9.5" /><line x1="16.5" x2="19" y1="9.5" y2="12" />
        <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
);
const BoxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
);
const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
    </svg>
);

// ── Data ──────────────────────────────────────────────────────
const MILESTONES = [
    {
        id: 'm1',
        year: '2026',
        label: 'Present',
        title: 'Full Stack Architecture',
        subtitle: 'Scalable cloud systems & Next.js',
        desc: 'Designing and deploying production-grade full-stack applications with Next.js, Node.js, and cloud infrastructure. Focus on performance, scalability, and clean architecture.',
        tags: ['Next.js', 'Node.js', 'AWS', 'Microservices'],
        icon: <Rocket size={18} />,
        stat: { value: 3, suffix: '+', label: 'Apps Deployed' },
        color: 'from-blue-500 to-cyan-500',
        accentColor: 'text-cyan-400',
        borderColor: 'border-cyan-500/30',
        bgColor: 'bg-cyan-500/5',
    },
    {
        id: 'm2',
        year: '2025',
        label: '2025',
        title: 'Advanced Frontend & WebGL',
        subtitle: 'Three.js, GSAP & immersive UIs',
        desc: 'Mastered WebGL rendering pipelines, Three.js 3D scenes, and GSAP scroll-driven animations. Built interactive portfolio-grade experiences with cinematic transitions.',
        tags: ['Three.js', 'GSAP', 'WebGL', 'React'],
        icon: <Layout size={18} />,
        stat: { value: 5, suffix: '+', label: 'Animations Built' },
        color: 'from-violet-500 to-purple-500',
        accentColor: 'text-violet-400',
        borderColor: 'border-violet-500/30',
        bgColor: 'bg-violet-500/5',
    },
    {
        id: 'm3',
        year: '2024',
        label: '2024',
        title: 'Backend Engineering',
        subtitle: 'Backend Developer · Node.js, MySQL & API design',
        desc: 'Built robust REST APIs with Express.js, designed relational database schemas with MySQL, and developed ML inference pipelines with Python and scikit-learn. Worked as a backend developer delivering scalable server-side solutions.',
        tags: ['Express', 'MySQL', 'Python', 'scikit-learn', 'REST APIs'],
        icon: <Database size={18} />,
        stat: { value: 200, suffix: '+', label: 'Problems Solved' },
        color: 'from-emerald-500 to-green-500',
        accentColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        bgColor: 'bg-emerald-500/5',
    },
    {
        id: 'm5',
        year: '2024',
        label: '2024',
        title: 'Data Analytics & Models',
        subtitle: 'Dashboards, ML models & EV insights',
        desc: 'Built interactive Power BI dashboards with DAX measures, KPI cards, drill-through reports, and Power Query pipelines. Analysed EV adoption trends across 50+ data points. Developed ML models using scikit-learn for predictive analytics.',
        tags: ['Power BI', 'DAX', 'Python', 'scikit-learn', 'Excel'],
        icon: <ChartIcon />,
        stat: { value: 50, suffix: '+', label: 'Data Points' },
        color: 'from-yellow-500 to-amber-500',
        accentColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/30',
        bgColor: 'bg-yellow-500/5',
    },

    {
        id: 'm4',
        year: '2023',
        label: '2023',
        title: 'CS Foundations',
        subtitle: 'DSA, OOP & Web basics',
        desc: 'Built strong foundations in Data Structures, Algorithms, OOP principles, and core web technologies. Solved 200+ LeetCode and HackerRank problems. Earned 5-star ratings in Python and C++.',
        tags: ['C++', 'Java', 'DSA', 'HTML/CSS'],
        icon: <Terminal size={18} />,
        stat: { value: 5, suffix: '⭐', label: 'HackerRank' },
        color: 'from-rose-500 to-pink-500',
        accentColor: 'text-rose-400',
        borderColor: 'border-rose-500/30',
        bgColor: 'bg-rose-500/5',
    },
];

const SKILLS_LEFT = [
    {
        id: 'sl1',
        title: 'Game Development',
        subtitle: 'Real-time 3D simulations',
        desc: 'Built real-time 3D environments and interactive simulations using Unity Engine. Experience with physics systems, scene management, and game logic scripting in C#.',
        icon: <GamepadIcon />,
        tools: [
            { src: '/pngs/unity.png', fallback: '/tech-stack/Unity.svg', name: 'Unity' },
        ],
        tag: 'Unity · C#',
        highlight: 'Real-time Physics',
        color: 'from-orange-500/20 to-amber-500/10',
        accentColor: 'text-orange-400',
        borderColor: 'border-orange-500/20',
    },
    {
        id: 'sl2',
        title: '3D Modeling',
        subtitle: 'Asset creation & rendering',
        desc: 'Designed and textured 3D models for use in web and game contexts using Blender. Familiar with UV unwrapping, PBR materials, and exporting to glTF/USDZ formats.',
        icon: <BoxIcon />,
        tools: [
            { src: '/pngs/blender.png', fallback: '/tech-stack/Blender.svg', name: 'Blender' },
        ],
        tag: 'Blender · glTF',
        highlight: 'PBR Materials',
        color: 'from-sky-500/20 to-blue-500/10',
        accentColor: 'text-sky-400',
        borderColor: 'border-sky-500/20',
    },
    {
        id: 'sl3',
        title: 'Data Analytics',
        subtitle: 'Dashboards & visualisation',
        desc: 'Built interactive Power BI dashboards with DAX measures, KPI cards, drill-through reports, and Power Query data pipelines. Analysed EV adoption trends across 50+ data points.',
        icon: <ChartIcon />,
        tools: [
            { src: '/pngs/power-bi-icon.png', fallback: '/tech-stack/Powerbi.svg', name: 'Power BI' },
            { src: '/pngs/microsoft-excel-icon.png', fallback: '/tech-stack/Excel.svg', name: 'Excel' },
        ],
        tag: 'Power BI · DAX',
        highlight: 'KPI Dashboards',
        color: 'from-yellow-500/20 to-amber-500/10',
        accentColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/20',
    },
    {
        id: 'sl4',
        title: 'Summer Training – Mastering DSA',
        subtitle: 'Lovely Professional University · Internship',
        desc: 'Created a task-management web application using core DSA concepts to optimize task handling and improve performance. Gained strong foundations in Data Structures and Algorithms — arrays, stacks, queues, linked lists, trees, graphs, sorting, and searching. Delivered intuitive front-end features with efficient backend logic for a clean, scalable, user-friendly experience.',
        icon: <Terminal size={18} />,
        tools: [
            { src: '/tech-stack/React.svg', fallback: '/tech-stack/React.svg', name: 'React' },
            { src: '/tech-stack/Node.svg', fallback: '/tech-stack/JavaScript.svg', name: 'Node.js' }
        ],
        tag: "May'25–Jul'25",
        highlight: 'Certified Training',
        color: 'from-fuchsia-500/20 to-pink-500/10',
        accentColor: 'text-fuchsia-400',
        borderColor: 'border-fuchsia-500/20',
    },
];

const TECH_DOTS = [
    { id: 't1', name: 'React', img: '/pngs/react-js-icon.png', fallback: '/tech-stack/React.svg' },
    { id: 't2', name: 'C++', img: '/tech-stack/Cpp.svg', fallback: '/tech-stack/Cpp.svg' },
    { id: 't3', name: 'Python', img: '/pngs/python-programming-language-icon.png', fallback: '/tech-stack/Python.svg' },
];

// ── Component ─────────────────────────────────────────────────
const Experience = memo(() => {
    const sectionRef = useRef(null);
    const timelineRef = useRef(null);
    const rgbLineRef = useRef(null);
    const headerRef = useRef(null);
    const [activeCard, setActiveCard] = useState(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            // Header reveal
            gsap.from(headerRef.current.children, {
                y: 40, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
            });

            // RGB progress line
            gsap.fromTo(rgbLineRef.current,
                { height: '0%' },
                {
                    height: '100%', ease: 'none',
                    scrollTrigger: {
                        trigger: timelineRef.current,
                        start: 'top center', end: 'bottom center', scrub: 0.6,
                    },
                }
            );

            // Tech dots
            document.querySelectorAll('.tech-dot').forEach(dot => {
                gsap.to(dot, {
                    scrollTrigger: {
                        trigger: dot, start: 'top center', end: 'bottom center',
                        toggleClass: { targets: dot, className: 'active' },
                        toggleActions: 'play reverse play reverse',
                    },
                });
            });

            // Left cards — slide from left
            document.querySelectorAll('.left-card-anim').forEach((card, i) => {
                gsap.from(card, {
                    x: -80, opacity: 0, duration: 0.9, ease: 'power3.out',
                    delay: i * 0.05,
                    scrollTrigger: { trigger: card, start: 'top 88%' },
                });
            });

            // Right milestone cards — slide from right + stagger tags
            document.querySelectorAll('.right-card-anim').forEach((card, i) => {
                gsap.from(card, {
                    x: 80, opacity: 0, duration: 0.9, ease: 'power3.out',
                    delay: i * 0.05,
                    scrollTrigger: { trigger: card, start: 'top 88%' },
                });
                // Stagger the tag pills inside each card
                const tags = card.querySelectorAll('.tag-pill');
                gsap.from(tags, {
                    scale: 0.6, opacity: 0, duration: 0.4, stagger: 0.07, ease: 'back.out(2)',
                    scrollTrigger: { trigger: card, start: 'top 85%' },
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="py-28 relative bg-transparent overflow-hidden"
        >
            {/* ── Subtle ambient glow blobs ── */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
                <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-violet-600/5 blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-cyan-600/5 blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

                {/* ── Header ── */}
                <div ref={headerRef} className="flex flex-col items-center mb-24">
                    <span className="text-xs font-semibold tracking-[0.3em] uppercase text-primary/70 mb-4">
                        Journey &amp; Expertise
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[var(--text)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                        Experience &amp;{' '}
                        <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                            Tech Stack
                        </span>
                    </h2>
                    <p className="text-[var(--text-muted)] mt-5 text-center max-w-xl text-base leading-relaxed">
                        From CS fundamentals to full-stack architecture — a timeline of
                        everything built, learned, and shipped.
                    </p>
                    {/* Decorative rule */}
                    <div className="mt-8 flex items-center gap-3">
                        <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary/50" />
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary/50" />
                    </div>
                </div>

                {/* ── Timeline ── */}
                <div ref={timelineRef} className="relative flex justify-center pb-20">

                    {/* Centre bar */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-[var(--primary)]/30 z-0">
                        <div
                            ref={rgbLineRef}
                            className="rgb-line origin-top w-full"
                            style={{
                                background: 'linear-gradient(180deg, #6366f1, #a855f7, #06b6d4, #10b981, #f59e0b)',
                                boxShadow: '0 0 12px 2px rgba(99,102,241,0.5)',
                            }}
                        />
                    </div>

                    {/* Floating tech dots (desktop only) */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 hidden md:block">
                        {TECH_DOTS.map((dot, i) => (
                            <div
                                key={dot.id}
                                className="tech-dot"
                                style={{ top: `${15 + i * 32}%` }}
                                title={dot.name}
                            >
                                <img
                                    src={dot.img}
                                    alt={dot.name}
                                    onError={e => { e.target.src = dot.fallback; }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Content grid */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-32 relative z-20">

                        {/* ── LEFT: Specialisations ── */}
                        <div className="flex flex-col gap-10 md:gap-0 md:justify-between py-10 order-2 md:order-1">
                            {SKILLS_LEFT.map(card => (
                                <div key={card.id} className="left-card-anim flex justify-end">
                                    <div
                                        className="w-full max-w-sm group"
                                        onMouseEnter={() => setActiveCard(card.id)}
                                        onMouseLeave={() => setActiveCard(null)}
                                    >
                                        <div
                                            className={`
                                                relative rounded-2xl p-6
                                                border ${card.borderColor}
                                                bg-gradient-to-br ${card.color}
                                                backdrop-blur-sm
                                                transition-all duration-300
                                                hover:shadow-xl hover:-translate-y-1
                                                hover:border-opacity-60
                                                cursor-default
                                            `}
                                        >
                                            {/* Top row */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`p-2 rounded-xl bg-[var(--bg-elevated)] ${card.accentColor}`}>
                                                    {card.icon}
                                                </div>
                                                <span className={`text-xs font-mono font-semibold px-2 py-1 rounded-full bg-[var(--bg-elevated)] ${card.accentColor}`}>
                                                    {card.tag}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-bold text-[var(--text)] text-lg leading-tight" style={{ fontFamily: 'var(--font-ui)' }}>
                                                {card.title}
                                            </h3>
                                            <p className={`text-xs font-medium mt-0.5 mb-3 ${card.accentColor}`} style={{ fontFamily: 'var(--font-ui)' }}>
                                                {card.subtitle}
                                            </p>
                                            <div
                                                className={`
                                                    text-sm text-[var(--text-muted)] leading-relaxed
                                                    overflow-hidden transition-all duration-500
                                                    ${activeCard === card.id ? 'max-h-40 opacity-100 mb-5' : 'max-h-0 opacity-0 mb-0'}
                                                `}
                                                style={{ fontFamily: 'var(--font-accent)' }}
                                            >
                                                {card.desc}
                                            </div>

                                            {/* Tool icons + highlight */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    {card.tools.map((t, i) => (
                                                        <div key={i} className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] flex items-center justify-center" title={t.name}>
                                                            <img
                                                                src={t.src}
                                                                alt={t.name}
                                                                className="w-5 h-5 object-contain"
                                                                onError={e => { e.target.src = t.fallback; }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className={`text-xs font-semibold ${card.accentColor} flex items-center gap-1`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                    {card.highlight}
                                                </span>
                                            </div>

                                            {/* Hover connector arrow */}
                                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight size={12} className="text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── RIGHT: Milestones ── */}
                        <div className="flex flex-col gap-8 md:gap-0 md:justify-between py-10 order-1 md:order-2">
                            {MILESTONES.map(card => (
                                <div key={card.id} className="right-card-anim flex justify-start">
                                    <div
                                        className="w-full max-w-sm group cursor-pointer"
                                        onMouseEnter={() => setActiveCard(card.id)}
                                        onMouseLeave={() => setActiveCard(null)}
                                    >
                                        <div
                                            className={`
                                                relative rounded-2xl overflow-hidden
                                                border ${card.borderColor}
                                                ${card.bgColor}
                                                backdrop-blur-sm
                                                transition-all duration-300
                                                hover:shadow-2xl hover:-translate-y-1.5
                                            `}
                                        >
                                            {/* Gradient accent bar */}
                                            <div className={`h-0.5 w-full bg-gradient-to-r ${card.color}`} />

                                            <div className="p-6">
                                                {/* Year badge + icon */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`
                                                            text-xs font-bold tracking-widest px-3 py-1 rounded-full
                                                            bg-gradient-to-r ${card.color} text-[var(--bg-surface)]
                                                        `} style={{ fontFamily: 'var(--font-ui)' }}>
                                                            {card.label}
                                                        </span>
                                                    </div>
                                                    <div className={`${card.accentColor} opacity-60 group-hover:opacity-100 transition-opacity`}>
                                                        {card.icon}
                                                    </div>
                                                </div>

                                                {/* Title + subtitle */}
                                                <h3 className="text-xl font-bold text-[var(--text)] leading-tight" style={{ fontFamily: 'var(--font-ui)' }}>
                                                    {card.title}
                                                </h3>
                                                <p className={`text-sm mt-1 mb-3 ${card.accentColor} font-medium`} style={{ fontFamily: 'var(--font-ui)' }}>
                                                    {card.subtitle}
                                                </p>

                                                {/* Description — appears on hover */}
                                                <div
                                                    className={`
                                                        text-sm text-[var(--text-muted)] leading-relaxed
                                                        overflow-hidden transition-all duration-500
                                                        ${activeCard === card.id ? 'max-h-56 opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'}
                                                    `}
                                                    style={{ fontFamily: 'var(--font-accent)' }}
                                                >
                                                    {card.desc}
                                                </div>

                                                {/* Tags — appears on hover */}
                                                <div
                                                    className={`
                                                        flex flex-wrap gap-2
                                                        overflow-hidden transition-all duration-500
                                                        ${activeCard === card.id ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'}
                                                    `}
                                                >
                                                    {card.tags.map(tag => (
                                                        <span
                                                            key={tag}
                                                            className={`
                                                                tag-pill text-xs px-2.5 py-1 rounded-full font-medium
                                                                border ${card.borderColor}
                                                                ${card.accentColor} bg-[var(--bg-elevated)]
                                                            `}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Stat */}
                                                <div className={`
                                                    flex items-center justify-between pt-4
                                                    border-t border-[var(--border)]
                                                `}>
                                                    <div>
                                                        <span className={`text-2xl font-black ${card.accentColor}`}>
                                                            <AnimatedCount target={card.stat.value} suffix={card.stat.suffix} />
                                                        </span>
                                                        <span className="text-xs text-[var(--text-dim)] ml-2">
                                                            {card.stat.label}
                                                        </span>
                                                    </div>
                                                    <span className={`
                                                        text-xs font-medium ${card.accentColor} flex items-center gap-1
                                                        opacity-0 group-hover:opacity-100 transition-opacity
                                                    `}>
                                                        Hover to expand <ChevronRight size={12} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* ── Bottom stats bar ── */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { value: 200, suffix: '+', label: 'Problems Solved', color: 'text-cyan-400' },
                        { value: 5, suffix: '⭐', label: 'HackerRank Rating', color: 'text-yellow-400' },
                        { value: 6, suffix: '+', label: 'Projects Shipped', color: 'text-violet-400' },
                        { value: 3, suffix: '+', label: 'Certifications', color: 'text-emerald-400' },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="
                                flex flex-col items-center justify-center py-6 px-4 rounded-2xl
                                border border-[var(--border)] bg-[var(--bg-surface)]/50
                                backdrop-blur-sm hover:border-primary/30 transition-colors
                            "
                        >
                            <span className={`text-3xl font-black ${stat.color}`}>
                                <AnimatedCount target={stat.value} suffix={stat.suffix} />
                            </span>
                            <span className="text-xs text-[var(--text-dim)] mt-1 text-center">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
});

export default Experience;