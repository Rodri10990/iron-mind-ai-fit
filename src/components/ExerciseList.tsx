
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from "lucide-react";

interface Exercise {
  id: number;
  name: string;
  category: string;
  primaryMuscles: string[];
  instructions: string;
  tips: string;
  image?: string;
}

interface PlanExercise {
  day_number: number;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
  order_index: number;
}

interface ExerciseListProps {
  currentDay: number;
  planExercises: PlanExercise[];
  exercises: Exercise[];
  onAddExercise: () => void;
  onUpdateExercise: (index: number, field: keyof PlanExercise, value: any) => void;
  onRemoveExercise: (index: number) => void;
  availableExercisesCount: number;
}

const ExerciseList = ({
  currentDay,
  planExercises,
  exercises,
  onAddExercise,
  onUpdateExercise,
  onRemoveExercise,
  availableExercisesCount
}: ExerciseListProps) => {
  const getDayExercises = (day: number) => {
    return planExercises.filter(ex => ex.day_number === day);
  };

  const getUsedExercises = () => {
    return planExercises.map(ex => ex.exercise_name).filter(name => name !== "");
  };

  const getAvailableExercises = () => {
    const usedExercises = getUsedExercises();
    return exercises.filter(ex => !usedExercises.includes(ex.name));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Ejercicios - Día {currentDay}</CardTitle>
          <Button
            onClick={onAddExercise}
            size="sm"
            className="flex items-center gap-2"
            disabled={availableExercisesCount === 0}
          >
            <Plus className="h-4 w-4" />
            Agregar Ejercicio
          </Button>
        </div>
        {availableExercisesCount === 0 && (
          <p className="text-sm text-gray-500 mt-2">
            No hay más ejercicios disponibles. Ya has agregado todos los ejercicios disponibles al plan.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 md:h-80">
          <div className="space-y-4">
            {getDayExercises(currentDay).map((exercise, dayIndex) => {
              const globalIndex = planExercises.findIndex(ex => 
                ex.day_number === currentDay && 
                planExercises.filter(e => e.day_number === currentDay).indexOf(ex) === dayIndex
              );
              
              // Get available exercises for this specific dropdown
              const availableForThisExercise = exercise.exercise_name 
                ? [...getAvailableExercises(), exercises.find(ex => ex.name === exercise.exercise_name)].filter(Boolean)
                : getAvailableExercises();
              
              return (
                <div key={globalIndex} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Ejercicio {dayIndex + 1}</h4>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemoveExercise(globalIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Ejercicio</Label>
                      <Select
                        value={exercise.exercise_name}
                        onValueChange={(value) => onUpdateExercise(globalIndex, 'exercise_name', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar ejercicio..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableForThisExercise.map(ex => (
                            <SelectItem key={ex.id} value={ex.name}>
                              {ex.name} ({ex.category})
                            </SelectItem>
                          ))}
                          {availableForThisExercise.length === 0 && (
                            <SelectItem value="" disabled>
                              No hay ejercicios disponibles
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Series</Label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={exercise.sets}
                        onChange={(e) => onUpdateExercise(globalIndex, 'sets', parseInt(e.target.value) || 3)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Repeticiones</Label>
                      <Input
                        value={exercise.reps}
                        onChange={(e) => onUpdateExercise(globalIndex, 'reps', e.target.value)}
                        placeholder="Ej: 8-12, 15, 20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Descanso (segundos)</Label>
                      <Input
                        type="number"
                        min="30"
                        max="300"
                        value={exercise.rest_seconds}
                        onChange={(e) => onUpdateExercise(globalIndex, 'rest_seconds', parseInt(e.target.value) || 90)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notas (opcional)</Label>
                    <Input
                      value={exercise.notes || ""}
                      onChange={(e) => onUpdateExercise(globalIndex, 'notes', e.target.value)}
                      placeholder="Notas especiales para este ejercicio..."
                    />
                  </div>
                </div>
              );
            })}

            {getDayExercises(currentDay).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No hay ejercicios agregados para este día.</p>
                <p className="text-sm">Haz clic en "Agregar Ejercicio" para comenzar.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ExerciseList;
