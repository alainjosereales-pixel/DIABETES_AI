from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from .database import get_db
from .models_db import Patient, Prediction
from .database import engine, Base
from . import models_db

from .schemas import PatientData, PatientCreate

from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional

import joblib
import pandas as pd

import os

if os.getenv("CREATE_TABLES", "true").lower() == "true":
    Base.metadata.create_all(bind=engine)


# ============================================================
# CONFIGURACIÓN
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "mlp_diabetes_pipeline_v1.joblib"
)


# ============================================================
# CARGAR MODELO
# ============================================================

try:
    model = joblib.load(MODEL_PATH)

    print("Modelo cargado correctamente.")

except Exception as e:

    raise RuntimeError(
        f"No se pudo cargar el modelo: {e}"
    )


# ============================================================
# VARIABLES ESPERADAS
# ============================================================

FEATURES = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age"
]


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="Diabetes AI API",
    version="1.0.0"
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,"
        "http://localhost:5174,http://127.0.0.1:5174"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BatchPatient(BaseModel):
    nombre: Optional[str] = None
    documento: Optional[str] = None
    sexo: Optional[str] = None
    fecha_nacimiento: Optional[str] = None

    Pregnancies: int
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: int

    prediction: int
    probability: float
    percentage: float
    
# ============================================================
# RUTA PRINCIPAL
# ============================================================

@app.get("/")
def root():

    return {
        "message": "Diabetes AI API funcionando",
        "version": "1.0.0",
        "status": "research_prototype"
    }


# ============================================================
# INFORMACIÓN DEL MODELO
# ============================================================

@app.get("/model")
def get_model():
    return {
        "model": "MLPClassifier",
        "version": "1.0.0",
        "task": "binary_classification",
        "target": "Outcome",

        "dataset": "Pima Indians Diabetes Database",

        "training_rows": 614,
        "test_rows": 154,

        "features": [
            "Pregnancies",
            "Glucose",
            "BloodPressure",
            "SkinThickness",
            "Insulin",
            "BMI",
            "DiabetesPedigreeFunction",
            "Age"
        ],

        "hyperparameters": {
            "activation": "relu",
            "alpha": 0.001,
            "hidden_layer_sizes": "(32, 16)",
            "learning_rate_init": 0.01
        },

        "metrics": {
            "accuracy": 0.7403,
            "precision": 0.6522,
            "recall": 0.5556,
            "f1": 0.6000,
            "roc_auc": 0.8161,
            "brier_score": 0.1700
        },

        "validation": {
            "roc_auc": 0.8507,
            "threshold_candidate": 0.45,
            "selection_metric": "F1"
        },

        "feature_importance": [
            {
                "feature": "Glucose",
                "importance": 0.1498
            },
            {
                "feature": "Pregnancies",
                "importance": 0.0300
            },
            {
                "feature": "BMI",
                "importance": 0.0161
            },
            {
                "feature": "Insulin",
                "importance": 0.0095
            },
            {
                "feature": "BloodPressure",
                "importance": 0.0077
            },
            {
                "feature": "DiabetesPedigreeFunction",
                "importance": 0.0057
            },
            {
                "feature": "SkinThickness",
                "importance": 0.0020
            },
            {
                "feature": "Age",
                "importance": 0.0008
            }
        ],

        "status": "research_prototype"
    }


# ============================================================
# PREDICCIÓN INDIVIDUAL
# ============================================================

@app.post("/predict")
def predict(patient: PatientData):

    try:

        data = pd.DataFrame(
            [patient.model_dump()]
        )

        probability = float(
            model.predict_proba(data)[0, 1]
        )

        prediction = int(
            probability >= 0.50
        )

        return {
            "prediction": prediction,
            "probability": round(probability, 4),
            "percentage": round(
                probability * 100,
                2
            ),
            "model_version": "1.0.0",
            "status": "research_prototype"
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Error durante la predicción: {str(e)}"
        )


