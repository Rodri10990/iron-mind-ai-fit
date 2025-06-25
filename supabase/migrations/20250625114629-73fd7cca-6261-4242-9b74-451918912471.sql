
-- Create a table for workout plans
CREATE TABLE public.workout_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL DEFAULT 'Intermedio',
  duration_weeks INTEGER NOT NULL DEFAULT 4,
  sessions_per_week INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for workout plan exercises
CREATE TABLE public.workout_plan_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES public.workout_plans(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  exercise_name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps TEXT NOT NULL, -- Using TEXT to support ranges like "6-8" or "al fallo"
  rest_seconds INTEGER NOT NULL DEFAULT 120,
  notes TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own plans
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plan_exercises ENABLE ROW LEVEL SECURITY;

-- Create policies for workout_plans
CREATE POLICY "Users can view their own workout plans" 
  ON public.workout_plans 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workout plans" 
  ON public.workout_plans 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout plans" 
  ON public.workout_plans 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout plans" 
  ON public.workout_plans 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for workout_plan_exercises
CREATE POLICY "Users can view their own workout plan exercises" 
  ON public.workout_plan_exercises 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.workout_plans 
    WHERE workout_plans.id = workout_plan_exercises.plan_id 
    AND workout_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own workout plan exercises" 
  ON public.workout_plan_exercises 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.workout_plans 
    WHERE workout_plans.id = workout_plan_exercises.plan_id 
    AND workout_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own workout plan exercises" 
  ON public.workout_plan_exercises 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.workout_plans 
    WHERE workout_plans.id = workout_plan_exercises.plan_id 
    AND workout_plans.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own workout plan exercises" 
  ON public.workout_plan_exercises 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.workout_plans 
    WHERE workout_plans.id = workout_plan_exercises.plan_id 
    AND workout_plans.user_id = auth.uid()
  ));
