import { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedCount = memo(({ target, prefix = '', suffix = '', className = '' }) => {
    const elRef = useRef(null);
    const triggered = useRef(false);

    useEffect(() => {
        // Handle non-numeric targets early (e.g. fallback string "200+")
        if (typeof target !== 'number') return;
        
        if (!elRef.current || triggered.current || target === 0) return;
        
        const ctx = gsap.context(() => {
            const counter = { val: 0 };
            ScrollTrigger.create({
                trigger: elRef.current,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    if (triggered.current) return;
                    triggered.current = true;
                    gsap.to(counter, {
                        val: target,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: () => {
                            if (elRef.current) {
                                elRef.current.textContent = prefix + Math.round(counter.val) + suffix;
                            }
                        },
                    });
                },
            });
        });
        return () => ctx.revert();
    }, [target, prefix, suffix]);

    // If target is a string (like a fallback), just render it directly
    if (typeof target !== 'number') {
        return <span className={className}>{prefix}{target}{suffix}</span>;
    }

    return (
        <span ref={elRef} className={className}>
            {prefix}0{suffix}
        </span>
    );
});

AnimatedCount.displayName = 'AnimatedCount';
export default AnimatedCount;
