from fastapi import APIRouter
from app.services.detect import object

router = APIRouter(
    prefix="/detect",
    tags=["detect"]
)

router.include_router(object.router, prefix="/object")
