# import pandas as pd
# import numpy as np
# import joblib
# import os


# from sklearn.linear_model import LinearRegression
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import LabelEncoder
# from sklearn.metrics import r2_score, mean_absolute_error


# # ── Load dataset ────────────────────────────────
# DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "crop_production.csv")

# df = pd.read_csv(DATA_PATH)

# print("Shape:", df.shape)
# print("\nColumns:", df.columns.tolist())
# print("\nFirst 5 rows:")
# print(df.head())
# print("\nMissing values:")
# print(df.isnull().sum())



# # ── Clean & engineer target variable ─────────────

# # Drop rows where Production or Area is missing
# df = df.dropna(subset=["Production", "Area"])

# # Remove rows where Area is zero (can't divide by zero)
# df = df[df["Area"] > 0]

# # Create Yield = Production / Area (kg per hectare)
# df["Yield"] = df["Production"] / df["Area"]

# # Remove extreme outliers — top 1% of yield values
# # (data entry errors produce impossibly high numbers)
# upper = df["Yield"].quantile(0.99)
# df = df[df["Yield"] < upper]

# # Keep only columns we need
# df = df[["State_Name", "Season", "Crop", "Area", "Yield"]]

# print(f"\nAfter cleaning: {df.shape[0]} rows")
# print(df.describe())






# # ── Encode text columns ──────────────────────────

# # Clean whitespace from text columns first
# for col in ["State_Name", "Season", "Crop"]:
#     df[col] = df[col].str.strip()

# # Create one LabelEncoder per categorical column
# encoders = {}

# for col in ["State_Name", "Season", "Crop"]:
#     le = LabelEncoder()
#     df[col] = le.fit_transform(df[col])
#     encoders[col] = le   # save it for later

# # Print what the encoding looks like
# print("\nSample encoded data:")
# print(df.head())

# # Show the mappings so you understand what happened
# print("\nCrop encoding sample:")
# crop_le = encoders["Crop"]
# for i, name in enumerate(crop_le.classes_[:5]):
#     print(f"  {name} → {i}")





# # ── Prepare features & target ────────────────────
# FEATURES = ["State_Name", "Season", "Crop", "Area"]
# TARGET   = "Yield"

# X = df[FEATURES]
# y = df[TARGET]

# # ── Split 80% train / 20% test ───────────────────
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y,
#     test_size=0.2,
#     random_state=42
# )

# # ── Train the model ──────────────────────────────
# model = LinearRegression()
# model.fit(X_train, y_train)

# # ── Evaluate ─────────────────────────────────────
# y_pred = model.predict(X_test)

# r2  = r2_score(y_test, y_pred)
# mae = mean_absolute_error(y_test, y_pred)

# print(f"\nModel Performance:")
# print(f"  R² Score : {r2:.4f}")
# print(f"  MAE      : {mae:.2f} kg/ha")








# # ── Save model & encoders ────────────────────────
# MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
# os.makedirs(MODEL_DIR, exist_ok=True)

# # Save the trained Linear Regression model
# joblib.dump(model, os.path.join(MODEL_DIR, "model.pkl"))

# # Save all three encoders in one file
# joblib.dump(encoders, os.path.join(MODEL_DIR, "encoders.pkl"))

# # Save the feature list — FastAPI needs to know column order
# joblib.dump(FEATURES, os.path.join(MODEL_DIR, "features.pkl"))

# print("\nSaved:")
# print(f"  model/model.pkl")
# print(f"  model/encoders.pkl")
# print(f"  model/features.pkl")
# print("\nTraining complete.")







# import pandas as pd
# import numpy as np
# import joblib
# import os

# from sklearn.linear_model import LinearRegression
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import LabelEncoder
# from sklearn.metrics import r2_score, mean_absolute_error

# # ── Paths ─────────────────────────────────────────
# BASE     = os.path.dirname(__file__)
# DATA_PATH = os.path.join(BASE, "data", "crop_production.csv")
# MODEL_DIR = os.path.join(BASE, "model")

# # ── Load ──────────────────────────────────────────
# df = pd.read_csv(DATA_PATH)
# print("Loaded:", df.shape)
# print("Columns:", df.columns.tolist())
# print("Missing:\n", df.isnull().sum())

# # ── Clean ─────────────────────────────────────────
# df = df.dropna(subset=["Production", "Area"])
# df = df[df["Area"] > 0]
# df["Yield"] = df["Production"] / df["Area"]




