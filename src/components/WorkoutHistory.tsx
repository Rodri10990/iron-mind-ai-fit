
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, Dumbbell, TrendingUp, Eye } from "lucide-react";
import { workoutHistoryService, WorkoutSession } from "@/services/workoutHistoryService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const WorkoutHistory = () => {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadWorkoutHistory();
  }, []);

  const loadWorkoutHistory = async () => {
    try {
      setLoading(true);
      const data = await workoutHistoryService.getUserWorkoutSessions();
      setSessions(data);
    } catch (error) {
      console.error('Error loading workout history:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el historial de entrenamientos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "No completado";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getSessionStatus = (session: WorkoutSession) => {
    return session.completed_at ? "Completado" : "En progreso";
  };

  const getStatusColor = (session: WorkoutSession) => {
    return session.completed_at ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Cargando historial...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historial de Entrenamientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No hay entrenamientos registrados</p>
              <p>Inicia tu primer entrenamiento para ver tu progreso aquí</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {sessions.map((session) => (
                  <Card key={session.id} className="cursor-pointer hover:bg-gray-50">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{session.workout_name}</h3>
                            <Badge className={getStatusColor(session)}>
                              {getSessionStatus(session)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(session.started_at), "d 'de' MMMM, yyyy", { locale: es })}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(session.total_duration_minutes)}
                            </div>
                          </div>
                          
                          {session.notes && (
                            <p className="text-sm text-gray-500 mt-2">{session.notes}</p>
                          )}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSession(session.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      {sessions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{sessions.length}</p>
                  <p className="text-sm text-gray-600">Entrenamientos totales</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      sessions
                        .filter(s => s.total_duration_minutes)
                        .reduce((acc, s) => acc + (s.total_duration_minutes || 0), 0) / 60
                    )}h
                  </p>
                  <p className="text-sm text-gray-600">Tiempo total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {sessions.filter(s => s.completed_at).length}
                  </p>
                  <p className="text-sm text-gray-600">Completados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
