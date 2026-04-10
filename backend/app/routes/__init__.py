from app.routes.alerts import router as alerts_router
from app.routes.analyze import router as analyze_router
from app.routes.logs import router as logs_router
from app.routes.summary import router as summary_router

__all__ = ["alerts_router", "analyze_router", "logs_router", "summary_router"]
