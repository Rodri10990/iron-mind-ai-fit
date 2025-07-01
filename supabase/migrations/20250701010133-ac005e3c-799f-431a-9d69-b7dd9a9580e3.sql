
-- Create workout_sessions table for tracking individual workout sessions
CREATE TABLE public.workout_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  workout_name TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  total_duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workout_sets table for tracking individual sets within sessions
CREATE TABLE public.workout_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.workout_sessions(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  set_number INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight_kg DECIMAL(5,2) NOT NULL,
  rest_seconds INTEGER,
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercise_media table for storing exercise images/videos
CREATE TABLE public.exercise_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_name TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own data
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_media ENABLE ROW LEVEL SECURITY;

-- Create policies for workout_sessions
CREATE POLICY "Users can view their own workout sessions" 
  ON public.workout_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workout sessions" 
  ON public.workout_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions" 
  ON public.workout_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions" 
  ON public.workout_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for workout_sets
CREATE POLICY "Users can view their own workout sets" 
  ON public.workout_sets 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.workout_sessions 
    WHERE workout_sessions.id = workout_sets.session_id 
    AND workout_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own workout sets" 
  ON public.workout_sets 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.workout_sessions 
    WHERE workout_sessions.id = workout_sets.session_id 
    AND workout_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own workout sets" 
  ON public.workout_sets 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.workout_sessions 
    WHERE workout_sessions.id = workout_sets.session_id 
    AND workout_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own workout sets" 
  ON public.workout_sets 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.workout_sessions 
    WHERE workout_sessions.id = workout_sets.session_id 
    AND workout_sessions.user_id = auth.uid()
  ));

-- Create policies for exercise_media (public read access)
CREATE POLICY "Anyone can view exercise media" 
  ON public.exercise_media 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create exercise media" 
  ON public.exercise_media 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);
