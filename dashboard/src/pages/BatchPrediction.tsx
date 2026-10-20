import { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Save,
  Trash2,
  Download,
  Users,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface PredictionResult {
  [key: string]: string | number | null | undefined;
  prediction?: number;
  probability?: number;
  percentage?: number;
  nombre?: string;
  documento?: string;
}

interface BatchResponse {
  total: number;
  positive: number;
  negative: number;
  average_probability: number;
  results: PredictionResult[];
}

interface SaveResponse {
  total_received: number;
  saved: number;
  skipped: number;
  errors: number;
  results?: unknown[];
}

export default function BatchPrediction() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<BatchResponse | null>(null);
  const [saveResult, setSaveResult] = useState<SaveResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    setError("");
    setResult(null);
    setSaveResult(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const extension = selectedFile.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (extension !== "csv" && extension !== "xlsx") {
      setError(
        "Formato no válido. Selecciona un archivo CSV o Excel (.xlsx)."
      );
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handlePredict = async () => {
    if (!file) {
      setError("Selecciona un archivo antes de ejecutar la estimación.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);
      setSaveResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/predict/batch",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "No fue posible procesar el archivo."
        );
      }

      const data: BatchResponse = await response.json();

      setResult(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error procesando el archivo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || result.results.length === 0) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSaveResult(null);

      const patients = result.results.map((row) => ({
        nombre: row.nombre ?? null,
        documento: row.documento ?? null,
        sexo: row.sexo ?? null,
        fecha_nacimiento: row.fecha_nacimiento ?? null,

        Pregnancies: Number(row.Pregnancies),
        Glucose: Number(row.Glucose),
        BloodPressure: Number(row.BloodPressure),
        SkinThickness: Number(row.SkinThickness),
        Insulin: Number(row.Insulin),
        BMI: Number(row.BMI),
        DiabetesPedigreeFunction: Number(
          row.DiabetesPedigreeFunction
        ),
        Age: Number(row.Age),

        prediction: Number(row.prediction),
        probability: Number(row.probability),
        percentage: Number(row.percentage),
      }));

      const response = await fetch(
        "http://127.0.0.1:8000/patients/batch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patients),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "No fue posible guardar las predicciones."
        );
      }

      const data: SaveResponse = await response.json();

      setSaveResult(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error guardando los resultados."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setSaveResult(null);
    setError("");

    const input = document.getElementById(
      "batch-file"
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  };

  const downloadResults = () => {
    if (!result) return;

    const rows = result.results;

    if (rows.length === 0) return;

    const headers = Object.keys(rows[0]);

    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = row[header] ?? "";

            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];

    const blob = new Blob(
      [csvRows.join("\n")],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "predicciones_diabetes.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const getPercentage = (row: PredictionResult) => {
    if (row.percentage !== undefined) {
      return Number(row.percentage);
    }

    if (row.probability !== undefined) {
      return Number(row.probability) * 100;
    }

    return 0;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Procesamiento masivo
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Predicción masiva
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Carga un archivo CSV o Excel con múltiples pacientes
            para ejecutar estimaciones utilizando el modelo de
            aprendizaje automático.
          </p>
        </div>

        {result && (
          <Button
            variant="outline"
            onClick={downloadResults}
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar resultados
          </Button>
        )}
      </div>

      {/* CARGA */}
      <section className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileSpreadsheet className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Archivo de pacientes
              </h2>

              <p className="text-xs text-slate-500">
                CSV o Excel (.xlsx)
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <label
            htmlFor="batch-file"
            className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50/30"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Upload className="h-7 w-7 text-blue-600" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              {file
                ? file.name
                : "Selecciona el archivo de pacientes"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Haz clic para seleccionar un archivo CSV o Excel
            </p>

            <span className="mt-4 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
              Máximo recomendado: archivos de tamaño moderado
            </span>

            <input
              id="batch-file"
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {file && (
            <div className="mt-5 flex flex-col gap-4 rounded-xl border bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Archivo seleccionado
                  </p>

                  <p className="text-xs text-slate-500">
                    {file.name} ·{" "}
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <Button
                onClick={handlePredict}
                disabled={loading}
              >
                <Brain className="mr-2 h-4 w-4" />

                {loading
                  ? "Procesando..."
                  : "Ejecutar estimación"}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="font-semibold text-red-900">
                Error
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RESULTADOS */}
      {result && (
        <>
          {/* MÉTRICAS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Pacientes procesados"
              value={result.total}
              icon={<Users className="h-5 w-5" />}
            />

            <MetricCard
              title="Estimaciones positivas"
              value={result.positive}
              icon={<AlertTriangle className="h-5 w-5" />}
              variant="danger"
            />

            <MetricCard
              title="Estimaciones negativas"
              value={result.negative}
              icon={<CheckCircle2 className="h-5 w-5" />}
              variant="success"
            />

            <MetricCard
              title="Probabilidad promedio"
              value={`${Number(
                result.average_probability
              ).toFixed(2)}%`}
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>

          {/* ACCIONES */}
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">
                  Resultados listos
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Puedes revisar los resultados antes de
                  almacenarlos en el sistema.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={downloadResults}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar
                </Button>

                <Button
                  variant="outline"
                  onClick={handleClear}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpiar
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="mr-2 h-4 w-4" />

                  {saving
                    ? "Guardando..."
                    : "Guardar resultados"}
                </Button>
              </div>
            </div>
          </section>

          {/* GUARDADO */}
          {saveResult && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="font-semibold text-emerald-900">
                    Procesamiento completado
                  </p>

                  <p className="mt-1 text-sm text-emerald-800">
                    Recibidos:{" "}
                    <strong>
                      {saveResult.total_received}
                    </strong>
                    {" · "}
                    Guardados:{" "}
                    <strong>{saveResult.saved}</strong>
                    {" · "}
                    Omitidos:{" "}
                    <strong>{saveResult.skipped}</strong>
                    {" · "}
                    Errores:{" "}
                    <strong>{saveResult.errors}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TABLA */}
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-6 py-5">
              <h2 className="font-semibold text-slate-900">
                Resultados de la estimación
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Se muestran los registros procesados por el
                modelo.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-5 py-4 font-semibold text-slate-600">
                      #
                    </th>

                    <th className="px-5 py-4 font-semibold text-slate-600">
                      Paciente
                    </th>

                    <th className="px-5 py-4 font-semibold text-slate-600">
                      Glucosa
                    </th>

                    <th className="px-5 py-4 font-semibold text-slate-600">
                      IMC
                    </th>

                    <th className="px-5 py-4 font-semibold text-slate-600">
                      Edad
                    </th>

                    <th className="px-5 py-4 font-semibold text-slate-600">
                      Resultado
                    </th>

                    <th className="px-5 py-4 font-semibold text-slate-600">
                      Probabilidad
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {result.results.map((row, index) => {
                    const prediction =
                      Number(row.prediction) === 1;

                    const percentage = getPercentage(row);

                    return (
                      <tr
                        key={index}
                        className="border-b last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-slate-800">
                              {row.nombre ||
                                `Paciente ${index + 1}`}
                            </p>

                            {row.documento && (
                              <p className="text-xs text-slate-400">
                                {row.documento}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-700">
                          {row.Glucose ?? "-"} mg/dL
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {row.BMI ?? "-"}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {row.Age ?? "-"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                              prediction
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {prediction ? (
                              <XCircle className="h-3.5 w-3.5" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}

                            {prediction
                              ? "Positiva"
                              : "Negativa"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-blue-600"
                                style={{
                                  width: `${Math.min(
                                    Math.max(percentage, 0),
                                    100
                                  )}%`,
                                }}
                              />
                            </div>

                            <span className="font-semibold text-slate-800">
                              {percentage.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* INSTRUCCIONES */}
      {!result && !loading && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-3">
            <Instruction
              number="01"
              title="Carga el archivo"
              description="Selecciona un CSV o Excel con las variables requeridas por el modelo."
            />

            <Instruction
              number="02"
              title="Ejecuta la estimación"
              description="El sistema procesa cada registro utilizando el modelo MLP entrenado."
            />

            <Instruction
              number="03"
              title="Revisa y guarda"
              description="Analiza los resultados y almacénalos en el historial del sistema."
            />
          </div>
        </section>
      )}

      {/* AVISO */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

          <div>
            <p className="font-semibold text-amber-900">
              Uso de investigación
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              Las probabilidades mostradas corresponden a la
              salida del modelo de aprendizaje automático. Este
              prototipo está destinado a investigación y apoyo al
              análisis, y no debe utilizarse como diagnóstico
              médico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "default" | "danger" | "success";
}

function MetricCard({
  title,
  value,
  icon,
  variant = "default",
}: MetricCardProps) {
  const styles = {
    default: "bg-blue-50 text-blue-600",
    danger: "bg-red-50 text-red-600",
    success: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[variant]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

interface InstructionProps {
  number: string;
  title: string;
  description: string;
}

function Instruction({
  number,
  title,
  description,
}: InstructionProps) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
        {number}
      </div>

      <div>
        <h3 className="font-semibold text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}