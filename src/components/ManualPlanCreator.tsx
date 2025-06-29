
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { workoutPlanService } from "@/services/workoutPlanService";
import { useExercises } from "@/hooks/useExercises";
import { Save, ArrowLeft } from "lucide-react";
import PlanDetailsForm from "./PlanDetailsForm";
import DaySelector from "./DaySelector";
import ExerciseList from "./ExerciseList";
import PlanSummary from "./PlanSummary";

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
      <PlanDetailsForm
        planName={planName}
        setPlanName={setPlanName}
        planDescription={planDescription}
        setPlanDescription={setPlanDescription}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        durationWeeks={durationWeeks}
        setDurationWeeks={setDurationWeeks}
        sessionsPerWeek={sessionsPerWeek}
        setSessionsPerWeek={setSessionsPerWeek}
      />

      {/* Day Selection */}
      <DaySelector
        sessionsPerWeek={sessionsPerWeek}
        currentDay={currentDay}
        setCurrentDay={setCurrentDay}
        planExercises={planExercises}
      />

      {/* Exercises for Current Day */}
      <ExerciseList
        currentDay={currentDay}
        planExercises={planExercises}
        exercises={exercises}
        onAddExercise={addExercise}
        onUpdateExercise={updateExercise}
        onRemoveExercise={removeExercise}
        availableExercisesCount={getAvailableExercises().length}
      />

      {/* Summary */}
      <PlanSummary
        planName={planName}
        difficulty={difficulty}
        durationWeeks={durationWeeks}
        sessionsPerWeek={sessionsPerWeek}
        planExercises={planExercises}
      />

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
