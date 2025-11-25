const API_URL = 
const API_KEY = "AIzaSyDiNLycjfhyGMVlttDt-O30hNYu8Rbr-sY"; 

export async function sendMessageToAI(message, conversationHistory, chatMode = 'general') {
  try {
    const systemPrompt = getSystemPrompt(chatMode);
    
    const safeHistory = conversationHistory || [];
    
    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      {
        role: "model", 
        parts: [{ text: "Entendido. Estoy listo para ayudarte como asistente de salud especializado." }]
      }
    ];

    
    const recentHistory = safeHistory.slice(-10);
    
    recentHistory.forEach(msg => {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });

    
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error en la respuesta de la API:", errorData);
      throw new Error(errorData.error?.message || "Error al conectar con la IA.");
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No hubo respuesta de la IA.";
  } catch (error) {
    console.error("Hubo un problema al enviar el mensaje:", error);
    throw error;
  }
}

function getSystemPrompt(chatMode) {
  const prompts = {
    general: `Eres un asistente de salud especializado en diabetes y cuidado metabólico. 
              Proporciona información veraz, útil y compasiva. 
              Siempre aclara que no reemplazas la consulta médica profesional.
              Sé claro y conciso en tus respuestas.`,

    nutrition: `Eres un nutricionista especializado en diabetes. Enfócate en 
                recomendaciones dietéticas, control de carbohidratos, índices glucémicos
                y planificación de comidas. Proporciona opciones prácticas y realistas.`,

    glucose: `Eres un experto en control glucémico. Ayuda con interpretación de 
              mediciones, factores que afectan la glucosa, hipoglucemia, hiperglucemia
              y estrategias para mantener niveles estables.`
  };

  return prompts[chatMode] || prompts.general;
}
