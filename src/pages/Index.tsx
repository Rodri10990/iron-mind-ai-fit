
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import WorkoutTracker from "@/components/WorkoutTracker";
import ExerciseLibrary from "@/components/ExerciseLibrary";
import ProgressCharts from "@/components/ProgressCharts";
import WorkoutLibrary from "@/components/WorkoutLibrary";
import AICoach from "@/components/AICoach";
import { Dumbbell, BookOpen, TrendingUp, Calendar, Brain, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState("workout");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Settings Button */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Iron Mind AI Fit
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Configuración</span>
        </Button>
      </div>

      <div className="container mx-auto px-2 md:px-4 py-4 md:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4 md:mb-6">
            <TabsTrigger value="workout" className="flex flex-col items-center gap-1 p-2 md:p-3">
              <Dumbbell className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm">Entreno</span>
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex flex-col items-center gap-1 p-2 md:p-3">
              <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm">Ejercicios</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex flex-col items-center gap-1 p-2 md:p-3">
              <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm">Progreso</span>
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex flex-col items-center gap-1 p-2 md:p-3">
              <Calendar className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm">Planes</span>
            </TabsTrigger>
            <TabsTrigger value="ai-coach" className="flex flex-col items-center gap-1 p-2 md:p-3">
              <Brain className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm">AI Coach</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workout" className="mt-0">
            <WorkoutTracker />
          </TabsContent>

          <TabsContent value="exercises" className="mt-0">
            <ExerciseLibrary />
          </TabsContent>

          <TabsContent value="progress" className="mt-0">
            <ProgressCharts />
          </TabsContent>

          <TabsContent value="plans" className="mt-0">
            <WorkoutLibrary />
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
