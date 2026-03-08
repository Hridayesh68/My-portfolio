import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const models = [
    {
        id: 101,
        name: 'Pirate Ship',
        description: 'Animated sequence of a pirate ship model.',
        image: '/assets/3d models/pirate ship/0000.png',
        sequencePath: '/assets/3d models/pirate ship',
        frames: 36,
    },
    {
        id: 1,
        name: 'Glass & Perfume',
        description: 'Photorealistic render study.',
        image: '/assets/3d models/glass and perfume render.png',
    },
    {
        id: 2,
        name: 'Handgun',
        description: 'Game ready asset.',
        image: '/assets/3d models/handgun.png',
    },
    {
        id: 3,
        name: 'Low Poly World',
        description: 'Stylized environment.',
        image: '/assets/3d models/low poly world.jpg',
    },
    {
        id: 4,
        name: 'Sports Car',
        description: 'Automotive visualization.',
        image: '/assets/3d models/sportscar.jpg',
    }
];

const ModelCarouselImage = ({ model, isHovered }) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const intervalRef = useRef(null);

    // Sequence animation on hover
    useEffect(() => {
        if (isHovered && model.frames) {
            intervalRef.current = setInterval(() => {
                setCurrentFrame(prev => (prev + 1) % model.frames);
            }, 100); // 10fps
        } else {
            clearInterval(intervalRef.current);
            setTimeout(() => setCurrentFrame(0), 150);
        }
        return () => clearInterval(intervalRef.current);
    }, [isHovered, model.frames]);

    const getFrameSrc = () => {
        if (!model.sequencePath) return model.image;
        const frameNum = currentFrame.toString().padStart(4, '0');
        return `${model.sequencePath}/${frameNum}.png`;
    };

    return (
        <img
            src={getFrameSrc()}
            alt={model.name}
            className="w-full h-full object-contain filter drop-shadow-lg transition-transform duration-700 scale-100 group-hover/card:scale-105"
            onError={(e) => { e.target.src = `https://via.placeholder.com/800x600?text=${encodeURIComponent(model.name)}`; }}
        />
    );
};

const Models = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const autoplayRef = useRef(null);

    // Scroll reveal
    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.model-header', {
                y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
            });
            gsap.from('.model-carousel', {
                scale: 0.95, opacity: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    // Autoplay logic
    useEffect(() => {
        if (!isHovered && !selectedModel) {
            autoplayRef.current = setInterval(() => {
                handleNext();
            }, 4000); // Slide every 4 seconds
        }
        return () => clearInterval(autoplayRef.current);
    }, [currentIndex, isHovered, selectedModel]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? models.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === models.length - 1 ? 0 : prev + 1));
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedModel) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [selectedModel]);

    return (
        <section id="models" ref={sectionRef} className="py-24 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 z-10 relative">

                <div className="model-header text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">3D Models & Art</h2>
                    <div className="w-16 h-1.5 bg-secondary mx-auto rounded-full"></div>
                </div>

                <div
                    className="model-carousel relative group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Carousel Track */}
                    <div className="overflow-hidden rounded-2xl shadow-2xl relative bg-gray-100 dark:bg-neutral-900/50 backdrop-blur-md border border-gray-200 dark:border-white/10">
                        <div
                            ref={trackRef}
                            className="flex transition-transform duration-700 ease-in-out h-[300px] md:h-[500px]"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {models.map((model, idx) => (
                                <div key={model.id} className="w-full flex-shrink-0 relative overflow-hidden group/card bg-black/5 dark:bg-black/40">
                                    <ModelCarouselImage model={model} isHovered={isHovered && idx === currentIndex} />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                                            {model.name}
                                        </h3>
                                        <p className="text-gray-300 mb-4 translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 line-clamp-2">
                                            {model.description}
                                        </p>
                                        <button
                                            onClick={() => setSelectedModel(model)}
                                            className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-primary text-white px-6 py-3 rounded-lg font-medium w-max transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-300 hover:scale-105"
                                        >
                                            <Maximize2 size={18} />
                                            View Details
                                        </button>
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
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {models.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-secondary w-8' : 'bg-white/50 hover:bg-white'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Modal Viewer */}
            {selectedModel && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="relative max-w-5xl w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setSelectedModel(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <div className="w-full h-[60vh] md:h-[70vh] bg-black/10 dark:bg-black/50 flex items-center justify-center">
                            <ModelCarouselImage model={selectedModel} isHovered={true} />
                        </div>
                        <div className="p-6 md:p-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedModel.name}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{selectedModel.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Models;
