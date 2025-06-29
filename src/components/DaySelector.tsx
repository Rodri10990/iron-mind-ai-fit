
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlanExercise {
  day_number: number;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
  order_index: number;
}

interface DaySelectorProps {
  sessionsPerWeek: number;
  currentDay: number;
  setCurrentDay: (day: number) => void;
  planExercises: PlanExercise[];
}

const DaySelector = ({ sessionsPerWeek, currentDay, setCurrentDay, planExercises }: DaySelectorProps) => {
  const getAvailableDays = () => {
    const days = [];
    for (let i = 1; i <= sessionsPerWeek; i++) {
      days.push(i);
    }
    return days;
  };

  const getDayExercises = (day: number) => {
    return planExercises.filter(ex => ex.day_number === day);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleccionar Día de Entrenamiento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {getAvailableDays().map(day => (
            <Button
              key={day}
              variant={currentDay === day ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentDay(day)}
              className="relative"
            >
              Día {day}
              {getDayExercises(day).length > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs"
                >
                  {getDayExercises(day).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DaySelector;
