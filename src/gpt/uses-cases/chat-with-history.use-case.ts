import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

export const chatWithHistoryUseCase = async (
  openai: OpenAI,
  messages: ChatCompletionMessageParam[],
) => {
  return await openai.chat.completions.create({
    stream: true,
    messages: messages,
    model: 'deepseek-chat',
  });
};
