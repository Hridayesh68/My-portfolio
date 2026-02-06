import os
import requests
import json
import sys

def get_portfolio_stats(username):
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        return {"error": "GITHUB_TOKEN not found in environment variables."}

    headers = {"Authorization": f"token {token}"}
    url = f"https://api.github.com/users/{username}/repos"
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        repos = response.json()

        stats = {
            "total_stars": sum(repo['stargazers_count'] for repo in repos),
            "total_forks": sum(repo['forks_count'] for repo in repos),
            "top_languages": {},
            "repo_count": len(repos)
        }

        # Calculate language frequency
        for repo in repos:
            lang = repo.get('language')
            if lang:
                stats["top_languages"][lang] = stats["top_languages"].get(lang, 0) + 1
        
        return stats
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No username provided"}))
    else:
        user = sys.argv[1]
        print(json.dumps(get_portfolio_stats(user)))