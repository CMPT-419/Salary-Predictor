from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import UserProfile, RegressionResponse, ClassificationResponse
import joblib
import pandas as pd
import os
import numpy as np

app = FastAPI()

# --- CORS Configuration ---
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Model Loading ---
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
CLASSIFIER_PATH = os.path.join(MODELS_DIR, 'uci_classifier.joblib')
REGRESSOR_PATH = os.path.join(MODELS_DIR, 'acs_regressor.joblib')

clf_pipeline = joblib.load(CLASSIFIER_PATH)
reg_pipeline = joblib.load(REGRESSOR_PATH)

# --- Mappings and Placeholders ---
# Mapping from UserProfile.education_level to ACS 'SCHL' codes
# This is a simplified mapping. A more comprehensive one would be needed for production.
EDUCATION_MAP = {
    'Bachelors': 21,
    'HS-grad': 16,
    'Masters': 22,
    'Doctorate': 24,
    'Some-college': 19,
    'Associate': 20
    # Add other levels as needed
}

# Mapping from UserProfile.marital_status to ACS 'MAR' codes
MARITAL_MAP = {
    'Never-married': 5,
    'Married-civ-spouse': 1,
    'Divorced': 3,
    # Add other statuses
}

# Placeholder for major -> occupation mapping.
# In a real scenario, this would be a more sophisticated mapping.
MAJOR_TO_OCCP_PLACEHOLDER = {
    "Computer Science": 1021,  # Computer Scientist
    "Engineering": 1721,      # Engineer
    "Business": 1110,         # Business Manager
    # ... and so on
}


@app.post("/predict", response_model=ClassificationResponse)
async def predict_class(user_profile: UserProfile):
    """
    Accepts user profile data and returns a salary *class* prediction using the UCI-based classifier.
    """
    print("Received user profile for classification:", user_profile.dict())

    df_data = {
        "age": user_profile.age,
        "workclass": user_profile.work_class,
        "education": user_profile.education_level,
        "marital-status": user_profile.marital_status,
        "race": user_profile.race,
        "sex": user_profile.sex,
        "native-country": user_profile.native_country,
        "occupation": user_profile.major,
        "fnlwgt": 1,
        "education-num": EDUCATION_MAP.get(user_profile.education_level, 16),
        "relationship": "Not-in-family",
        "capital-gain": 0,
        "capital-loss": 0,
        "hours-per-week": 40
    }
    input_df = pd.DataFrame([df_data])

    prediction_proba = clf_pipeline.predict_proba(input_df)
    prediction = clf_pipeline.predict(input_df)
    confidence = prediction_proba[0][prediction[0]]
    salary_class = "<=50k" if prediction[0] == 0 else ">50k"

    return ClassificationResponse(
        salary_class=salary_class,
        confidence=float(confidence),
        fairness_score=0.92,  # Placeholder
        explanation={"age": 0.3, "education_level": 0.5, "major": 0.2}  # Placeholder
    )


@app.post("/predict_salary", response_model=RegressionResponse)
async def predict_salary(user_profile: UserProfile):
    """
    Accepts user profile data and returns a numerical salary prediction using the ACS-based regressor.
    """
    print("Received user profile for regression:", user_profile.dict())

    # Prepare input for the regression model based on ACS features
    reg_input_data = {
        'AGEP': user_profile.age,
        'SCHL': EDUCATION_MAP.get(user_profile.education_level, 16),  # Default to HS-grad
        'MAR': MARITAL_MAP.get(user_profile.marital_status, 5),      # Default to Never-married
        'RAC1P': 1 if user_profile.race == 'White' else 2, # Simplified: 1 for White, 2 for others
        'SEX': 1 if user_profile.sex == 'Male' else 2,
        'NATIVITY': 1 if user_profile.native_country == 'United-States' else 2, # Simplified
        'OCCP': MAJOR_TO_OCCP_PLACEHOLDER.get(user_profile.major, 1021) # Default to Computer Scientist
    }
    input_df = pd.DataFrame([reg_input_data])
    
    # Ensure all required columns from training are present
    # The regressor was trained on ['AGEP', 'SCHL', 'MAR', 'RAC1P', 'SEX', 'NATIVITY', 'OCCP']
    
    predicted_salary = reg_pipeline.predict(input_df)

    # Ensure prediction is a standard float, not a numpy type
    salary_float = float(predicted_salary[0])

    return RegressionResponse(predicted_salary=salary_float)