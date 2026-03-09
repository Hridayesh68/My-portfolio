import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// ─────────────────────────────────────────────────────────────────────────────
//  GLYPH DATA — extracted from GreatVibes-Regular.ttf via fonttools
//  Each glyph path is in font-space (y-up). The per-letter <g> applies:
//    transform="translate(x_offset, 850) scale(1,-1)"
//  which flips to SVG y-down space and positions each letter.
//  Total text width: 3765 font units.  ViewBox: "-80 10 4050 1220"
// ─────────────────────────────────────────────────────────────────────────────
const GLYPHS = [
    {
        char: 'H', x: 0,
        d: `M1537 760Q1537 757 1524.0 750.5Q1511 744 1479.5 698.0Q1448 652 1400.0 557.0Q1352 462 1316 356Q1377 356 1393.5 362.0Q1410 368 1413.5 364.0Q1417 360 1404 351Q1371 328 1307 324Q1306 322 1291 276Q1241 121 1241 59Q1241 24 1253.5 10.0Q1266 -4 1280.0 -4.0Q1294 -4 1311 8Q1368 50 1436 189Q1444 206 1451.5 203.0Q1459 200 1451 182Q1414 103 1389.5 66.0Q1365 29 1334 -2Q1293 -41 1252 -41Q1206 -41 1188 -3Q1179 15 1179.0 30.0Q1179 45 1179.5 61.5Q1180 78 1183.0 104.5Q1186 131 1197.5 170.5Q1209 210 1215.5 230.5Q1222 251 1235.0 286.0Q1248 321 1249 324Q1206 324 910 337Q849 155 718 11Q654 -60 569 -108Q455 -171 329 -171Q276 -171 211.0 -155.5Q146 -140 88.0 -96.5Q30 -53 5.5 21.0Q-19 95 4 185Q16 231 57.5 271.0Q99 311 126 312Q136 312 138.0 309.5Q140 307 136.5 303.5Q133 300 128 298Q98 285 66 241Q24 183 24 106Q24 -14 140 -73Q210 -108 304 -108Q345 -108 381 -100Q720 -24 858 339Q832 339 807.5 327.5Q783 316 775.5 316.0Q768 316 767 322Q767 339 791.0 354.5Q815 370 833 372H872Q936 532 1018 696Q992 693 944.0 689.0Q896 685 866.0 682.0Q836 679 792.0 672.0Q748 665 719.0 655.5Q690 646 654.5 629.0Q619 612 595 590Q538 536 514 458Q504 426 504.0 390.0Q504 354 530.0 320.0Q556 286 599 286Q684 286 720 384Q737 430 737.0 448.5Q737 467 730.5 476.5Q724 486 734 488Q741 489 746 480Q758 454 758.0 424.0Q758 394 738 359Q704 297 646 276Q618 266 590.0 266.0Q562 266 534 278Q481 301 456 356Q440 389 440.0 419.0Q440 449 449.5 487.5Q459 526 487.0 566.0Q515 606 557.0 630.5Q599 655 641.0 671.0Q683 687 740.5 695.0Q798 703 840.5 707.0Q883 711 943.0 714.0Q1003 717 1032 720Q1043 739 1065.5 766.5Q1088 794 1104.0 798.5Q1120 803 1129 803Q1166 803 1166.0 771.5Q1166 740 1125.0 719.0Q1084 698 1048 698Q1021 646 971.5 512.5Q922 379 919 372Q994 372 1112.5 363.5Q1231 355 1258 355Q1278 413 1326.5 521.0Q1375 629 1412.0 684.5Q1449 740 1481.5 751.5Q1514 763 1525.5 763.0Q1537 763 1537 760ZM1116 772Q1104 772 1066 723Q1131 733 1130 758Q1129 769 1119 771Q1118 772 1116 772Z`,
    },
    {
        char: 'r', x: 1381,
        d: `M191 401Q191 356 134 316Q154 315 187.5 315.0Q221 315 272 320Q274 317 274.0 304.0Q274 291 262.0 265.5Q250 240 240.5 221.5Q231 203 222.5 186.5Q214 170 203.5 146.0Q193 122 186 102Q161 26 194 26Q236 26 318 193Q325 206 329.5 203.0Q334 200 334.0 195.5Q334 191 321.0 164.5Q308 138 293.0 110.0Q278 82 246 45Q208 -1 173 -1Q134 -1 119 46Q116 55 116.0 73.0Q116 91 127.5 121.0Q139 151 164.0 194.0Q189 237 192.0 244.5Q195 252 195 259Q195 290 115 292L103 260Q40 95 -18 39Q-28 30 -28 45Q-28 48 -26 52Q30 126 71.0 227.0Q112 328 128 419Q134 450 156.0 450.0Q178 450 188 422Q191 413 191 401Z`,
    },
    {
        char: 'i', x: 1641,
        d: `M128 418Q131 435 145.0 447.0Q159 459 176.0 459.0Q193 459 203.5 447.0Q214 435 211.0 418.0Q208 401 194.0 389.0Q180 377 163.0 377.0Q146 377 136.0 389.0Q126 401 128 418ZM96 22Q115 22 136 41Q173 78 230 192Q237 207 244 201Q246 199 246.0 194.5Q246 190 238.0 172.5Q230 155 223.5 141.0Q217 127 198.5 95.5Q180 64 165 47Q124 0 87.5 0.0Q51 0 35.0 22.0Q19 44 19.0 71.0Q19 98 32 130L96 293Q98 299 98.0 309.0Q98 319 86 335L141 336Q164 336 168.0 327.5Q172 319 162 301L82 114Q65 77 65 51Q65 22 96 22Z`,
    },
    {
        char: 'd', x: 1815,
        d: `M268 58Q268 26 294 26Q341 26 419 183Q422 189 424.5 195.0Q427 201 432.5 203.0Q438 205 440.0 200.5Q442 196 438 186Q358 0 276 0Q249 0 233.0 24.0Q217 48 217.0 71.5Q217 95 222 115Q164 19 122 6Q110 1 98.5 1.0Q87 1 76 4Q27 17 27 82Q27 126 49.5 179.5Q72 233 113.0 282.0Q154 331 212 348Q233 355 261.5 355.0Q290 355 325 337Q393 465 441 574Q455 607 468.5 616.5Q482 626 493.5 626.0Q505 626 507.5 626.0Q510 626 526.5 623.5Q543 621 552 622Q529 601 430 418Q304 184 278 106Q268 77 268 58ZM317 321Q304 334 280.5 334.0Q257 334 215 299Q148 243 104 161Q75 107 75 72Q75 56 81.5 43.0Q88 30 102 30Q136 30 186.0 100.0Q236 170 317 321Z`,
    },
    {
        char: 'a', x: 2182,
        d: `M279 24Q298 24 326 59Q367 110 407 192Q411 201 416 202Q424 205 424 196Q424 191 421 184Q329 -2 266 -2Q237 -2 219 26Q210 41 210.0 66.0Q210 91 220 127Q140 -2 82 -2Q66 -2 53 8Q23 29 23 80Q23 178 108 279Q156 335 226 352Q245 357 262 357Q308 357 340 325Q350 314 346.0 304.0Q342 294 329 296Q318 332 281 332Q238 332 175 264Q139 224 108 170Q69 105 69.0 66.0Q69 27 94 27Q154 27 251 211Q270 248 283.0 261.5Q296 275 316 275Q320 275 336.5 272.0Q353 269 361 271Q343 253 310.0 189.5Q277 126 270.5 94.5Q264 63 264.0 43.5Q264 24 279 24Z`,
    },
    {
        char: 'y', x: 2532,
        d: `M-82 -316Q-126 -316 -150.0 -297.5Q-174 -279 -174.0 -253.0Q-174 -227 -159 -194Q-133 -143 -65 -112Q-14 -88 70.0 -67.5Q154 -47 178 -40Q214 23 264 185Q206 83 167.0 42.0Q128 1 88 1Q34 1 25 46Q21 53 23.0 67.0Q25 81 25.5 87.0Q26 93 32.0 106.5Q38 120 40 126Q51 149 59 162Q43 162 50 178L68 213Q102 278 124 323Q134 344 163 344H224Q222 342 214 336Q196 324 187 308Q151 246 97 131Q75 84 75.0 62.0Q75 40 82.5 31.0Q90 22 103 22Q122 22 156 62Q227 145 313 323Q324 344 352 344H406Q380 326 365.0 298.5Q350 271 332.5 224.0Q315 177 288.5 99.0Q262 21 248 -18Q342 10 392 81Q414 112 455 191Q462 205 467.5 202.0Q473 199 473.0 194.0Q473 189 456.5 155.5Q440 122 423.0 93.5Q406 65 379.0 35.0Q352 5 319.0 -12.5Q286 -30 231 -50Q154 -190 76 -256Q3 -316 -82 -316ZM-140 -217Q-151 -239 -151.0 -257.5Q-151 -276 -137.0 -286.0Q-123 -296 -102 -296Q-44 -296 22.0 -236.5Q88 -177 138 -109L160 -72Q-5 -115 -48 -134Q-112 -162 -140 -217Z`,
    },
    {
        char: 'e', x: 2931,
        d: `M101 154Q87 120 87 78Q87 50 99.5 33.5Q112 17 135 17Q226 17 300 188Q307 204 317 202Q321 201 321.0 197.0Q321 193 298.5 144.5Q276 96 253 66Q202 -4 127 -4Q87 -4 59.0 22.0Q31 48 31.0 93.0Q31 138 52.5 188.5Q74 239 111.0 282.5Q148 326 196 346Q219 356 240.0 356.0Q261 356 279 344Q296 330 296 313Q296 253 224 198Q202 181 162.0 167.5Q122 154 101 154ZM269 314Q269 334 253 334Q225 334 168 265Q134 223 108 171Q125 171 157.5 183.0Q190 195 214 215Q269 262 269 314Z`,
    },
    {
        char: 's', x: 3177,
        d: `M142 19Q155 17 160 17Q200 17 239 64Q260 90 314 195Q316 200 321 200Q330 201 330 193Q330 191 325.5 181.5Q321 172 317.0 162.5Q313 153 304.0 135.0Q295 117 288.5 106.0Q282 95 272.0 79.0Q262 63 252 54L231 32Q214 15 191 8Q154 -4 119 6Q96 -4 78 -4Q7 -4 -8 52Q-11 65 -11.0 83.5Q-11 102 1.5 119.0Q14 136 28 137Q79 234 115 312Q155 397 208 397Q222 397 235.5 390.5Q249 384 245.5 376.0Q242 368 231.0 373.0Q220 378 212.0 378.0Q204 378 198 375Q164 359 164 306Q164 278 172.0 260.0Q180 242 190 221Q213 169 213 136Q213 103 192.0 71.0Q171 39 142 19ZM108 26Q152 60 152 136Q152 167 145.0 221.0Q138 275 138.0 294.0Q138 313 139 320Q63 168 45 135Q66 135 66 105Q66 46 108 26ZM33 53Q33 47 34 40Q42 13 71 13Q83 13 91 17Q54 40 51 92Q33 74 33 53Z`,
    },
    {
        char: 'h', x: 3433,
        d: `M235 45Q235 17 255 17Q302 17 388 193Q395 207 400.5 204.0Q406 201 406.0 196.0Q406 191 394.5 167.5Q383 144 371.5 122.5Q360 101 338 66Q292 -4 240 -4Q206 -4 186 24Q177 37 177.0 59.5Q177 82 187.0 114.0Q197 146 242 218Q253 236 253.0 246.5Q253 257 236.0 257.0Q219 257 171 212Q99 146 31 14Q24 -1 -6 -1Q-33 -3 -40 -7Q150 388 235 544Q254 579 268.5 593.0Q283 607 303 607Q308 607 324.0 604.5Q340 602 348 603Q318 572 240.5 431.5Q163 291 92 146Q139 205 176.5 238.0Q214 271 268.0 300.5Q322 330 347 330Q353 330 358 328Q235 112 235 45Z`,
    },
];

