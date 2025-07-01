
import { workoutSessionService } from "./workoutSessionService";
import { workoutSetService } from "./workoutSetService";
import { exerciseMediaService } from "./exerciseMediaService";
import { progressAnalyticsService } from "./progressAnalyticsService";

// Re-export types for backward compatibility
export type {
  WorkoutSession,
  WorkoutSet,
  ExerciseMedia,
  ProgressAnalytics
} from "@/types/workout";

export const workoutHistoryService = {
  // Workout Sessions - delegated to workoutSessionService
  createWorkoutSession: workoutSessionService.createWorkoutSession,
  completeWorkoutSession: workoutSessionService.completeWorkoutSession,
  getUserWorkoutSessions: workoutSessionService.getUserWorkoutSessions,

  // Workout Sets - delegated to workoutSetService
  addWorkoutSet: workoutSetService.addWorkoutSet,
  getSessionSets: workoutSetService.getSessionSets,
  getExerciseHistory: workoutSetService.getExerciseHistory,

  // Exercise Media - delegated to exerciseMediaService
  getExerciseMedia: exerciseMediaService.getExerciseMedia,

  // Progress Analytics - delegated to progressAnalyticsService
  getProgressAnalytics: progressAnalyticsService.getProgressAnalytics
};
