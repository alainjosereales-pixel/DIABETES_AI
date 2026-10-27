import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Brain,
  Database,
  FileSpreadsheet,
  FlaskConical,
  Gauge,
  History,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useNavigate } from "react-router-dom";
import { API_URL } from "./services/api";

interface DashboardData {
  metrics: {
    total_patients: number;
    total_predictions: number;
    positive_predictions: number;
    negative_predictions: number;
    average_probability_percentage: number;
    model_version: string;
  };
  model: {
    name?: string;
    model_name?: string;
    version?: string;
    model_type?: string;
    validation_roc_auc?: number;
    test_metrics?: {
      roc_auc?: number;
      accuracy?: number;
      precision?: number;
      recall?: number;
      f1?: number;
    };
  };
  recent_predictions: Array<{
    id: number;
    prediction: number;
    probability: number;
    percentage: number;
    model_version: string;
    fecha_prediccion: string;
    patient_name?: string;
  }>;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("es-CO").format(value);

const formatPercentage = (value: number) =>
  `${Number(value || 0).toFixed(2)}%`;

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
  valueClass = "text-slate-950",
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  iconClass: string;
  valueClass?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-slate-100 opacity-60 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {title}
          </p>

          <p className={`mt-3 text-3xl font-bold tracking-tight ${valueClass}`}>
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
        {eyebrow}
      </p>

      <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
}

function QuickAction({
  title,
  description,
  icon: Icon,
  onClick,
  className,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  className: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Icon className="h-6 w-6 text-white" />
          </div>

          <ArrowUpRight className="h-5 w-5 text-white/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>

        <h3 className="mt-6 text-base font-bold text-white">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-white/75">{description}</p>
      </div>
    </button>
  );
}

