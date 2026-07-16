from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ReviewRequest(BaseModel):
    resume_text: str
    job_description: str

class ReviewResponse(BaseModel):
    id: str
    user_id: str
    resume_text: str
    job_description: str
    overall_score: Optional[int] = None
    feedback: Optional[Dict[str, Any]] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
