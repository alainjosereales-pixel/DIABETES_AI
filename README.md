# 🩺 DIABETES_AI

## Plataforma de Inteligencia Artificial para Estimación de Riesgo de Diabetes

DIABETES_AI es una plataforma de investigación y apoyo a la decisión basada en Machine Learning, diseñada para estimar el riesgo de diabetes a partir de variables clínicas y demográficas.

El proyecto integra un modelo de aprendizaje automático con una API REST, una base de datos PostgreSQL y un dashboard web desarrollado con React y TypeScript.

>  **Importante:** DIABETES_AI es un prototipo de investigación y apoyo a la decisión. Sus resultados representan una estimación basada en datos y no constituyen un diagnóstico médico.

---

## Objetivo

Desarrollar una plataforma que permita:

- Registrar información de pacientes.
- Estimar el riesgo de diabetes mediante Machine Learning.
- Mostrar la estimación en porcentaje.
- Consultar el historial de predicciones.
- Procesar predicciones individuales y masivas mediante CSV.
- Almacenar pacientes y predicciones en PostgreSQL.
- Evaluar diferentes modelos de clasificación.
- Analizar la importancia de las variables utilizadas por el modelo.

---

## Características

### Gestión de pacientes

- Registro de pacientes.
- Consulta de información.
- Historial de predicciones.
- Relación entre pacientes y predicciones.

### Inteligencia Artificial

- Pipeline de Machine Learning.
- Modelo MLP integrado.
- Estimación porcentual del riesgo.
- Versionamiento del modelo.
- Comparación de diferentes algoritmos.

### Predicción masiva

- Carga de archivos CSV.
- Predicción de múltiples pacientes.
- Validación de datos de entrada.

### Dashboard

- Indicadores generales.
- Evaluación de modelos.
- Matrices de confusión.
- Historial.
- Información del paciente.
- Metodología.
- Interpretabilidad.

###  Base de datos

- PostgreSQL como base principal.
- SQLAlchemy como ORM.
- Persistencia de pacientes y predicciones.

---
  Arquitectura

