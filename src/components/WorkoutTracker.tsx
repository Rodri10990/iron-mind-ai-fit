
import { useState } from "react";
import WorkoutTimer from "./WorkoutTimer";
import WorkoutExerciseCard from "./WorkoutExerciseCard";

const WorkoutTracker = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  
  // Mock workout data
  const [workout] = useState({
    name: "Push Day - Pecho y Tríceps",
    exercises: [
      {
        id: 1,
        name: "Press de Banca",
        sets: [
          { reps: 12, weight: 60, completed: true },
          { reps: 10, weight: 65, completed: true },
          { reps: 8, weight: 70, completed: false },
          { reps: 6, weight: 75, completed: false }
        ]
      },
      {
        id: 2,
        name: "Press Inclinado con Mancuernas",
        sets: [
          { reps: 12, weight: 25, completed: false },
          { reps: 10, weight: 27.5, completed: false },
          { reps: 8, weight: 30, completed: false }
        ]
      },
      {
        id: 3,
        name: "Flexiones de Pecho",
        sets: [
          { reps: 15, weight: 0, completed: false },
          { reps: 12, weight: 0, completed: false },
          { reps: 10, weight: 0, completed: false }
        ]
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

  const totalSets = exerciseData.reduce((acc, ex) => acc + ex.sets.length, 0);

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Workout Header */}
      <WorkoutTimer
        workoutName={workout.name}
        totalExercises={exerciseData.length}
        totalSets={totalSets}
        isActive={isWorkoutActive}
        onToggleWorkout={() => setIsWorkoutActive(!isWorkoutActive)}
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
