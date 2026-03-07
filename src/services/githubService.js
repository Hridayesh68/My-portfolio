export const fetchGithubStats = async (username = 'Hridayesh68') => {
    const cachedRepos = sessionStorage.getItem('gh_recent_repos');
    const cachedCommits = sessionStorage.getItem('gh_recent_commits');
    const cachedTotalRepos = sessionStorage.getItem('gh_total_repos');
    const cachedStars = sessionStorage.getItem('gh_total_stars');

    if (cachedRepos && cachedCommits && cachedTotalRepos && cachedStars) {
        return {
            recentRepos: JSON.parse(cachedRepos),
            recentCommits: parseInt(cachedCommits),
            totalRepos: parseInt(cachedTotalRepos),
            totalStars: parseInt(cachedStars)
        };
    }

    try {
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

        // Fetch Events for recent commits
        const eventsRes = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
        const eventsData = eventsRes.ok ? await eventsRes.json() : [];
        let recentCommits = 0;

        if (Array.isArray(eventsData)) {
            const pushEvents = eventsData.filter(e => e.type === 'PushEvent');
            recentCommits = pushEvents.reduce((acc, e) => acc + (e.payload.commits ? e.payload.commits.length : 0), 0);
        }

        // Cache results
        sessionStorage.setItem('gh_total_repos', totalRepos.toString());
        sessionStorage.setItem('gh_total_stars', totalStars.toString());
        sessionStorage.setItem('gh_recent_repos', JSON.stringify(recentRepos));
        sessionStorage.setItem('gh_recent_commits', recentCommits.toString());

        return {
            totalRepos,
            totalStars,
            recentRepos,
            recentCommits
        };
    } catch (error) {
        console.error("Failed to fetch GitHub stats", error);
        return { totalRepos: 18, totalStars: 0, recentRepos: [], recentCommits: 0 };
    }
};
