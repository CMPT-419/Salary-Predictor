from pydantic import BaseModel
from typing import Dict

class UserProfile(BaseModel):
    age: int
    education_level: str
    major: str
    work_class: str
    marital_status: str
    race: str
    sex: str
    native_country: str

class RegressionResponse(BaseModel):
    predicted_salary: float

class ClassificationResponse(BaseModel):
    salary_class: str
    confidence: float
    fairness_score: float
    explanation: Dict