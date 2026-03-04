import { useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const technologies = [
    { name: 'Android Studio', src: '/tech-stack/Android-Studio.svg' },
    { name: 'Android', src: '/tech-stack/Android.svg' },
    { name: 'Blender', src: '/tech-stack/Blender.svg' },
    { name: 'C#', src: '/tech-stack/CSharp.svg' },
    { name: 'C++', src: '/tech-stack/Cpp.svg' },
    { name: 'CSS3', src: '/tech-stack/CSS3.svg' },
    { name: 'Dart', src: '/tech-stack/Dart.svg' },
    { name: 'Docker', src: '/tech-stack/Docker.svg' },
    { name: 'Firebase', src: '/tech-stack/Firebase.svg' },
    { name: 'Flutter', src: '/tech-stack/Flutter.svg' },
    { name: 'HTML5', src: '/tech-stack/HTML5.svg' },
    { name: 'JavaScript', src: '/tech-stack/JavaScript.svg' },
    { name: 'Linux', src: '/tech-stack/Linux.svg' },
    { name: 'MongoDB', src: '/tech-stack/MongoDB.svg' },
    { name: 'MySQL', src: '/tech-stack/MySQL.svg' },
    { name: 'PyTorch', src: '/tech-stack/PyTorch.svg' },
    { name: 'Python', src: '/tech-stack/Python.svg' },
    { name: 'React', src: '/tech-stack/React.svg' },
    { name: 'Three.js', src: '/tech-stack/ThreeJS.svg' },
    { name: 'Ubuntu', src: '/tech-stack/Ubuntu.svg' },
    { name: 'Unity', src: '/tech-stack/Unity.svg' },
    { name: 'Unreal Engine', src: '/tech-stack/Unreal-Engine.svg' },
    { name: 'Vercel', src: '/tech-stack/Vercel.svg' },
    { name: 'Vite', src: '/tech-stack/Vite.svg' },
];

const platforms = [
    { name: 'LeetCode', url: 'https://leetcode.com/u/hridayeshdebsarma6/', icon: '/platforms/leetcode.svg' },
    { name: 'HackerRank', url: 'https://hackerrank.com/hridayesh', icon: '/platforms/hackerrank.svg' },
    { name: 'CodeChef', url: 'https://codechef.com/users/hridayesh', icon: '/platforms/codechef.svg' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/hridayesh', icon: '/platforms/linkedin.svg' },
];

const TechStack = () => {
    const marqueeRef = useRef(null);
    const sectionRef = useRef(null);
    const platformsRef = useRef(null);

    // Infinite marquee
    useEffect(() => {
        const marquee = marqueeRef.current;
        const tl = gsap.timeline({ repeat: -1 });
        tl.to(marquee, { xPercent: -50, duration: 25, ease: 'none' })
            .set(marquee, { xPercent: 0 });
    }, []);

    // Staggered scroll reveal for platforms
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Section heading
            gsap.from('.tech-heading', {
                y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
            });

            // Platform cards stagger
            gsap.from('.platform-card', {
                y: 50, opacity: 0, scale: 0.9,
                stagger: 0.12, duration: 0.7, ease: 'back.out(1.4)',
                scrollTrigger: { trigger: platformsRef.current, start: 'top 85%' }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="tech-stack" ref={sectionRef} className="py-20 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
                <h2 className="tech-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    Tech Arsenal
                </h2>
                <p className="tech-heading text-gray-600 dark:text-gray-400">
                    Tools and technologies I work with.
                </p>
            </div>

            {/* Infinite Marquee */}
            <div className="relative w-full overflow-hidden py-8 bg-transparent">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white dark:from-black to-transparent" />
                <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-white dark:from-black to-transparent" />

                <div ref={marqueeRef} className="flex gap-16 items-center w-max px-8">
                    {[...technologies, ...technologies].map((tech, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 min-w-[90px] group">
                            <img
                                src={tech.src}
                                alt={tech.name}
                                className="w-14 h-14 object-contain filter grayscale group-hover:grayscale-0 group-hover:scale-125 transition-all duration-300"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/56?text=' + tech.name[0]; }}
                            />
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors text-center">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Platform Hub */}
            <div ref={platformsRef} className="max-w-4xl mx-auto mt-16 px-4">
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                    Coding Platforms
                </h3>
                <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                    {platforms.map((platform) => (
                        <a
                            key={platform.name}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="platform-card flex flex-col items-center group"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 group-hover:-translate-y-3 group-hover:shadow-xl group-hover:shadow-primary/20 border border-gray-100 dark:border-gray-700">
                                {platform.icon ? (
                                    <img src={platform.icon} alt={platform.name} className="w-8 h-8 md:w-10 md:h-10" />
                                ) : (
                                    <span className="font-bold text-xl text-primary">{platform.name[0]}</span>
                                )}
                            </div>
                            <span className="mt-3 font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors text-sm">
                                {platform.name}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechStack;
