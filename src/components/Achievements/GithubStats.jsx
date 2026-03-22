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
                <Card className="p-6 bg-[var(--bg-surface)]/50 backdrop-blur-sm flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-full text-primary">
                        <Github size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-[var(--text-muted)]">Total Repositories</p>
                        <p className="text-3xl font-bold text-[var(--text)]"><AnimatedCount target={stats.totalRepos} /></p>
                    </div>
                </Card>
                <Card className="p-6 bg-[var(--bg-surface)]/50 backdrop-blur-sm flex items-center gap-4">
                    <div className="p-4 bg-yellow-500/10 rounded-full text-yellow-500">
                        <Star size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-[var(--text-muted)]">Total Stars</p>
                        <p className="text-3xl font-bold text-[var(--text)]"><AnimatedCount target={stats.totalStars} /></p>
                    </div>
                </Card>
                <Card className="p-6 bg-[var(--bg-surface)]/50 backdrop-blur-sm flex items-center gap-4">
                    <div className="p-4 bg-green-500/10 rounded-full text-green-500">
                        <GitCommit size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-[var(--text-muted)]">Recent Commits</p>
                        <p className="text-3xl font-bold text-[var(--text)]"><AnimatedCount target={stats.recentCommits} /></p>
                    </div>
                </Card>
            </div>

            {/* Heatmap & Recent Repos Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Heatmap */}
                <div className="lg:col-span-3">
                    <Card className="h-full">
                        <div className="p-6 bg-[var(--bg-surface)]/50 backdrop-blur-sm h-full flex flex-col justify-center">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[var(--text)]">
                                <Github size={20} className="text-primary" /> Contribution Heatmap
                            </h3>
                            <div className="w-full overflow-x-auto custom-scrollbar">
                                {stats.heatmapData && stats.heatmapData.length > 0 ? (
                                    <div className="flex gap-1 min-w-max p-2 bg-[var(--bg-surface)]/50 rounded-xl border border-[var(--border)]">
                                        {stats.heatmapData.map((week, i) => (
                                            <div key={i} className="flex flex-col gap-1">
                                                {week.contributionDays.map((day, j) => (
                                                    <div
                                                        key={j}
                                                        className={`w-3 h-3 rounded-sm cursor-help transition-all hover:scale-125 hover:ring-2 ring-primary/50 relative group ${day.contributionCount === 0 ? 'bg-black/5 dark:bg-white/10' : ''}`}
                                                        style={day.contributionCount > 0 ? { backgroundColor: day.color } : {}}
                                                    >
                                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                                            {day.contributionCount} commit{day.contributionCount !== 1 ? 's' : ''} on {new Date(day.date).toDateString()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="min-w-[700px] bg-transparent pt-4 pb-2 px-4 rounded-xl filter">
                                        <img
                                            src="https://ghchart.rshah.org/646cff/Hridayesh68"
                                            alt="Hridayesh's GitHub Heatmap"
                                            className="w-full h-auto"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Recent Repos */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <div className="p-6 bg-[var(--bg-surface)]/50 backdrop-blur-sm h-full">
                            <h3 className="text-lg font-bold mb-4 text-[var(--text)] uppercase tracking-wider text-sm">Recently Active</h3>
                            <div className="space-y-3">
                                {stats.recentRepos.map(repo => (
                                    <a
                                        key={repo.id}
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block p-4 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] transition-colors border border-[var(--border)] group"
                                    >
                                        <p className="font-semibold text-sm text-[var(--text)] group-hover:text-primary transition-colors truncate">{repo.name}</p>
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