# ============================================================
# PREDICCIÓN MASIVA — CSV
# ============================================================

@app.post("/predict/batch")
async def predict_batch(file: UploadFile = File(...)):
    import pandas as pd
    from io import BytesIO

    filename = file.filename or ""

    if not filename.lower().endswith((".csv", ".xlsx")):
        raise HTTPException(
            status_code=400,
            detail="Solo se permiten archivos CSV o Excel (.xlsx)."
        )

    try:
        contents = await file.read()

        if filename.lower().endswith(".csv"):
            df = pd.read_csv(BytesIO(contents))
        else:
            df = pd.read_excel(BytesIO(contents))

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"No se pudo leer el archivo: {str(e)}"
        )

    required_features = [
        "Pregnancies",
        "Glucose",
        "BloodPressure",
        "SkinThickness",
        "Insulin",
        "BMI",
        "DiabetesPedigreeFunction",
        "Age"
    ]

    missing_columns = [
        column
        for column in required_features
        if column not in df.columns
    ]

    if missing_columns:
        raise HTTPException(
            status_code=400,
            detail={
                "mensaje": "Faltan columnas requeridas.",
                "columnas_faltantes": missing_columns,
                "columnas_requeridas": required_features
            }
        )

    # Seleccionar únicamente las variables utilizadas por el modelo
    X = df[required_features].copy()

    # Convertir a valores numéricos
    for column in required_features:
        X[column] = pd.to_numeric(X[column], errors="coerce")

    # Verificar valores inválidos
    if X.isnull().any().any():
        invalid_columns = X.columns[X.isnull().any()].tolist()

        raise HTTPException(
            status_code=400,
            detail={
                "mensaje": "El archivo contiene valores inválidos o vacíos.",
                "columnas": invalid_columns
            }
        )

    # Predicciones
    predictions = model.predict(X)
    probabilities = model.predict_proba(X)[:, 1]

    results = []

    for index, row in df.iterrows():

        result = {}

        # Conservar columnas originales
        for column in df.columns:
            value = row[column]

            if pd.isna(value):
                value = None

            result[column] = value

        result["prediction"] = int(predictions[index])
        result["probability"] = float(probabilities[index])
        result["percentage"] = round(float(probabilities[index]) * 100, 2)

        results.append(result)

    total = len(results)

    positive = sum(
        1 for result in results
        if result["prediction"] == 1
    )

    negative = total - positive

    average_probability = (
        sum(result["percentage"] for result in results) / total
        if total > 0
        else 0
    )

    return {
        "total": total,
        "positive": positive,
        "negative": negative,
        "average_probability": round(average_probability, 2),
        "results": results
    }
    

# ==========================================
# GUARDAR PREDICCIONES MASIVAS
# ==========================================
    
class BatchPatient(BaseModel):
    nombre: Optional[str] = None
    documento: Optional[str] = None
    sexo: Optional[str] = None
    fecha_nacimiento: Optional[str] = None

    Pregnancies: int
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: int

    prediction: int
    probability: float
    percentage: float


