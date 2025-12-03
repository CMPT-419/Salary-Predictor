import joblib
import os
from ingest import load_uci_data
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, log_loss
from xgboost import XGBClassifier
from sklearn.metrics import confusion_matrix


MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
CLASSIFIER_PATH = os.path.join(MODELS_DIR, 'uci_classifier.joblib')

def train_and_evaluate_classifier():
    # Load data
    print("Loading UCI Adult data...")
    X, y = load_uci_data()
    
    # Split into train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Identify categorical columns
    categorical_cols = X.select_dtypes(include=["object"]).columns
    
    # Preprocessor
    preprocessor = ColumnTransformer(
        transformers=[("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)],
        remainder="passthrough"
    )
    
    # Model
    model = XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric="logloss",
        use_label_encoder=False
    )
    
    # Pipeline
    clf_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])
    
    # Train
    print("Training the classification model...")
    clf_pipeline.fit(X_train, y_train)
    
    # Predict
    y_pred = clf_pipeline.predict(X_test)
    y_pred_proba = clf_pipeline.predict_proba(X_test)[:, 1]  # probability for positive class
    
    # Metrics
    acc = accuracy_score(y_test, y_pred) * 100
    f1 = f1_score(y_test, y_pred)
    roc = roc_auc_score(y_test, y_pred_proba)
    ll = log_loss(y_test, y_pred_proba)
    
    print(f"Accuracy: {acc:.1f}%")
    print(f"F1 Score: {f1:.2f}")
    print(f"ROC-AUC: {roc:.2f}")
    print(f"Log Loss: {ll:.2f}")
    
    # Save model
    print(f"Saving the classifier pipeline to {CLASSIFIER_PATH}...")
    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(clf_pipeline, CLASSIFIER_PATH)
    print("Classifier saved successfully.")

    fairness_metrics(clf_pipeline, X_test, y_test, sensitive_col="race")



def fairness_metrics(clf_pipeline, X_test, y_test, sensitive_col="race"):
    """
    Computes demographic parity, TPR, and FPR for white vs non-white groups.
    """
    # Predict labels and probabilities
    y_pred = clf_pipeline.predict(X_test)
    
    # Extract the sensitive attribute
    race = X_test[sensitive_col]
    
    # Define groups
    white_mask = race == "White"
    non_white_mask = ~white_mask
    
    # Demographic Parity (selection rate)
    dp_white = y_pred[white_mask].mean()
    dp_non_white = y_pred[non_white_mask].mean()
    
    # Confusion matrices
    tn_w, fp_w, fn_w, tp_w = confusion_matrix(y_test[white_mask], y_pred[white_mask]).ravel()
    tn_nw, fp_nw, fn_nw, tp_nw = confusion_matrix(y_test[non_white_mask], y_pred[non_white_mask]).ravel()
    
    # True Positive Rate (Recall)
    tpr_white = tp_w / (tp_w + fn_w) if (tp_w + fn_w) > 0 else 0
    tpr_non_white = tp_nw / (tp_nw + fn_nw) if (tp_nw + fn_nw) > 0 else 0
    
    # False Positive Rate
    fpr_white = fp_w / (fp_w + tn_w) if (fp_w + tn_w) > 0 else 0
    fpr_non_white = fp_nw / (fp_nw + tn_nw) if (fp_nw + tn_nw) > 0 else 0
    
    # Print results
    print("=== Fairness Metrics ===")
    print(f"Demographic Parity: White={dp_white:.3f}, Non-White={dp_non_white:.3f}")
    print(f"TPR (Recall): White={tpr_white:.3f}, Non-White={tpr_non_white:.3f}")
    print(f"FPR: White={fpr_white:.3f}, Non-White={fpr_non_white:.3f}")

# Example usage

if __name__ == "__main__":
    train_and_evaluate_classifier()
