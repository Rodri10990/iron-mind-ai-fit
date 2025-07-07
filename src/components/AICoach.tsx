import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { workoutPlanService, WorkoutPlanData } from "@/services/workoutPlanService";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Brain, 
  Send, 
  Lightbulb, 
  Target, 
  TrendingUp,
  MessageCircle,
  Zap,
  Calendar,
  Loader2,
  Plus,
  CheckCircle2,
  Trash2
} from "lucide-react";

interface ChatMessage {
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

const AICoach = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { toast } = useToast();
  const { chatHistory, setChatHistory, addMessage, clearHistory } = useChatHistory();
  const isMobile = useIsMobile();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Handle virtual keyboard detection for mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        const currentHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const keyboardHeight = windowHeight - currentHeight;
        
        setKeyboardHeight(keyboardHeight);
        setIsKeyboardVisible(keyboardHeight > 150); // Threshold for keyboard detection
        
        // Scroll to input when keyboard appears
        if (keyboardHeight > 150 && inputRef.current) {
          setTimeout(() => {
            inputRef.current?.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'nearest',
              inline: 'nearest'
            });
          }, 100);
        }
      }
    };

    // Fallback for browsers without visualViewport
    const handleResize = () => {
      if (!window.visualViewport) {
        const currentHeight = window.innerHeight;
        const documentHeight = document.documentElement.clientHeight;
        const keyboardHeight = documentHeight - currentHeight;
        
        setKeyboardHeight(Math.max(0, keyboardHeight));
        setIsKeyboardVisible(keyboardHeight > 150);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [isMobile]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatHistory]);

  // Handle input focus for mobile
  const handleInputFocus = () => {
    if (isMobile) {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
    }
  };

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
    "Crea un plan de entrenamiento personalizado"
  ];

  const parseWorkoutPlanFromResponse = (response: string): WorkoutPlanData | null => {
    try {
      // Look for workout plan structure in the response
      const lines = response.split('\n');
      let planName = '';
      let difficulty = 'Intermedio';
      let duration_weeks = 4;
      let sessions_per_week = 3;
      let description = '';
      const exercises: WorkoutPlanData['exercises'] = [];
      
      let currentDay = 0;
      let exerciseIndex = 0;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Extract plan name from headers
        if (trimmedLine.includes('Plan de Entrenamiento') || trimmedLine.includes('**Plan')) {
          planName = trimmedLine.replace(/\*\*/g, '').replace('Plan de Entrenamiento', '').replace(':', '').trim();
          if (!planName) planName = 'Plan Personalizado AI';
        }
        
        // Extract difficulty
        if (trimmedLine.toLowerCase().includes('avanzado')) {
          difficulty = 'Avanzado';
        } else if (trimmedLine.toLowerCase().includes('principiante')) {
          difficulty = 'Principiante';
        }
        
        // Extract day information
        if (trimmedLine.includes('Día') && (trimmedLine.includes(':') || trimmedLine.includes('1') || trimmedLine.includes('2') || trimmedLine.includes('3'))) {
          const dayMatch = trimmedLine.match(/Día\s*(\d+)/);
          if (dayMatch) {
            currentDay = parseInt(dayMatch[1]);
            exerciseIndex = 0;
          }
        }
        
        // Extract exercises (look for patterns like "* Exercise:" or "- Exercise:")
        if (currentDay > 0 && (trimmedLine.startsWith('*') || trimmedLine.startsWith('-')) && trimmedLine.includes(':')) {
          const exerciseMatch = trimmedLine.match(/[\*\-]\s*\*\*(.*?)\*\*:?\s*(.*)/) || 
                               trimmedLine.match(/[\*\-]\s*(.*?):\s*(.*)/);
          
          if (exerciseMatch) {
            const exerciseName = exerciseMatch[1].trim();
            const setsRepsInfo = exerciseMatch[2].trim();
            
            // Parse sets and reps
            let sets = 3;
            let reps = '8-12';
            let rest_seconds = 120;
            
            const setsMatch = setsRepsInfo.match(/(\d+)x(\d+[-\d]*)/);
            if (setsMatch) {
              sets = parseInt(setsMatch[1]);
              reps = setsMatch[2];
            }
            
            // Handle special cases
            if (setsRepsInfo.includes('fallo')) {
              reps = 'al fallo';
            }
            if (setsRepsInfo.includes('segundos')) {
              const secondsMatch = setsRepsInfo.match(/(\d+)[-\d]*\s*segundos/);
              if (secondsMatch) {
                reps = `${secondsMatch[1]} segundos`;
              }
            }
            
            exercises.push({
              day_number: currentDay,
              exercise_name: exerciseName,
              sets: sets,
              reps: reps,
              rest_seconds: rest_seconds,
              order_index: exerciseIndex
            });
            
            exerciseIndex++;
          }
        }
      }
      
      // Extract sessions per week
      if (response.includes('3 días') || response.includes('3 veces')) {
        sessions_per_week = 3;
      } else if (response.includes('4 días') || response.includes('4 veces')) {
        sessions_per_week = 4;
      } else if (response.includes('5 días') || response.includes('5 veces')) {
        sessions_per_week = 5;
      }
      
      if (!planName) planName = 'Plan Personalizado AI';
      if (exercises.length === 0) return null;
      
      return {
        name: planName,
        description: `Plan de entrenamiento personalizado creado por tu AI Coach basado en tus objetivos y preferencias.`,
        difficulty,
        duration_weeks,
        sessions_per_week,
        exercises
      };
    } catch (error) {
      console.error('Error parsing workout plan:', error);
      return null;
    }
  };

  const createWorkoutPlan = async (planData: WorkoutPlanData) => {
    setIsCreatingPlan(true);
    try {
      const result = await workoutPlanService.createWorkoutPlan(planData);
      
      if (result.success) {
        toast({
          title: "¡Plan creado exitosamente!",
          description: `El plan "${planData.name}" ha sido agregado a tu biblioteca.`,
        });
        
        // Add success message to chat
        const successMessage: ChatMessage = {
          type: "ai",
          message: `¡Perfecto! He creado y guardado el plan "${planData.name}" en tu biblioteca de entrenamientos. Puedes acceder a él desde la sección "Planes" de la aplicación para comenzar tu entrenamiento cuando quieras.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        addMessage(successMessage);
      } else {
        toast({
          title: "Error al crear el plan",
          description: result.error || "Hubo un problema al guardar el plan.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating workout plan:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al crear el plan de entrenamiento.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPlan(false);
    }
  };

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
    
    addMessage(newUserMessage);
    
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

      const aiResponse = data.message || "Lo siento, no pude procesar tu mensaje.";

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        type: "ai",
        message: aiResponse,
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      addMessage(aiMessage);

      // Check if the response contains a workout plan and if user wants to save it
      const workoutPlan = parseWorkoutPlanFromResponse(aiResponse);
      if (workoutPlan && (userMessage.toLowerCase().includes('crear') || userMessage.toLowerCase().includes('plan') || userMessage.toLowerCase().includes('rutina'))) {
        // Add a follow-up message asking if they want to save the plan
        const followUpMessage: ChatMessage = {
          type: "ai",
          message: "¿Te gustaría que guarde este plan de entrenamiento en tu biblioteca para que puedas usarlo en la aplicación?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setTimeout(() => {
          addMessage(followUpMessage);
        }, 1000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "No pude enviar tu mensaje. Por favor intenta de nuevo.",
        variant: "destructive",
      });
      
      // Add error message to chat
      addMessage({
        type: "ai",
        message: "Lo siento, hubo un problema al procesar tu mensaje. Por favor intenta de nuevo.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlanFromLastResponse = async () => {
    const lastAiMessage = chatHistory.filter(msg => msg.type === 'ai').pop();
    if (!lastAiMessage) return;
    
    const workoutPlan = parseWorkoutPlanFromResponse(lastAiMessage.message);
    if (workoutPlan) {
      await createWorkoutPlan(workoutPlan);
    } else {
      toast({
        title: "No se pudo crear el plan",
        description: "No encontré información suficiente del plan en la conversación.",
        variant: "destructive",
      });
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
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 ${isMobile ? 'h-screen overflow-hidden' : ''}`}>
      {/* Recommendations Panel */}
      <div className={`lg:col-span-1 space-y-3 md:space-y-4 ${isMobile ? 'hidden' : ''}`}>
        <Card>
          <CardHeader className="px-3 py-2 md:px-6 md:py-4">
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Lightbulb className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
              Recomendaciones AI
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Análisis automático basado en tu progreso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3 px-3 pb-3 md:px-6 md:pb-6">
            {recommendations.map((rec, index) => {
              const IconComponent = rec.icon;
              return (
                <div key={index} className={`p-2 md:p-3 rounded-lg border ${getRecommendationColor(rec.type)}`}>
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="p-1 bg-white rounded flex-shrink-0">
                      <IconComponent className="h-3 w-3 md:h-4 md:w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 md:gap-2 mb-1">
                        <span className="font-medium text-xs md:text-sm">{rec.title}</span>
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
          <CardHeader className="px-3 py-2 md:px-6 md:py-4">
            <CardTitle className="text-xs md:text-sm">Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 md:space-y-2 px-3 pb-3 md:px-6 md:pb-6">
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
      <div className="lg:col-span-2" ref={chatContainerRef}>
        <Card 
          className={`${
            isMobile 
              ? `h-[calc(100vh-120px)] ${isKeyboardVisible ? 'h-[calc(100vh-120px-env(keyboard-inset-height,0px))]' : ''}`
              : 'h-[500px] md:h-[600px]'
          } flex flex-col`}
          style={isMobile && isKeyboardVisible ? { 
            maxHeight: `calc(100vh - 120px - ${keyboardHeight}px)`,
            transition: 'max-height 0.3s ease-in-out' 
          } : {}}
        >
          <CardHeader className="px-3 py-2 md:px-6 md:py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <Brain className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                Chat con tu Entrenador AI
                <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                  Powered by Gemini
                </Badge>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={clearHistory}
                className="text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            </div>
            <CardDescription className="text-xs md:text-sm">
              Pregúntame sobre rutinas, técnica, progreso o pídeme que cree un plan personalizado
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col px-3 md:px-6 overflow-hidden">
            {/* Chat History */}
            <ScrollArea 
              ref={scrollAreaRef}
              className="flex-1 pr-2 md:pr-4 -mr-2 md:-mr-4"
              style={{ 
                scrollBehavior: 'smooth',
                overflowAnchor: 'auto'
              }}
            >
              <div className="space-y-3 md:space-y-4 pb-4">
                {chatHistory.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <div className="text-center">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">¡Hola! Soy tu entrenador AI. ¿En qué puedo ayudarte hoy?</p>
                    </div>
                  </div>
                )}
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-lg shadow-sm ${
                      chat.type === 'user' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{chat.message}</div>
                      <div className={`text-xs mt-2 ${
                        chat.type === 'user' ? 'text-orange-100' : 'text-gray-500'
                      }`}>
                        {chat.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 text-sm md:text-base text-gray-600">
                        <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                        Tu entrenador AI está pensando...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <Separator className="my-3 md:my-4 flex-shrink-0" />

            {/* Create Plan Button */}
            {chatHistory.length > 1 && (
              <div className="mb-3 md:mb-4 flex-shrink-0">
                <Button
                  onClick={handleCreatePlanFromLastResponse}
                  disabled={isCreatingPlan}
                  variant="outline"
                  size="sm"
                  className="text-xs bg-green-50 hover:bg-green-100 border-green-200 transition-colors"
                >
                  {isCreatingPlan ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Guardando plan...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Guardar último plan creado
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Input Section - Fixed positioning for mobile */}
            <div 
              className={`flex-shrink-0 ${
                isMobile && isKeyboardVisible ? 'sticky bottom-0 bg-white pt-2 pb-safe' : ''
              }`}
              style={isMobile && isKeyboardVisible ? {
                marginBottom: 'env(safe-area-inset-bottom, 0px)',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
              } : {}}
            >
              {/* Message Input */}
              <div className="flex gap-2 md:gap-3 relative mb-3">
                <Input
                  ref={inputRef}
                  placeholder="Pregúntame sobre tu entrenamiento..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  onFocus={handleInputFocus}
                  className={`flex-1 text-sm md:text-base h-12 md:h-14 pr-14 md:pr-16 rounded-lg transition-all duration-200 ${
                    isMobile ? 'text-[16px]' : '' // Prevent zoom on iOS
                  }`}
                  disabled={isLoading}
                  style={{ 
                    fontSize: isMobile ? '16px' : undefined // Prevent zoom on iOS
                  }}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!message.trim() || isLoading}
                  size="sm"
                  className="h-12 md:h-14 px-4 md:px-5 absolute right-1 top-1/2 transform -translate-y-1/2 rounded-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </Button>
              </div>

              {/* Quick Questions - Only show when keyboard is not visible on mobile */}
              {!(isMobile && isKeyboardVisible) && (
                <div className="flex flex-wrap gap-2 md:gap-3 mb-2">
                  {quickQuestions.slice(0, 2).map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 md:h-9 px-3 rounded-full transition-all duration-200 hover:bg-gray-50"
                      onClick={() => setMessage(question)}
                      disabled={isLoading}
                    >
                      {isMobile && question.length > 25 ? question.substring(0, 25) + '...' : question}
                    </Button>
                  ))}
                </div>
              )}

              {/* AI Status */}
              <div className="flex items-center gap-2 md:gap-3 text-xs text-gray-500 pb-safe">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs md:text-sm">AI Entrenador activo • Powered by Google Gemini</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICoach;
