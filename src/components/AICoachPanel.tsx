
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  MessageSquare, 
  Sparkles,
  Loader2
} from "lucide-react";
import { aiCoachService, AIRecommendation } from "@/services/aiCoachService";
import { useToast } from "@/hooks/use-toast";

const AICoachPanel = () => {
  const [exerciseName, setExerciseName] = useState("");
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [progressAnalysis, setProgressAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const { toast } = useToast();

  const getRecommendation = async () => {
    if (!exerciseName.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el nombre de un ejercicio",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const rec = await aiCoachService.getWeightRecommendation(exerciseName.trim());
      setRecommendation(rec);
      
      if (rec) {
        toast({
          title: "Recomendación generada",
          description: "Tu AI Coach ha analizado tu progreso",
        });
      }
    } catch (error) {
      console.error('Error getting recommendation:', error);
      toast({
        title: "Error",
        description: "No se pudo obtener la recomendación. Verifica tu conexión.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getProgressAnalysis = async () => {
    if (!exerciseName.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el nombre de un ejercicio",
        variant: "destructive"
      });
      return;
    }

    try {
      setAnalysisLoading(true);
      const analysis = await aiCoachService.getProgressAnalysis(exerciseName.trim());
      setProgressAnalysis(analysis);
    } catch (error) {
      console.error('Error getting analysis:', error);
      toast({
        title: "Error",
        description: "No se pudo obtener el análisis de progreso",
        variant: "destructive"
      });
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Coach Personal
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Sparkles className="h-3 w-3 mr-1" />
              Gemini Pro
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Obtén recomendaciones personalizadas basadas en tu historial de entrenamientos
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Nombre del ejercicio (ej: Press de banca)"
                onKeyPress={(e) => e.key === 'Enter' && getRecommendation()}
              />
              <Button 
                onClick={getRecommendation}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Target className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={getRecommendation}
                disabled={loading}
                className="w-full"
              >
                <Target className="h-4 w-4 mr-2" />
                Recomendación de Peso
              </Button>
              
              <Button 
                variant="outline" 
                onClick={getProgressAnalysis}
                disabled={analysisLoading}
                className="w-full"
              >
                {analysisLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <TrendingUp className="h-4 w-4 mr-2" />
                )}
                Análisis de Progreso
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendación de peso */}
      {recommendation && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Target className="h-5 w-5" />
              Recomendación para {recommendation.exerciseName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-purple-50">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">
                      {recommendation.suggestedWeight}kg
                    </p>
                    <p className="text-sm text-purple-700">Peso sugerido</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {recommendation.suggestedReps}
                    </p>
                    <p className="text-sm text-blue-700">Repeticiones</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4" />
                  Razonamiento
                </h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {recommendation.reasoning}
                </p>
              </div>

              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  Notas de Progreso
                </h4>
                <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                  {recommendation.progressNotes}
                </p>
              </div>

              <div>
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4" />
                  Mensaje Motivacional
                </h4>
                <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg font-medium">
                  {recommendation.motivationalMessage}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análisis de progreso */}
      {progressAnalysis && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="h-5 w-5" />
              Análisis de Progreso - {exerciseName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 bg-green-50 p-4 rounded-lg">
                {progressAnalysis}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información sobre el AI Coach */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Brain className="h-6 w-6 text-purple-600 mt-1" />
            <div>
              <h3 className="font-medium text-purple-800 mb-2">¿Cómo funciona tu AI Coach?</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Analiza tu historial completo de entrenamientos</li>
                <li>• Considera tu progresión de peso, repeticiones y RPE</li>
                <li>• Usa algoritmos avanzados de Gemini Pro para recomendaciones precisas</li>
                <li>• Se adapta a tu nivel de experiencia y objetivos</li>
                <li>• Proporciona motivación personalizada basada en tu progreso</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICoachPanel;
