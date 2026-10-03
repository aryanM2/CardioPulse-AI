import os
import pickle
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

app = FastAPI(
    title="Heart Disease Prediction API",
    description="Machine Learning Microservice for Heart Disease Risk Prediction",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths to pickle files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")
COLUMNS_PATH = os.path.join(BASE_DIR, "columns.pkl")

# Dataset baseline statistics for continuous features (UCI/Kaggle Heart Failure Dataset)
FEATURE_STATS = {
    'Age': (53.510893, 9.432617),
    'RestingBP': (132.396514, 18.514154),
    'Cholesterol': (198.799564, 109.384145),
    'MaxHR': (136.809368, 25.460334),
    'Oldpeak': (0.887364, 1.066570)
}

def load_artifact(path):
    if not os.path.exists(path):
        return None
    try:
        return joblib.load(path)
    except Exception:
        with open(path, "rb") as f:
            return pickle.load(f)

@app.on_event("startup")
def load_artifacts():
    global model, scaler, expected_columns
    try:
        if os.path.exists(MODEL_PATH):
            model = load_artifact(MODEL_PATH)
        if os.path.exists(SCALER_PATH):
            scaler = load_artifact(SCALER_PATH)
        if os.path.exists(COLUMNS_PATH):
            expected_columns = load_artifact(COLUMNS_PATH)

        # Composite scaler adjustment for continuous features pre-scaled in training
        if scaler is not None and hasattr(scaler, 'mean_') and expected_columns:
            idx_age = expected_columns.index('Age') if 'Age' in expected_columns else -1
            if idx_age != -1 and abs(scaler.mean_[idx_age]) < 1.0:
                for name, (m, s) in FEATURE_STATS.items():
                    if name in expected_columns:
                        idx = expected_columns.index(name)
                        scaler.mean_[idx] = m + scaler.mean_[idx] * s
                        scaler.scale_[idx] = s * scaler.scale_[idx]

        print(f"ML artifacts loaded successfully. Model: {model is not None}, Scaler: {scaler is not None}, Features: {len(expected_columns) if expected_columns is not None else 0}")
    except Exception as e:
        print(f"Error loading pickle artifacts: {e}")

# Call immediately on import as well
load_artifacts()

class PatientData(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Age in years")
    sex: str = Field(..., description="'M' for Male, 'F' for Female")
    restingBP: int = Field(..., ge=50, le=250, description="Resting blood pressure in mm Hg")
    cholesterol: int = Field(..., ge=0, le=700, description="Serum cholesterol in mm/dl")
    fastingBS: int = Field(..., ge=0, le=1, description="1 if Fasting Blood Sugar > 120 mg/dl, else 0")
    restingECG: str = Field(..., description="Resting ECG: 'Normal', 'ST', or 'LVH'")
    maxHR: int = Field(..., ge=50, le=230, description="Maximum heart rate achieved")
    exerciseAngina: str = Field(..., description="Exercise induced angina: 'Y' or 'N'")
    oldpeak: float = Field(..., ge=-3.0, le=10.0, description="ST depression induced by exercise relative to rest")
    chestPainType: str = Field(..., description="Chest pain type: 'TA', 'ATA', 'NAP', or 'ASY'")
    stSlope: str = Field(..., description="Slope of peak exercise ST segment: 'Up', 'Flat', or 'Down'")

def transform_input(data: PatientData) -> pd.DataFrame:
    # Extract features into dictionary matching expected_columns
    sex_str = str(data.sex).strip().upper()
    is_male = 1 if sex_str in ['M', 'MALE', '1'] or (sex_str not in ['F', 'FEMALE', '0'] and True) else 0

    angina_str = str(data.exerciseAngina).strip().upper()
    is_exercise_angina = 1 if angina_str in ['Y', 'YES', '1'] else 0

    c_type = str(data.chestPainType).strip().upper()
    c_ata = 1 if c_type in ['ATA', 'ATYPICAL ANGINA'] else 0
    c_nap = 1 if c_type in ['NAP', 'NON-ANGINAL PAIN'] else 0
    c_ta = 1 if c_type in ['TA', 'TYPICAL ANGINA'] else 0

    r_ecg = str(data.restingECG).strip().upper()
    r_normal = 1 if r_ecg in ['NORMAL', 'N'] else 0
    r_st = 1 if r_ecg in ['ST', 'ST-T WAVE ABNORMALITY'] else 0

    s_slope = str(data.stSlope).strip().capitalize()
    s_flat = 1 if s_slope in ['Flat', 'F'] else 0
    s_up = 1 if s_slope in ['Up', 'U'] else 0

    feature_dict = {
        'Age': data.age,
        'isMale': is_male,
        'RestingBP': data.restingBP,
        'Cholesterol': data.cholesterol,
        'FastingBS': data.fastingBS,
        'MaxHR': data.maxHR,
        'isExerciseAngina': is_exercise_angina,
        'Oldpeak': data.oldpeak,
        'ChestPainType_ATA': c_ata,
        'ChestPainType_NAP': c_nap,
        'ChestPainType_TA': c_ta,
        'RestingECG_Normal': r_normal,
        'RestingECG_ST': r_st,
        'ST_Slope_Flat': s_flat,
        'ST_Slope_Up': s_up
    }

    # Ensure column ordering matches expected_columns
    cols = expected_columns if expected_columns else list(feature_dict.keys())
    df = pd.DataFrame([feature_dict])[cols]
    return df

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "features_count": len(expected_columns) if expected_columns else 15
    }

@app.post("/api/predict")
def predict(patient: PatientData):
    # Check if ML artifacts are loaded properly
    if model is None or scaler is None:
        raise HTTPException(
            status_code=500,
            detail="ML model or scaler pickle file is not loaded. Please make sure model.pkl and scaler.pkl exist in ml_service directory."
        )

    try:
        # Preprocess input patient data into DataFrame format
        df = transform_input(patient)
        
        # Scale the features using loaded scaler.pkl
        scaled_df = scaler.transform(df)
        
        # Make prediction using loaded model.pkl
        prediction = int(model.predict(scaled_df)[0])
        
        # Calculate risk probability percentage if supported by model
        if hasattr(model, "predict_proba"):
            prob = float(model.predict_proba(scaled_df)[0][1])
        else:
            prob = float(prediction)

        risk_percentage = round(prob * 100, 2)

        # Classify risk level and provide recommendation
        if risk_percentage >= 70:
            risk_level = "High"
            recommendation = "Immediate consultation with a cardiologist is strongly recommended."
        elif risk_percentage >= 35:
            risk_level = "Moderate"
            recommendation = "Schedule a routine cardiovascular evaluation and review risk factors."
        else:
            risk_level = "Low"
            recommendation = "Maintain healthy lifestyle habits, balanced diet, and regular exercise."

        return {
            "prediction": prediction,
            "hasHeartDisease": prediction == 1,
            "riskPercentage": risk_percentage,
            "riskLevel": risk_level,
            "recommendation": recommendation,
            "patientSummary": {
                "age": patient.age,
                "sex": patient.sex,
                "restingBP": patient.restingBP,
                "cholesterol": patient.cholesterol,
                "maxHR": patient.maxHR,
                "oldpeak": patient.oldpeak
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Machine Learning prediction failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )
