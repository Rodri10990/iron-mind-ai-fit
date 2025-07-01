
import { supabase } from "@/integrations/supabase/client";
import type { ExerciseMedia } from "@/types/workout";

export const exerciseMediaService = {
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
  }
};
