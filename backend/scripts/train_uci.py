import joblib
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier
import os
from ingest import load_uci_data

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
CLASSIFIER_PATH = os.path.join(MODELS_DIR, 'uci_classifier.joblib')

def train_and_save_classifier():
    """
    Trains an XGBoost classifier on UCI data and saves the model.
    """
    print("Loading UCI Adult data...")
    X, y = load_uci_data()
    
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

if __name__ == "__main__":
    train_and_save_classifier()
