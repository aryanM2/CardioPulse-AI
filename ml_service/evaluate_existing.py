import os
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix, classification_report

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")
COLUMNS_PATH = os.path.join(BASE_DIR, "columns.pkl")
DATA_PATH = os.path.join(BASE_DIR, "heart.csv")

FEATURE_STATS = {
    'Age': (53.510893, 9.432617),
    'RestingBP': (132.396514, 18.514154),
    'Cholesterol': (198.799564, 109.384145),
    'MaxHR': (136.809368, 25.460334),
    'Oldpeak': (0.887364, 1.066570)
}

def evaluate():
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    expected_cols = joblib.load(COLUMNS_PATH)
    df = pd.read_csv(DATA_PATH)

    print("=== EVALUATION OF CURRENT MODEL.PKL ===")
    print("Dataset records:", len(df))

    # Apply the same composite scaler adjustment that main.py applies at runtime
    if hasattr(scaler, 'mean_') and expected_cols:
        idx_age = expected_cols.index('Age') if 'Age' in expected_cols else -1
        if idx_age != -1 and abs(scaler.mean_[idx_age]) < 1.0:
            for name, (m, s) in FEATURE_STATS.items():
                if name in expected_cols:
                    idx = expected_cols.index(name)
                    scaler.mean_[idx] = m + scaler.mean_[idx] * s
                    scaler.scale_[idx] = s * scaler.scale_[idx]

    # Preprocessing to 15 features matching main.py
    transformed = pd.DataFrame()
    transformed['Age'] = df['Age']
    transformed['isMale'] = df['Sex'].apply(lambda x: 1 if str(x).upper() in ['M', '1'] else 0)
    transformed['RestingBP'] = df['RestingBP']
    transformed['Cholesterol'] = df['Cholesterol']
    transformed['FastingBS'] = df['FastingBS']
    transformed['MaxHR'] = df['MaxHR']
    transformed['isExerciseAngina'] = df['ExerciseAngina'].apply(lambda x: 1 if str(x).upper() in ['Y', '1'] else 0)
    transformed['Oldpeak'] = df['Oldpeak']

    # Dummy features
    transformed['ChestPainType_ATA'] = (df['ChestPainType'] == 'ATA').astype(int)
    transformed['ChestPainType_NAP'] = (df['ChestPainType'] == 'NAP').astype(int)
    transformed['ChestPainType_TA'] = (df['ChestPainType'] == 'TA').astype(int)
    transformed['RestingECG_Normal'] = (df['RestingECG'] == 'Normal').astype(int)
    transformed['RestingECG_ST'] = (df['RestingECG'] == 'ST').astype(int)
    transformed['ST_Slope_Flat'] = (df['ST_Slope'] == 'Flat').astype(int)
    transformed['ST_Slope_Up'] = (df['ST_Slope'] == 'Up').astype(int)

    X = transformed[expected_cols]
    y_true = df['HeartDisease']

    X_scaled = scaler.transform(X)
    y_pred = model.predict(X_scaled)
    y_prob = model.predict_proba(X_scaled)[:, 1] if hasattr(model, 'predict_proba') else y_pred

    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred)
    rec = recall_score(y_true, y_pred)
    f1 = f1_score(y_true, y_pred)
    roc = roc_auc_score(y_true, y_prob)
    cm = confusion_matrix(y_true, y_pred)

    print(f"Accuracy:  {acc * 100:.2f}%")
    print(f"Precision: {prec * 100:.2f}%")
    print(f"Recall:    {rec * 100:.2f}%")
    print(f"F1-Score:  {f1 * 100:.2f}%")
    print(f"ROC-AUC:   {roc * 100:.2f}%")
    print("\nConfusion Matrix (Rows: Actual [0, 1], Cols: Predicted [0, 1]):")
    print(cm)
    print("\nClassification Report:")
    print(classification_report(y_true, y_pred, target_names=["Healthy (0)", "Heart Disease (1)"]))

if __name__ == "__main__":
    evaluate()

