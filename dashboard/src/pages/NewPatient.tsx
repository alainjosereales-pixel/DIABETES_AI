import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  FileText,
  FlaskConical,
  Gauge,
  User,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "../services/api";


interface PredictionResult {
  patient_id: number;
  percentage: number;
  model_version: string;
  prediction?: number;
  probability?: number;
}

function NewPatient() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    documento: "",
    sexo: "",
    fecha_nacimiento: "",
    Pregnancies: 0,
    Glucose: 0,
    BloodPressure: 0,
    SkinThickness: 0,
    Insulin: 0,
    BMI: 0,
    DiabetesPedigreeFunction: 0,
    Age: 0,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "nombre" ||
        name === "documento" ||
        name === "sexo" ||
        name === "fecha_nacimiento"
          ? value
          : Number(value),
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "No se pudo registrar el paciente"
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ENCABEZADO */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            NUEVA ESTIMACIÓN
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Nuevo paciente
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Registra la información del paciente y ejecuta una
            estimación mediante el modelo de aprendizaje automático.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate("/patients")}
          className="gap-2"
        >
          <Users className="h-4 w-4" />
          Ver pacientes
        </Button>
      </div>

      {/* INDICADOR DEL PROCESO */}

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <StepIndicator
            number="1"
            label="Datos personales"
            active
          />

          <div className="hidden h-px w-10 bg-slate-200 sm:block" />

          <StepIndicator
            number="2"
            label="Variables clínicas"
            active
          />

          <div className="hidden h-px w-10 bg-slate-200 sm:block" />

          <StepIndicator
            number="3"
            label="Estimación"
            active={Boolean(result)}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* INFORMACIÓN PERSONAL */}

        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <SectionHeader
            icon={<User className="h-5 w-5" />}
            title="Información personal"
            description="Información básica utilizada para identificar el registro."
          />

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            <FormField label="Nombre completo" required>
              <Input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder="Ej. María Rodríguez"
              />
            </FormField>

            <FormField label="Documento" required>
              <Input
                name="documento"
                value={form.documento}
                onChange={handleChange}
                required
                placeholder="Número de documento"
              />
            </FormField>

            <FormField label="Sexo" required>
              <select
                name="sexo"
                value={form.sexo}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              >
                <option value="">Seleccionar</option>
                <option value="F">Femenino</option>
                <option value="M">Masculino</option>
              </select>
            </FormField>

            <FormField label="Fecha de nacimiento" required>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  type="date"
                  name="fecha_nacimiento"
                  value={form.fecha_nacimiento}
                  onChange={handleChange}
                  required
                  className="pl-9"
                />
              </div>
            </FormField>
          </div>
        </section>

        {/* VARIABLES DEL MODELO */}

        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <SectionHeader
            icon={<FlaskConical className="h-5 w-5" />}
            title="Variables del modelo"
            description="Valores de entrada utilizados por el modelo de estimación."
          />

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 lg:grid-cols-3">
            <InputField
              label="Embarazos"
              name="Pregnancies"
              value={form.Pregnancies}
              onChange={handleChange}
              step="1"
              description="Número de embarazos"
            />

            <InputField
              label="Glucosa"
              name="Glucose"
              value={form.Glucose}
              onChange={handleChange}
              step="0.1"
              description="Concentración de glucosa"
              unit="mg/dL"
            />

            <InputField
              label="Presión arterial"
              name="BloodPressure"
              value={form.BloodPressure}
              onChange={handleChange}
              step="0.1"
              description="Presión arterial diastólica"
              unit="mmHg"
            />

            <InputField
              label="Espesor de piel"
              name="SkinThickness"
              value={form.SkinThickness}
              onChange={handleChange}
              step="0.1"
              description="Espesor del pliegue cutáneo"
              unit="mm"
            />

            <InputField
              label="Insulina"
              name="Insulin"
              value={form.Insulin}
              onChange={handleChange}
              step="0.1"
              description="Nivel de insulina"
              unit="μU/mL"
            />

            <InputField
              label="IMC"
              name="BMI"
              value={form.BMI}
              onChange={handleChange}
              step="0.1"
              description="Índice de masa corporal"
            />

            <InputField
              label="Diabetes Pedigree Function"
              name="DiabetesPedigreeFunction"
              value={form.DiabetesPedigreeFunction}
              onChange={handleChange}
              step="0.001"
              description="Función de antecedentes familiares"
            />

            <InputField
              label="Edad"
              name="Age"
              value={form.Age}
              onChange={handleChange}
              step="1"
              description="Edad del paciente"
              unit="años"
            />
          </div>

          <div className="border-t bg-slate-50 px-6 py-4">
            <div className="flex gap-3">
              <Activity className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

              <p className="text-xs leading-5 text-slate-500">
                Estas ocho variables corresponden a las características
                utilizadas por el modelo MLP de investigación.
              </p>
            </div>
          </div>
        </section>

        {/* ERROR */}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                No se pudo procesar la solicitud
              </p>

              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* RESULTADO */}

        {result && (
          <section className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm">
            <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <h2 className="font-bold text-emerald-900">
                    Estimación generada correctamente
                  </h2>

                  <p className="text-sm text-emerald-700">
                    El registro fue almacenado en el sistema.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* PROBABILIDAD */}

                <div className="rounded-xl border bg-slate-50 p-5 md:col-span-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Gauge className="h-4 w-4" />
                    Probabilidad estimada
                  </div>

                  <p className="mt-3 text-4xl font-bold text-slate-900">
                    {Number(result.percentage).toFixed(2)}%
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Salida de probabilidad generada por el modelo.
                  </p>
                </div>

                {/* DATOS */}

                <div className="rounded-xl border p-5">
                  <p className="text-sm text-slate-500">
                    Paciente
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    #{result.patient_id}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    Identificador del registro
                  </p>
                </div>

                <div className="rounded-xl border p-5">
                  <p className="text-sm text-slate-500">
                    Modelo utilizado
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    v{result.model_version}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    MLP · Prototipo de investigación
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

                  <p className="text-sm leading-6 text-amber-800">
                    Esta salida corresponde a una estimación generada
                    por un modelo de aprendizaje automático de
                    investigación. No constituye un diagnóstico médico.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={() => navigate("/patients")}
                  className="gap-2"
                >
                  <Users className="h-4 w-4" />
                  Ver pacientes
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setResult(null);
                    setError("");
                  }}
                >
                  Nueva estimación
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* BOTONES */}

        {!result && (
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/patients")}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Procesando estimación...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Registrar y ejecutar estimación
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

/* ============================================================
   COMPONENTES AUXILIARES
============================================================ */

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SectionHeader({
  icon,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-4 border-b px-6 py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>
        <h2 className="font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({
  label,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}

interface InputFieldProps {
  label: string;
  name: string;
  value: number;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  step: string;
  description: string;
  unit?: string;
}

function InputField({
  label,
  name,
  value,
  onChange,
  step,
  description,
  unit,
}: InputFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative mt-2">
        <Input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          min="0"
          step={step}
          required
          className={unit ? "pr-16" : ""}
        />

        {unit && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {unit}
          </span>
        )}
      </div>

      <p className="mt-1.5 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

interface StepIndicatorProps {
  number: string;
  label: string;
  active: boolean;
}

function StepIndicator({
  number,
  label,
  active,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
          active
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {number}
      </div>

      <span
        className={`text-sm font-medium ${
          active ? "text-slate-700" : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default NewPatient;