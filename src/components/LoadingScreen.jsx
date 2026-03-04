import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const LoadingScreen = ({ onComplete }) => {
    const containerRef = useRef(null);
    const percentRef = useRef(null);
    const barRef = useRef(null);
    const textRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        const counter = { val: 0 };

        const tl = gsap.timeline();

        // Fade in loading screen
        tl.from(containerRef.current, { opacity: 0, duration: 0.3 })
            // Animate the counter from 0 to 100
            .to(counter, {
                val: 100,
                duration: 2.2,
                ease: 'power1.inOut',
                onUpdate: () => {
                    const v = Math.round(counter.val);
                    if (percentRef.current) percentRef.current.textContent = v + '%';
                    if (barRef.current) barRef.current.style.width = v + '%';
                }
            }, 0)
            // Animate bar fill (redundant but ensures sync)
            // Fade out the text content
            .to([textRef.current], {
                opacity: 0,
                y: -20,
                duration: 0.4,
                ease: 'power2.in'
            })
            // Slide the overlay up to reveal content
            .to(containerRef.current, {
                yPercent: -100,
                duration: 0.9,
                ease: 'power4.inOut',
                onComplete: onComplete
            });

    }, [onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black"
            style={{ willChange: 'transform' }}
        >
            {/* Background grid pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(100, 108, 255, 0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(100, 108, 255, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Center content */}
            <div ref={textRef} className="relative z-10 flex flex-col items-center gap-8">
                {/* Logo / initials */}
                <div className="relative">
                    <svg
                        className="w-20 h-20"
                        viewBox="0 0 100 100"
                        fill="none"
                        stroke="#646cff"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {/* H */}
                        <path d="M20 20 V80 M20 50 H50 M50 20 V80" />
                        {/* D */}
                        <path d="M55 20 H70 A25 25 0 0 1 70 80 H55 V20 Z" />
                    </svg>
                    {/* Glow ring */}
                    <div className="absolute inset-0 rounded-full blur-2xl opacity-40 bg-primary" />
                </div>

                {/* Name */}
                <p className="text-white/40 text-sm font-mono tracking-[0.3em] uppercase">
                    Hridayesh · Portfolio
                </p>

                {/* Big percentage */}
                <div
                    ref={percentRef}
                    className="text-7xl md:text-9xl font-black text-white tabular-nums"
                    style={{
                        fontVariantNumeric: 'tabular-nums',
                        textShadow: '0 0 40px rgba(100,108,255,0.5)'
                    }}
                >
                    0%
                </div>

                {/* Progress bar */}
                <div className="w-64 md:w-96 h-[2px] bg-white/10 rounded-full overflow-hidden">
                    <div
                        ref={barRef}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: '0%', transition: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