const BASELINE = 850;
const VIEWBOX = '-80 10 4050 1220';

const LoadingScreen = ({ onComplete }) => {
    const containerRef = useRef(null);
    const barRef = useRef(null);
    const barWrapRef = useRef(null);
    const subtitleRef = useRef(null);
    const pathRefs = useRef([]);

    useEffect(() => {
        const paths = pathRefs.current.filter(Boolean);

        // Initialise stroke-draw for each path
        paths.forEach(p => {
            if (p && typeof p.getTotalLength === 'function') {
                const len = p.getTotalLength();
                p.style.strokeDasharray = len;
                p.style.strokeDashoffset = len;
            }
        });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl
            // 1. Fade screen in
            .fromTo(containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, ease: 'power2.out' }
            )

            // 2. Draw each letter — left to right stagger
            .to(paths, {
                strokeDashoffset: 0,
                duration: 0.7,
                stagger: 0.11,
                ease: 'power2.inOut',
            }, 0.3)

            // 3. Subtle fill bleed in after drawn
            .to(paths, {
                fillOpacity: 0.1,
                duration: 0.8,
                stagger: 0.06,
                ease: 'power2.out',
            }, '-=0.7')

            // 4. Subtitle drifts up
            .fromTo(subtitleRef.current,
                { y: 14, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5 },
                '-=0.3'
            )

            // 5. Bar wrapper scales in
            .fromTo(barWrapRef.current,
                { scaleX: 0, opacity: 0 },
                { scaleX: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)', transformOrigin: 'left center' },
                '-=0.2'
            )

            // 6. Bar fills
            .fromTo(barRef.current,
                { width: '0%' },
                { width: '100%', duration: 1.4, ease: 'power1.inOut' },
                '+=0.05'
            )

            // 7. Glint sweeps bar
            .fromTo('.loader-glint',
                { x: '-100%', opacity: 0.9 },
                { x: '500%', opacity: 0, duration: 0.5, ease: 'power1.in' },
                '-=0.4'
            )

            // 8. Letters undraw and float up
            .to(paths, {
                strokeDashoffset: p => (p && typeof p.getTotalLength === 'function') ? -p.getTotalLength() : 0,
                fillOpacity: 0,
                opacity: 0,
                y: -28,
                duration: 0.45,
                stagger: 0.035,
                ease: 'power2.in',
            }, '+=0.2')

            // 9. Subtitle + bar fade up
            .to([subtitleRef.current, barWrapRef.current],
                { y: -18, opacity: 0, duration: 0.3, stagger: 0.05, ease: 'power2.in' },
                '<'
            )

            // 10. Curtain lifts
            .to(containerRef.current, {
                yPercent: -100,
                duration: 1.0,
                ease: 'power4.inOut',
                onComplete,
            }, '+=0.05');

    }, [onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
            style={{
                background: 'radial-gradient(ellipse at 50% 45%, #0c0b1a 0%, #04040a 100%)',
                willChange: 'transform',
            }}
        >

            {/* Dot-grid texture */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(150,100,255,0.6) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                    opacity: 0.055,
                }}
            />

            {/* Ambient glow blobs */}
            <div className="absolute top-1/4  left-1/4  w-[600px] h-[600px] rounded-full bg-violet-900/14 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-800/12 blur-[110px] pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[700px] h-[250px] rounded-full bg-purple-950/20 blur-[90px]" />
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full flex flex-col items-center gap-5 px-2 sm:px-6">

                {/* Full-width SVG name */}
                <div className="w-full" style={{ maxWidth: '100vw' }}>
                    <svg
                        viewBox={VIEWBOX}
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
                    >
                        <defs>
                            <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#d8b4fe" />
                                <stop offset="35%" stopColor="#a78bfa" />
                                <stop offset="70%" stopColor="#818cf8" />
                                <stop offset="100%" stopColor="#67e8f9" />
                            </linearGradient>

                            {/* Wide bloom glow */}
                            <filter id="bloom" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="b1" />
                                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b2" />
                                <feMerge>
                                    <feMergeNode in="b1" />
                                    <feMergeNode in="b2" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            {/* Tight edge glow */}
                            <filter id="edge" x="-8%" y="-8%" width="116%" height="116%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
                                <feMerge>
                                    <feMergeNode in="b" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {GLYPHS.map((g, i) => (
                            <g key={i} transform={`translate(${g.x}, ${BASELINE}) scale(1,-1)`}>
                                {/* Static soft bloom underneath — gives depth */}
                                <path
                                    d={g.d}
                                    fill="rgba(139,92,246,0.035)"
                                    stroke="rgba(167,139,250,0.18)"
                                    strokeWidth="8"
                                    filter="url(#bloom)"
                                    style={{ pointerEvents: 'none' }}
                                />
                                {/* Animated stroke */}
                                <path
                                    ref={el => (pathRefs.current[i] = el)}
                                    d={g.d}
                                    fill="rgba(196,181,253,0)"
                                    fillOpacity={0}
                                    stroke="url(#lg)"
                                    strokeWidth="5.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    filter="url(#edge)"
                                    style={{ willChange: 'stroke-dashoffset' }}
                                />
                            </g>
                        ))}
                    </svg>
                </div>

                {/* Subtitle */}
                <p
                    ref={subtitleRef}
                    className="opacity-0 text-white/25 text-[10px] sm:text-xs font-mono tracking-[0.45em] uppercase select-none"
                >
                    Portfolio &nbsp;·&nbsp; 2025
                </p>

                {/* Progress bar */}
                <div
                    ref={barWrapRef}
                    className="relative overflow-hidden rounded-full opacity-0"
                    style={{
                        width: 'min(300px, 55vw)',
                        height: '2px',
                        background: 'rgba(255,255,255,0.06)',
                    }}
                >
                    <div
                        ref={barRef}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '0%',
                            height: '100%',
                            borderRadius: '9999px',
                            background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #67e8f9)',
                            boxShadow: '0 0 14px 3px rgba(167,139,250,0.75)',
                            transition: 'none',
                        }}
                    />
                    <div
                        className="loader-glint"
                        style={{
                            position: 'absolute',
                            top: 0, bottom: 0,
                            width: '48px',
                            borderRadius: '9999px',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
                        }}
                    />
                </div>

            </div>
        </div>
    );
};

export default LoadingScreen;