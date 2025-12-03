import os
import joblib
import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, log_loss, confusion_matrix
from xgboost import XGBClassifier
from ingest import load_acs_data  # Your data loading function

# Directory to save models
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
MODEL_PATH = os.path.join(MODELS_DIR, 'acs_classifier.joblib')

def compute_fairness_metrics(X, y_true, y_pred, sensitive_feature_column):
    """
    Computes fairness metrics (Demographic Parity, TPR, FPR) by sensitive attribute.
    Assumes positive class is '2' (high income).
    """
    metrics = {}
    sensitive_feature = X[sensitive_feature_column]
    groups = sensitive_feature.unique()
    
    for group in groups:
        idx = sensitive_feature == group
        y_g = y_true[idx]
        y_pred_g = y_pred[idx]

        # Binary: class '2' as positive
        y_true_bin = (y_g == 2).astype(int)
        y_pred_bin = (y_pred_g == 2).astype(int)

        if len(np.unique(y_true_bin)) > 1:
            tn, fp, fn, tp = confusion_matrix(y_true_bin, y_pred_bin, labels=[0,1]).ravel()
        else:
            tn = fp = fn = tp = 0

        dp = y_pred_bin.mean()  # Demographic parity
        tpr = tp / (tp + fn) if (tp + fn) > 0 else np.nan
        fpr = fp / (fp + tn) if (fp + tn) > 0 else np.nan

        metrics[group] = {'Demographic Parity': dp, 'TPR': tpr, 'FPR': fpr}

    # Gaps Male - Female
    gap_dp = metrics.get('Male', {}).get('Demographic Parity', 0) - metrics.get('Female', {}).get('Demographic Parity', 0)
    gap_tpr = metrics.get('Male', {}).get('TPR', 0) - metrics.get('Female', {}).get('TPR', 0)
    gap_fpr = metrics.get('Male', {}).get('FPR', 0) - metrics.get('Female', {}).get('FPR', 0)

    print("\n=== Fairness Metrics by Sex ===")
    for g, m in metrics.items():
        print(f"{g}: Demographic Parity={m['Demographic Parity']:.3f}, TPR={m['TPR']:.3f}, FPR={m['FPR']:.3f}")
    print(f"Gap (Male-Female): DP={gap_dp:.3f}, TPR Gap={gap_tpr:.3f}, FPR Gap={gap_fpr:.3f}\n")

    return metrics

def train_and_save_classifier():
    """
    Train an XGBoost classifier, print metrics, compute fairness metrics, and save the model.
    """
    print("Loading ACS data...")
    X, y = load_acs_data()

    # Define features
    categorical_features = ['SCHL', 'MAR', 'SEX', 'COW', 'OCCP']
    numerical_features = ['AGEP', 'WKHP']

    # Bin target for classification (0=low, 1=mid, 2=high income)
    bins = [0, 25000, 75000, float('inf')]
    labels = [0, 1, 2]
    y_class = pd.cut(y, bins=bins, labels=labels)

    # Preprocessing
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ]
    )

    # XGBClassifier
    model = XGBClassifier(
        n_estimators=250,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        use_label_encoder=False,
        eval_metric='mlogloss'
    )

    pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                               ('classifier', model)])

    print("Training XGBClassifier...")
    pipeline.fit(X, y_class)

    # Predictions and probabilities
    y_pred = pipeline.predict(X)
    y_proba = pipeline.predict_proba(X)

    # Standard metrics
    accuracy = accuracy_score(y_class, y_pred)
    f1 = f1_score(y_class, y_pred, average='weighted')
    roc_auc = roc_auc_score(pd.get_dummies(y_class), y_proba, average='weighted', multi_class='ovr')
    logloss = log_loss(y_class, y_proba)

    print("\n=== Standard Classification Metrics ===")
    print(f"Accuracy: {accuracy*100:.1f}%")
    print(f"F1 Score: {f1:.2f}")
    print(f"ROC-AUC: {roc_auc:.2f}")
    print(f"Log Loss: {logloss:.2f}")

    # Compute fairness metrics by sex
    compute_fairness_metrics(X, y_class, y_pred, sensitive_feature_column='SEX')

    # Save model
    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH} successfully.")

if __name__ == "__main__":
    train_and_save_classifier()
