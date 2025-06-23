
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Pause, RotateCcw } from "lucide-react";

interface RestTimerProps {
  exerciseName: string | null;
  restTimer: number;
  isTimerActive: boolean;
  onPause: () => void;
  onReset: () => void;
  setRestTimer: (time: number | ((prev: number) => number)) => void;
  setIsTimerActive: (active: boolean) => void;
  setTimerExercise: (exercise: string | null) => void;
}

const RestTimer = ({
  exerciseName,
  restTimer,
  isTimerActive,
  onPause,
  onReset,
  setRestTimer,
  setIsTimerActive,
  setTimerExercise
}: RestTimerProps) => {
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(time => time - 1);
      }, 1000);
    } else if (restTimer === 0 && isTimerActive) {
      setIsTimerActive(false);
      setTimerExercise(null);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, restTimer, setRestTimer, setIsTimerActive, setTimerExercise]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!exerciseName) return null;

  return (
    <Card className="bg-orange-50 border-orange-200 mb-6">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-orange-600" />
            <div>
              <p className="font-medium">Descanso - {exerciseName}</p>
              <p className="text-sm text-gray-600">Tiempo restante</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-orange-600">
              {formatTime(restTimer)}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onPause}>
                {isTimerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="outline" onClick={onReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestTimer;
