
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type WorkoutPlan = Database['public']['Tables']['workout_plans']['Insert'];
type WorkoutPlanExercise = Database['public']['Tables']['workout_plan_exercises']['Insert'];

export interface WorkoutPlanData {
  name: string;
  description?: string;
  difficulty: string;
  duration_weeks: number;
  sessions_per_week: number;
  exercises: {
    day_number: number;
    exercise_name: string;
    sets: number;
    reps: string;
    rest_seconds: number;
    notes?: string;
    order_index: number;
  }[];
}

export const workoutPlanService = {
  async createWorkoutPlan(planData: WorkoutPlanData): Promise<{ success: boolean; error?: string; planId?: string }> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Create the workout plan
      const { data: planResult, error: planError } = await supabase
        .from('workout_plans')
        .insert({
          user_id: user.id,
          name: planData.name,
          description: planData.description,
          difficulty: planData.difficulty,
          duration_weeks: planData.duration_weeks,
          sessions_per_week: planData.sessions_per_week,
        })
        .select('id')
        .single();

      if (planError) {
        console.error('Error creating workout plan:', planError);
        return { success: false, error: planError.message };
      }

      // Create the workout plan exercises
      const exercises = planData.exercises.map(exercise => ({
        plan_id: planResult.id,
        day_number: exercise.day_number,
        exercise_name: exercise.exercise_name,
        sets: exercise.sets,
        reps: exercise.reps,
        rest_seconds: exercise.rest_seconds,
        notes: exercise.notes,
        order_index: exercise.order_index,
      }));

      const { error: exercisesError } = await supabase
        .from('workout_plan_exercises')
        .insert(exercises);

      if (exercisesError) {
        console.error('Error creating workout plan exercises:', exercisesError);
        // Try to cleanup the created plan
        await supabase.from('workout_plans').delete().eq('id', planResult.id);
        return { success: false, error: exercisesError.message };
      }

      return { success: true, planId: planResult.id };
    } catch (error) {
      console.error('Unexpected error creating workout plan:', error);
      return { success: false, error: 'Error inesperado al crear el plan' };
    }
  },

  async getUserWorkoutPlans(): Promise<{ success: boolean; plans?: any[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const { data: plans, error } = await supabase
        .from('workout_plans')
        .select(`
          *,
          workout_plan_exercises (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workout plans:', error);
        return { success: false, error: error.message };
      }

      return { success: true, plans: plans || [] };
    } catch (error) {
      console.error('Unexpected error fetching workout plans:', error);
      return { success: false, error: 'Error inesperado al obtener los planes' };
    }
  }
};
