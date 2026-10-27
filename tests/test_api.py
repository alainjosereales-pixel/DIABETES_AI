from fastapi.testclient import TestClient

from api.main import app


client = TestClient(app)


VALID_PATIENT = {
    "Pregnancies": 2,
    "Glucose": 120,
    "BloodPressure": 70,
    "SkinThickness": 20,
    "Insulin": 79,
    "BMI": 25.0,
    "DiabetesPedigreeFunction": 0.5,
    "Age": 30,
}


def test_root():
    response = client.get("/")

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "Diabetes AI API funcionando"
    assert data["status"] == "research_prototype"


def test_model_endpoint():
    response = client.get("/model")

    assert response.status_code == 200

    data = response.json()

    assert data["model"] == "MLPClassifier"
    assert data["version"] == "1.0.0"
    assert data["target"] == "Outcome"


def test_predict():
    response = client.post(
        "/predict",
        json=VALID_PATIENT
    )

    assert response.status_code == 200

    data = response.json()

    assert data["prediction"] in [0, 1]
    assert 0 <= data["probability"] <= 1
    assert 0 <= data["percentage"] <= 100
    assert data["model_version"] == "1.0.0"


def test_predict_invalid_age():
    invalid_patient = VALID_PATIENT.copy()
    invalid_patient["Age"] = 0

    response = client.post(
        "/predict",
        json=invalid_patient
    )

    assert response.status_code == 422


def test_predict_negative_glucose():
    invalid_patient = VALID_PATIENT.copy()
    invalid_patient["Glucose"] = -10

    response = client.post(
        "/predict",
        json=invalid_patient
    )

    assert response.status_code == 422


def test_predict_missing_field():
    invalid_patient = VALID_PATIENT.copy()
    del invalid_patient["Glucose"]

    response = client.post(
        "/predict",
        json=invalid_patient
    )
def test_create_patient(client):
    patient = {
        "nombre": "Paciente API Test",
        "documento": "API-TEST-001",
        "sexo": "F",
        "fecha_nacimiento": "1996-05-20",
        "Pregnancies": 2,
        "Glucose": 120,
        "BloodPressure": 70,
        "SkinThickness": 20,
        "Insulin": 79,
        "BMI": 25.0,
        "DiabetesPedigreeFunction": 0.5,
        "Age": 30,
    }

    response = client.post("/patients", json=patient)

    assert response.status_code == 200

    data = response.json()

    assert data["patient_id"] is not None
    assert data["prediction_id"] is not None
    assert data["prediction"] in [0, 1]
    assert 0 <= data["probability"] <= 1
    assert 0 <= data["percentage"] <= 100
    assert data["model_version"] == "1.0.0"


def test_get_patients(client):
    response = client.get("/patients")

    assert response.status_code == 200

    data = response.json()

    assert "total" in data
    assert "patients" in data
    assert isinstance(data["patients"], list)


def test_get_patient(client):
    patient = {
        "nombre": "Paciente Consulta",
        "documento": "API-TEST-002",
        "sexo": "F",
        "fecha_nacimiento": "1995-01-01",
        "Pregnancies": 1,
        "Glucose": 100,
        "BloodPressure": 70,
        "SkinThickness": 20,
        "Insulin": 80,
        "BMI": 24.0,
        "DiabetesPedigreeFunction": 0.4,
        "Age": 31,
    }

    create_response = client.post("/patients", json=patient)

    assert create_response.status_code == 200

    patient_id = create_response.json()["patient_id"]

    response = client.get(f"/patients/{patient_id}")

    assert response.status_code == 200

    data = response.json()

    assert data["patient_id"] == patient_id
    assert "predictions" in data
    assert len(data["predictions"]) == 1


def test_get_patient_not_found(client):
    response = client.get("/patients/999999")

    assert response.status_code == 404


def test_get_predictions(client):
    response = client.get("/predictions")

    assert response.status_code == 200

    data = response.json()

    assert "total" in data
    assert "predictions" in data
    assert isinstance(data["predictions"], list)


def test_get_metrics(client):
    response = client.get("/metrics")

    assert response.status_code == 200

    data = response.json()

    assert "total_patients" in data
    assert "total_predictions" in data
    assert "positive_predictions" in data
    assert "negative_predictions" in data
    assert "average_probability_percentage" in data
    assert data["model_version"] == "1.0.0"
    
    