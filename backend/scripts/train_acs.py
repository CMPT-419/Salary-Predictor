import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor
import os
from ingest import load_acs_data

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
LOW_MODEL_PATH = os.path.join(MODELS_DIR, 'acs_low.joblib')
MID_MODEL_PATH = os.path.join(MODELS_DIR, 'acs_mid.joblib')
HIGH_MODEL_PATH = os.path.join(MODELS_DIR, 'acs_high.joblib')

def train_and_save_quantile_regressors():
    """
    Trains and saves three XGBoost quantile regressors for the 10th, 50th, and 90th percentiles.
    """
    print("Loading ACS data for quantile regression...")
    X, y = load_acs_data()

    # Define categorical and numerical features
    categorical_features = ['SCHL', 'MAR', 'SEX', 'OCCP', 'COW']
    numerical_features = ['AGEP', 'WKHP']

    # Create the preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])

    # Quantiles to predict
    quantiles = [0.1, 0.5, 0.9]
    model_paths = [LOW_MODEL_PATH, MID_MODEL_PATH, HIGH_MODEL_PATH]

    for quantile, path in zip(quantiles, model_paths):
        print(f"Training model for quantile: {quantile}")

        # Define the XGBoost model for quantile regression
        # Note: XGBoost's native quantile regression is used by setting the objective
        model = XGBRegressor(
            objective='reg:quantileerror',
            quantile_alpha=quantile,
            n_estimators=100,  # Reduced for quicker training, can be tuned
            max_depth=5,
            learning_rate=0.1,
            subsample=0.7,
            colsample_bytree=0.7,
            random_state=42,
            n_jobs=-1
        )

        # Create the full pipeline
        pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                                   ('regressor', model)])

        # Train the model
        pipeline.fit(X, y)

        # Save the model
        print(f"Saving model to {path}...")
        os.makedirs(MODELS_DIR, exist_ok=True)
        joblib.dump(pipeline, path)
        print("Model saved successfully.")

if __name__ == "__main__":
    train_and_save_quantile_regressors()