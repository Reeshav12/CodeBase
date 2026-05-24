from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User
from app.models.repo import SavedRepo, ChatMessage
from app.utils.auth import get_current_user
from app.services.ai_service import chat_with_repo

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatReq(BaseModel):
    question: str

@router.post("/{repo_id}")
async def chat(repo_id: int, req: ChatReq, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = db.query(SavedRepo).filter(SavedRepo.id==repo_id, SavedRepo.user_id==user.id).first()
    if not repo: raise HTTPException(404, "Not found")
    history = db.query(ChatMessage).filter(ChatMessage.repo_id==repo_id).order_by(ChatMessage.created_at).all()
    meta = repo.analysis_cache.get("metadata", {})
    analysis = repo.analysis_cache.get("analysis", {})
    answer = await chat_with_repo(req.question, meta, analysis, [{"role":m.role,"content":m.content} for m in history])
    db.add(ChatMessage(repo_id=repo_id, role="user", content=req.question))
    db.add(ChatMessage(repo_id=repo_id, role="assistant", content=answer))
    db.commit()
    return {"answer": answer}

@router.get("/{repo_id}/history")
def history(repo_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = db.query(SavedRepo).filter(SavedRepo.id==repo_id, SavedRepo.user_id==user.id).first()
    if not repo: raise HTTPException(404, "Not found")
    msgs = db.query(ChatMessage).filter(ChatMessage.repo_id==repo_id).order_by(ChatMessage.created_at).all()
    return [{"role":m.role,"content":m.content,"created_at":m.created_at} for m in msgs]

@router.delete("/{repo_id}/history")
def clear(repo_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = db.query(SavedRepo).filter(SavedRepo.id==repo_id, SavedRepo.user_id==user.id).first()
    if not repo: raise HTTPException(404, "Not found")
    db.query(ChatMessage).filter(ChatMessage.repo_id==repo_id).delete()
    db.commit()
    return {"message": "Cleared"}
