import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Rocket } from 'lucide-react';

const LoadingScreen = ({ onComplete }) => {
    const containerRef = useRef(null);
    const rocketRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: onComplete
        });

        // Initial state
        gsap.set(rocketRef.current, { y: 200, opacity: 0 });

        tl.to(rocketRef.current, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        })
            .to(rocketRef.current, {
                y: -500,
                duration: 1.5,
                ease: "power4.in",
                delay: 0.5
            })
            .to(containerRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: "power1.out"
            }, "-=0.5");

    }, [onComplete]);

    return (
        <div ref={containerRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-white">
            <div ref={rocketRef} className="relative">
                <Rocket size={64} className="text-primary animate-pulse" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-4 h-12 bg-orange-500 rounded-full blur-md opacity-75"></div>
            </div>
            <h2 className="mt-8 text-2xl font-bold tracking-widest uppercase">Launching...</h2>
        </div>
    );
};

export default LoadingScreen;
