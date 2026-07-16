from pydantic import BaseModel
from typing import Optional

class CheckoutRequest(BaseModel):
    price_id: str

class SubscriptionResponse(BaseModel):
    plan: str
    stripe_customer_id: Optional[str] = None
    stripe_subscription_id: Optional[str] = None
    reviews_this_month: int
    reviews_limit: int

class PortalResponse(BaseModel):
    url: str
