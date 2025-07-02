
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle, Lightbulb, Play, Plus, Minus } from "lucide-react";
import { exerciseMediaService } from "@/services/exerciseMediaService";
import type { ExerciseMedia } from "@/types/workout";

interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
}

interface Exercise {
  id: number;
  name: string;
  sets: WorkoutSet[];
  image?: string;
  videoUrl?: string;
  tips: string[];
  restTime: number;
}

interface ExerciseDisplayProps {
  exercise: Exercise;
  currentSetIndex: number;
  onCompleteSet: () => void;
  onSetIndexChange: (index: number) => void;
  onUpdateSet?: (setIndex: number, field: string, value: number) => void;
}

const ExerciseDisplay = ({ 
  exercise, 
  currentSetIndex, 
  onCompleteSet, 
  onSetIndexChange,
  onUpdateSet 
}: ExerciseDisplayProps) => {
  const [exerciseMedia, setExerciseMedia] = useState<ExerciseMedia[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);

  useEffect(() => {
    const loadExerciseMedia = async () => {
      try {
        const media = await exerciseMediaService.getExerciseMedia(exercise.name);
        setExerciseMedia(media);
      } catch (error) {
        console.error('Error loading exercise media:', error);
      } finally {
        setIsLoadingMedia(false);
      }
    };

    loadExerciseMedia();
  }, [exercise.name]);

  const currentSet = exercise.sets[currentSetIndex];
  const completedSets = exercise.sets.filter(set => set.completed).length;

  const handleUpdateReps = (value: number) => {
    if (onUpdateSet && !currentSet.completed) {
      onUpdateSet(currentSetIndex, 'reps', Math.max(1, value));
    }
  };

  const handleUpdateWeight = (value: number) => {
    if (onUpdateSet && !currentSet.completed) {
      onUpdateSet(currentSetIndex, 'weight', Math.max(0, value));
    }
  };

  // Get the primary image and video from the media array
  const primaryImage = exerciseMedia.find(media => media.media_type === 'image')?.url || exercise.image;
  const primaryVideo = exerciseMedia.find(media => media.media_type === 'video')?.url || exercise.videoUrl;

  return (
    <div className="space-y-4">
      {/* Exercise Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg md:text-xl">{exercise.name}</CardTitle>
            <Badge variant="outline">
              {completedSets}/{exercise.sets.length} series
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Exercise Media */}
          <div className="mb-4">
            {isLoadingMedia ? (
              <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-sm">Cargando media...</div>
                </div>
              </div>
            ) : primaryVideo ? (
              <div className="relative bg-gray-100 rounded-lg aspect-video">
                <video
                  src={primaryVideo}
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-black/50 text-white">
                    <Play className="h-3 w-3 mr-1" />
                    Demo
                  </Badge>
                </div>
              </div>
            ) : primaryImage ? (
              <div className="relative bg-gray-100 rounded-lg aspect-video">
                <img
                  src={primaryImage}
                  alt={exercise.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">💪</div>
                  <div className="text-sm">Imagen no disponible</div>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          {exercise.tips.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Tips importantes:</span>
              </div>
              <div className="space-y-1">
                {exercise.tips.map((tip, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                    • {tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Set with Input Controls */}
      {currentSet && (
        <Card className="border-2 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-orange-600">
              Serie {currentSetIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Input Controls for Reps and Weight */}
              <div className="grid grid-cols-2 gap-4">
                {/* Reps Control */}
                <div className="text-center space-y-2">
                  <div className="text-sm text-gray-600 font-medium">Repeticiones</div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleUpdateReps(currentSet.reps - 1)}
                      disabled={currentSet.completed || currentSet.reps <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={currentSet.reps}
                      onChange={(e) => handleUpdateReps(parseInt(e.target.value) || 1)}
                      className="w-16 h-8 text-center text-lg font-bold"
                      disabled={currentSet.completed}
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleUpdateReps(currentSet.reps + 1)}
                      disabled={currentSet.completed}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Weight Control */}
                <div className="text-center space-y-2">
                  <div className="text-sm text-gray-600 font-medium">Peso (kg)</div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleUpdateWeight(currentSet.weight - 2.5)}
                      disabled={currentSet.completed || currentSet.weight <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={currentSet.weight}
                      onChange={(e) => handleUpdateWeight(parseFloat(e.target.value) || 0)}
                      className="w-20 h-8 text-center text-lg font-bold"
                      disabled={currentSet.completed}
                      min="0"
                      step="2.5"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleUpdateWeight(currentSet.weight + 2.5)}
                      disabled={currentSet.completed}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Complete Set Button */}
              <Button
                onClick={onCompleteSet}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
                disabled={currentSet.completed}
              >
                {currentSet.completed ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Serie Completada
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Completar Serie
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Sets Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resumen de Series</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {exercise.sets.map((set, index) => (
              <div
                key={index}
                onClick={() => onSetIndexChange(index)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  index === currentSetIndex
                    ? 'border-orange-500 bg-orange-50'
                    : set.completed
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Serie {index + 1}</span>
                    {set.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="text-sm text-gray-600">
                    {set.reps} reps × {set.weight} kg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExerciseDisplay;
