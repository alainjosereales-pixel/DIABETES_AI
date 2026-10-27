from api.models_db import Patient, Prediction


def test_create_patient_and_prediction(db_session):
    patient = Patient(
        nombre="Paciente Test",
        documento="TEST-001",
        sexo="F",
        fecha_nacimiento="1996-05-20",
        Pregnancies=2,
        Glucose=120,
        BloodPressure=70,
        SkinThickness=20,
        Insulin=79,
        BMI=25.0,
        DiabetesPedigreeFunction=0.5,
        Age=30,
    )

    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)

    prediction = Prediction(
        patient_id=patient.id,
        prediction=0,
        probability=0.25,
        percentage=25.0,
        model_version="1.0.0",
        status="research_prototype",
    )

    db_session.add(prediction)
    db_session.commit()
    db_session.refresh(prediction)

    assert patient.id is not None
    assert prediction.id is not None
    assert prediction.patient_id == patient.id


def test_patient_prediction_relationship(db_session):
    patient = Patient(
        nombre="Paciente Relación",
        documento="TEST-002",
        sexo="F",
        fecha_nacimiento="1995-01-01",
        Pregnancies=1,
        Glucose=100,
        BloodPressure=70,
        SkinThickness=20,
        Insulin=80,
        BMI=24.0,
        DiabetesPedigreeFunction=0.4,
        Age=31,
    )

    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)

    prediction = Prediction(
        patient_id=patient.id,
        prediction=1,
        probability=0.75,
        percentage=75.0,
        model_version="1.0.0",
        status="research_prototype",
    )

    db_session.add(prediction)
    db_session.commit()

    db_session.refresh(patient)

    assert len(patient.predictions) == 1
    assert patient.predictions[0].percentage == 75.0