@app.post("/patients/batch")
def save_batch_patients(
    patients: List[BatchPatient],
    db: Session = Depends(get_db)
):
    saved_patients = []
    errors = []

    for index, item in enumerate(patients):

        try:

            # Buscar si el paciente ya existe
            existing_patient = None

            if item.documento:
                existing_patient = (
                    db.query(Patient)
                    .filter(Patient.documento == item.documento)
                    .first()
                )

            # Si existe, utilizamos el paciente existente
            if existing_patient:

                patient = existing_patient

            else:

                patient = Patient(
                    nombre=item.nombre,
                    documento=item.documento,
                    sexo=item.sexo,
                    fecha_nacimiento=item.fecha_nacimiento,

                    Pregnancies=item.Pregnancies,
                    Glucose=item.Glucose,
                    BloodPressure=item.BloodPressure,
                    SkinThickness=item.SkinThickness,
                    Insulin=item.Insulin,
                    BMI=item.BMI,
                    DiabetesPedigreeFunction=item.DiabetesPedigreeFunction,
                    Age=item.Age,
                )

                db.add(patient)
                db.flush()

            # Crear la predicción
            prediction = Prediction(
                patient_id=patient.id,
                prediction=item.prediction,
                probability=item.probability,
                percentage=item.percentage,
                model_version="1.0.0",
                status="research_prototype"
            )

            db.add(prediction)

            saved_patients.append({
                "patient_id": patient.id,
                "nombre": patient.nombre,
                "documento": patient.documento,
                "percentage": item.percentage
            })

        except Exception as e:

            errors.append({
                "registro": index + 1,
                "error": str(e)
            })

    db.commit()

    return {
        "message": "Proceso de guardado completado",
        "saved": len(saved_patients),
        "errors": len(errors),
        "patients": saved_patients,
        "error_details": errors
    }
        
@app.post("/patients")
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db)
):
    # Convertir los datos del paciente al formato esperado por el modelo
    input_data = pd.DataFrame([{
        "Pregnancies": patient.Pregnancies,
        "Glucose": patient.Glucose,
        "BloodPressure": patient.BloodPressure,
        "SkinThickness": patient.SkinThickness,
        "Insulin": patient.Insulin,
        "BMI": patient.BMI,
        "DiabetesPedigreeFunction": patient.DiabetesPedigreeFunction,
        "Age": patient.Age
    }])

    # Obtener predicción
    probability = float(model.predict_proba(input_data)[0][1])
    prediction = int(model.predict(input_data)[0])

    percentage = round(probability * 100, 2)

    # Crear paciente
    new_patient = Patient(
        
        nombre=patient.nombre,
        documento=patient.documento,
        sexo=patient.sexo,
        fecha_nacimiento=patient.fecha_nacimiento,
        
        Pregnancies=patient.Pregnancies,
        Glucose=patient.Glucose,
        BloodPressure=patient.BloodPressure,
        SkinThickness=patient.SkinThickness,
        Insulin=patient.Insulin,
        BMI=patient.BMI,
        DiabetesPedigreeFunction=patient.DiabetesPedigreeFunction,
        Age=patient.Age
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    # Crear registro de predicción
    new_prediction = Prediction(
        patient_id=new_patient.id,
        prediction=prediction,
        probability=probability,
        percentage=percentage,
        model_version="1.0.0",
        status="research_prototype"
    )

    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)

    return {
        "patient_id": new_patient.id,
        "prediction_id": new_prediction.id,
        "prediction": prediction,
        "probability": probability,
        "percentage": percentage,
        "model_version": "1.0.0",
        "status": "research_prototype"
    }
@app.get("/patients")
def get_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).all()

    return {
        "total": len(patients),
        "patients": [
            {
                "patient_id": patient.id,
                "Pregnancies": patient.Pregnancies,
                "Glucose": patient.Glucose,
                "BloodPressure": patient.BloodPressure,
                "SkinThickness": patient.SkinThickness,
                "Insulin": patient.Insulin,
                "BMI": patient.BMI,
                "DiabetesPedigreeFunction": patient.DiabetesPedigreeFunction,
                "Age": patient.Age,
                "fecha_registro": patient.fecha_registro
            }
            for patient in patients
        ]
    }   
    
@app.get("/patients/{patient_id}")
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Paciente no encontrado"
        )

    predictions = db.query(Prediction).filter(
        Prediction.patient_id == patient.id
    ).order_by(
        Prediction.fecha_prediccion.desc()
    ).all()

    return {
        "patient_id": patient.id,
        "Pregnancies": patient.Pregnancies,
        "Glucose": patient.Glucose,
        "BloodPressure": patient.BloodPressure,
        "SkinThickness": patient.SkinThickness,
        "Insulin": patient.Insulin,
        "BMI": patient.BMI,
        "DiabetesPedigreeFunction": patient.DiabetesPedigreeFunction,
        "Age": patient.Age,
        "fecha_registro": patient.fecha_registro,
        "predictions": [
            {
                "prediction_id": prediction.id,
                "prediction": prediction.prediction,
                "probability": prediction.probability,
                "percentage": prediction.percentage,
                "model_version": prediction.model_version,
                "status": prediction.status,
                "fecha_prediccion": prediction.fecha_prediccion
            }
            for prediction in predictions
        ]
    }
