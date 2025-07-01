
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Trophy, Target, Zap, Calendar } from "lucide-react";
import { workoutHistoryService } from "@/services/workoutHistoryService";
import { enhancedAiCoachService } from "@/services/enhancedAiCoachService";

interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'milestone' | 'tip';
  icon: React.ReactNode;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    generateNotifications();
  }, []);

  const generateNotifications = async () => {
    const newNotifications: Notification[] = [];
    
    try {
      // Verificar logros recientes
      const recentSessions = await workoutHistoryService.getUserWorkoutSessions(7);
      const completedThisWeek = recentSessions.filter(s => s.completed_at).length;
      
      if (completedThisWeek >= 3) {
        newNotifications.push({
          id: 'weekly-goal',
          type: 'achievement',
          icon: <Trophy className="h-4 w-4" />,
          title: '¡Meta Semanal Alcanzada!',
          message: `Has completado ${completedThisWeek} entrenamientos esta semana. ¡Excelente constancia!`,
          timestamp: new Date(),
          read: false,
          priority: 'high'
        });
      }

      // Verificar si hace mucho que no entrena
      const lastWorkout = recentSessions[0];
      if (lastWorkout) {
        const daysSinceLastWorkout = Math.floor(
          (Date.now() - new Date(lastWorkout.started_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceLastWorkout >= 3) {
          newNotifications.push({
            id: 'comeback-reminder',
            type: 'reminder',
            icon: <Zap className="h-4 w-4" />,
            title: '¡Te echamos de menos!',
            message: `Han pasado ${daysSinceLastWorkout} días desde tu último entrenamiento. ¿Listo para volver?`,
            timestamp: new Date(),
            read: false,
            priority: 'medium'
          });
        }
      }

      // Generar tip aleatorio
      const tips = [
        'Recuerda hidratarte bien antes, durante y después del entrenamiento.',
        'El descanso entre series es crucial para la recuperación muscular.',
        'Varía tus ejercicios cada 4-6 semanas para evitar estancamiento.',
        'La técnica correcta es más importante que levantar mucho peso.',
        'Anota tu RPE para mejorar la precisión de tus entrenamientos.'
      ];

      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      newNotifications.push({
        id: 'daily-tip',
        type: 'tip',
        icon: <Target className="h-4 w-4" />,
        title: 'Consejo del día',
        message: randomTip,
        timestamp: new Date(),
        read: false,
        priority: 'low'
      });

    } catch (error) {
      console.error('Error generating notifications:', error);
    }

    setNotifications(newNotifications);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-green-100 border-green-200 text-green-800';
      case 'reminder': return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'milestone': return 'bg-purple-100 border-purple-200 text-purple-800';
      case 'tip': return 'bg-orange-100 border-orange-200 text-orange-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-white border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Notificaciones</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1 rounded-lg ${getNotificationColor(notification.type)}`}>
                        {notification.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
