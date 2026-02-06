import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sun, Moon, Sparkles as SparklesIcon, Download } from 'lucide-react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

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
    const textRef = useRef(null);
    const imageRef = useRef(null);
    const [mainText, setMainText] = useState("Hridayesh");

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(imageRef.current,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
        )
            .fromTo(textRef.current,
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
                "-=0.5"
            );
    }, []);

    const scrollToProjects = () => {
        gsap.to(window, { duration: 1, scrollTo: '#projects', ease: "power2.out" });
    };

    const handleTextHover = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";
        let iterations = 0;
        const target = "Developer";

        const interval = setInterval(() => {
            setMainText(prev =>
                prev.split("").map((letter, index) => {
                    if (index < iterations) {
                        return target[index];
                    }
                    return chars[Math.floor(Math.random() * 36)];
                }).join("").slice(0, target.length)
            );

            if (iterations >= target.length) {
                clearInterval(interval);
                setMainText("Developer");
            }
            iterations += 1 / 3;
        }, 30);
    };

    const handleTextLeave = () => {
        setMainText("Hridayesh");
    };

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden">
            <Sparkles />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                    {/* Image Content (Left) */}
                    <div ref={imageRef} className="flex-1 relative flex justify-center md:justify-start">
                        <div className="relative">
                            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl relative z-10 glass-effect">
                                <img
                                    src="/assets/hero-me.jpeg"
                                    alt="Hridayesh"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentNode.style.backgroundColor = '#ccc';
                                        e.target.parentNode.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500">Image Asset Not Found</div>';
                                    }}
                                />
                            </div>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="absolute bottom-4 right-0 z-20 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform group"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'dark' ?
                                    <Sun className="text-yellow-500" size={24} /> :
                                    <Moon className="text-blue-500" size={24} />
                                }
                            </button>

                            {/* Decorative Elements */}
                            <div className="absolute top-0 left-0 -m-4 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                            <div className="absolute bottom-0 right-10 -m-6 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse delay-700"></div>
                        </div>
                    </div>

                    {/* Text Content (Right) */}
                    <div ref={textRef} className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Hi, I'm <span
                                className="text-primary inline-block cursor-pointer transition-colors hover:text-secondary min-w-[200px]"
                                onMouseEnter={handleTextHover}
                                onMouseLeave={handleTextLeave}
                            >
                                {mainText}
                            </span>,<br />
                            based in India.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto md:mx-0">
                            Building high-performance, responsive web experiences with modern technologies.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                            <button
                                onClick={scrollToProjects}
                                className="group inline-flex items-center px-8 py-3 bg-primary text-white text-lg font-medium rounded-full hover:bg-secondary transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                See My Work
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
