
import { useState } from "react";
import WorkoutTimer from "./WorkoutTimer";
import WorkoutExerciseCard from "./WorkoutExerciseCard";
import ActiveWorkoutScreen from "./ActiveWorkoutScreen";
import { useToast } from "@/hooks/use-toast";
import { workoutSessionService } from "@/services/workoutSessionService";
import { workoutSetService } from "@/services/workoutSetService";

interface WorkoutTrackerProps {
  onWorkoutStateChange?: (isActive: boolean) => void;
}

const WorkoutTracker = ({ onWorkoutStateChange }: WorkoutTrackerProps) => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showActiveWorkout, setShowActiveWorkout] = useState(false);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const { toast } = useToast();
  
  // Mock workout data con imágenes corregidas para cada ejercicio
  const [workout] = useState({
    name: "Push Day - Pecho y Tríceps",
    exercises: [
      {
        id: 1,
        name: "Press de Banca",
        sets: [
          { reps: 12, weight: 60, completed: false },
          { reps: 10, weight: 65, completed: false },
          { reps: 8, weight: 70, completed: false },
          { reps: 6, weight: 75, completed: false }
        ],
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        tips: [
          "Mantén los omóplatos retraídos y pegados al banco",
          "Baja la barra de forma controlada hasta el pecho",
          "Mantén los pies firmes en el suelo"
        ],
        restTime: 120
      },
      {
        id: 2,
        name: "Press Inclinado con Mancuernas",
        sets: [
          { reps: 12, weight: 25, completed: false },
          { reps: 10, weight: 27.5, completed: false },
          { reps: 8, weight: 30, completed: false }
        ],
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop",
        tips: [
          "Ajusta el banco a 30-45 grados de inclinación",
          "Mantén los codos ligeramente flexionados",
          "Controla el movimiento en toda la amplitud"
        ],
        restTime: 90
      },
      {
        id: 3,
        name: "Flexiones de Pecho",
        sets: [
          { reps: 15, weight: 0, completed: false },
          { reps: 12, weight: 0, completed: false },
          { reps: 10, weight: 0, completed: false }
        ],
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        tips: [
          "Mantén el cuerpo recto como una tabla",
          "Baja hasta que el pecho casi toque el suelo",
          "Mantén los codos pegados al cuerpo"
        ],
        restTime: 60
      }
    ]
  });

  const [exerciseData, setExerciseData] = useState(workout.exercises);

  const toggleSet = (exerciseIndex: number, setIndex: number) => {
    const newData = [...exerciseData];
    newData[exerciseIndex].sets[setIndex].completed = !newData[exerciseIndex].sets[setIndex].completed;
    setExerciseData(newData);
  };

  const updateSetValue = (exerciseIndex: number, setIndex: number, field: string, value: number) => {
    const newData = [...exerciseData];
    newData[exerciseIndex].sets[setIndex][field] = value;
    setExerciseData(newData);
  };

  const handleStartWorkout = async () => {
    try {
      console.log('WorkoutTracker: Creating workout session for:', workout.name);
      const session = await workoutSessionService.createWorkoutSession(workout.name);
      if (session) {
        setCurrentSession(session.id);
        setWorkoutStartTime(new Date());
        setIsWorkoutActive(true);
        setShowActiveWorkout(true);
        onWorkoutStateChange?.(true);
        console.log('WorkoutTracker: Session created with ID:', session.id);
        
        toast({
          title: "¡Entrenamiento iniciado!",
          description: "¡Vamos a entrenar! Sigue las instrucciones en pantalla.",
        });
      }
    } catch (error) {
      console.error('WorkoutTracker: Error creating session:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar la sesión de entrenamiento",
        variant: "destructive"
      });
    }
  };

  const handleBackToOverview = () => {
    setShowActiveWorkout(false);
    toast({
      title: "Vista general",
      description: "Has vuelto a la vista general del entrenamiento.",
    });
  };

  const handleFinishWorkout = async () => {
    try {
      if (currentSession && workoutStartTime) {
        const totalMinutes = Math.round((Date.now() - workoutStartTime.getTime()) / (1000 * 60));
        console.log('WorkoutTracker: Completing workout session:', {
          sessionId: currentSession,
          totalMinutes
        });
        
        await workoutSessionService.completeWorkoutSession(currentSession, totalMinutes);
        console.log('WorkoutTracker: Workout session completed successfully');
        
        toast({
          title: "¡Entrenamiento guardado!",
          description: `Sesión completada en ${totalMinutes} minutos`,
        });
      } else {
        toast({
          title: "¡Entrenamiento completado!",
          description: "¡Excelente trabajo! Has terminado tu entrenamiento.",
        });
      }
    } catch (error) {
      console.error('WorkoutTracker: Error completing session:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la sesión completa",
        variant: "destructive"
      });
    } finally {
      setIsWorkoutActive(false);
      setShowActiveWorkout(false);
      setCurrentSession(null);
      setWorkoutStartTime(null);
      onWorkoutStateChange?.(false);
    }
  };

  const totalSets = exerciseData.reduce((acc, ex) => acc + ex.sets.length, 0);

  // Si está en modo entrenamiento activo, mostrar la pantalla dedicada
  if (showActiveWorkout) {
    return (
      <ActiveWorkoutScreen
        workout={{
          name: workout.name,
          exercises: exerciseData
        }}
        onBack={handleBackToOverview}
        onFinishWorkout={handleFinishWorkout}
      />
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      <WorkoutTimer
        workoutName={workout.name}
        totalExercises={exerciseData.length}
        totalSets={totalSets}
        isActive={isWorkoutActive}
        onToggleWorkout={handleStartWorkout}
      />

      <div className="space-y-3 md:space-y-4">
        {exerciseData.map((exercise, exerciseIndex) => (
          <WorkoutExerciseCard
            key={exercise.id}
            exercise={exercise}
            exerciseIndex={exerciseIndex}
            currentExercise={currentExercise}
            onToggleSet={toggleSet}
            onUpdateSet={updateSetValue}
            onSetCurrentExercise={setCurrentExercise}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkoutTracker;
