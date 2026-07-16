from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.db.session import get_db
from app.models.user import User
from app.models.review import Review
from app.schemas.review import ReviewRequest, ReviewResponse
from app.api.deps import get_current_user
from app.services.ai_service import analyze_resume_gemini
from app.services.file_parser import parse_resume_file

router = APIRouter(prefix="/reviews", tags=["reviews"])

def check_and_reset_limits(user: User) -> bool:
    """Resets reviews_this_month if current billing period has expired (30 days)."""
    now = datetime.utcnow()
    # Check if more than 30 days have passed since period start
    if now - user.current_period_start > timedelta(days=30):
        user.reviews_this_month = 0
        user.current_period_start = now
        return True
    return False

def check_plan_limits(user: User):
    """Check and enforce plan limits. Raises HTTPException if limit reached."""
    check_and_reset_limits(user)
    
    if user.plan == "free":
        if user.reviews_this_month >= 20:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Monthly review limit reached for Free Tier. Upgrade to Pro for unlimited reviews."
            )
        user.reviews_this_month += 1

@router.post("", response_model=ReviewResponse)
async def create_review(
    payload: ReviewRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    check_plan_limits(current_user)
    
    # Create the review record in pending state
    review = Review(
        user_id=current_user.id,
        resume_text=payload.resume_text,
        job_description=payload.job_description,
        status="pending"
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    
    try:
        # Run AI analysis
        analysis_result = await analyze_resume_gemini(payload.resume_text, payload.job_description)
        
        # Update review record
        review.overall_score = analysis_result.get("overall_score", 0)
        review.feedback = analysis_result
        review.status = "completed"
        
        db.add(review)
        db.add(current_user)  # Save the incremented review count or period reset
        await db.commit()
        await db.refresh(review)
        
    except Exception as e:
        review.status = "failed"
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze resume: {str(e)}"
        )
        
    return review

@router.post("/upload", response_model=ReviewResponse)
async def create_review_from_file(
    resume_file: UploadFile = File(...),
    job_description: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a review by uploading a resume file (PDF, DOCX, or TXT)."""
    check_plan_limits(current_user)
    
    # Validate file size (5MB max)
    MAX_SIZE = 5 * 1024 * 1024
    contents = await resume_file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large. Maximum size is 5MB."
        )
    
    # Extract text from the file
    try:
        resume_text = await parse_resume_file(contents, resume_file.filename)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    if not resume_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract any text from the uploaded file. Please try pasting the text directly."
        )
    
    # Create the review record
    review = Review(
        user_id=current_user.id,
        resume_text=resume_text,
        job_description=job_description,
        status="pending"
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    
    try:
        # Run AI analysis
        analysis_result = await analyze_resume_gemini(resume_text, job_description)
        
        review.overall_score = analysis_result.get("overall_score", 0)
        review.feedback = analysis_result
        review.status = "completed"
        
        db.add(review)
        db.add(current_user)
        await db.commit()
        await db.refresh(review)
        
    except Exception as e:
        review.status = "failed"
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze resume: {str(e)}"
        )
        
    return review

@router.get("", response_model=list[ReviewResponse])
async def list_reviews(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Review)
        .where(Review.user_id == current_user.id)
        .order_by(desc(Review.created_at))
    )
    return result.scalars().all()

@router.get("/{review_id}", response_model=ReviewResponse)
async def get_review(
    review_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Review).where(Review.id == review_id, Review.user_id == current_user.id)
    )
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    return review
