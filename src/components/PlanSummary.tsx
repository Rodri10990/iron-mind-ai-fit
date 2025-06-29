
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface PlanSummaryProps {
  planName: string;
  difficulty: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  planExercises: PlanExercise[];
}

const PlanSummary = ({
  planName,
  difficulty,
  durationWeeks,
  sessionsPerWeek,
  planExercises
}: PlanSummaryProps) => {
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
        <CardTitle>Resumen del Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div><strong>Nombre:</strong> {planName || "Sin nombre"}</div>
          <div><strong>Dificultad:</strong> {difficulty}</div>
          <div><strong>Duración:</strong> {durationWeeks} semanas</div>
          <div><strong>Frecuencia:</strong> {sessionsPerWeek} días por semana</div>
          <div><strong>Total de ejercicios:</strong> {planExercises.length}</div>
          <div className="pt-2">
            <strong>Ejercicios por día:</strong>
            <div className="mt-1 flex flex-wrap gap-2">
              {getAvailableDays().map(day => (
                <Badge key={day} variant="outline">
                  Día {day}: {getDayExercises(day).length} ejercicios
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanSummary;
