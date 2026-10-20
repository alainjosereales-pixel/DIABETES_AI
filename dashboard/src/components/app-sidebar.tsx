import {
  Activity,
  Brain,
  FileSpreadsheet,
  FlaskConical,
  History,
  LayoutDashboard,
  UserPlus,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Pacientes",
    url: "/patients",
    icon: Users,
  },
  {
    title: "Nueva predicción",
    url: "/patients/new",
    icon: UserPlus,
  },
  {
    title: "Predicción masiva",
    url: "/predictions/batch",
    icon: FileSpreadsheet,
  },

  
];

const analysisItems = [
  {
    title: "Historial",
    url: "/history",
    icon: History,
  },
  {
    title: "Modelo",
    url: "/model",
    icon: Brain,
  },
  {
    title: "Metodología",
    url: "/methodology",
    icon: FlaskConical,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r-0">
      {/* IDENTIDAD */}
      <SidebarHeader className="border-b border-white/10 bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950 px-3 py-5">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-200 shadow-lg ring-1 ring-white/10 backdrop-blur-sm">
            <Activity className="h-5 w-5" />
          </div>

          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-bold tracking-tight text-white">
              Diabetes <span className="text-blue-300">AI</span>
            </span>

            <span className="text-[10px] font-medium tracking-wide text-slate-400">
              RESEARCH PLATFORM
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* MENÚ */}
      <SidebarContent className="bg-gradient-to-b from-blue-950 via-indigo-950 to-slate-950 px-3">
        <SidebarGroup className="pt-6">
          <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300/70">
            Principal
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="h-10 rounded-xl text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <a
                      href={item.url}
                      className="flex w-full items-center gap-3"
                    >
                      <item.icon className="h-4 w-4" />

                      <span className="text-xs font-medium">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="pt-4">
          <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300/70">
            Análisis
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {analysisItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="h-10 rounded-xl text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <a
                      href={item.url}
                      className="flex w-full items-center gap-3"
                    >
                      <item.icon className="h-4 w-4" />

                      <span className="text-xs font-medium">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}