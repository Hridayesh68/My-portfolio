import { useState, useEffect, useLayoutEffect, useRef, memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Github, Code, Trophy, TrendingUp } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import statsData from '../data/github-stats.json';
import Card from './ui/Card';
import { GitHubCalendar } from 'react-github-calendar';

gsap.registerPlugin(ScrollTrigger);

/* ───── Animated stat number helper ───── */
const AnimatedCount = memo(({ target, prefix = '', suffix = '', className = '' }) => {
    const elRef = useRef(null);
    const triggered = useRef(false);

    useEffect(() => {
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

    return (
        <span ref={elRef} className={className}>
            {prefix}0{suffix}
        </span>
    );
});

/* ───── Difficulty badge ───── */
const DiffBadge = memo(({ label, count, color, bg }) => (
    <div className={`flex flex-col items-center px-4 py-3 rounded-xl ${bg}`}>
        <span className={`text-2xl font-bold ${color}`}>{count ?? '—'}</span>
        <span className="text-xs text-[var(--text-muted)] mt-1">{label}</span>
    </div>
));

/* ──────────────────────────────────────────────────────────────── */

const Achievements = memo(() => {
    const sectionRef = useRef(null);

    /* ── GitHub Stats ── */
    const [ghRepos, setGhRepos] = useState(statsData.repo_count ?? 18);  // static fallback
    const [languages] = useState(() => {
        if (!statsData) return [];
        const total = Object.values(statsData.top_languages).reduce((a, b) => a + b, 0);
        return Object.entries(statsData.top_languages)
            .map(([name, count]) => ({ name, value: parseFloat(((count / total) * 100).toFixed(1)) }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    });

    useEffect(() => {
        fetch('https://api.github.com/users/Hridayesh68')
            .then(r => r.json())
            .then(d => { if (d.public_repos) setGhRepos(d.public_repos); })
            .catch(() => {/* keep static fallback */ });
    }, []);

    /* ── LeetCode Stats ── */
    const [lc, setLc] = useState({ loading: true, total: 0, easy: null, medium: null, hard: null, error: false });

    useEffect(() => {
        const tryFetch = async () => {
            // Primary: alfa-leetcode-api (maintained CORS proxy)
            try {
                const res = await fetch('https://alfa-leetcode-api.onrender.com/hridayeshdebsarma6/solved');
                if (!res.ok) throw new Error('not ok');
                const data = await res.json();
                setLc({
                    loading: false,
                    total: data.solvedProblem ?? 0,
                    easy: data.easySolved ?? data.easy ?? null,
                    medium: data.mediumSolved ?? data.medium ?? null,
                    hard: data.hardSolved ?? data.hard ?? null,
                    error: false,
                });
                return;
            } catch { /* fall through */ }

            // Fallback: leetcode-stats-api
            try {
                const res = await fetch('https://leetcode-stats-api.herokuapp.com/hridayeshdebsarma6');
                if (!res.ok) throw new Error('not ok');
                const data = await res.json();
                if (data.status === 'success') {
                    setLc({
                        loading: false,
                        total: data.totalSolved ?? 0,
                        easy: data.easySolved ?? null,
                        medium: data.mediumSolved ?? null,
                        hard: data.hardSolved ?? null,
                        error: false,
                    });
                    return;
                }
            } catch { /* fall through */ }

            // Fallback: Static Data if both APIs fail
            console.warn("LeetCode APIs failed (or rate limited). Using fallback data.");
            setLc({
                loading: false,
                total: '200+', // Indicate it's a fallback estimate
                easy: null,
                medium: null,
                hard: null,
                error: false,
                isFallback: true
            });
        };
        tryFetch();
    }, []);

    /* ── GitHub Heatmap (GraphQL with Token) ── */
    const [heatmapData, setHeatmapData] = useState([]);

    useEffect(() => {
        const fetchHeatmap = async () => {
            const token = import.meta.env.VITE_GITHUB_TOKEN;
            if (!token) return;

            const query = `
                query {
                    user(login: "Hridayesh68") {
                        contributionsCollection {
                            contributionCalendar {
                                totalContributions
                                weeks {
                                    contributionDays {
                                        contributionCount
                                        date
                                        contributionLevel
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            try {
                const res = await fetch('https://api.github.com/graphql', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query })
                });

                if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);

                const json = await res.json();
                if (json.data?.user?.contributionsCollection?.contributionCalendar?.weeks) {
                    const weeks = json.data.user.contributionsCollection.contributionCalendar.weeks;

                    // Flatten and format to react-github-calendar explicitly expected structure
                    const formattedData = weeks.flatMap(week =>
                        week.contributionDays.map(day => {
                            let level = 0;
                            if (day.contributionLevel === 'FIRST_QUARTILE') level = 1;
                            if (day.contributionLevel === 'SECOND_QUARTILE') level = 2;
                            if (day.contributionLevel === 'THIRD_QUARTILE') level = 3;
                            if (day.contributionLevel === 'FOURTH_QUARTILE') level = 4;

                            return {
                                date: day.date,
                                count: day.contributionCount,
                                level: level
                            };
                        })
                    );
                    setHeatmapData(formattedData);
                    return;
                }
            } catch (err) {
                console.warn("Failed to fetch custom GitHub heatmap (Rate limit or Auth), using dummy data:", err);
            }

            // --- Fallback Dummy Data ---
            const generateDummyData = () => {
                const data = [];
                const end = new Date();
                const start = new Date(end);
                start.setFullYear(start.getFullYear() - 1);

                for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                    data.push({
                        date: d.toISOString().split('T')[0],
                        count: Math.floor(Math.random() * 5),
                        level: Math.floor(Math.random() * 5)
                    });
                }
                return data;
            };
            setHeatmapData(generateDummyData());
        };

        fetchHeatmap();
    }, []);

    /* ── Section entrance animations ── */
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.achievement-card', {
                y: 60, opacity: 0, stagger: 0.15, duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    /* ── Refresh ScrollTrigger when dynamic data loads ── */
    useEffect(() => {
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 200);
        return () => clearTimeout(timer);
    }, [ghRepos, lc.loading, heatmapData.length]);

    const COLORS = ['#646cff', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <section id="achievements" ref={sectionRef} className="py-20 relative bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col items-center mb-16 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-[var(--text)]">
                        Achievements &amp; Stats
                    </h2>
                    <p className="text-[var(--text-muted)] mt-4 text-center max-w-2xl">
                        A snapshot of my coding activity and problem-solving journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* ── GitHub Repos ── */}
                    <div className="achievement-card">
                        <Card className="h-full">
                            <div className="p-6 flex flex-col items-center justify-center h-full bg-[var(--bg-surface)] backdrop-blur-sm min-h-[220px]">
                                <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
                                    <Github size={40} />
                                </div>
                                <h3 className="text-4xl font-bold text-[var(--text)]">
                                    <AnimatedCount target={ghRepos} />
                                </h3>
                                <p className="text-[var(--text-muted)] mt-1">GitHub Repositories</p>
                            </div>
                        </Card>
                    </div>

                    {/* ── Language Proficiency ── */}
                    <div className="achievement-card md:col-span-2 min-h-[300px]">
                        <Card className="h-full">
                            <div className="p-6 bg-[var(--bg-surface)] backdrop-blur-sm h-full flex flex-col">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--text)]">
                                    <Code size={20} /> Language Proficiency
                                </h3>
                                <div className="flex-1 min-h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={languages}
                                                cx="50%" cy="50%"
                                                innerRadius={60} outerRadius={90}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                {languages.map((_, index) => (
                                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--bg-elevated)', borderRadius: '8px' }}
                                                itemStyle={{ color: 'var(--text, #fde8c0)' }}
                                                formatter={(val) => [`${val}%`]}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* ── LeetCode Stats ── */}
                    <div className="achievement-card md:col-span-2 min-h-[260px]">
                        <Card className="h-full">
                            <div className="p-6 bg-[var(--bg-surface)] backdrop-blur-sm h-full flex flex-col">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--text)]">
                                    <Code size={20} className="text-yellow-500" /> LeetCode Statistics
                                </h3>

                                {lc.loading ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="flex gap-2 items-center text-gray-500">
                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            Fetching stats…
                                        </div>
                                    </div>
                                ) : lc.error ? (
                                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-500">
                                        <p className="text-sm">Couldn&apos;t reach LeetCode API right now.</p>
                                        <a
                                            href="https://leetcode.com/u/hridayeshdebsarma6/"
                                            target="_blank" rel="noopener noreferrer"
                                            className="text-primary text-sm hover:underline flex items-center gap-1"
                                        >
                                            View Profile <TrendingUp size={14} />
                                        </a>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col justify-center gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <p className="text-sm text-[var(--text-muted)] mb-1">Total Solved</p>
                                                <div className="text-5xl font-black text-[var(--text)]">
                                                    {typeof lc.total === 'number' ? <AnimatedCount target={lc.total} /> : lc.total}
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center">
                                                <TrendingUp size={28} className="text-primary" />
                                            </div>
                                        </div>

                                        {!lc.isFallback && (
                                            <div className="grid grid-cols-3 gap-3">
                                                <DiffBadge label="Easy" count={lc.easy} color="text-emerald-500" bg="bg-emerald-500/10 dark:bg-emerald-500/10" />
                                                <DiffBadge label="Medium" count={lc.medium} color="text-yellow-500" bg="bg-yellow-500/10" />
                                                <DiffBadge label="Hard" count={lc.hard} color="text-red-500" bg="bg-red-500/10" />
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-xl font-bold text-[var(--text)]">5+</span>
                                                <span className="text-xs text-[var(--text-muted)]">Contests</span>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-xl font-bold text-[var(--text)]">Top 20%</span>
                                                <span className="text-xs text-[var(--text-muted)]">Global Rank</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* ── HackerRank ── */}
                    <div className="achievement-card md:col-span-1">
                        <Card className="h-full">
                            <div className="p-6 bg-[var(--bg-surface)] backdrop-blur-sm h-full flex flex-col justify-center items-center">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 w-full text-left text-[var(--text)]">
                                    <Trophy size={20} className="text-green-500" /> HackerRank
                                </h3>
                                <div className="w-full flex justify-center overflow-hidden p-2">
                                    <a href="https://hackerrank-badges.vercel.app/hridayeshdebsar1" target="_blank" rel="noopener noreferrer">
                                        <img
                                            src="https://hackerrank-badges.vercel.app/hridayeshdebsar1"
                                            alt="HackerRank Badges"
                                            className="max-w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                                            onLoad={() => ScrollTrigger.refresh()}
                                        />
                                    </a>
                                </div>
                            </div>
                        </Card>
                    </div>

                </div>

                {/* ── GitHub Heatmap (Full Width) ── */}
                <div className="achievement-card mt-8">
                    <Card>
                        <div className="p-8 bg-[var(--bg-surface)] backdrop-blur-sm flex flex-col items-center justify-center overflow-x-auto">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 w-full text-left text-[var(--text)]">
                                <Github size={20} className="text-[var(--text)]" /> Contribution Heatmap
                            </h3>
                            <div className="w-full flex justify-center min-w-[800px] text-[var(--text)]">
                                {heatmapData.length > 0 ? (
                                    <GitHubCalendar
                                        username="Hridayesh68"
                                        data={heatmapData}
                                        colorScheme="dark"
                                        blockSize={14}
                                        blockMargin={5}
                                        fontSize={14}
                                        theme={{
                                            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                                            dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                                        }}
                                    />
                                ) : (
                                    <div className="py-10 flex items-center justify-center text-gray-500">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                                        Loading Map...
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </section>
    );
});

export default Achievements;
