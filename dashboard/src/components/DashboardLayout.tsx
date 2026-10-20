import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />

        <main className="min-h-screen flex-1 bg-slate-50">
          {/* Contenido */}
          <div className="p-6">
            <Outlet />

            {/* Footer profesional */}
            <footer className="mt-10 border-t border-slate-200 px-2 py-5">
              <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  © Diabetes AI 2026
                </p>

                <a
                  href="https://www.linkedin.com/in/alain-jose-reales-machacon-300baa29a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-slate-600 transition-colors hover:text-blue-700"
                >
                  Alain Reales · LinkedIn
                </a>
              </div>
            </footer>
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}