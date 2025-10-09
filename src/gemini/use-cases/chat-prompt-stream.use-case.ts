import { Content, createPartFromUri, GoogleGenAI } from '@google/genai';
import { geminiUploadFiles } from '../helpers/gemini-upload-file';

interface Options {
  model?: string;
  systemInstruction?: string;
}

export const chatPromptStreamUseCase = async (
  ai: GoogleGenAI,
  prompt: string,
  files: Express.Multer.File[],
  history: Content[],
  options?: Options,
) => {
  const uploadedFiles = await geminiUploadFiles(ai, files);

  const { model = 'gemini-2.0-flash', systemInstruction = `` }: Options =
    options ?? {};

  console.log(uploadedFiles);

  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: systemInstruction,
    },
    history: history,
  });

  return chat.sendMessageStream({
    message: [
      prompt,
      ...uploadedFiles.map((file) =>
        createPartFromUri(file.uri ?? '', file.mimeType ?? ''),
      ),
    ],
  });
};
