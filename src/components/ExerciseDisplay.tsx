
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lightbulb, Play } from "lucide-react";

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
}

const ExerciseDisplay = ({ 
  exercise, 
  currentSetIndex, 
  onCompleteSet, 
  onSetIndexChange 
}: ExerciseDisplayProps) => {
  const currentSet = exercise.sets[currentSetIndex];
  const completedSets = exercise.sets.filter(set => set.completed).length;

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
            {exercise.videoUrl ? (
              <div className="relative bg-gray-100 rounded-lg aspect-video">
                <video
                  src={exercise.videoUrl}
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
            ) : exercise.image ? (
              <div className="relative bg-gray-100 rounded-lg aspect-video">
                <img
                  src={exercise.image}
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

      {/* Current Set */}
      {currentSet && (
        <Card className="border-2 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-orange-600">
              Serie {currentSetIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{currentSet.reps}</div>
                  <div className="text-sm text-gray-600">Repeticiones</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{currentSet.weight}</div>
                  <div className="text-sm text-gray-600">kg</div>
                </div>
              </div>
              
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
