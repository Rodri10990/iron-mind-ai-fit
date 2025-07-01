
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

export interface ProgressAnalytics {
  exerciseName: string;
  totalSets: number;
  maxWeight: number;
  maxReps: number;
  totalVolume: number;
  avgRPE: number | null;
  weightTrend: number;
  recentSets: WorkoutSet[];
  workoutFrequency: number;
}
