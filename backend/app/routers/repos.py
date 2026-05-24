from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.repo import SavedRepo
from app.utils.auth import get_current_user
from app.services.github_service import fetch_repo_metadata, fetch_file_tree
from app.services.analysis_service import analyze_file_tree
from app.services.graph_service import build_architecture_graph

router = APIRouter(prefix="/repos", tags=["repos"])

def parse_url(url: str) -> str:
    parts = url.rstrip("/").replace("https://github.com/","").replace("http://github.com/","").strip("/").split("/")
    if len(parts) < 2: raise ValueError("Invalid GitHub URL")
    return f"{parts[0]}/{parts[1]}"

class AddRepoReq(BaseModel):
    repo_url: str

@router.get("/")
def list_repos(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repos = db.query(SavedRepo).filter(SavedRepo.user_id == user.id).order_by(SavedRepo.created_at.desc()).all()
    return [{"id":r.id,"repo_full_name":r.repo_full_name,"description":r.description,
             "stars":r.stars,"language":r.language,"last_analyzed":r.last_analyzed} for r in repos]

@router.post("/")
async def add_repo(req: AddRepoReq, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try: full_name = parse_url(req.repo_url)
    except: raise HTTPException(400, "Invalid GitHub URL")
    if db.query(SavedRepo).filter(SavedRepo.user_id==user.id, SavedRepo.repo_full_name==full_name).first():
        raise HTTPException(400, "Repo already added")
    try:
        meta = await fetch_repo_metadata(full_name)
        tree = await fetch_file_tree(full_name)
        analysis = analyze_file_tree(tree)
        graph = build_architecture_graph(tree, meta)
    except ValueError as e:
        raise HTTPException(400, str(e))
    repo = SavedRepo(user_id=user.id, repo_full_name=full_name,
                     repo_url=f"https://github.com/{full_name}",
                     description=meta.get("description"), stars=meta.get("stars",0),
                     language=meta.get("language"),
                     analysis_cache={"metadata":meta,"file_tree":tree[:200],"analysis":analysis},
                     graph_data=graph, last_analyzed=datetime.utcnow())
    db.add(repo); db.commit(); db.refresh(repo)
    return {"id": repo.id, "repo_full_name": repo.repo_full_name}

@router.get("/{repo_id}")
def get_repo(repo_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = db.query(SavedRepo).filter(SavedRepo.id==repo_id, SavedRepo.user_id==user.id).first()
    if not repo: raise HTTPException(404, "Not found")
    return {"id":repo.id,"repo_full_name":repo.repo_full_name,"description":repo.description,
            "stars":repo.stars,"language":repo.language,"analysis":repo.analysis_cache,
            "graph_data":repo.graph_data,"last_analyzed":repo.last_analyzed}

@router.delete("/{repo_id}")
def delete_repo(repo_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = db.query(SavedRepo).filter(SavedRepo.id==repo_id, SavedRepo.user_id==user.id).first()
    if not repo: raise HTTPException(404, "Not found")
    db.delete(repo); db.commit()
    return {"message": "Deleted"}

@router.post("/{repo_id}/refresh")
async def refresh_repo(repo_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = db.query(SavedRepo).filter(SavedRepo.id==repo_id, SavedRepo.user_id==user.id).first()
    if not repo: raise HTTPException(404, "Not found")
    meta = await fetch_repo_metadata(repo.repo_full_name)
    tree = await fetch_file_tree(repo.repo_full_name)
    analysis = analyze_file_tree(tree)
    repo.analysis_cache = {"metadata":meta,"file_tree":tree[:200],"analysis":analysis}
    repo.graph_data = build_architecture_graph(tree, meta)
    repo.stars = meta.get("stars",0); repo.last_analyzed = datetime.utcnow()
    db.commit()
    return {"message": "Refreshed"}
