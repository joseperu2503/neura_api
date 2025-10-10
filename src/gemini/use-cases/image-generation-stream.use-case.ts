import * as path from 'node:path';

import {
  ContentListUnion,
  createPartFromUri,
  GoogleGenAI,
  Modality,
} from '@google/genai';
import { geminiUploadFiles } from '../helpers/gemini-upload-file';

const AI_IMAGES_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'public/ai-images',
);

export interface ImageGenerationResponse {
  imageUrl: string;
  text: string;
}

export const imageGenerationStreamUseCase = async (
  ai: GoogleGenAI,
  prompt: string,
  files: Express.Multer.File[],
) => {
  const contents: ContentListUnion = [{ text: prompt }];

  const uploadedFiles = await geminiUploadFiles(ai, files, {
    transformToPng: true,
  });

  uploadedFiles.forEach((file) => {
    contents.push(createPartFromUri(file.uri ?? '', file.mimeType ?? ''));
  });

  const model = 'gemini-2.0-flash-exp-image-generation';

  return ai.models.generateContentStream({
    model: model,
    contents: contents,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });
};
