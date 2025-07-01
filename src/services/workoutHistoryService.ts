import { supabase } from "@/integrations/supabase/client";

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_name: string;
  started_at: string;
  completed_at?: string;
  total_duration_minutes?: number;
  notes?: string;
  created_at: string;
}

export interface WorkoutSet {
  id: string;
  session_id: string;
  exercise_name: string;
  set_number: number;
  reps: number;
  weight_kg: number;
  rest_seconds?: number;
  rpe?: number;
  notes?: string;
  created_at: string;
}

export interface ExerciseMedia {
  id: string;
  exercise_name: string;
  media_type: 'image' | 'video';
  url: string;
  description?: string;
  created_at: string;
}

export const workoutHistoryService = {
  // Workout Sessions
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
  },

  // Workout Sets
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
  },

  // Exercise Media
  async getExerciseMedia(exerciseName: string): Promise<ExerciseMedia[]> {
    const { data, error } = await supabase
      .from('exercise_media')
      .select('*')
      .eq('exercise_name', exerciseName)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Type assertion to ensure media_type conforms to our interface
    return (data || []).map(item => ({
      ...item,
      media_type: item.media_type as 'image' | 'video'
    }));
  },

  // Progress Analytics
  async getProgressAnalytics(exerciseName: string, days = 30) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const { data, error } = await supabase
      .from('workout_sets')
      .select(`
        *,
        workout_sessions!inner (
          user_id,
          started_at,
          workout_name
        )
      `)
      .eq('exercise_name', exerciseName)
      .eq('workout_sessions.user_id', user.id)
      .gte('workout_sessions.started_at', sinceDate.toISOString())
      .order('workout_sessions.started_at', { ascending: true });

    if (error) throw error;
    
    // Procesamos los datos para obtener métricas útiles
    const sets = data || [];
    if (sets.length === 0) return null;

    const maxWeight = Math.max(...sets.map(s => s.weight_kg));
    const maxReps = Math.max(...sets.map(s => s.reps));
    const totalVolume = sets.reduce((acc, s) => acc + (s.weight_kg * s.reps), 0);
    const avgRPE = sets.filter(s => s.rpe).reduce((acc, s, _, arr) => acc + (s.rpe || 0) / arr.length, 0);

    // Tendencias (comparar primera mitad vs segunda mitad del período)
    const midPoint = Math.floor(sets.length / 2);
    const firstHalf = sets.slice(0, midPoint);
    const secondHalf = sets.slice(midPoint);

    const firstHalfAvgWeight = firstHalf.reduce((acc, s, _, arr) => acc + s.weight_kg / arr.length, 0);
    const secondHalfAvgWeight = secondHalf.reduce((acc, s, _, arr) => acc + s.weight_kg / arr.length, 0);

    return {
      exerciseName,
      totalSets: sets.length,
      maxWeight,
      maxReps,
      totalVolume,
      avgRPE: avgRPE || null,
      weightTrend: secondHalfAvgWeight - firstHalfAvgWeight,
      recentSets: sets.slice(-5), // Últimas 5 series
      workoutFrequency: new Set(sets.map(s => s.workout_sessions.started_at.split('T')[0])).size // Días únicos
    };
  }
};
