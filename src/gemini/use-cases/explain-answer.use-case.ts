import { GoogleGenAI } from '@google/genai';
import { QuestionParams } from 'src/common/intefaces/question-params';

export const explainAnswerUseCase = async (
  ai: GoogleGenAI,
  question: QuestionParams,
  answer: number,
) => {
  const model = 'gemini-2.0-flash';
  const systemInstruction = `
    Tu tarea es ofrecer una explicación breve y clara sobre la respuesta correcta de una pregunta de trivia.
    
    Reglas:
    - Responde únicamente en el mismo idioma que la pregunta.
    - No digas si la respuesta del usuario es correcta o incorrecta.
    - Explica de forma sencilla por qué la respuesta correcta lo es.
    - No uses formato Markdown ni ningún tipo de marcado.
    - Sé conciso (2 a 4 oraciones máximo).
  `;

  const prompt = `
    Pregunta: ${question.question}
    Opciones: ${question.options.join(', ')}
    Respuesta correcta: ${question.options[question.correct]}
    Respuesta del usuario: ${question.options[answer]}
  `;

  return ai.models.generateContentStream({
    model,
    contents: prompt,
    config: {
      systemInstruction,
    },
  });
};
