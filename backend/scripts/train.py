import pandas as pd
import joblib
from ucimlrepo import fetch_ucirepo
from folktables import ACSDataSource, ACSIncome
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier, XGBRegressor
import os

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
CLASSIFIER_PATH = os.path.join(MODELS_DIR, 'uci_classifier.joblib')
REGRESSOR_PATH = os.path.join(MODELS_DIR, 'acs_regressor.joblib')

def load_adult_data():
    adult = fetch_ucirepo(id=2)
    X = adult.data.features
    y = adult.data.targets.iloc[:, 0]
    y = y.str.strip().str.replace(r"\.", "", regex=True)
    y = y.map({'<=50K': 0, '>50K': 1})
    return X, y

def train_and_save_classifier():
    print("Fetching UCI Adult data...")
    X, y = load_adult_data()
    
    print("Preprocessing data for classification...")
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

    clf_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])

    print("Training the classification model...")
    clf_pipeline.fit(X, y)

    print(f"Saving the classifier pipeline to {CLASSIFIER_PATH}...")
    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(clf_pipeline, CLASSIFIER_PATH)
    print("Classifier saved successfully.")

def train_and_save_regressor():
    print("\nFetching ACS data for regression...")
    data_source = ACSDataSource(survey_year='2018', horizon='1-Year', survey='person')
    ca_data = data_source.get_data(states=['CA'], download=True)
    features, labels, _ = ACSIncome.df_to_pandas(ca_data)

    y = features['PINCP']
    X = features.drop(columns=['PINCP'])

    positive_income_mask = y > 0
    X = X[positive_income_mask]
    y = y[positive_income_mask]

    feature_cols = ['AGEP', 'SCHL', 'MAR', 'RAC1P', 'SEX', 'NATIVITY', 'OCCP']
    X = X[feature_cols]

    print("Preprocessing data for regression...")
    categorical_cols = X.select_dtypes(include=["object", "category"]).columns
    numerical_cols = X.select_dtypes(include=["number"]).columns

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numerical_cols),
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
        ],
        remainder="passthrough"
    )

    model = XGBRegressor(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        objective='reg:squarederror'
    )

    reg_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])

    print("Training the regression model...")
    reg_pipeline.fit(X, y)

    print(f"Saving the regressor pipeline to {REGRESSOR_PATH}...")
    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(reg_pipeline, REGRESSOR_PATH)
    print("Regressor saved successfully.")

if __name__ == "__main__":
    print("--- Starting Model Training and Artifact Creation ---")
    train_and_save_classifier()
    train_and_save_regressor()
    print("\n--- All tasks complete. Model artifacts are saved in the backend/models directory. ---")

