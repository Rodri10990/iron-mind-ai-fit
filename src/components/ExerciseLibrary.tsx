import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Dumbbell, 
  Target, 
  Clock,
  Play,
  BookOpen,
  Filter,
  Plus,
  Pause,
  RotateCcw
} from "lucide-react";

const ExerciseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [restTimer, setRestTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerExercise, setTimerExercise] = useState<string | null>(null);

  const exercises = [
    {
      id: 1,
      name: "Press de Banca",
      category: "pecho",
      difficulty: "Intermedio",
      equipment: "Barra",
      primaryMuscles: ["Pectorales"],
      secondaryMuscles: ["Tríceps", "Deltoides anterior"],
      description: "Ejercicio fundamental para el desarrollo del pecho y fuerza de empuje.",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      restTime: 120, // 2 minutos
      instructions: [
        "Acuéstate en el banco con los pies firmemente en el suelo",
        "Agarra la barra con las manos separadas al ancho de los hombros",
        "Baja la barra controladamente hasta tocar el pecho",
        "Empuja la barra hacia arriba hasta la extensión completa"
      ],
      tips: [
        "Mantén los omóplatos retraídos durante todo el movimiento",
        "No rebotes la barra en el pecho",
        "Controla la fase excéntrica (bajada)"
      ]
    },
    {
      id: 2,
      name: "Sentadilla",
      category: "piernas",
      difficulty: "Intermedio",
      equipment: "Barra",
      primaryMuscles: ["Cuádriceps", "Glúteos"],
      secondaryMuscles: ["Isquiotibiales", "Core"],
      description: "El rey de los ejercicios para piernas y fuerza funcional.",
      imageUrl: "https://images.unsplash.com/photo-1566241142230-c05d99cd6b44?w=400&h=300&fit=crop",
      restTime: 180, // 3 minutos
      instructions: [
        "Coloca la barra en la parte superior de la espalda",
        "Separa los pies al ancho de los hombros",
        "Desciende flexionando caderas y rodillas",
        "Sube empujando a través de los talones"
      ],
      tips: [
        "Mantén la espalda recta durante todo el movimiento",
        "Las rodillas deben seguir la dirección de los pies",
        "Desciende hasta que los muslos estén paralelos al suelo"
      ]
    },
    {
      id: 3,
      name: "Peso Muerto",
      category: "espalda",
      difficulty: "Avanzado",
      equipment: "Barra",
      primaryMuscles: ["Erector espinal", "Glúteos"],
      secondaryMuscles: ["Isquiotibiales", "Trapecios", "Dorsales"],
      description: "Ejercicio completo para la cadena posterior y fuerza general.",
      imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=300&fit=crop",
      restTime: 180, // 3 minutos
      instructions: [
        "Colócate frente a la barra con los pies al ancho de caderas",
        "Agarra la barra con las manos fuera de las piernas",
        "Mantén la espalda recta y levanta extendiendo caderas y rodillas",
        "Termina completamente erguido con hombros hacia atrás"
      ],
      tips: [
        "La barra debe mantenerse cerca del cuerpo",
        "Inicia el movimiento con las caderas, no con la espalda",
        "Mantén la cabeza en posición neutra"
      ]
    },
    {
      id: 4,
      name: "Dominadas",
      category: "espalda",
      difficulty: "Intermedio",
      equipment: "Barra de dominadas",
      primaryMuscles: ["Dorsales", "Bíceps"],
      secondaryMuscles: ["Romboides", "Trapecios medios"],
      description: "Excelente ejercicio para desarrollar la fuerza de tracción.",
      imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
      restTime: 90, // 1.5 minutos
      instructions: [
        "Cuelga de la barra con agarre pronado",
        "Separa las manos al ancho de los hombros",
        "Tira del cuerpo hacia arriba hasta que la barbilla pase la barra",
        "Baja controladamente hasta la extensión completa"
      ],
      tips: [
        "Evita balancearte o usar impulso",
        "Inicia el movimiento tirando de los omóplatos hacia abajo",
        "Mantén el core activo durante todo el ejercicio"
      ]
    }
  ];

  // Rest Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(time => time - 1);
      }, 1000);
    } else if (restTimer === 0 && isTimerActive) {
      setIsTimerActive(false);
      setTimerExercise(null);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, restTimer]);

  const startRestTimer = (exerciseName: string, restTime: number) => {
    setRestTimer(restTime);
    setTimerExercise(exerciseName);
    setIsTimerActive(true);
  };

  const pauseTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setRestTimer(0);
    setTimerExercise(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const categories = [
    { id: "all", name: "Todos", count: exercises.length },
    { id: "pecho", name: "Pecho", count: exercises.filter(e => e.category === "pecho").length },
    { id: "espalda", name: "Espalda", count: exercises.filter(e => e.category === "espalda").length },
    { id: "piernas", name: "Piernas", count: exercises.filter(e => e.category === "piernas").length },
    { id: "hombros", name: "Hombros", count: exercises.filter(e => e.category === "hombros").length },
    { id: "brazos", name: "Brazos", count: exercises.filter(e => e.category === "brazos").length }
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Principiante": return "bg-green-100 text-green-800";
      case "Intermedio": return "bg-yellow-100 text-yellow-800";
      case "Avanzado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Rest Timer Display */}
      {timerExercise && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">Descanso - {timerExercise}</p>
                  <p className="text-sm text-gray-600">Tiempo restante</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-orange-600">
                  {formatTime(restTimer)}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={pauseTimer}
                  >
                    {isTimerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetTimer}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Biblioteca de Ejercicios
          </CardTitle>
          <CardDescription>
            Explora ejercicios con instrucciones detalladas y consejos técnicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar ejercicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExercises.map(exercise => (
          <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
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
                  Agregar a Rutina
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => startRestTimer(exercise.name, exercise.restTime)}
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
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron ejercicios</h3>
            <p className="text-gray-600">Intenta con diferentes términos de búsqueda o categorías</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExerciseLibrary;
