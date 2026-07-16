import ssl
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# Determine engine config based on database type
is_sqlite = settings.DATABASE_URL.startswith("sqlite")
is_neon = "neon.tech" in settings.DATABASE_URL

connect_args = {}
if is_sqlite:
    connect_args = {"check_same_thread": False}
elif is_neon:
    # Neon requires SSL; asyncpg uses 'ssl' connect_arg
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    connect_args = {"ssl": ssl_context}

# Strip query params that asyncpg doesn't understand
db_url = settings.DATABASE_URL
if is_neon:
    # Remove sslmode/ssl/channel_binding params — handled via connect_args
    base_url = db_url.split("?")[0]
    db_url = base_url

engine = create_async_engine(
    db_url,
    echo=False,
    connect_args=connect_args
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
