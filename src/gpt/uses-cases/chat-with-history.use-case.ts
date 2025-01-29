import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

interface Options {
  messages: ChatCompletionMessageParam[];
}

export const chatWithHistoryUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { messages } = options;

  const completion = await openai.chat.completions.create({
    messages: messages,
    model: 'deepseek-chat',
  });

  const response: string =
    completion.choices[0]?.message?.content || 'No response';

  return response;
};
