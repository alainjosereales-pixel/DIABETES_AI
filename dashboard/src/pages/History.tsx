import { useEffect, useMemo, useState } from "react";
import {
  Search,
  History as HistoryIcon,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  CalendarDays,
  Brain,
  User,
} from "lucide-react";
import { API_URL } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Prediction {
  id: number;
  patient_id: number;
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
}

interface HistoryRecord extends Prediction {
  patient?: Patient;
}

export default function History() {
  const [predictions, setPredictions] = useState<HistoryRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/predictions/history`
        );

        if (!response.ok) {
          throw new Error(
            "No fue posible obtener el historial."
          );
        }

        const data = await response.json();

        setPredictions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);

        setError(
          "No fue posible cargar el historial de estimaciones."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filteredPredictions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return predictions;
    }

    return predictions.filter((item) => {
      const patientName =
        item.patient?.nombre?.toLowerCase() || "";

      const document =
        item.patient?.documento?.toLowerCase() || "";

      return (
        patientName.includes(term) ||
        document.includes(term) ||
        String(item.patient_id).includes(term) ||
        String(item.id).includes(term) ||
        item.model_version.toLowerCase().includes(term)
      );
    });
  }, [predictions, search]);

  const total = predictions.length;

  const positive = predictions.filter(
    (item) => item.prediction === 1
  ).length;

  const negative = predictions.filter(
    (item) => item.prediction === 0
  ).length;

  const averageProbability =
    total > 0
      ? predictions.reduce(
          (sum, item) => sum + Number(item.percentage || 0),
          0
        ) / total
      : 0;

  const formatDate = (date?: string) => {
    if (!date) return "Sin fecha";

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

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Seguimiento
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Historial de estimaciones
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Consulta el registro histórico de las estimaciones
          realizadas por el sistema y los modelos utilizados.
        </p>
      </div>

      {/* MÉTRICAS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de estimaciones"
          value={total}
          icon={<HistoryIcon className="h-5 w-5" />}
        />

        <MetricCard
          title="Estimaciones positivas"
          value={positive}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="danger"
        />

        <MetricCard
          title="Estimaciones negativas"
          value={negative}
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="success"
        />

        <MetricCard
          title="Probabilidad promedio"
          value={`${averageProbability.toFixed(2)}%`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* BÚSQUEDA */}
      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Registro de estimaciones
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Busca por paciente, documento, ID o versión del
              modelo.
            </p>
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar en el historial..."
              className="pl-9"
            />
          </div>
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

      {/* TABLA */}
      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Historial
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Mostrando {filteredPredictions.length} de{" "}
              {predictions.length} registros.
            </p>
          </div>

          {search && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearch("")}
            >
              Limpiar búsqueda
            </Button>
          )}
        </div>

        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : filteredPredictions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <HistoryIcon className="h-6 w-6 text-slate-400" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              No hay estimaciones
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "No encontramos resultados para tu búsqueda."
                : "Todavía no existen estimaciones registradas."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-5 py-4 font-semibold text-slate-600">
                    Paciente
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-600">
                    Fecha
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-600">
                    Resultado
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-600">
                    Probabilidad
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-600">
                    Modelo
                  </th>

                  <th className="px-5 py-4 font-semibold text-slate-600">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPredictions.map((item) => {
                  const isPositive =
                    item.prediction === 1;

                  const percentage = Number(
                    item.percentage || 0
                  );

                  return (
                    <tr
                      key={item.id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      {/* PACIENTE */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <User className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {item.patient?.nombre ||
                                `Paciente #${item.patient_id}`}
                            </p>

                            {item.patient?.documento && (
                              <p className="text-xs text-slate-400">
                                {item.patient.documento}
                              </p>
                            )}

                            <p className="text-xs text-slate-400">
                              ID #{item.patient_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* FECHA */}
                      <td className="px-5 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-slate-400" />

                          <span>
                            {formatDate(
                              item.fecha_prediccion
                            )}
                          </span>
                        </div>
                      </td>

                      {/* RESULTADO */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            isPositive
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {isPositive ? (
                            <AlertTriangle className="h-3.5 w-3.5" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}

                          {isPositive
                            ? "Positiva"
                            : "Negativa"}
                        </span>
                      </td>

                      {/* PROBABILIDAD */}
                      <td className="px-5 py-4">
                        <div className="flex min-w-36 items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{
                                width: `${Math.min(
                                  Math.max(
                                    percentage,
                                    0
                                  ),
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

                      {/* MODELO */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Brain className="h-4 w-4 text-violet-500" />

                          {item.model_version}
                        </div>
                      </td>

                      {/* ESTADO */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-xs text-slate-600">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />

                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* RESUMEN */}
      {predictions.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Brain className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Modelo utilizado
                </p>

                <p className="text-xs text-slate-500">
                  {predictions[0]?.model_version ||
                    "No disponible"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Registros encontrados
                </p>

                <p className="text-xs text-slate-500">
                  {filteredPredictions.length} registros coinciden
                  con la consulta actual.
                </p>
              </div>
            </div>
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
              Las estimaciones registradas representan la salida
              del modelo de aprendizaje automático. Este sistema
              corresponde a un prototipo de investigación y no
              constituye una herramienta de diagnóstico médico.
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