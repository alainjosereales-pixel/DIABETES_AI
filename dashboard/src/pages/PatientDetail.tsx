import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Activity,
  User,
  FileText,
  Brain,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Prediction {
  id: number;
  prediction: number;
  probability: number;
  percentage: number;
  model_version: string;
  status: string;
  fecha_prediccion: string;
}

interface Patient {
  id: number;
  nombre?: string | null;
  documento?: string | null;
  sexo?: string | null;
  fecha_nacimiento?: string | null;
  fecha_registro?: string | null;

  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;

  predictions: Prediction[];
}

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://127.0.0.1:8000/patients/${id}`
        );

        if (!response.ok) {
          throw new Error("No se pudo obtener la información del paciente.");
        }

        const data = await response.json();
        setPatient(data);
      } catch (err) {
        console.error(err);
        setError("No fue posible cargar la información del paciente.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPatient();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-8 w-64 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
          <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate("/patients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a pacientes
        </Button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-red-500" />

          <h2 className="mt-4 text-lg font-semibold text-red-900">
            No se pudo cargar el paciente
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error || "El paciente no existe o fue eliminado."}
          </p>
        </div>
      </div>
    );
  }

  const predictions = [...(patient.predictions || [])].sort(
    (a, b) =>
      new Date(b.fecha_prediccion).getTime() -
      new Date(a.fecha_prediccion).getTime()
  );

  const latestPrediction = predictions[0];

  const formatDate = (date?: string | null) => {
    if (!date) return "No registrada";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (date?: string | null) => {
    if (!date) return "No registrada";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isPositive = latestPrediction?.prediction === 1;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <button
            onClick={() => navigate("/patients")}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a pacientes
          </button>

          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Ficha del paciente
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {patient.nombre || `Paciente #${patient.id}`}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Documento: {patient.documento || "No registrado"}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/patients")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Pacientes
          </Button>

          <Button
            onClick={() => navigate("/patients/new")}
          >
            Nueva estimación
          </Button>
        </div>
      </div>

      {/* RESUMEN */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Información personal */}
        <section className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <User className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Información personal
                </h2>

                <p className="text-xs text-slate-500">
                  Datos de identificación
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-1">
            <InfoItem
              label="Nombre completo"
              value={patient.nombre || "No registrado"}
            />

            <InfoItem
              label="Documento"
              value={patient.documento || "No registrado"}
            />

            <InfoItem
              label="Sexo"
              value={patient.sexo || "No registrado"}
            />

            <InfoItem
              label="Fecha de nacimiento"
              value={formatDate(patient.fecha_nacimiento)}
            />

            <InfoItem
              label="Edad"
              value={`${patient.Age} años`}
            />

            <InfoItem
              label="Fecha de registro"
              value={formatDate(patient.fecha_registro)}
            />
          </div>
        </section>

        {/* Resultado */}
        <section className="rounded-2xl border bg-white shadow-sm lg:col-span-2">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Brain className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Última estimación
                </h2>

                <p className="text-xs text-slate-500">
                  Resultado generado por el modelo
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {latestPrediction ? (
              <div className="grid gap-5 md:grid-cols-3">
                <div
                  className={`rounded-2xl border p-5 ${
                    isPositive
                      ? "border-red-200 bg-red-50"
                      : "border-emerald-200 bg-emerald-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    )}

                    <span className="text-sm font-medium text-slate-600">
                      Resultado
                    </span>
                  </div>

                  <p
                    className={`mt-3 text-2xl font-bold ${
                      isPositive
                        ? "text-red-700"
                        : "text-emerald-700"
                    }`}
                  >
                    {isPositive
                      ? "Estimación positiva"
                      : "Estimación negativa"}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    No constituye un diagnóstico médico.
                  </p>
                </div>

                <div className="rounded-2xl border bg-slate-50 p-5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />

                    <span className="text-sm font-medium text-slate-600">
                      Probabilidad estimada
                    </span>
                  </div>

                  <p className="mt-3 text-4xl font-bold text-slate-900">
                    {Number(latestPrediction.percentage).toFixed(2)}%
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Salida estimada del modelo.
                  </p>
                </div>

                <div className="rounded-2xl border bg-slate-50 p-5">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-violet-600" />

                    <span className="text-sm font-medium text-slate-600">
                      Modelo
                    </span>
                  </div>

                  <p className="mt-3 text-xl font-bold text-slate-900">
                    {latestPrediction.model_version}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Estado: {latestPrediction.status}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <Brain className="mx-auto h-8 w-8 text-slate-400" />

                <p className="mt-3 font-medium text-slate-700">
                  No existen estimaciones
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Este paciente todavía no tiene resultados registrados.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* VARIABLES CLÍNICAS */}
      <section className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Variables clínicas
              </h2>

              <p className="text-xs text-slate-500">
                Valores utilizados por el modelo de estimación
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <ClinicalValue
            label="Embarazos"
            value={patient.Pregnancies}
            unit=""
          />

          <ClinicalValue
            label="Glucosa"
            value={patient.Glucose}
            unit="mg/dL"
            highlight
          />

          <ClinicalValue
            label="Presión arterial"
            value={patient.BloodPressure}
            unit="mmHg"
          />

          <ClinicalValue
            label="Espesor de piel"
            value={patient.SkinThickness}
            unit="mm"
          />

          <ClinicalValue
            label="Insulina"
            value={patient.Insulin}
            unit="μU/mL"
          />

          <ClinicalValue
            label="IMC"
            value={patient.BMI}
            unit=""
          />

          <ClinicalValue
            label="Función de diabetes"
            value={patient.DiabetesPedigreeFunction}
            unit=""
          />

          <ClinicalValue
            label="Edad"
            value={patient.Age}
            unit="años"
          />
        </div>
      </section>

      {/* HISTORIAL */}
      <section className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Clock3 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Historial de estimaciones
              </h2>

              <p className="text-xs text-slate-500">
                Registro histórico de resultados generados
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {predictions.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Fecha
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Resultado
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Probabilidad
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Modelo
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody>
                {predictions.map((prediction) => {
                  const positive = prediction.prediction === 1;

                  return (
                    <tr
                      key={prediction.id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-slate-400" />

                          {formatDateTime(
                            prediction.fecha_prediccion
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            positive
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {positive ? "Positiva" : "Negativa"}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {Number(prediction.percentage).toFixed(2)}%
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {prediction.model_version}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 text-xs text-slate-600">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          {prediction.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-10 text-center">
              <FileText className="mx-auto h-8 w-8 text-slate-400" />

              <p className="mt-3 font-medium text-slate-700">
                Sin historial
              </p>

              <p className="mt-1 text-sm text-slate-500">
                No hay estimaciones registradas para este paciente.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* AVISO */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

          <div>
            <p className="font-semibold text-amber-900">
              Uso de investigación
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              Las estimaciones mostradas corresponden a la salida del
              modelo de aprendizaje automático y están destinadas al
              prototipo de investigación. No deben interpretarse como
              diagnóstico médico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

interface ClinicalValueProps {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}

function ClinicalValue({
  label,
  value,
  unit,
  highlight = false,
}: ClinicalValueProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-blue-200 bg-blue-50/50"
          : "bg-slate-50"
      }`}
    >
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <div className="mt-2 flex items-end gap-1">
        <span className="text-xl font-bold text-slate-900">
          {value}
        </span>

        {unit && (
          <span className="pb-0.5 text-xs text-slate-500">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}