import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sun, Moon, Sparkles as SparklesIcon } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

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

const Hero = ({ theme, toggleTheme }) => {
    const imageRef = useRef(null);
    const headingRef = useRef(null);
    const descRef = useRef(null);
    const btnRef = useRef(null);
    const badgeRef = useRef(null);
    const sectionRef = useRef(null);
    const [mainText, setMainText] = useState("Hridayesh");
    const [showGlow, setShowGlow] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // Badge fades in
            tl.fromTo(badgeRef.current,
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 }
            )
                // Heading slides up
                .fromTo(headingRef.current,
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8 },
                    '-=0.3'
                )
                // Description fades up
                .fromTo(descRef.current,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7 },
                    '-=0.4'
                )
                // Buttons slide up
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

    const handleTextHover = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
        let iterations = 0;
        const target = 'Developer';

        const interval = setInterval(() => {
            setMainText(prev =>
                prev.split('').map((letter, index) => {
                    if (index < iterations) return target[index];
                    return chars[Math.floor(Math.random() * 36)];
                }).join('').slice(0, target.length)
            );

            if (iterations >= target.length) {
                clearInterval(interval);
                setMainText('Developer');
            }
            iterations += 1 / 3;
        }, 30);
    };

    const handleTextLeave = () => setMainText('Hridayesh');

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
            className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden"
        >
            <Sparkles />

            {/* Edge Glow Effect (Light Mode Only) */}
            <div
                className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-700 ease-out ${showGlow ? 'opacity-100' : 'opacity-0'}`}
                style={{ boxShadow: 'inset 0 0 150px 40px rgba(59, 130, 246, 0.4)' }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                    {/* ── LEFT text content (leaving right empty for 3D model) ── */}
                    <div className="flex-1 text-center md:text-left space-y-8 relative z-10 max-w-2xl mt-12 md:mt-24">

                        {/* Badge */}
                        <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Available for opportunities
                        </div>

                        {/* Heading */}
                        <h1 ref={headingRef} className="text-4xl md:text-6xl font-extrabold tracking-tight">
                            Hi, I&apos;m{' '}
                            <span
                                className="text-primary inline-block cursor-pointer transition-colors hover:text-secondary min-w-[200px] md:min-w-[280px]"
                                onMouseEnter={handleTextHover}
                                onMouseLeave={handleTextLeave}
                            >
                                {mainText}
                            </span>
                            ,<br />
                            based in India.
                        </h1>

                        {/* Description */}
                        <p ref={descRef} className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto md:mx-0">
                            Building high-performance, responsive web experiences with modern technologies.
                            Full‑stack developer with a passion for 3D and immersive UIs.
                        </p>

                        {/* CTA Buttons */}
                        <div ref={btnRef} className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                            <button
                                onClick={scrollToProjects}
                                className="group inline-flex items-center px-8 py-3 bg-primary text-white text-lg font-medium rounded-full hover:bg-secondary transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                See My Work
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <a
                                href="/GeneralCV-Hridayesh.pdf"
                                download="GeneralCV-Hridayesh.pdf"
                                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1"
                            >
                                Download CV
                            </a>
                        </div>
                    </div>

                    {/* ── RIGHT (Floating Theme Toggle since avatar is gone) ── */}
                    <div className="absolute top-24 right-4 md:right-8 z-20">
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
                            className="p-3 bg-white dark:bg-gray-800/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark'
                                ? <Sun className="text-yellow-500" size={22} />
                                : <Moon className="text-blue-500" size={22} />
                            }
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
