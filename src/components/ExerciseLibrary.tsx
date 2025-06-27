
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import RestTimer from "./RestTimer";
import ExerciseFilters from "./ExerciseFilters";
import ExerciseCard from "./ExerciseCard";
import { useExercises } from "../hooks/useExercises";

const ExerciseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [restTimer, setRestTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerExercise, setTimerExercise] = useState<string | null>(null);

  const { exercises, isLoading } = useExercises();

  const startRestTimer = (exerciseName: string, restTime: number) => {
    setRestTimer(restTime);
    setTimerExercise(exerciseName);
    setIsTimerActive(true);
  };

  const pauseTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setRestTimer(0);
    setTimerExercise(null);
  };

  const categories = [
    { id: "all", name: "Todos", count: exercises.length },
    { id: "pecho", name: "Pecho", count: exercises.filter(e => e.category === "pecho").length },
    { id: "espalda", name: "Espalda", count: exercises.filter(e => e.category === "espalda").length },
    { id: "piernas", name: "Piernas", count: exercises.filter(e => e.category === "piernas").length },
    { id: "hombros", name: "Hombros", count: exercises.filter(e => e.category === "hombros").length },
    { id: "brazos", name: "Brazos", count: exercises.filter(e => e.category === "brazos").length },
    { id: "abdominales", name: "Abdominales", count: exercises.filter(e => e.category === "abdominales").length }
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Cargando ejercicios...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <RestTimer
        exerciseName={timerExercise}
        restTimer={restTimer}
        isTimerActive={isTimerActive}
        onPause={pauseTimer}
        onReset={resetTimer}
        setRestTimer={setRestTimer}
        setIsTimerActive={setIsTimerActive}
        setTimerExercise={setTimerExercise}
      />

      <ExerciseFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      <div className="grid grid-cols-1 gap-6">
        {filteredExercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onStartRestTimer={startRestTimer}
          />
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron ejercicios</h3>
            <p className="text-gray-600">Intenta con diferentes términos de búsqueda o categorías</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExerciseLibrary;
