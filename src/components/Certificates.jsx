import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';

gsap.registerPlugin(ScrollTrigger);

const certificates = [
    {
        id: 1,
        title: 'FreeCodeCamp',
        image: '/assets/certificates/freecode camp.png',
        link: 'https://drive.google.com/file/d/1Wkzg2AwOVRt4JTNFtVniQWA2KydSJK7T/view?usp=sharing'
    },
    {
        id: 2,
        title: 'Mastering DSA',
        image: '/assets/certificates/Mastering DSA.png',
        link: 'https://drive.google.com/file/d/19cUZg4e1Gd2sHRkSYMwDrRXpQoH8VZcG/view?usp=sharing'
    },
    {
        id: 3,
        title: 'Cloud Computing',
        // Using hackathon image as fallback since a dedicated cloud image wasn't found in dir
        image: '/assets/certificates/webka hackathon.png',
        link: 'https://drive.google.com/file/d/1_9oPMONZ7iU4BtZbqNoBeF0d69CfWVh0/view?usp=sharing'
    },
    {
        id: 4,
        title: 'MBA Certificate',
        image: '/assets/certificates/certificate mba.png',
        link: 'https://drive.google.com/file/d/1TFcQsbhKjdjcG_l7bREtfajAwh41_Itw/view?usp=sharing'
    }
];

const Certificates = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const autoplayRef = useRef(null);

    // Scroll reveal
    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.cert-header', {
                y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
            });
            gsap.from('.cert-carousel', {
                scale: 0.95, opacity: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    // Autoplay logic
    useEffect(() => {
        if (!isHovered) {
            autoplayRef.current = setInterval(() => {
                handleNext();
            }, 4000); // Slide every 4 seconds
        }
        return () => clearInterval(autoplayRef.current);
    }, [currentIndex, isHovered]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? certificates.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === certificates.length - 1 ? 0 : prev + 1));
    };

    return (
        <section id="certificates" ref={sectionRef} className="py-24 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 z-10 relative">

                <div className="cert-header text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Certifications</h2>
                    <div className="w-16 h-1.5 bg-primary mx-auto rounded-full"></div>
                </div>

                <div
                    className="cert-carousel relative group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Carousel Track */}
                    <div className="overflow-hidden rounded-2xl shadow-2xl relative bg-gray-100 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10">
                        <div
                            ref={trackRef}
                            className="flex transition-transform duration-700 ease-in-out h-[300px] md:h-[500px]"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {certificates.map((cert) => (
                                <div key={cert.id} className="w-full flex-shrink-0 relative overflow-hidden group/card">
                                    <img
                                        src={cert.image}
                                        alt={cert.title}
                                        className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover/card:scale-105"
                                        onError={(e) => { e.target.src = `https://via.placeholder.com/800x600?text=${encodeURIComponent(cert.title)}`; }}
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                                            {cert.title}
                                        </h3>
                                        <a
                                            href={cert.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-medium w-max transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-300 hover:scale-105"
                                        >
                                            <ExternalLink size={18} />
                                            View Certificate
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Controls */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 dark:bg-black/50 text-gray-900 dark:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white dark:hover:bg-black hover:scale-110 shadow-lg"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 dark:bg-black/50 text-gray-900 dark:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white dark:hover:bg-black hover:scale-110 shadow-lg"
                        >
                            <ChevronRight size={24} />
                        </button>

                        {/* Indicators */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {certificates.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Certificates;
