import sys
import os
import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Add the project root to the Python path to allow for absolute imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from .schemas import UserProfile, SalaryRangeResponse, FairnessAnalysisResponse
from mappings import map_education, map_occupation


app = FastAPI()

# --- CORS Configuration ---
origins = ["http://localhost:5173", "http://localhost:5174"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Model Loading ---
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
LOW_REGRESSOR_PATH = os.path.join(MODELS_DIR, 'acs_low.joblib')
MID_REGRESSOR_PATH = os.path.join(MODELS_DIR, 'acs_mid.joblib')
HIGH_REGRESSOR_PATH = os.path.join(MODELS_DIR, 'acs_high.joblib')

try:
    low_reg_pipeline = joblib.load(LOW_REGRESSOR_PATH)
    mid_reg_pipeline = joblib.load(MID_REGRESSOR_PATH)
    high_reg_pipeline = joblib.load(HIGH_REGRESSOR_PATH)
    print("Salary range prediction models loaded successfully.")
except FileNotFoundError:
    low_reg_pipeline = mid_reg_pipeline = high_reg_pipeline = None
    print("Warning: Salary range prediction models not found. Please train them first.")

def prepare_input_df(user_profile: UserProfile) -> pd.DataFrame:
    """Prepares the input DataFrame for prediction from a UserProfile."""
    input_data = {
        'AGEP': user_profile.age,
        'SCHL': user_profile.education_level,
        'MAR': user_profile.marital_status,
        'SEX': user_profile.sex,
        'OCCP': user_profile.occupation_category,
        'WKHP': user_profile.hours_per_week,
        'COW': user_profile.work_class,
        'RAC1P': user_profile.race
    }
    return pd.DataFrame([input_data])

@app.post("/predict_salary_range", response_model=SalaryRangeResponse)
async def predict_salary_range(user_profile: UserProfile):
    if not mid_reg_pipeline:
        raise HTTPException(status_code=503, detail="Models are not loaded.")
    
    input_df = prepare_input_df(user_profile)
    
    lower_bound = low_reg_pipeline.predict(input_df)[0]
    median = mid_reg_pipeline.predict(input_df)[0]
    upper_bound = high_reg_pipeline.predict(input_df)[0]

    return SalaryRangeResponse(
        lower_bound=float(lower_bound),
        median=float(median),
        upper_bound=float(upper_bound)
    )

@app.post("/analyze_fairness", response_model=FairnessAnalysisResponse)
async def analyze_fairness(user_profile: UserProfile):
    if not mid_reg_pipeline:
        raise HTTPException(status_code=503, detail="Models are not loaded.")

    # 1. Original Prediction
    original_df = prepare_input_df(user_profile)
    original_prediction = mid_reg_pipeline.predict(original_df)[0]

    # 2. Gender Counterfactual
    gender_swapped_profile = user_profile.copy()
    gender_swapped_profile.sex = "Female" if user_profile.sex == "Male" else "Male"
    gender_df = prepare_input_df(gender_swapped_profile)
    gender_counterfactual = mid_reg_pipeline.predict(gender_df)[0]
    
    # 3. Race Counterfactual
    # Simple swap: If White, change to Black. Otherwise, change to White.
    race_swapped_profile = user_profile.copy()
    race_swapped_profile.race = "Black" if user_profile.race == "White" else "White"
    race_df = prepare_input_df(race_swapped_profile)
    race_counterfactual = mid_reg_pipeline.predict(race_df)[0]

    # 4. Calculate Gaps
    gender_gap = ((gender_counterfactual - original_prediction) / original_prediction) * 100
    race_gap = ((race_counterfactual - original_prediction) / original_prediction) * 100

    return FairnessAnalysisResponse(
        original_prediction=float(original_prediction),
        gender_counterfactual=float(gender_counterfactual),
        race_counterfactual=float(race_counterfactual),
        gender_gap_percent=round(gender_gap, 2),
        race_gap_percent=round(race_gap, 2)
    )
