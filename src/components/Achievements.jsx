import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Github, Code, Trophy, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import statsData from '../data/github-stats.json';
import Card from './ui/Card';

gsap.registerPlugin(ScrollTrigger);

const Achievements = () => {
    const sectionRef = useRef(null);

    // --- Stats Data ---
    const [stats, setStats] = useState({ totalRepos: 0, languages: [], loading: true, error: null });
    const [leetCodeStats, setLeetCodeStats] = useState({ loading: true, data: null });

    useEffect(() => {
        const fetchLeetCode = async () => {
            try {
                const response = await fetch('https://leetcode-stats-api.herokuapp.com/hridayeshdebsarma6');
                const data = await response.json();
                if (data.status === 'success') {
                    setLeetCodeStats({
                        loading: false,
                        data: [
                            { name: 'Easy', count: data.easySolved, color: '#00b8a3' },
                            { name: 'Medium', count: data.mediumSolved, color: '#ffc01e' },
                            { name: 'Hard', count: data.hardSolved, color: '#ef4743' }
                        ]
                    });
                }
            } catch (error) {
                console.error("LeetCode fetch error:", error);
                setLeetCodeStats({ loading: false, data: null });
            }
        };
        fetchLeetCode();
    }, []);

    useEffect(() => {
        if (statsData) {
            const total = Object.values(statsData.top_languages).reduce((a, b) => a + b, 0);
            const langs = Object.entries(statsData.top_languages).map(([name, count]) => ({
                name,
                value: parseFloat(((count / total) * 100).toFixed(1))
            })).sort((a, b) => b.value - a.value).slice(0, 5);

            setStats({ totalRepos: statsData.repo_count, languages: langs, loading: false, error: null });
        }
    }, []);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".achievement-card", {
                y: 50, opacity: 0, stagger: 0.2, duration: 1,
                scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <section id="achievements" ref={sectionRef} className="py-20 relative bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col items-center mb-16 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
                        Achievements & Stats
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-4 text-center max-w-2xl">
                        A snapshot of my coding activity and problem-solving journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* GitHub Stats */}
                    <div className="achievement-card min-h-[250px] md:col-span-1">
                        <Card className="h-full">
                            <div className="p-6 flex flex-col items-center justify-center h-full bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
                                <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary relative z-10">
                                    <Github size={40} />
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900 dark:text-white relative z-10">{stats.loading ? '...' : stats.totalRepos}</h3>
                                <p className="text-gray-600 dark:text-gray-400 relative z-10">GitHub Repositories</p>
                            </div>
                        </Card>
                    </div>

                    {/* Language Proficiency */}
                    <div className="achievement-card md:col-span-2 min-h-[300px]">
                        <Card className="h-full">
                            <div className="p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm h-full flex flex-col">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white relative z-10">
                                    <Code size={20} /> Language Proficiency
                                </h3>
                                {stats.loading ? (
                                    <div className="flex-1 flex items-center justify-center">Loading...</div>
                                ) : (
                                    <div className="flex-1 min-h-[250px] relative z-20">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={stats.languages} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                    {stats.languages.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* LeetCode Stats */}
                    <div className="achievement-card min-h-[300px] md:col-span-2">
                        <Card className="h-full">
                            <div className="p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm h-full flex flex-col">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white relative z-10">
                                    <Code size={20} className="text-yellow-500" /> LeetCode Statistics
                                </h3>
                                {leetCodeStats.loading ? (
                                    <div className="flex-1 flex items-center justify-center">Loading...</div>
                                ) : (
                                    <div className="flex-1 min-h-[200px] relative z-20">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={leetCodeStats.data} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" width={60} tick={{ fill: '#888' }} />
                                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#171717', border: '1px solid #333' }} />
                                                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                                    {leetCodeStats.data.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* HackerRank Badges */}
                    <div className="achievement-card md:col-span-1">
                        <Card className="h-full">
                            <div className="p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm h-full flex flex-col justify-center items-center">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 w-full text-left text-gray-900 dark:text-white relative z-10">
                                    <Trophy size={20} className="text-green-500" /> HackerRank
                                </h3>
                                <div className="flex flex-col items-center justify-center gap-4 relative z-10 w-full">
                                    <a href="https://www.hackerrank.com/hridayesh" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition-transform">
                                        <img
                                            src="https://www.hackerrank.com/wp-content/uploads/2018/08/hackerrank_logo.png"
                                            alt="HackerRank"
                                            className="h-16 object-contain filter brightness-0 dark:brightness-100"
                                        />
                                    </a>
                                    <a href="https://www.hackerrank.com/hridayesh" target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-1 hover:underline">
                                        View Profile <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Achievements;
