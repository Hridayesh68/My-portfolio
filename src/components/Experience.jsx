import { useRef, useLayoutEffect } from 'react';
import { Rocket, Terminal, Database, Layout } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';

gsap.registerPlugin(ScrollTrigger);

// Helper Icons - Defined at TOP to avoid ReferenceError
const GamepadIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" x2="10" y1="12" y2="12" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="15" x2="17.5" y1="12" y2="9.5" /><line x1="16.5" x2="19" y1="9.5" y2="12" /><rect width="20" height="12" x="2" y="6" rx="2" /></svg>);
const BoxIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>);
const ChartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>);

const Experience = () => {
    const sectionRef = useRef(null);
    const timelineRef = useRef(null);
    const rgbLineRef = useRef(null);

    // --- Timeline Data ---
    const leftCards = [
        {
            id: 'l1',
            title: 'Game Development',
            desc: 'Real-time 3D simulations & Unity Engine.',
            icon: <GamepadIcon />,
            images: ['/pngs/unity.png'],
            fallback: '/tech-stack/Unity.svg'
        },
        {
            id: 'l2',
            title: '3D Modeling',
            desc: 'Asset creation, texturing & rendering with Blender.',
            icon: <BoxIcon />,
            images: ['/pngs/blender.png'],
            fallback: '/tech-stack/Blender.svg'
        },
        {
            id: 'l3',
            title: 'Data Analytics',
            desc: 'Business intelligence dashboards & data viz.',
            icon: <ChartIcon />,
            images: ['/pngs/power-bi-icon.png', '/pngs/microsoft-excel-icon.png'],
            fallback: null
        }
    ];

    const rightCards = [
        { id: 'r1', year: '2026', title: 'Full Stack Arch.', desc: 'Scalable cloud infra & Next.js systems.', icon: <Rocket size={20} /> },
        { id: 'r2', year: '2025', title: 'Adv. Frontend', desc: 'WebGL, Three.js & immersive UIs.', icon: <Layout size={20} /> },
        { id: 'r3', year: '2024', title: 'Backend Eng.', desc: 'Node.js, microservices & DB optimization.', icon: <Database size={20} /> },
        { id: 'r4', year: '2023', title: 'Foundations', desc: 'Algorithms, Data Structures & Web Basics.', icon: <Terminal size={20} /> }
    ];

    const techDots = [
        { id: 't1', name: 'React', img: '/pngs/react-js-icon.png', fallback: '/tech-stack/React.svg' },
        { id: 't2', name: 'C++', img: '/tech-stack/Cpp.svg', fallback: '/tech-stack/Cpp.svg' },
        { id: 't3', name: 'Python', img: '/pngs/python-programming-language-icon.png', fallback: '/tech-stack/Python.svg' }
    ];

    // --- GSAP Animations ---
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const timelineContainer = timelineRef.current;
            const rgbLine = rgbLineRef.current;

            gsap.fromTo(rgbLine,
                { height: '0%' },
                {
                    height: '100%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: timelineContainer,
                        start: "top center",
                        end: "bottom center",
                        scrub: 0.5
                    }
                }
            );

            document.querySelectorAll('.tech-dot').forEach((dot) => {
                gsap.to(dot, {
                    scrollTrigger: {
                        trigger: dot,
                        start: "top center",
                        end: "bottom center",
                        toggleClass: { targets: dot, className: "active" },
                        toggleActions: "play reverse play reverse"
                    }
                });
            });

            // Slide Animations
            document.querySelectorAll('.left-card-anim').forEach(card => {
                gsap.from(card, {
                    x: -100, opacity: 0, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: card, start: "top 85%" }
                });
            });
            document.querySelectorAll('.right-card-anim').forEach(card => {
                gsap.from(card, {
                    x: 100, opacity: 0, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: card, start: "top 85%" }
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="experience" ref={sectionRef} className="py-20 relative bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">

                {/* --- HEADER --- */}
                <div className="flex flex-col items-center mb-16 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
                        Experience & Tech
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-4 text-center max-w-2xl">
                        A timeline of my technical journey and milestones.
                    </p>
                </div>

                {/* --- ADVANCED TIMELINE --- */}
                <div ref={timelineRef} className="relative min-h-[150vh] flex justify-center pb-20">

                    {/* CENTER BAR */}
                    <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 dark:bg-gray-800 z-0">
                        <div ref={rgbLineRef} className="rgb-line origin-top w-full"></div>
                    </div>

                    {/* TECH DOTS */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 hidden md:block">
                        {techDots.map((dot, index) => (
                            <div
                                key={dot.id}
                                className="tech-dot"
                                style={{ top: `${20 + (index * 30)}%` }} // 20%, 50%, 80%
                            >
                                <img src={dot.img} alt={dot.name} onError={(e) => { e.target.src = dot.fallback; }} />
                            </div>
                        ))}
                    </div>

                    {/* CONTENT GRID */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 relative z-20">

                        {/* LEFT COLUMN */}
                        <div className="flex flex-col justify-between py-10 order-2 md:order-1 gap-24 md:gap-0">
                            {leftCards.map((card) => (
                                <div key={card.id} className="left-card-anim flex justify-end items-center h-1/3">
                                    <div className="w-full max-w-md relative">
                                        <Card className="p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:border-primary/50 transition-colors">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="p-2 bg-primary/10 rounded-lg text-primary">{card.icon}</div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{card.title}</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{card.desc}</p>
                                            <div className="flex gap-2">
                                                {card.images.map((img, i) => (
                                                    <img key={i} src={img} alt="tool" className="h-8 w-8 object-contain" onError={(e) => { if (card.fallback) e.target.src = card.fallback; }} />
                                                ))}
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="flex flex-col justify-between py-10 order-1 md:order-2 gap-12 md:gap-0">
                            {rightCards.map((card) => (
                                <div key={card.id} className="right-card-anim flex justify-start items-center">
                                    <div className="w-full max-w-md">
                                        <Card>
                                            <div className="p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm relative z-10 text-left">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-primary font-bold text-xs tracking-wider border border-primary/20 px-2 py-1 rounded-full">{card.year}</span>
                                                    <div className="text-gray-400">{card.icon}</div>
                                                </div>
                                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{card.title}</h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">{card.desc}</p>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>

            </div>
        </section >
    );
};

export default Experience;
