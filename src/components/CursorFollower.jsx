import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CursorFollower = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);

    useEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        // Hide default cursor on desktop only
        const style = document.createElement('style');
        style.id = 'cursor-style';
        style.textContent = '@media (pointer: fine) { * { cursor: none !important; } }';
        document.head.appendChild(style);

        let mouseX = -100;
        let mouseY = -100;

        const onMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Inner dot follows instantly
            gsap.to(dot, {
                x: mouseX,
                y: mouseY,
                duration: 0.08,
                ease: 'power2.out',
            });

            // Outer ring follows with lag
            gsap.to(ring, {
                x: mouseX,
                y: mouseY,
                duration: 0.35,
                ease: 'power2.out',
            });
        };

        // Scale ring up on hoverable elements
        const onEnter = () => {
            gsap.to(ring, { scale: 2.2, opacity: 0.6, duration: 0.25 });
            gsap.to(dot, { scale: 0.5, duration: 0.25 });
        };

        const onLeave = () => {
            gsap.to(ring, { scale: 1, opacity: 1, duration: 0.25 });
            gsap.to(dot, { scale: 1, duration: 0.25 });
        };

        // Clicking
        const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.1 });
        const onUp = () => gsap.to(ring, { scale: 1, duration: 0.1 });

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mousedown', onDown);
        window.addEventListener('mouseup', onUp);

        // Attach hover listeners to interactive elements
        const interactors = document.querySelectorAll('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
        interactors.forEach(el => {
            el.addEventListener('mouseenter', onEnter);
            el.addEventListener('mouseleave', onLeave);
        });

        // MutationObserver to pick up dynamically added elements
        const observer = new MutationObserver(() => {
            document.querySelectorAll('a, button, [role="button"]').forEach(el => {
                el.removeEventListener('mouseenter', onEnter);
                el.removeEventListener('mouseleave', onLeave);
                el.addEventListener('mouseenter', onEnter);
                el.addEventListener('mouseleave', onLeave);
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
            interactors.forEach(el => {
                el.removeEventListener('mouseenter', onEnter);
                el.removeEventListener('mouseleave', onLeave);
            });
            observer.disconnect();
            const s = document.getElementById('cursor-style');
            if (s) s.remove();
        };
    }, []);

    return (
        <>
            {/* Inner dot */}
            <div
                ref={dotRef}
                className="pointer-events-none fixed z-[9999] top-0 left-0 hidden md:block"
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#646cff',
                    transform: 'translate(-50%, -50%)',
                    willChange: 'transform',
                }}
            />
            {/* Outer ring */}
            <div
                ref={ringRef}
                className="pointer-events-none fixed z-[9998] top-0 left-0 hidden md:block"
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: '2px solid rgba(100, 108, 255, 0.7)',
                    transform: 'translate(-50%, -50%)',
                    willChange: 'transform',
                    backdropFilter: 'blur(1px)',
                }}
            />
        </>
    );
};

export default CursorFollower;
