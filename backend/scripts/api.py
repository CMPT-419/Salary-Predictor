from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class UserInput(BaseModel): ## All the user inputs for now; can change later
    age: int
    education: str
    major: str
    workclass: str
    maritalStatus: str
    relationship: str
    race: str
    nativeCountry: str
    gender: str


@app.post("/predict")
def predict_salary(data: UserInput):

    salary_prob = round(random.uniform(0.2, 0.9), 3)
    growth_curve_data = [
        {"years": i * 2, "salary": 50000 + (i * 3500) + random.randint(0, 5000)} ##Mock model for now; can change later
        for i in range(11)
    ]

    influence_scores = [
        {"feature": "Education", "impact": 0.45},
        {"feature": "Age", "impact": 0.22},
        {"feature": "Workclass", "impact": 0.15},
        {"feature": "Major", "impact": 0.30},
        {"feature": "Gender", "impact": 0.10}
    ]

    return {
        "salary_prob": salary_prob,
        "growth_curve_data": growth_curve_data,
        "influence_scores": influence_scores,
    }