@app.get("/predictions")
def get_predictions(db: Session = Depends(get_db)):
    predictions = db.query(Prediction).order_by(
        Prediction.fecha_prediccion.desc()
    ).all()

    return {
        "total": len(predictions),
        "predictions": [
            {
                "prediction_id": prediction.id,
                "patient_id": prediction.patient_id,
                "prediction": prediction.prediction,
                "probability": prediction.probability,
                "percentage": prediction.percentage,
                "model_version": prediction.model_version,
                "status": prediction.status,
                "fecha_prediccion": prediction.fecha_prediccion
            }
            for prediction in predictions
        ]
    }
    
@app.get("/metrics")
def get_metrics(db: Session = Depends(get_db)):

    total_patients = db.query(Patient).count()
    total_predictions = db.query(Prediction).count()

    positive_predictions = db.query(Prediction).filter(
        Prediction.prediction == 1
    ).count()

    negative_predictions = db.query(Prediction).filter(
        Prediction.prediction == 0
    ).count()

    predictions = db.query(Prediction).all()

    if predictions:
        average_probability = sum(
            prediction.probability
            for prediction in predictions
        ) / len(predictions)

        average_percentage = round(
            average_probability * 100,
            2
        )
    else:
        average_percentage = 0.0

    return {
        "total_patients": total_patients,
        "total_predictions": total_predictions,
        "positive_predictions": positive_predictions,
        "negative_predictions": negative_predictions,
        "average_probability_percentage": average_percentage,
        "model_version": "1.0.0"
    }
    
@app.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):

    # =========================
    # MÉTRICAS DEL SISTEMA
    # =========================

    total_patients = db.query(Patient).count()
    total_predictions = db.query(Prediction).count()

    positive_predictions = db.query(Prediction).filter(
        Prediction.prediction == 1
    ).count()

    negative_predictions = db.query(Prediction).filter(
        Prediction.prediction == 0
    ).count()

    predictions = db.query(Prediction).all()

    if predictions:
        average_probability = sum(
            p.probability for p in predictions
        ) / len(predictions)

        average_percentage = round(
            average_probability * 100,
            2
        )
    else:
        average_percentage = 0.0

    # =========================
    # PREDICCIONES RECIENTES
    # =========================



    recent_predictions = db.query(
        Prediction
    ).order_by(
        Prediction.fecha_prediccion.desc()
    ).limit(10).all()

    recent_results = []

    for prediction in recent_predictions:

        patient = db.query(Patient).filter(
            Patient.id == prediction.patient_id
        ).first()

        recent_results.append({
            "prediction_id": prediction.id,
            "patient_id": prediction.patient_id,
            "patient_name": patient.nombre if patient else None,
            "prediction": prediction.prediction,
            "probability": prediction.probability,
            "percentage": prediction.percentage,
            "model_version": prediction.model_version,
            "status": prediction.status,
            "fecha_prediccion": prediction.fecha_prediccion
        })
        
        

    # =========================
    # RESPUESTA DEL DASHBOARD
    # =========================

    return {
        "metrics": {
            "total_patients": total_patients,
            "total_predictions": total_predictions,
            "positive_predictions": positive_predictions,
            "negative_predictions": negative_predictions,
            "average_probability_percentage": average_percentage
        },

        "model": {
            "name": "MLPClassifier",
            "version": "1.0.0",
            "task": "binary_classification",
            "target": "Outcome"
        },

        "recent_predictions": recent_results
    }