# # Add this right after df["Yield"] = df["Production"] / df["Area"]
# print("\n── Yield distribution ──")
# print(df["Yield"].describe())
# print("\nTop 10 highest yield rows:")
# print(df.nlargest(10, "Yield")[["Crop", "State_Name", "Area", "Production", "Yield"]])
# print("\nYield percentiles:")
# for p in [50, 75, 90, 95, 99, 99.9]:
#     val = df["Yield"].quantile(p / 100)
#     print(f"  {p}th percentile: {val:.1f} kg/ha")







# upper = df["Yield"].quantile(0.99)
# df = df[df["Yield"] < upper]
# df = df[["State_Name", "Season", "Crop", "Area", "Yield"]]
# print(f"\nAfter cleaning: {df.shape[0]} rows")

# # ── Encode ────────────────────────────────────────
# for col in ["State_Name", "Season", "Crop"]:
#     df[col] = df[col].str.strip()

# encoders = {}
# for col in ["State_Name", "Season", "Crop"]:
#     le = LabelEncoder()
#     df[col] = le.fit_transform(df[col])
#     encoders[col] = le

# # ── Train ─────────────────────────────────────────
# FEATURES = ["State_Name", "Season", "Crop", "Area"]
# TARGET   = "Yield"

# X = df[FEATURES]
# y = df[TARGET]

# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42
# )

# model = LinearRegression()
# model.fit(X_train, y_train)

# y_pred = model.predict(X_test)
# r2  = r2_score(y_test, y_pred)
# mae = mean_absolute_error(y_test, y_pred)

# print(f"\nR² Score : {r2:.4f}")
# print(f"MAE      : {mae:.2f} kg/ha")

# # ── Save ──────────────────────────────────────────
# os.makedirs(MODEL_DIR, exist_ok=True)
# joblib.dump(model,    os.path.join(MODEL_DIR, "model.pkl"))
# joblib.dump(encoders, os.path.join(MODEL_DIR, "encoders.pkl"))
# joblib.dump(FEATURES, os.path.join(MODEL_DIR, "features.pkl"))
# print("\nAll files saved to backend/model/")














# import pandas as pd
# import numpy as np
# import joblib
# import os

# from sklearn.linear_model import LinearRegression
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import LabelEncoder
# from sklearn.metrics import r2_score, mean_absolute_error

# # ── Paths ─────────────────────────────────────────────────
# BASE      = os.path.dirname(__file__)
# DATA_PATH = os.path.join(BASE, "data", "crop_production.csv")
# MODEL_DIR = os.path.join(BASE, "model")

# # ── Load ──────────────────────────────────────────────────
# df = pd.read_csv(DATA_PATH)
# print(f"Loaded: {df.shape}")

# # ── Clean ─────────────────────────────────────────────────
# # Drop rows where Production is missing
# df = df.dropna(subset=["Production"])

# # Remove zero/negative Area or Production
# df = df[(df["Area"] > 0) & (df["Production"] > 0)]

# # ── Feature engineering ───────────────────────────────────
# # Yield = Production / Area, then log-compress the scale
# # log1p(x) = log(1+x) — safe when x is 0, compresses skew
# df["Yield"] = np.log1p(df["Production"] / df["Area"])

# # Only remove extreme top 2% (genuine data entry errors)
# upper = df["Yield"].quantile(0.98)
# df = df[df["Yield"] < upper]

# print(f"After cleaning: {df.shape[0]} rows")
# print("Yield (log scale) stats:")
# print(df["Yield"].describe().round(3))

# # ── Encode text columns ───────────────────────────────────
# for col in ["State_Name", "Season", "Crop"]:
#     df[col] = df[col].str.strip()

# encoders = {}
# for col in ["State_Name", "Season", "Crop"]:
#     le = LabelEncoder()
#     df[col] = le.fit_transform(df[col])
#     encoders[col] = le

# # ── Train / test split ────────────────────────────────────
# FEATURES = ["State_Name", "Season", "Crop", "Area"]
# TARGET   = "Yield"

# X = df[FEATURES]
# y = df[TARGET]

# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42
# )

# # ── Train Linear Regression ───────────────────────────────
# model = LinearRegression()
# model.fit(X_train, y_train)

# # ── Evaluate ──────────────────────────────────────────────
# y_pred_log = model.predict(X_test)

# # R² on log scale (what the model actually sees)
# r2 = r2_score(y_test, y_pred_log)

