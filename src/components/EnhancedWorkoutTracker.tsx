
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Check, 
  Clock, 
  Dumbbell,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { workoutHistoryService, WorkoutSession } from "@/services/workoutHistoryService";
import { useToast } from "@/hooks/use-toast";
import ExerciseProgressChart from "./ExerciseProgressChart";

interface EnhancedWorkoutTrackerProps {
  onWorkoutStateChange?: (isActive: boolean) => void;
}

const EnhancedWorkoutTracker = ({ onWorkoutStateChange }: EnhancedWorkoutTrackerProps) => {
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentExercise, setCurrentExercise] = useState("");
  const [currentSet, setCurrentSet] = useState(1);
  const [reps, setReps] = useState<number>(8);
  const [weight, setWeight] = useState<number>(0);
  const [rpe, setRpe] = useState<number | undefined>();
  const [setNotes, setSetNotes] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { toast } = useToast();

  // Timer para el tiempo transcurrido
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = async () => {
    try {
      const workoutName = `Entrenamiento ${new Date().toLocaleDateString()}`;
      const session = await workoutHistoryService.createWorkoutSession(workoutName);
      
      if (session) {
        setCurrentSession(session);
        setIsActive(true);
        setStartTime(new Date());
        onWorkoutStateChange?.(true);
        
        toast({
          title: "¡Entrenamiento iniciado!",
          description: "Comienza a registrar tus series",
        });
      }
    } catch (error) {
      console.error('Error starting workout:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar el entrenamiento. Verifica que estés autenticado.",
        variant: "destructive"
      });
    }
  };

  const addSet = async () => {
    if (!currentSession || !currentExercise.trim() || reps <= 0) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa el ejercicio, repeticiones y peso",
        variant: "destructive"
      });
      return;
    }

    try {
      await workoutHistoryService.addWorkoutSet(
        currentSession.id,
        currentExercise.trim(),
        currentSet,
        reps,
        weight,
        undefined,
        rpe,
        setNotes.trim() || undefined
      );

      toast({
        title: "Serie registrada",
        description: `${currentExercise}: ${reps} reps × ${weight}kg`,
      });

      // Preparar para la siguiente serie
      setCurrentSet(prev => prev + 1);
      setSetNotes("");
      
      // Sugerir incremento de peso si es la misma serie
      if (rpe && rpe <= 7) {
        setWeight(prev => prev + 2.5);
      }

    } catch (error) {
      console.error('Error adding set:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar la serie",
        variant: "destructive"
      });
    }
  };

  const changeExercise = () => {
    setCurrentSet(1);
    setReps(8);
    setWeight(0);
    setRpe(undefined);
    setSetNotes("");
  };

  const finishWorkout = async () => {
    if (!currentSession || !startTime) return;

    try {
      const duration = Math.floor((Date.now() - startTime.getTime()) / 1000 / 60);
      await workoutHistoryService.completeWorkoutSession(currentSession.id, duration);
      
      setIsActive(false);
      setCurrentSession(null);
      setStartTime(null);
      setElapsedTime(0);
      setCurrentExercise("");
      setCurrentSet(1);
      onWorkoutStateChange?.(false);
      
      toast({
        title: "¡Entrenamiento completado!",
        description: `Duración: ${Math.floor(duration / 60)}h ${duration % 60}m`,
      });
    } catch (error) {
      console.error('Error finishing workout:', error);
      toast({
        title: "Error",
        description: "No se pudo completar el entrenamiento",
        variant: "destructive"
      });
    }
  };

  if (!isActive) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Tracker de Entrenamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Inicia un entrenamiento para registrar tu progreso</p>
            <Button onClick={startWorkout} size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Play className="h-5 w-5 mr-2" />
              Iniciar Entrenamiento
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del entrenamiento */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {formatTime(elapsedTime)}
              </CardTitle>
              <p className="text-sm text-gray-600">Entrenamiento en progreso</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowProgress(!showProgress)}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {showProgress ? "Ocultar" : "Ver"} Progreso
              </Button>
              
              <Button
                variant="destructive"
                onClick={finishWorkout}
              >
                <Square className="h-4 w-4 mr-2" />
                Finalizar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progreso del ejercicio actual */}
      {showProgress && currentExercise && (
        <ExerciseProgressChart exerciseName={currentExercise} />
      )}

      {/* Formulario de registro */}
      <Card>
        <CardHeader>
          <CardTitle>Registrar Serie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exercise">Ejercicio</Label>
              <Input
                id="exercise"
                value={currentExercise}
                onChange={(e) => setCurrentExercise(e.target.value)}
                onBlur={changeExercise}
                placeholder="Nombre del ejercicio..."
              />
            </div>

            <div className="space-y-2">
              <Label>Serie #{currentSet}</Label>
              <Badge variant="outline" className="w-full justify-center">
                Serie actual: {currentSet}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reps">Repeticiones</Label>
              <Input
                id="reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                min="1"
                max="50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                min="0"
                step="2.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rpe">RPE (1-10)</Label>
              <Input
                id="rpe"
                type="number"
                value={rpe || ""}
                onChange={(e) => setRpe(e.target.value ? parseInt(e.target.value) : undefined)}
                min="1"
                max="10"
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas de la serie</Label>
            <Textarea
              id="notes"
              value={setNotes}
              onChange={(e) => setSetNotes(e.target.value)}
              placeholder="Forma, sensaciones, observaciones..."
              className="resize-none"
              rows={2}
            />
          </div>

          <Button 
            onClick={addSet}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <Check className="h-5 w-5 mr-2" />
            Registrar Serie
          </Button>
        </CardContent>
      </Card>

      {/* Tips rápidos */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">💡 Consejos:</p>
              <ul className="space-y-1 text-gray-600">
                <li>• RPE 6-7: Podrías hacer 3-4 reps más</li>
                <li>• RPE 8-9: Podrías hacer 1-2 reps más</li>
                <li>• RPE 10: Máximo esfuerzo, no puedes hacer más</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedWorkoutTracker;
