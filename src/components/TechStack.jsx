import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TechStack = () => {
    const marqueeRef = useRef(null);

    useEffect(() => {
        const marquee = marqueeRef.current;

        // Infinite Horizontal Scroll
        const tl = gsap.timeline({ repeat: -1 });
        tl.to(marquee, {
            xPercent: -50, // Move half the width (since we duplicate content)
            duration: 20,
            ease: "none",
        }).set(marquee, { xPercent: 0 }); // Reset instantly

    }, []);

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
        { name: 'LeetCode', url: 'https://leetcode.com/hridayesh', icon: '/platforms/leetcode.svg' },
        { name: 'HackerRank', url: 'https://hackerrank.com/hridayesh', icon: '/platforms/hackerrank.svg' },
        { name: 'CodeChef', url: 'https://codechef.com/users/hridayesh', icon: '/platforms/codechef.svg' },
        { name: 'LinkedIn', url: 'https://linkedin.com/in/hridayesh', icon: '/platforms/linkedin.svg' },
    ];

    return (
        <section id="tech-stack" className="py-20 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Tech Arsenal</h2>
                <p className="text-gray-600 dark:text-gray-400">Tools and technologies I work with.</p>
            </div>

            {/* Infinite Marquee */}
            <div className="relative w-full overflow-hidden py-8 bg-transparent">
                <div ref={marqueeRef} className="flex gap-16 items-center w-max px-8">
                    {/* Duplicate list for seamless loop */}
                    {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 min-w-[100px]">
                            <img
                                src={tech.src}
                                alt={tech.name}
                                className="w-16 h-16 object-contain filter grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=' + tech.name[0]; }} // Fallback
                            />
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Platform Hub */}
            <div className="max-w-4xl mx-auto mt-16 px-4">
                <h3 className="text-2xl font-bold text-center mb-8">Coding Platforms</h3>
                <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                    {platforms.map((platform) => (
                        <a
                            key={platform.name}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center group"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-gray-700 rounded-2xl shadow-lg flex items-center justify-center transition-transform group-hover:-translate-y-2 group-hover:shadow-xl border border-gray-100 dark:border-gray-600 font-bold text-xl text-primary">
                                {platform.icon ? (
                                    <img
                                        src={platform.icon}
                                        alt={platform.name}
                                        className="w-8 h-8 md:w-10 md:h-10"
                                    />
                                ) : (
                                    <span>{platform.name[0]}</span>
                                )}
                            </div>
                            <span className="mt-3 font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">{platform.name}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechStack;
