
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { exerciseName, analytics } = await req.json()
    
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
Como un entrenador personal certificado, proporciona un análisis detallado del progreso del siguiente ejercicio:

EJERCICIO: ${exerciseName}

MÉTRICAS DE PROGRESO (últimos 30 días):
- Total de series completadas: ${analytics.totalSets}
- Peso máximo alcanzado: ${analytics.maxWeight}kg
- Repeticiones máximas: ${analytics.maxReps}
- Volumen total acumulado: ${analytics.totalVolume}kg
- Tendencia de peso: ${analytics.weightTrend > 0 ? 'Incremento de ' : analytics.weightTrend < 0 ? 'Reducción de ' : 'Mantenimiento en '}${Math.abs(analytics.weightTrend).toFixed(1)}kg
- Frecuencia de entrenamiento: ${analytics.workoutFrequency} días
- RPE promedio: ${analytics.avgRPE ? analytics.avgRPE.toFixed(1) + '/10' : 'No registrado'}

ÚLTIMAS 5 SERIES:
${analytics.recentSets.map((set: any, index: number) => 
  `${index + 1}. ${set.reps} reps × ${set.weight_kg}kg${set.rpe ? ` (RPE ${set.rpe})` : ''}`
).join('\n')}

Proporciona un análisis comprensivo que incluya:
1. Evaluación general del progreso
2. Puntos fuertes identificados
3. Áreas de mejora
4. Recomendaciones específicas para las próximas sesiones
5. Sugerencias de periodización
6. Consejos para optimizar la recuperación
7. Motivación personalizada basada en los logros

Mantén un tono profesional pero alentador. Sé específico con los números y datos proporcionados.
Responde en español de forma clara y estructurada.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const analysis = response.text()

    return new Response(
      JSON.stringify({ analysis }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in ai-progress-analysis:', error)
    
    return new Response(
      JSON.stringify({ 
        analysis: `Error al generar el análisis de progreso para ${exerciseName}. Por favor, inténtalo más tarde.`,
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
