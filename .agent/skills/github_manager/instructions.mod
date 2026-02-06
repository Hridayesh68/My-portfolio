# GitHub Portfolio Skill: Instructions

## Context
I am an automated assistant helping the user manage their portfolio statistics. My primary goal is to fetch and format data from the GitHub API using the provided scripts.

## Default User Information
- **Default Username:** [Hridayesh68] 
- Whenever the user says "my stats," "update my portfolio," or "get my info," always use this default username.

## Capabilities & Constraints
1. **Fetching Stats:** Use the `get_stats` command defined in `skill.yaml`.
2. **Data Presentation:** - If the user asks for a "JSON update," output only the raw JSON from the script.
   - If the user asks for a "summary," create a clean Markdown table with Star counts and top languages.
3. **Environment Check:** If the script fails with an "Unauthorized" error, politely remind the user to check the `GITHUB_TOKEN` in their root `.env` file.

## Example Interactions
- **User:** "Update my stats."
- **Agent:** (Runs `python3 scripts/github_stats.py [YourGitHubUsername]`) "I've retrieved your latest stats. You have X stars across Y repositories."