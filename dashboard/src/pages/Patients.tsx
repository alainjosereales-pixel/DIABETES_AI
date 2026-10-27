import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Search, UserPlus, Eye, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "../services/api";


interface Patient {
  patient_id: number;
  nombre: string | null;
  documento: string | null;
  sexo: string | null;
  fecha_nacimiento: string | null;
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
  fecha_registro: string;
}

interface PatientsResponse {
  total: number;
  patients: Patient[];
}

function Patients() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      try {
        const response = await fetch(`${API_URL}/patients`);

        if (!response.ok) {
          throw new Error("Error al obtener pacientes");
        }

        const data: PatientsResponse = await response.json();
        setPatients(data.patients);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const text = search.toLowerCase();

    return (
      patient.nombre?.toLowerCase().includes(text) ||
      patient.documento?.toLowerCase().includes(text) ||
      String(patient.patient_id).includes(text)
    );
  });

  return (
    <div className="space-y-6">
      {/* ENCABEZADO */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            GESTIÓN DE PACIENTES
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Pacientes
          </h1>

          <p className="mt-2 text-slate-500">
            Consulta y gestión de los pacientes registrados en el sistema.
          </p>
        </div>

        <Button
          onClick={() => navigate("/patients/new")}
          className="gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Nuevo paciente
        </Button>
      </div>

      {/* RESUMEN */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total pacientes
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {patients.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Resultados de búsqueda
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {filteredPatients.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Estado
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

            <span className="text-sm font-semibold text-emerald-700">
              Sistema operativo
            </span>
          </div>
        </div>
      </div>

      {/* BUSCADOR */}

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            type="text"
            placeholder="Buscar por nombre, documento o ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* TABLA */}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm text-slate-500">
                Cargando pacientes...
              </p>
            </div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Users className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              No hay pacientes
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              No encontramos pacientes con los criterios de búsqueda
              actuales.
            </p>

            {search && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearch("")}
              >
                Limpiar búsqueda
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4">ID</th>

                  <th className="px-6 py-4">
                    Paciente
                  </th>

                  <th className="px-6 py-4">
                    Documento
                  </th>

                  <th className="px-6 py-4">
                    Sexo
                  </th>

                  <th className="px-6 py-4">
                    Edad
                  </th>

                  <th className="px-6 py-4">
                    Glucosa
                  </th>

                  <th className="px-6 py-4">
                    IMC
                  </th>

                  <th className="px-6 py-4 text-right">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.patient_id}
                    className="border-b last:border-0 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-slate-600">
                        #{patient.patient_id}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                          {(patient.nombre?.charAt(0) || "P").toUpperCase()}
                        </div>

                        <div>
                          <div className="font-medium text-slate-900">
                            {patient.nombre || "Sin nombre"}
                          </div>

                          <div className="text-xs text-slate-400">
                            Registrado{" "}
                            {new Date(
                              patient.fecha_registro
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {patient.documento || "—"}
                    </td>

                    <td className="px-6 py-4">
                      {patient.sexo ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {patient.sexo}
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          —
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {patient.Age}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">
                        {patient.Glucose}
                      </span>

                      <span className="ml-1 text-xs text-slate-400">
                        mg/dL
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-800">
                        {patient.BMI}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() =>
                          navigate(
                            `/patients/${patient.patient_id}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PIE DE TABLA */}

      {!loading && filteredPatients.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Mostrando{" "}
            <strong className="text-slate-700">
              {filteredPatients.length}
            </strong>{" "}
            de{" "}
            <strong className="text-slate-700">
              {patients.length}
            </strong>{" "}
            pacientes
          </span>
        </div>
      )}
    </div>
  );
}

export default Patients;