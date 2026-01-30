import OpenAI from 'openai';

export interface TriviaAnswer {
  question: string;
  answers: string[];
  correct: number;
}

export const generateQuiz = async (openai: OpenAI, prompt: string) => {
  const completion = await openai.chat.completions.create({
    model: 'deepseek-chat',
    response_format: {
      type: 'json_object',
    },
    messages: [
      {
        role: 'system',
        content: `
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
          - No uses formato Markdown ni comillas adicionales fuera del JSON.
        `,
      },
      { role: 'user', content: prompt },
    ],
  });

  const jsonResponse = JSON.parse(
    completion.choices[0].message.content ?? '[]',
  );
  return jsonResponse as TriviaAnswer[];
};
