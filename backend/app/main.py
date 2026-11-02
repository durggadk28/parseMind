from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.api.study import router as study_router

app = FastAPI(
    title="ParseMind API",
    description="Backend API powering structured study summaries, quizzes, flashcards, and deep-dive explanations.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure Cross-Origin Resource Sharing (CORS)
# Allows the React frontend to communicate seamlessly with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(study_router, prefix="/api")


@app.get("/", tags=["Health"])
async def root():
    """Root landing route."""
    return {
        "status": "online",
        "service": "ParseMind API",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Healthcheck endpoint for hosting platforms (Render/Railway)."""
    return {
        "status": "healthy",
        "provider": settings.AI_PROVIDER
    }

