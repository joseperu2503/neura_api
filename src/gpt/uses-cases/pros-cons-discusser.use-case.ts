import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDiscusserUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
          Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
          la respuesta debe de ser en formato markdown,
          los pros y contras deben de estar en una lista.
        `,
      },
      { role: 'user', content: prompt },
    ],
    model: 'deepseek-chat',
    temperature: 0.8,
    max_tokens: 500,
  });

  // console.log(completion);

  return completion.choices[0].message;
};
