
import { supabase } from "@/integrations/supabase/client";
import type { ProgressAnalytics } from "@/types/workout";

export const progressAnalyticsService = {
  async getProgressAnalytics(exerciseName: string, days = 30): Promise<ProgressAnalytics | null> {
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
    
    // Process data to get useful metrics
    const sets = data || [];
    if (sets.length === 0) return null;

    const maxWeight = Math.max(...sets.map(s => s.weight_kg));
    const maxReps = Math.max(...sets.map(s => s.reps));
    const totalVolume = sets.reduce((acc, s) => acc + (s.weight_kg * s.reps), 0);
    const avgRPE = sets.filter(s => s.rpe).reduce((acc, s, _, arr) => acc + (s.rpe || 0) / arr.length, 0);

    // Trends (compare first half vs second half of the period)
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
      recentSets: sets.slice(-5), // Last 5 sets
      workoutFrequency: new Set(sets.map(s => s.workout_sessions.started_at.split('T')[0])).size // Unique days
    };
  }
};
