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

  return await openai.chat.completions.create({
    stream: true,
    messages: messages,
    model: 'deepseek-chat',
  });
};
