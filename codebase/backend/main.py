from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, repos, chat

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Codebase API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"],
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(auth.router, prefix="/api")
app.include_router(repos.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

@app.get("/api/health")
def health(): return {"status": "ok"}
