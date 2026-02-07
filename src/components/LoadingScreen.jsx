import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const LoadingScreen = ({ onComplete }) => {
    const containerRef = useRef(null);
    const logoRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: onComplete
        });

        // Initial state
        gsap.set(logoRef.current, { scale: 0.8, opacity: 0 });

        tl.to(logoRef.current, {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        })
            .to(logoRef.current, {
                scale: 1.2,
                opacity: 0,
                duration: 0.8,
                ease: "power2.in",
                delay: 1 // Keep it visible/flashing for a bit
            })
            .to(containerRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: "power1.out"
            }, "-=0.2");

    }, [onComplete]);

    return (
        <div ref={containerRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-white">
            <div ref={logoRef} className="relative flex flex-col items-center">
                <svg className="w-24 h-24 text-primary animate-pulse" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                    {/* H */}
                    <path d="M20 20 V80 M20 50 H50 M50 20 V80" />
                    {/* D */}
                    <path d="M55 20 H70 A25 25 0 0 1 70 80 H55 V20 Z" />
                </svg>
                {/* Optional glow effect */}
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse"></div>
            </div>
            <h2 className="mt-8 text-2xl font-bold tracking-widest uppercase text-white50">Loading...</h2>
        </div>
    );
};

export default LoadingScreen;
