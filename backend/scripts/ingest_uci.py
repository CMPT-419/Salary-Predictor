# backend/main.py
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from ucimlrepo import fetch_ucirepo
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier
from fastapi.middleware.cors import CORSMiddleware


# ----------------------------
# Load dataset & train model
# ----------------------------
def load_adult_data():
    adult = fetch_ucirepo(id=2)
    X = adult.data.features
    y = adult.data.targets.iloc[:, 0]
    # Clean target labels
    y = y.str.strip().str.replace(r"\.", "", regex=True)
    y = y.map({'<=50K': 0, '>50K': 1})
    return X, y

def train_model():
    X, y = load_adult_data()
    categorical_cols = X.select_dtypes(include=["object"]).columns
    
    preprocessor = ColumnTransformer(
        transformers=[("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)],
        remainder="passthrough"
    )

    model = XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric="logloss"
    )

    clf = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])

    clf.fit(X, y)
    return clf, X.columns

clf, feature_columns = train_model()


# ----------------------------
# Random BS function to make the graph
# ----------------------------
def generate_growth_curve(prediction: int, base_salary: float = None, years: int = 10):
    """
    Generate projected salary over 'years' years.
    - prediction: 0 (<=50K) or 1 (>50K)
    - base_salary: optional starting salary
    """
    import random

    # Default starting salary based on predicted class
    if base_salary is None:
        base_salary = 40000 if prediction == 0 else 70000

    growth_curve = []
    current_salary = base_salary

    for year in range(1, years + 1):
        # Random growth between 3% and 7% per year
        growth_rate = random.uniform(0.03, 0.07)
        current_salary *= 1 + growth_rate
        growth_curve.append({
            "years": year,
            "salary": round(current_salary, 2)
        })

    return growth_curve



# ----------------------------
# FastAPI App
# ----------------------------
app = FastAPI(title="Adult Salary Predictor API")


# Allow requests from your frontend
origins = [
    "http://localhost:5173",  # API WON'T WORK UNLESS THIS MATCHES THE URL OF THE FAIRML PREDICTOR WEBPAGE
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # allow GET, POST, OPTIONS, etc.
    allow_headers=["*"],
)

# Pydantic model to validate input
class Person(BaseModel):
    age: int
    workclass: str
    fnlwgt: int
    education: str
    education_num: int
    marital_status: str
    occupation: str
    relationship: str
    race: str
    sex: str
    capital_gain: int
    capital_loss: int
    hours_per_week: int
    native_country: str

@app.post("/predict")
def predict_salary(person: Person):
    # Convert input to DataFrame
    print("Received:", person.dict())
    custom_df = pd.DataFrame([person.dict()])

    # Ensure columns match original dataset names
    custom_df.rename(columns={
        "education_num": "education-num",
        "marital_status": "marital-status",
        "capital_gain": "capital-gain",
        "capital_loss": "capital-loss",
        "hours_per_week": "hours-per-week",
        "native_country": "native-country"
    }, inplace=True)

    # Predict class and probability
    prediction = clf.predict(custom_df)[0]  # 0 or 1
    proba = clf.predict_proba(custom_df)[0]  # [prob_class_0, prob_class_1]
    # Get probability corresponding to the predicted class
    probability = float(proba[prediction])

    # Generate growth curve
    growth_curve__data = generate_growth_curve(prediction)

    return {
        "prediction": ">50K" if prediction == 1 else "<=50K",
        "probability": float(probability),
        "growth_curve_data": growth_curve_data
    }