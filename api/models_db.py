from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String(150), nullable=True)
    documento = Column(String(50), unique=True, index=True, nullable=True)
    sexo = Column(String(20), nullable=True)
    fecha_nacimiento = Column(String(20), nullable=True)

    fecha_registro = Column(
        DateTime,
        default=datetime.utcnow
    )

    # Variables utilizadas por el modelo
    Pregnancies = Column(Integer, nullable=False)
    Glucose = Column(Float, nullable=False)
    BloodPressure = Column(Float, nullable=False)
    SkinThickness = Column(Float, nullable=False)
    Insulin = Column(Float, nullable=False)
    BMI = Column(Float, nullable=False)
    DiabetesPedigreeFunction = Column(Float, nullable=False)
    Age = Column(Integer, nullable=False)

    # Relación con predicciones
    predictions = relationship(
        "Prediction",
        back_populates="patient",
        cascade="all, delete-orphan"
    )


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id"),
        nullable=False
    )

    prediction = Column(Integer, nullable=False)
    probability = Column(Float, nullable=False)
    percentage = Column(Float, nullable=False)

    model_version = Column(
        String(50),
        nullable=False
    )

    status = Column(
        String(50),
        default="research_prototype"
    )

    fecha_prediccion = Column(
        DateTime,
        default=datetime.utcnow
    )

    patient = relationship(
        "Patient",
        back_populates="predictions"
    )