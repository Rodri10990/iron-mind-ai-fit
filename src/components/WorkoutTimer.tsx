
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";

interface WorkoutTimerProps {
  workoutName: string;
  totalExercises: number;
  totalSets: number;
  isActive: boolean;
  onToggleWorkout: () => void;
}

const WorkoutTimer = ({ 
  workoutName, 
  totalExercises, 
  totalSets, 
  isActive, 
  onToggleWorkout 
}: WorkoutTimerProps) => {
  const [workoutTime, setWorkoutTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader className="px-3 py-3 md:px-6 md:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-lg md:text-xl truncate">{workoutName}</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              {totalExercises} ejercicios • {totalSets} series totales
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-orange-600">{formatTime(workoutTime)}</div>
              <div className="text-xs md:text-sm text-gray-600">Tiempo</div>
            </div>
            <Button
              onClick={onToggleWorkout}
              variant={isActive ? "destructive" : "default"}
              className={`text-xs md:text-sm ${isActive ? "" : "bg-green-600 hover:bg-green-700"}`}
              size="sm"
            >
              {isActive ? (
                <>
                  <Square className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Finalizar</span>
                  <span className="sm:hidden">Fin</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Comenzar</span>
                  <span className="sm:hidden">Inicio</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default WorkoutTimer;
