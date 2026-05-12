from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.auth.schemas import UserCreate, UserResponse, Token
from app.auth.utils import get_password_hash, verify_password, create_access_token, get_current_user
from app.database import db
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = {
        "_id": str(uuid.uuid4()),
        "name": user.name,
        "email": user.email,
        "password_hash": get_password_hash(user.password),
        "role": "admin", # Default role
        "created_at": datetime.utcnow()
    }
    
    await db.users.insert_one(user_dict)
    
    return {
        "id": user_dict["_id"],
        "name": user_dict["name"],
        "email": user_dict["email"],
        "role": user_dict["role"],
        "created_at": user_dict["created_at"]
    }

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_name": user["name"],
        "user_email": user["email"],
    }

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["_id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"],
        "created_at": current_user["created_at"]
    }
