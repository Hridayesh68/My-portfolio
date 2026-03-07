// HackerRank doesn't have a simple public unauthenticated JSON API.
// Without scraping or user auth tokens, the simplest and most robust way
// to display HackerRank achievements on a static portfolio is using an iframe
// or an external badge generator API if badges are requested.
// We'll simulate fetching for consistency, but the UI will rely heavily on static/badge components.

export const fetchHackerrankStats = async (username = 'hridayeshdebsar1') => {
    // Return standard mock/layout data for rendering the Hackerrank stats tab
    return {
        username,
        badgeUrl: `https://hackerrank-badges.vercel.app/${username}`,
        profileUrl: `https://hackerrank.com/${username}`,
        verifiedSkills: ['Problem Solving', 'C++', 'Java', 'Python'],
        // Mocking certifications for display
        certifications: [
            { name: "JavaScript (Basic)" },
            { name: "Problem Solving (Basic)" },
            { name: "React (Basic)" }
        ]
    };
};