export default function App() {
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/dashboard`);

        if (!response.ok) {
          throw new Error("No se pudo cargar el dashboard");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError(
          "No fue posible conectar con el servicio de Diabetes AI."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const metrics = data?.metrics;

  const positive = metrics?.positive_predictions ?? 0;
  const negative = metrics?.negative_predictions ?? 0;

  const pieData = [
    {
      name: "Estimación positiva",
      value: positive,
    },
    {
      name: "Estimación negativa",
      value: negative,
    },
  ];

  const recentData =
    data?.recent_predictions?.slice(0, 8).map((item, index) => ({
      name: `P${index + 1}`,
      porcentaje: Number(item.percentage || 0),
    })) ?? [];

  const model = data?.model;

  const modelName =
    model?.name ||
    model?.model_name ||
    "MLP Diabetes Prediction";

  const modelVersion =
    model?.version ||
    metrics?.model_version ||
    "1.0.0";

  const rocAuc =
    model?.test_metrics?.roc_auc ??
    model?.validation_roc_auc ??
    0;

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Activity className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-900">
            Inicializando Diabetes AI
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Cargando información de investigación...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Activity className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-900">
            Servicio no disponible
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 px-7 py-8 text-white shadow-xl shadow-blue-950/10">
        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Plataforma operativa
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Diabetes <span className="text-blue-300">AI</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Plataforma inteligente para investigación y estimación
              de riesgo de diabetes mediante modelos de Machine
              Learning.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/patients/new")}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg transition hover:bg-blue-50"
              >
                <Plus className="h-4 w-4" />
                Nueva estimación
              </button>

              <button
                onClick={() => navigate("/model")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                <Brain className="h-4 w-4" />
                Explorar modelo
              </button>
            </div>
          </div>

          <div className="min-w-[230px] rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200">
              <Sparkles className="h-4 w-4" />
              Modelo activo
            </div>

            <p className="mt-3 text-lg font-bold text-white">
              {modelName}
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
              <span className="text-slate-400">Versión</span>
              <span className="font-semibold text-white">
                v{modelVersion}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">Estado</span>

              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Operativo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section>
        <SectionHeader
          eyebrow="Resumen del sistema"
          title="Actividad de la plataforma"
          description="Indicadores consolidados del entorno de investigación."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Pacientes"
            value={formatNumber(metrics?.total_patients ?? 0)}
            description="Registros almacenados"
            icon={Users}
            iconClass="bg-blue-50 text-blue-600"
          />

          <MetricCard
            title="Predicciones"
            value={formatNumber(metrics?.total_predictions ?? 0)}
            description="Estimaciones realizadas"
            icon={Brain}
            iconClass="bg-violet-50 text-violet-600"
          />

          <MetricCard
            title="Positivas"
            value={formatNumber(positive)}
            description="Estimaciones de mayor riesgo"
            icon={TrendingUp}
            iconClass="bg-amber-50 text-amber-600"
            valueClass="text-amber-600"
          />

          <MetricCard
            title="Riesgo promedio"
            value={formatPercentage(
              metrics?.average_probability_percentage ?? 0
            )}
            description="Probabilidad estimada promedio"
            icon={Gauge}
            iconClass="bg-emerald-50 text-emerald-600"
            valueClass="text-emerald-600"
          />
        </div>
      </section>

      {/* ANALYTICS */}
      <section className="grid gap-5 xl:grid-cols-5">
        {/* Recent chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
                Análisis
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-950">
                Estimaciones recientes
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Porcentaje estimado por predicción procesada.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 h-[280px]">
            {recentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={recentData}
                  margin={{
                    top: 10,
                    right: 5,
                    left: -15,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    tickFormatter={(value) => `${value}%`}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${Number(value).toFixed(2)}%`,
                      "Estimación",
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow:
                        "0 10px 30px rgba(15, 23, 42, 0.10)",
                    }}
                  />

                  <Bar
                    dataKey="porcentaje"
                    radius={[7, 7, 0, 0]}
                    fill="#2563eb"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No hay suficientes predicciones para mostrar.
              </div>
            )}
          </div>
        </div>

        {/* Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600">
                Distribución
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-950">
                Resultados del modelo
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Distribución de las estimaciones almacenadas.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Database className="h-5 w-5" />
            </div>
          </div>

          <div className="relative mt-3 h-[220px]">
            {positive + negative > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={88}
                      paddingAngle={4}
                      stroke="none"
                    >
                      <Cell fill="#7c3aed" />
                      <Cell fill="#cbd5e1" />
                    </Pie>

                    <Tooltip
                      formatter={(value, name) => [
                        value,
                        name,
                      ]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-slate-950">
                      {positive + negative}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      total
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Sin datos disponibles.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-violet-50 p-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-600" />
                <span className="text-xs font-semibold text-slate-600">
                  Positivas
                </span>
              </div>

              <p className="mt-1 text-xl font-bold text-violet-700">
                {positive}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                <span className="text-xs font-semibold text-slate-600">
                  Negativas
                </span>
              </div>

              <p className="mt-1 text-xl font-bold text-slate-700">
                {negative}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI MODEL */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[1fr_auto]">
          <div className="p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-600/20">
                <Brain className="h-6 w-6" />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600">
                  Inteligencia artificial
                </p>

                <h2 className="text-xl font-bold text-slate-950">
                  Modelo de estimación de riesgo
                </h2>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-500">
              El sistema utiliza un modelo de Machine Learning
              entrenado para analizar ocho variables de entrada y
              generar una estimación de riesgo. Los resultados están
              destinados al contexto de investigación y apoyo al
              análisis, no constituyen un diagnóstico médico.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Arquitectura
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  MLPClassifier
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Variables
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  8 características
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  ROC-AUC
                </p>

                <p className="mt-1 font-bold text-blue-600">
                  {rocAuc
                    ? `${(rocAuc * 100).toFixed(2)}%`
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex min-w-[260px] flex-col justify-between bg-gradient-to-br from-slate-950 to-blue-950 p-7 text-white">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
                <ShieldCheck className="h-4 w-4" />
                Entorno de investigación
              </div>

              <p className="mt-4 text-2xl font-bold">
                v{modelVersion}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Modelo actualmente cargado
              </p>
            </div>

            <button
              onClick={() => navigate("/model")}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Ver información técnica
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section>
        <SectionHeader
          eyebrow="Operaciones"
          title="Acciones rápidas"
          description="Accede directamente a los principales módulos de la plataforma."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <QuickAction
            title="Nueva estimación"
            description="Analizar un nuevo conjunto de variables clínicas."
            icon={Plus}
            onClick={() => navigate("/patients/new")}
            className="bg-gradient-to-br from-blue-600 to-blue-700"
          />

          <QuickAction
            title="Registrar paciente"
            description="Crear un nuevo registro dentro de la plataforma."
            icon={UserPlus}
            onClick={() => navigate("/patients/new")}
            className="bg-gradient-to-br from-violet-600 to-violet-700"
          />

          <QuickAction
            title="Predicción masiva"
            description="Procesar múltiples registros mediante CSV o XLSX."
            icon={FileSpreadsheet}
            onClick={() => navigate("/predictions/batch")}
            className="bg-gradient-to-br from-cyan-600 to-cyan-700"
          />

          <QuickAction
            title="Historial"
            description="Consultar las estimaciones almacenadas."
            icon={History}
            onClick={() => navigate("/history")}
            className="bg-gradient-to-br from-slate-700 to-slate-900"
          />
        </div>
      </section>

      {/* RESEARCH STATUS */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-violet-50 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <FlaskConical className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Proyecto en fase de investigación
              </h3>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                Diabetes AI es un prototipo de investigación. Las
                estimaciones generadas por el modelo deben interpretarse
                dentro del contexto experimental y no sustituyen la
                valoración de un profesional de la salud.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/model")}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
          >
            Ver metodología
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}