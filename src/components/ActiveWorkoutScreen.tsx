
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { workoutSessionService } from "@/services/workoutSessionService";
import { workoutSetService } from "@/services/workoutSetService";
import ExerciseDisplay from "./ExerciseDisplay";
import RestTimerControl from "./RestTimerControl";

interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
}

interface Exercise {
  id: number;
  name: string;
  sets: WorkoutSet[];
  image?: string;
  videoUrl?: string;
  tips: string[];
  restTime: number; // segundos recomendados de descanso
}

interface ActiveWorkoutScreenProps {
  workout: {
    name: string;
    exercises: Exercise[];
  };
  onBack: () => void;
  onFinishWorkout: () => void;
}

const ActiveWorkoutScreen = ({ workout, onBack, onFinishWorkout }: ActiveWorkoutScreenProps) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(true);
  const [workoutExercises, setWorkoutExercises] = useState(workout.exercises);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const { toast } = useToast();

  const currentExercise = workoutExercises[currentExerciseIndex];
  const currentSet = currentExercise?.sets[currentSetIndex];

  // Initialize workout session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        console.log('ActiveWorkoutScreen: Creating workout session for:', workout.name);
        const session = await workoutSessionService.createWorkoutSession(workout.name);
        if (session) {
          setCurrentSession(session.id);
          console.log('ActiveWorkoutScreen: Session created with ID:', session.id);
        }
      } catch (error) {
        console.error('ActiveWorkoutScreen: Error creating session:', error);
        toast({
          title: "Error",
          description: "No se pudo inicializar la sesión de entrenamiento",
          variant: "destructive"
        });
      }
    };

    initializeSession();
  }, [workout.name, toast]);

  // Timer del entrenamiento
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateSet = (setIndex: number, field: string, value: number) => {
    const updatedExercises = [...workoutExercises];
    updatedExercises[currentExerciseIndex].sets[setIndex][field] = value;
    setWorkoutExercises(updatedExercises);
  };

  const completeSet = async () => {
    if (!currentExercise || !currentSet || !currentSession) return;

    try {
      // Marcar serie como completada
      const updatedExercises = [...workoutExercises];
      updatedExercises[currentExerciseIndex].sets[currentSetIndex].completed = true;
      setWorkoutExercises(updatedExercises);

      // Save set to database
      console.log('ActiveWorkoutScreen: Saving set to database:', {
        sessionId: currentSession,
        exerciseName: currentExercise.name,
        setNumber: currentSetIndex + 1,
        reps: currentSet.reps,
        weight: currentSet.weight
      });

      await workoutSetService.addWorkoutSet(
        currentSession,
        currentExercise.name,
        currentSetIndex + 1,
        currentSet.reps,
        currentSet.weight,
        currentExercise.restTime
      );

      console.log('ActiveWorkoutScreen: Set saved successfully');

      // Verificar si hay más series en este ejercicio
      const remainingSets = currentExercise.sets.slice(currentSetIndex + 1);
      const hasMoreSets = remainingSets.some(set => !set.completed);

      if (hasMoreSets) {
        // Iniciar descanso
        setRestTime(currentExercise.restTime);
        setIsResting(true);
        setIsRestTimerActive(true);
      } else {
        // Pasar al siguiente ejercicio
        moveToNextExercise();
      }
    } catch (error) {
      console.error('ActiveWorkoutScreen: Error saving set:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la serie",
        variant: "destructive"
      });
    }
  };

  const moveToNextExercise = () => {
    if (currentExerciseIndex < workoutExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSetIndex(0);
      setIsResting(false);
      setRestTime(0);
      setIsRestTimerActive(false);
    } else {
      // Entrenamiento completado
      finishWorkout();
    }
  };

  const finishWorkout = async () => {
    try {
      if (currentSession) {
        const totalMinutes = Math.round(workoutTime / 60);
        console.log('ActiveWorkoutScreen: Completing workout session:', {
          sessionId: currentSession,
          totalMinutes
        });
        
        await workoutSessionService.completeWorkoutSession(currentSession, totalMinutes);
        console.log('ActiveWorkoutScreen: Workout session completed successfully');
        
        toast({
          title: "¡Entrenamiento guardado!",
          description: `Sesión completada en ${totalMinutes} minutos`,
        });
      }
    } catch (error) {
      console.error('ActiveWorkoutScreen: Error completing session:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la sesión completa",
        variant: "destructive"
      });
    } finally {
      setIsWorkoutActive(false);
      onFinishWorkout();
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTime(0);
    setIsRestTimerActive(false);
    
    // Buscar próxima serie incompleta
    const nextIncompleteSetIndex = currentExercise.sets.findIndex((set, index) => 
      index > currentSetIndex && !set.completed
    );
    
    if (nextIncompleteSetIndex !== -1) {
      setCurrentSetIndex(nextIncompleteSetIndex);
    } else {
      moveToNextExercise();
    }
  };

  const totalSets = workoutExercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = workoutExercises.reduce((acc, ex) => 
    acc + ex.sets.filter(set => set.completed).length, 0
  );
  const progressPercentage = (completedSets / totalSets) * 100;

  if (!currentExercise) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-2 md:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{formatTime(workoutTime)}</div>
          <div className="text-sm text-gray-600">Tiempo</div>
        </div>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={finishWorkout}
        >
          Finalizar
        </Button>
      </div>

      {/* Progress */}
      <Card className="mb-4">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{workout.name}</span>
            <Badge variant="secondary">
              {completedSets}/{totalSets} series
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Ejercicio {currentExerciseIndex + 1} de {workoutExercises.length}</span>
            <span>{Math.round(progressPercentage)}% completado</span>
          </div>
        </CardContent>
      </Card>

      {/* Rest Timer */}
      {isResting && (
        <RestTimerControl
          restTime={restTime}
          setRestTime={setRestTime}
          isActive={isRestTimerActive}
          setIsActive={setIsRestTimerActive}
          onSkip={skipRest}
          exerciseName={currentExercise.name}
        />
      )}

      {/* Exercise Display */}
      {!isResting && (
        <ExerciseDisplay
          exercise={currentExercise}
          currentSetIndex={currentSetIndex}
          onCompleteSet={completeSet}
          onSetIndexChange={setCurrentSetIndex}
          onUpdateSet={updateSet}
        />
      )}
    </div>
  );
};

export default ActiveWorkoutScreen;
