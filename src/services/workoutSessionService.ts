
import { supabase } from "@/integrations/supabase/client";
import type { WorkoutSession } from "@/types/workout";

export const workoutSessionService = {
  async createWorkoutSession(workoutName: string, notes?: string): Promise<WorkoutSession | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: user.id,
        workout_name: workoutName,
        started_at: new Date().toISOString(),
        notes
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async completeWorkoutSession(sessionId: string, totalDurationMinutes: number): Promise<void> {
    const { error } = await supabase
      .from('workout_sessions')
      .update({
        completed_at: new Date().toISOString(),
        total_duration_minutes: totalDurationMinutes
      })
      .eq('id', sessionId);

    if (error) throw error;
  },

  async getUserWorkoutSessions(limit = 50): Promise<WorkoutSession[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};
