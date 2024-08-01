from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from bson import ObjectId
import joblib
import numpy as np
import motor.motor_asyncio
import logging

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
db = client.prediction_db
collection = db.predictions

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

@app.post("/predict")
async def predict(data: PredictionRequest):
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
        result = await collection.insert_one(prediction_record)

        return {"id": str(result.inserted_id), "prediction": int(prediction)}
    except Exception as e:
        logger.error(f"Error in prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history():
    try:
        predictions = await collection.find().to_list(None)
        for prediction in predictions:
            prediction['_id'] = str(prediction['_id'])  # Convert ObjectId to string
        return predictions
    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail=str(e))
        
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Heart Disease Predictor API!"}
