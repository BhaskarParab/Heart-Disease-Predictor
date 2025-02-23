import datetime
import os
import logging
import re
import jwt
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from dotenv import load_dotenv
from firebase_admin import credentials, firestore, auth, initialize_app
from firebase_admin.exceptions import FirebaseError

# Constants
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

# Load pre-trained model
model = joblib.load('HDP.pkl')

# Load environment variables
load_dotenv()
service_account_path = os.getenv("REACT_APP_SERVICE_ACCOUNT_PATH")

if not service_account_path:
    raise ValueError("SERVICE_ACCOUNT_PATH is not set in the environment variables.")

# Firebase setup
cred = credentials.Certificate(service_account_path)
initialize_app(cred)
db = firestore.client()

# Firestore collections
predictions_collection = db.collection("predictions")

# FastAPI app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust to match your React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic Models
class RegisterRequest(BaseModel):
    uid: str
    username: str
    gender: str
    dob: str
    email: str
    password: str
    
    @validator('email')
    def validate_email(cls, value):
        """ Custom email validation """
        email_regex = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
        if not re.match(email_regex, value):
            raise ValueError("Invalid email format")
        return value

class LoginRequest(BaseModel):
    email: str
    password: str

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

# Helper Functions
def decode_token(token: str):
    """Decode Firebase ID token."""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except FirebaseError as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(request: Request):
    """Extract and decode the Firebase token from the Authorization header."""
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    token = auth_header.split(" ")[1]
    return decode_token(token)

# Endpoints

@app.post("/register")
async def register_user(request: RegisterRequest):
    """Register a new user with Firebase Authentication and save user data."""
    try:
        # Ensure all fields are provided (email, password, display_name, etc.)
        if not all([request.email, request.password, request.username, request.gender, request.dob]):
            raise HTTPException(status_code=400, detail="All fields are required.")

        # Create the user with Firebase Authentication
        user = auth.create_user(
            email=request.email,
            password=request.password,
            display_name=request.display_name
        )
        logger.info(f"User registered: {user.uid}")

        # Prepare user data for Firestore
        user_data = {
            "uid": user.uid,
            "username": request.username,
            "gender": request.gender,
            "dob": request.dob,
            "createdAt": datetime.utcnow().isoformat(),
        }

        # Save user details in Firestore
        user_doc = db.collection("users").document(user.uid)
        user_doc.set(user_data)

        # Return success response
        return {"message": "User registered successfully", "uid": user.uid}

    except FirebaseError as e:
        # Log and raise Firebase specific error
        logger.error(f"Error registering user: {e}")
        raise HTTPException(status_code=400, detail=f"Error registering user: {str(e)}")
    except Exception as e:
        # Catch other errors and return a generic message
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=400, detail="An error occurred during registration.")


@app.get("/auth/verify")
async def verify_token(request: Request):
    """Verify a Firebase ID token."""
    user = get_current_user(request)
    logger.info(f"Token verified for user: {user['uid']}")
    return {"message": "Token verified", "user": user}

@app.post("/predict")
async def predict(data: PredictionRequest, request: Request):
    """Predict heart disease risk based on input features."""
    user = get_current_user(request)
    try:
        features = np.array([[
            data.feature1, data.feature2, data.feature3, data.feature4,
            data.feature5, data.feature6, data.feature7, data.feature8,
            data.feature9, data.feature10, data.feature11, data.feature12,
            data.feature13
        ]]).reshape(1, -1)
        prediction = model.predict(features)[0]

        prediction_record = data.dict()
        prediction_record['prediction'] = int(prediction)
        prediction_record['user_id'] = user['uid']
        predictions_collection.add(prediction_record)

        return {"prediction": int(prediction), "user": user['email']}
    except Exception as e:
        logger.error(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail="Error during prediction")

@app.get("/history")
async def get_history(request: Request):
    """Retrieve prediction history for the logged-in user."""
    user = get_current_user(request)
    try:
        predictions = predictions_collection.where("user_id", "==", user["uid"]).stream()
        history = [{"id": doc.id, **doc.to_dict()} for doc in predictions]
        return history
    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail="Error fetching history")

@app.delete("/history/{doc_id}")
async def delete_history(doc_id: str, request: Request):
    """Delete a specific prediction from the history."""
    user = get_current_user(request)
    try:
        doc_ref = predictions_collection.document(doc_id)
        doc = doc_ref.get()
        if doc.exists and doc.to_dict().get("user_id") == user["uid"]:
            doc_ref.delete()
            logger.info(f"Prediction {doc_id} deleted by user {user['uid']}")
            return {"message": "Prediction deleted successfully"}
        raise HTTPException(status_code=403, detail="Unauthorized to delete this record")
    except Exception as e:
        logger.error(f"Error deleting prediction {doc_id}: {e}")
        raise HTTPException(status_code=500, detail="Error deleting prediction")
    
@app.get("/check-user/{email}")
async def check_user(email: str):
    try:
        user = auth.get_user_by_email(email)
        return {"exists": True}
    except:
        raise HTTPException(status_code=404, detail="User not found")

@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Welcome to the Heart Disease Predictor API"}
