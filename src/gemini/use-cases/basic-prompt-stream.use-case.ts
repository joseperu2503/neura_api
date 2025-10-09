import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
} from '@google/genai';

import { BasicPromptDto } from '../dto/basic-prompt.dto';
import { geminiUploadFiles } from '../helpers/gemini-upload-file';

interface Options {
  model?: string;
  systemInstruction?: string;
}

export const basicPromptStreamUseCase = async (
  ai: GoogleGenAI,
  basicPromptDto: BasicPromptDto,
  options?: Options,
) => {
  const { prompt, files = [] } = basicPromptDto;
  const images = await geminiUploadFiles(ai, files);

  const {
    model = 'gemini-2.0-flash-exp-image-generation',
    systemInstruction = `
     
  `,
  } = options ?? {};

  const response = await ai.models.generateContentStream({
    model: model,
    // contents: basicPromptDto.prompt,
    contents: [
      createUserContent([
        prompt,
        // Imágenes o archivos
        // createPartFromUri(image.uri ?? '', image.mimeType ?? ''),
        ...images.map((image) =>
          createPartFromUri(image.uri!, image.mimeType!),
        ),
      ]),
    ],
    config: {
      systemInstruction: systemInstruction,
    },
  });

  return response;
};
