"""
Heart Disease Risk Prediction - Machine Learning Training & Evaluation Pipeline
Usage:
    py train.py                  # Trains and compares LogisticRegression, RandomForest, and GradientBoosting
    py train.py --model rf       # Trains and exports the RandomForest model
    py train.py --model logistic # Trains and exports the LogisticRegression model
    py train.py --data custom.csv # Trains on custom dataset
"""

import os
import argparse
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DATA_PATH = os.path.join(BASE_DIR, "heart.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")
COLUMNS_PATH = os.path.join(BASE_DIR, "columns.pkl")

EXPECTED_COLUMNS = [
    'Age', 'isMale', 'RestingBP', 'Cholesterol', 'FastingBS', 'MaxHR',
    'isExerciseAngina', 'Oldpeak', 'ChestPainType_ATA', 'ChestPainType_NAP',
    'ChestPainType_TA', 'RestingECG_Normal', 'RestingECG_ST', 'ST_Slope_Flat', 'ST_Slope_Up'
]

def preprocess_dataset(df: pd.DataFrame):
    """
    Transforms raw Kaggle/UCI Heart Disease features into the 15-feature schema
    used by the FastAPI microservice and React frontend.
    """
    transformed = pd.DataFrame()
    transformed['Age'] = df['Age']
    transformed['isMale'] = df['Sex'].apply(lambda x: 1 if str(x).strip().upper() in ['M', '1', 'MALE'] else 0)
    transformed['RestingBP'] = df['RestingBP']
    transformed['Cholesterol'] = df['Cholesterol']
    transformed['FastingBS'] = df['FastingBS'].astype(int)
    transformed['MaxHR'] = df['MaxHR']
    transformed['isExerciseAngina'] = df['ExerciseAngina'].apply(lambda x: 1 if str(x).strip().upper() in ['Y', '1', 'YES'] else 0)
    transformed['Oldpeak'] = df['Oldpeak'].astype(float)

    # One-hot encoded categories (with baseline category dropped)
    c_type = df['ChestPainType'].astype(str).str.strip().str.upper()
    transformed['ChestPainType_ATA'] = (c_type.isin(['ATA', 'ATYPICAL ANGINA'])).astype(int)
    transformed['ChestPainType_NAP'] = (c_type.isin(['NAP', 'NON-ANGINAL PAIN'])).astype(int)
    transformed['ChestPainType_TA'] = (c_type.isin(['TA', 'TYPICAL ANGINA'])).astype(int)

    r_ecg = df['RestingECG'].astype(str).str.strip().str.upper()
    transformed['RestingECG_Normal'] = (r_ecg.isin(['NORMAL', 'N'])).astype(int)
    transformed['RestingECG_ST'] = (r_ecg.isin(['ST', 'ST-T WAVE ABNORMALITY'])).astype(int)

    s_slope = df['ST_Slope'].astype(str).str.strip().str.capitalize()
    transformed['ST_Slope_Flat'] = (s_slope.isin(['Flat', 'F'])).astype(int)
    transformed['ST_Slope_Up'] = (s_slope.isin(['Up', 'U'])).astype(int)

    X = transformed[EXPECTED_COLUMNS]
    y = df['HeartDisease'].astype(int)
    return X, y

def evaluate_model(name: str, model, X_test, y_test):
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else y_pred

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    auc = roc_auc_score(y_test, y_prob)
    cm = confusion_matrix(y_test, y_pred)

    print(f"\n==================== {name.upper()} EVALUATION ====================")
    print(f"Test Accuracy:     {acc * 100:.2f}%")
    print(f"Test Precision:    {prec * 100:.2f}%")
    print(f"Test Recall:       {rec * 100:.2f}%  (Sensitivity)")
    print(f"Test F1-Score:     {f1 * 100:.2f}%")
    print(f"Test ROC-AUC:      {auc * 100:.2f}%")
    print(f"Confusion Matrix:  TN={cm[0][0]}, FP={cm[0][1]}, FN={cm[1][0]}, TP={cm[1][1]}")
    return {
        'name': name,
        'model': model,
        'accuracy': acc,
        'precision': prec,
        'recall': rec,
        'f1': f1,
        'roc_auc': auc,
        'cm': cm
    }

def train_pipeline(data_path: str = DEFAULT_DATA_PATH, selected_model: str = "auto"):
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at: {data_path}. Place 'heart.csv' in ml_service/ or provide --data path.")

    print(f"Loading clinical dataset from: {data_path}")
    raw_df = pd.read_csv(data_path)
    print(f"Dataset loaded: {raw_df.shape[0]} rows, {raw_df.shape[1]} columns")

    X, y = preprocess_dataset(raw_df)
    print(f"Target distribution: {int((y == 0).sum())} Normal / Healthy, {int((y == 1).sum())} Heart Disease")

    # 80/20 Stratified Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Split sizes: Train={len(X_train)} samples, Test={len(X_test)} samples")

    # Fit StandardScaler on training data ONLY (prevents data leakage)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Candidate Models
    models = {
        'logistic': LogisticRegression(
            C=1.0,
            solver='lbfgs',
            max_iter=1000,
            random_state=42
        ),
        'rf': RandomForestClassifier(
            n_estimators=200,
            max_depth=6,
            min_samples_split=4,
            random_state=42
        ),
        'gb': GradientBoostingClassifier(
            n_estimators=150,
            learning_rate=0.05,
            max_depth=3,
            random_state=42
        )
    }

    results = {}
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    for key, model in models.items():
        # 5-Fold Cross Validation
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=cv, scoring='accuracy')
        print(f"\nTraining {key.upper()}... 5-Fold CV Accuracy: {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 100:.2f}%)")
        model.fit(X_train_scaled, y_train)
        results[key] = evaluate_model(key, model, X_test_scaled, y_test)

    # Determine which model to export
    if selected_model in models:
        export_key = selected_model
    else:
        # Auto-pick model with highest ROC-AUC or F1
        export_key = max(results.keys(), key=lambda k: results[k]['roc_auc'])

    best = results[export_key]
    print(f"\n>>> Selected Model for Export: {export_key.upper()} (ROC-AUC: {best['roc_auc'] * 100:.2f}%, Accuracy: {best['accuracy'] * 100:.2f}%)")

    # Save artifacts
    joblib.dump(best['model'], MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(EXPECTED_COLUMNS, COLUMNS_PATH)

    print("\nSaved production artifacts:")
    print(f"  - Model:   {MODEL_PATH}")
    print(f"  - Scaler:  {SCALER_PATH}")
    print(f"  - Columns: {COLUMNS_PATH}")
    print("\nTraining completed successfully! The FastAPI microservice can now serve the updated model.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Heart Disease Risk ML Models")
    parser.add_argument("--data", type=str, default=DEFAULT_DATA_PATH, help="Path to heart.csv dataset")
    parser.add_argument("--model", type=str, default="auto", choices=["auto", "logistic", "rf", "gb"], help="Model architecture to export")
    args = parser.parse_args()

    train_pipeline(data_path=args.data, selected_model=args.model)
