import joblib
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor
import os
from ingest import load_acs_data

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
REGRESSOR_PATH = os.path.join(MODELS_DIR, 'acs_regressor.joblib')

def train_and_save_regressor():
    """
    Trains an XGBoost regressor on ACS data and saves the model.
    """
    print("Loading ACS data...")
    X, y = load_acs_data()

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
    train_and_save_regressor()
