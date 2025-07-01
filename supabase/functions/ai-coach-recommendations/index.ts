
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
    const { exerciseName, exerciseHistory, analytics } = await req.json()
    
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
Como un entrenador personal experto, analiza el progreso del siguiente ejercicio y proporciona recomendaciones específicas:

EJERCICIO: ${exerciseName}

HISTORIAL RECIENTE (últimas 5 series):
${exerciseHistory.map((set: any, index: number) => 
  `Serie ${index + 1}: ${set.reps} reps × ${set.weight_kg}kg${set.rpe ? ` (RPE ${set.rpe})` : ''} - ${new Date(set.created_at).toLocaleDateString()}`
).join('\n')}

ANÁLISIS DE PROGRESO (últimos 30 días):
- Peso máximo: ${analytics.maxWeight}kg
- Repeticiones máximas: ${analytics.maxReps}
- Volumen total: ${analytics.totalVolume}kg
- Tendencia de peso: ${analytics.weightTrend > 0 ? '+' : ''}${analytics.weightTrend.toFixed(1)}kg
- Días entrenados: ${analytics.workoutFrequency}
- RPE promedio: ${analytics.avgRPE ? analytics.avgRPE.toFixed(1) : 'No registrado'}

INSTRUCCIONES:
1. Analiza la progresión del peso y las repeticiones
2. Considera el RPE para evaluar la intensidad
3. Proporciona una recomendación de peso específica para la próxima serie
4. Sugiere un rango de repeticiones apropiado
5. Explica tu razonamiento
6. Da notas sobre el progreso observado
7. Incluye un mensaje motivacional personalizado

Responde ÚNICAMENTE en formato JSON válido con esta estructura:
{
  "exerciseName": "${exerciseName}",
  "suggestedWeight": [número con decimales permitidos],
  "suggestedReps": "[rango como '8-10' o número específico]",
  "reasoning": "[explicación detallada de por qué sugieres estos valores]",
  "progressNotes": "[observaciones sobre el progreso del usuario]",
  "motivationalMessage": "[mensaje personalizado y motivador]"
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Intentar parsear la respuesta JSON
    let recommendation
    try {
      recommendation = JSON.parse(text)
    } catch (parseError) {
      // Si falla el parsing, crear una respuesta de fallback
      recommendation = {
        exerciseName,
        suggestedWeight: analytics.maxWeight || 0,
        suggestedReps: "8-12",
        reasoning: "Error al procesar la recomendación de IA. Usar último peso registrado.",
        progressNotes: "Análisis automático no disponible",
        motivationalMessage: "¡Sigue entrenando con constancia!"
      }
    }

    return new Response(
      JSON.stringify(recommendation),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in ai-coach-recommendations:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Error al generar recomendaciones',
        details: error.message 
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
