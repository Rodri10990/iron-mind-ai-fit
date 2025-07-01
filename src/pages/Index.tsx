
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import EnhancedWorkoutTracker from "@/components/EnhancedWorkoutTracker";
import ExerciseLibrary from "@/components/ExerciseLibrary";
import ProgressCharts from "@/components/ProgressCharts";
import WorkoutLibrary from "@/components/WorkoutLibrary";
import WorkoutHistory from "@/components/WorkoutHistory";
import AICoach from "@/components/AICoach";
import NotificationSystem from "@/components/NotificationSystem";
import { Dumbbell, BookOpen, Home, Calendar, Brain, Settings, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const navigate = useNavigate();

  // Función para manejar el estado del entrenamiento
  const handleWorkoutStateChange = (isActive: boolean) => {
    setIsWorkoutActive(isActive);
    if (isActive) {
      setActiveTab("workout");
    }
  };

  // Determinar las tabs a mostrar
  const getTabsList = () => {
    const baseTabs = [
      { value: "home", icon: Home, label: "Principal" },
      { value: "exercises", icon: BookOpen, label: "Ejercicios" },
      { value: "plans", icon: Calendar, label: "Planes" },
      { value: "history", icon: History, label: "Historial" },
      { value: "ai-coach", icon: Brain, label: "AI Coach" }
    ];

    if (isWorkoutActive) {
      return [
        { value: "workout", icon: Dumbbell, label: "Entreno" },
        ...baseTabs
      ];
    }

    return baseTabs;
  };

  const tabs = getTabsList();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full mb-4 md:mb-6 ${isWorkoutActive ? 'grid-cols-6' : 'grid-cols-5'}`}>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex flex-col items-center gap-1 p-2 md:p-3"
              >
                <tab.icon className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-xs md:text-sm">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Página Principal */}
          <TabsContent value="home" className="mt-0">
            <div className="space-y-6">
              {/* Header con notificaciones y configuración */}
              <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    Iron Mind AI Fit
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Tu entrenador personal con IA
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <NotificationSystem />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Config</span>
                  </Button>
                </div>
              </div>

              {/* Quick Start Workout Button */}
              <div className="text-center">
                <Button
                  onClick={() => {
                    setActiveTab("workout");
                    handleWorkoutStateChange(true);
                  }}
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4"
                >
                  <Dumbbell className="h-6 w-6 mr-3" />
                  Iniciar Entrenamiento
                </Button>
              </div>

              {/* Contenido de Progreso */}
              <ProgressCharts />
            </div>
          </TabsContent>

          {/* Entreno (solo visible cuando hay entrenamiento activo) */}
          {isWorkoutActive && (
            <TabsContent value="workout" className="mt-0">
              <EnhancedWorkoutTracker onWorkoutStateChange={handleWorkoutStateChange} />
            </TabsContent>
          )}

          <TabsContent value="exercises" className="mt-0">
            <ExerciseLibrary />
          </TabsContent>

          <TabsContent value="plans" className="mt-0">
            <div className="space-y-6">
              <WorkoutLibrary />
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <WorkoutHistory />
          </TabsContent>

          <TabsContent value="ai-coach" className="mt-0">
            <AICoach />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
