from github import Github, GithubException
from app.config import settings

def get_client(): return Github(settings.GITHUB_TOKEN) if settings.GITHUB_TOKEN else Github()

async def fetch_repo_metadata(full_name: str) -> dict:
    try:
        repo = get_client().get_repo(full_name)
        langs = repo.get_languages()
        total = sum(langs.values()) or 1
        contributors = []
        try:
            for c in list(repo.get_contributors())[:10]:
                contributors.append({"login": c.login, "avatar": c.avatar_url,
                                     "contributions": c.contributions, "url": c.html_url})
        except: pass
        commits = []
        try:
            for cm in list(repo.get_commits())[:20]:
                commits.append({"sha": cm.sha[:7], "message": cm.commit.message.split("\n")[0],
                                "author": cm.commit.author.name, "date": cm.commit.author.date.isoformat()})
        except: pass
        return {
            "name": repo.name, "full_name": repo.full_name, "description": repo.description,
            "url": repo.html_url, "stars": repo.stargazers_count, "forks": repo.forks_count,
            "open_issues": repo.open_issues_count, "default_branch": repo.default_branch,
            "language": repo.language, "size_kb": repo.size,
            "languages": {l: round(b/total*100, 1) for l, b in langs.items()},
            "topics": repo.get_topics(), "license": repo.license.name if repo.license else None,
            "contributors": contributors, "recent_commits": commits,
            "created_at": repo.created_at.isoformat(), "updated_at": repo.updated_at.isoformat(),
        }
    except GithubException as e:
        raise ValueError(f"GitHub error: {e.data.get('message', str(e))}")

async def fetch_file_tree(full_name: str) -> list:
    repo = get_client().get_repo(full_name)
    tree = repo.get_git_tree(sha=repo.default_branch, recursive=True)
    return [{"path": i.path, "type": i.type, "size": i.size}
            for i in tree.tree if i.path.count("/") < 4]
