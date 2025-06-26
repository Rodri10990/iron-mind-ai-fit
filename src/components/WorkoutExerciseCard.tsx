
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell } from "lucide-react";
import WorkoutSetRow from "./WorkoutSetRow";

interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
}

interface Exercise {
  id: number;
  name: string;
  sets: WorkoutSet[];
}

interface WorkoutExerciseCardProps {
  exercise: Exercise;
  exerciseIndex: number;
  currentExercise: number;
  onToggleSet: (exerciseIndex: number, setIndex: number) => void;
  onUpdateSet: (exerciseIndex: number, setIndex: number, field: string, value: number) => void;
  onSetCurrentExercise: (index: number) => void;
}

const WorkoutExerciseCard = ({
  exercise,
  exerciseIndex,
  currentExercise,
  onToggleSet,
  onUpdateSet,
  onSetCurrentExercise
}: WorkoutExerciseCardProps) => {
  const completedSets = exercise.sets.filter(set => set.completed).length;
  const totalSets = exercise.sets.length;
  const isCurrentExercise = currentExercise === exerciseIndex;

  return (
    <Card className={`transition-all ${isCurrentExercise ? 'ring-2 ring-orange-500 shadow-lg' : ''}`}>
      <CardHeader className="px-3 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="p-1 md:p-2 bg-orange-100 rounded-lg flex-shrink-0">
              <Dumbbell className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm md:text-lg truncate">{exercise.name}</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                {completedSets}/{totalSets} series completadas
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant={isCurrentExercise ? "default" : "secondary"}
            className="text-xs flex-shrink-0"
          >
            {isCurrentExercise ? "Actual" : `${exerciseIndex + 1}`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
        <div className="space-y-2 md:space-y-3">
          {exercise.sets.map((set, setIndex) => (
            <WorkoutSetRow
              key={setIndex}
              set={set}
              setIndex={setIndex}
              exerciseIndex={exerciseIndex}
              onToggleSet={onToggleSet}
              onUpdateSet={onUpdateSet}
            />
          ))}
        </div>
        
        {isCurrentExercise && (
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSetCurrentExercise(Math.max(0, currentExercise - 1))}
                disabled={currentExercise === 0}
                className="text-xs md:text-sm"
              >
                Anterior
              </Button>
              <Button
                size="sm"
                onClick={() => onSetCurrentExercise(Math.min(2, currentExercise + 1))}
                disabled={currentExercise === 2}
                className="bg-orange-600 hover:bg-orange-700 text-xs md:text-sm"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutExerciseCard;
