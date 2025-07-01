import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Minus, Target } from "lucide-react";
import { workoutHistoryService } from "@/services/workoutHistoryService";
import type { ProgressAnalytics, WorkoutSet } from "@/types/workout";

interface ExerciseProgressChartProps {
  exerciseName: string;
}

const ExerciseProgressChart = ({ exerciseName }: ExerciseProgressChartProps) => {
  const [analytics, setAnalytics] = useState<ProgressAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, [exerciseName]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const data = await workoutHistoryService.getProgressAnalytics(exerciseName, 30);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Cargando progreso...</div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <Target className="h-8 w-8 mx-auto mb-2" />
            <p>No hay datos de progreso para este ejercicio</p>
            <p className="text-sm">Completa algunas series para ver tu evolución</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0.5) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < -0.5) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0.5) return "bg-green-100 text-green-800";
    if (trend < -0.5) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  // Preparar datos para el gráfico
  const chartData = analytics?.recentSets.map((set: WorkoutSet, index: number) => ({
    sesion: `S${index + 1}`,
    peso: set.weight_kg,
    reps: set.reps,
    volumen: set.weight_kg * set.reps
  })) || [];

  return (
    <div className="space-y-4">
      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{analytics.maxWeight}kg</p>
              <p className="text-sm text-gray-600">Peso máximo</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{analytics.maxReps}</p>
              <p className="text-sm text-gray-600">Reps máximas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{Math.round(analytics.totalVolume)}</p>
              <p className="text-sm text-gray-600">Volumen total</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{analytics.workoutFrequency}</p>
              <p className="text-sm text-gray-600">Días entrenados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendencia de peso */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Tendencia de Peso</CardTitle>
            <Badge className={getTrendColor(analytics.weightTrend)}>
              {getTrendIcon(analytics.weightTrend)}
              {analytics.weightTrend > 0 ? '+' : ''}{analytics.weightTrend.toFixed(1)}kg
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sesion" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value}${name === 'peso' ? 'kg' : name === 'reps' ? ' reps' : ''}`,
                  name === 'peso' ? 'Peso' : name === 'reps' ? 'Repeticiones' : 'Volumen'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="peso" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de volumen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Volumen por Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sesion" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value}`, 'Volumen (kg)']}
              />
              <Bar dataKey="volumen" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* RPE promedio si está disponible */}
      {analytics.avgRPE && (
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{analytics.avgRPE.toFixed(1)}/10</p>
              <p className="text-sm text-gray-600">RPE Promedio</p>
              <p className="text-xs text-gray-500 mt-1">
                Intensidad percibida en tus entrenamientos
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExerciseProgressChart;
