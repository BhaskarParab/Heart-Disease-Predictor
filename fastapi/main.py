from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, validator
from passlib.context import CryptContext
from bson import ObjectId
import motor.motor_asyncio
import jwt
import joblib
import numpy as np
import logging


SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Load the pre-trained model
model = joblib.load('HDP.pkl')

app = FastAPI()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust to match your React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB client setup
client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
db = client.heart_disease_predictor
users_collection = db.users
predictions_collection = db.predictions

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class User(BaseModel):
    username: str
    password: str
    email: str
    gender: str
    dob: str


class Token(BaseModel):
    access_token: str
    token_type: str

class PredictionRequest(BaseModel):
    feature1: float = Field(..., description="Age")
    feature2: str = Field(..., description="Gender")
    feature3: float = Field(..., description="CP")
    feature4: float = Field(..., description="TrestBPS")
    feature5: float = Field(..., description="Chol")
    feature6: float = Field(..., description="FBS")
    feature7: float = Field(..., description="RestECG")
    feature8: float = Field(..., description="Thalch")
    feature9: float = Field(..., description="Exang")
    feature10: float = Field(..., description="Oldpeak")
    feature11: float = Field(..., description="Slope")
    feature12: float = Field(..., description="CA")
    feature13: float = Field(..., description="Thal")

    @validator('feature2')
    def validate_gender(cls, value):
        if value.upper() == 'M':
            return 1.0
        elif value.upper() == 'F':
            return 0.0
        else:
            raise ValueError("Gender must be 'M' or 'F'")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user(username: str):
    user = await users_collection.find_one({"username": username})
    if user:
        return User(**user)

async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user or not verify_password(password, user.password):
        return False
    return user

def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=HTTPException,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    user = await get_user(username=username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/register")
async def register(user: User):
    logger.info(f"Registering user: {user.username}")
    if await users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = pwd_context.hash(user.password)
    new_user = {
        "username": user.username,
        "password": hashed_password,
        "email": user.email,
        "gender": user.gender,
        "dob": user.dob
    }
    try:
        result = await users_collection.insert_one(new_user)
        logger.info(f"User registered with ID: {result.inserted_id}")
        return {"message": "User registered successfully"}
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=HTTPException,
            detail="Incorrect username or password",
        )
    access_token = create_access_token(data={"username": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/predict")
async def predict(data: PredictionRequest, current_user: User = Depends(get_current_user)):
    try:
        features = np.array([
            data.feature1, data.feature2, data.feature3, data.feature4, 
            data.feature5, data.feature6, data.feature7, data.feature8, 
            data.feature9, data.feature10, data.feature11, data.feature12, 
            data.feature13
        ]).reshape(1, -1)
        prediction = model.predict(features)[0]

        # Save the prediction and features to MongoDB
        prediction_record = data.dict()
        prediction_record['prediction'] = int(prediction)
        prediction_record['username'] = current_user.username
        result = await predictions_collection.insert_one(prediction_record)

        return {"id": str(result.inserted_id), "prediction": int(prediction)}
    except Exception as e:
        logger.error(f"Error in prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history(current_user: User = Depends(get_current_user)):
    try:
        predictions = await predictions_collection.find({"username": current_user.username}).to_list(None)
        for prediction in predictions:
            prediction['_id'] = str(prediction['_id'])  # Convert ObjectId to string
        return predictions
    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/myaccount", response_model=User)
async def get_my_account(current_user: User = Depends(get_current_user)):
    try:
        user = await users_collection.find_one({"username": current_user.username})
        if user:
            user["_id"] = str(user["_id"])  # Convert ObjectId to string
            return user
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        logger.error(f"Error fetching user data: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@app.delete("/history/{history_id}")
async def delete_history(history_id: str, current_user: User = Depends(get_current_user)):
    try:
        result = await predictions_collection.delete_one({"_id": ObjectId(history_id), "username": current_user.username})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="History not found or not authorized to delete")
        return {"message": "History deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Heart Disease Predictor API!"}
