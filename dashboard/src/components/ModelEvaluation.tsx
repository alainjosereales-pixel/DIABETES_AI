import {
  BarChart3,
  CheckCircle2,
  Target,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const models = [
  {
    name: "Logistic Regression",
    accuracy: 68.83,
    precision: 56.52,
    recall: 48.15,
    f1: 52.0,
    rocAuc: 81.04,
  },
  {
    name: "SVM",
    accuracy: 70.78,
    precision: 60.98,
    recall: 46.30,
    f1: 52.63,
    rocAuc: 80.52,
  },
  {
    name: "KNN",
    accuracy: 75.32,
    precision: 68.18,
    recall: 55.56,
    f1: 61.22,
    rocAuc: 81.24,
  },
  {
    name: "Random Forest",
    accuracy: 72.73,
    precision: 64.29,
    recall: 50.0,
    f1: 56.25,
    rocAuc: 80.43,
  },
  {
    name: "MLP",
    accuracy: 74.03,
    precision: 65.22,
    recall: 55.56,
    f1: 60.0,
    rocAuc: 81.61,
  },
];

const confusionMatrices = [
  {
    name: "Logistic Regression",
    matrix: [
      [80, 20],
      [28, 26],
    ],
  },
  {
    name: "SVM",
    matrix: [
      [84, 16],
      [29, 25],
    ],
  },
  {
    name: "KNN",
    matrix: [
      [86, 14],
      [24, 30],
    ],
  },
  {
    name: "Random Forest",
    matrix: [
      [85, 15],
      [27, 27],
    ],
  },
  {
    name: "MLP",
    matrix: [
      [84, 16],
      [24, 30],
    ],
  },
];

function MetricBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-bold text-slate-800">{value.toFixed(2)}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ConfusionMatrix({
  name,
  matrix,
}: {
  name: string;
  matrix: number[][];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="mb-4 text-sm font-bold text-slate-800">{name}</h4>

      <div className="grid grid-cols-[70px_1fr_1fr] gap-1 text-center text-xs">
        <div />
        <div className="rounded-lg bg-slate-50 p-2 font-semibold text-slate-500">
          Negativo
        </div>
        <div className="rounded-lg bg-slate-50 p-2 font-semibold text-slate-500">
          Positivo
        </div>

        <div className="flex items-center justify-center rounded-lg bg-slate-50 p-2 font-semibold text-slate-500">
          Negativo
        </div>

        <div className="rounded-lg bg-emerald-50 p-4">
          <div className="text-xl font-bold text-emerald-700">
            {matrix[0][0]}
          </div>
          <div className="mt-1 text-[10px] text-emerald-600">
            Verdadero negativo
          </div>
        </div>

        <div className="rounded-lg bg-amber-50 p-4">
          <div className="text-xl font-bold text-amber-700">
            {matrix[0][1]}
          </div>
          <div className="mt-1 text-[10px] text-amber-600">
            Falso positivo
          </div>
        </div>

        <div className="flex items-center justify-center rounded-lg bg-slate-50 p-2 font-semibold text-slate-500">
          Positivo
        </div>

        <div className="rounded-lg bg-amber-50 p-4">
          <div className="text-xl font-bold text-amber-700">
            {matrix[1][0]}
          </div>
          <div className="mt-1 text-[10px] text-amber-600">
            Falso negativo
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <div className="text-xl font-bold text-blue-700">
            {matrix[1][1]}
          </div>
          <div className="mt-1 text-[10px] text-blue-600">
            Verdadero positivo
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModelEvaluation() {
  const mlp = models.find((model) => model.name === "MLP")!;

  return (
    <section className="mt-10 space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-7 text-white shadow-xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-blue-300">
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                Evaluación experimental
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight">
              Evaluación comparativa de modelos
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Comparación de cinco algoritmos de clasificación mediante
              métricas obtenidas sobre el conjunto de prueba independiente.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/10">
            <div className="text-xs text-slate-400">
              Modelo documentado
            </div>
            <div className="mt-1 text-lg font-bold">MLP v1.0.0</div>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Target className="h-5 w-5 text-blue-600" />
          <p className="mt-3 text-xs font-medium text-slate-500">
            ROC-AUC MLP
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {mlp.rocAuc.toFixed(2)}%
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Conjunto de prueba
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="mt-3 text-xs font-medium text-slate-500">
            Accuracy MLP
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {mlp.accuracy.toFixed(2)}%
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Predicciones correctas
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <p className="mt-3 text-xs font-medium text-slate-500">
            F1-Score MLP
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {mlp.f1.toFixed(2)}%
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Balance precisión/recall
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <p className="mt-3 text-xs font-medium text-slate-500">
            Umbral analizado
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">0.45</p>
          <p className="mt-1 text-xs text-slate-500">
            Seleccionado en validación
          </p>
        </div>
      </div>

      {/* Comparación */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Comparación de rendimiento
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Resultados sobre el conjunto de prueba independiente.
          </p>
        </div>

        <div className="space-y-7">
          {models.map((model) => (
            <div
              key={model.name}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800">
                  {model.name}
                </h4>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  ROC-AUC {model.rocAuc.toFixed(2)}%
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-5">
                <MetricBar label="Accuracy" value={model.accuracy} />
                <MetricBar label="Precision" value={model.precision} />
                <MetricBar label="Recall" value={model.recall} />
                <MetricBar label="F1-Score" value={model.f1} />
                <MetricBar label="ROC-AUC" value={model.rocAuc} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matrices */}
      <div>
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">
            Matrices de confusión
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Distribución de verdaderos positivos, verdaderos negativos,
            falsos positivos y falsos negativos en el conjunto de prueba.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {confusionMatrices.map((item) => (
            <ConfusionMatrix
              key={item.name}
              name={item.name}
              matrix={item.matrix}
            />
          ))}
        </div>
      </div>

      {/* Umbral */}
      <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Target className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              Análisis del umbral de decisión
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Durante la etapa de validación se analizó el comportamiento
              del modelo frente a diferentes umbrales de clasificación. Para
              el MLP se identificó un umbral candidato de <strong>0.45</strong>,
              seleccionado utilizando F1-Score sobre el conjunto de
              validación.
            </p>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Este umbral no representa un punto de corte clínico. Es un
              parámetro experimental del prototipo y requiere validación
              externa antes de cualquier utilización clínica.
            </p>
          </div>
        </div>
      </div>

      {/* Nota ROC */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <p className="text-xs leading-5 text-slate-500">
          <strong className="text-slate-700">Nota metodológica:</strong>{" "}
          los valores ROC-AUC corresponden a la evaluación realizada sobre el
          conjunto de prueba. La curva ROC punto a punto requiere conservar
          las probabilidades de predicción de cada observación; por ello no
          se reconstruye artificialmente a partir del valor AUC.
        </p>
      </div>
    </section>
  );
}