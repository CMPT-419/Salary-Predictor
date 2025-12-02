from pydantic import BaseModel
from typing import Dict

class UserProfile(BaseModel):
    age: int
    education_level: str
    work_class: str
    marital_status: str
    sex: str
    hours_per_week: int
    occupation_category: str
    race: str # Added back for fairness analysis

class SalaryRangeResponse(BaseModel):
    lower_bound: float
    median: float
    upper_bound: float

class FairnessAnalysisResponse(BaseModel):
    original_prediction: float
    gender_counterfactual: float
    race_counterfactual: float
    gender_gap_percent: float
    race_gap_percent: float

class ClassificationResponse(BaseModel):
    salary_class: str
    confidence: float
    fairness_score: float
    explanation: Dict
