
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Calendar, Dumbbell, Target, Activity } from "lucide-react";

const ProgressCharts = () => {
  // Mock data para los gráficos
  const weightProgressData = [
    { date: "Sem 1", benchPress: 55, squat: 80, deadlift: 90 },
    { date: "Sem 2", benchPress: 60, squat: 85, deadlift: 95 },
    { date: "Sem 3", benchPress: 62, squat: 87, deadlift: 100 },
    { date: "Sem 4", benchPress: 65, squat: 90, deadlift: 105 },
    { date: "Sem 5", benchPress: 67, squat: 92, deadlift: 110 },
    { date: "Sem 6", benchPress: 70, squat: 95, deadlift: 115 },
  ];

  const volumeData = [
    { date: "Lun", volume: 2800 },
    { date: "Mar", volume: 3200 },
    { date: "Mié", volume: 0 },
    { date: "Jue", volume: 2900 },
    { date: "Vie", volume: 3100 },
    { date: "Sáb", volume: 3400 },
    { date: "Dom", volume: 0 },
  ];

  const muscleGroupData = [
    { name: "Pecho", value: 25, color: "#FF6B35" },
    { name: "Espalda", value: 22, color: "#4ECDC4" },
    { name: "Piernas", value: 20, color: "#45B7D1" },
    { name: "Hombros", value: 15, color: "#96CEB4" },
    { name: "Brazos", value: 12, color: "#FFEAA7" },
    { name: "Core", value: 6, color: "#DDA0DD" },
  ];

  const achievements = [
    { 
      title: "Nuevo PR en Press de Banca", 
      value: "75 kg", 
      change: "+5 kg", 
      date: "Hace 2 días",
      trend: "up"
    },
    { 
      title: "Volumen Semanal", 
      value: "18,500 kg", 
      change: "+12%", 
      date: "Esta semana",
      trend: "up"
    },
    { 
      title: "Racha de Entrenamientos", 
      value: "12 días", 
      change: "Récord personal", 
      date: "Actual",
      trend: "up"
    },
    { 
      title: "Peso Corporal", 
      value: "72.5 kg", 
      change: "-0.8 kg", 
      date: "Este mes",
      trend: "down"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Achievements Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((achievement, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${achievement.trend === 'up' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {achievement.trend === 'up' ? (
                    <TrendingUp className={`h-4 w-4 ${achievement.trend === 'up' ? 'text-green-600' : 'text-blue-600'}`} />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <Badge variant={achievement.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                  {achievement.change}
                </Badge>
              </div>
              <div>
                <div className="text-2xl font-bold">{achievement.value}</div>
                <div className="text-sm text-gray-600">{achievement.title}</div>
                <div className="text-xs text-gray-500 mt-1">{achievement.date}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="strength" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="strength">Fuerza</TabsTrigger>
          <TabsTrigger value="volume">Volumen</TabsTrigger>
          <TabsTrigger value="distribution">Distribución</TabsTrigger>
        </TabsList>

        <TabsContent value="strength" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Progreso de Fuerza (Últimas 6 semanas)
              </CardTitle>
              <CardDescription>
                Evolución de tu 1RM estimado en ejercicios principales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [`${value} kg`, name === 'benchPress' ? 'Press de Banca' : name === 'squat' ? 'Sentadilla' : 'Peso Muerto']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="benchPress" 
                      stroke="#FF6B35" 
                      strokeWidth={3}
                      dot={{ fill: '#FF6B35', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="squat" 
                      stroke="#4ECDC4" 
                      strokeWidth={3}
                      dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="deadlift" 
                      stroke="#45B7D1" 
                      strokeWidth={3}
                      dot={{ fill: '#45B7D1', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Press de Banca</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                  <span className="text-sm">Sentadilla</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Peso Muerto</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Volumen de Entrenamiento Semanal
              </CardTitle>
              <CardDescription>
                Volumen total levantado por día (kg × repeticiones)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} kg`, 'Volumen']}
                    />
                    <Bar 
                      dataKey="volume" 
                      fill="#FF6B35"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">21,400</div>
                  <div className="text-sm text-gray-600">kg Esta Semana</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">19,100</div>
                  <div className="text-sm text-gray-600">kg Semana Pasada</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">+12%</div>
                  <div className="text-sm text-gray-600">Mejora</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Distribución por Grupo Muscular
              </CardTitle>
              <CardDescription>
                Porcentaje de volumen de entrenamiento por grupo muscular este mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="h-80 w-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={muscleGroupData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {muscleGroupData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Volumen']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {muscleGroupData.map((group, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: group.color }}
                      ></div>
                      <span className="text-sm font-medium w-16">{group.name}</span>
                      <span className="text-sm text-gray-600">{group.value}%</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            backgroundColor: group.color, 
                            width: `${group.value}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressCharts;
