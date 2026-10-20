import { useEffect, useState } from "react";
import {
  Brain,
  Database,
  Target,
  BarChart3,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Layers3,
  FlaskConical,
} from "lucide-react";

interface ModelInfo {
  model_name?: string;
  version?: string;
  model_type?: string;
  task?: string;
  target?: string;
  features?: string[];
  hyperparameters?: Record<string, unknown>;
  training_dataset?: string;
  training_rows?: number;
  test_rows?: number;
  test_metrics?: Record<string, number>;
  validation_roc_auc?: number;
  threshold?: number;
  threshold_selection_metric?: string;
  feature_importance?: Record<string, number>;
  status?: string;
}

export default function Model() {
  const [model, setModel] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://127.0.0.1:8000/model"
        );

        if (!response.ok) {
          throw new Error(
            "No fue posible obtener la información del modelo."
          );
        }

        const data = await response.json();

        setModel(data);
      } catch (err) {
        console.error(err);

        setError(
          "No fue posible cargar la información del modelo."
        );
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-8 w-72 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-96 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-white shadow-sm"
            />
          ))}
        </div>

        <div className="h-80 animate-pulse rounded-2xl bg-white shadow-sm" />
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />

            <div>
              <h2 className="font-semibold text-red-900">
                No se pudo cargar el modelo
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error || "Información del modelo no disponible."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const features = model.features || [];
  const hyperparameters = model.hyperparameters || {};
  const importance = model.feature_importance || {};

  const importanceEntries = Object.entries(importance).sort(
    ([, valueA], [, valueB]) => Number(valueB) - Number(valueA)
  );

  const testMetrics = model.test_metrics || {};

  const formatMetric = (value?: number) => {
    if (value === undefined || value === null) {
      return "—";
    }

    return Number(value).toFixed(4);
  };

  const formatPercentage = (value?: number) => {
    if (value === undefined || value === null) {
      return "—";
    }

    return `${(Number(value) * 100).toFixed(2)}%`;
  };

  const formatHyperparameter = (value: unknown) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }

    return String(value);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Inteligencia artificial
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Modelo de estimación
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Información técnica del modelo de aprendizaje automático
          utilizado por Diabetes AI para generar estimaciones de
          riesgo.
        </p>
      </div>

      {/* IDENTIDAD DEL MODELO */}
      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="border-b bg-gradient-to-r from-blue-50 to-violet-50 px-6 py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <Brain className="h-7 w-7" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Modelo activo
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {model.model_name || "MLP Diabetes Prediction"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {model.model_type || "MLPClassifier"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 lg:self-auto">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              {model.status || "research_prototype"}
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={<Layers3 className="h-5 w-5" />}
            label="Versión"
            value={model.version || "1.0.0"}
          />

          <InfoCard
            icon={<Target className="h-5 w-5" />}
            label="Variable objetivo"
            value={model.target || "Outcome"}
          />

          <InfoCard
            icon={<Activity className="h-5 w-5" />}
            label="Tipo de tarea"
            value={model.task || "Clasificación binaria"}
          />

          <InfoCard
            icon={<Database className="h-5 w-5" />}
            label="Dataset"
            value={model.training_dataset || "Pima Indians Diabetes Database"}
          />
        </div>
      </section>

      {/* MÉTRICAS */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Evaluación del modelo
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Métricas registradas durante el entrenamiento y la
            evaluación independiente.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="ROC-AUC validación"
            value={formatMetric(model.validation_roc_auc)}
            description="Validación cruzada"
            icon={<BarChart3 className="h-5 w-5" />}
          />

          <MetricCard
            title="ROC-AUC prueba"
            value={formatMetric(testMetrics.roc_auc)}
            description="Conjunto de prueba"
            icon={<Target className="h-5 w-5" />}
          />

          <MetricCard
            title="Accuracy"
            value={formatPercentage(testMetrics.accuracy)}
            description="Conjunto de prueba"
            icon={<CheckCircle2 className="h-5 w-5" />}
          />

          <MetricCard
            title="F1"
            value={formatMetric(testMetrics.f1)}
            description="Conjunto de prueba"
            icon={<Activity className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* DATOS DE ENTRENAMIENTO */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Database className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Datos de entrenamiento
                </h2>

                <p className="text-xs text-slate-500">
                  Información del conjunto utilizado
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y">
            <DetailRow
              label="Dataset"
              value={
                model.training_dataset ||
                "Pima Indians Diabetes Database"
              }
            />

            <DetailRow
              label="Registros entrenamiento"
              value={String(model.training_rows ?? "—")}
            />

            <DetailRow
              label="Registros prueba"
              value={String(model.test_rows ?? "—")}
            />

            <DetailRow
              label="Variables de entrada"
              value={String(features.length)}
            />

            <DetailRow
              label="Variable objetivo"
              value={model.target || "Outcome"}
            />
          </div>
        </section>

        {/* UMBRAL */}
        <section className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Target className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Configuración de decisión
                </h2>

                <p className="text-xs text-slate-500">
                  Parámetros utilizados para interpretar la salida
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-2xl bg-slate-50 p-6">
              <p className="text-sm font-medium text-slate-500">
                Umbral candidato
              </p>

              <p className="mt-2 text-4xl font-bold text-slate-900">
                {model.threshold !== undefined
                  ? Number(model.threshold).toFixed(2)
                  : "—"}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Seleccionado utilizando{" "}
                <strong className="text-slate-700">
                  {model.threshold_selection_metric || "F1"}
                </strong>{" "}
                sobre el conjunto de validación.
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />

                <p className="text-sm leading-6 text-amber-800">
                  Este umbral es un parámetro de desarrollo del
                  prototipo y no representa un punto de corte
                  clínico validado.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* VARIABLES */}
      <section className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FlaskConical className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Variables de entrada
              </h2>

              <p className="text-xs text-slate-500">
                Variables utilizadas por el modelo para realizar la
                estimación.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature}
              className="rounded-xl border bg-slate-50 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-500 shadow-sm">
                  {index + 1}
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  {feature}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* IMPORTANCIA */}
      <section className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BarChart3 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Importancia de variables
              </h2>

              <p className="text-xs text-slate-500">
                Importancia registrada para la interpretación del
                modelo.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6">
          {importanceEntries.length > 0 ? (
            importanceEntries.map(([feature, value]) => {
              const numericValue = Number(value);

              const maxImportance =
                importanceEntries.length > 0
                  ? Math.max(
                      ...importanceEntries.map(([, item]) =>
                        Number(item)
                      )
                    )
                  : 1;

              const width =
                maxImportance > 0
                  ? (numericValue / maxImportance) * 100
                  : 0;

              return (
                <div key={feature}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-700">
                      {feature}
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      {numericValue.toFixed(4)}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${Math.min(
                          Math.max(width, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <BarChart3 className="mx-auto h-8 w-8 text-slate-400" />

              <p className="mt-3 text-sm font-medium text-slate-700">
                No hay información de importancia disponible.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* HIPERPARÁMETROS */}
      <section className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Settings2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Hiperparámetros
              </h2>

              <p className="text-xs text-slate-500">
                Configuración registrada del modelo seleccionado.
              </p>
            </div>
          </div>
        </div>

        {Object.keys(hyperparameters).length > 0 ? (
          <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(hyperparameters).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="rounded-xl border bg-slate-50 p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {key}
                  </p>

                  <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                    {formatHyperparameter(value)}
                  </p>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-slate-500">
            No hay hiperparámetros registrados.
          </div>
        )}
      </section>

      {/* LIMITACIONES */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex gap-4">
          <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />

          <div>
            <h2 className="font-semibold text-amber-900">
              Limitaciones del modelo
            </h2>

            <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-800">
              <li>
                • El modelo corresponde a un prototipo de
                investigación.
              </li>

              <li>
                • Las probabilidades son salidas del modelo y no
                equivalen automáticamente a probabilidades clínicas
                calibradas.
              </li>

              <li>
                • El dataset utilizado corresponde a una población
                específica y sus resultados no deben generalizarse
                automáticamente a otras poblaciones.
              </li>

              <li>
                • El sistema no sustituye la valoración ni el
                diagnóstico de un profesional de la salud.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ESTADO */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          <div>
            <p className="font-semibold text-emerald-900">
              Modelo cargado correctamente
            </p>

            <p className="text-sm text-emerald-700">
              Diabetes AI está utilizando la versión{" "}
              {model.version || "1.0.0"} del modelo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoCard({
  icon,
  label,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

function MetricCard({
  title,
  value,
  description,
  icon,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}