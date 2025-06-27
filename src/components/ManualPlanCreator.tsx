
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { workoutPlanService } from "@/services/workoutPlanService";
import { useExercises } from "@/hooks/useExercises";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";

interface PlanExercise {
  day_number: number;
  exercise_name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
  order_index: number;
}

interface ManualPlanCreatorProps {
  onBack: () => void;
  onPlanCreated: () => void;
}

const ManualPlanCreator = ({ onBack, onPlanCreated }: ManualPlanCreatorProps) => {
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Intermedio");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [currentDay, setCurrentDay] = useState(1);
  const [planExercises, setPlanExercises] = useState<PlanExercise[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const { exercises } = useExercises();
  const { toast } = useToast();

  // Get exercises that are already used in the plan
  const getUsedExercises = () => {
    return planExercises.map(ex => ex.exercise_name).filter(name => name !== "");
  };

  // Get available exercises (not already used in the plan)
  const getAvailableExercises = () => {
    const usedExercises = getUsedExercises();
    return exercises.filter(ex => !usedExercises.includes(ex.name));
  };

  const addExercise = () => {
    const newExercise: PlanExercise = {
      day_number: currentDay,
      exercise_name: "",
      sets: 3,
      reps: "10-12",
      rest_seconds: 90,
      notes: "",
      order_index: planExercises.filter(ex => ex.day_number === currentDay).length
    };
    setPlanExercises(prev => [...prev, newExercise]);
  };

  const updateExercise = (index: number, field: keyof PlanExercise, value: any) => {
    setPlanExercises(prev => prev.map((ex, i) => 
      i === index ? { ...ex, [field]: value } : ex
    ));
  };

  const removeExercise = (index: number) => {
    setPlanExercises(prev => prev.filter((_, i) => i !== index));
  };

  const getDayExercises = (day: number) => {
    return planExercises.filter(ex => ex.day_number === day);
  };

  const getAvailableDays = () => {
    const days = [];
    for (let i = 1; i <= sessionsPerWeek; i++) {
      days.push(i);
    }
    return days;
  };

  const validatePlan = () => {
    if (!planName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del plan es obligatorio",
        variant: "destructive",
      });
      return false;
    }

    if (planExercises.length === 0) {
      toast({
        title: "Error", 
        description: "Debes agregar al menos un ejercicio al plan",
        variant: "destructive",
      });
      return false;
    }

    // Verificar que todos los ejercicios tengan nombre
    const incompleteExercises = planExercises.some(ex => !ex.exercise_name);
    if (incompleteExercises) {
      toast({
        title: "Error",
        description: "Todos los ejercicios deben tener un nombre seleccionado",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const createPlan = async () => {
    if (!validatePlan()) return;

    setIsCreating(true);
    try {
      const planData = {
        name: planName,
        description: planDescription,
        difficulty,
        duration_weeks: durationWeeks,
        sessions_per_week: sessionsPerWeek,
        exercises: planExercises
      };

      const result = await workoutPlanService.createWorkoutPlan(planData);
      
      if (result.success) {
        toast({
          title: "¡Plan creado!",
          description: `El plan "${planName}" ha sido guardado exitosamente`,
        });
        onPlanCreated();
        onBack();
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo crear el plan",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al crear el plan",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <h2 className="text-xl md:text-2xl font-bold">Crear Plan Manual</h2>
      </div>

      {/* Plan Details */}
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
                max="7"
                value={sessionsPerWeek}
                onChange={(e) => setSessionsPerWeek(parseInt(e.target.value) || 3)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Selection */}
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

      {/* Exercises for Current Day */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ejercicios - Día {currentDay}</CardTitle>
            <Button
              onClick={addExercise}
              size="sm"
              className="flex items-center gap-2"
              disabled={getAvailableExercises().length === 0}
            >
              <Plus className="h-4 w-4" />
              Agregar Ejercicio
            </Button>
          </div>
          {getAvailableExercises().length === 0 && (
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
                        onClick={() => removeExercise(globalIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Ejercicio</Label>
                        <Select
                          value={exercise.exercise_name}
                          onValueChange={(value) => updateExercise(globalIndex, 'exercise_name', value)}
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
                          onChange={(e) => updateExercise(globalIndex, 'sets', parseInt(e.target.value) || 3)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Repeticiones</Label>
                        <Input
                          value={exercise.reps}
                          onChange={(e) => updateExercise(globalIndex, 'reps', e.target.value)}
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
                          onChange={(e) => updateExercise(globalIndex, 'rest_seconds', parseInt(e.target.value) || 90)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Notas (opcional)</Label>
                      <Input
                        value={exercise.notes || ""}
                        onChange={(e) => updateExercise(globalIndex, 'notes', e.target.value)}
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

      {/* Summary */}
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

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={createPlan}
          disabled={isCreating}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
        >
          <Save className="h-4 w-4" />
          {isCreating ? "Creando..." : "Guardar Plan"}
        </Button>
      </div>
    </div>
  );
};

export default ManualPlanCreator;
