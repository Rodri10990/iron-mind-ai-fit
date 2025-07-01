import { workoutHistoryService } from "./workoutHistoryService";
import { supabase } from "@/integrations/supabase/client";

export interface EnhancedAIRecommendation {
  exerciseName: string;
  suggestedWeight: number;
  suggestedReps: string;
  reasoning: string;
  progressNotes: string;
  motivationalMessage: string;
  confidenceLevel: 'high' | 'medium' | 'low';
  alternativeExercises?: string[];
}

export interface WorkoutSummary {
  totalSessions: number;
  avgDuration: number;
  topExercises: string[];
  recentTrends: {
    volumeChange: number;
    frequencyChange: number;
    strengthGains: { exercise: string; improvement: number }[];
  };
}

export const enhancedAiCoachService = {
  async getSmartRecommendation(exerciseName: string): Promise<EnhancedAIRecommendation | null> {
    try {
      // Obtener datos completos del ejercicio
      const [exerciseHistory, analytics, recentSessions] = await Promise.all([
        workoutHistoryService.getExerciseHistory(exerciseName, 10),
        workoutHistoryService.getProgressAnalytics(exerciseName, 30),
        workoutHistoryService.getUserWorkoutSessions(5)
      ]);

      // Si no hay historial, dar recomendación básica
      if (!exerciseHistory.length || !analytics) {
        return {
          exerciseName,
          suggestedWeight: 20,
          suggestedReps: "8-12",
          reasoning: "No hay historial previo. Comenzamos con un peso moderado para establecer una base.",
          progressNotes: "Primera vez registrando este ejercicio",
          motivationalMessage: "¡Perfecto momento para empezar! La consistencia es la clave del progreso.",
          confidenceLevel: 'low'
        };
      }

      // Llamar a la función edge mejorada
      const response = await supabase.functions.invoke('ai-coach-recommendations', {
        body: {
          exerciseName,
          exerciseHistory: exerciseHistory.slice(0, 8),
          analytics,
          recentSessions: recentSessions.map(s => ({
            workout_name: s.workout_name,
            duration: s.total_duration_minutes,
            completed: !!s.completed_at
          }))
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const recommendation = response.data as EnhancedAIRecommendation;
      
      // Añadir nivel de confianza basado en cantidad de datos
      recommendation.confidenceLevel = this.calculateConfidenceLevel(exerciseHistory.length, analytics.workoutFrequency);
      
      return recommendation;

    } catch (error) {
      console.error('Error getting enhanced AI recommendation:', error);
      
      // Fallback más inteligente
      return this.generateFallbackRecommendation(exerciseName);
    }
  },

  async getWorkoutSummary(): Promise<WorkoutSummary | null> {
    try {
      const sessions = await workoutHistoryService.getUserWorkoutSessions(30);
      
      if (sessions.length === 0) {
        return null;
      }

      const completedSessions = sessions.filter(s => s.completed_at);
      const avgDuration = completedSessions.reduce((acc, s) => acc + (s.total_duration_minutes || 0), 0) / completedSessions.length;

      // Obtener ejercicios más frecuentes
      const exerciseFrequency = new Map<string, number>();
      
      for (const session of sessions) {
        const sets = await workoutHistoryService.getSessionSets(session.id);
        sets.forEach(set => {
          exerciseFrequency.set(set.exercise_name, (exerciseFrequency.get(set.exercise_name) || 0) + 1);
        });
      }

      const topExercises = Array.from(exerciseFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([exercise]) => exercise);

      return {
        totalSessions: sessions.length,
        avgDuration: Math.round(avgDuration),
        topExercises,
        recentTrends: {
          volumeChange: 0, // Placeholder - se calculará con más datos
          frequencyChange: 0,
          strengthGains: []
        }
      };

    } catch (error) {
      console.error('Error getting workout summary:', error);
      return null;
    }
  },

  calculateConfidenceLevel(historyLength: number, workoutFrequency: number): 'high' | 'medium' | 'low' {
    if (historyLength >= 8 && workoutFrequency >= 3) return 'high';
    if (historyLength >= 4 && workoutFrequency >= 2) return 'medium';
    return 'low';
  },

  async generateFallbackRecommendation(exerciseName: string): Promise<EnhancedAIRecommendation> {
    try {
      const exerciseHistory = await workoutHistoryService.getExerciseHistory(exerciseName, 3);
      
      if (exerciseHistory.length > 0) {
        const lastSet = exerciseHistory[0];
        const suggestedWeight = lastSet.rpe && lastSet.rpe <= 7 
          ? lastSet.weight_kg + 2.5 
          : lastSet.weight_kg;

        return {
          exerciseName,
          suggestedWeight,
          suggestedReps: `${Math.max(6, lastSet.reps - 1)}-${lastSet.reps + 1}`,
          reasoning: `Basado en tu última serie de ${lastSet.reps} reps × ${lastSet.weight_kg}kg${lastSet.rpe ? ` (RPE ${lastSet.rpe})` : ''}. ${lastSet.rpe && lastSet.rpe <= 7 ? 'Puedes intentar más peso.' : 'Mantén el peso actual.'}`,
          progressNotes: "Recomendación basada en tu último entrenamiento",
          motivationalMessage: "¡Excelente progreso! Sigue construyendo sobre tus logros anteriores.",
          confidenceLevel: 'medium'
        };
      }

      // Recomendación por defecto si no hay datos
      return {
        exerciseName,
        suggestedWeight: 20,
        suggestedReps: "8-12",
        reasoning: "Peso inicial recomendado para comenzar con buena forma.",
        progressNotes: "Primer registro de este ejercicio",
        motivationalMessage: "¡Comienza fuerte! Cada experto fue una vez principiante.",
        confidenceLevel: 'low'
      };
    } catch (error) {
      console.error('Error in fallback recommendation:', error);
      return {
        exerciseName,
        suggestedWeight: 20,
        suggestedReps: "8-12",
        reasoning: "Recomendación básica por error en el sistema.",
        progressNotes: "Sistema en mantenimiento",
        motivationalMessage: "¡Sigue adelante! Tu dedicación es lo más importante.",
        confidenceLevel: 'low'
      };
    }
  }
};
