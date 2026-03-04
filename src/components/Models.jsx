import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Maximize2, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from './ui/Card';

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

const ModelCard = ({ model, onClick }) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef(null);
    const cardRef = useRef(null);

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

    // GSAP hover scale and glow
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const onEnter = () => gsap.to(el, { scale: 1.03, boxShadow: "0px 10px 30px rgba(138, 43, 226, 0.3)", duration: 0.3, ease: 'power2.out' });
        const onLeave = () => gsap.to(el, { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)", duration: 0.3, ease: 'power2.out' });
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
        return () => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave); };
    }, []);

    const getFrameSrc = () => {
        if (!model.sequencePath) return model.image;
        const frameNum = currentFrame.toString().padStart(4, '0');
        return `${model.sequencePath}/${frameNum}.png`;
    };

    return (
        <div
            ref={cardRef}
            className="group cursor-pointer h-full animate-float"
            style={{ animationDelay: `${model.id * 0.2}s` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick(model)}
        >
            <Card className="h-full border-2 border-transparent group-hover:border-primary/50 transition-colors duration-300">
                <div className="relative h-64 overflow-hidden rounded-t-xl bg-gray-100 dark:bg-black/50">
                    <img
                        src={getFrameSrc()}
                        alt={model.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        onError={(e) => { e.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(model.name)}`; }}
                    />
                    {/* Hover expand icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-md text-white transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-100">
                            <Maximize2 size={24} />
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-transparent">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">{model.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{model.description}</p>
                </div>
            </Card>
        </div>
    );
};

const Models = () => {
    const sectionRef = useRef(null);
    const [selectedModel, setSelectedModel] = useState(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.model-header', {
                y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
            });
            gsap.from('.model-card-item', {
                y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.2)',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

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
            <div className="max-w-7xl mx-auto px-4 z-10 relative">

                <div className="model-header text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">3D Models & Art</h2>
                    <div className="w-16 h-1.5 bg-secondary mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {models.map((model) => (
                        <div key={model.id} className="model-card-item">
                            <ModelCard model={model} onClick={setSelectedModel} />
                        </div>
                    ))}
                </div>

            </div>

            {/* Modal Viewer */}
            {selectedModel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="relative max-w-5xl w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setSelectedModel(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <div className="w-full h-[60vh] md:h-[70vh] bg-black/10 dark:bg-black/50 flex items-center justify-center">
                            <img
                                src={selectedModel.image}
                                alt={selectedModel.name}
                                className="max-w-full max-h-full object-contain filter drop-shadow-2xl"
                            />
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
