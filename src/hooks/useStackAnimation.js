import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useStackAnimation(sectionRefs) {
  useLayoutEffect(() => {
    // Filter out null refs and get DOM elements
    const sections = sectionRefs.current.filter(Boolean);
    if (sections.length === 0) return;

    const ctx = gsap.context(() => {
      // 1. Assign ascending z-indices to ensure correct layering
      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: 10 + i * 10 });
      });

      // 2. Loop through sections to orchestrate stacking
      sections.forEach((section, i) => {
        // EXIT ANIMATION: As the NEXT section covers this one:
        // Scale down, fade out, and blur the current section.
        if (i < sections.length - 1) {
          gsap.to(section, {
            scale: 0.85,
            opacity: 0.4,
            filter: 'brightness(0.5) blur(4px)',
            ease: 'none',
            scrollTrigger: {
              trigger: sections[i + 1], // Watch the arrival of the NEXT card
              start: 'top bottom',      // When next card enters from below
              end: 'top top',           // When next card fully pins atop
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }

        // ENTRANCE ANIMATION: For every section except the first:
        // Start slightly lower and rise up as it scrolls into view.
        if (i > 0) {
          gsap.fromTo(section, 
            { yPercent: 10 }, 
            {
              yPercent: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top top',
                scrub: true,
                invalidateOnRefresh: true,
              }
            }
          );
        }
      });

      // 3. Robust Refresh Policy
      // Refresh after fonts load to fix any layout shifts
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });

      // Safety refresh for async content and dynamic heights
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => clearTimeout(timer);
    }, sectionRefs); // Scope to the parent container

    // Handle window resize specifically for ScrollTrigger recalculations
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Only run on mount
}
