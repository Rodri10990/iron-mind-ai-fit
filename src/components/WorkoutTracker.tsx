
import { useState } from "react";
import WorkoutTimer from "./WorkoutTimer";
import WorkoutExerciseCard from "./WorkoutExerciseCard";
import ActiveWorkoutScreen from "./ActiveWorkoutScreen";
import { useToast } from "@/hooks/use-toast";

const WorkoutTracker = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showActiveWorkout, setShowActiveWorkout] = useState(false);
  const { toast } = useToast();
  
  // Mock workout data con datos completos para la nueva funcionalidad
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
        restTime: 120 // 2 minutos
      },
      {
        id: 2,
        name: "Press Inclinado con Mancuernas",
        sets: [
          { reps: 12, weight: 25, completed: false },
          { reps: 10, weight: 27.5, completed: false },
          { reps: 8, weight: 30, completed: false }
        ],
        image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop",
        tips: [
          "Ajusta el banco a 30-45 grados de inclinación",
          "Mantén los codos ligeramente flexionados",
          "Controla el movimiento en toda la amplitud"
        ],
        restTime: 90 // 1.5 minutos
      },
      {
        id: 3,
        name: "Flexiones de Pecho",
        sets: [
          { reps: 15, weight: 0, completed: false },
          { reps: 12, weight: 0, completed: false },
          { reps: 10, weight: 0, completed: false }
        ],
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        tips: [
          "Mantén el cuerpo recto como una tabla",
          "Baja hasta que el pecho casi toque el suelo",
          "Mantén los codos pegados al cuerpo"
        ],
        restTime: 60 // 1 minuto
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

  const handleStartWorkout = () => {
    setIsWorkoutActive(true);
    setShowActiveWorkout(true);
    toast({
      title: "¡Entrenamiento iniciado!",
      description: "¡Vamos a entrenar! Sigue las instrucciones en pantalla.",
    });
  };

  const handleBackToOverview = () => {
    setShowActiveWorkout(false);
    toast({
      title: "Vista general",
      description: "Has vuelto a la vista general del entrenamiento.",
    });
  };

  const handleFinishWorkout = () => {
    setIsWorkoutActive(false);
    setShowActiveWorkout(false);
    toast({
      title: "¡Entrenamiento completado!",
      description: "¡Excelente trabajo! Has terminado tu entrenamiento.",
    });
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

  // Vista general del entrenamiento (existente)
  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Workout Header */}
      <WorkoutTimer
        workoutName={workout.name}
        totalExercises={exerciseData.length}
        totalSets={totalSets}
        isActive={isWorkoutActive}
        onToggleWorkout={handleStartWorkout}
      />

      {/* Exercise Cards */}
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
