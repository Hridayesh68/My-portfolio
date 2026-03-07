export const fetchLeetcodeStats = async (username = 'hridayeshdebsarma6') => {
    const cached = sessionStorage.getItem('lc_stats');
    if (cached) return JSON.parse(cached);

    try {
        // Attempt 1: alfa-leetcode-api
        const res = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
        if (res.ok) {
            const data = await res.json();
            const stats = {
                total: data.solvedProblem ?? 0,
                easy: data.easySolved ?? data.easy ?? 0,
                medium: data.mediumSolved ?? data.medium ?? 0,
                hard: data.hardSolved ?? data.hard ?? 0,
                error: false
            };
            sessionStorage.setItem('lc_stats', JSON.stringify(stats));
            return stats;
        }
    } catch (e) { /* fall through */ }

    try {
        // Attempt 2: leetcode-stats-api fallback
        const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
        if (res.ok) {
            const data = await res.json();
            if (data.status === 'success') {
                const stats = {
                    total: data.totalSolved ?? 0,
                    easy: data.easySolved ?? 0,
                    medium: data.mediumSolved ?? 0,
                    hard: data.hardSolved ?? 0,
                    error: false
                };
                sessionStorage.setItem('lc_stats', JSON.stringify(stats));
                return stats;
            }
        }
    } catch (e) { /* fall through */ }

    return { total: 0, easy: 0, medium: 0, hard: 0, error: true };
};
