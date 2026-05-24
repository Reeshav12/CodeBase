# Codebase

Understand any GitHub repo in seconds. Codebase is a full-stack intelligence platform that dynamically builds interactive architecture charts, file trees, language statistics, contributor panels, and features an AI-powered Q&A interface for any public GitHub repository.

[![Deploy to Render](https://render.com/images/deploy-to-render.svg)](https://render.com/deploy?repo=https://github.com/Reeshav12/CodeBase)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FReeshav12%2FCodeBase%2Ftree%2Fmain%2Ffrontend&envDescription=Backend%20API%20Base%20URL&envLink=https%3A%2F%2Frender.com&env=VITE_API_BASE_URL)

## Requirements

- Python 3.11+
- Node.js 18+
- PostgreSQL (running locally or accessible via URL)
- Redis server
- GitHub Personal Access Token
- OpenAI API Key (GPT-4o access)

## Setup Instructions

### Environment Variables

Before starting, map out your `.env` correctly. In the `backend` folder:
```bash
cp .env.example .env
```
Add your `GITHUB_TOKEN`, `OPENAI_API_KEY`, etc.

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload --port 8000
```
*Note: Make sure your PostgreSQL database exists before running Alembic migrations.*

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on [http://localhost:5173](http://localhost:5173).

## Features

- **JWT Authentication** (Login / Signup)
- **Repo Analysis Engine**: Analyzes sizes, languages, dependencies, config files.
- **Interactive UI**: Fluid dark mode components with tailwind aesthetics.
- **ReactFlow Maps**: Live rendering of folder architectures.
- **AI Chat**: GPT-4o queries directly context-aware to the file tree and metadata.
- **Responsive Layout**: Desktop and mobile ready layouts.
