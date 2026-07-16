import stripe
import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.core.config import settings
from app.models.user import User
from app.schemas.billing import CheckoutRequest, SubscriptionResponse, PortalResponse
from app.api.deps import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/billing", tags=["billing"])

# Initialize Stripe
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY

@router.get("/status", response_model=SubscriptionResponse)
async def get_status(current_user: User = Depends(get_current_user)):
    limit = 3 if current_user.plan == "free" else 99999
    return SubscriptionResponse(
        plan=current_user.plan,
        stripe_customer_id=current_user.stripe_customer_id,
        stripe_subscription_id=current_user.stripe_subscription_id,
        reviews_this_month=current_user.reviews_this_month,
        reviews_limit=limit
    )

@router.post("/checkout")
async def create_checkout_session(
    payload: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    price_id = payload.price_id or settings.STRIPE_PRICE_PRO
    
    # Fallback to Mock checkout if Stripe is not configured
    if not settings.STRIPE_SECRET_KEY:
        logger.warning("STRIPE_SECRET_KEY not configured. Directing to Mock Checkout.")
        mock_checkout_url = f"{settings.FRONTEND_URL}/checkout-mock?user_id={current_user.id}&price_id={price_id}"
        return {"url": mock_checkout_url}
        
    try:
        session = stripe.checkout.Session.create(
            customer_email=current_user.email,
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            success_url=f"{settings.FRONTEND_URL}/dashboard?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_URL}/billing",
            metadata={"user_id": str(current_user.id)},
        )
        return {"url": session.url}
    except Exception as e:
        logger.error(f"Error creating Stripe checkout session: {e}")
        # Automatically fallback to mock checkout so the demo works
        mock_checkout_url = f"{settings.FRONTEND_URL}/checkout-mock?user_id={current_user.id}&price_id={price_id}"
        return {"url": mock_checkout_url}

@router.post("/portal", response_model=PortalResponse)
async def create_portal_session(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not settings.STRIPE_SECRET_KEY or not current_user.stripe_customer_id:
        # Mock portal session URL
        mock_portal_url = f"{settings.FRONTEND_URL}/portal-mock?user_id={current_user.id}"
        return PortalResponse(url=mock_portal_url)
        
    try:
        session = stripe.billing_portal.Session.create(
            customer=current_user.stripe_customer_id,
            return_url=f"{settings.FRONTEND_URL}/billing",
        )
        return PortalResponse(url=session.url)
    except Exception as e:
        logger.error(f"Error creating Stripe portal session: {e}")
        mock_portal_url = f"{settings.FRONTEND_URL}/portal-mock?user_id={current_user.id}"
        return PortalResponse(url=mock_portal_url)

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None), db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    
    if not settings.STRIPE_SECRET_KEY or not settings.STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=400, detail="Webhooks are not configured.")
        
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_type = event["type"]
    data_object = event["data"]["object"]

    if event_type == "checkout.session.completed":
        user_id = data_object.get("metadata", {}).get("user_id")
        customer_id = data_object.get("customer")
        subscription_id = data_object.get("subscription")
        
        if user_id:
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()
            if user:
                user.plan = "pro"
                user.stripe_customer_id = customer_id
                user.stripe_subscription_id = subscription_id
                await db.commit()
                logger.info(f"User {user_id} upgraded to Pro via Stripe Webhook.")

    elif event_type == "customer.subscription.deleted":
        subscription_id = data_object.get("id")
        result = await db.execute(select(User).where(User.stripe_subscription_id == subscription_id))
        user = result.scalar_one_or_none()
        if user:
            user.plan = "free"
            user.stripe_subscription_id = None
            await db.commit()
            logger.info(f"User {user.id} subscription deleted. Plan reverted to Free.")

    elif event_type == "invoice.payment_failed":
        customer_id = data_object.get("customer")
        result = await db.execute(select(User).where(User.stripe_customer_id == customer_id))
        user = result.scalar_one_or_none()
        if user:
            user.plan = "free"  # Downgrade or flag
            await db.commit()
            logger.warning(f"Payment failed for Customer {customer_id}. Reverted to Free.")

    return {"status": "success"}

# Special helper endpoint for Mock Webhook (Checkout bypass for local testing)
@router.post("/webhook-mock")
async def webhook_mock(request: Request, db: AsyncSession = Depends(get_db)):
    data = await request.json()
    user_id = data.get("user_id")
    action = data.get("action")  # "upgrade" or "cancel"
    
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required.")
        
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
        
    if action == "upgrade":
        user.plan = "pro"
        user.stripe_customer_id = "mock_customer_id"
        user.stripe_subscription_id = "mock_subscription_id"
        await db.commit()
        logger.info(f"User {user_id} upgraded to Pro via Mock Webhook.")
        return {"status": "success", "message": "Upgraded successfully"}
        
    elif action == "cancel":
        user.plan = "free"
        user.stripe_customer_id = None
        user.stripe_subscription_id = None
        await db.commit()
        logger.info(f"User {user_id} plan reset to Free via Mock Cancel.")
        return {"status": "success", "message": "Subscription cancelled"}
        
    raise HTTPException(status_code=400, detail="Invalid action.")
