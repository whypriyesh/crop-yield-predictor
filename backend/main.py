# main.py

import joblib
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel

# -------------------------
# Load saved artifacts
# -------------------------
model = joblib.load("model/model.pkl")
encoders = joblib.load("model/encoders.pkl")
features = joblib.load("model/features.pkl")
log_flag = joblib.load("model/log_transformed.pkl")

# -------------------------
# Initialize FastAPI
# -------------------------
app = FastAPI()

# -------------------------
# Input schema
# -------------------------
class InputData(BaseModel):
    State_Name: str
    Season: str
    Crop: str
    Area: float

# -------------------------
# Helper: encode inputs
# -------------------------
def encode_input(data: InputData):
    return [
        encoders["State_Name"].transform([data.State_Name.strip()])[0],
        encoders["Season"].transform([data.Season.strip()])[0],
        encoders["Crop"].transform([data.Crop.strip()])[0],
        data.Area
    ]


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Routes
# -------------------------

@app.get("/")
def home():
    return {"message": "Crop Yield Predictor API is running"}

@app.get("/options")
def get_options():
    try:
        return {
            "states": encoders["State_Name"].classes_.tolist(),
            "seasons": encoders["Season"].classes_.tolist(),
            "crops": encoders["Crop"].classes_.tolist()
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/predict")
def predict(data: InputData):
    try:
        # encode input
        encoded = encode_input(data)

        # convert to numpy
        X = np.array(encoded).reshape(1, -1)

        # prediction
        pred = model.predict(X)[0]

        # reverse log transform if needed
        if log_flag:
            pred = np.expm1(pred)

        return {
            "predicted_yield": round(float(pred), 2)
        }

    except Exception as e:
        return {
            "error": str(e)
        }