from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class SavedRepo(Base):
    __tablename__ = "saved_repos"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    repo_full_name = Column(String, nullable=False)
    repo_url = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    stars = Column(Integer, default=0)
    language = Column(String, nullable=True)
    analysis_cache = Column(JSON, nullable=True)
    graph_data = Column(JSON, nullable=True)
    last_analyzed = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner = relationship("User", back_populates="repos")
    chat_history = relationship("ChatMessage", back_populates="repo", cascade="all, delete")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    repo_id = Column(Integer, ForeignKey("saved_repos.id"), nullable=False)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    repo = relationship("SavedRepo", back_populates="chat_history")
