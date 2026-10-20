import sqlite3
from sqlalchemy import text

from api.database import engine
from api.models_db import Patient, Prediction


SQLITE_DB = "data/diabetes_ai.db"


def migrate():
    sqlite_conn = sqlite3.connect(SQLITE_DB)
    sqlite_conn.row_factory = sqlite3.Row

    try:
        patients = sqlite_conn.execute(
            "SELECT * FROM patients ORDER BY id"
        ).fetchall()

        predictions = sqlite_conn.execute(
            "SELECT * FROM predictions ORDER BY id"
        ).fetchall()

        print(f"Pacientes encontrados en SQLite: {len(patients)}")
        print(f"Predicciones encontradas en SQLite: {len(predictions)}")

        with engine.begin() as connection:
            existing_patients = connection.execute(
                text("SELECT COUNT(*) FROM patients")
            ).scalar()

            existing_predictions = connection.execute(
                text("SELECT COUNT(*) FROM predictions")
            ).scalar()

            if existing_patients != 0 or existing_predictions != 0:
                raise RuntimeError(
                    "PostgreSQL no está vacío. "
                    "La migración se detuvo para evitar duplicados."
                )

        session = None

        from api.database import SessionLocal

        session = SessionLocal()

        try:
            # -------------------------
            # MIGRAR PACIENTES
            # -------------------------
            for row in patients:
                patient = Patient(
                    id=row["id"],
                    nombre=row["nombre"],
                    documento=row["documento"],
                    sexo=row["sexo"],
                    fecha_nacimiento=row["fecha_nacimiento"],
                    fecha_registro=row["fecha_registro"],
                    Pregnancies=row["Pregnancies"],
                    Glucose=row["Glucose"],
                    BloodPressure=row["BloodPressure"],
                    SkinThickness=row["SkinThickness"],
                    Insulin=row["Insulin"],
                    BMI=row["BMI"],
                    DiabetesPedigreeFunction=row[
                        "DiabetesPedigreeFunction"
                    ],
                    Age=row["Age"],
                )

                session.add(patient)

            session.flush()

            # -------------------------
            # MIGRAR PREDICCIONES
            # -------------------------
            for row in predictions:
                prediction = Prediction(
                    id=row["id"],
                    patient_id=row["patient_id"],
                    prediction=row["prediction"],
                    probability=row["probability"],
                    percentage=row["percentage"],
                    model_version=row["model_version"],
                    status=row["status"],
                    fecha_prediccion=row["fecha_prediccion"],
                )

                session.add(prediction)

            session.commit()

            print()
            print("===================================")
            print(" MIGRACIÓN COMPLETADA")
            print("===================================")
            print(f"Pacientes migrados: {len(patients)}")
            print(f"Predicciones migradas: {len(predictions)}")

        except Exception:
            session.rollback()
            raise

        finally:
            session.close()

        # --------------------------------
        # ACTUALIZAR SECUENCIAS
        # --------------------------------
        with engine.begin() as connection:

            connection.execute(
                text(
                    """
                    SELECT setval(
                        pg_get_serial_sequence('patients', 'id'),
                        COALESCE((SELECT MAX(id) FROM patients), 1),
                        true
                    )
                    """
                )
            )

            connection.execute(
                text(
                    """
                    SELECT setval(
                        pg_get_serial_sequence('predictions', 'id'),
                        COALESCE((SELECT MAX(id) FROM predictions), 1),
                        true
                    )
                    """
                )
            )

        print("Secuencias PostgreSQL actualizadas correctamente.")

    finally:
        sqlite_conn.close()


if __name__ == "__main__":
    migrate()