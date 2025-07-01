
import { workoutHistoryService } from "./workoutHistoryService";

export interface AIRecommendation {
  exerciseName: string;
  suggestedWeight: number;
  suggestedReps: string;
  reasoning: string;
  progressNotes: string;
  motivationalMessage: string;
}

export const aiCoachService = {
  async getWeightRecommendation(exerciseName: string): Promise<AIRecommendation | null> {
    try {
      // Obtener historial del ejercicio
      const exerciseHistory = await workoutHistoryService.getExerciseHistory(exerciseName, 10);
      const analytics = await workoutHistoryService.getProgressAnalytics(exerciseName, 30);
      
      if (!exerciseHistory.length || !analytics) {
        return {
          exerciseName,
          suggestedWeight: 0,
          suggestedReps: "8-12",
          reasoning: "No hay historial previo para este ejercicio. Comienza con un peso ligero que te permita realizar 8-12 repeticiones con buena forma.",
          progressNotes: "Primer entrenamiento registrado",
          motivationalMessage: "¡Excelente! Estás comenzando tu registro de progreso. La consistencia es clave para mejorar."
        };
      }

      // Llamar a la función edge de Supabase que usa Gemini
      const response = await fetch('/functions/v1/ai-coach-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseName,
          exerciseHistory: exerciseHistory.slice(0, 5), // Últimas 5 series
          analytics
        })
      });

      if (!response.ok) {
        throw new Error('Error al obtener recomendación de IA');
      }

      const recommendation = await response.json();
      return recommendation;

    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      
      // Fallback: recomendación básica basada en el último entrenamiento
      const exerciseHistory = await workoutHistoryService.getExerciseHistory(exerciseName, 5);
      if (exerciseHistory.length > 0) {
        const lastSet = exerciseHistory[0];
        const suggestedWeight = lastSet.rpe && lastSet.rpe <= 7 
          ? lastSet.weight_kg + 2.5 
          : lastSet.weight_kg;

        return {
          exerciseName,
          suggestedWeight,
          suggestedReps: `${Math.max(6, lastSet.reps - 1)}-${lastSet.reps + 1}`,
          reasoning: `Basado en tu última serie: ${lastSet.reps} reps × ${lastSet.weight_kg}kg${lastSet.rpe ? ` (RPE ${lastSet.rpe})` : ''}`,
          progressNotes: "Análisis basado en datos locales",
          motivationalMessage: "¡Sigue así! Tu progreso se está registrando correctamente."
        };
      }

      return null;
    }
  },

  async getProgressAnalysis(exerciseName: string): Promise<string> {
    try {
      const analytics = await workoutHistoryService.getProgressAnalytics(exerciseName, 30);
      
      if (!analytics) {
        return "No hay suficientes datos para analizar el progreso de este ejercicio.";
      }

      const response = await fetch('/functions/v1/ai-progress-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseName,
          analytics
        })
      });

      if (!response.ok) {
        throw new Error('Error al obtener análisis de progreso');
      }

      const analysis = await response.json();
      return analysis.analysis;

    } catch (error) {
      console.error('Error getting progress analysis:', error);
      return "Error al analizar el progreso. Inténtalo más tarde.";
    }
  }
};