# # MAE in real kg/ha (reverse the log for human readability)
# mae = mean_absolute_error(
#     np.expm1(y_test),
#     np.expm1(y_pred_log)
# )

# print(f"\nModel Performance:")
# print(f"  R² Score : {r2:.4f}  (target: > 0.70)")
# print(f"  MAE      : {mae:.1f} kg/ha (real units)")

# # Show sample predictions vs actual in real units
# print("\nSample predictions (real kg/ha):")
# for actual, pred in zip(np.expm1(y_test[:5]), np.expm1(y_pred_log[:5])):
#     print(f"  Actual: {actual:>8.1f}  Predicted: {pred:>8.1f}")

# # ── Save ──────────────────────────────────────────────────
# os.makedirs(MODEL_DIR, exist_ok=True)

# joblib.dump(model,    os.path.join(MODEL_DIR, "model.pkl"))
# joblib.dump(encoders, os.path.join(MODEL_DIR, "encoders.pkl"))
# joblib.dump(FEATURES, os.path.join(MODEL_DIR, "features.pkl"))
# joblib.dump(True,     os.path.join(MODEL_DIR, "log_transformed.pkl"))

# print("\nSaved: model.pkl, encoders.pkl, features.pkl, log_transformed.pkl")
# print("Training complete.")






















import pandas as pd
import numpy as np
import joblib
import os

from sklearn.ensemble import RandomForestRegressor   # ← changed
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score, mean_absolute_error

# ── Paths ─────────────────────────────────────────────────
BASE      = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE, "data", "crop_production.csv")
MODEL_DIR = os.path.join(BASE, "model")

# ── Load ──────────────────────────────────────────────────
df = pd.read_csv(DATA_PATH)
print(f"Loaded: {df.shape}")

# ── Clean ─────────────────────────────────────────────────
df = df.dropna(subset=["Production"])
df = df[(df["Area"] > 0) & (df["Production"] > 0)]

# ── Feature engineering ───────────────────────────────────
df["Yield"] = np.log1p(df["Production"] / df["Area"])
upper = df["Yield"].quantile(0.98)
df = df[df["Yield"] < upper]

print(f"After cleaning: {df.shape[0]} rows")

# ── Encode text columns ───────────────────────────────────
for col in ["State_Name", "Season", "Crop"]:
    df[col] = df[col].str.strip()

encoders = {}
for col in ["State_Name", "Season", "Crop"]:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# ── Train / test split ────────────────────────────────────
FEATURES = ["State_Name", "Season", "Crop", "Area"]
TARGET   = "Yield"

X = df[FEATURES]
y = df[TARGET]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ── Train Random Forest ───────────────────────────────────
# n_estimators=100  → 100 decision trees, averaged
# random_state=42   → reproducible results
# n_jobs=-1         → use all CPU cores (faster training)
model = RandomForestRegressor(         # ← changed
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)
print("Training Random Forest (may take 30–60s)...")
model.fit(X_train, y_train)

# ── Evaluate ──────────────────────────────────────────────
y_pred_log = model.predict(X_test)

r2  = r2_score(y_test, y_pred_log)
mae = mean_absolute_error(
    np.expm1(y_test),
    np.expm1(y_pred_log)
)

print(f"\nModel Performance:")
print(f"  R² Score : {r2:.4f}  (target: > 0.70)")
print(f"  MAE      : {mae:.1f} units")

# ── Feature importance ────────────────────────────────────
# Shows which input features matter most to the model
# Crop type usually dominates — that tells you why LR failed
print("\nFeature importances:")
for feat, imp in zip(FEATURES, model.feature_importances_):
    bar = "█" * int(imp * 50)
    print(f"  {feat:12} {imp:.3f} {bar}")

# Sample predictions vs actual
print("\nSample predictions (real units):")
for actual, pred in zip(np.expm1(y_test[:5]), np.expm1(y_pred_log[:5])):
    print(f"  Actual: {actual:>8.1f}   Predicted: {pred:>8.1f}")

# ── Save ──────────────────────────────────────────────────
os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(model,    os.path.join(MODEL_DIR, "model.pkl"))
joblib.dump(encoders, os.path.join(MODEL_DIR, "encoders.pkl"))
joblib.dump(FEATURES, os.path.join(MODEL_DIR, "features.pkl"))
joblib.dump(True,     os.path.join(MODEL_DIR, "log_transformed.pkl"))

print("\nSaved: model.pkl, encoders.pkl, features.pkl, log_transformed.pkl")
print("Training complete.")