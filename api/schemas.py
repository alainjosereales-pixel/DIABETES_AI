from pydantic import BaseModel, Field


class PatientData(BaseModel):
    Pregnancies: int = Field(..., ge=0)

    Glucose: float = Field(..., ge=0)

    BloodPressure: float = Field(..., ge=0)

    SkinThickness: float = Field(..., ge=0)

    Insulin: float = Field(..., ge=0)

    BMI: float = Field(..., ge=0)

    DiabetesPedigreeFunction: float = Field(..., ge=0)

    Age: int = Field(..., ge=1)
    

from typing import Optional


class PatientCreate(PatientData):
    nombre: Optional[str] = None
    documento: Optional[str] = None
    sexo: Optional[str] = None
    fecha_nacimiento: Optional[str] = None