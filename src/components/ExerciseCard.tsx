
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Clock, Play, Plus } from "lucide-react";

interface Exercise {
  id: number;
  name: string;
  category: string;
  difficulty: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  description: string;
  imageUrl: string;
  restTime: number;
  instructions: string[];
  tips: string[];
}

interface ExerciseCardProps {
  exercise: Exercise;
  onStartRestTimer: (exerciseName: string, restTime: number) => void;
}

const ExerciseCard = ({ exercise, onStartRestTimer }: ExerciseCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Principiante": return "bg-green-100 text-green-800";
      case "Intermedio": return "bg-yellow-100 text-yellow-800";
      case "Avanzado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{exercise.name}</CardTitle>
            <CardDescription className="mt-1">
              {exercise.description}
            </CardDescription>
          </div>
          <Badge className={getDifficultyColor(exercise.difficulty)}>
            {exercise.difficulty}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="outline" className="text-xs">
            <Target className="h-3 w-3 mr-1" />
            {exercise.equipment}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {Math.floor(exercise.restTime / 60)}:{(exercise.restTime % 60).toString().padStart(2, '0')} descanso
          </Badge>
          {exercise.primaryMuscles.map(muscle => (
            <Badge key={muscle} variant="secondary" className="text-xs">
              {muscle}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Exercise Image */}
        <div className="mb-4">
          <img
            src={exercise.imageUrl}
            alt={`Demostración de ${exercise.name}`}
            className="w-full h-48 object-cover rounded-lg"
            loading="lazy"
          />
        </div>

        <Tabs defaultValue="instructions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="instructions">Instrucciones</TabsTrigger>
            <TabsTrigger value="tips">Consejos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="instructions" className="mt-4">
            <div className="space-y-2">
              {exercise.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tips" className="mt-4">
            <div className="space-y-2">
              {exercise.tips.map((tip, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button size="sm" variant="outline" className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Ver Video
          </Button>
          <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onStartRestTimer(exercise.name, exercise.restTime)}
            className="px-3"
          >
            <Clock className="h-4 w-4" />
          </Button>
        </div>

        {exercise.secondaryMuscles.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-500 mb-1">Músculos secundarios:</p>
            <div className="flex flex-wrap gap-1">
              {exercise.secondaryMuscles.map(muscle => (
                <Badge key={muscle} variant="outline" className="text-xs bg-gray-50">
                  {muscle}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
