
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Calendar, Dumbbell, Target, Activity, Zap, Award } from "lucide-react";
import { workoutHistoryService, WorkoutSession } from "@/services/workoutHistoryService";
import { enhancedAiCoachService, WorkoutSummary } from "@/services/enhancedAiCoachService";
import { useToast } from "@/hooks/use-toast";
import { format, subDays, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";

const RealTimeProgressDashboard = () => {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [workoutSummary, setWorkoutSummary] = useState<WorkoutSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([]);
  const [topExercises, setTopExercises] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [sessionsData, summaryData] = await Promise.all([
        workoutHistoryService.getUserWorkoutSessions(30),
        enhancedAiCoachService.getWorkoutSummary()
      ]);

      setSessions(sessionsData);
      setWorkoutSummary(summaryData);

      // Calcular progreso semanal
      const weeklyData = calculateWeeklyProgress(sessionsData);
      setWeeklyProgress(weeklyData);

      // Obtener datos de ejercicios populares
      if (summaryData?.topExercises) {
        const exerciseData = await Promise.all(
          summaryData.topExercises.slice(0, 5).map(async (exercise) => {
            const analytics = await workoutHistoryService.getProgressAnalytics(exercise, 30);
            return {
              name: exercise,
              sessions: analytics?.totalSets || 0,
              maxWeight: analytics?.maxWeight || 0,
              volume: analytics?.totalVolume || 0
            };
          })
        );
        setTopExercises(exerciseData);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklyProgress = (sessions: WorkoutSession[]) => {
    const weeks = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const weekStart = subDays(now, i * 7 + 6);
      const weekEnd = subDays(now, i * 7);
      
      const weekSessions = sessions.filter(session => 
        isWithinInterval(new Date(session.started_at), { start: weekStart, end: weekEnd })
      );

      const completedSessions = weekSessions.filter(s => s.completed_at);
      const totalDuration = completedSessions.reduce((acc, s) => acc + (s.total_duration_minutes || 0), 0);

      weeks.push({
        week: `Sem ${7 - i}`,
        workouts: completedSessions.length,
        duration: totalDuration,
        avgDuration: completedSessions.length > 0 ? Math.round(totalDuration / completedSessions.length) : 0
      });
    }
    
    return weeks;
  };

  const getStreakDays = () => {
    const sortedSessions = sessions
      .filter(s => s.completed_at)
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());

    let streak = 0;
    let lastWorkoutDate = null;

    for (const session of sortedSessions) {
      const workoutDate = format(new Date(session.started_at), 'yyyy-MM-dd');
      
      if (!lastWorkoutDate) {
        streak = 1;
        lastWorkoutDate = workoutDate;
      } else {
        const dayDiff = (new Date(lastWorkoutDate).getTime() - new Date(workoutDate).getTime()) / (1000 * 60 * 60 * 24);
        
        if (dayDiff <= 2) { // Permite 1 día de descanso
          streak++;
          lastWorkoutDate = workoutDate;
        } else {
          break;
        }
      }
    }

    return streak;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Dumbbell className="h-8 w-8 animate-bounce mx-auto mb-4 text-orange-600" />
          <p className="text-lg font-medium">Cargando tu progreso...</p>
        </div>
      </div>
    );
  }

  if (!workoutSummary || sessions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">¡Comienza tu journey fitness!</h3>
            <p className="text-gray-600 mb-4">
              Una vez que completes algunos entrenamientos, verás aquí tu progreso y estadísticas.
            </p>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Dumbbell className="h-4 w-4 mr-2" />
              Iniciar Primer Entrenamiento
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const streakDays = getStreakDays();
  const completedSessions = sessions.filter(s => s.completed_at);
  const thisWeekWorkouts = weeklyProgress[weeklyProgress.length - 1]?.workouts || 0;

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-800">{workoutSummary.totalSessions}</p>
                <p className="text-sm text-orange-600">Entrenamientos totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-800">{streakDays}</p>
                <p className="text-sm text-green-600">Días consecutivos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-800">{workoutSummary.avgDuration}min</p>
                <p className="text-sm text-blue-600">Duración promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-800">{thisWeekWorkouts}</p>
                <p className="text-sm text-purple-600">Esta semana</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso semanal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progreso Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}${name === 'workouts' ? ' entrenamientos' : ' min'}`,
                    name === 'workouts' ? 'Entrenamientos' : 'Duración total'
                  ]}
                />
                <Bar dataKey="workouts" fill="#ea580c" name="workouts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Ejercicios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Tus Ejercicios Favoritos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topExercises.map((exercise, index) => (
              <div key={exercise.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-orange-100 text-orange-800">
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-gray-600">
                      {exercise.sessions} series · Máx: {exercise.maxWeight}kg
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{Math.round(exercise.volume)}kg</p>
                  <p className="text-xs text-gray-500">Volumen total</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Entrenamientos recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Entrenamientos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{session.workout_name}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(session.started_at), "d 'de' MMMM", { locale: es })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {session.completed_at ? (
                    <>
                      <Badge className="bg-green-100 text-green-800">Completado</Badge>
                      <span className="text-sm text-gray-600">
                        {session.total_duration_minutes}min
                      </span>
                    </>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      En progreso
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeProgressDashboard;
