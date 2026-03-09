import { useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
    {
        id: 'frameworks',
        title: 'Frameworks & Libraries',
        items: ['React', 'Three.js', 'Flutter', 'PyTorch', 'Unity', 'Unreal Engine', 'Vite'],
        animationClass: 'framework-item'
    },
    {
        id: 'tools',
        title: 'Tools & Platforms',
        items: ['Android Studio', 'Blender', 'Docker', 'Firebase', 'Vercel'],
        animationClass: 'tool-item'
    },
    {
        id: 'cs-fundamentals',
        title: 'Operating Systems',
        items: ['Linux', 'Ubuntu'],
        animationClass: 'cs-item'
    },
    {
        id: 'languages',
        title: 'Languages & Databases',
        items: ['JavaScript', 'Python', 'C++', 'C#', 'Dart', 'HTML5', 'CSS3', 'MongoDB', 'MySQL', 'Android'],
        animationClass: 'lang-item'
    }
];

const techIcons = {
    'React': '/tech-stack/React.svg',
    'Three.js': '/tech-stack/ThreeJS.svg',
    'Flutter': '/tech-stack/Flutter.svg',
    'PyTorch': '/tech-stack/PyTorch.svg',
    'Unity': '/tech-stack/Unity.svg',
    'Unreal Engine': '/tech-stack/Unreal-Engine.svg',
    'Vite': '/tech-stack/Vite.svg',
    'Docker': '/tech-stack/Docker.svg',
    'Android Studio': '/tech-stack/Android-Studio.svg',
    'Blender': '/tech-stack/Blender.svg',
    'Vercel': '/tech-stack/Vercel.svg',
    'Firebase': '/tech-stack/Firebase.svg',
    'Linux': '/tech-stack/Linux.svg',
    'Ubuntu': '/tech-stack/Ubuntu.svg',
    'JavaScript': '/tech-stack/JavaScript.svg',
    'Python': '/tech-stack/Python.svg',
    'C++': '/tech-stack/Cpp.svg',
    'C#': '/tech-stack/CSharp.svg',
    'Dart': '/tech-stack/Dart.svg',
    'HTML5': '/tech-stack/HTML5.svg',
    'CSS3': '/tech-stack/CSS3.svg',
    'MongoDB': '/tech-stack/MongoDB.svg',
    'MySQL': '/tech-stack/MySQL.svg',
    'Android': '/tech-stack/Android.svg',
};

const platforms = [
    { name: 'LeetCode', url: 'https://leetcode.com/u/hridayeshdebsarma6/', icon: '/platforms/leetcode.svg' },
    { name: 'HackerRank', url: 'https://hackerrank.com/hridayesh', icon: '/platforms/hackerrank.svg' },
    { name: 'CodeChef', url: 'https://codechef.com/users/hridayesh', icon: '/platforms/codechef.svg' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/hridayesh-debsarma/', icon: '/platforms/linkedin.svg' },
];

const TechStack = () => {
    const marqueeRef = useRef(null);
    const sectionRef = useRef(null);
    const platformsRef = useRef(null);

    // Staggered scroll reveal using IntersectionObserver safe from Pin conflicts
    useLayoutEffect(() => {
        let played = false;

        const ctx = gsap.context(() => {
            // Instantly hide the elements before the observer plays the timeline
            gsap.set('.tech-heading, .framework-item, .tool-item, .cs-item, .lang-item, .platform-card', { opacity: 0 });
        }, sectionRef);

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !played) {
                played = true;
                ctx.add(() => {
                    const tl = gsap.timeline();
                    tl.fromTo('.tech-heading',
                        { y: 40, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
                    )
                        // 1. Frameworks & Libraries — slide in from left to right, staggered
                        .fromTo('.framework-item',
                            { x: -120, opacity: 0 },
                            { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
                            '-=0.2')
                        // 2. Tools & Platforms — scale up from 0 with fade
                        .fromTo('.tool-item',
                            { scale: 0, opacity: 0 },
                            { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' },
                            '-=0.2')
                        // 3. Core CS Fundamentals — flip in on X axis (rotateX)
                        .fromTo('.cs-item',
                            { rotationX: 90, opacity: 0 },
                            { rotationX: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
                            '-=0.2')
                        // 4. Programming Languages — drop from top with bounce
                        .fromTo('.lang-item',
                            { y: -80, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'bounce.out' },
                            '-=0.2')
                        // Platform cards stagger
                        .fromTo('.platform-card',
                            { y: 50, opacity: 0, scale: 0.9 },
                            { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(1.4)' },
                            '-=0.4');
                });
            }
        }, { threshold: 0.15 });

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            observer.disconnect();
            ctx.revert();
        };
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

            <div className="max-w-4xl mx-auto px-4 space-y-16">
                {skillCategories.map((category) => (
                    <div key={category.id} id={category.id} className="skill-category">
                        <h3 className="text-xl font-bold mb-6 text-gray-500 dark:text-gray-400 uppercase tracking-widest text-center md:text-left">
                            {category.title}
                        </h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            {category.items.map((item) => (
                                <div
                                    key={item}
                                    className={`${category.animationClass} group flex items-center justify-center bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 w-16 h-16 md:w-20 md:h-20 rounded-2xl backdrop-blur-md shadow-sm hover:scale-110 hover:bg-black/10 dark:hover:bg-white/20 transition-all cursor-default`}
                                >
                                    {techIcons[item] && (
                                        <div className="icon-float" style={{ animationDelay: `${Math.random() * 2}s` }}>
                                            <img
                                                src={techIcons[item]}
                                                alt={item}
                                                className="w-10 h-10 md:w-12 md:h-12 object-contain filter dark:brightness-110 transition-transform duration-300 group-hover:scale-110"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
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
