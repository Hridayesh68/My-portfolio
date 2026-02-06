import { useRef, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Github, Code, Rocket } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import statsData from '../data/github-stats.json';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
    const timelineRef = useRef(null);
    const rocketRef = useRef(null);
    const lineRef = useRef(null);

    // Use local data or callback to API if needed. For now using generated JSON.
    const [stats, setStats] = useState({
        totalRepos: 0,
        languages: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        // Simulating data load from JSON
        if (statsData) {
            // Transform data for PieChart
            const total = Object.values(statsData.top_languages).reduce((a, b) => a + b, 0);
            const langs = Object.entries(statsData.top_languages).map(([name, count]) => ({
                name,
                value: parseFloat(((count / total) * 100).toFixed(1))
            })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5

            setStats({
                totalRepos: statsData.repo_count, // Script returns repo_count
                languages: langs,
                loading: false,
                error: null
            });
        }
    }, []);

    useEffect(() => {
        // Timeline Items Animation
        const listItems = timelineRef.current.querySelectorAll('.timeline-item');
        listItems.forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
                {
                    opacity: 1, x: 0, duration: 1, ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 80%",
                        end: "bottom 60%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Rocket Animation
        const line = lineRef.current;
        const rocket = rocketRef.current;

        if (line && rocket) {
            gsap.to(rocket, {
                scrollTrigger: {
                    trigger: timelineRef.current,
                    start: "top center",
                    end: "bottom center",
                    scrub: 1,
                    // markers: true // for debugging
                },
                y: line.offsetHeight, // Move down the length of the line
                ease: "none"
            });
        }

    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const timelineData = [
        { year: '2026', title: 'Full Stack Mastery', description: 'Advanced React, Next.js, and Cloud Infrastructure.' },
        { year: '2025', title: 'Advanced Frontend', description: 'Deep dive into 3D Web (Three.js, GSAP) and performance optimization.' },
        { year: '2024', title: 'Backend Foundation', description: 'Node.js, Express, and Database Design.' },
        { year: '2023', title: 'Start of Journey', description: 'Learned HTML, CSS, and basic JavaScript.' },
    ];

    return (
        <section id="experience" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4">

                {/* Statistics Section */}
                <div className="mb-24">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">GitHub Performance</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Stat Card 1 */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center min-h-[250px]">
                            <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
                                <Github size={40} />
                            </div>
                            <h3 className="text-4xl font-bold">{stats.loading ? '...' : stats.totalRepos}</h3>
                            <p className="text-gray-500">Total Repositories</p>
                        </div>

                        {/* Stat Card 2 - Chart */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 md:col-span-2 min-h-[300px]">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Code size={20} /> Language Proficiency
                            </h3>
                            {stats.loading ? (
                                <div className="h-full flex items-center justify-center">Loading Stats...</div>
                            ) : stats.error ? (
                                <div className="text-red-500 text-center">{stats.error}</div>
                            ) : (
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.languages}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {stats.languages.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-center gap-4 mt-2 flex-wrap text-sm">
                                        {stats.languages.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center gap-1">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                                <span>{entry.name} ({entry.value}%)</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Timeline Section */}
                <div ref={timelineRef} className="relative">
                    <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">My Journey</h2>

                    {/* Vertical Line with Rocket */}
                    <div ref={lineRef} className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 dark:bg-gray-700 top-0 overflow-hidden">
                        {/* Rocket absolute positioned relative to this line, but we stick it to the parent or move it */}
                    </div>
                    <div ref={rocketRef} className="absolute left-1/2 transform -translate-x-1/2 top-0 z-30 text-primary bg-white dark:bg-gray-900 rounded-full p-1 shadow-md">
                        <Rocket size={24} className="transform rotate-180" /> {/* Pointing down */}
                    </div>

                    <div className="space-y-12 pt-8">
                        {timelineData.map((item, index) => (
                            <div key={index} className={`timeline-item flex items-center justify-between w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                                <div className="w-5/12"></div>

                                <div className="z-20 flex items-center justify-center w-8 h-8 bg-primary rounded-full ring-4 ring-white dark:ring-gray-900 shadow">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>

                                <div className="w-5/12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                                    <span className="text-primary font-bold text-sm tracking-wider">{item.year}</span>
                                    <h3 className="text-xl font-semibold mt-1 mb-2">{item.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Experience;
