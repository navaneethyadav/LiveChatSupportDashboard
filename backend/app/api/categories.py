from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db

from app.models.categories import Category

from app.schemas.category_schema import (
    CategoryCreate
)

router = APIRouter()


@router.post("/categories")
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db)
):

    new_category = Category(
        name=category.name
    )

    db.add(new_category)

    db.commit()

    db.refresh(new_category)

    return {
        "message": "Category created successfully",
        "category": new_category
    }


@router.get("/categories")
def get_categories(
    db: Session = Depends(get_db)
):

    categories = db.query(Category).all()

    return categories