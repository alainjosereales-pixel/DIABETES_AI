import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from "./App";
import Patients from "./pages/Patients";
import NewPatient from "./pages/NewPatient";
import PatientDetail from "./pages/PatientDetail";
import BatchPrediction from "./pages/BatchPrediction";
import History from "./pages/History";
import Model from "./pages/Model";
import Methodology from "./pages/Methodology";

import DashboardLayout from "./components/DashboardLayout";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        <Route element={<DashboardLayout />}>

          <Route path="/" element={<App />} />

          <Route
            path="/patients"
            element={<Patients />}
          />

          <Route
            path="/patients/new"
            element={<NewPatient />}
          />

          <Route
            path="/patients/:id"
            element={<PatientDetail />}
          />

          <Route
            path="/predictions/batch"
            element={<BatchPrediction />}
          />

          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/model"
            element={<Model />}
          />

          <Route path="/methodology" element={<Methodology />} />

        </Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);