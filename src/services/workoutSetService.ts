
import { supabase } from "@/integrations/supabase/client";
import type { WorkoutSet } from "@/types/workout";

export const workoutSetService = {
  async addWorkoutSet(
    sessionId: string,
    exerciseName: string,
    setNumber: number,
    reps: number,
    weightKg: number,
    restSeconds?: number,
    rpe?: number,
    notes?: string
  ): Promise<WorkoutSet | null> {
    const { data, error } = await supabase
      .from('workout_sets')
      .insert({
        session_id: sessionId,
        exercise_name: exerciseName,
        set_number: setNumber,
        reps,
        weight_kg: weightKg,
        rest_seconds: restSeconds,
        rpe,
        notes
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSessionSets(sessionId: string): Promise<WorkoutSet[]> {
    const { data, error } = await supabase
      .from('workout_sets')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getExerciseHistory(exerciseName: string, limit = 20): Promise<WorkoutSet[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('workout_sets')
      .select(`
        *,
        workout_sessions!inner (
          user_id,
          started_at
        )
      `)
      .eq('exercise_name', exerciseName)
      .eq('workout_sessions.user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};