```text
┌──────────────────────────────┐
│       React + TypeScript     │
│          Dashboard           │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│            FastAPI           │
│         Backend / API        │
└───────────┬─────────┬────────┘
            │         │
            ▼         ▼
     ┌──────────┐  ┌─────────────┐
     │ Modelo   │  │ PostgreSQL  │
     │   MLP    │  │  Database   │
     └──────────┘  └─────────────┘

 Tecnologías
Backend
- Python
- FastAPI
- Uvicorn
- Pydantic
- SQLAlchemy
Machine Learning
- Pandas
- NumPy
- Scikit-learn
- Joblib
- SHAP
Base de datos
- PostgreSQL
- Psycopg
Frontend
- React
- TypeScript
- Tailwind CSS
- Vite
Análisis
- Jupyter Notebook
- Matplotlib
- Seaborn
- OpenPyXL

### Dataset

El proyecto utiliza el Pima Indians Diabetes Database, almacenado en:
data/raw/pima_diabetes.csv

El conjunto contiene:
- 768 registros.
- 8 variables predictoras.
- Variable objetivo Outcome.
- Registros correspondientes a pacientes mujeres.
Variables
Variable	Descripción
Pregnancies	Número de embarazos
Glucose	Concentración de glucosa
BloodPressure	Presión arterial
SkinThickness	Grosor del pliegue cutáneo
Insulin	Insulina
BMI	Índice de masa corporal
DiabetesPedigreeFunction	Función de pedigrí de diabetes
Age	Edad
Outcome	Variable objetivo


Limitación del dataset
El conjunto representa una población específica y no debe considerarse automáticamente representativo de toda la población.
Por esta razón, los resultados deben considerarse experimentales y requieren validación externa antes de cualquier utilización clínica.

 Metodología de Machine Learning
El proyecto contempla:
1. Auditoría del dataset.
2. Análisis exploratorio de datos.
3. Preparación de variables.
4. Entrenamiento de modelos.
5. Validación cruzada.
6. Evaluación sobre conjunto de prueba.
7. Comparación de métricas.
8. Interpretabilidad.
9. Integración del pipeline seleccionado.
10. Versionamiento del modelo.
Los notebooks principales son:
notebooks/
├── 01_auditoria_dataset.ipynb
└── 02_pima_eda.ipynb

 Modelos evaluados
Se evaluaron:
- Logistic Regression
- SVM
- KNN
- Random Forest
- MLP
Resultados sobre el conjunto de prueba
Modelo	Accuracy	Precision	Recall	F1	ROC-AUC
Logistic Regression	68.83%	56.52%	48.15%	52.00%	81.04%
SVM	70.78%	60.98%	46.30%	52.63%	80.52%
KNN	75.32%	68.18%	55.56%	61.22%	81.24%
Random Forest	72.73%	64.29%	50.00%	56.25%	80.43%
MLP	74.03%	65.22%	55.56%	60.00%	81.61%


Interpretación
El MLP obtuvo el ROC-AUC más alto en el conjunto de prueba, mientras que KNN obtuvo mejores valores de Accuracy, Precision y F1.
Por lo tanto, el proyecto no declara un único modelo universalmente superior.
El MLP fue integrado como candidato de referencia para el prototipo.

 Modelo MLP
Configuración utilizada:
Arquitectura: (32, 16)
Activación: ReLU
Alpha: 0.001
Learning rate inicial: 0.01
Versión: 1.0.0

Archivo:
models/mlp_diabetes_pipeline_v1.joblib

Metadatos:
models/mlp_diabetes_pipeline_v1_metadata.json

 Interpretabilidad
El proyecto incorpora análisis de importancia de variables para comprender el comportamiento del modelo.
En los análisis realizados, Glucose presentó la mayor influencia entre las variables evaluadas.
También se analizaron:
- BMI
- DiabetesPedigreeFunction
- Pregnancies
- Age
- Insulin
- BloodPressure
- SkinThickness
La importancia de variables se utiliza para analizar el comportamiento del modelo y no implica causalidad clínica.

🔌 API
El backend está desarrollado con FastAPI.
Principales operaciones:
POST /predict
POST /predict/batch
POST /patients
GET  /patients
GET  /predictions
GET  /metrics
GET  /model

La API valida los datos recibidos, ejecuta el pipeline de Machine Learning y registra los resultados correspondientes.
 PostgreSQL
PostgreSQL es actualmente la base de datos principal de la aplicación.
Relación:
patients
    │
    │ 1:N
    ▼
predictions

patients
Almacena:
- Identificador.
- Información básica.
- Variables utilizadas por el modelo.
- Fecha de registro.
predictions
Almacena:
- Identificador.
- patient_id.
- Resultado.
- Probabilidad.
- Porcentaje.
- Versión del modelo.
- Estado.
- Fecha de predicción.

 Configuración
La conexión se configura mediante variables de entorno.
Crear un archivo .env:
DATABASE_URL=postgresql+psycopg://USUARIO:CONTRASEÑA@localhost:5432/diabetes_ai

El archivo .env no debe publicarse.
El proyecto incluye:
.env.example

para mostrar la estructura requerida sin exponer credenciales.
 Instalación
1. Clonar
git clone <URL_DEL_REPOSITORIO>
cd DIABETES_AI

2. Crear entorno virtual
Windows:
python -m venv venv
.\venv\Scripts\Activate.ps1

3. Instalar dependencias
pip install -r requirements.txt

Para desarrollo e investigación:
pip install -r requirements-dev.txt

4. Configurar PostgreSQL
Crear una base de datos:
diabetes_ai

Configurar DATABASE_URL en .env.
5. Ejecutar API
Desde la raíz:
uvicorn api.main:app --reload

API:
http://127.0.0.1:8000

Documentación:
http://127.0.0.1:8000/docs

6. Ejecutar Dashboard
cd dashboard
npm install
npm run dev

 Estructura
DIABETES_AI/
│
├── api/
│   ├── database.py
│   ├── main.py
│   ├── models_db.py
│   └── schemas.py
│
├── dashboard/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── data/
│   ├── raw/
│   │   └── pima_diabetes.csv
│   ├── processed/
│   │   └── diabetes_auditoria.csv
│   └── test/
│       ├── pacientes_masivos.csv
│       └── pacientes_prueba.csv
│
├── models/
│   ├── mlp_diabetes_pipeline_v1.joblib
│   └── mlp_diabetes_pipeline_v1_metadata.json
│
├── notebooks/
│   ├── 01_auditoria_dataset.ipynb
│   └── 02_pima_eda.ipynb
│
├── scripts/
│   └── migrate_sqlite_to_postgres.py
│
├── .env.example
├── .gitignore
├── requirements.txt
├── requirements-dev.txt
└── README.md

 Migración a PostgreSQL
Durante el desarrollo se utilizó inicialmente SQLite.
Posteriormente se realizó la migración hacia PostgreSQL.
La migración fue verificada con:
Pacientes:     13
Predicciones: 14

También se comprobó la creación de nuevos pacientes y predicciones directamente sobre PostgreSQL.
El script histórico de migración se encuentra en:
scripts/migrate_sqlite_to_postgres.py

 Limitaciones
- El dataset representa una población específica.
- El tamaño del conjunto limita la generalización.
- El modelo no ha sido validado clínicamente.
- Se requiere validación externa.
- Se requieren análisis adicionales de sesgo.
- Las probabilidades necesitan validación y calibración para una población de uso específica.
- El sistema no sustituye una evaluación médica profesional.
 Uso responsable
DIABETES_AI debe utilizarse como herramienta experimental de análisis y apoyo a la investigación.
No debe utilizarse como único criterio para:
- Diagnosticar diabetes.
- Indicar tratamientos.
- Suspender tratamientos.
- Tomar decisiones médicas sin supervisión profesional.
Una evolución hacia un entorno clínico requeriría validación técnica, clínica, regulatoria, de seguridad y privacidad.
 Próximas mejoras
Seguridad
- Autenticación.
- Roles y permisos.
- Auditoría.
- Protección de información sensible.
Machine Learning
- Validación externa.
- Calibración.
- Análisis de sesgo.
- Evaluación por subgrupos.
- Versionamiento avanzado.
- Monitoreo del desempeño.
Plataforma
- Docker.
- Despliegue en servidor.
- Backups.
- Gestión de usuarios.
- Logs.
- CI/CD.
Datos
- Validaciones avanzadas.
- Importación CSV/Excel con reportes de errores.
- Trazabilidad.
- Gestión de datos faltantes.
 Autor
Alain Reales
Ingeniería de Sistemas
Proyecto de investigación y desarrollo en Inteligencia Artificial aplicada a la estimación de riesgo de diabetes.
 Estado
Versión: 1.0.0
Estado: Research Prototype

Backend: FastAPI
Frontend: React + TypeScript
Database: PostgreSQL
Machine Learning: Scikit-learn / MLP

DIABETES_AI continúa en evolución hacia una plataforma más robusta, segura, interpretable y preparada para validación externa.
