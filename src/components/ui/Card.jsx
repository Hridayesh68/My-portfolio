import React, { useRef, useEffect } from "react";

const Card = ({ children, className = "" }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e) => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const angle =
                Math.atan2(y - r.height / 2, x - r.width / 2) * (180 / Math.PI);
            card.style.setProperty("--start", angle + 90);
        };

        // Add event listener to the card itself or a parent if needed.
        // For individual card rotation, attaching to the card is correct.
        card.addEventListener("mousemove", handleMouseMove);

        return () => {
            card.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={`card-gradient group relative overflow-hidden rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] transition-all duration-500 ${className}`}
        >
            {/* glow */}
            <div
                className="pointer-events-none absolute inset-0 blur-xl saturate-200 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[rgba(217,119,6,0.12)]"
            ></div>

            {/* content */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
};

export default Card;
