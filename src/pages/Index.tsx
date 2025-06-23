
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dumbbell, 
  TrendingUp, 
  Calendar, 
  Target,
  Activity,
  Brain,
  Plus,
  Timer,
  BarChart3
} from "lucide-react";
import WorkoutTracker from "@/components/WorkoutTracker";
import ProgressCharts from "@/components/ProgressCharts";
import AICoach from "@/components/AICoach";
import ExerciseLibrary from "@/components/ExerciseLibrary";

const Index = () => {
  const [activeWorkout, setActiveWorkout] = useState(false);
  
  // Mock data para mostrar funcionalidad
  const weeklyProgress = 75;
  const currentStreak = 12;
  const totalWorkouts = 47;
  const weeklyGoal = 4;
  const completedThisWeek = 3;

  const recentWorkouts = [
    { id: 1, name: "Push Day", date: "Hoy", duration: "45 min", exercises: 8 },
    { id: 2, name: "Pull Day", date: "Ayer", duration: "50 min", exercises: 7 },
    { id: 3, name: "Legs", date: "2 días", duration: "60 min", exercises: 9 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header optimizado para móvil */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Dumbbell className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">FitTracker AI</h1>
                <p className="text-xs md:text-sm text-gray-600">Tu entrenador personal inteligente</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">FitTracker AI</h1>
              </div>
            </div>
            <Button 
              onClick={() => setActiveWorkout(true)}
              className="bg-orange-500 hover:bg-orange-600 px-3 py-2 text-sm"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Nuevo Entrenamiento</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Stats Cards optimizadas para móvil */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-xs md:text-sm font-medium opacity-90">Progreso Semanal</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-lg md:text-2xl font-bold">{weeklyProgress}%</div>
                  <Progress value={weeklyProgress} className="mt-2 bg-blue-400 h-1 md:h-2" />
                </div>
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 opacity-80 ml-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-xs md:text-sm font-medium opacity-90">Racha Actual</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg md:text-2xl font-bold">{currentStreak} días</div>
                  <div className="text-xs opacity-80">¡Sigue así!</div>
                </div>
                <Target className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-xs md:text-sm font-medium opacity-90">Total Entrenamientos</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg md:text-2xl font-bold">{totalWorkouts}</div>
                  <div className="text-xs opacity-80">Este mes</div>
                </div>
                <Activity className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2 px-3 pt-3">
              <CardTitle className="text-xs md:text-sm font-medium opacity-90">Meta Semanal</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg md:text-2xl font-bold">{completedThisWeek}/{weeklyGoal}</div>
                  <div className="text-xs opacity-80">Entrenamientos</div>
                </div>
                <Calendar className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content con tabs optimizadas para móvil */}
        <Tabs defaultValue="dashboard" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-10 md:h-11 text-xs md:text-sm">
            <TabsTrigger value="dashboard" className="px-2">Dashboard</TabsTrigger>
            <TabsTrigger value="workout" className="px-2">Entrenar</TabsTrigger>
            <TabsTrigger value="progress" className="px-2">Progreso</TabsTrigger>
            <TabsTrigger value="ai-coach" className="px-2">AI Coach</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Recent Workouts */}
              <Card>
                <CardHeader className="px-4 py-3 md:px-6 md:py-4">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Timer className="h-4 w-4 md:h-5 md:w-5" />
                    Entrenamientos Recientes
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Tus últimas sesiones de entrenamiento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 px-4 pb-4 md:px-6 md:pb-6">
                  {recentWorkouts.map((workout) => (
                    <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm md:text-base">{workout.name}</div>
                        <div className="text-xs md:text-sm text-gray-600">{workout.date} • {workout.duration}</div>
                      </div>
                      <Badge variant="secondary" className="text-xs">{workout.exercises} ejercicios</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Weekly Summary */}
              <Card>
                <CardHeader className="px-4 py-3 md:px-6 md:py-4">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
                    Resumen Semanal
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Tu progreso en los últimos 7 días</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-gray-600">Entrenamientos completados</span>
                      <span className="font-bold text-sm md:text-base">{completedThisWeek}/{weeklyGoal}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-gray-600">Tiempo total</span>
                      <span className="font-bold text-sm md:text-base">3h 15min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-gray-600">Calorías quemadas</span>
                      <span className="font-bold text-sm md:text-base">1,240 kcal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-gray-600">Músculos trabajados</span>
                      <span className="font-bold text-sm md:text-base">Todo el cuerpo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workout">
            <WorkoutTracker />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressCharts />
          </TabsContent>

          <TabsContent value="ai-coach">
            <AICoach />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
