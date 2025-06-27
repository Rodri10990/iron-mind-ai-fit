
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Pause, RotateCcw, Plus, Minus, SkipForward, ChevronDown, ChevronUp } from "lucide-react";

interface RestTimerControlProps {
  restTime: number;
  setRestTime: (time: number | ((prev: number) => number)) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  onSkip: () => void;
  exerciseName: string;
}

const RestTimerControl = ({
  restTime,
  setRestTime,
  isActive,
  setIsActive,
  onSkip,
  exerciseName
}: RestTimerControlProps) => {
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && restTime > 0) {
      interval = setInterval(() => {
        setRestTime(time => {
          if (time <= 1) {
            setIsActive(false);
            // Auto-skip when timer reaches 0
            setTimeout(() => {
              onSkip();
            }, 1000);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, restTime, setRestTime, setIsActive, onSkip]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTime = (seconds: number) => {
    setRestTime(prev => Math.max(0, prev + seconds));
  };

  const resetTimer = (defaultTime: number = 90) => {
    setRestTime(defaultTime);
    setIsActive(false);
  };

  // Minimized view
  if (isMinimized) {
    return (
      <Card className="bg-blue-50 border-blue-200 mb-4">
        <CardContent className="py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Descanso</span>
              <div className={`text-lg font-bold ${
                restTime <= 10 ? 'text-red-600' : 'text-blue-600'
              }`}>
                {formatTime(restTime)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsActive(!isActive)}
                disabled={restTime === 0}
              >
                {isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMinimized(false)}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full view
  return (
    <Card className="bg-blue-50 border-blue-200 mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-center text-blue-800 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tiempo de Descanso
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMinimized(true)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center text-sm text-blue-600">
          Descansando después de {exerciseName}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className={`text-6xl font-bold mb-2 ${
            restTime <= 10 ? 'text-red-600' : 'text-blue-600'
          }`}>
            {formatTime(restTime)}
          </div>
          {restTime <= 10 && restTime > 0 && (
            <div className="text-red-600 text-sm font-medium animate-pulse">
              ¡Casi listo!
            </div>
          )}
          {restTime === 0 && (
            <div className="text-green-600 text-sm font-medium">
              ¡Descanso terminado! Continuando automáticamente...
            </div>
          )}
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addTime(-15)}
            disabled={restTime <= 15}
          >
            <Minus className="h-4 w-4" />
            15s
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsActive(!isActive)}
            disabled={restTime === 0}
          >
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => addTime(15)}
          >
            <Plus className="h-4 w-4" />
            15s
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => resetTimer(60)}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            1 min
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => resetTimer(90)}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            1.5 min
          </Button>
        </div>

        {/* Skip Button */}
        <Button
          onClick={onSkip}
          className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
          size="sm"
        >
          <SkipForward className="h-4 w-4 mr-2" />
          Saltar Descanso
        </Button>
      </CardContent>
    </Card>
  );
};

export default RestTimerControl;
