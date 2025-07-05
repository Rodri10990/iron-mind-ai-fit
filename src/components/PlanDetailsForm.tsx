
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlanDetailsFormProps {
  planName: string;
  setPlanName: (name: string) => void;
  planDescription: string;
  setPlanDescription: (description: string) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  durationWeeks: number;
  setDurationWeeks: (weeks: number) => void;
  sessionsPerWeek: number;
  setSessionsPerWeek: (sessions: number) => void;
}

const PlanDetailsForm = ({
  planName,
  setPlanName,
  planDescription,
  setPlanDescription,
  difficulty,
  setDifficulty,
  durationWeeks,
  setDurationWeeks,
  sessionsPerWeek,
  setSessionsPerWeek
}: PlanDetailsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles del Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="planName">Nombre del Plan *</Label>
            <Input
              id="planName"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Ej: Plan de Fuerza Básico"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="difficulty">Dificultad</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Principiante">Principiante</SelectItem>
                <SelectItem value="Intermedio">Intermedio</SelectItem>
                <SelectItem value="Avanzado">Avanzado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción (opcional)</Label>
          <Input
            id="description"
            value={planDescription}
            onChange={(e) => setPlanDescription(e.target.value)}
            placeholder="Describe el objetivo de este plan..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duración (semanas)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="52"
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(parseInt(e.target.value) || 4)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessions">Sesiones por semana</Label>
            <Input
              id="sessions"
              type="number"
              min="1"
              max="14"
              value={sessionsPerWeek}
              onChange={(e) => setSessionsPerWeek(parseInt(e.target.value) || 3)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanDetailsForm;
