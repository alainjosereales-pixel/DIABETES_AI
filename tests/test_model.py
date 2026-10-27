import joblib
import pandas as pd
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "mlp_diabetes_pipeline_v1.joblib"


def test_model_exists():
    """Verifica que el archivo del modelo exista."""
    assert MODEL_PATH.exists()


def test_model_loads():
    """Verifica que el modelo pueda cargarse correctamente."""
    model = joblib.load(MODEL_PATH)

    assert model is not None
    assert hasattr(model, "predict")
    assert hasattr(model, "predict_proba")


def test_model_prediction():
    """Verifica que el modelo genere una predicción válida."""

    model = joblib.load(MODEL_PATH)

    data = pd.DataFrame([
        {
            "Pregnancies": 2,
            "Glucose": 120,
            "BloodPressure": 70,
            "SkinThickness": 20,
            "Insulin": 79,
            "BMI": 25.0,
            "DiabetesPedigreeFunction": 0.5,
            "Age": 30,
        }
    ])

    prediction = model.predict(data)
    probability = model.predict_proba(data)[0, 1]

    assert prediction[0] in [0, 1]
    assert 0 <= probability <= 1