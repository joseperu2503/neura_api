import { GoogleGenAI } from '@google/genai';

export interface TriviaAnswer {
  question: string;
  answers: string[];
  correct: number;
}

export const generateQuiz = async (ai: GoogleGenAI, prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      systemInstruction: `
        Eres un generador de trivias.

        Tu tarea es generar entre 5 y 10 preguntas de conocimiento general sobre el tema solicitado, manteniendo el idioma en que se hizo la petición ("${prompt}").

        El resultado debe ser un arreglo JSON con el siguiente formato:

        [
          {
            "question": "Texto de la pregunta",
            "options": [
              "Opción 1",
              "Opción 2",
              "Opción 3",
              "Opción 4"
            ],
            "correct": índice numérico (0-based) de la respuesta correcta
          },
          ...
        ]

        Reglas:
        - Devuelve solo el arreglo JSON, sin texto adicional ni explicaciones.
        - Cada pregunta debe tener una única respuesta correcta.
        - El número de respuestas puede variar (mínimo 3, máximo 5).
        - Incluye una mezcla de preguntas fáciles, medias y difíciles.
        - A veces genera preguntas muy retadoras.
        - Mantén coherencia con el idioma del prompt.
        - No uses formato Markdown ni comillas adicionales fuera del JSON.`,
    },
  });

  const jsonResponse = JSON.parse(response.text ?? '[]');
  return jsonResponse as TriviaAnswer[];
};
