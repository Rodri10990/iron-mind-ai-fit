import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Brain, 
  Send, 
  Lightbulb, 
  Target, 
  TrendingUp,
  MessageCircle,
  Zap,
  Calendar,
  Loader2
} from "lucide-react";

interface ChatMessage {
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

const AICoach = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: "ai",
      message: "¡Hola! Soy tu entrenador personal AI powered by Google Gemini. Estoy aquí para ayudarte con rutinas personalizadas, consejos de técnica, nutrición y motivación. ¿En qué puedo ayudarte hoy?",
      timestamp: "10:30"
    }
  ]);

  const recommendations = [
    {
      title: "Descanso Insuficiente",
      description: "Has entrenado 5 días consecutivos. Te recomiendo tomar 1-2 días de descanso.",
      type: "warning",
      icon: Calendar,
      priority: "Alta"
    },
    {
      title: "Progresión en Sentadilla",
      description: "Tu sentadilla no ha progresado en 2 semanas. Intenta reducir el peso 10% y enfócate en la técnica.",
      type: "improvement",
      icon: TrendingUp,
      priority: "Media"
    },
    {
      title: "Balance Muscular",
      description: "Estás trabajando poco la espalda comparado con el pecho. Aumenta el volumen de jalones.",
      type: "balance",
      icon: Target,
      priority: "Media"
    },
    {
      title: "Nuevo PR Predicho",
      description: "Según tu progreso, podrías intentar 77.5kg en press de banca la próxima semana.",
      type: "achievement",
      icon: Zap,
      priority: "Baja"
    }
  ];

  const quickQuestions = [
    "¿Qué rutina me recomiendas para esta semana?",
    "¿Cómo puedo mejorar mi técnica en peso muerto?",
    "¿Debería aumentar mi volumen de entrenamiento?",
    "¿Qué ejercicios accesorios me recomiendas?"
  ];

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message;
    setMessage("");
    setIsLoading(true);
    
    // Add user message to chat
    const newUserMessage: ChatMessage = {
      type: "user",
      message: userMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatHistory(prev => [...prev, newUserMessage]);
    
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: userMessage,
          chatHistory: chatHistory
        }
      });

      if (error) {
        console.error('Error calling gemini-chat function:', error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        type: "ai",
        message: data.message || "Lo siento, no pude procesar tu mensaje.",
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "No pude enviar tu mensaje. Por favor intenta de nuevo.",
        variant: "destructive",
      });
      
      // Add error message to chat
      setChatHistory(prev => [...prev, {
        type: "ai",
        message: "Lo siento, hubo un problema al procesar tu mensaje. Por favor intenta de nuevo.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "warning": return "border-red-200 bg-red-50";
      case "improvement": return "border-yellow-200 bg-yellow-50";
      case "balance": return "border-blue-200 bg-blue-50";
      case "achievement": return "border-green-200 bg-green-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-100 text-red-800";
      case "Media": return "bg-yellow-100 text-yellow-800";
      case "Baja": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recommendations Panel */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Recomendaciones AI
            </CardTitle>
            <CardDescription>
              Análisis automático basado en tu progreso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, index) => {
              const IconComponent = rec.icon;
              return (
                <div key={index} className={`p-3 rounded-lg border ${getRecommendationColor(rec.type)}`}>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-white rounded">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{rec.title}</span>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{rec.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full text-left justify-start h-auto p-2 text-xs"
                onClick={() => setMessage(question)}
              >
                {question}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Chat con tu Entrenador AI
              <Badge variant="outline" className="ml-auto text-xs bg-green-50 text-green-700 border-green-200">
                Powered by Gemini
              </Badge>
            </CardTitle>
            <CardDescription>
              Pregúntame sobre rutinas, técnica, progreso o cualquier duda sobre entrenamiento
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Chat History */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      chat.type === 'user' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">{chat.message}</div>
                      <div className={`text-xs mt-1 ${
                        chat.type === 'user' ? 'text-orange-100' : 'text-gray-500'
                      }`}>
                        {chat.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Tu entrenador AI está pensando...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Pregúntame sobre tu entrenamiento..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={!message.trim() || isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Quick Questions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {quickQuestions.slice(0, 2).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setMessage(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>

            {/* AI Status */}
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI Entrenador activo • Powered by Google Gemini</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICoach;
