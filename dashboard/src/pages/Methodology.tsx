import {
  Activity,
  BarChart3,
  Brain,
  CheckCircle2,
  Database,
  FlaskConical,
  GitBranch,
  Info,
  Layers3,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import ModelEvaluation from "@/components/ModelEvaluation";

const steps = [
  {
    number: "01",
    title: "Definición del problema",
    description:
      "Se plantea la estimación del riesgo de diabetes a partir de variables clínicas disponibles en el conjunto de datos.",
    icon: FlaskConical,
  },
  {
    number: "02",
    title: "Preparación de los datos",
    description:
      "Se revisan los datos, se identifican valores problemáticos y se realiza el tratamiento necesario antes del entrenamiento.",
    icon: Database,
  },
  {
    number: "03",
    title: "Preprocesamiento",
    description:
      "Los datos pasan por un pipeline de procesamiento que permite preparar las variables para los modelos de Machine Learning.",
    icon: Layers3,
  },
  {
    number: "04",
    title: "Entrenamiento",
    description:
      "Se entrenan diferentes algoritmos de clasificación y se comparan mediante validación cruzada estratificada.",
    icon: Brain,
  },
  {
    number: "05",
    title: "Optimización",
    description:
      "Los hiperparámetros se ajustan mediante GridSearchCV utilizando únicamente los datos destinados al entrenamiento.",
    icon: GitBranch,
  },
  {
    number: "06",
    title: "Evaluación",
    description:
      "Los modelos se evalúan sobre un conjunto de prueba independiente mediante diferentes métricas de clasificación.",
    icon: BarChart3,
  },
  {
    number: "07",
    title: "Interpretabilidad",
    description:
      "Se utilizan técnicas como Permutation Importance y SHAP para analizar la contribución de las variables al comportamiento del modelo.",
    icon: Sparkles,
  },
];

const features = [
  "Pregnancies",
  "Glucose",
  "BloodPressure",
  "SkinThickness",
  "Insulin",
  "BMI",
  "DiabetesPedigreeFunction",
  "Age",
];

const metrics = [
  {
    name: "ROC-AUC",
    value: "81.61%",
    description: "Evaluación independiente en test",
  },
  {
    name: "F1-Score",
    value: "60.00%",
    description: "Evaluación independiente en test",
  },
  {
    name: "Brier Score",
    value: "0.1700",
    description: "Evaluación de las probabilidades estimadas",
  },
  {
    name: "Umbral",
    value: "0.45",
    description: "Candidato seleccionado sobre validación",
  },
];

export default function Methodology() {
  return (
    <div className="space-y-7 pb-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-7 py-8 text-white shadow-xl">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100 backdrop-blur-sm">
            <FlaskConical className="h-3.5 w-3.5" />
            Metodología científica
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Metodología de <span className="text-blue-300">Diabetes AI</span>
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            Flujo metodológico utilizado para la construcción, evaluación
            e interpretación del modelo de Machine Learning.
          </p>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
                Problema de investigación
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950">
                Estimación del riesgo de diabetes
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Diabetes AI utiliza técnicas de aprendizaje automático
                supervisado para analizar variables clínicas y generar una
                estimación asociada al riesgo de diabetes.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                El sistema se plantea como una herramienta experimental de
                apoyo al análisis y la investigación. La salida del modelo
                no constituye por sí misma un diagnóstico médico.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600">
            Dataset
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-950">
            Pima Indians
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Diabetes Database
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Registros
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                768
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Variables
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                8
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-blue-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
              Variable objetivo
            </p>

            <p className="mt-1 text-sm font-bold text-blue-900">
              Outcome
            </p>
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <section>
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
            Flujo experimental
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-950">
            Proceso metodológico
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Etapas principales utilizadas durante el desarrollo del modelo.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="text-xs font-bold tracking-wider text-slate-300">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-5 text-sm font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* DATA PREPARATION */}
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Database className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600">
                Datos de entrada
              </p>

              <h2 className="text-lg font-bold text-slate-950">
                Variables utilizadas
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={feature}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-blue-600 shadow-sm">
                  {index + 1}
                </span>

                <span className="text-xs font-medium text-slate-700">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TRAIN / TEST */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <GitBranch className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
                División experimental
              </p>

              <h2 className="text-lg font-bold text-slate-950">
                Entrenamiento y prueba
              </h2>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Entrenamiento
                </p>

                <p className="mt-1 text-3xl font-bold text-blue-600">
                  614
                </p>

                <p className="text-xs text-slate-400">
                  registros
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-medium text-slate-500">
                  Prueba
                </p>

                <p className="mt-1 text-3xl font-bold text-violet-600">
                  154
                </p>

                <p className="text-xs text-slate-400">
                  registros
                </p>
              </div>
            </div>

            <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="w-[80%] bg-blue-600" />
              <div className="w-[20%] bg-violet-500" />
            </div>

            <div className="mt-3 flex justify-between text-[10px] font-semibold">
              <span className="text-blue-600">
                80% entrenamiento
              </span>

              <span className="text-violet-600">
                20% prueba
              </span>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-xs leading-5 text-slate-500">
                La evaluación final se realiza sobre datos de prueba
                independientes del proceso de entrenamiento y optimización.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MODEL EVALUATION */}
      <section>
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-600">
            Evaluación
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-950">
            Resultados del modelo utilizado
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Métricas obtenidas sobre el conjunto de prueba independiente.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.name}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {metric.name}
              </p>

              <p className="mt-3 text-3xl font-bold text-slate-950">
                {metric.value}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* INTERPRETABILITY */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600">
                Interpretabilidad
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950">
                Comprender el comportamiento del modelo
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Se utilizaron técnicas de interpretabilidad para estudiar
                qué variables tienen mayor influencia en las predicciones
                generadas por el modelo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-lg font-bold text-slate-900">SHAP</p>
              <p className="text-[9px] uppercase tracking-wider text-slate-400">
                Método
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-lg font-bold text-slate-900">PI</p>
              <p className="text-[9px] uppercase tracking-wider text-slate-400">
                Importance
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-lg font-bold text-blue-600">Glucose</p>
              <p className="text-[9px] uppercase tracking-wider text-slate-400">
                Principal
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-lg font-bold text-violet-600">BMI</p>
              <p className="text-[9px] uppercase tracking-wider text-slate-400">
                Relevante
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MODEL EVALUATION */}
      <ModelEvaluation />
      
      {/* LIMITATIONS */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm">
            <ShieldAlert className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">
              Limitaciones y alcance
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-950">
              Interpretación responsable
            </h2>

            <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <p>
                • El conjunto de datos utilizado corresponde a una población
                específica y su representatividad para otras poblaciones
                debe evaluarse.
              </p>

              <p>
                • Las métricas corresponden al experimento realizado y no
                representan validación clínica.
              </p>

              <p>
                • La salida del modelo debe considerarse una estimación
                computacional de riesgo y no un diagnóstico.
              </p>

              <p>
                • La importancia de una variable en el modelo no implica
                causalidad clínica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL STATUS */}
      <section className="rounded-2xl bg-slate-950 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-bold">
                Metodología documentada
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Diabetes AI · Research Prototype · Modelo v1.0.0
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="h-4 w-4" />
            <span>
              Resultados destinados al contexto de investigación
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}