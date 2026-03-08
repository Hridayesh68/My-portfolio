export const fetchGithubStats = async (username = 'Hridayesh68') => {
    // using a v3 cache key to avoid conflicts with older unauthenticated queries
    const cacheKey = 'v3';
    const cachedRepos = sessionStorage.getItem(`gh_recent_repos_${cacheKey}`);
    const cachedCommits = sessionStorage.getItem(`gh_recent_commits_${cacheKey}`);
    const cachedTotalRepos = sessionStorage.getItem(`gh_total_repos_${cacheKey}`);
    const cachedStars = sessionStorage.getItem(`gh_total_stars_${cacheKey}`);
    const cachedHeatmap = sessionStorage.getItem(`gh_heatmap_data_${cacheKey}`);

    if (cachedRepos && cachedCommits && cachedTotalRepos && cachedStars && cachedHeatmap) {
        return {
            recentRepos: JSON.parse(cachedRepos),
            recentCommits: parseInt(cachedCommits),
            totalRepos: parseInt(cachedTotalRepos),
            totalStars: parseInt(cachedStars),
            heatmapData: JSON.parse(cachedHeatmap)
        };
    }

    try {
        const token = import.meta.env.VITE_GITHUB_TOKEN;

        let heatmapData = [];
        let totalCommits = 0;

        // If token exists, fetch detailed heatmap via GraphQL
        if (token) {
            const query = `
            query {
                user(login: "${username}") {
                    contributionsCollection {
                        contributionCalendar {
                            totalContributions
                            weeks {
                                contributionDays {
                                    contributionCount
                                    date
                                    color
                                }
                            }
                        }
                    }
                }
            }`;

            const ghRes = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            });

            if (ghRes.ok) {
                const ghData = await ghRes.json();
                const calendar = ghData.data?.user?.contributionsCollection?.contributionCalendar;
                if (calendar) {
                    totalCommits = calendar.totalContributions;
                    heatmapData = calendar.weeks;
                }
            }
        }

        // Fetch User Data for total repos
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userData = userRes.ok ? await userRes.json() : {};
        const totalRepos = userData.public_repos || 18;

        // Fetch Repos for recent and stars
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const reposData = reposRes.ok ? await reposRes.json() : [];

        let recentRepos = [];
        let totalStars = 0;

        if (Array.isArray(reposData)) {
            recentRepos = reposData.slice(0, 3);
            totalStars = reposData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
        }

        // Fetch Events for recent commits fallback if GraphQL fails
        let recentCommits = totalCommits;
        if (!recentCommits) {
            const eventsRes = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
            const eventsData = eventsRes.ok ? await eventsRes.json() : [];
            if (Array.isArray(eventsData)) {
                const pushEvents = eventsData.filter(e => e.type === 'PushEvent');
                recentCommits = pushEvents.reduce((acc, e) => acc + (e.payload.commits ? e.payload.commits.length : 0), 0);
            }
        }

        // Cache results
        sessionStorage.setItem(`gh_total_repos_${cacheKey}`, totalRepos.toString());
        sessionStorage.setItem(`gh_total_stars_${cacheKey}`, totalStars.toString());
        sessionStorage.setItem(`gh_recent_repos_${cacheKey}`, JSON.stringify(recentRepos));
        sessionStorage.setItem(`gh_recent_commits_${cacheKey}`, recentCommits.toString());
        if (heatmapData.length > 0) {
            sessionStorage.setItem(`gh_heatmap_data_${cacheKey}`, JSON.stringify(heatmapData));
        }

        return {
            totalRepos,
            totalStars,
            recentRepos,
            recentCommits,
            heatmapData
        };
    } catch (error) {
        console.error("Failed to fetch GitHub stats", error);
        return { totalRepos: 18, totalStars: 0, recentRepos: [], recentCommits: 0, heatmapData: [] };
    }
};
