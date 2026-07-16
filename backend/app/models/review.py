import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

class Review(Base):
    __tablename__ = "reviews"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    resume_text: Mapped[str] = mapped_column(Text, nullable=False)
    job_description: Mapped[str] = mapped_column(Text, nullable=False)
    
    overall_score: Mapped[int] = mapped_column(Integer, nullable=True)
    feedback: Mapped[dict] = mapped_column(JSON, nullable=True)  # Detailed feedback json
    status: Mapped[str] = mapped_column(String(50), default="pending")  # "pending", "completed", "failed"
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="reviews")
