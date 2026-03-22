import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// ─────────────────────────────────────────────────────────────────────────────
//  GAMIFIED LOADING SCREEN
//  Font: HeadCapitalBoldGrunge — place in /public/fonts/
//  Aesthetic: Dark RPG / tactical-action HUD
//  Palette: Charcoal black · Ember gold · Blood orange · Glitch cyan
// ─────────────────────────────────────────────────────────────────────────────

const BOOT_LINES = [
    'MOUNTING ASSET REGISTRY...',
    'CALIBRATING RENDER PIPELINE...',
    'LOADING WORLD SHADERS...',
    'SYNCING PORTFOLIO DATA...',
    'INITIALIZING EXPERIENCE ENGINE...',
];

// XP-style segmented bar — 20 cells
const BAR_CELLS = 20;

// Ember particle helper
function randomEmber() {
    return {
        id: Math.random(),
        x: Math.random() * 100,
        y: 100 + Math.random() * 10,
        size: 2 + Math.random() * 3,
        dur: 2.5 + Math.random() * 3,
        delay: Math.random() * 3,
        drift: (Math.random() - 0.5) * 60,
    };
}

const LoadingScreen = ({ onComplete }) => {
    const containerRef   = useRef(null);
    const titleRef       = useRef(null);
    const scanRef        = useRef(null);
    const hudTLRef       = useRef(null);
    const hudBRRef       = useRef(null);
    const barRowRef      = useRef(null);
    const pctRef         = useRef(null);
    const logRef         = useRef(null);
    const glitchARef     = useRef(null);
    const glitchBRef     = useRef(null);
    const overlayRef     = useRef(null);

    const [filledCells, setFilledCells] = useState(0);
    const [pct, setPct]                 = useState(0);
    const [logLine, setLogLine]         = useState(BOOT_LINES[0]);
    const [embersArr]                   = useState(() => Array.from({ length: 22 }, randomEmber));

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // ── 0. Flash boot ──────────────────────────────────────────────────
        tl.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.2, ease: 'steps(3)' }
        );

        // ── 1. HUD corners slide in ────────────────────────────────────────
        tl.fromTo([hudTLRef.current, hudBRRef.current],
            { opacity: 0, scale: 0.7 },
            { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(2)' },
            0.15
        );

        // ── 2. Scanlines flicker in ────────────────────────────────────────
        tl.fromTo(scanRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3 },
            0.1
        );

        // ── 3. Title slams down with glitch offset ─────────────────────────
        tl.fromTo(titleRef.current,
            { y: -60, opacity: 0, skewX: 8 },
            { y: 0, opacity: 1, skewX: 0, duration: 0.5, ease: 'power4.out' },
            0.25
        );

        // Chromatic glitch layers — brief flash
        tl.fromTo([glitchARef.current, glitchBRef.current],
            { opacity: 0, x: 0 },
            {
                opacity: 0.55,
                x: (i) => (i === 0 ? -6 : 6),
                duration: 0.08,
                ease: 'steps(1)',
            }, 0.72
        ).to([glitchARef.current, glitchBRef.current],
            { opacity: 0, x: 0, duration: 0.06 }, 0.80
        );

        // Repeat glitch at later interval
        tl.to([glitchARef.current, glitchBRef.current],
            { opacity: 0.4, x: (i) => (i === 0 ? 5 : -5), duration: 0.05 }, 1.8
        ).to([glitchARef.current, glitchBRef.current],
            { opacity: 0, x: 0, duration: 0.05 }, 1.85
        );

        // ── 4. Bar slides in ───────────────────────────────────────────────
        tl.fromTo(barRowRef.current,
            { x: -40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.35 },
            0.5
        );

        // ── 5. Fill bar cells + log lines with a single counter tween ──────
        const counter = { val: 0 };
        tl.to(counter, {
            val: BAR_CELLS,
            duration: 2.2,
            ease: 'power1.inOut',
            onUpdate() {
                const v = Math.round(counter.val);
                setFilledCells(v);
                const p = Math.round((v / BAR_CELLS) * 100);
                setPct(p);
                const idx = Math.min(
                    Math.floor((v / BAR_CELLS) * BOOT_LINES.length),
                    BOOT_LINES.length - 1
                );
                setLogLine(BOOT_LINES[idx]);
            },
        }, 0.65);

        // ── 6. Log line enters ─────────────────────────────────────────────
        tl.fromTo(logRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3 },
            0.65
        );

        // ── 7. Big flash on complete ───────────────────────────────────────
        tl.fromTo(overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.12, ease: 'steps(1)' },
            '+=0.18'
        ).to(overlayRef.current,
            { opacity: 0, duration: 0.15 },
            '+=0.01'
        );

        // ── 8. Everything shudders upward ──────────────────────────────────
        tl.to(containerRef.current,
            { y: '-102%', duration: 0.7, ease: 'power4.in', onComplete },
            '+=0.05'
        );

        return () => tl.kill();
    }, [onComplete]);

    return (
        <>
            {/* ── Font declaration ─────────────────────────────────────── */}
            <style>{`
                @font-face {
                    font-family: 'HeadCapital';
                    src: url('/fonts/HeadCapitalBoldGrunge-KV9RA.otf') format('opentype');
                    font-weight: 700;
                    font-style: normal;
                }

                .hud-corner {
                    width: 52px; height: 52px;
                    border-color: #c07a1a;
                }
                .hud-corner-tl {
                    border-top: 2px solid; border-left: 2px solid;
                    top: 28px; left: 28px;
                }
                .hud-corner-tr {
                    border-top: 2px solid; border-right: 2px solid;
                    top: 28px; right: 28px;
                }
                .hud-corner-bl {
                    border-bottom: 2px solid; border-left: 2px solid;
                    bottom: 28px; left: 28px;
                }
                .hud-corner-br {
                    border-bottom: 2px solid; border-right: 2px solid;
                    bottom: 28px; right: 28px;
                }

                @keyframes scanMove {
                    from { background-position: 0 0; }
                    to   { background-position: 0 100%; }
                }
                @keyframes emberRise {
                    0%   { transform: translateY(0)   translateX(0)      opacity(1);   opacity: 0.9; }
                    60%  { opacity: 0.7; }
                    100% { transform: translateY(-110vh) translateX(var(--drift)) opacity(0); opacity: 0; }
                }
                @keyframes barPulse {
                    0%, 100% { box-shadow: 0 0 8px 1px #d97706aa; }
                    50%       { box-shadow: 0 0 18px 4px #f59e0bcc; }
                }
                @keyframes titleFlicker {
                    0%,100% { opacity:1 }
                    92%     { opacity:1 }
                    93%     { opacity:0.4 }
                    94%     { opacity:1 }
                    97%     { opacity:0.7 }
                    98%     { opacity:1 }
                }
                @keyframes cursorBlink {
                    0%,49% { opacity:1 }
                    50%,100% { opacity:0 }
                }
            `}</style>

            <div
                ref={containerRef}
                style={{
                    position: 'fixed', inset: 0, zIndex: 200,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: '#0a0804',
                    overflow: 'hidden',
                    willChange: 'transform',
                    opacity: 0,
                }}
            >
                {/* ── Radial vignette ───────────────────────────────────── */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, #000000cc 100%)',
                }}/>

                {/* ── Scanlines ─────────────────────────────────────────── */}
                <div
                    ref={scanRef}
                    style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.28) 3px, rgba(0,0,0,0.28) 4px)',
                        animation: 'scanMove 6s linear infinite',
                        opacity: 0,
                    }}
                />

                {/* ── Noise texture ─────────────────────────────────────── */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
                    opacity: 0.35,
                }}/>

                {/* ── Ember particles ───────────────────────────────────── */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    {embersArr.map(e => (
                        <div
                            key={e.id}
                            style={{
                                position: 'absolute',
                                left: `${e.x}%`,
                                bottom: 0,
                                width: e.size,
                                height: e.size * 2.5,
                                borderRadius: '50% 50% 40% 40%',
                                background: `radial-gradient(ellipse at 50% 60%, #fbbf24, #f97316cc, transparent)`,
                                '--drift': `${e.drift}px`,
                                animation: `emberRise ${e.dur}s ${e.delay}s ease-in infinite`,
                                opacity: 0,
                            }}
                        />
                    ))}
                </div>

                {/* ── Ambient glow ──────────────────────────────────────── */}
                <div style={{
                    position: 'absolute', bottom: '-20%', left: '50%',
                    transform: 'translateX(-50%)',
                    width: 800, height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse, #92400e44 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}/>

                {/* ── HUD corners ───────────────────────────────────────── */}
                <div ref={hudTLRef} style={{ position: 'absolute', opacity: 0 }}>
                    <div className="hud-corner hud-corner-tl" style={{ position: 'absolute' }}/>
                    <div className="hud-corner hud-corner-tr" style={{ position: 'absolute' }}/>
                    <div className="hud-corner hud-corner-bl" style={{ position: 'absolute' }}/>
                    <div className="hud-corner hud-corner-br" style={{ position: 'absolute' }}/>
                </div>
                {/* Duplicate set for BR cluster */}
                <div ref={hudBRRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}>
                    {/* inner deco lines */}
                    <div style={{
                        position: 'absolute', top: 44, left: 80, right: 80,
                        height: 1, background: 'linear-gradient(90deg, #c07a1a44, transparent 30%, transparent 70%, #c07a1a44)',
                    }}/>
                    <div style={{
                        position: 'absolute', bottom: 44, left: 80, right: 80,
                        height: 1, background: 'linear-gradient(90deg, #c07a1a44, transparent 30%, transparent 70%, #c07a1a44)',
                    }}/>
                </div>

                {/* ── Main content ──────────────────────────────────────── */}
                <div style={{
                    position: 'relative', zIndex: 10,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 28,
                    width: '100%', padding: '0 32px',
                    maxWidth: 820,
                }}>

                    {/* ── Title stack ─────────────────────────────────── */}
                    <div style={{ position: 'relative', textAlign: 'center', lineHeight: 1 }}>
                        {/* Chromatic A layer (red) */}
                        <div
                            ref={glitchARef}
                            aria-hidden
                            style={{
                                position: 'absolute', inset: 0,
                                fontFamily: "'HeadCapital', serif",
                                fontSize: 'clamp(56px, 12vw, 108px)',
                                fontWeight: 700,
                                color: 'transparent',
                                WebkitTextStroke: '1px #ef4444',
                                opacity: 0,
                                userSelect: 'none',
                                letterSpacing: '0.04em',
                            }}
                        >
                            HIDRAYES
                        </div>
                        {/* Chromatic B layer (cyan) */}
                        <div
                            ref={glitchBRef}
                            aria-hidden
                            style={{
                                position: 'absolute', inset: 0,
                                fontFamily: "'HeadCapital', serif",
                                fontSize: 'clamp(56px, 12vw, 108px)',
                                fontWeight: 700,
                                color: 'transparent',
                                WebkitTextStroke: '1px #22d3ee',
                                opacity: 0,
                                userSelect: 'none',
                                letterSpacing: '0.04em',
                            }}
                        >
                            HIDRAYES
                        </div>
                        {/* Main title */}
                        <h1
                            ref={titleRef}
                            style={{
                                fontFamily: "'HeadCapital', serif",
                                fontSize: 'clamp(56px, 12vw, 108px)',
                                fontWeight: 700,
                                margin: 0,
                                background: 'linear-gradient(165deg, #fde68a 0%, #f59e0b 35%, #d97706 65%, #92400e 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                letterSpacing: '0.04em',
                                textShadow: 'none',
                                filter: 'drop-shadow(0 0 24px #f59e0b66) drop-shadow(0 2px 0px #000)',
                                animation: 'titleFlicker 5s 1.2s infinite',
                                opacity: 0,
                                userSelect: 'none',
                            }}
                        >
                            HIDRAYES
                        </h1>

                        {/* Subtitle rule */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, justifyContent: 'center',
                        }}>
                            <div style={{ flex: 1, height: 1, maxWidth: 80, background: 'linear-gradient(90deg, transparent, #c07a1a)' }}/>
                            <span style={{
                                fontFamily: 'monospace',
                                fontSize: 10,
                                letterSpacing: '0.35em',
                                color: '#a16207',
                                textTransform: 'uppercase',
                            }}>
                                Portfolio · 2025
                            </span>
                            <div style={{ flex: 1, height: 1, maxWidth: 80, background: 'linear-gradient(90deg, #c07a1a, transparent)' }}/>
                        </div>
                    </div>

                    {/* ── XP / Progress bar ───────────────────────────── */}
                    <div ref={barRowRef} style={{ width: '100%', opacity: 0 }}>
                        {/* Label row */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            marginBottom: 7,
                        }}>
                            <span style={{
                                fontFamily: 'monospace', fontSize: 9,
                                letterSpacing: '0.3em', color: '#92400e',
                                textTransform: 'uppercase',
                            }}>
                                ▸ LOADING
                            </span>
                            <span
                                ref={pctRef}
                                style={{
                                    fontFamily: 'monospace', fontSize: 9,
                                    letterSpacing: '0.2em', color: '#fbbf24',
                                    textTransform: 'uppercase',
                                    fontVariantNumeric: 'tabular-nums',
                                }}
                            >
                                {pct.toString().padStart(3, '0')}%
                            </span>
                        </div>

                        {/* Segmented bar */}
                        <div style={{
                            display: 'flex', gap: 3,
                            padding: '4px 5px',
                            border: '1px solid #44200a',
                            background: '#0f0600',
                            boxShadow: 'inset 0 0 12px #00000088, 0 0 0 1px #6b210044',
                        }}>
                            {Array.from({ length: BAR_CELLS }).map((_, i) => {
                                const filled = i < filledCells;
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            flex: 1,
                                            height: 12,
                                            background: filled
                                                ? 'linear-gradient(180deg, #fde68a 0%, #d97706 55%, #92400e 100%)'
                                                : '#1a0c00',
                                            boxShadow: filled
                                                ? '0 0 6px 1px #f59e0b88'
                                                : 'none',
                                            transition: 'background 0.08s, box-shadow 0.08s',
                                            animation: filled && i === filledCells - 1
                                                ? 'barPulse 0.6s ease-in-out infinite'
                                                : 'none',
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Boot log line ───────────────────────────────── */}
                    <div
                        ref={logRef}
                        style={{
                            opacity: 0,
                            fontFamily: 'monospace',
                            fontSize: 'clamp(8px, 1.5vw, 11px)',
                            color: '#78350f',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}
                    >
                        <span style={{
                            display: 'inline-block',
                            width: 6, height: 12,
                            background: '#d97706',
                            animation: 'cursorBlink 0.8s step-end infinite',
                        }}/>
                        {logLine}
                    </div>

                </div>

                {/* ── White flash overlay ──────────────────────────────── */}
                <div
                    ref={overlayRef}
                    style={{
                        position: 'absolute', inset: 0,
                        background: '#fff8e0',
                        opacity: 0,
                        pointerEvents: 'none',
                    }}
                />

            </div>
        </>
    );
};

export default LoadingScreen;