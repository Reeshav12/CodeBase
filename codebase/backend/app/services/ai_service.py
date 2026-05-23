from openai import OpenAI
from app.config import settings

if settings.GROQ_API_KEY:
    client = OpenAI(api_key=settings.GROQ_API_KEY, base_url="https://api.groq.com/openai/v1")
    MODEL = "llama-3.3-70b-versatile"
else:
    client = OpenAI(api_key=settings.OPENAI_API_KEY or "dummy")
    MODEL = "gpt-4o"

SYSTEM = """You are Codebase AI — an expert developer assistant for GitHub repo analysis.
Answer questions about repos with technical depth. Use the repo context provided.
Format code with markdown code blocks. Be concise but complete."""

def build_context(metadata: dict, analysis: dict) -> str:
    langs = ", ".join(f"{k}({v}%)" for k, v in list(metadata.get("languages",{}).items())[:5])
    return f"""Repo: {metadata.get('full_name')}
Description: {metadata.get('description','N/A')}
Language: {metadata.get('language')} | All: {langs}
Stars: {metadata.get('stars')} | Forks: {metadata.get('forks')}
Files: {analysis.get('total_files')} | Size: {analysis.get('total_size_kb')}KB
Frameworks: {', '.join(analysis.get('detected_frameworks',[]))}
Top dirs: {', '.join(list(analysis.get('top_directories',{}).keys())[:8])}"""

async def chat_with_repo(question: str, metadata: dict, analysis: dict, history: list) -> str:
    messages = [
        {"role": "system", "content": SYSTEM},
        {"role": "user", "content": f"Repo context:\n{build_context(metadata, analysis)}"},
        {"role": "assistant", "content": "Got it. Ask me anything about this repo."},
        *[{"role": m["role"], "content": m["content"]} for m in history[-10:]],
        {"role": "user", "content": question},
    ]
    res = client.chat.completions.create(model=MODEL, messages=messages,
                                          max_tokens=1024, temperature=0.3)
    return res.choices[0].message.content
