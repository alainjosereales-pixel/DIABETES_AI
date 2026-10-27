
const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

export { API_URL };

export interface DashboardData {
  metrics: {
    total_patients: number;
    total_predictions: number;
    positive_predictions: number;
    negative_predictions: number;
    average_probability_percentage: number;
  };

  model: {
    name: string;
    version: string;
    task: string;
    target: string;
  };

  recent_predictions: Prediction[];
}

export interface Prediction {
  prediction_id: number;
  patient_id: number;
  patient_name: string | null;
  prediction: number;
  probability: number;
  percentage: number;
  model_version: string;
  status: string;
  fecha_prediccion: string;
}

export async function getDashboard(): Promise<DashboardData> {
  const response = await fetch(`${API_URL}/dashboard`);

  if (!response.ok) {
    throw new Error("No se pudo obtener la información del dashboard");
  }

  return response.json();
}
