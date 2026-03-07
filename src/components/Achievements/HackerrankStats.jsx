import { useState, useEffect } from 'react';
import { Trophy, CheckCircle, TrendingUp, Medal } from 'lucide-react';
import Card from '../ui/Card';
import { fetchHackerrankStats } from '../../services/hackerrankService';

const HackerrankStats = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchHackerrankStats().then(data => setStats(data));
    }, []);

    if (!stats) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading HackerRank Stats...</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Badges Display */}
                <Card className="h-full">
                    <div className="p-8 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm h-full flex flex-col justify-center items-center">
                        <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 text-green-500 shadow-inner border border-green-500/20">
                            <Trophy size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white text-center">Achievements Badges</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6 max-w-sm">
                            Showcasing problem-solving milestones achieved across different domains on HackerRank.
                        </p>

                        <div className="w-full flex justify-center bg-gray-50 dark:bg-black/30 p-6 rounded-xl border border-gray-100 dark:border-white/5 hover:scale-105 transition-transform duration-500 shadow-md">
                            <a href={stats.profileUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={stats.badgeUrl}
                                    alt="HackerRank Badges"
                                    className="max-w-full h-auto object-contain drop-shadow-lg"
                                />
                            </a>
                        </div>
                    </div>
                </Card>

                {/* Verified Skills & Certifications */}
                <div className="space-y-6">
                    <Card>
                        <div className="p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                <CheckCircle size={20} className="text-primary" /> Verified Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {stats.verifiedSkills.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                                <Medal size={20} className="text-yellow-500" /> Platform Certifications
                            </h3>
                            <div className="space-y-3">
                                {stats.certifications.map((cert, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                                        <span className="font-medium text-gray-900 dark:text-white">{cert.name}</span>
                                        <TrendingUp size={16} className="text-gray-400" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default HackerrankStats;
