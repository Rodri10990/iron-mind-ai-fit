import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { workoutPlanService } from "@/services/workoutPlanService";
import { exerciseMediaService } from "@/services/exerciseMediaService";
import ActiveWorkoutScreen from "./ActiveWorkoutScreen";
import ManualPlanCreator from "./ManualPlanCreator";
import { 
  Dumbbell, 
  Play, 
  Clock, 
  Target,
  Calendar,
  Loader2,
  RefreshCw,
  Plus,
  Wrench
} from "lucide-react";

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  duration_weeks: number;
  sessions_per_week: number;
  created_at: string;
  workout_plan_exercises: Array<{
    day_number: number;
    exercise_name: string;
    sets: number;
    reps: string;
    rest_seconds: number;
    order_index: number;
  }>;
}

const WorkoutLibrary = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [showManualCreator, setShowManualCreator] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadWorkoutPlans();
  }, []);

  const loadWorkoutPlans = async () => {
    setIsLoading(true);
    try {
      const result = await workoutPlanService.getUserWorkoutPlans();
      if (result.success) {
        setWorkoutPlans(result.plans || []);
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudieron cargar los planes de entrenamiento.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading workout plans:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al cargar los planes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'principiante': return 'bg-green-100 text-green-800';
      case 'intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExerciseMedia = async (exerciseName: string) => {
    try {
      const media = await exerciseMediaService.getExerciseMedia(exerciseName);
      return media.find(m => m.media_type === 'image')?.url || getDefaultExerciseImage(exerciseName);
    } catch (error) {
      console.error('Error loading exercise media:', error);
      return getDefaultExerciseImage(exerciseName);
    }
  };

  const getDefaultExerciseImage = (exerciseName: string) => {
    // Fallback images based on exercise name
    const exerciseImageMap: { [key: string]: string } = {
      'press de banca': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'press inclinado': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop',
      'flexiones': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'sentadilla': 'https://images.unsplash.com/photo-1566241134943-5f5c8c3e5bea?w=800&h=600&fit=crop',
      'peso muerto': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop',
      'dominadas': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop'
    };
    
    const lowerName = exerciseName.toLowerCase();
    for (const [key, image] of Object.entries(exerciseImageMap)) {
      if (lowerName.includes(key)) {
        return image;
      }
    }
    
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop';
  };

  const startWorkout = async (plan: WorkoutPlan) => {
    // Convert plan to workout format with real exercise media
    const uniqueDays = getUniqueDays(plan);
    const exercisesWithMedia = await Promise.all(
      uniqueDays.flatMap(day => {
        const dayExercises = getExercisesByDay(plan, day);
        return dayExercises.map(async (ex) => {
          const exerciseImage = await getExerciseMedia(ex.exercise_name);
          return {
            id: Math.random(),
            name: ex.exercise_name,
            sets: Array.from({ length: ex.sets }, () => ({
              reps: parseInt(ex.reps) || 10,
              weight: 0,
              completed: false
            })),
            image: exerciseImage,
            tips: getExerciseTips(ex.exercise_name),
            restTime: ex.rest_seconds
          };
        });
      })
    );

    const convertedWorkout = {
      name: plan.name,
      exercises: exercisesWithMedia
    };

    setActiveWorkout(convertedWorkout);
    toast({
      title: "¡Entrenamiento iniciado!",
      description: `Comenzando "${plan.name}". ¡Vamos a entrenar!`,
    });
  };

  const getExerciseTips = (exerciseName: string) => {
    const tipsMap: { [key: string]: string[] } = {
      'press de banca': [
        "Mantén los omóplatos retraídos",
        "Controla la bajada",
        "Mantén los pies firmes"
      ],
      'sentadilla': [
        "Mantén la espalda recta",
        "Baja hasta que los muslos estén paralelos",
        "Impulsa con los talones"
      ],
      'peso muerto': [
        "Mantén la barra cerca del cuerpo",
        "Activa el core",
        "Extiende cadera y rodillas simultáneamente"
      ]
    };
    
    const lowerName = exerciseName.toLowerCase();
    for (const [key, tips] of Object.entries(tipsMap)) {
      if (lowerName.includes(key)) {
        return tips;
      }
    }
    
    return ["Mantén buena técnica", "Controla el movimiento", "Respira correctamente"];
  };

  const getExercisesByDay = (plan: WorkoutPlan, day: number) => {
    return plan.workout_plan_exercises
      .filter(ex => ex.day_number === day)
      .sort((a, b) => a.order_index - b.order_index);
  };

  const getUniqueDays = (plan: WorkoutPlan) => {
    const days = [...new Set(plan.workout_plan_exercises.map(ex => ex.day_number))];
    return days.sort((a, b) => a - b);
  };

  // Show manual creator
  if (showManualCreator) {
    return (
      <ManualPlanCreator
        onBack={() => setShowManualCreator(false)}
        onPlanCreated={() => {
          loadWorkoutPlans();
          setShowManualCreator(false);
        }}
      />
    );
  }

  // Show active workout screen
  if (activeWorkout) {
    return (
      <ActiveWorkoutScreen
        workout={activeWorkout}
        onBack={() => setActiveWorkout(null)}
        onFinishWorkout={() => {
          setActiveWorkout(null);
          toast({
            title: "¡Entrenamiento completado!",
            description: "¡Excelente trabajo!",
          });
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando planes de entrenamiento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold">Biblioteca de Entrenamientos</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowManualCreator(true)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
            size="sm"
          >
            <Wrench className="h-4 w-4" />
            <span className="hidden sm:inline">Crear Plan Manual</span>
            <span className="sm:hidden">Manual</span>
          </Button>
          <Button onClick={loadWorkoutPlans} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {workoutPlans.length === 0 ? (
        <div className="text-center py-12">
          <Dumbbell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No hay planes de entrenamiento</h3>
          <p className="text-gray-600 mb-4">
            Crea tu primer plan manualmente o utiliza el AI Coach para generar uno personalizado.
          </p>
          <div className="flex justify-center gap-2">
            <Button
              onClick={() => setShowManualCreator(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Plan Manual
            </Button>
            <Button onClick={loadWorkoutPlans} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {workoutPlans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="px-4 py-3 md:px-6 md:py-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base md:text-lg truncate">{plan.name}</CardTitle>
                    <CardDescription className="text-xs md:text-sm mt-1">
                      {plan.description}
                    </CardDescription>
                  </div>
                  <Badge className={`text-xs ml-2 flex-shrink-0 ${getDifficultyColor(plan.difficulty)}`}>
                    {plan.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                <div className="flex items-center gap-4 text-xs md:text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{plan.duration_weeks} semanas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{plan.sessions_per_week}x/semana</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{plan.workout_plan_exercises.length} ejercicios</span>
                  </div>
                </div>

                {/* Preview of exercises */}
                <div className="space-y-2 mb-4">
                  {getUniqueDays(plan).slice(0, 2).map((day) => {
                    const dayExercises = getExercisesByDay(plan, day);
                    return (
                      <div key={day} className="p-2 bg-gray-50 rounded">
                        <div className="text-xs font-medium mb-1">Día {day}:</div>
                        <div className="text-xs text-gray-600">
                          {dayExercises.slice(0, 3).map(ex => ex.exercise_name).join(', ')}
                          {dayExercises.length > 3 && ` +${dayExercises.length - 3} más`}
                        </div>
                      </div>
                    );
                  })}
                  {getUniqueDays(plan).length > 2 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{getUniqueDays(plan).length - 2} días más
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => startWorkout(plan)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-sm"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Comenzar Entrenamiento
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Plan Details */}
      {selectedPlan && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Plan Seleccionado: {selectedPlan.name}</CardTitle>
            <CardDescription>
              Detalle completo del plan de entrenamiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {getUniqueDays(selectedPlan).map((day) => {
                  const dayExercises = getExercisesByDay(selectedPlan, day);
                  return (
                    <div key={day} className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2">Día {day}</h4>
                      <div className="space-y-2">
                        {dayExercises.map((exercise, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{exercise.exercise_name}</span>
                            <div className="flex items-center gap-2 text-gray-600">
                              <span>{exercise.sets}x{exercise.reps}</span>
                              <Clock className="h-3 w-3" />
                              <span>{exercise.rest_seconds}s</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkoutLibrary;
