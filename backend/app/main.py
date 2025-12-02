from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import UserProfile, SalaryRangeResponse, ClassificationResponse
import joblib
import pandas as pd
import os

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
LOW_REGRESSOR_PATH = os.path.join(MODELS_DIR, 'acs_low.joblib')
MID_REGRESSOR_PATH = os.path.join(MODELS_DIR, 'acs_mid.joblib')
HIGH_REGRESSOR_PATH = os.path.join(MODELS_DIR, 'acs_high.joblib')

clf_pipeline = joblib.load(CLASSIFIER_PATH)
low_reg_pipeline = joblib.load(LOW_REGRESSOR_PATH)
mid_reg_pipeline = joblib.load(MID_REGRESSOR_PATH)
high_reg_pipeline = joblib.load(HIGH_REGRESSOR_PATH)

# Mappings (should be consistent with training)
EDUCATION_MAP = {
    'Bachelors': 21, 'HS-grad': 16, 'Masters': 22, 'Doctorate': 24,
    'Some-college': 19, 'Associate': 20, 'Prof-school': 23,
    '10th': 6, '11th': 7, '12th': 8, '9th': 5, '7th-8th': 4,
    '5th-6th': 3, '1st-4th': 2, 'Preschool': 1
}
MARITAL_MAP = {'Married-civ-spouse': 1, 'Never-married': 5, 'Divorced': 3, 'Separated': 4, 'Widowed': 2}
SEX_MAP = {'Male': 1, 'Female': 2}
MAJOR_TO_OCCP_PLACEHOLDER = {"Computer Science": 1021, "Engineering": 1721, "Business": 1110, "Other": 4760}
WORK_CLASS_TO_COW_MAP = {"Private": 1, "Self-emp-not-inc": 2, "Local-gov": 4, "State-gov": 5, "Federal-gov": 6, "Self-emp-inc": 3}


@app.post("/predict_salary_range", response_model=SalaryRangeResponse)
async def predict_salary_range(user_profile: UserProfile):
    """
    Accepts user profile data and returns a predicted salary range.
    """
    print("Received user profile for salary range prediction:", user_profile.dict())

    # Prepare input for the regression models
    input_data = {
        'AGEP': user_profile.age,
        'SCHL': EDUCATION_MAP.get(user_profile.education_level, 16),
        'MAR': MARITAL_MAP.get(user_profile.marital_status, 5),
        'SEX': SEX_MAP.get(user_profile.sex, 2),
        'OCCP': MAJOR_TO_OCCP_PLACEHOLDER.get(user_profile.major, 4760),
        'WKHP': 40, # Assuming a standard 40-hour work week
        'COW': WORK_CLASS_TO_COW_MAP.get(user_profile.work_class, 1)
    }
    input_df = pd.DataFrame([input_data])

    # Ensure categorical columns are strings to match training data
    categorical_features = ['SCHL', 'MAR', 'SEX', 'OCCP', 'COW']
    for col in categorical_features:
        input_df[col] = input_df[col].astype(str)
    
    # Predict with each model
    lower_bound = low_reg_pipeline.predict(input_df)[0]
    median = mid_reg_pipeline.predict(input_df)[0]
    upper_bound = high_reg_pipeline.predict(input_df)[0]

    return SalaryRangeResponse(
        lower_bound=float(lower_bound),
        median=float(median),
        upper_bound=float(upper_bound)
    )

@app.post("/predict", response_model=ClassificationResponse)
async def predict_class(user_profile: UserProfile):
    """
    Accepts user profile data and returns a salary class prediction using the UCI-based classifier.
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

    prediction = clf_pipeline.predict(input_df)[0]
    proba = clf_pipeline.predict_proba(input_df)[0]
    confidence = proba[prediction]

    return ClassificationResponse(
        salary_class=">50k" if prediction == 1 else "<=50k",
        confidence=float(confidence),
        fairness_score=0.9, # Placeholder
        explanation={"age": 0.3, "education_level": 0.5, "major": 0.2} # Placeholder
    )