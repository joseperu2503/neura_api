import OpenAI from 'openai';
import { QuestionParams } from 'src/common/intefaces/question-params';

export const explainAnswerUseCase = async (
  openai: OpenAI,
  question: QuestionParams,
  answer: number,
) => {
  return await openai.chat.completions.create({
    model: 'deepseek-chat',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `
          Tu tarea es ofrecer una explicación breve y clara sobre la respuesta correcta de una pregunta de trivia.
          
          Reglas:
          - Responde únicamente en el mismo idioma que la pregunta.
          - No digas si la respuesta del usuario es correcta o incorrecta.
          - Explica de forma sencilla por qué la respuesta correcta lo es.
          - No uses formato Markdown ni ningún tipo de marcado.
          - Sé conciso (2 a 4 oraciones máximo).
        `,
      },
      {
        role: 'user',
        content: `
          Pregunta: ${question.question}
          Opciones: ${question.options.join(', ')}
          Respuesta correcta: ${question.options[question.correct]}
          Respuesta del usuario: ${question.options[answer]}
        `,
      },
    ],
  });
};
