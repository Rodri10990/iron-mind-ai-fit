
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Plus, Minus } from "lucide-react";

interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
}

interface WorkoutSetRowProps {
  set: WorkoutSet;
  setIndex: number;
  exerciseIndex: number;
  onToggleSet: (exerciseIndex: number, setIndex: number) => void;
  onUpdateSet: (exerciseIndex: number, setIndex: number, field: string, value: number) => void;
}

const WorkoutSetRow = ({ 
  set, 
  setIndex, 
  exerciseIndex, 
  onToggleSet, 
  onUpdateSet 
}: WorkoutSetRowProps) => {
  return (
    <div className="flex items-center gap-2 p-2 md:p-3 bg-gray-50 rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleSet(exerciseIndex, setIndex)}
        className={`h-6 w-6 md:h-8 md:w-8 p-0 flex-shrink-0 ${set.completed ? 'text-green-600' : 'text-gray-400'}`}
      >
        <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
      
      <div className="flex items-center gap-1 min-w-0">
        <span className="text-xs md:text-sm font-medium w-8 md:w-12 flex-shrink-0">S{setIndex + 1}</span>
      </div>

      <div className="flex items-center gap-1 min-w-0">
        <span className="text-xs md:text-sm w-8 md:w-12 flex-shrink-0">Rep:</span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-5 w-5 md:h-6 md:w-6 p-0 flex-shrink-0"
            onClick={() => onUpdateSet(exerciseIndex, setIndex, 'reps', Math.max(1, set.reps - 1))}
          >
            <Minus className="h-2 w-2 md:h-3 md:w-3" />
          </Button>
          <Input
            type="number"
            value={set.reps}
            onChange={(e) => onUpdateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
            className="w-10 md:w-16 h-6 md:h-8 text-center text-xs md:text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-5 w-5 md:h-6 md:w-6 p-0 flex-shrink-0"
            onClick={() => onUpdateSet(exerciseIndex, setIndex, 'reps', set.reps + 1)}
          >
            <Plus className="h-2 w-2 md:h-3 md:w-3" />
          </Button>
        </div>
      </div>

      {set.weight > 0 && (
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-xs md:text-sm w-8 md:w-12 flex-shrink-0">Kg:</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-5 w-5 md:h-6 md:w-6 p-0 flex-shrink-0"
              onClick={() => onUpdateSet(exerciseIndex, setIndex, 'weight', Math.max(0, set.weight - 2.5))}
            >
              <Minus className="h-2 w-2 md:h-3 md:w-3" />
            </Button>
            <Input
              type="number"
              value={set.weight}
              onChange={(e) => onUpdateSet(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
              className="w-12 md:w-20 h-6 md:h-8 text-center text-xs md:text-sm"
              step="2.5"
            />
            <Button
              variant="outline"
              size="sm"
              className="h-5 w-5 md:h-6 md:w-6 p-0 flex-shrink-0"
              onClick={() => onUpdateSet(exerciseIndex, setIndex, 'weight', set.weight + 2.5)}
            >
              <Plus className="h-2 w-2 md:h-3 md:w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutSetRow;
