
import { supabase } from "@/integrations/supabase/client";
import type { ExerciseMedia } from "@/types/workout";

// Exercise name synonym mapping for better matching
const EXERCISE_SYNONYMS: Record<string, string[]> = {
  'press banca': ['bench press', 'press de banca', 'press de pecho'],
  'sentadilla': ['squat', 'sentadillas', 'squats'],
  'peso muerto': ['deadlift', 'peso muerto rumano', 'deadlifts'],
  'dominadas': ['pull ups', 'pullups', 'chin ups'],
  'fondos': ['dips', 'fondos en paralelas'],
  'press militar': ['military press', 'overhead press', 'press hombros'],
  'remo': ['rowing', 'remo con barra', 'barbell row'],
  'curl biceps': ['bicep curl', 'curl de biceps', 'biceps curl'],
  'extensiones triceps': ['tricep extension', 'triceps extension'],
  'elevaciones laterales': ['lateral raises', 'side raises'],
  'press inclinado': ['incline press', 'incline bench press'],
  'hip thrust': ['empuje de cadera', 'thrust de cadera'],
  'plancha': ['plank', 'plancha abdominal'],
  'burpees': ['burpee', 'burpies'],
  'mountain climbers': ['escaladores', 'mountain climber'],
  'jumping jacks': ['saltos estrella', 'jumping jack']
};

// Function to normalize exercise names
const normalizeExerciseName = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    // Remove accents and special characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace common variations
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
    // Common normalizations
    .replace(/\bcon\b/g, 'with')
    .replace(/\bde\b/g, 'with')
    .replace(/\ben\b/g, 'on');
};

// Levenshtein distance calculation for fuzzy matching
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i += 1) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j += 1) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Calculate similarity percentage
const calculateSimilarity = (str1: string, str2: string): number => {
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  return maxLength === 0 ? 100 : ((maxLength - distance) / maxLength) * 100;
};

// Find potential matches using various strategies
const findPotentialMatches = (searchName: string, exerciseNames: string[]): Array<{ name: string; score: number }> => {
  const normalizedSearch = normalizeExerciseName(searchName);
  const matches: Array<{ name: string; score: number }> = [];
  
  exerciseNames.forEach(dbName => {
    const normalizedDb = normalizeExerciseName(dbName);
    
    // Strategy 1: Exact match after normalization
    if (normalizedSearch === normalizedDb) {
      matches.push({ name: dbName, score: 100 });
      return;
    }
    
    // Strategy 2: Contains match
    if (normalizedDb.includes(normalizedSearch) || normalizedSearch.includes(normalizedDb)) {
      const similarity = calculateSimilarity(normalizedSearch, normalizedDb);
      matches.push({ name: dbName, score: Math.max(80, similarity) });
      return;
    }
    
    // Strategy 3: Synonym matching
    for (const [canonical, synonyms] of Object.entries(EXERCISE_SYNONYMS)) {
      const normalizedCanonical = normalizeExerciseName(canonical);
      const normalizedSynonyms = synonyms.map(s => normalizeExerciseName(s));
      
      if (normalizedSearch === normalizedCanonical || normalizedSynonyms.includes(normalizedSearch)) {
        if (normalizedDb === normalizedCanonical || normalizedSynonyms.includes(normalizedDb)) {
          matches.push({ name: dbName, score: 90 });
          return;
        }
      }
    }
    
    // Strategy 4: Fuzzy matching with word order flexibility
    const searchWords = normalizedSearch.split(' ');
    const dbWords = normalizedDb.split(' ');
    
    // Check if all search words appear in db name (order independent)
    const allWordsMatch = searchWords.every(word => 
      dbWords.some(dbWord => 
        dbWord.includes(word) || word.includes(dbWord) || calculateSimilarity(word, dbWord) > 70
      )
    );
    
    if (allWordsMatch && searchWords.length >= 2) {
      matches.push({ name: dbName, score: 75 });
      return;
    }
    
    // Strategy 5: Pure similarity matching (as fallback)
    const similarity = calculateSimilarity(normalizedSearch, normalizedDb);
    if (similarity > 60) {
      matches.push({ name: dbName, score: similarity });
    }
  });
  
  // Sort by score (highest first) and return top matches
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Return top 3 matches
};

export const exerciseMediaService = {
  async getExerciseMedia(exerciseName: string): Promise<ExerciseMedia[]> {
    try {
      // Strategy 1: Try exact match first
      let { data, error } = await supabase
        .from('exercise_media')
        .select('*')
        .eq('exercise_name', exerciseName)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // If exact match found, return results
      if (data && data.length > 0) {
        return data.map(item => ({
          ...item,
          media_type: item.media_type as 'image' | 'video'
        }));
      }

      // Strategy 2: Get all exercise names for intelligent matching
      const { data: allExercises, error: namesError } = await supabase
        .from('exercise_media')
        .select('exercise_name')
        .order('exercise_name');

      if (namesError) throw namesError;

      if (!allExercises || allExercises.length === 0) {
        return [];
      }

      // Extract unique exercise names
      const uniqueExerciseNames = [...new Set(allExercises.map(ex => ex.exercise_name))];
      
      // Find potential matches using intelligent algorithms
      const potentialMatches = findPotentialMatches(exerciseName, uniqueExerciseNames);
      
      if (potentialMatches.length === 0) {
        console.log(`No matches found for exercise: "${exerciseName}"`);
        return [];
      }

      // Strategy 3: Try the best match
      const bestMatch = potentialMatches[0];
      console.log(`Using intelligent match for "${exerciseName}": "${bestMatch.name}" (score: ${bestMatch.score.toFixed(1)}%)`);
      
      const { data: matchedData, error: matchError } = await supabase
        .from('exercise_media')
        .select('*')
        .eq('exercise_name', bestMatch.name)
        .order('created_at', { ascending: false });

      if (matchError) throw matchError;
      
      return (matchedData || []).map(item => ({
        ...item,
        media_type: item.media_type as 'image' | 'video'
      }));

    } catch (error) {
      console.error('Error in getExerciseMedia:', error);
      return [];
    }
  }
};
