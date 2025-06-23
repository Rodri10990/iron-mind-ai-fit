
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Minus,
  Timer,
  Dumbbell,
  CheckCircle2
} from "lucide-react";

const WorkoutTracker = () => {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Workout Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{workout.name}</CardTitle>
              <CardDescription>
                {exerciseData.length} ejercicios • {exerciseData.reduce((acc, ex) => acc + ex.sets.length, 0)} series totales
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{formatTime(workoutTime)}</div>
                <div className="text-sm text-gray-600">Tiempo</div>
              </div>
              <Button
                onClick={() => setIsWorkoutActive(!isWorkoutActive)}
                variant={isWorkoutActive ? "destructive" : "default"}
                className={isWorkoutActive ? "" : "bg-green-600 hover:bg-green-700"}
              >
                {isWorkoutActive ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Finalizar
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Comenzar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Exercise Cards */}
      <div className="space-y-4">
        {exerciseData.map((exercise, exerciseIndex) => (
          <Card key={exercise.id} className={`transition-all ${currentExercise === exerciseIndex ? 'ring-2 ring-orange-500 shadow-lg' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Dumbbell className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    <CardDescription>
                      {exercise.sets.filter(set => set.completed).length}/{exercise.sets.length} series completadas
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={currentExercise === exerciseIndex ? "default" : "secondary"}>
                  {currentExercise === exerciseIndex ? "Actual" : `Ejercicio ${exerciseIndex + 1}`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSet(exerciseIndex, setIndex)}
                      className={`h-8 w-8 p-0 ${set.completed ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium w-12">Set {setIndex + 1}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm w-12">Reps:</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => updateSetValue(exerciseIndex, setIndex, 'reps', Math.max(1, set.reps - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={set.reps}
                          onChange={(e) => updateSetValue(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                          className="w-16 h-8 text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => updateSetValue(exerciseIndex, setIndex, 'reps', set.reps + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {set.weight > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-12">Peso:</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateSetValue(exerciseIndex, setIndex, 'weight', Math.max(0, set.weight - 2.5))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={set.weight}
                            onChange={(e) => updateSetValue(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                            className="w-20 h-8 text-center"
                            step="2.5"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => updateSetValue(exerciseIndex, setIndex, 'weight', set.weight + 2.5)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm text-gray-500">kg</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {currentExercise === exerciseIndex && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                      disabled={currentExercise === 0}
                    >
                      Anterior
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setCurrentExercise(Math.min(exerciseData.length - 1, currentExercise + 1))}
                      disabled={currentExercise === exerciseData.length - 1}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkoutTracker;
