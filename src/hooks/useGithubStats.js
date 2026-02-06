import { useState, useEffect } from 'react';

const useGithubStats = (username) => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        languages: {},
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch User Repos
                const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
                if (!response.ok) throw new Error('Failed to fetch repos');
                const repos = await response.json();

                const totalProjects = repos.length;
                const languages = {};

                // Calculate Language Usage (approximate based on primary language)
                // For more accurate stats, we'd need to fetch languages per repo, but that hits rate limits fast.
                // We'll use the primary language of each repo.
                repos.forEach(repo => {
                    if (repo.language) {
                        languages[repo.language] = (languages[repo.language] || 0) + 1;
                    }
                });

                // Convert to percentage
                const totalLangs = Object.values(languages).reduce((a, b) => a + b, 0);
                const languageStats = Object.keys(languages).map(lang => ({
                    name: lang,
                    value: Math.round((languages[lang] / totalLangs) * 100)
                })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5

                setStats({
                    totalProjects,
                    languages: languageStats,
                    loading: false,
                    error: null
                });
            } catch (err) {
                console.error("GitHub API Error:", err);
                setStats({
                    totalProjects: 0,
                    languages: [],
                    loading: false,
                    error: err.message
                });
            }
        };

        if (username) {
            fetchStats();
        }
    }, [username]);

    return stats;
};

export default useGithubStats;
