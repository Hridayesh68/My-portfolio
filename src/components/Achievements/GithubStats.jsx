import { useState, useEffect, useRef } from 'react';
import { Github, Star, GitCommit } from 'lucide-react';
import Card from '../ui/Card';
import { fetchGithubStats } from '../../services/githubService';

const AnimatedCount = ({ target, prefix = '', suffix = '', className = '' }) => {
    // Basic counter display for child component (GSAP logic handled if needed, or simple CSS)
    return <span className={className}>{prefix}{target}{suffix}</span>;
};

const GithubStats = () => {
    const [stats, setStats] = useState({ totalRepos: 0, totalStars: 0, recentRepos: [], recentCommits: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGithubStats().then(data => {
            setStats(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Loading GitHub Activity...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-full text-primary">
                        <Github size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Repositories</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white"><AnimatedCount target={stats.totalRepos} /></p>
                    </div>
                </Card>
                <Card className="p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm flex items-center gap-4">
                    <div className="p-4 bg-yellow-500/10 rounded-full text-yellow-500">
                        <Star size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Stars</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white"><AnimatedCount target={stats.totalStars} /></p>
                    </div>
                </Card>
                <Card className="p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm flex items-center gap-4">
                    <div className="p-4 bg-green-500/10 rounded-full text-green-500">
                        <GitCommit size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Recent Commits</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white"><AnimatedCount target={stats.recentCommits} /></p>
                    </div>
                </Card>
            </div>

            {/* Heatmap & Recent Repos Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Heatmap */}
                <div className="lg:col-span-3">
                    <Card className="h-full">
                        <div className="p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm h-full flex flex-col justify-center">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                <Github size={20} className="text-primary" /> Contribution Heatmap
                            </h3>
                            <div className="w-full overflow-x-auto custom-scrollbar">
                                <div className="min-w-[700px] bg-white dark:bg-white pt-4 pb-2 px-4 rounded-xl shadow-inner border border-gray-100 dark:border-transparent filter dark:brightness-90">
                                    <img
                                        src="https://ghchart.rshah.org/646cff/Hridayesh68"
                                        alt="Hridayesh's GitHub Heatmap"
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Recent Repos */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <div className="p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm h-full">
                            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white uppercase tracking-wider text-sm">Recently Active</h3>
                            <div className="space-y-3">
                                {stats.recentRepos.map(repo => (
                                    <a
                                        key={repo.id}
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 transition-colors border border-gray-100 dark:border-white/5 group"
                                    >
                                        <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">{repo.name}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-gray-500">{repo.language || 'Unknown'}</span>
                                            <span className="text-xs text-yellow-500 flex items-center gap-1"><Star size={12} />{repo.stargazers_count}</span>
                                        </div>
                                    </a>
                                ))}
                                {stats.recentRepos.length === 0 && (
                                    <div className="text-sm text-gray-500">No recent repositories found.</div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default GithubStats;
