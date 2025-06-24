
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, chatHistory } = await req.json();
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Prepare context for fitness coaching
    const systemPrompt = `Eres un entrenador personal AI especializado en fitness y nutrición. 
    Tienes acceso a los datos de progreso del usuario y debes dar consejos personalizados.
    
    Características de tu personalidad:
    - Motivador y positivo
    - Basado en ciencia y evidencia
    - Adaptable a diferentes niveles de fitness
    - Enfocado en resultados sostenibles
    - Especialista en rutinas de gym, calistenia y nutrición
    
    Siempre responde en español y mantén un tono profesional pero amigable.`;

    // Format chat history for Gemini
    const conversationHistory = chatHistory.map((chat: any) => ({
      role: chat.type === 'user' ? 'user' : 'model',
      parts: [{ text: chat.message }]
    }));

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        ...conversationHistory,
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };

    console.log('Calling Gemini API with:', JSON.stringify(requestBody, null, 2));

    // Updated to use gemini-1.5-flash instead of gemini-pro
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return new Response(
      JSON.stringify({ 
        message: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
